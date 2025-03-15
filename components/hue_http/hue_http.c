
#include <stdio.h>
#include <string.h>
#include <cJSON.h>
#include "hue_http.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_log.h"
#include "esp_timer.h"
#include "esp_http_client.h"
#include "hue_data_parsers.h"

#define TAG "HUE_HTTP"

#define MAX_HTTP_RECV_BUFFER 500
#define MICROSECONDS_BETWEEN_HUE_HUB_RECONNECT 900 * 1000000

typedef struct
{
    char *buffer;
    int index;
} http_data_t;

esp_http_client_handle_t hue_put_client;

/**
 * This is a map beteween the friendly name we want to search for and the related switch and LED. This is used in a few places, but
 * basically when the Hue API is called and rooms are downloaded the friendly name is used to maps a particular room both to an output
 * LED as well as a switch.
 */
struct room_pin_mapping config_room_pin_map[] = {
    {"living room", 0},
    {"kitchen", 1},
    {"window display", 2},
    {"stair room", 3},
    {"bedroom", 4},
    {"bathroom", 5},
    {"office", 6},
    {"status", 7},
};

esp_err_t on_client_data(esp_http_client_event_t *evt)
{
    switch (evt->event_id)
    {
    case HTTP_EVENT_ON_DATA:
    {
        http_data_t *http_data = evt->user_data;
        http_data->buffer = realloc(http_data->buffer, http_data->index + evt->data_len + 1);
        memcpy(&http_data->buffer[http_data->index], (uint8_t *)evt->data, evt->data_len);
        http_data->index = http_data->index + evt->data_len;
        http_data->buffer[http_data->index] = 0;
    }
    break;

    default:
        break;
    }
    return ESP_OK;
}

esp_err_t on_client_data_put(esp_http_client_event_t *evt)
{
    switch (evt->event_id)
    {
    case HTTP_EVENT_ON_DATA:
    {
        ESP_LOGD(TAG, "HTTP_EVENT_ON_DATA");
        http_data_t *http_data = evt->user_data;
        http_data->buffer = realloc(http_data->buffer, http_data->index + evt->data_len + 1);
        memcpy(&http_data->buffer[http_data->index], (uint8_t *)evt->data, evt->data_len);
        http_data->index = http_data->index + evt->data_len;
        http_data->buffer[http_data->index] = 0;
        ESP_LOGD(TAG, "HTTP PUT Response: %s", http_data->buffer);
    }
    break;

    default:
        break;
    }
    return ESP_OK;
}

void hue_get_full_house_status(hue_house_status_t *house_status, uint8_t *current_light_on_off_status, char *hue_base_station_ip, char *hue_base_station_api_key)
{

    // TODO:     This should NOT be here and is very confusing. It's here just because I know this is called
    //           early, but it should be moved to some sort of init function
    esp_http_client_config_t esp_http_hue_put_client_config = {
        .url = "http://127.0.0.1",
        .method = HTTP_METHOD_PUT,
        .keep_alive_enable = true,
        .keep_alive_idle = 10};
    hue_put_client = esp_http_client_init(&esp_http_hue_put_client_config);

    // get all of the rooms
    // https://192.168.11.10/clip/v2/resource/room
    // get all of the group_lights
    // https://192.168.11.10/clip/v2/resource/grouped_light

    http_data_t http_data = {0};

    char url[150] = {0};
    strcat(url, "https://");
    strcat(url, hue_base_station_ip);
    strcat(url, "/clip/v2/resource/room");

    esp_http_client_config_t esp_http_client_config = {
        // TODO: make dynamic and fetch at startup
        .url = url,
        .method = HTTP_METHOD_GET,
        .event_handler = on_client_data,
        .user_data = &http_data};
    esp_http_client_handle_t client = esp_http_client_init(&esp_http_client_config);
    esp_http_client_set_header(client, "hue-application-key", hue_base_station_api_key);
    esp_http_client_set_header(client, "Contnet-Type", "application/json");
    esp_err_t err = esp_http_client_perform(client);
    if (err != ESP_OK)
    {
        ESP_LOGE(TAG, "HTTP GET request failed: %s", esp_err_to_name(err));
        return;
    }

    parse_hue_rooms(http_data.buffer, house_status, config_room_pin_map, 8);

    esp_http_client_cleanup(client);

    if (http_data.buffer != NULL)
    {
        free(http_data.buffer);
    }

    memset(&http_data, 0, sizeof(http_data_t));

    url[0] = '\0';

    strcat(url, "https://");
    strcat(url, hue_base_station_ip);
    strcat(url, "/clip/v2/resource/grouped_light");

    esp_http_client_config_t esp_http_client_config2 = {
        // TODO: make dynamic and fetch at startup
        .url = url,
        .method = HTTP_METHOD_GET,
        .event_handler = on_client_data,
        .user_data = &http_data};
    client = esp_http_client_init(&esp_http_client_config2);
    esp_http_client_set_header(client, "hue-application-key", hue_base_station_api_key);
    esp_http_client_set_header(client, "Content-Type", "application/json");
    err = esp_http_client_perform(client);
    if (err != ESP_OK)
    {
        ESP_LOGE(TAG, "HTTP GET request failed: %s", esp_err_to_name(err));
        return;
    }

    parse_hue_grouped_lights(http_data.buffer, house_status, current_light_on_off_status);

    esp_http_client_cleanup(client);

    if (http_data.buffer != NULL)
    {
        free(http_data.buffer);
    }
}

void hue_get_base_station_ip(char *hue_base_station_ip)
{
    ESP_LOGI(TAG, "Getting Hue Base Station IP...");
    // get all of the rooms
    // https://192.168.11.10/clip/v2/resource/room
    // get all of the group_lights
    // https://192.168.11.10/clip/v2/resource/grouped_light

    http_data_t http_data = {0};

    esp_http_client_config_t esp_http_client_config = {
        .url = "https://discovery.meethue.com/",
        .method = HTTP_METHOD_GET,
        .event_handler = on_client_data,
        .user_data = &http_data};
    esp_http_client_handle_t client = esp_http_client_init(&esp_http_client_config);
    esp_http_client_set_header(client, "Contnet-Type", "application/json");
    esp_err_t err = esp_http_client_perform(client);
    if (err != ESP_OK)
    {
        ESP_LOGE(TAG, "HTTP GET request failed while getting Hue IP address: %s", esp_err_to_name(err));
        return;
    }

    parse_hue_discovery_response(http_data.buffer, hue_base_station_ip);

    esp_http_client_cleanup(client);

    if (http_data.buffer != NULL)
    {
        free(http_data.buffer);
    }
}

void smallest_space_get_remote_config(char *settings)
{
    ESP_LOGD(TAG, "Getting Smallest Space Remote Config...");
    http_data_t http_data = {0};

    esp_http_client_config_t esp_http_client_config = {
        .url = "https://smallest.space/marionette-house/config.json",
        .method = HTTP_METHOD_GET,
        .event_handler = on_client_data,
        .user_data = &http_data};
    esp_http_client_handle_t client = esp_http_client_init(&esp_http_client_config);
    esp_http_client_set_header(client, "Content-Type", "application/json");
    esp_err_t err = esp_http_client_perform(client);
    if (err != ESP_OK)
    {
        ESP_LOGE(TAG, "HTTP GET request failed: %s", esp_err_to_name(err));
        return;
    }

    char previousValue = settings[0];
    ESP_LOGI(TAG, "Previous value: %c", previousValue);
    ESP_LOGI(TAG, "Control config before parsing: %d - %d", previousValue, settings[0]);
    parse_smallest_space_remote_config_response(http_data.buffer, settings);
    ESP_LOGI(TAG, "Control values after before parsing: %d - %d", previousValue, settings[0]);
    if (previousValue != settings[0] && settings[0] == '1')
    {
        ESP_LOGI(TAG, "Control Switching to Enabled: %d", settings[0]);
    }

    esp_http_client_cleanup(client);

    if (http_data.buffer != NULL)
    {
        free(http_data.buffer);
    }
}

void hue_update_room_light(char *room_id, uint8_t target_state, char *hue_base_station_ip, char *hue_base_station_api_key)
{
    ESP_LOGI(TAG, "Updating room light: room_id=%s, target_state=%d", room_id, target_state);
    // update grouped light
    // https://192.168.11.10/clip/v2/resource/grouped_light/3d49b003-567e-4613-a427-cff8e2becb98

    // if room_id is empty, just return
    if (strlen(room_id) == 0)
    {
        ESP_LOGE(TAG, "Room ID is empty, returning...");
        return;
    }

    char url[150] = {0};
    strcat(url, "https://");
    strcat(url, hue_base_station_ip);
    strcat(url, "/clip/v2/resource/grouped_light/");
    strcat(url, room_id);

    uint32_t ms_since_startup_before_send = xTaskGetTickCount() * portTICK_PERIOD_MS;

    char post_data[120] = "";

    if (target_state == 0)
    {
        strcat(post_data, "{\"on\":{\"on\":false},\"dynamics\": {\"duration\": 0},\"dimming\": {\"brightness\": 100}}");
    }
    else
    {
        strcat(post_data, "{\"on\":{\"on\":true},\"dynamics\": {\"duration\": 0},\"dimming\": {\"brightness\": 100}}");
    }

    ESP_LOGD(TAG, "HTTP PUT Request Data: %s", post_data);
    ESP_LOGD(TAG, "HTTP PUT Request URL: %s", url);

    esp_http_client_set_url(hue_put_client, url);
    esp_http_client_set_post_field(hue_put_client, post_data, strlen(post_data));
    esp_http_client_set_header(hue_put_client, "hue-application-key", hue_base_station_api_key);
    esp_http_client_set_header(hue_put_client, "Content-Type", "application/json");

    uint32_t ms_since_startup_after_client_init = xTaskGetTickCount() * portTICK_PERIOD_MS;
    ESP_LOGD(TAG, "MS for client init: %ld", (ms_since_startup_after_client_init - ms_since_startup_before_send));

    esp_err_t err = esp_http_client_perform(hue_put_client);

    if (err != ESP_OK)
    {
        ESP_LOGE(TAG, "First request failed when updating lights with this error name: %s", esp_err_to_name(err));

        esp_http_client_cleanup(hue_put_client);
        // todo: if cleanup and recreate doesn't work perhaps consider adding a small delay?
        // vTaskDelay(pdMS_TO_TICKS(300));
        esp_http_client_config_t esp_http_hue_put_client_config = {
            .url = url,
            .method = HTTP_METHOD_PUT,
            .keep_alive_enable = true,
            .keep_alive_idle = 10};
        hue_put_client = esp_http_client_init(&esp_http_hue_put_client_config);
        esp_http_client_set_url(hue_put_client, url);
        esp_http_client_set_post_field(hue_put_client, post_data, strlen(post_data));
        esp_http_client_set_header(hue_put_client, "hue-application-key", hue_base_station_api_key);
        esp_http_client_set_header(hue_put_client, "Content-Type", "application/json");
        err = esp_http_client_perform(hue_put_client);

        if (err != ESP_OK)
        {
            ESP_LOGE(TAG, "Second HTTP GET request failed: %s", esp_err_to_name(err));
        }

        return;
    }

    uint32_t ms_since_startup_after_send = xTaskGetTickCount() * portTICK_PERIOD_MS;

    ESP_LOGI(TAG, "Milliseconds for PUT esp_http_client_perform: %ld", (ms_since_startup_after_send - ms_since_startup_after_client_init));

    // note that previous I was calling esp_http_client_cleanup(hue_put_client) but I belive this requires we then recreate the client
    // which is slow... so we'll just not do that!

    ESP_LOGI(TAG, "FINISHED Updating room light: room_id=%s, target_state=%d", room_id, target_state);
}

void hue_http_start(void *data)
{
    hue_stream_config_t hue_stream_config = *(hue_stream_config_t *)data;
    char *buffer = malloc(MAX_HTTP_RECV_BUFFER + 1);
    char *json_data = malloc(10000);

    if (buffer == NULL)
    {
        ESP_LOGE(TAG, "Cannot malloc http receive buffer");
        return;
    }

    http_data_t http_data = {0};
    hue_grouped_lights_status_t grouped_lights_status = {0};
    http_data.index = 0;

    ESP_LOGI(TAG, "IP from parameter: %s", hue_stream_config.hue_base_station_ip);

    char url[150] = {0};
    strcat(url, "https://");
    strcat(url, hue_stream_config.hue_base_station_ip);
    strcat(url, "/eventstream/clip/v2");

    esp_http_client_config_t config = {
        .url = url,
        .method = HTTP_METHOD_GET,
        .keep_alive_enable = true,
    };

    esp_http_client_handle_t client = esp_http_client_init(&config);

    uint64_t time_since_reconnect_to_hue = 0;
    esp_timer_get_time();
    int content_length;
    int read_length;

    while (true)
    {
        if ((time_since_reconnect_to_hue + MICROSECONDS_BETWEEN_HUE_HUB_RECONNECT) < esp_timer_get_time())
        {
            ESP_LOGI(TAG, "If statement condition met, attempting to clean the create new connection");
            esp_http_client_close(client);
            esp_http_client_cleanup(client);
            time_since_reconnect_to_hue = esp_timer_get_time();
            client = esp_http_client_init(&config);
            esp_http_client_set_header(client, "Accept", "text/event-stream");
            esp_http_client_set_header(client, "hue-application-key", hue_stream_config.hue_base_station_api_key);

            ESP_LOGI(TAG, "Opening Connection...");

            esp_err_t err;
            if ((err = esp_http_client_open(client, 0)) != ESP_OK)
            {
                ESP_LOGE(TAG, "Failed to open HTTP connection: %s", esp_err_to_name(err));
                free(buffer);
                return;
            }

            ESP_LOGI(TAG, "Open Connection...");

            content_length = esp_http_client_fetch_headers(client);
            if (content_length > 0)
            {
                ESP_LOGW(TAG, "Unexpected Content-Length: %d", content_length);
            }
            read_length = -1;

            esp_http_client_set_timeout_ms(client, 50);
        }

        read_length = esp_http_client_read(client, buffer, MAX_HTTP_RECV_BUFFER);
        if (read_length > 0)
        {
            http_data.index += read_length;
            http_data.buffer = realloc(http_data.buffer, http_data.index + 1);
            strncpy(&http_data.buffer[http_data.index - read_length], buffer, read_length);
            http_data.buffer[http_data.index] = '\0';

            char *start = strstr(http_data.buffer, "data: [");

            while (start)
            {
                char *end = strstr(start, "]\n\n");
                if (end)
                {
                    start += 6; // Move past the "data: ["
                    end += 1;   // Move past the "]\n\n"
                    int json_length = end - start;
                    // char *json_data = malloc(json_length + 1);
                    memcpy(json_data, start, json_length);
                    json_data[json_length] = '\0';

                    /**
                     * Do something with the json_data
                     */

                    // check if "grouped_light" is in the json because if not for now we dont' care about it
                    // TODO: this is where if we need to care about individual light updates to roll up to a room
                    //        ourselves we'd need to parse other messages as well
                    if (strstr(json_data, "grouped_light"))
                    {
                        ESP_LOGD(TAG, "Received grouped_light update: %s", json_data);

                        parse_hue_event_update(json_data, &grouped_lights_status);
                        if (grouped_lights_status.grouped_light_count > 0)
                        {
                            ESP_LOGD(TAG, "Sending grouped_lights_status to queue with %d updates...", grouped_lights_status.grouped_light_count);
                            xQueueSend(hue_stream_config.event_grouped_lights_updates_queue, &grouped_lights_status, pdMS_TO_TICKS(20));
                        }
                    }

                    int remaining_length = http_data.index - (end - http_data.buffer);
                    memmove(http_data.buffer, end, remaining_length);

                    http_data.index = remaining_length;
                    http_data.buffer = realloc(http_data.buffer, http_data.index + 1);
                    http_data.buffer[http_data.index] = '\0';

                    start = strstr(http_data.buffer, "data: [");
                }
                else
                {
                    break;
                }
            }

            // ESP_LOGI(TAG, "Data so far:\n%s", http_data.buffer);
        }

        vTaskDelay(pdMS_TO_TICKS(100));
    }
    ESP_LOGI(TAG, "HTTP Stream reader Status = %d, content_length = %" PRId64,
             esp_http_client_get_status_code(client),
             esp_http_client_get_content_length(client));
    // esp_http_client_close(client);
    // esp_http_client_cleanup(client);
    free(buffer);
}
