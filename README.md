# smallest.space

This project is the elctronics component of a lending-library inspired instalation in front of my house. I'm calling the project `Smallest Space`, and there are different "modules" I can swap out that add different fun little bits of interest to my community.

[https://smallest.space](https://smallest.space)

## Smallest Remote Control House

A minature version of my house, in front of my house, that will allow people to turn the lights in our house on and off.

### Orientation

`components/hue_http` - this is intended to contain all of the heavy lifting with the Hue API. Primarily this code should handle all of the HTTP requests and parsing out response JSON. Cleverly `hue_http` is the HTTP handling side of things, including the long running _server-sent events_ handling functionality. Parsing of the response JSON happens with cJSON inside of `hue_data_parsers`.

`wifi_connect` - this is largly what I came up with by following along with the excellent [learnesp32.com](https://learnesp32.com). It handles most of the initial wifi station connection logic and error handling (more needed).

`house_control` - this is a small layer on top of `TCA9523`, basically things specifically related to I/O Port Expander and i2c. Reading the paddle switches and turning on / off the LEDs on the board via i2c.

`TCA9534` - a library for handling i2c with the port expanded. This is slightly modified from the version in `docs`

`main` - everything else

## TODO

- when you switch a switch really fast, the system can't keep up and you end up sitting and waiting for the queue that is calling these things to be flushed. Is there a way to insert messages and push older messages off the queue if the queue is full? Possibly only allow a single queue message even?
- If you leave the Hue PUT client alone for a long time, it will fail, and there is no mechanism to catch these failures and create a new connection. Some of the errors are `esp-tls-mbedtls: write error`, `transport_base: poll_write select error 0, errno = Success,`, `HUE_HTTP: HTTP GET request failed: ESP_FAIL`, `transport_base: poll_read select error 0,`, `HUE_HTTP: HTTP GET request failed: ESP_ERR_HTTP_FETCH_HEADER`

- Switches, by default, are off.
- need to figure out how / when to turn the color LEDs on / off
- need to make a request to smallest.space/home/status to get the status
- need to get the Hue base IP address from discovery URL
- need to slightly improve how URLs are configured

## TO-DON'T

### should we consider getting TLS working?

For now I'm not worried about this and it's not worth keeping around in my head in the TODO list.

## TO-DONE

### currently the room id can be empty adn we still try to send a Hue request, should do some basic error checking
