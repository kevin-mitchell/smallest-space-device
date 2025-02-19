#ifndef HUE_DATA_PARSERS_H
#define HUE_DATA_PARSERS_H

void parse_hue_rooms(char *get_room_response, hue_house_status_t *house_status, struct room_pin_mapping *config_room_name_pin_map, size_t map_size);
void parse_hue_grouped_lights(char *http_get_grouped_lights_response, hue_house_status_t *house_status, uint8_t *current_light_on_off_status);
void parse_hue_event_update(char *http_event_data, hue_grouped_lights_status_t *grouped_lights_status);
void parse_hue_discovery_response(char *http_event_data, char *hue_base_station_ip);
void parse_smallest_space_remote_config_response(char *http_event_data, char *settings);

#endif