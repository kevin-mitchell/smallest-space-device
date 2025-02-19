#ifndef HOUSE_CONTROL_H
#define HOUSE_CONTROL_H

#include "hue_http.h"

esp_err_t house_control_init();

void set_house_lights(unsigned short lightState);

uint8_t get_house_switch_statuses();

void set_house_lights_struct(uint8_t *target_light_status);

void update_display_lights_from_house_status(hue_house_status_t *house_status, uint8_t *lights_status);

void get_house_switch_statuses_struct(uint8_t *switches_status);

#endif