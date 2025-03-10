#ifndef HUE_HTTP_H
#define HUE_HTTP_H

#define MAX_ROOMS 10

typedef struct
{
    char grouped_light_id[37];
    int grouped_lights_on;
} hue_grouped_light_status_t;

typedef struct
{
    // TODO: I'd like this to be of type QueueHandle_t, but I'm not sure how to do that
    void *event_grouped_lights_updates_queue;
    char hue_base_station_ip[40];
    char hue_base_station_api_key[64];
    uint8_t controled_enabled;
    uint8_t light_display_enabled;
} hue_stream_config_t;

typedef struct
{
    char room_name[15];
    // todo: we may not NEED this assuming we're OK assuming grouped_light_id is 1:1 with a room_id
    //        though it's likely if we need to roll up an individual light to a room we'll need this
    char room_id[37];
    char grouped_light_id[37];
    uint8_t pin;
} hue_room_status_t;
typedef struct
{
    hue_room_status_t rooms[MAX_ROOMS];
    uint8_t room_count;
} hue_house_status_t;
typedef struct
{
    hue_grouped_light_status_t rooms[MAX_ROOMS];
    int grouped_light_count;
} hue_grouped_lights_status_t;

/**
 * I need to have some sort of lookup that matches a case insensitive room name to a light number,
 * so for example "livingroom" should map to lights_status->light_1, "kitchen" to lights_status->light_2, etc.
 */
// Define a mapping from room names to light numbers
struct room_pin_mapping
{
    const char *room_name;
    int pin_number;
};

/**
 * Make a request to https://discovery.meethue.com/ to get the Hue base station IP address.
 */
void hue_get_base_station_ip(char *hue_base_station_ip);

void hue_get_full_house_status(hue_house_status_t *house_status, uint8_t *current_light_on_off_status, char *hue_base_station_ip, char *hue_base_station_api_key);

void hue_http_start(void *data);

/**
 * Turns a particular room on or off.
 * @param room_id The UUID of the room where the light status needs to be changed.
 * @param target_state A boolean value indicating the desired light status.
 *                       - true: Turn the light on.
 *                       - false: Turn the light off.
 */
void hue_update_room_light(char *room_id, uint8_t target_state, char *hue_base_station_ip, char *hue_base_station_api_key);

/**
 * Fetch the settings from the remote config hosted on smallest.space
 */
void smallest_space_get_remote_config(char *settings);

#endif