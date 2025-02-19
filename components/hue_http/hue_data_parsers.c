#include <stdio.h>
#include <string.h>
#include <cJSON.h>
#include "esp_log.h"
#include "hue_http.h"
#include "hue_data_parsers.h"

#define TAG "HUE_DATA_PARSERS"

void parse_hue_rooms(char *get_room_response, hue_house_status_t *house_status, struct room_pin_mapping *config_room_name_pin_map, size_t map_size)
{
    /**
     * EXAMPLE:
     *
     * {"errors":[],"data":[{"id":"624240dd-12ec-4c34-a243-7669f41c5e77","id_v1":"/groups/81","children":[{"rid":"16554f75-79ff-4719-94c7-2da19c5b08a4","rtype":"device"},{"rid":"5f017829-e3b6-49e7-b50d-545e4d2bf6c7","rtype":"device"}],"services":[{"rid":"251f41ee-2396-4aa9-b2c3-3ae0f47a8843","rtype":"grouped_light"}],"metadata":{"name":"Living room","archetype":"living_room"},"type":"room"},{"id":"af607bde-f1b6-4a34-b047-3e17a78ec494","id_v1":"/groups/82","children":[{"rid":"225a4611-eff5-4719-b9e7-f3d7b8c0a9ce","rtype":"device"}],"services":[{"rid":"3d49b003-567e-4613-a427-cff8e2becb98","rtype":"grouped_light"}],"metadata":{"name":"Kitchen","archetype":"kitchen"},"type":"room"},{"id":"d5debd5c-c00e-4e1a-b686-7789d7bc79e0","id_v1":"/groups/85","children":[],"services":[],"metadata":{"name":"Bathroom","archetype":"bathroom"},"type":"room"},{"id":"e399b905-4eef-4b91-841b-899116e242f0","id_v1":"/groups/83","children":[],"services":[],"metadata":{"name":"Bedroom","archetype":"bedroom"},"type":"room"}]}
     */

    house_status->room_count = 0;

    cJSON *room_json = cJSON_Parse(get_room_response);

    if (room_json == NULL)
    {
        const char *error_ptr = cJSON_GetErrorPtr();
        if (error_ptr != NULL)
        {
            ESP_LOGE(TAG, "Error before: %s\n", error_ptr);
        }
        goto end;
    }

    const cJSON *rooms_data_array = cJSON_GetObjectItemCaseSensitive(room_json, "data");

    // `data` should be an array of room data, if not something is up
    if (!cJSON_IsArray(rooms_data_array))
    {
        ESP_LOGE(TAG, "type for room data is not an array");
        goto end;
    }

    const cJSON *room = NULL;

    cJSON_ArrayForEach(room, rooms_data_array)
    {
        cJSON *room_id = cJSON_GetObjectItemCaseSensitive(room, "id");
        // TODO: children is an array of devices, most likely individual lights, do we need these?
        // cJSON *children = cJSON_GetObjectItemCaseSensitive(room, "children");
        cJSON *services_array = cJSON_GetObjectItemCaseSensitive(room, "services");
        cJSON *metadata = cJSON_GetObjectItemCaseSensitive(room, "metadata");

        if (cJSON_IsString(room_id) && cJSON_IsArray(services_array) && cJSON_IsObject(metadata))
        {
            cJSON *room_name = cJSON_GetObjectItemCaseSensitive(metadata, "name");
            cJSON *grouped_light_id = NULL;
            cJSON *service = NULL;
            cJSON_ArrayForEach(service, services_array)
            {
                if (cJSON_IsObject(service))
                {
                    cJSON *rtype = cJSON_GetObjectItemCaseSensitive(service, "rtype");
                    cJSON *rid = cJSON_GetObjectItemCaseSensitive(service, "rid");
                    if (cJSON_IsString(rid) && cJSON_IsString(rtype) && strcmp(rtype->valuestring, "grouped_light") == 0)
                    {
                        grouped_light_id = rid;
                        break;
                    }
                }
            }

            if (cJSON_IsString(room_name) && cJSON_IsString(grouped_light_id))
            {
                house_status->room_count++;
                strncpy(house_status->rooms[house_status->room_count - 1].grouped_light_id, grouped_light_id->valuestring, sizeof(house_status->rooms[house_status->room_count - 1].grouped_light_id) - 1);
                house_status->rooms[house_status->room_count - 1].grouped_light_id[36] = '\0';
                strncpy(house_status->rooms[house_status->room_count - 1].room_id, room_id->valuestring, sizeof(house_status->rooms[house_status->room_count - 1].room_id) - 1);
                house_status->rooms[house_status->room_count - 1].room_id[36] = '\0';

                // copy the room name to the room object using memcpy
                size_t room_name_length = strlen(room_name->valuestring);
                if (room_name_length >= sizeof(house_status->rooms[house_status->room_count - 1].room_name))
                {
                    room_name_length = sizeof(house_status->rooms[house_status->room_count - 1].room_name) - 1;
                }
                memcpy(house_status->rooms[house_status->room_count - 1].room_name, room_name->valuestring, room_name_length);
                house_status->rooms[house_status->room_count - 1].room_name[room_name_length] = '\0';

                for (int j = 0; j < map_size; j++)
                {
                    if (strcasecmp(house_status->rooms[house_status->room_count - 1].room_name, config_room_name_pin_map[j].room_name) == 0)
                    {
                        house_status->rooms[house_status->room_count - 1].pin = config_room_name_pin_map[j].pin_number;
                    }
                }

                ESP_LOGD(TAG, "we have everything we need: \n\troom name: %s\n\tgrouped_light: %s\n\tid: %s\n\tpin: %d\n\n", room_name->valuestring, grouped_light_id->valuestring, room_id->valuestring, house_status->rooms[house_status->room_count - 1].pin);
                ESP_LOGD(TAG, "number of rooms: %d", house_status->room_count);
            }
        }
    }

end:

    cJSON_Delete(room_json);
    return;
}

void parse_hue_grouped_lights(char *http_get_grouped_lights_response, hue_house_status_t *house_status, uint8_t *current_light_on_off_status)
{
    /**
     * EXAMPLE:
     *
     * {"errors":[],"data":[{"id":"251f41ee-2396-4aa9-b2c3-3ae0f47a8843","id_v1":"/groups/81","owner":{"rid":"624240dd-12ec-4c34-a243-7669f41c5e77","rtype":"room"},"on":{"on":true},"dimming":{"brightness":100.0},"dimming_delta":{},"alert":{"action_values":["breathe"]},"signaling":{"signal_values":["no_signal","on_off"]},"dynamics":{},"type":"grouped_light"},{"id":"3d49b003-567e-4613-a427-cff8e2becb98","id_v1":"/groups/82","owner":{"rid":"af607bde-f1b6-4a34-b047-3e17a78ec494","rtype":"room"},"on":{"on":true},"dimming":{"brightness":100.0},"dimming_delta":{},"alert":{"action_values":["breathe"]},"signaling":{"signal_values":["no_signal","on_off"]},"dynamics":{},"type":"grouped_light"},{"id":"91925fc3-1ef8-4012-a89e-7d0eee4a9ef8","id_v1":"/groups/84","owner":{"rid":"23904fbd-1793-4e49-8ad2-d37479582df5","rtype":"zone"},"on":{"on":true},"dimming":{"brightness":100.0},"dimming_delta":{},"alert":{"action_values":["breathe"]},"signaling":{"signal_values":["no_signal","on_off"]},"dynamics":{},"type":"grouped_light"},{"id":"cdab0abe-4281-476c-8237-13ad283f40d6","id_v1":"/groups/0","owner":{"rid":"40c8849f-b339-4c21-8e49-d56cc86c508f","rtype":"bridge_home"},"on":{"on":true},"dimming":{"brightness":100.0},"dimming_delta":{},"alert":{"action_values":["breathe"]},"signaling":{"signal_values":["no_signal","on_off"]},"dynamics":{},"type":"grouped_light"}]}
     */

    cJSON *grouped_lights_json = cJSON_Parse(http_get_grouped_lights_response);

    if (grouped_lights_json == NULL)
    {
        const char *error_ptr = cJSON_GetErrorPtr();
        if (error_ptr != NULL)
        {
            ESP_LOGE(TAG, "Error before: %s\n", error_ptr);
        }
        goto end;
    }

    const cJSON *grouped_lights_data = cJSON_GetObjectItemCaseSensitive(grouped_lights_json, "data");

    // `data` should be an array of room data, if not something is up
    if (!cJSON_IsArray(grouped_lights_data))
    {
        ESP_LOGE(TAG, "type for grouped_lights data is not an array");
        goto end;
    }

    const cJSON *grouped_light = NULL;

    cJSON_ArrayForEach(grouped_light, grouped_lights_data)
    {
        cJSON *grouped_light_id = cJSON_GetObjectItemCaseSensitive(grouped_light, "id");
        cJSON *owner = cJSON_GetObjectItemCaseSensitive(grouped_light, "owner");
        cJSON *on = cJSON_GetObjectItemCaseSensitive(grouped_light, "on");

        if (cJSON_IsString(grouped_light_id) && cJSON_IsObject(owner) && cJSON_IsObject(on))
        {
            cJSON *owner_type = cJSON_GetObjectItemCaseSensitive(owner, "rtype");
            cJSON *owner_id = cJSON_GetObjectItemCaseSensitive(owner, "rid");

            // this is a dumb name but it's a dumb object that is `on: {on: true}` so :shrug:
            cJSON *on_on = cJSON_GetObjectItemCaseSensitive(on, "on");

            if (cJSON_IsString(owner_id) && cJSON_IsString(owner_type) && (strcmp(owner_type->valuestring, "room") == 0) && cJSON_IsBool(on_on))
            {

                ESP_LOGD(TAG, "owner_id: %s, owner_type: %s, on: %d", owner_id->valuestring, owner_type->valuestring, on_on->valueint);
                // ok now we have data so let's update the base object with the data we have
                for (int i = 0; i < house_status->room_count; i++)
                {
                    if (strcmp(house_status->rooms[i].grouped_light_id, grouped_light_id->valuestring) == 0)
                    {
                        current_light_on_off_status[house_status->rooms[i].pin] = on_on->valueint;
                        ESP_LOGD(TAG, "grouped_light_id status found: %s, on: %d", grouped_light_id->valuestring, on_on->valueint);
                        break;
                    }
                }
            }
        }
    }

end:

    cJSON_Delete(grouped_lights_json);
    return;
}

void parse_hue_event_update(char *http_event_data, hue_grouped_lights_status_t *grouped_lights_status)
{
    /**
     * EXAMPLE:
     *
     * [{"creationtime":"2024-12-07T14:09:09Z","data":[{"dimming":{"brightness":59.68},"id":"4edd8b1a-9f51-4d2d-bf60-5e946092dcf4","id_v1":"/lights/2","owner":{"rid":"225a4611-eff5-4719-b9e7-f3d7b8c0a9ce","rtype":"device"},"service_id":0,"type":"light"}],"id":"89e477d7-06f6-4ccf-9ded-72fcfcdca9da","type":"update"},{"creationtime":"2024-12-07T14:09:09Z","data":[{"dimming":{"brightness":59.68},"id":"3d49b003-567e-4613-a427-cff8e2becb98","id_v1":"/groups/82","owner":{"rid":"af607bde-f1b6-4a34-b047-3e17a78ec494","rtype":"room"},"type":"grouped_light"},{"dimming":{"brightness":79.84},"id":"91925fc3-1ef8-4012-a89e-7d0eee4a9ef8","id_v1":"/groups/84","owner":{"rid":"23904fbd-1793-4e49-8ad2-d37479582df5","rtype":"zone"},"type":"grouped_light"},{"dimming":{"brightness":86.56},"id":"cdab0abe-4281-476c-8237-13ad283f40d6","id_v1":"/groups/0","owner":{"rid":"40c8849f-b339-4c21-8e49-d56cc86c508f","rtype":"bridge_home"},"type":"grouped_light"}],"id":"6790d34d-040b-443f-8fcc-3dbec3aa2192","type":"update"}]
     */
    grouped_lights_status->grouped_light_count = 0;

    cJSON *event_data_array = cJSON_Parse(http_event_data);

    if (event_data_array == NULL)
    {
        const char *error_ptr = cJSON_GetErrorPtr();
        if (error_ptr != NULL)
        {
            ESP_LOGE(TAG, "Error before: %s\n", error_ptr);
        }
        goto end;
    }

    // `data` should be an array of room data, if not something is up
    if (!cJSON_IsArray(event_data_array))
    {
        ESP_LOGE(TAG, "type event_data_array was not array as expected");
        goto end;
    }

    const cJSON *event_update = NULL;

    cJSON_ArrayForEach(event_update, event_data_array)
    {
        cJSON *event_type = cJSON_GetObjectItemCaseSensitive(event_update, "type");
        cJSON *data_array = cJSON_GetObjectItemCaseSensitive(event_update, "data");

        // I'm not entirely certain of what event types we could get, but `update` is the one I'm sure we want to pay attention to
        if (cJSON_IsString(event_type) && (strcmp(event_type->valuestring, "update") == 0) && cJSON_IsArray(data_array))
        {

            cJSON *update_data = NULL;
            cJSON_ArrayForEach(update_data, data_array)
            {

                // this will be the id of the grouped_light if it is one
                cJSON *update_type_id = cJSON_GetObjectItemCaseSensitive(update_data, "id");
                cJSON *on = cJSON_GetObjectItemCaseSensitive(update_data, "on");
                cJSON *dimming = cJSON_GetObjectItemCaseSensitive(update_data, "dimming");
                cJSON *update_type = cJSON_GetObjectItemCaseSensitive(update_data, "type");
                cJSON *owner = cJSON_GetObjectItemCaseSensitive(update_data, "owner");

                if (cJSON_IsString(update_type) && cJSON_IsString(update_type_id) && (strcmp(update_type->valuestring, "grouped_light") == 0) && cJSON_IsObject(owner) && (cJSON_IsObject(on) || cJSON_IsObject(dimming)))
                {
                    int final_on = 0;
                    int setCount = 0;
                    cJSON *owner_type = cJSON_GetObjectItemCaseSensitive(owner, "rtype");

                    if (cJSON_IsObject(on))
                    {
                        cJSON *on_on = cJSON_GetObjectItemCaseSensitive(on, "on");
                        if (cJSON_IsObject(on_on))
                        {
                            setCount++;
                            on = on_on->valueint;
                        }
                    }
                    if (cJSON_IsObject(dimming))
                    {
                        cJSON *brightness = cJSON_GetObjectItemCaseSensitive(dimming, "brightness");
                        if (cJSON_IsNumber(brightness))
                        {
                            final_on = setCount > 0 ? final_on && brightness->valuedouble > 0 : brightness->valuedouble > 0;
                            setCount++;
                        }
                    }

                    if (cJSON_IsString(owner_type) && (strcmp(owner_type->valuestring, "room") == 0) && setCount > 0)
                    {
                        grouped_lights_status->grouped_light_count++;
                        strncpy(grouped_lights_status->rooms[grouped_lights_status->grouped_light_count - 1].grouped_light_id, update_type_id->valuestring, 36);
                        grouped_lights_status->rooms[grouped_lights_status->grouped_light_count - 1].grouped_light_id[36] = '\0';
                        grouped_lights_status->rooms[grouped_lights_status->grouped_light_count - 1].grouped_lights_on = final_on;
                    }
                }
            }
        }
    }

end:

    cJSON_Delete(event_data_array);
    return;
}

void parse_hue_discovery_response(char *http_event_data, char *hue_base_station_ip)
{
    char *which_hue_base_station = "0";

    /**
     * EXAMPLE:
     *
     * [
     *   {
     *   id: "001788fffeb3e036",
     *   internalipaddress: "192.168.11.10",
     *   port: 443
     *   }
     *  ]
     */

    cJSON *discovery_response_array = cJSON_Parse(http_event_data);

    if (discovery_response_array == NULL)
    {
        const char *error_ptr = cJSON_GetErrorPtr();
        if (error_ptr != NULL)
        {
            ESP_LOGE(TAG, "Error before: %s\n", error_ptr);
        }
        goto end;
    }

    // `data` should be an array of room data, if not something is up
    if (!cJSON_IsArray(discovery_response_array))
    {
        ESP_LOGE(TAG, "type discovery_response_array was not array as expected");
        goto end;
    }

    const cJSON *base_station = NULL;

    cJSON_ArrayForEach(base_station, discovery_response_array)
    {
        cJSON *base_station_id = cJSON_GetObjectItemCaseSensitive(base_station, "id");
        cJSON *internal_ip_address = cJSON_GetObjectItemCaseSensitive(base_station, "internalipaddress");

        // I'm not entirely certain of what event types we could get, but `update` is the one I'm sure we want to pay attention to
        if (cJSON_IsString(base_station_id) && cJSON_IsString(internal_ip_address))
        {
            if ((which_hue_base_station[0] == '0') || strcasecmp(base_station_id->valuestring, which_hue_base_station) == 0)
            {
                ESP_LOGI(TAG, "Found the base station we are looking for: %s, %s", base_station_id->valuestring, internal_ip_address->valuestring);
                strncpy(hue_base_station_ip, internal_ip_address->valuestring, 39);
                hue_base_station_ip[39] = '\0';
                goto end;
            }
        }
    }

end:

    cJSON_Delete(discovery_response_array);
    return;
}

void parse_smallest_space_remote_config_response(char *http_event_data, char *settings)
{
    /**
     * EXAMPLE:
        {
            enableControl: true,
            enableDisplay: true,
        }
     */

    cJSON *config_response_json = cJSON_Parse(http_event_data);

    if (config_response_json == NULL)
    {
        const char *error_ptr = cJSON_GetErrorPtr();
        if (error_ptr != NULL)
        {
            ESP_LOGE(TAG, "Error before: %s\n", error_ptr);
        }
        goto end;
    }

    // `data` should be an array of room data, if not something is up
    if (!cJSON_IsObject(config_response_json))
    {
        ESP_LOGE(TAG, "type config_response_json was not an object as expected");
        goto end;
    }

    cJSON *control_enabled = cJSON_GetObjectItemCaseSensitive(config_response_json, "enableControl");
    cJSON *display_enabled = cJSON_GetObjectItemCaseSensitive(config_response_json, "enableDisplay");

    // I'm not entirely certain of what event types we could get, but `update` is the one I'm sure we want to pay attention to
    if (cJSON_IsBool(control_enabled) && cJSON_IsBool(display_enabled))
    {
        ESP_LOGI(TAG, "Config returned from smallest.space: %d, %d", cJSON_IsTrue(control_enabled), cJSON_IsTrue(display_enabled));

        if (cJSON_IsTrue(control_enabled))
        {
            settings[0] = '1';
        }
        else
        {
            settings[0] = '0';
        }
        if (cJSON_IsTrue(display_enabled))
        {
            settings[1] = '1';
        }
        else
        {
            settings[1] = '0';
        }
        goto end;
    }

end:

    cJSON_Delete(config_response_json);
    return;
}
