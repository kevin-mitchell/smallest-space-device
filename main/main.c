#include <stdio.h>
#include <string.h>
#include "secrets.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/gpio.h"
#include "esp_log.h"
#include "house_control.h"
#include "nvs_flash.h"
#include "esp_http_client.h"
#include "wifi_connect.h"
#include "hue_http.h"
#include "freertos/semphr.h"

SemaphoreHandle_t mutex_current_light_status;

// Enabled / Green LED
#define ENABLED_PIN 6

// Disabled / Red LED
#define DISABLED_PIN 7

#define ENABLED_PIN_BACK 40
#define DISABLED_PIN_BACK 41

hue_house_status_t *house_status;
uint8_t current_light_on_off_status[8] = {0};
char hue_base_station_ip[40] = {0};
char hue_base_station_api_key[64] = {0};
QueueHandle_t hue_update_light_request_queue;

// this is a config object that contains things needed by various Hue functions
hue_stream_config_t hue_stream_config;

void print_memory()
{
    ESP_LOGI("memory", "stack %d, total ram %d, internal memory %d, external memory %d\n",
             uxTaskGetStackHighWaterMark(NULL), heap_caps_get_free_size(MALLOC_CAP_8BIT),
             heap_caps_get_free_size(MALLOC_CAP_INTERNAL), heap_caps_get_free_size(MALLOC_CAP_SPIRAM));
}

void send_hue_update_request(void *params)
{
    while (true)
    {
        char request[38] = {0};
        if (xQueueReceive(hue_update_light_request_queue, &request, portMAX_DELAY))
        {
            char group_id[37] = {0};
            strncpy(group_id, request, 36);
            group_id[36] = '\0';
            uint8_t status = request[36] == '1';
            ESP_LOGI("HUE_UPDATE", "Updating light status for group_id: %s to status: %d", group_id, status);
            hue_update_room_light(group_id, status, hue_base_station_ip, hue_base_station_api_key);
        }
    }
}

void update_settings(void *params)
{
    while (true)
    {
        char settings[3] = {0};
        smallest_space_get_remote_config(settings);
        hue_stream_config.controled_enabled = settings[0] == '1';
        hue_stream_config.light_display_enabled = settings[1] == '1';

        // if the light display is turned off, we'll take this opportunity to disable the lights here
        if (xSemaphoreTake(mutex_current_light_status, 1000 / portTICK_PERIOD_MS))
        {

            // if the display is disabled we'll assume we don't want to be annoying so we'll disable the front LEDs on the board
            gpio_set_level(ENABLED_PIN, hue_stream_config.controled_enabled && hue_stream_config.light_display_enabled);
            gpio_set_level(DISABLED_PIN, !hue_stream_config.controled_enabled && hue_stream_config.light_display_enabled);
            gpio_set_level(ENABLED_PIN_BACK, hue_stream_config.controled_enabled);
            gpio_set_level(DISABLED_PIN_BACK, !hue_stream_config.controled_enabled);

            if (!hue_stream_config.light_display_enabled)
            {
                uint8_t temp_lights[8] = {0};
                set_house_lights_struct(temp_lights);
            }
            else
            {
                set_house_lights_struct(current_light_on_off_status);
            }
            xSemaphoreGive(mutex_current_light_status);
        }
        vTaskDelay(pdMS_TO_TICKS(200000));
    }
}

/**
 * Helper, iterates through the house data and finds the room that corresponds to the given pin.
 */
uint8_t get_position_from_grouped_light_id(hue_house_status_t *house_status, char *grouped_light_id)
{
    for (int i = 0; i < house_status->room_count; i++)
    {
        if (strcasecmp(house_status->rooms[i].grouped_light_id, grouped_light_id) == 0)
        {
            return house_status->rooms[i].pin;
        }
    }

    ESP_LOGD("MAIN", "Switch grouped_light_id %s does not have a room assigned to it", grouped_light_id);
    return 99;
}

/**
 * This task will update the light display based on the event data received from the Hue bridge.
 */
void update_lights_from_event(void *queue)
{
    while (true)
    {
        hue_grouped_lights_status_t grouped_lights_status;
        xQueueReceive(queue, &grouped_lights_status, portMAX_DELAY);

        ESP_LOGI("UPDATE", "Received grouped_lights_status from queue with %d updates...", grouped_lights_status.grouped_light_count);

        // special case for situation where the house is disabled
        if (hue_stream_config.light_display_enabled)
        {
            if (xSemaphoreTake(mutex_current_light_status, 1000 / portTICK_PERIOD_MS))
            {

                for (int i = 0; i < grouped_lights_status.grouped_light_count; i++)
                {
                    hue_grouped_light_status_t light_status = grouped_lights_status.rooms[i];
                    ESP_LOGI("UPDATE", "Grouped light %s is %s", light_status.grouped_light_id, light_status.grouped_lights_on ? "on" : "off");
                    uint8_t position = get_position_from_grouped_light_id(house_status, light_status.grouped_light_id);
                    current_light_on_off_status[position] = light_status.grouped_lights_on;
                }
                set_house_lights_struct(current_light_on_off_status);
                xSemaphoreGive(mutex_current_light_status);
            }
        }
        else
        {
            ESP_LOGI("UPDATE", "light display is disabled so light status will not be processed");
        }
    }
}

/**
 * Helper, iterates through the house data and finds the room that corresponds to the given pin.
 */
char *get_room_grouped_light_id_for_position(hue_house_status_t *house_status, int pin)
{
    for (int i = 0; i < house_status->room_count; i++)
    {
        if (house_status->rooms[i].pin == pin)
        {
            return house_status->rooms[i].grouped_light_id;
        }
    }

    ESP_LOGD("MAIN", "Switch pin position %d does not have a room assigned to it", pin);
    return "";
}

/**
 * This is the primary task that actually reads the switches, debounces fast changes, and determines
 * when to notify the Hue bridge of a change via the hue_update_light_request_queue queue.
 */
void check_for_switch_updates(void *params)
{

    // the amount of time between when a person switches a switch and the light turns on
    uint32_t debounce_time = 400;
    uint32_t ms_at_change[8] = {xTaskGetTickCount() * portTICK_PERIOD_MS};
    uint32_t ms_since_changed[8] = {(xTaskGetTickCount() * portTICK_PERIOD_MS)};
    uint8_t changed[8] = {false};
    uint8_t switches_status[8] = {0};
    get_house_switch_statuses_struct(switches_status);

    while (true)
    {

        uint8_t current_switches_status[8] = {0};
        get_house_switch_statuses_struct(current_switches_status);
        for (int i = 0; i < 8; i++)
        {
            // the switches have changed
            if ((switches_status[i] != current_switches_status[i]) && hue_stream_config.controled_enabled == 1)
            {
                if (!changed[i])
                {
                    changed[i] = true;
                    ms_at_change[i] = xTaskGetTickCount() * portTICK_PERIOD_MS;
                    ESP_LOGI("SWITCH", "ms_at_change [%d]: %ld", i, ms_at_change[i]);
                }
                else
                {
                    ms_since_changed[i] = (xTaskGetTickCount() * portTICK_PERIOD_MS) - ms_at_change[i];
                    if (ms_since_changed[i] >= debounce_time)
                    {
                        ESP_LOGI("SWITCH", "ms_since_changed [%d]: %ld", i, ms_since_changed[i]);
                        changed[i] = false;
                        ESP_LOGI("SWITCH", "Switch 1 changed from %d to %d", switches_status[i], current_switches_status[i]);
                        char *group_id = get_room_grouped_light_id_for_position(house_status, i);
                        ESP_LOGI("SWITCH", "Group ID: %s", group_id);
                        switches_status[i] = current_switches_status[i];

                        char request_payload[38] = {0};
                        strncpy(request_payload, group_id, 36);
                        request_payload[36] = current_switches_status[i] ? '1' : '0';
                        ESP_LOGI("SWITCH", "Request payload: %s", request_payload);

                        xQueueSend(hue_update_light_request_queue, &request_payload, portMAX_DELAY);
                    }
                }
            }
        }
        vTaskDelay(pdMS_TO_TICKS(40));
    }
}

void app_main(void)
{
    hue_stream_config.event_grouped_lights_updates_queue = xQueueCreate(10, sizeof(hue_grouped_lights_status_t));
    mutex_current_light_status = xSemaphoreCreateMutex();
    hue_update_light_request_queue = xQueueCreate(15, 38);
    print_memory();
    house_status = malloc(sizeof(hue_house_status_t));
    if (house_status == NULL)
    {
        ESP_LOGE("ERROR", "Failed to allocate memory for house_status");
        return;
    }
    memset(house_status, 0, sizeof(hue_house_status_t));
    house_status->room_count = 0;

    print_memory();

    // this is needed for WiFi to work
    nvs_flash_init();

    // pins need to be reset and set to output for internal pull up / down resistors I believe
    gpio_reset_pin(DISABLED_PIN);
    gpio_reset_pin(ENABLED_PIN);
    gpio_set_direction(ENABLED_PIN, GPIO_MODE_OUTPUT);
    gpio_set_direction(DISABLED_PIN, GPIO_MODE_OUTPUT);

    gpio_reset_pin(DISABLED_PIN_BACK);
    gpio_reset_pin(ENABLED_PIN_BACK);
    gpio_set_direction(ENABLED_PIN_BACK, GPIO_MODE_OUTPUT);
    gpio_set_direction(DISABLED_PIN_BACK, GPIO_MODE_OUTPUT);

    gpio_set_level(ENABLED_PIN, 0);
    gpio_set_level(DISABLED_PIN, 0);
    gpio_set_level(ENABLED_PIN_BACK, 0);
    gpio_set_level(DISABLED_PIN_BACK, 0);

    house_control_init();

    set_house_lights(0xFF);

    wifi_connect_init();
    ESP_ERROR_CHECK(wifi_connect_sta(WIFI_SSID, WIFI_PASSWORD, 10000));

    print_memory();

    // Get the base station IP address
    if (xSemaphoreTake(mutex_current_light_status, pdMS_TO_TICKS(5000)))
    {
        // TODO: uncomment this, but we are aggresively throttled
        // hue_get_base_station_ip(hue_base_station_ip);
        strncpy(hue_base_station_ip, HUE_BASE_STATION_IP, 40);
        strncpy(hue_base_station_api_key, HUE_API_KEY, 64);
        ESP_LOGI("MAIN", "Hue base station IP..: %s", hue_base_station_ip);
        ESP_LOGI("MAIN", "Hue base station API Key..: %s", hue_base_station_api_key);
        xSemaphoreGive(mutex_current_light_status);
    }

    // Get the config from smallest.space
    if (xSemaphoreTake(mutex_current_light_status, pdMS_TO_TICKS(5000)))
    {
        char settings[3] = {0};
        smallest_space_get_remote_config(settings);
        hue_stream_config.controled_enabled = settings[0] == '1';
        hue_stream_config.light_display_enabled = settings[1] == '1';
        ESP_LOGI("MAIN", "Control Enabled: %d - Display Enabled: %d", hue_stream_config.controled_enabled, hue_stream_config.light_display_enabled);
        xSemaphoreGive(mutex_current_light_status);
    }

    // copy the fetched base station IP into the config object we'll use other places
    strncpy(hue_stream_config.hue_base_station_ip, hue_base_station_ip, 40);
    strncpy(hue_stream_config.hue_base_station_api_key, hue_base_station_api_key, 64);

    ESP_LOGI("MAIN", "Hue Stream Config Base Station IP: %s", hue_base_station_ip);
    ESP_LOGI("MAIN", "Hue Stream Config Base Station IP: %s", hue_stream_config.hue_base_station_ip);

    ESP_LOGI("MAIN", "Hue Stream Config Base Station API Key: %s", hue_base_station_api_key);
    ESP_LOGI("MAIN", "Hue Stream Config Base Station API Key: %s", hue_stream_config.hue_base_station_api_key);

    // we are checking this semaphore even though we don't need to, I'm fairly certain, but the reason
    // I am doing it for the moment is because I don't 100% know when something is fully blocking vs when
    // something might be split up across ticks. Basically even though this runs before the events are setup
    // I don't 100% know there isn't a chance that while waiting for a connection, the event stream started
    // and perhaps an event comes in
    if (xSemaphoreTake(mutex_current_light_status, pdMS_TO_TICKS(5000)))
    {
        hue_get_full_house_status(house_status, current_light_on_off_status, hue_base_station_ip, hue_base_station_api_key);
        set_house_lights_struct(current_light_on_off_status);
        xSemaphoreGive(mutex_current_light_status);
    }

    print_memory();

    // print out the house_status
    for (int i = 0; i < house_status->room_count; i++)
    {
        ESP_LOGI("MAIN", "Room %d: %s, %s, %s", i, house_status->rooms[i].room_name, house_status->rooms[i].room_id, house_status->rooms[i].grouped_light_id);
    }

    ESP_LOGI("MAIN", "We are at the end...");

    // TODO: should this have a semaphore around it also?
    xTaskCreate(&hue_http_start, "hue_http_start", 4096, &hue_stream_config, 5, NULL);
    xTaskCreate(&update_lights_from_event, "update_lights_from_event", 4024, hue_stream_config.event_grouped_lights_updates_queue, 5, NULL);
    xTaskCreate(&check_for_switch_updates, "check_for_switch_updates", 4024, NULL, 9, NULL);
    xTaskCreate(&send_hue_update_request, "send_hue_update_request", 4024, NULL, 10, NULL);
    xTaskCreate(&update_settings, "update_settings", 4024, NULL, 5, NULL);

    while (true)
    {
        vTaskDelay(pdMS_TO_TICKS(100000));
    }

    free(house_status);
    house_status = NULL;

    wifi_disconnect();
}
