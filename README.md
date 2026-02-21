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

## Notes / gotchas

### MAX_ROOM

Note that 

## TODO

- when you switch a switch really fast, the system can't keep up and you end up sitting and waiting for the queue that is calling these things to be flushed. Is there a way to insert messages and push older messages off the queue if the queue is full? Possibly only allow a single queue message even?
- If you leave the Hue PUT client alone for a long time, it will fail, and there is no mechanism to catch these failures and create a new connection. Some of the errors are `esp-tls-mbedtls: write error`, `transport_base: poll_write select error 0, errno = Success,`, `HUE_HTTP: HTTP GET request failed: ESP_FAIL`, `transport_base: poll_read select error 0,`, `HUE_HTTP: HTTP GET request failed: ESP_ERR_HTTP_FETCH_HEADER`

- Switches, by default, are off.
- need to figure out how / when to turn the color LEDs on / off
- need to make a request to smallest.space/home/status to get the status
- need to get the Hue base IP address from discovery URL
- need to slightly improve how URLs are configured


### Errors when wifi drops:

```
I (7792018) SWITCH: Request payload: 251f41ee-2396-4aa9-b2c3-3ae0f47a88431
I (7792028) HUE_UPDATE: Updating light status for group_id: 251f41ee-2396-4aa9-b2c3-3ae0f47a8843 to status: 1
I (7792038) HUE_HTTP: Updating room light: room_id=251f41ee-2396-4aa9-b2c3-3ae0f47a8843, target_state=1
I (7792228) HUE_HTTP: Milliseconds for PUT esp_http_client_perform: 180
I (7792228) HUE_HTTP: FINISHED Updating room light: room_id=251f41ee-2396-4aa9-b2c3-3ae0f47a8843, target_state=1
I (7793378) UPDATE: Received grouped_lights_status from queue with 1 updates...
I (7793378) UPDATE: Grouped light 251f41ee-2396-4aa9-b2c3-3ae0f47a8843 is on
W (7815628) wifi: [wl_cnx.c,2314] bcn_timeout,ap_probe_send_start
W (7818128) wifi: [wl_cnx.c,2356] ap_probe_send over, resett wifi status to disassoc
W (7818128) wifi: [ieee80211_sta.c,205] state: run -> init (c800)
W (7818128) wifi: [pm.c,3374] pm stop, total sleep time: 6693467619 us / 7816222949 us
W (7818138) wifi: [hal_ampdu.c,127] <ba-del>idx:0, tid:0
W (7818138) wifi: [ieee80211_ht.c,2089] new:<2,0>, old:<2,0>, ap:<255,255>, sta:<2,0>, prof:1
I (7818148) WIFI_CONNECT: DISCONNECTED 200
W (7818158) WIFI_CONNECT: DISCONNECTED WIFI_REASON_BEACON_TIMEOUT: Station loses N beacons continuously.
E (7818168) transport_base: poll_read select error 113, errno = Software caused connection abort, fd = 54
E (7818178) HTTP_CLIENT: transport_read: error - 57347 | ERROR
E (7818278) transport_base: poll_read select error 0, errno = Success, fd = 54
E (7818278) HTTP_CLIENT: transport_read: error - 57347 | ERROR
E (7818378) transport_base: poll_read select error 0, errno = Success, fd = 54
E (7818378) HTTP_CLIENT: transport_read: error - 57347 | ERROR
E (7818478) transport_base: poll_read select error 0, errno = Success, fd = 54
E (7818478) HTTP_CLIENT: transport_read: error - 57347 | ERROR
E (7818578) transport_base: poll_read select error 0, errno = Success, fd = 54
E (7818578) HTTP_CLIENT: transport_read: error - 57347 | ERROR
E (7818678) transport_base: poll_read select error 0, errno = Success, fd = 54
```



```
E (7873578) transport_base: poll_read select error 0, errno = Success, fd = 54
E (7873578) HTTP_CLIENT: transport_read: error - 57347 | ERROR
E (7873678) transport_base: poll_read select error 0, errno = Success, fd = 54
E (7873678) HTTP_CLIENT: transport_read: error - 57347 | ERROR
E (7873778) transport_base: poll_read select error 0, errno = Success, fd = 54
E (7873778) HTTP_CLIENT: transport_read: error - 57347 | ERROR
E (7873798) esp-tls: couldn't get hostname for :smallest.space: getaddrinfo() returns 202, addrinfo=0x0
E (7873798) esp-tls: Failed to open new connection
E (7873798) transport_base: Failed to open a new connection
E (7873808) HTTP_CLIENT: Connection failed, sock < 0
E (7873808) HUE_HTTP: HTTP GET request failed: ESP_ERR_HTTP_CONNECT
E (7873878) transport_base: poll_read select error 0, errno = Success, fd = 54
E (7873878) HTTP_CLIENT: transport_read: error - 57347 | ERROR
E (7873978) transport_base: poll_read select error 0, errno = Success, fd = 54
E (7873978) HTTP_CLIENT: transport_read: error - 57347 | ERROR
E (7874078) transport_base: poll_read select error 0, errno = Success, fd = 54
E (7874078) HTTP_CLIENT: transport_read: error - 57347 | ERROR
E (7874178) transport_base: poll_read select error 0, errno = Success, fd = 54
E (7874178) HTTP_CLIENT: transport_read: error - 57347 | ERROR
E (7874278) transport_base: poll_read select error 0, errno = Success, fd = 54
```


## TO-DON'T

### should we consider getting TLS working?

For now I'm not worried about this and it's not worth keeping around in my head in the TODO list.

## TO-DONE

### currently the room id can be empty adn we still try to send a Hue request, should do some basic error checking

