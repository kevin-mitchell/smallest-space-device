#include <string.h>
#include "driver/gpio.h"
#include "esp_log.h"
#include "driver/i2c.h"
#include "TCA9535.h"
#include "house_control.h"

/**
 * TODO:
 * 1. Should ideally have some sort of debounce function or state management to tell when the switch state changes
 * 2. Along with above consider method for sending a message when something changes vs requiring polling
 */

static gpio_num_t i2c_gpio_sda = 4;
static gpio_num_t i2c_gpio_scl = 5;

esp_err_t house_control_init()
{
    i2c_config_t conf = {
        .mode = I2C_MODE_MASTER,
        .sda_io_num = i2c_gpio_sda,
        .sda_pullup_en = GPIO_PULLUP_ENABLE,
        .scl_io_num = i2c_gpio_scl,
        .scl_pullup_en = GPIO_PULLUP_ENABLE,
        .master.clk_speed = 100000,
    };

    // Init i2c driver
    esp_err_t ret = TCA9535Init(&conf);

    if (ret == ESP_OK)
    {
        ESP_LOGI(I2C_LOG_TAG, "Initialization done");
    }
    else
    {
        ESP_LOGI(I2C_LOG_TAG, "Initialization failed");
    }

    // Configure TCA9535's PORT0 as input port
    TCA9535WriteSingleRegister(TCA9535_CONFIG_REG0, 0xFF);

    // Configure TCA9535's PORT1 as output port.. I think?
    TCA9535WriteSingleRegister(TCA9535_CONFIG_REG1, 0x00);

    return ret;
}

void set_house_lights(unsigned short lightState)
{
    TCA9535WriteSingleRegister(TCA9535_OUTPUT_REG1, lightState);
}

uint8_t get_house_switch_statuses()
{
    uint8_t reg_data = TCA9535ReadSingleRegister(TCA9535_INPUT_REG0);

    return reg_data;
}

void set_house_lights_struct(uint8_t *target_light_status)
{
    unsigned short lightState = 0;

    lightState |= (!target_light_status[0]) << 0;
    lightState |= (!target_light_status[1]) << 1;
    lightState |= (!target_light_status[2]) << 2;
    lightState |= (!target_light_status[3]) << 3;
    lightState |= (!target_light_status[4]) << 4;
    lightState |= (!target_light_status[5]) << 5;
    lightState |= (!target_light_status[6]) << 6;
    lightState |= (!target_light_status[7]) << 7;

    set_house_lights(lightState);
}

void get_house_switch_statuses_struct(uint8_t *switches_status)
{
    uint8_t reg_data = get_house_switch_statuses();

    // Note: this is backwards / being flipped because the switches are active low
    switches_status[0] = (reg_data & 0x01);
    switches_status[1] = (reg_data & 0x02);
    switches_status[2] = (reg_data & 0x04);
    switches_status[3] = (reg_data & 0x08);
    switches_status[4] = (reg_data & 0x10);
    switches_status[5] = (reg_data & 0x20);
    switches_status[6] = (reg_data & 0x40);
    switches_status[7] = (reg_data & 0x80);
}
