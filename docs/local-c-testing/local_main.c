#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <stdint.h>

typedef struct
{
    char *buffer;
    int index;
} http_data_t;

int main()
{
    int message_position = 0;
    char message[] = ": hi\n\nid: 1731887129:0\ndata: [{\" creationtime \":\" 2024 - 11 - 17T23 : 45 : 28Z \",\" data \":[{\" id \":\" e6451da5 - 3c76 - 4760 - b0bd - dca3175cee40 \",\" id_v1 \":\" / lights / 1 \",\" on \":{\" on \":true},\" owner \":{\" rid \":\" 5f017829 - e3b6 - 49e7 - b50d - 545e4d2bf6c7 \",\" rtype \":\" device \"},\" service_id \":0,\" type \":\" light \"}],\" id \":\" 5289ce63 - c141 - 43de-8507 - 2f6363680916 \",\" type \":\" update \"},{\" creationtime \":\" 2024 - 11 - 17T23 : 45 : 28Z \",\" data \":[{\" dimming \":{\" brightness \":48.62},\" id \":\" 251f41ee-2396 - 4aa9 - b2c3 - 3ae0f47a8843 \",\" id_v1 \":\" / groups / 81 \",\" on \":{\" on \":true},\" owner \":{\" rid \":\" 624240dd - 12ec - 4c34 - a243 - 7669f41c5e77 \",\" rtype \":\" room \"},\" type \":\" grouped_light \"},{\" dimming \":{\" brightness \":48.62},\" id \":\" cdab0abe - 4281 - 476c - 8237 - 13ad283f40d6 \",\" id_v1 \":\" / groups / 0 \",\" on \":{\" on \":true},\" owner \":{\" rid \":\" 40c8849f - b339 - 4c21 - 8e49 - d56cc86c508f \",\" rtype \":\" bridge_home \"},\" type \":\" grouped_light \"}],\" id \":\" f8218108 - ec94 - 4619 - b53a - 8adfb0415fea \",\" type \":\" update \"},{\" creationtime \":\" 2024 - 11 - 17T23 : 45 : 28Z \",\" data \":[{\" dimming \":{\" brightness \":15.81},\" id \":\" e6451da5 - 3c76 - 4760 - b0bd - dca3175cee40 \",\" id_v1 \":\" / lights / 1 \",\" owner \":{\" rid \":\" 5f017829 - e3b6 - 49e7 - b50d - 545e4d2bf6c7 \",\" rtype \":\" device \"},\" service_id \":0,\" type \":\" light \"}],\" id \":\" 1a151fa0 - d158 - 41ad - b646 - 7e577f3a6dab \",\" type \":\" update \"},{\" creationtime \":\" 2024 - 11 - 17T23 : 45 : 28Z \",\" data \":[{\" dimming \":{\" brightness \":15.81},\" id \":\" 251f41ee-2396 - 4aa9 - b2c3 - 3ae0f47a8843 \",\" id_v1 \":\" / groups / 81 \",\" owner \":{\" rid \":\" 624240dd - 12ec - 4c34 - a243 - 7669f41c5e77 \",\" rtype \":\" room \"},\" type \":\" grouped_light \"},{\" dimming \":{\" brightness \":15.81},\" id \":\" cdab0abe - 4281 - 476c - 8237 - 13ad283f40d6 \",\" id_v1 \":\" / groups / 0 \",\" owner \":{\" rid \":\" 40c8849f - b339 - 4c21 - 8e49 - d56cc86c508f \",\" rtype \":\" bridge_home \"},\" type \":\" grouped_light \"}],\" id \":\" 3e81abeb - 6aa7 - 47ab - bbed - c5d0140b4740 \",\" type \":\" update \"}]\n\nid: 1731887130:0\ndata: [{\" creationtime \":\" 2024 - 11 - 17T23 : 45 : 29Z \",\" data \":[{\" id \":\" e6451da5 - 3c76 - 4760 - b0bd - dca3175cee40 \",\" id_v1 \":\" / lights / 1 \",\" on \":{\" on \":false},\" owner \":{\" rid \":\" 5f017829 - e3b6 - 49e7 - b50d - 545e4d2bf6c7 \",\" rtype \":\" device \"},\" service_id \":0,\" type \":\" light \"}],\" id \":\" bc4ada50 - f7fc - 4308 - 9ed3 - 87c843a9fb43 \",\" type \":\" update \"},{\" creationtime \":\" 2024 - 11 - 17T23 : 45 : 29Z \",\" data \":[{\" dimming \":{\" brightness \":0.0},\" id \":\" 251f41ee-2396 - 4aa9 - b2c3 - 3ae0f47a8843 \",\" id_v1 \":\" / groups / 81 \",\" on \":{\" on \":false},\" owner \":{\" rid \":\" 624240dd - 12ec - 4c34 - a243 - 7669f41c5e77 \",\" rtype \":\" room \"},\" type \":\" grouped_light \"},{\" dimming \":{\" brightness \":0.0},\" id \":\" cdab0abe - 4281 - 476c - 8237 - 13ad283f40d6 \",\" id_v1 \":\" / groups / 0 \",\" on \":{\" on \":false},\" owner \":{\" rid \":\" 40c8849f - b339 - 4c21 - 8e49 - d56cc86c508f \",\" rtype \":\" bridge_home \"},\" type \":\" grouped_light \"}],\" id \":\" a3c8d036 - 329e-497a - b2cf - b495ffe67b26 \",\" type \":\" update \"},{\" creationtime \":\" 2024 - 11 - 17T23 : 45 : 30Z \",\" data \":[{\" dimming \":{\" brightness \":46.64},\" id \":\" e6451da5 - 3c76 - 4760 - b0bd - dca3175cee40 \",\" id_v1 \":\" / lights / 1 \",\" owner \":{\" rid \":\" 5f017829 - e3b6 - 49e7 - b50d - 545e4d2bf6c7 \",\" rtype \":\" device \"},\" service_id \":0,\" type \":\" light \"}],\" id \":\" 24ab2979 - 9c95 - 4142 - a136 - 7e3b1ea8917f \",\" type \":\" update \"}]\n\nid: 1731887129:0\ndata: [{\" creationtime \":\" 2024 - 11 - 17T23 : 45 : 28Z \",\" data \":[{\" id \":\" e6451da5 - 3c76 - 4760 - b0bd - dca3175cee40 \",\" id_v1 \":\" / lights / 1 \",\" on \":{\" on \":true},\" owner \":{\" rid \":\" 5f017829 - e3b6 - 49e7 - b50d - 545e4d2bf6c7 \",\" rtype \":\" device \"},\" service_id \":0,\" type \":\" light \"}],\" id \":\" 5289ce63 - c141 - 43de-8507 - 2f6363680916 \",\" type \":\" update \"},{\" creationtime \":\" 2024 - 11 - 17T23 : 45 : 28Z \",\" data \":[{\" dimming \":{\" brightness \":48.62},\" id \":\" 251f41ee-2396 - 4aa9 - b2c3 - 3ae0f47a8843 \",\" id_v1 \":\" / groups / 81 \",\" on \":{\" on \":true},\" owner \":{\" rid \":\" 624240dd - 12ec - 4c34 - a243 - 7669f41c5e77 \",\" rtype \":\" room \"},\" type \":\" grouped_light \"},{\" dimming \":{\" brightness \":48.62},\" id \":\" cdab0abe - 4281 - 476c - 8237 - 13ad283f40d6 \",\" id_v1 \":\" / groups / 0 \",\" on \":{\" on \":true},\" owner \":{\" rid \":\" 40c8849f - b339 - 4c21 - 8e49 - d56cc86c508f \",\" rtype \":\" bridge_home \"},\" type \":\" grouped_light \"}],\" id \":\" f8218108 - ec94 - 4619 - b53a - 8adfb0415fea \",\" type \":\" update \"},{\" creationtime \":\" 2024 - 11 - 17T23 : 45 : 28Z \",\" data \":[{\" dimming \":{\" brightness \":15.81},\" id \":\" e6451da5 - 3c76 - 4760 - b0bd - dca3175cee40 \",\" id_v1 \":\" / lights / 1 \",\" owner \":{\" rid \":\" 5f017829 - e3b6 - 49e7 - b50d - 545e4d2bf6c7 \",\" rtype \":\" device \"},\" service_id \":0,\" type \":\" light \"}],\" id \":\" 1a151fa0 - d158 - 41ad - b646 - 7e577f3a6dab \",\" type \":\" update \"},{\" creationtime \":\" 2024 - 11 - 17T23 : 45 : 28Z \",\" data \":[{\" dimming \":{\" brightness \":15.81},\" id \":\" 251f41ee-2396 - 4aa9 - b2c3 - 3ae0f47a8843 \",\" id_v1 \":\" / groups / 81 \",\" owner \":{\" rid \":\" 624240dd - 12ec - 4c34 - a243 - 7669f41c5e77 \",\" rtype \":\" room \"},\" type \":\" grouped_light \"},{\" dimming \":{\" brightness \":15.81},\" id \":\" cdab0abe - 4281 - 476c - 8237 - 13ad283f40d6 \",\" id_v1 \":\" / groups / 0 \",\" owner \":{\" rid \":\" 40c8849f - b339 - 4c21 - 8e49 - d56cc86c508f \",\" rtype \":\" bridge_home \"},\" type \":\" grouped_light \"}],\" id \":\" 3e81abeb - 6aa7 - 47ab - bbed - c5d0140b4740 \",\" type \":\" update \"}]\n\nid: 1731887130:0\ndata: [{\" creationtime \":\" 2024 - 11 - 17T23 : 45 : 29Z \",\" data \":[{\" id \":\" e6451da5 - 3c76 - 4760 - b0bd - dca3175cee40 \",\" id_v1 \":\" / lights / 1 \",\" on \":{\" on \":false},\" owner \":{\" rid \":\" 5f017829 - e3b6 - 49e7 - b50d - 545e4d2bf6c7 \",\" rtype \":\" device \"},\" service_id \":0,\" type \":\" light \"}],\" id \":\" bc4ada50 - f7fc - 4308 - 9ed3 - 87c843a9fb43 \",\" type \":\" update \"},{\" creationtime \":\" 2024 - 11 - 17T23 : 45 : 29Z \",\" data \":[{\" dimming \":{\" brightness \":0.0},\" id \":\" 251f41ee-2396 - 4aa9 - b2c3 - 3ae0f47a8843 \",\" id_v1 \":\" / groups / 81 \",\" on \":{\" on \":false},\" owner \":{\" rid \":\" 624240dd - 12ec - 4c34 - a243 - 7669f41c5e77 \",\" rtype \":\" room \"},\" type \":\" grouped_light \"},{\" dimming \":{\" brightness \":0.0},\" id \":\" cdab0abe - 4281 - 476c - 8237 - 13ad283f40d6 \",\" id_v1 \":\" / groups / 0 \",\" on \":{\" on \":false},\" owner \":{\" rid \":\" 40c8849f - b339 - 4c21 - 8e49 - d56cc86c508f \",\" rtype \":\" bridge_home \"},\" type \":\" grouped_light \"}],\" id \":\" a3c8d036 - 329e-497a - b2cf - b495ffe67b26 \",\" type \":\" update \"},{\" creationtime \":\" 2024 - 11 - 17T23 : 45 : 30Z \",\" data \":[{\" dimming \":{\" brightness \":46.64},\" id \":\" e6451da5 - 3c76 - 4760 - b0bd - dca3175cee40 \",\" id_v1 \":\" / lights / 1 \",\" owner \":{\" rid \":\" 5f017829 - e3b6 - 49e7 - b50d - 545e4d2bf6c7 \",\" rtype \":\" device \"},\" service_id \":0,\" type \":\" light \"}],\" id \":\" 24ab2979 - 9c95 - 4142 - a136 - 7e3b1ea8917f \",\" type \":\" update \"}]\n\nid: 1732103674:0\ndata: [{\"creationtime\":\"2024-11-20T11:54:33Z\",\"data\":[{\"id\":\"4edd8b1a-9f51-4d2d-bf60-5e946092dcf4\",\"id_v1\":\"/lights/2\",\"on\":{\"on\":false},\"owner\":{\"rid\":\"225a4611-eff5-4719-b9e7-f3d7b8c0a9ce\",\"rtype\":\"device\"},\"service_id\":0,\"type\":\"light\"}],\"id\":\"e98ee43f-582b-4a9a-8dd8-051fb9f20676\",\"type\":\"update\"},{\"creationtime\":\"2024-11-20T11:54:33Z\",\"data\":[{\"dimming\":{\"brightness\":0.0},\"id\":\"3d49b003-567e-4613-a427-cff8e2becb98\",\"id_v1\":\"/groups/82\",\"on\":{\"on\":false},\"owner\":{\"rid\":\"af607bde-f1b6-4a34-b047-3e17a78ec494\",\"rtype\":\"room\"},\"type\":\"grouped_light\"}],\"id\":\"b7d968c6-f38c-416b-9bb9-fb7bb4b871f2\",\"type\":\"update\"},{\"creationtime\":\"2024-11-20T11:54:33Z\",\"data\":[{\"dimming\":{\"brightness\":78.26},\"id\":\"4edd8b1a-9f51-4d2d-bf60-5e946092dcf4\",\"id_v1\":\"/lights/2\",\"owner\":{\"rid\":\"225a4611-eff5-4719-b9e7-f3d7b8c0a9ce\",\"rtype\":\"device\"},\"service_id\":0,\"type\":\"light\"}],\"id\":\"4418997b-d9a0-4a73-accf-7de7055a6fbb\",\"type\":\"update\"}]\n\nid: 1732103675:0\ndata: [{\"creationtime\":\"2024-11-20T11:54:34Z\",\"data\":[{\"id\":\"27659d91-3e9c-4f50-be07-8b194a798386\",\"id_v1\":\"/lights/3\",\"on\":{\"on\":false},\"owner\":{\"rid\":\"16554f75-79ff-4719-94c7-2da19c5b08a4\",\"rtype\":\"device\"},\"service_id\":0,\"type\":\"light\"},{\"id\":\"e6451da5-3c76-4760-b0bd-dca3175cee40\",\"id_v1\":\"/lights/1\",\"on\":{\"on\":false},\"owner\":{\"rid\":\"5f017829-e3b6-49e7-b50d-545e4d2bf6c7\",\"rtype\":\"device\"},\"service_id\":0,\"type\":\"light\"}],\"id\":\"63be561b-09fa-43d5-86bd-f1601570b0ab\",\"type\":\"update\"},{\"creationtime\":\"2024-11-20T11:54:34Z\",\"data\":[{\"dimming\":{\"brightness\":0.0},\"id\":\"251f41ee-2396-4aa9-b2c3-3ae0f47a8843\",\"id_v1\":\"/groups/81\",\"on\":{\"on\":false},\"owner\":{\"rid\":\"624240dd-12ec-4c34-a243-7669f41c5e77\",\"rtype\":\"room\"},\"type\":\"grouped_light\"},{\"dimming\":{\"brightness\":0.0},\"id\":\"91925fc3-1ef8-4012-a89e-7d0eee4a9ef8\",\"id_v1\":\"/groups/84\",\"on\":{\"on\":false},\"owner\":{\"rid\":\"23904fbd-1793-4e49-8ad2-d37479582df5\",\"rtype\":\"zone\"},\"type\":\"grouped_light\"},{\"dimming\":{\"brightness\":0.0},\"id\":\"cdab0abe-4281-476c-8237-13ad283f40d6\",\"id_v1\":\"/groups/0\",\"on\":{\"on\":false},\"owner\":{\"rid\":\"40c8849f-b339-4c21-8e49-d56cc86c508f\",\"rtype\":\"bridge_home\"},\"type\":\"grouped_light\"}],\"id\":\"0ce6a34d-d89d-4bf7-a5e5-5756cb164c9c\",\"type\":\"update\"},{\"creationtime\":\"2024-11-20T11:54:34Z\",\"data\":[{\"dimming\":{\"brightness\":35.97},\"id\":\"e6451da5-3c76-4760-b0bd-dca3175cee40\",\"id_v1\":\"/lights/1\",\"owner\":{\"rid\":\"5f017829-e3b6-49e7-b50d-545e4d2bf6c7\",\"rtype\":\"device\"},\"service_id\":0,\"type\":\"light\"}],\"id\":\"61fbbfde-486f-4236-876e-4d6a7757f6db\",\"type\":\"update\"}]\n\nid: 1732103676:0\ndata: [{\"creationtime\":\"2024-11-20T11:54:35Z\",\"data\":[{\"id\":\"27659d91-3e9c-4f50-be07-8b194a798386\",\"id_v1\":\"/lights/3\",\"on\":{\"on\":true},\"owner\":{\"rid\":\"16554f75-79ff-4719-94c7-2da19c5b08a4\",\"rtype\":\"device\"},\"service_id\":0,\"type\":\"light\"},{\"id\":\"e6451da5-3c76-4760-b0bd-dca3175cee40\",\"id_v1\":\"/lights/1\",\"on\":{\"on\":true},\"owner\":{\"rid\":\"5f017829-e3b6-49e7-b50d-545e4d2bf6c7\",\"rtype\":\"device\"},\"service_id\":0,\"type\":\"light\"}],\"id\":\"d548cd20-2d04-406b-b4c8-d63cac6ec851\",\"type\":\"update\"},{\"creationtime\":\"2024-11-20T11:54:35Z\",\"data\":[{\"dimming\":{\"brightness\":67.985},\"id\":\"251f41ee-2396-4aa9-b2c3-3ae0f47a8843\",\"id_v1\":\"/groups/81\",\"on\":{\"on\":true},\"owner\":{\"rid\":\"624240dd-12ec-4c34-a243-7669f41c5e77\",\"rtype\":\"room\"},\"type\":\"grouped_light\"},{\"dimming\":{\"brightness\":100.0},\"id\":\"91925fc3-1ef8-4012-a89e-7d0eee4a9ef8\",\"id_v1\":\"/groups/84\",\"on\":{\"on\":true},\"owner\":{\"rid\":\"23904fbd-1793-4e49-8ad2-d37479582df5\",\"rtype\":\"zone\"},\"type\":\"grouped_light\"},{\"dimming\":{\"brightness\":67.985},\"id\":\"cdab0abe-4281-476c-8237-13ad283f40d6\",\"id_v1\":\"/groups/0\",\"on\":{\"on\":true},\"owner\":{\"rid\":\"40c8849f-b339-4c21-8e49-d56cc86c508f\",\"rtype\":\"bridge_home\"},\"type\":\"grouped_light\"}],\"id\":\"d0446f08-b193-4173-b10d-870717e9eced\",\"type\":\"update\"},{\"creationtime\":\"2024-11-20T11:54:35Z\",\"data\":[{\"id\":\"4edd8b1a-9f51-4d2d-bf60-5e946092dcf4\",\"id_v1\":\"/lights/2\",\"on\":{\"on\":true},\"owner\":{\"rid\":\"225a4611-eff5-4719-b9e7-f3d7b8c0a9ce\",\"rtype\":\"device\"},\"service_id\":0,\"type\":\"light\"}],\"id\":\"3ece949e-eff6-48e8-adb0-9f08b8af29d3\",\"type\":\"update\"},{\"creationtime\":\"2024-11-20T11:54:35Z\",\"data\":[{\"dimming\":{\"brightness\":78.26},\"id\":\"3d49b003-567e-4613-a427-cff8e2becb98\",\"id_v1\":\"/groups/82\",\"on\":{\"on\":true},\"owner\":{\"rid\":\"af607bde-f1b6-4a34-b047-3e17a78ec494\",\"rtype\":\"room\"},\"type\":\"grouped_light\"},{\"dimming\":{\"brightness\":89.13},\"id\":\"91925fc3-1ef8-4012-a89e-7d0eee4a9ef8\",\"id_v1\":\"/groups/84\",\"owner\":{\"rid\":\"23904fbd-1793-4e49-8ad2-d37479582df5\",\"rtype\":\"zone\"},\"type\":\"grouped_light\"},{\"dimming\":{\"brightness\":71.41},\"id\":\"cdab0abe-4281-476c-8237-13ad283f40d6\",\"id_v1\":\"/groups/0\",\"owner\":{\"rid\":\"40c8849f-b339-4c21-8e49-d56cc86c508f\",\"rtype\":\"bridge_home\"},\"type\":\"grouped_light\"}],\"id\":\"5d914c4e-53c4-4f93-828d-76e46308c921\",\"type\":\"update\"},{\"creationtime\":\"2024-11-20T11:54:36Z\",\"data\":[{\"dimming\":{\"brightness\":80.63},\"id\":\"27659d91-3e9c-4f50-be07-8b194a798386\",\"id_v1\":\"/lights/3\",\"owner\":{\"rid\":\"16554f75-79ff-4719-94c7-2da19c5b08a4\",\"rtype\":\"device\"},\"service_id\":0,\"type\":\"light\"}],\"id\":\"766b4b8d-99e1-4868-932a-ae5e9c94f40e\",\"type\":\"update\"},{\"creationtime\":\"2024-11-20T11:54:36Z\",\"data\":[{\"dimming\":{\"brightness\":58.3},\"id\":\"251f41ee-2396-4aa9-b2c3-3ae0f47a8843\",\"id_v1\":\"/groups/81\",\"owner\":{\"rid\":\"624240dd-12ec-4c34-a243-7669f41c5e77\",\"rtype\":\"room\"},\"type\":\"grouped_light\"},{\"dimming\":{\"brightness\":79.445},\"id\":\"91925fc3-1ef8-4012-a89e-7d0eee4a9ef8\",\"id_v1\":\"/groups/84\",\"owner\":{\"rid\":\"23904fbd-1793-4e49-8ad2-d37479582df5\",\"rtype\":\"zone\"},\"type\":\"grouped_light\"},{\"dimming\":{\"brightness\":64.95333333333333},\"id\":\"cdab0abe-4281-476c-8237-13ad283f40d6\",\"id_v1\":\"/groups/0\",\"owner\":{\"rid\":\"40c8849f-b339-4c21-8e49-d56cc86c508f\",\"rtype\":\"bridge_home\"},\"type\":\"grouped_light\"}],\"id\":\"1827a644-88b8-4ce5-9e68-5c853c72db7b\",\"type\":\"update\"}]\n\nid: 1732103677:0\ndata: [{\"creationtime\":\"2024-11-20T11:54:36Z\",\"data\":[{\"id\":\"4edd8b1a-9f51-4d2d-bf60-5e946092dcf4\",\"id_v1\":\"/lights/2\",\"on\":{\"on\":false},\"owner\":{\"rid\":\"225a4611-eff5-4719-b9e7-f3d7b8c0a9ce\",\"rtype\":\"device\"},\"service_id\":0,\"type\":\"light\"}],\"id\":\"c031579d-ee7d-419f-82ce-08a869c128be\",\"type\":\"update\"},{\"creationtime\":\"2024-11-20T11:54:36Z\",\"data\":[{\"dimming\":{\"brightness\":0.0},\"id\":\"3d49b003-567e-4613-a427-cff8e2becb98\",\"id_v1\":\"/groups/82\",\"on\":{\"on\":false},\"owner\":{\"rid\":\"af607bde-f1b6-4a34-b047-3e17a78ec494\",\"rtype\":\"room\"},\"type\":\"grouped_light\"},{\"dimming\":{\"brightness\":80.63},\"id\":\"91925fc3-1ef8-4012-a89e-7d0eee4a9ef8\",\"id_v1\":\"/groups/84\",\"owner\":{\"rid\":\"23904fbd-1793-4e49-8ad2-d37479582df5\",\"rtype\":\"zone\"},\"type\":\"grouped_light\"},{\"dimming\":{\"brightness\":58.3},\"id\":\"cdab0abe-4281-476c-8237-13ad283f40d6\",\"id_v1\":\"/groups/0\",\"owner\":{\"rid\":\"40c8849f-b339-4c21-8e49-d56cc86c508f\",\"rtype\":\"bridge_home\"},\"type\":\"grouped_light\"}],\"id\":\"996b61e2-e30b-48a9-a310-11d4593f7fea\",\"type\":\"update\"}]\n\n";
    int message_length = strlen(message);
    http_data_t http_data = {0};

    uint8_t *temp_buffer = malloc(500);

    srand(time(NULL));

    int times_around = 0;

    while (message_position < message_length)
    {
        times_around++;

        // the chip I'm using, ESP32, is memory constrained and so I thought it would be a good idea to only
        // read a set amount of data at a time, but I don't really know how much data is reasonable in each chunk
        int read_length = rand() % 401;

        // This is supposed to simulate the buffer that is coming in from the HTTP Server Sent Stream
        // it probably is either going to be whatever my read length is OR less if the event data is complete,
        // but I don't know exactl how this is going to work so I'm just pretending random bits of the JSON
        // could come over as it seems worse case but not so much different from an alternative?
        for (int i = 0; i < read_length; i++)
        {
            temp_buffer[i] = message[message_position++];
        }

        temp_buffer[read_length] = '\0';
        http_data.index += read_length;
        http_data.buffer = realloc(http_data.buffer, http_data.index);
        strncpy(&http_data.buffer[http_data.index - read_length], temp_buffer, read_length);

        // now the http_data.buffer will just keep growing and growing, but what I want to do is
        // check to see if a full JSON "data" object has been received and if so grab just that JSON
        // and store it somewhere else for processing.
        // I also want to resize the http_data.buffer to remove the JSON that has been processed so
        // that it doesn't keep growing and growing.
        char *start = strstr(http_data.buffer, "data: [");
        while (start)
        {
            char *end = strstr(start, "]\n\n");
            if (end)
            {
                start += 6; // Move past the "data: ["
                end += 2;   // Move past the "]\n\n"
                int json_length = end - start;
                char *json_data = malloc(json_length + 1);
                strncpy(json_data, start, json_length);
                json_data[json_length] = '\0';

                printf("Full JSON object:\n%s\n", json_data);

                free(json_data);
                // Check if "data: [" is missing or the string is cut off at the beginning
                char *id_start = strstr(http_data.buffer, "id:");
                if (id_start && id_start < start)
                {
                    int discard_length = id_start - http_data.buffer;
                    int remaining_length = http_data.index - discard_length;
                    memmove(http_data.buffer, id_start, remaining_length);
                    http_data.index = remaining_length;
                    http_data.buffer = realloc(http_data.buffer, http_data.index + 1);
                    http_data.buffer[http_data.index] = '\0';
                    start = strstr(http_data.buffer, "data: [");
                }
                // Remove the processed JSON from the buffer
                int remaining_length = http_data.index - (end - http_data.buffer);
                printf("remaining_length = %d\n", remaining_length);
                printf("http_data.index = %d\n", http_data.index);
                printf("end = %d\n", end);
                printf("(end - http_data.buffer) = %d\n", (end - http_data.buffer));
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
    }

    printf("http_data.index = %d\n", http_data.index);
    printf("times_around = %d\n", times_around);
    printf("http_data.buffer = \n\n%s\n", http_data.buffer);

    free(http_data.buffer);
}
