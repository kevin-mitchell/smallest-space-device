import fastify from "fastify";
import cors from "@fastify/cors";
// import { hueSampleData } from "./hue-sample-data.js";

const server = fastify();

const corsOptions = {
  origin: "*",
  methods: "OPTIONS, GET, HEAD, PUT, PATCH, POST, DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  exposedHeaders: "Authorization",
};

await server.register(cors, {});
server.get("/", (req, reply) => {
  reply.type("text/html");
  reply.send(
    '<html><body><h1>hi.</h1><p><a href="/sse">server-sent-events</a><br /><a href="/ping">ping</a></p></body></html>'
  );
});
server.get("/ping", (req, reply) => {
  reply.send("pong");
});

let clients = [];

function eventsHandler(req, reply) {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };

  reply.raw.writeHead(200, headers);
  reply.raw.write(`: hi\n\n`);

  const clientId = req.id;
  const newClient = {
    id: clientId,
    response: reply,
  };

  clients.push(newClient);
  listenEvent();

  req.raw.on("close", () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter((client) => client.id !== clientId);
  });
}

function listenEvent() {
  const interval = setInterval(
    () => {
      clients.forEach((client) => {
        const sampleEntry =
          hueSampleData[Math.floor(Math.random() * hueSampleData.length)];
        client.response.raw.write(
          `id: ${sampleEntry.events[0].id}\ndata: ${JSON.stringify(
            sampleEntry.events[0].data
          )}\n\n`
        );
      });

      if (clients.length === 0) {
        clearInterval(interval);
      }
    },
    Math.random() < 0.1
      ? 10000
      : Math.floor(Math.random() * (2000 - 200 + 1)) + 200
  );
}

server.get("/sse", eventsHandler);

server.listen({ port: 1334, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

export const hueSampleData = [
  {
    description:
      "Turn off a room of lights. Example 1. These are the events that fire when I turn off a room of lights (only a single light in the room)",
    events: [
      {
        id: "1731886589:0",
        data: [
          {
            creationtime: "2024-11-17T23:36:29Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "6e45c83c-a291-4cdc-a9b5-3f6102574005",
            type: "update",
          },
        ],
      },
      {
        id: "1731886590:0",
        data: [
          {
            creationtime: "2024-11-17T23:36:29Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: false },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: false },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "eb14fb46-a1f5-4835-89e6-4a667090f7ef",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:36:30Z",
            data: [
              {
                dimming: { brightness: 6.72 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "d03eee02-9b00-4803-9880-7552cd476727",
            type: "update",
          },
        ],
      },
      {
        id: "1731886591:0",
        data: [
          {
            creationtime: "2024-11-17T23:36:31Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "c7a62a34-6432-44bf-b147-0e8dd40ef08c",
            type: "update",
          },
        ],
      },
    ],
  },
  {
    description:
      "Turn off a room of lights. Example 2. These are the events that fire when I turn off a room of lights (only a single light in the room)",
    events: [
      {
        id: "1731886794:0",
        data: [
          {
            creationtime: "2024-11-17T23:39:54Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "ad785c1b-b38e-4bc5-b65e-a56c30e3487e",
            type: "update",
          },
        ],
      },
      {
        id: "1731886795:0",
        data: [
          {
            creationtime: "2024-11-17T23:39:54Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: false },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: false },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "9b6b90a3-d483-403c-8d40-02958367e9de",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:39:55Z",
            data: [
              {
                dimming: { brightness: 33.6 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "0da64ff9-36d0-41b3-b1d2-bb3be8b5fbe8",
            type: "update",
          },
        ],
      },
      {
        id: "1731886796:0",
        data: [
          {
            creationtime: "2024-11-17T23:39:56Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "860d18f8-aafb-4a94-bf2b-11acd711ff4d",
            type: "update",
          },
        ],
      },
    ],
  },
  {
    description:
      "Turn on a room of lights. This is when I turn on a group of lights. Example 1: two data points vs 3",
    events: [
      {
        id: "1731886748:0",
        data: [
          {
            creationtime: "2024-11-17T23:39:08Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "107809ee-8121-4a5f-8960-cfd141f0ba8d",
            type: "update",
          },
        ],
      },
      {
        id: "1731886749:0",
        data: [
          {
            creationtime: "2024-11-17T23:39:08Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: true },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 100.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: true },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "5d998443-979e-4f87-be93-408b7dd526e5",
            type: "update",
          },
        ],
      },
    ],
  },
  {
    description:
      "Turn on a room of lights. This is when I turn on a group of lights. Example 2: three events",
    events: [
      {
        id: "1731886770:0",
        data: [
          {
            creationtime: "2024-11-17T23:39:30Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "bba141ef-56be-41d2-8528-554eec95d1f9",
            type: "update",
          },
        ],
      },
      {
        id: "1731886771:0",
        data: [
          {
            creationtime: "2024-11-17T23:39:30Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: true },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 100.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: true },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "e517f930-34d8-4bda-999d-fa03d60c0459",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:39:30Z",
            data: [
              {
                dimming: { brightness: 19.37 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "ce036ad8-0691-4975-9db9-afd653d8ca09",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:39:30Z",
            data: [
              {
                dimming: { brightness: 19.37 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 19.37 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "8eaf92b2-62c2-4ada-8a6c-ceeece75d9e3",
            type: "update",
          },
        ],
      },
      {
        id: "1731886772:0",
        data: [
          {
            creationtime: "2024-11-17T23:39:31Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "2401e77e-2c16-47ad-ac5c-4d50b3123ddb",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:39:31Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 100.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "135d58fe-f702-4951-ba6e-42ead16a8629",
            type: "update",
          },
        ],
      },
    ],
  },
  {
    description:
      "Turn on a room of lights. This is when I turn on a group of lights. Example 3: three events again",
    events: [
      {
        id: "1731886821:0",
        data: [
          {
            creationtime: "2024-11-17T23:40:21Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "b097db54-832a-4eec-b46a-3e36da4cc7ec",
            type: "update",
          },
        ],
      },
      {
        id: "1731886822:0",
        data: [
          {
            creationtime: "2024-11-17T23:40:21Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: true },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 100.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: true },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "e99dcfb3-e093-4d5a-b0e6-f46ce6267932",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:40:21Z",
            data: [
              {
                dimming: { brightness: 92.09 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "ced12f26-5557-4d0c-b072-f4a54095f50a",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:40:21Z",
            data: [
              {
                dimming: { brightness: 92.09 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 92.09 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "d63a3aeb-c3b9-4b43-b41c-be4e0a0b8f1f",
            type: "update",
          },
        ],
      },
      {
        id: "1731886823:0",
        data: [
          {
            creationtime: "2024-11-17T23:40:22Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "4d36f924-1154-428d-92a9-2d8ed3cac958",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:40:22Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 100.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "51d6a28a-234e-4f96-ab75-32459338b50b",
            type: "update",
          },
        ],
      },
    ],
  },
  {
    description:
      "Quickly turn on / off a room examples. In these examples I'll start with a known state and quickly turn on and off the lights for a while. I'll record all of the events. Example 1: Starting with lights turned off, ending with lights off. Here the lights in the \"Living room\" room are all off. I'll switch the lights on and off 10-15 times as rapidly as possible and end with the lights turned off.",
    events: [
      {
        id: "1731887041:0",
        data: [
          {
            creationtime: "2024-11-17T23:44:01Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "b710bf62-b326-4a42-a10c-cb5fd9625621",
            type: "update",
          },
        ],
      },
      {
        id: "1731887042:0",
        data: [
          {
            creationtime: "2024-11-17T23:44:02Z",
            data: [
              {
                dimming: { brightness: 24.9 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "6b23dea2-ab26-44d4-9ee8-77d3c77d46b7",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:02Z",
            data: [
              {
                dimming: { brightness: 24.9 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 24.9 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "2161e562-6975-47b0-8c52-968299c73113",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:02Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "93b7106e-8411-48ba-8292-45ba4743bd75",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:02Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: false },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: false },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "9435be46-5d1e-46f6-9992-8074ff32d1ed",
            type: "update",
          },
        ],
      },
      {
        id: "1731887043:0",
        data: [
          {
            creationtime: "2024-11-17T23:44:03Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "a7c74a81-225c-4c56-9fcb-02932d8cc0b1",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:03Z",
            data: [
              {
                dimming: { brightness: 24.9 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: true },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 24.9 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: true },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "d2774262-7dd7-46b9-9d14-9b1cc918515b",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:03Z",
            data: [
              {
                dimming: { brightness: 15.42 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "74d4f0fb-c804-4c2d-b423-5d9068203068",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:03Z",
            data: [
              {
                dimming: { brightness: 15.42 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 15.42 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "293a9412-18d6-45ae-bbce-3d736782a290",
            type: "update",
          },
        ],
      },
      {
        id: "1731887044:0",
        data: [
          {
            creationtime: "2024-11-17T23:44:04Z",
            data: [
              {
                dimming: { brightness: 71.94 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "8bcc4c99-7be1-4b81-885e-7b2f3b29c57f",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:04Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "a11d99c5-89f3-43e7-a789-1e33b890472c",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:04Z",
            data: [
              {
                dimming: { brightness: 71.94 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: true },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 71.94 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: true },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "27bc3c0a-2cc9-4aa3-b84a-2abe4ae7cdfa",
            type: "update",
          },
        ],
      },
      {
        id: "1731887045:0",
        data: [
          {
            creationtime: "2024-11-17T23:44:05Z",
            data: [
              {
                dimming: { brightness: 83.79 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "b9c1554c-c4dd-44a8-bbd7-48eb0ffca899",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:05Z",
            data: [
              {
                dimming: { brightness: 83.79 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 83.79 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "3d59e3eb-979b-410a-bca0-fa810704de09",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:05Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "2cfa89c6-6535-4552-ab78-d355a75572cc",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:05Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: false },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: false },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "b6f217f4-9995-4c58-a278-12bdb14b6dad",
            type: "update",
          },
        ],
      },
      {
        id: "1731887046:0",
        data: [
          {
            creationtime: "2024-11-17T23:44:06Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "294d0a55-b026-45f0-abc1-aa7affbddc4b",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:06Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "bc2ff87b-bb3a-4985-ab6c-acb8ea3d94b8",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:06Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: true },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 100.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: true },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "3a5393c5-ede1-4c3f-be91-2b923bad2369",
            type: "update",
          },
        ],
      },
      {
        id: "1731887047:0",
        data: [
          {
            creationtime: "2024-11-17T23:44:07Z",
            data: [
              {
                dimming: { brightness: 89.33 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "34552c3f-aa64-40e5-94ea-04fec75dc8da",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:07Z",
            data: [
              {
                dimming: { brightness: 89.33 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 89.33 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "bf102582-7483-40b2-9574-71ab7f2e3c3c",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:07Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "28589129-10dc-414e-9801-b39076fe5bde",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:07Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: false },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: false },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "08cd8312-a9f1-4f12-bc53-e43206f5d451",
            type: "update",
          },
        ],
      },
      {
        id: "1731887049:0",
        data: [
          {
            creationtime: "2024-11-17T23:44:08Z",
            data: [
              {
                dimming: { brightness: 47.04 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "dc24d37e-4f70-4b49-bb47-c7810541c848",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:08Z",
            data: [
              {
                dimming: { brightness: 47.04 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 47.04 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "a6dd9111-f257-44cb-a4a6-bff9e0dd5414",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:08Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "9bca2a68-71da-4d3a-9d73-18af7ccb7062",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:08Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: false },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: false },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "263eac4f-b969-42c5-a626-644e5f1f0383",
            type: "update",
          },
        ],
      },
      {
        id: "1731887050:0",
        data: [
          {
            creationtime: "2024-11-17T23:44:09Z",
            data: [
              {
                dimming: { brightness: 26.48 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "024717e9-0319-49c4-a6fc-5cffc38d3659",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:09Z",
            data: [
              {
                dimming: { brightness: 26.48 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 26.48 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "eef86b2e-f99a-492f-b278-dba8b459e582",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:09Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "546e45c6-354d-4a9f-b98d-552c1613a967",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:09Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: false },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: false },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "1e86c933-53a7-4aee-8fcb-f3bf3d7c2c2f",
            type: "update",
          },
        ],
      },
      {
        id: "1731887051:0",
        data: [
          {
            creationtime: "2024-11-17T23:44:10Z",
            data: [
              {
                dimming: { brightness: 27.67 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "86ee22cf-ebe7-41c6-a299-fd4afb34dbbe",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:10Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "f0fd84e2-e15b-4463-9161-1cd2c87ac986",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:10Z",
            data: [
              {
                dimming: { brightness: 27.67 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: true },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 27.67 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: true },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "8dd8ac0b-d4f6-409f-a38c-d09e94f69035",
            type: "update",
          },
        ],
      },
      {
        id: "1731887052:0",
        data: [
          {
            creationtime: "2024-11-17T23:44:11Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "5e34ce21-d5cb-4c7a-bc67-daed9f3b9d36",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:11Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 100.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "06951fef-e305-4ca6-bbe1-b9bbfd3a0003",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:11Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "8a3fcb17-b64e-4f69-9727-6020beebd1cc",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:11Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: false },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: false },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "0344cd6c-3f3f-4682-b85f-8093bdcdda75",
            type: "update",
          },
        ],
      },
      {
        id: "1731887053:0",
        data: [
          {
            creationtime: "2024-11-17T23:44:12Z",
            data: [
              {
                dimming: { brightness: 28.46 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "543fa448-59ca-4444-8dad-4efaeffd517f",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:12Z",
            data: [
              {
                dimming: { brightness: 28.46 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 28.46 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "3c28e251-89a4-4429-a986-1c291fe69368",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:12Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "c3eb527e-b2c5-441f-810b-51ca9d64629e",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:12Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: false },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: false },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "a2217c20-6b7e-415f-b4e4-d688feb63ff2",
            type: "update",
          },
        ],
      },
      {
        id: "1731887054:0",
        data: [
          {
            creationtime: "2024-11-17T23:44:13Z",
            data: [
              {
                dimming: { brightness: 33.2 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "49e99d3d-08e7-4d13-bee9-2ca58ee78c68",
            type: "update",
          },
        ],
      },
      {
        id: "1731887055:0",
        data: [
          {
            creationtime: "2024-11-17T23:44:14Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "049e50aa-c625-452f-843d-68ed90dd4568",
            type: "update",
          },
        ],
      },
      {
        id: "1731887056:0",
        data: [
          {
            creationtime: "2024-11-17T23:44:15Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "fee6b8d8-9c7c-4fea-b78a-6613b0c76876",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:15Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: true },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 100.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: true },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "bb1413a3-2009-42aa-bace-f2a9b200fab6",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:15Z",
            data: [
              {
                dimming: { brightness: 26.48 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "95766e07-4e32-4c93-96ee-9aeeca7bf3b8",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:15Z",
            data: [
              {
                dimming: { brightness: 26.48 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 26.48 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "9a9e7af9-047d-4b97-9333-dbfea43bdc5b",
            type: "update",
          },
        ],
      },
      {
        id: "1731887057:0",
        data: [
          {
            creationtime: "2024-11-17T23:44:16Z",
            data: [
              {
                dimming: { brightness: 26.48 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: true },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 26.48 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: true },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "a80db8fb-d1fa-4577-b8aa-a5e8785a5c9e",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:44:17Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "3210d4c6-1eb2-4ad6-b118-473c4d06bad5",
            type: "update",
          },
        ],
      },
      {
        id: "1731887058:0",
        data: [
          {
            creationtime: "2024-11-17T23:44:17Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: false },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: false },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "be7115e2-43b7-4eb2-8565-e92f5cd01742",
            type: "update",
          },
        ],
      },
      {
        id: "1731887059:0",
        data: [
          {
            creationtime: "2024-11-17T23:44:18Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "68f73cd6-6fcd-49e3-8305-f250214dae59",
            type: "update",
          },
        ],
      },
    ],
  },
  {
    description:
      "Quickly turn on / off a room examples. In these examples I'll start with a known state and quickly turn on and off the lights for a while. I'll record all of the events. Lights start off, end on. Switching \"Living room\" 10-15 times with random pauses in between, ending with lights on.",
    events: [
      {
        id: "1731887126:0",
        data: [
          {
            creationtime: "2024-11-17T23:45:26Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "23e0e957-a93f-4cf5-a6b1-0f57317077e5",
            type: "update",
          },
        ],
      },
      {
        id: "1731887127:0",
        data: [
          {
            creationtime: "2024-11-17T23:45:26Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "a805c37f-a749-4d1b-8ac4-eef8ec251917",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:45:26Z",
            data: [
              {
                dimming: { brightness: 72.33 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "19f69018-878d-4b90-8e10-4d3976b84f7e",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:45:26Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: false },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: false },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "44375a57-0a58-43f0-9a6b-956a51c94ec3",
            type: "update",
          },
        ],
      },
      {
        id: "1731887128:0",
        data: [
          {
            creationtime: "2024-11-17T23:45:27Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "97af54a9-c3c9-4d1e-9b45-4c0b867e250e",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:45:27Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: false },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: false },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "9507c8dc-c756-4991-abc0-6c00b7ddfd81",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:45:27Z",
            data: [
              {
                dimming: { brightness: 48.62 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "3e5e5f6e-2d1c-445d-bd78-13badb18ee1f",
            type: "update",
          },
        ],
      },
      {
        id: "1731887129:0",
        data: [
          {
            creationtime: "2024-11-17T23:45:28Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "5289ce63-c141-43de-8507-2f6363680916",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:45:28Z",
            data: [
              {
                dimming: { brightness: 48.62 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: true },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 48.62 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: true },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "f8218108-ec94-4619-b53a-8adfb0415fea",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:45:28Z",
            data: [
              {
                dimming: { brightness: 15.81 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "1a151fa0-d158-41ad-b646-7e577f3a6dab",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:45:28Z",
            data: [
              {
                dimming: { brightness: 15.81 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 15.81 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "3e81abeb-6aa7-47ab-bbed-c5d0140b4740",
            type: "update",
          },
        ],
      },
      {
        id: "1731887130:0",
        data: [
          {
            creationtime: "2024-11-17T23:45:29Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "bc4ada50-f7fc-4308-9ed3-87c843a9fb43",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:45:29Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: false },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: false },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "a3c8d036-329e-497a-b2cf-b495ffe67b26",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:45:30Z",
            data: [
              {
                dimming: { brightness: 46.64 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "24ab2979-9c95-4142-a136-7e3b1ea8917f",
            type: "update",
          },
        ],
      },
      {
        id: "1731887131:0",
        data: [
          {
            creationtime: "2024-11-17T23:45:30Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "20ca7897-6051-4860-ae71-26beafbb6ed8",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:45:30Z",
            data: [
              {
                dimming: { brightness: 46.64 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: true },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 46.64 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: true },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "bb37938d-5972-4657-928f-a1d9991c5cf1",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:45:31Z",
            data: [
              {
                dimming: { brightness: 28.46 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "12c3a389-2b14-4f0a-8797-2371cfbe1da4",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:45:31Z",
            data: [
              {
                dimming: { brightness: 28.46 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 28.46 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "39aada76-17bf-467a-9831-1e94ddf6fee2",
            type: "update",
          },
        ],
      },
      {
        id: "1731887132:0",
        data: [
          {
            creationtime: "2024-11-17T23:45:32Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "82d5fe47-081a-4417-8780-8d336af3c876",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:45:32Z",
            data: [
              {
                dimming: { brightness: 28.46 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: true },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 28.46 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: true },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "4b02326d-e3e7-40c4-bb4d-d5c7f05ae982",
            type: "update",
          },
        ],
      },
      {
        id: "1731887133:0",
        data: [
          {
            creationtime: "2024-11-17T23:45:32Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: false },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: false },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "3f04532d-06f1-4b06-9985-9cd3459c3db5",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:45:33Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "40020e5d-fb2b-43e7-a610-45f56a4354ec",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:45:33Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "22719190-7bcc-4105-b899-618b0acaefbd",
            type: "update",
          },
        ],
      },
      {
        id: "1731887134:0",
        data: [
          {
            creationtime: "2024-11-17T23:45:34Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "d2ae5c6f-aeee-4489-9155-b14b0e9c4755",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:45:34Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: true },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 100.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: true },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "0a93f950-830f-455a-b045-71d782278880",
            type: "update",
          },
        ],
      },
      {
        id: "1731887135:0",
        data: [
          {
            creationtime: "2024-11-17T23:45:35Z",
            data: [
              {
                dimming: { brightness: 98.42 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "a31446cc-8b65-4f4a-b12e-b774bf1638fa",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:45:35Z",
            data: [
              {
                dimming: { brightness: 98.42 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 98.42 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "516a6973-6ec9-4391-a2e5-4dc0ddf76cf2",
            type: "update",
          },
        ],
      },
      {
        id: "1731887136:0",
        data: [
          {
            creationtime: "2024-11-17T23:45:36Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "a2b03fdf-3989-4440-8f71-a718b6f8cfd1",
            type: "update",
          },
        ],
      },
      {
        id: "1731887137:0",
        data: [
          {
            creationtime: "2024-11-17T23:45:36Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 100.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "551194bb-311a-4c1b-a453-e333f37ed8e5",
            type: "update",
          },
        ],
      },
    ],
  },
  {
    description:
      "Quickly turn on / off a room examples. In these examples I'll start with a known state and quickly turn on and off the lights for a while. I'll record all of the events. Example 3: Starting on, ending on. Room starts on. I'll switch the \"Living room\" off then on exactly 8 times and end with the lights on.",
    events: [
      {
        id: "1731887346:0",
        data: [
          {
            creationtime: "2024-11-17T23:49:06Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "c14c6cdf-7c58-42a3-894b-b03711c35f8f",
            type: "update",
          },
        ],
      },
      {
        id: "1731887347:0",
        data: [
          {
            creationtime: "2024-11-17T23:49:06Z",
            data: [
              {
                dimming: { brightness: 54.55 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "dd0afb98-b9e3-44d5-bc2d-e0836fa63c67",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:49:07Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "30fa8450-14f9-45f9-abdd-a5930200261f",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:49:07Z",
            data: [
              {
                dimming: { brightness: 54.55 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: true },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 54.55 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: true },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "011779fd-b575-490d-8368-f63aef45063c",
            type: "update",
          },
        ],
      },
      {
        id: "1731887348:0",
        data: [
          {
            creationtime: "2024-11-17T23:49:07Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "60d4aa6a-39d3-47dd-8a42-12b50863ba75",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:49:07Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 100.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "b78d9545-a73a-4218-a959-57c3519f2bd3",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:49:08Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "2f9a905c-487c-47a9-a9bd-15aa4bbe229b",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:49:08Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: false },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: false },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "95f05cec-59c8-4152-8eaa-9c9efb9e1a0e",
            type: "update",
          },
        ],
      },
      {
        id: "1731887349:0",
        data: [
          {
            creationtime: "2024-11-17T23:49:08Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "3199fb32-2e9a-4907-ba3c-bd633ef2a41f",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:49:08Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: true },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 100.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: true },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "4bfba5c8-3b6e-4fc0-b925-0e69ec4b882a",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:49:08Z",
            data: [
              {
                dimming: { brightness: 3.95 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "db5a13a8-a158-4dea-b563-458a35b27531",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:49:09Z",
            data: [
              {
                dimming: { brightness: 3.95 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 3.95 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "3f77f684-5d41-4af9-b478-52e59dbeeaa0",
            type: "update",
          },
        ],
      },
      {
        id: "1731887350:0",
        data: [
          {
            creationtime: "2024-11-17T23:49:10Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "7b7f8b64-fd4e-4c99-b44e-73f0b3d6fe59",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:49:10Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 100.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "c5c80062-5585-4fcd-b218-bfbbd7f868d4",
            type: "update",
          },
        ],
      },
    ],
  },
  {
    description:
      "Switch individual light on and off causing room to turn off. In these examples I'll swap an individual light on or off, which should in turn cause the entire room to go off. Example 1: switch light from on to off. Note that this caused the entire room to turn off in the Hue UI.",
    events: [
      {
        id: "1731887411:0",
        data: [
          {
            creationtime: "2024-11-17T23:50:11Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "40ebb420-1100-4fff-8002-eb8aefc99152",
            type: "update",
          },
        ],
      },
      {
        id: "1731887412:0",
        data: [
          {
            creationtime: "2024-11-17T23:50:11Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: false },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: false },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "e9306c56-a0e4-4dcb-be25-2438d822d419",
            type: "update",
          },
        ],
      },
    ],
  },
  {
    description:
      "Switch individual light on and off causing room to turn off. In these examples I'll swap an individual light on or off, which should in turn cause the entire room to go off. Example 2: turn light on causing room to turn on",
    events: [
      {
        id: "1731887457:0",
        data: [
          {
            creationtime: "2024-11-17T23:50:57Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "009281cb-9408-4ba3-97cd-b332aba4f58a",
            type: "update",
          },
        ],
      },
      {
        id: "1731887458:0",
        data: [
          {
            creationtime: "2024-11-17T23:50:57Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: true },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 100.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: true },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "ab23062a-9b52-4138-9017-9bb9a62634a9",
            type: "update",
          },
        ],
      },
    ],
  },
  {
    description:
      "Switch individual light on and off causing room to turn off. In these examples I'll swap an individual light on or off, which should in turn cause the entire room to go off.Example 3: turn single light on and off rapidly, starting on and ending off",
    events: [
      {
        id: "1731887495:0",
        data: [
          {
            creationtime: "2024-11-17T23:51:35Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "75d68436-0875-4670-9085-bf8e93653764",
            type: "update",
          },
        ],
      },
      {
        id: "1731887496:0",
        data: [
          {
            creationtime: "2024-11-17T23:51:35Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "7ae85f67-e6f2-4f3d-a2e3-228041aa4dbd",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:51:36Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: false },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: false },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "401f97d6-61da-46f9-a69f-f93e15d19674",
            type: "update",
          },
        ],
      },
      {
        id: "1731887497:0",
        data: [
          {
            creationtime: "2024-11-17T23:51:37Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "795dccc6-d605-49a4-8d9b-bf77b59953b5",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:51:37Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: true },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 100.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: true },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "a56eea60-267d-49a9-b99e-d15ff1fc7415",
            type: "update",
          },
        ],
      },
      {
        id: "1731887498:0",
        data: [
          {
            creationtime: "2024-11-17T23:51:37Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "b367d427-682a-4cf7-944f-399b40345bf9",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:51:37Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: false },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: false },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "3220e3d2-1562-4379-8d59-1bee2db1e18b",
            type: "update",
          },
        ],
      },
      {
        id: "1731887499:0",
        data: [
          {
            creationtime: "2024-11-17T23:51:38Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "648b1796-fbb7-425d-a12a-5e478af72e72",
            type: "update",
          },
          {
            creationtime: "2024-11-17T23:51:38Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: false },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: false },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "8d8a734e-ecbc-4f58-a06f-e68d86870d0a",
            type: "update",
          },
        ],
      },
    ],
  },
  {
    description:
      'Multiple rooms and lights. These examples use multiple rooms and multiple lights in different configurations.  Example 1: Both off to on, one change for each room. This is "Livingroom" and "kitchen" from an off state to on.',
    events: [
      {
        id: "1732103162:0",
        data: [
          {
            creationtime: "2024-11-20T11:46:02Z",
            data: [
              {
                id: "27659d91-3e9c-4f50-be07-8b194a798386",
                id_v1: "/lights/3",
                on: { on: true },
                owner: {
                  rid: "16554f75-79ff-4719-94c7-2da19c5b08a4",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "3df08043-59eb-40a3-b307-65543da0f4b1",
            type: "update",
          },
        ],
      },
      {
        id: "1732103163:0",
        data: [
          {
            creationtime: "2024-11-20T11:46:02Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: true },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 100.0 },
                id: "91925fc3-1ef8-4012-a89e-7d0eee4a9ef8",
                id_v1: "/groups/84",
                on: { on: true },
                owner: {
                  rid: "23904fbd-1793-4e49-8ad2-d37479582df5",
                  rtype: "zone",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 100.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: true },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "f30e247e-1491-447b-b085-b70d1fd57f94",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:46:03Z",
            data: [
              {
                id: "4edd8b1a-9f51-4d2d-bf60-5e946092dcf4",
                id_v1: "/lights/2",
                on: { on: true },
                owner: {
                  rid: "225a4611-eff5-4719-b9e7-f3d7b8c0a9ce",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "844bd8e4-5a26-4f4c-9c8e-6e84cf94945f",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:46:03Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "3d49b003-567e-4613-a427-cff8e2becb98",
                id_v1: "/groups/82",
                on: { on: true },
                owner: {
                  rid: "af607bde-f1b6-4a34-b047-3e17a78ec494",
                  rtype: "room",
                },
                type: "grouped_light",
              },
            ],
            id: "fc1a8d40-0f62-4353-9ec4-036a8c6cb535",
            type: "update",
          },
        ],
      },
    ],
  },
  {
    description:
      'Multiple rooms and lights. These examples use multiple rooms and multiple lights in different configurations. Example 2: multiple rooms from on to off in quick succession. Three lights total, same as Example 4, at an "on" state to "off" with one single switch. I first siwtched the kitchen then the living room, but did it quickly.',
    events: [
      {
        id: "1732103307:0",
        data: [
          {
            creationtime: "2024-11-20T11:48:27Z",
            data: [
              {
                id: "4edd8b1a-9f51-4d2d-bf60-5e946092dcf4",
                id_v1: "/lights/2",
                on: { on: false },
                owner: {
                  rid: "225a4611-eff5-4719-b9e7-f3d7b8c0a9ce",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "a7e5684b-96d3-4ed0-8b47-7559d2616c4b",
            type: "update",
          },
        ],
      },
      {
        id: "1732103308:0",
        data: [
          {
            creationtime: "2024-11-20T11:48:27Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "3d49b003-567e-4613-a427-cff8e2becb98",
                id_v1: "/groups/82",
                on: { on: false },
                owner: {
                  rid: "af607bde-f1b6-4a34-b047-3e17a78ec494",
                  rtype: "room",
                },
                type: "grouped_light",
              },
            ],
            id: "d2480a51-c5ee-400e-baf7-751c6fec1fe8",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:48:28Z",
            data: [
              {
                id: "27659d91-3e9c-4f50-be07-8b194a798386",
                id_v1: "/lights/3",
                on: { on: false },
                owner: {
                  rid: "16554f75-79ff-4719-94c7-2da19c5b08a4",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "8bbf3d3f-b9f4-431e-bfd8-52fb2ea7ec5b",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:48:28Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: false },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "91925fc3-1ef8-4012-a89e-7d0eee4a9ef8",
                id_v1: "/groups/84",
                on: { on: false },
                owner: {
                  rid: "23904fbd-1793-4e49-8ad2-d37479582df5",
                  rtype: "zone",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: false },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "6b06a9fe-f01f-4c32-928b-da81272dc220",
            type: "update",
          },
        ],
      },
    ],
  },
  {
    description:
      "Multiple rooms and lights. These examples use multiple rooms and multiple lights in different configurations.  Example 3: livingroom start off -> on -> off then kitchen on then livingroom on. I did this slowly.",
    events: [
      {
        id: "1732103444:0",
        data: [
          {
            creationtime: "2024-11-20T11:50:44Z",
            data: [
              {
                id: "27659d91-3e9c-4f50-be07-8b194a798386",
                id_v1: "/lights/3",
                on: { on: true },
                owner: {
                  rid: "16554f75-79ff-4719-94c7-2da19c5b08a4",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "3e108aed-9f70-4551-b107-660ac7bf09ea",
            type: "update",
          },
        ],
      },
      {
        id: "1732103445:0",
        data: [
          {
            creationtime: "2024-11-20T11:50:44Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: true },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 100.0 },
                id: "91925fc3-1ef8-4012-a89e-7d0eee4a9ef8",
                id_v1: "/groups/84",
                on: { on: true },
                owner: {
                  rid: "23904fbd-1793-4e49-8ad2-d37479582df5",
                  rtype: "zone",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 100.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: true },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "8046a94a-2145-43dc-8d20-ccd925c18fa0",
            type: "update",
          },
        ],
      },
      {
        id: "1732103448:0",
        data: [
          {
            creationtime: "2024-11-20T11:50:48Z",
            data: [
              {
                id: "27659d91-3e9c-4f50-be07-8b194a798386",
                id_v1: "/lights/3",
                on: { on: false },
                owner: {
                  rid: "16554f75-79ff-4719-94c7-2da19c5b08a4",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "ea72593b-8127-4247-a84e-ba8686673950",
            type: "update",
          },
        ],
      },
      {
        id: "1732103449:0",
        data: [
          {
            creationtime: "2024-11-20T11:50:48Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: false },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "91925fc3-1ef8-4012-a89e-7d0eee4a9ef8",
                id_v1: "/groups/84",
                on: { on: false },
                owner: {
                  rid: "23904fbd-1793-4e49-8ad2-d37479582df5",
                  rtype: "zone",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: false },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "9175589b-80df-467c-92ed-17d0ad5077ef",
            type: "update",
          },
        ],
      },
      {
        id: "1732103451:0",
        data: [
          {
            creationtime: "2024-11-20T11:50:51Z",
            data: [
              {
                id: "4edd8b1a-9f51-4d2d-bf60-5e946092dcf4",
                id_v1: "/lights/2",
                on: { on: true },
                owner: {
                  rid: "225a4611-eff5-4719-b9e7-f3d7b8c0a9ce",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "bdcb3ac6-a848-4be0-b0ed-21133036253d",
            type: "update",
          },
        ],
      },
      {
        id: "1732103452:0",
        data: [
          {
            creationtime: "2024-11-20T11:50:51Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "3d49b003-567e-4613-a427-cff8e2becb98",
                id_v1: "/groups/82",
                on: { on: true },
                owner: {
                  rid: "af607bde-f1b6-4a34-b047-3e17a78ec494",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 100.0 },
                id: "91925fc3-1ef8-4012-a89e-7d0eee4a9ef8",
                id_v1: "/groups/84",
                on: { on: true },
                owner: {
                  rid: "23904fbd-1793-4e49-8ad2-d37479582df5",
                  rtype: "zone",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 100.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: true },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "62046bef-da95-4d6c-8c66-ec8e3fc0382e",
            type: "update",
          },
        ],
      },
      {
        id: "1732103454:0",
        data: [
          {
            creationtime: "2024-11-20T11:50:54Z",
            data: [
              {
                id: "27659d91-3e9c-4f50-be07-8b194a798386",
                id_v1: "/lights/3",
                on: { on: true },
                owner: {
                  rid: "16554f75-79ff-4719-94c7-2da19c5b08a4",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "2b266145-f39a-4457-b418-5f7606e3fb82",
            type: "update",
          },
        ],
      },
      {
        id: "1732103455:0",
        data: [
          {
            creationtime: "2024-11-20T11:50:54Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: true },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
            ],
            id: "064d08b1-4af3-453b-ab97-6b3cf094f08e",
            type: "update",
          },
        ],
      },
    ],
  },
  {
    description:
      "Multiple rooms and lights. These examples use multiple rooms and multiple lights in different configurations. Example 4: QUICKLY livingroom start off -> on -> off then kitchen on then livingroom on",
    events: [
      {
        id: "1732103587:0",
        data: [
          {
            creationtime: "2024-11-20T11:53:07Z",
            data: [
              {
                id: "27659d91-3e9c-4f50-be07-8b194a798386",
                id_v1: "/lights/3",
                on: { on: true },
                owner: {
                  rid: "16554f75-79ff-4719-94c7-2da19c5b08a4",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "eed38ea4-416d-4d37-9851-284e4941fa02",
            type: "update",
          },
        ],
      },
      {
        id: "1732103588:0",
        data: [
          {
            creationtime: "2024-11-20T11:53:07Z",
            data: [
              {
                dimming: { brightness: 63.64 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "62d9c7a5-b072-4961-afa1-e316eeb0c2c5",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:53:07Z",
            data: [
              {
                dimming: { brightness: 81.82 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 81.82 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "5078146c-be8d-41ee-b25a-3b0483f468c6",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:53:07Z",
            data: [
              {
                id: "27659d91-3e9c-4f50-be07-8b194a798386",
                id_v1: "/lights/3",
                on: { on: false },
                owner: {
                  rid: "16554f75-79ff-4719-94c7-2da19c5b08a4",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "b180bb37-9995-4152-8be0-76601f4f3026",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:53:08Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: false },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "91925fc3-1ef8-4012-a89e-7d0eee4a9ef8",
                id_v1: "/groups/84",
                on: { on: false },
                owner: {
                  rid: "23904fbd-1793-4e49-8ad2-d37479582df5",
                  rtype: "zone",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: false },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "2e61977c-ca3c-45b0-a224-cdd7bb246db0",
            type: "update",
          },
        ],
      },
      {
        id: "1732103589:0",
        data: [
          {
            creationtime: "2024-11-20T11:53:08Z",
            data: [
              {
                id: "4edd8b1a-9f51-4d2d-bf60-5e946092dcf4",
                id_v1: "/lights/2",
                on: { on: true },
                owner: {
                  rid: "225a4611-eff5-4719-b9e7-f3d7b8c0a9ce",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "8488db28-d5ba-47b8-84e2-73276e147279",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:53:08Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "3d49b003-567e-4613-a427-cff8e2becb98",
                id_v1: "/groups/82",
                on: { on: true },
                owner: {
                  rid: "af607bde-f1b6-4a34-b047-3e17a78ec494",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 100.0 },
                id: "91925fc3-1ef8-4012-a89e-7d0eee4a9ef8",
                id_v1: "/groups/84",
                on: { on: true },
                owner: {
                  rid: "23904fbd-1793-4e49-8ad2-d37479582df5",
                  rtype: "zone",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 100.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: true },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "564394b6-6d07-4e01-b910-46ce62f1264b",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:53:09Z",
            data: [
              {
                id: "27659d91-3e9c-4f50-be07-8b194a798386",
                id_v1: "/lights/3",
                on: { on: true },
                owner: {
                  rid: "16554f75-79ff-4719-94c7-2da19c5b08a4",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "3b379e38-f405-4905-ba62-3c62f4caed46",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:53:09Z",
            data: [
              {
                dimming: { brightness: 81.82 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: true },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 87.88 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "12549f37-092a-4c39-9ffa-eedd1220ac13",
            type: "update",
          },
        ],
      },
      {
        id: "1732103591:0",
        data: [
          {
            creationtime: "2024-11-20T11:53:11Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "a38c4df6-3226-4a08-86d0-6dc61025e462",
            type: "update",
          },
        ],
      },
      {
        id: "1732103592:0",
        data: [
          {
            creationtime: "2024-11-20T11:53:11Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 100.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "a4537def-086b-4f3f-aa5c-7425daa4177f",
            type: "update",
          },
        ],
      },
    ],
  },
  {
    description:
      "Multiple rooms and lights. These examples use multiple rooms and multiple lights in different configurations.  Example 5: Both on, then 10-20 seconds of off and on randomly, ending with kitchen on and livingroom off",
    events: [
      {
        id: "1732103670:0",
        data: [
          {
            creationtime: "2024-11-20T11:54:30Z",
            data: [
              {
                id: "27659d91-3e9c-4f50-be07-8b194a798386",
                id_v1: "/lights/3",
                on: { on: false },
                owner: {
                  rid: "16554f75-79ff-4719-94c7-2da19c5b08a4",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "230d8ae0-bb3f-4aa0-a159-fd132886cbde",
            type: "update",
          },
        ],
      },
      {
        id: "1732103671:0",
        data: [
          {
            creationtime: "2024-11-20T11:54:30Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: false },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
            ],
            id: "7d176b1c-0c5c-42b7-a45c-bc997269c9d7",
            type: "update",
          },
        ],
      },
      {
        id: "1732103672:0",
        data: [
          {
            creationtime: "2024-11-20T11:54:31Z",
            data: [
              {
                id: "4edd8b1a-9f51-4d2d-bf60-5e946092dcf4",
                id_v1: "/lights/2",
                on: { on: true },
                owner: {
                  rid: "225a4611-eff5-4719-b9e7-f3d7b8c0a9ce",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "5520ca96-2ed3-454d-9af0-4e97c97da4a2",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:31Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "3d49b003-567e-4613-a427-cff8e2becb98",
                id_v1: "/groups/82",
                on: { on: true },
                owner: {
                  rid: "af607bde-f1b6-4a34-b047-3e17a78ec494",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 100.0 },
                id: "91925fc3-1ef8-4012-a89e-7d0eee4a9ef8",
                id_v1: "/groups/84",
                on: { on: true },
                owner: {
                  rid: "23904fbd-1793-4e49-8ad2-d37479582df5",
                  rtype: "zone",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 100.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: true },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "dc502f89-f054-47fc-a153-15760afbbb6c",
            type: "update",
          },
        ],
      },
      {
        id: "1732103673:0",
        data: [
          {
            creationtime: "2024-11-20T11:54:32Z",
            data: [
              {
                id: "27659d91-3e9c-4f50-be07-8b194a798386",
                id_v1: "/lights/3",
                on: { on: true },
                owner: {
                  rid: "16554f75-79ff-4719-94c7-2da19c5b08a4",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "a7c5e450-dfa6-456b-a589-f6c7d8a2f132",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:32Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: true },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
            ],
            id: "e1373b0e-e498-42af-9b98-62110b34836b",
            type: "update",
          },
        ],
      },
      {
        id: "1732103674:0",
        data: [
          {
            creationtime: "2024-11-20T11:54:33Z",
            data: [
              {
                id: "4edd8b1a-9f51-4d2d-bf60-5e946092dcf4",
                id_v1: "/lights/2",
                on: { on: false },
                owner: {
                  rid: "225a4611-eff5-4719-b9e7-f3d7b8c0a9ce",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "e98ee43f-582b-4a9a-8dd8-051fb9f20676",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:33Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "3d49b003-567e-4613-a427-cff8e2becb98",
                id_v1: "/groups/82",
                on: { on: false },
                owner: {
                  rid: "af607bde-f1b6-4a34-b047-3e17a78ec494",
                  rtype: "room",
                },
                type: "grouped_light",
              },
            ],
            id: "b7d968c6-f38c-416b-9bb9-fb7bb4b871f2",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:33Z",
            data: [
              {
                dimming: { brightness: 78.26 },
                id: "4edd8b1a-9f51-4d2d-bf60-5e946092dcf4",
                id_v1: "/lights/2",
                owner: {
                  rid: "225a4611-eff5-4719-b9e7-f3d7b8c0a9ce",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "4418997b-d9a0-4a73-accf-7de7055a6fbb",
            type: "update",
          },
        ],
      },
      {
        id: "1732103675:0",
        data: [
          {
            creationtime: "2024-11-20T11:54:34Z",
            data: [
              {
                id: "27659d91-3e9c-4f50-be07-8b194a798386",
                id_v1: "/lights/3",
                on: { on: false },
                owner: {
                  rid: "16554f75-79ff-4719-94c7-2da19c5b08a4",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "63be561b-09fa-43d5-86bd-f1601570b0ab",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:34Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: false },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "91925fc3-1ef8-4012-a89e-7d0eee4a9ef8",
                id_v1: "/groups/84",
                on: { on: false },
                owner: {
                  rid: "23904fbd-1793-4e49-8ad2-d37479582df5",
                  rtype: "zone",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: false },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "0ce6a34d-d89d-4bf7-a5e5-5756cb164c9c",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:34Z",
            data: [
              {
                dimming: { brightness: 35.97 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "61fbbfde-486f-4236-876e-4d6a7757f6db",
            type: "update",
          },
        ],
      },
      {
        id: "1732103676:0",
        data: [
          {
            creationtime: "2024-11-20T11:54:35Z",
            data: [
              {
                id: "27659d91-3e9c-4f50-be07-8b194a798386",
                id_v1: "/lights/3",
                on: { on: true },
                owner: {
                  rid: "16554f75-79ff-4719-94c7-2da19c5b08a4",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "d548cd20-2d04-406b-b4c8-d63cac6ec851",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:35Z",
            data: [
              {
                dimming: { brightness: 67.985 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: true },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 100.0 },
                id: "91925fc3-1ef8-4012-a89e-7d0eee4a9ef8",
                id_v1: "/groups/84",
                on: { on: true },
                owner: {
                  rid: "23904fbd-1793-4e49-8ad2-d37479582df5",
                  rtype: "zone",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 67.985 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: true },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "d0446f08-b193-4173-b10d-870717e9eced",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:35Z",
            data: [
              {
                id: "4edd8b1a-9f51-4d2d-bf60-5e946092dcf4",
                id_v1: "/lights/2",
                on: { on: true },
                owner: {
                  rid: "225a4611-eff5-4719-b9e7-f3d7b8c0a9ce",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "3ece949e-eff6-48e8-adb0-9f08b8af29d3",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:35Z",
            data: [
              {
                dimming: { brightness: 78.26 },
                id: "3d49b003-567e-4613-a427-cff8e2becb98",
                id_v1: "/groups/82",
                on: { on: true },
                owner: {
                  rid: "af607bde-f1b6-4a34-b047-3e17a78ec494",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 89.13 },
                id: "91925fc3-1ef8-4012-a89e-7d0eee4a9ef8",
                id_v1: "/groups/84",
                owner: {
                  rid: "23904fbd-1793-4e49-8ad2-d37479582df5",
                  rtype: "zone",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 71.41 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "5d914c4e-53c4-4f93-828d-76e46308c921",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:36Z",
            data: [
              {
                dimming: { brightness: 80.63 },
                id: "27659d91-3e9c-4f50-be07-8b194a798386",
                id_v1: "/lights/3",
                owner: {
                  rid: "16554f75-79ff-4719-94c7-2da19c5b08a4",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "766b4b8d-99e1-4868-932a-ae5e9c94f40e",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:36Z",
            data: [
              {
                dimming: { brightness: 58.3 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 79.445 },
                id: "91925fc3-1ef8-4012-a89e-7d0eee4a9ef8",
                id_v1: "/groups/84",
                owner: {
                  rid: "23904fbd-1793-4e49-8ad2-d37479582df5",
                  rtype: "zone",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 64.95333333333333 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "1827a644-88b8-4ce5-9e68-5c853c72db7b",
            type: "update",
          },
        ],
      },
      {
        id: "1732103677:0",
        data: [
          {
            creationtime: "2024-11-20T11:54:36Z",
            data: [
              {
                id: "4edd8b1a-9f51-4d2d-bf60-5e946092dcf4",
                id_v1: "/lights/2",
                on: { on: false },
                owner: {
                  rid: "225a4611-eff5-4719-b9e7-f3d7b8c0a9ce",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "c031579d-ee7d-419f-82ce-08a869c128be",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:36Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "3d49b003-567e-4613-a427-cff8e2becb98",
                id_v1: "/groups/82",
                on: { on: false },
                owner: {
                  rid: "af607bde-f1b6-4a34-b047-3e17a78ec494",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 80.63 },
                id: "91925fc3-1ef8-4012-a89e-7d0eee4a9ef8",
                id_v1: "/groups/84",
                owner: {
                  rid: "23904fbd-1793-4e49-8ad2-d37479582df5",
                  rtype: "zone",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 58.3 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "996b61e2-e30b-48a9-a310-11d4593f7fea",
            type: "update",
          },
        ],
      },
      {
        id: "1732103678:0",
        data: [
          {
            creationtime: "2024-11-20T11:54:37Z",
            data: [
              {
                dimming: { brightness: 47.04 },
                id: "4edd8b1a-9f51-4d2d-bf60-5e946092dcf4",
                id_v1: "/lights/2",
                owner: {
                  rid: "225a4611-eff5-4719-b9e7-f3d7b8c0a9ce",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "e6dc7585-047c-4585-b695-61e41077b09d",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:37Z",
            data: [
              {
                id: "27659d91-3e9c-4f50-be07-8b194a798386",
                id_v1: "/lights/3",
                on: { on: false },
                owner: {
                  rid: "16554f75-79ff-4719-94c7-2da19c5b08a4",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "48eabb26-97ad-4d96-8ee8-e86ede73756f",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:37Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: false },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "91925fc3-1ef8-4012-a89e-7d0eee4a9ef8",
                id_v1: "/groups/84",
                on: { on: false },
                owner: {
                  rid: "23904fbd-1793-4e49-8ad2-d37479582df5",
                  rtype: "zone",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: false },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "551cb0b4-44cb-4377-9fd8-0f5b59b9cb89",
            type: "update",
          },
        ],
      },
      {
        id: "1732103679:0",
        data: [
          {
            creationtime: "2024-11-20T11:54:38Z",
            data: [
              {
                dimming: { brightness: 62.45 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "c5ba4b79-a1e5-4838-a6d6-ffe4ad704b88",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:38Z",
            data: [
              {
                id: "4edd8b1a-9f51-4d2d-bf60-5e946092dcf4",
                id_v1: "/lights/2",
                on: { on: true },
                owner: {
                  rid: "225a4611-eff5-4719-b9e7-f3d7b8c0a9ce",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "8ac38fbf-234f-4f96-a6cd-f7b023813c85",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:38Z",
            data: [
              {
                dimming: { brightness: 47.04 },
                id: "3d49b003-567e-4613-a427-cff8e2becb98",
                id_v1: "/groups/82",
                on: { on: true },
                owner: {
                  rid: "af607bde-f1b6-4a34-b047-3e17a78ec494",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 47.04 },
                id: "91925fc3-1ef8-4012-a89e-7d0eee4a9ef8",
                id_v1: "/groups/84",
                on: { on: true },
                owner: {
                  rid: "23904fbd-1793-4e49-8ad2-d37479582df5",
                  rtype: "zone",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 47.04 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: true },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "d80ed27f-2eb9-46b5-ae1b-c3433f5b1d6f",
            type: "update",
          },
        ],
      },
      {
        id: "1732103680:0",
        data: [
          {
            creationtime: "2024-11-20T11:54:39Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "27659d91-3e9c-4f50-be07-8b194a798386",
                id_v1: "/lights/3",
                owner: {
                  rid: "16554f75-79ff-4719-94c7-2da19c5b08a4",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "ae5a06d8-95c8-4d4b-b071-2312caafbae5",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:40Z",
            data: [
              {
                id: "4edd8b1a-9f51-4d2d-bf60-5e946092dcf4",
                id_v1: "/lights/2",
                on: { on: true },
                owner: {
                  rid: "225a4611-eff5-4719-b9e7-f3d7b8c0a9ce",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "fd58ed05-d7c0-4839-8898-949d74f9a5d8",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:40Z",
            data: [
              {
                dimming: { brightness: 47.04 },
                id: "3d49b003-567e-4613-a427-cff8e2becb98",
                id_v1: "/groups/82",
                on: { on: true },
                owner: {
                  rid: "af607bde-f1b6-4a34-b047-3e17a78ec494",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 47.04 },
                id: "91925fc3-1ef8-4012-a89e-7d0eee4a9ef8",
                id_v1: "/groups/84",
                on: { on: true },
                owner: {
                  rid: "23904fbd-1793-4e49-8ad2-d37479582df5",
                  rtype: "zone",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 47.04 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: true },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "ae602b60-7c1b-4abc-aaee-eae02bb8dbe9",
            type: "update",
          },
        ],
      },
      {
        id: "1732103681:0",
        data: [
          {
            creationtime: "2024-11-20T11:54:40Z",
            data: [
              {
                dimming: { brightness: 54.15 },
                id: "4edd8b1a-9f51-4d2d-bf60-5e946092dcf4",
                id_v1: "/lights/2",
                owner: {
                  rid: "225a4611-eff5-4719-b9e7-f3d7b8c0a9ce",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "447cfbb1-398d-49b1-81ae-2425cc4d42d1",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:40Z",
            data: [
              {
                dimming: { brightness: 54.15 },
                id: "3d49b003-567e-4613-a427-cff8e2becb98",
                id_v1: "/groups/82",
                owner: {
                  rid: "af607bde-f1b6-4a34-b047-3e17a78ec494",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 54.15 },
                id: "91925fc3-1ef8-4012-a89e-7d0eee4a9ef8",
                id_v1: "/groups/84",
                owner: {
                  rid: "23904fbd-1793-4e49-8ad2-d37479582df5",
                  rtype: "zone",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 54.15 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "ba1965a7-eb82-4bcd-b4a0-d16bca5778ef",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:40Z",
            data: [
              {
                id: "4edd8b1a-9f51-4d2d-bf60-5e946092dcf4",
                id_v1: "/lights/2",
                on: { on: false },
                owner: {
                  rid: "225a4611-eff5-4719-b9e7-f3d7b8c0a9ce",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "3214a0f9-4b08-4203-8971-49a25ff9b800",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:40Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "3d49b003-567e-4613-a427-cff8e2becb98",
                id_v1: "/groups/82",
                on: { on: false },
                owner: {
                  rid: "af607bde-f1b6-4a34-b047-3e17a78ec494",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "91925fc3-1ef8-4012-a89e-7d0eee4a9ef8",
                id_v1: "/groups/84",
                on: { on: false },
                owner: {
                  rid: "23904fbd-1793-4e49-8ad2-d37479582df5",
                  rtype: "zone",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: false },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "0dc1dd57-ef79-44a4-95a3-248733c1d996",
            type: "update",
          },
        ],
      },
      {
        id: "1732103682:0",
        data: [
          {
            creationtime: "2024-11-20T11:54:41Z",
            data: [
              {
                id: "4edd8b1a-9f51-4d2d-bf60-5e946092dcf4",
                id_v1: "/lights/2",
                on: { on: true },
                owner: {
                  rid: "225a4611-eff5-4719-b9e7-f3d7b8c0a9ce",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "db2caaad-8218-470e-85ce-09a6cb547277",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:41Z",
            data: [
              {
                dimming: { brightness: 54.15 },
                id: "3d49b003-567e-4613-a427-cff8e2becb98",
                id_v1: "/groups/82",
                on: { on: true },
                owner: {
                  rid: "af607bde-f1b6-4a34-b047-3e17a78ec494",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 54.15 },
                id: "91925fc3-1ef8-4012-a89e-7d0eee4a9ef8",
                id_v1: "/groups/84",
                on: { on: true },
                owner: {
                  rid: "23904fbd-1793-4e49-8ad2-d37479582df5",
                  rtype: "zone",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 54.15 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: true },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "8fdb3a04-bb67-4f39-a2fc-c8cbb9e719c0",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:41Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "b04b48cf-2d97-4b5a-8da7-9ea04c418c1d",
            type: "update",
          },
        ],
      },
      {
        id: "1732103683:0",
        data: [
          {
            creationtime: "2024-11-20T11:54:42Z",
            data: [
              {
                id: "4edd8b1a-9f51-4d2d-bf60-5e946092dcf4",
                id_v1: "/lights/2",
                on: { on: false },
                owner: {
                  rid: "225a4611-eff5-4719-b9e7-f3d7b8c0a9ce",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "093ef684-cc08-491a-9d8f-db9e749c8f7f",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:42Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "3d49b003-567e-4613-a427-cff8e2becb98",
                id_v1: "/groups/82",
                on: { on: false },
                owner: {
                  rid: "af607bde-f1b6-4a34-b047-3e17a78ec494",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "91925fc3-1ef8-4012-a89e-7d0eee4a9ef8",
                id_v1: "/groups/84",
                on: { on: false },
                owner: {
                  rid: "23904fbd-1793-4e49-8ad2-d37479582df5",
                  rtype: "zone",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: false },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "5958e29a-8212-44b8-9b9c-a6a1ec1991f3",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:42Z",
            data: [
              {
                id: "27659d91-3e9c-4f50-be07-8b194a798386",
                id_v1: "/lights/3",
                on: { on: true },
                owner: {
                  rid: "16554f75-79ff-4719-94c7-2da19c5b08a4",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "d6a0e4b0-af74-4b56-b808-b2bebdae2954",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:42Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: true },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 100.0 },
                id: "91925fc3-1ef8-4012-a89e-7d0eee4a9ef8",
                id_v1: "/groups/84",
                on: { on: true },
                owner: {
                  rid: "23904fbd-1793-4e49-8ad2-d37479582df5",
                  rtype: "zone",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 100.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: true },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "f8602a4a-abfb-4f27-8d01-790f5c53e52b",
            type: "update",
          },
        ],
      },
      {
        id: "1732103684:0",
        data: [
          {
            creationtime: "2024-11-20T11:54:43Z",
            data: [
              {
                id: "4edd8b1a-9f51-4d2d-bf60-5e946092dcf4",
                id_v1: "/lights/2",
                on: { on: true },
                owner: {
                  rid: "225a4611-eff5-4719-b9e7-f3d7b8c0a9ce",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "2d353808-fa12-47dc-b85a-e69098851bef",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:43Z",
            data: [
              {
                dimming: { brightness: 54.15 },
                id: "3d49b003-567e-4613-a427-cff8e2becb98",
                id_v1: "/groups/82",
                on: { on: true },
                owner: {
                  rid: "af607bde-f1b6-4a34-b047-3e17a78ec494",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 77.075 },
                id: "91925fc3-1ef8-4012-a89e-7d0eee4a9ef8",
                id_v1: "/groups/84",
                owner: {
                  rid: "23904fbd-1793-4e49-8ad2-d37479582df5",
                  rtype: "zone",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 84.71666666666667 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "5211cb8e-7f70-49fd-a84c-1da2a0ac0f00",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:43Z",
            data: [
              {
                dimming: { brightness: 26.48 },
                id: "4edd8b1a-9f51-4d2d-bf60-5e946092dcf4",
                id_v1: "/lights/2",
                owner: {
                  rid: "225a4611-eff5-4719-b9e7-f3d7b8c0a9ce",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "469c1e07-63d1-4530-aadf-f889609c4224",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:43Z",
            data: [
              {
                dimming: { brightness: 26.48 },
                id: "3d49b003-567e-4613-a427-cff8e2becb98",
                id_v1: "/groups/82",
                owner: {
                  rid: "af607bde-f1b6-4a34-b047-3e17a78ec494",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 63.24 },
                id: "91925fc3-1ef8-4012-a89e-7d0eee4a9ef8",
                id_v1: "/groups/84",
                owner: {
                  rid: "23904fbd-1793-4e49-8ad2-d37479582df5",
                  rtype: "zone",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 75.49333333333334 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "5d38a5bb-8808-4b18-af77-fdf2a76912ef",
            type: "update",
          },
        ],
      },
      {
        id: "1732103685:0",
        data: [
          {
            creationtime: "2024-11-20T11:54:45Z",
            data: [
              {
                id: "27659d91-3e9c-4f50-be07-8b194a798386",
                id_v1: "/lights/3",
                on: { on: false },
                owner: {
                  rid: "16554f75-79ff-4719-94c7-2da19c5b08a4",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "418c0435-4b90-41aa-abcf-75db4f57b2be",
            type: "update",
          },
        ],
      },
      {
        id: "1732103686:0",
        data: [
          {
            creationtime: "2024-11-20T11:54:45Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: false },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 26.48 },
                id: "91925fc3-1ef8-4012-a89e-7d0eee4a9ef8",
                id_v1: "/groups/84",
                owner: {
                  rid: "23904fbd-1793-4e49-8ad2-d37479582df5",
                  rtype: "zone",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 26.48 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "ee422ce7-4348-4df7-8e4f-a3e107d0afa5",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:45Z",
            data: [
              {
                id: "4edd8b1a-9f51-4d2d-bf60-5e946092dcf4",
                id_v1: "/lights/2",
                on: { on: false },
                owner: {
                  rid: "225a4611-eff5-4719-b9e7-f3d7b8c0a9ce",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "fe16e454-682e-46e7-b13a-ec1741a67adf",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:45Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "3d49b003-567e-4613-a427-cff8e2becb98",
                id_v1: "/groups/82",
                on: { on: false },
                owner: {
                  rid: "af607bde-f1b6-4a34-b047-3e17a78ec494",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "91925fc3-1ef8-4012-a89e-7d0eee4a9ef8",
                id_v1: "/groups/84",
                on: { on: false },
                owner: {
                  rid: "23904fbd-1793-4e49-8ad2-d37479582df5",
                  rtype: "zone",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: false },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "34ed255e-e760-456a-81c3-8bb6edfc1629",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:46Z",
            data: [
              {
                dimming: { brightness: 10.28 },
                id: "27659d91-3e9c-4f50-be07-8b194a798386",
                id_v1: "/lights/3",
                owner: {
                  rid: "16554f75-79ff-4719-94c7-2da19c5b08a4",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "8c23ac90-75db-4fed-b1f6-b75cca5e2d7a",
            type: "update",
          },
        ],
      },
      {
        id: "1732103687:0",
        data: [
          {
            creationtime: "2024-11-20T11:54:47Z",
            data: [
              {
                dimming: { brightness: 79.84 },
                id: "4edd8b1a-9f51-4d2d-bf60-5e946092dcf4",
                id_v1: "/lights/2",
                owner: {
                  rid: "225a4611-eff5-4719-b9e7-f3d7b8c0a9ce",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "55d5f6a5-85a3-4a98-8081-c2bb5f105261",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:47Z",
            data: [
              {
                id: "4edd8b1a-9f51-4d2d-bf60-5e946092dcf4",
                id_v1: "/lights/2",
                on: { on: false },
                owner: {
                  rid: "225a4611-eff5-4719-b9e7-f3d7b8c0a9ce",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "2448b054-5b93-4ac4-8039-d14766ef8dc6",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:47Z",
            data: [
              {
                dimming: { brightness: 79.84 },
                id: "3d49b003-567e-4613-a427-cff8e2becb98",
                id_v1: "/groups/82",
                owner: {
                  rid: "af607bde-f1b6-4a34-b047-3e17a78ec494",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 79.84 },
                id: "91925fc3-1ef8-4012-a89e-7d0eee4a9ef8",
                id_v1: "/groups/84",
                owner: {
                  rid: "23904fbd-1793-4e49-8ad2-d37479582df5",
                  rtype: "zone",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 79.84 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "50cec11d-894b-401a-a347-fd490e085076",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:47Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "3d49b003-567e-4613-a427-cff8e2becb98",
                id_v1: "/groups/82",
                on: { on: false },
                owner: {
                  rid: "af607bde-f1b6-4a34-b047-3e17a78ec494",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "91925fc3-1ef8-4012-a89e-7d0eee4a9ef8",
                id_v1: "/groups/84",
                on: { on: false },
                owner: {
                  rid: "23904fbd-1793-4e49-8ad2-d37479582df5",
                  rtype: "zone",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: false },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "bb7f8bb5-1871-4f9a-a858-b931f2155005",
            type: "update",
          },
        ],
      },
      {
        id: "1732103688:0",
        data: [
          {
            creationtime: "2024-11-20T11:54:47Z",
            data: [
              {
                id: "27659d91-3e9c-4f50-be07-8b194a798386",
                id_v1: "/lights/3",
                on: { on: true },
                owner: {
                  rid: "16554f75-79ff-4719-94c7-2da19c5b08a4",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "113e8909-2070-4d34-8299-9544292bc55c",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:48Z",
            data: [
              {
                dimming: { brightness: 55.14 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: true },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 10.28 },
                id: "91925fc3-1ef8-4012-a89e-7d0eee4a9ef8",
                id_v1: "/groups/84",
                on: { on: true },
                owner: {
                  rid: "23904fbd-1793-4e49-8ad2-d37479582df5",
                  rtype: "zone",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 55.14 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: true },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "e9493e8f-d451-417e-a0c1-daf554dd081d",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:48Z",
            data: [
              {
                dimming: { brightness: 30.04 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "e19aba94-f91b-4a2f-be74-066dc8748778",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:48Z",
            data: [
              {
                dimming: { brightness: 20.16 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 20.16 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "76935b60-d232-44ab-b496-8f109f1f4be1",
            type: "update",
          },
        ],
      },
      {
        id: "1732103689:0",
        data: [
          {
            creationtime: "2024-11-20T11:54:48Z",
            data: [
              {
                id: "27659d91-3e9c-4f50-be07-8b194a798386",
                id_v1: "/lights/3",
                on: { on: false },
                owner: {
                  rid: "16554f75-79ff-4719-94c7-2da19c5b08a4",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "e2d742bd-cdde-4de2-ab7d-698197d5c4dc",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:48Z",
            data: [
              {
                dimming: { brightness: 0.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: false },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "91925fc3-1ef8-4012-a89e-7d0eee4a9ef8",
                id_v1: "/groups/84",
                on: { on: false },
                owner: {
                  rid: "23904fbd-1793-4e49-8ad2-d37479582df5",
                  rtype: "zone",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 0.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: false },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "3c4602d2-2d04-47ed-a353-bf66f27ca9aa",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:49Z",
            data: [
              {
                id: "4edd8b1a-9f51-4d2d-bf60-5e946092dcf4",
                id_v1: "/lights/2",
                on: { on: true },
                owner: {
                  rid: "225a4611-eff5-4719-b9e7-f3d7b8c0a9ce",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "44da166a-ba61-41c4-b6d2-98671aa5d55f",
            type: "update",
          },
        ],
      },
      {
        id: "1732103690:0",
        data: [
          {
            creationtime: "2024-11-20T11:54:49Z",
            data: [
              {
                dimming: { brightness: 79.84 },
                id: "3d49b003-567e-4613-a427-cff8e2becb98",
                id_v1: "/groups/82",
                on: { on: true },
                owner: {
                  rid: "af607bde-f1b6-4a34-b047-3e17a78ec494",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 79.84 },
                id: "91925fc3-1ef8-4012-a89e-7d0eee4a9ef8",
                id_v1: "/groups/84",
                on: { on: true },
                owner: {
                  rid: "23904fbd-1793-4e49-8ad2-d37479582df5",
                  rtype: "zone",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 79.84 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                on: { on: true },
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "8b1f3650-4db2-4d26-8d73-d0fbe8a4334f",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:49Z",
            data: [
              {
                dimming: { brightness: 5.93 },
                id: "27659d91-3e9c-4f50-be07-8b194a798386",
                id_v1: "/lights/3",
                owner: {
                  rid: "16554f75-79ff-4719-94c7-2da19c5b08a4",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "de664bf4-00a9-4995-81c7-d05955215148",
            type: "update",
          },
        ],
      },
      {
        id: "1732103691:0",
        data: [
          {
            creationtime: "2024-11-20T11:54:50Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "4edd8b1a-9f51-4d2d-bf60-5e946092dcf4",
                id_v1: "/lights/2",
                owner: {
                  rid: "225a4611-eff5-4719-b9e7-f3d7b8c0a9ce",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "c79c3177-3957-491e-9cf0-6d91f64bd43f",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:54:50Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "3d49b003-567e-4613-a427-cff8e2becb98",
                id_v1: "/groups/82",
                owner: {
                  rid: "af607bde-f1b6-4a34-b047-3e17a78ec494",
                  rtype: "room",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 100.0 },
                id: "91925fc3-1ef8-4012-a89e-7d0eee4a9ef8",
                id_v1: "/groups/84",
                owner: {
                  rid: "23904fbd-1793-4e49-8ad2-d37479582df5",
                  rtype: "zone",
                },
                type: "grouped_light",
              },
              {
                dimming: { brightness: 100.0 },
                id: "cdab0abe-4281-476c-8237-13ad283f40d6",
                id_v1: "/groups/0",
                owner: {
                  rid: "40c8849f-b339-4c21-8e49-d56cc86c508f",
                  rtype: "bridge_home",
                },
                type: "grouped_light",
              },
            ],
            id: "3e06a02c-91f1-4466-9450-7aa4f76dbe95",
            type: "update",
          },
        ],
      },
      {
        id: "1732103692:0",
        data: [
          {
            creationtime: "2024-11-20T11:54:51Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "900ee306-e9f7-4a2b-8509-f2dacf72466a",
            type: "update",
          },
        ],
      },
      {
        id: "1732103693:0",
        data: [
          {
            creationtime: "2024-11-20T11:54:52Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "27659d91-3e9c-4f50-be07-8b194a798386",
                id_v1: "/lights/3",
                owner: {
                  rid: "16554f75-79ff-4719-94c7-2da19c5b08a4",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "636cf9ca-d511-4da6-8e0a-ff8fde5b7a44",
            type: "update",
          },
        ],
      },
    ],
  },
  {
    description:
      "Multiple rooms and lights. These examples use multiple rooms and multiple lights in different configurations. Example 6: Livingroom off -> on then only one light off and on toggle for a bit then end off. So the end state is the livingroom is partially on, with one light being toggled off and on but left off",
    events: [
      {
        id: "1732103806:0",
        data: [
          {
            creationtime: "2024-11-20T11:56:46Z",
            data: [
              {
                id: "27659d91-3e9c-4f50-be07-8b194a798386",
                id_v1: "/lights/3",
                on: { on: true },
                owner: {
                  rid: "16554f75-79ff-4719-94c7-2da19c5b08a4",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "8f71ae26-6103-4425-9e60-46afb9d48e3e",
            type: "update",
          },
        ],
      },
      {
        id: "1732103807:0",
        data: [
          {
            creationtime: "2024-11-20T11:56:46Z",
            data: [
              {
                dimming: { brightness: 100.0 },
                id: "251f41ee-2396-4aa9-b2c3-3ae0f47a8843",
                id_v1: "/groups/81",
                on: { on: true },
                owner: {
                  rid: "624240dd-12ec-4c34-a243-7669f41c5e77",
                  rtype: "room",
                },
                type: "grouped_light",
              },
            ],
            id: "54de0511-53d4-494d-abe2-6da952edb073",
            type: "update",
          },
          {
            creationtime: "2024-11-20T11:56:47Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "309b3f76-7bbe-44fa-87cc-f099ed90bd09",
            type: "update",
          },
        ],
      },
      {
        id: "1732103808:0",
        data: [
          {
            creationtime: "2024-11-20T11:56:47Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "be9431ad-8b4e-4ef0-9d4c-caa2cccf71b4",
            type: "update",
          },
        ],
      },
      {
        id: "1732103809:0",
        data: [
          {
            creationtime: "2024-11-20T11:56:49Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "3f667967-52ec-4b45-b5ac-ffeb49fad80a",
            type: "update",
          },
        ],
      },
      {
        id: "1732103810:0",
        data: [
          {
            creationtime: "2024-11-20T11:56:50Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "97d9fbec-db15-4d6b-b847-1fa4db2fb4e1",
            type: "update",
          },
        ],
      },
      {
        id: "1732103811:0",
        data: [
          {
            creationtime: "2024-11-20T11:56:50Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "d43aa9f4-e978-4529-afea-9d11aea58447",
            type: "update",
          },
        ],
      },
      {
        id: "1732103812:0",
        data: [
          {
            creationtime: "2024-11-20T11:56:52Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "72b3e4a5-c627-4ded-9874-ddfec177c3be",
            type: "update",
          },
        ],
      },
      {
        id: "1732103813:0",
        data: [
          {
            creationtime: "2024-11-20T11:56:53Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "13d1da53-c588-417c-be38-05f3da3f8646",
            type: "update",
          },
        ],
      },
      {
        id: "1732103814:0",
        data: [
          {
            creationtime: "2024-11-20T11:56:54Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "b676fe78-af2b-4729-bdeb-393e73c392f0",
            type: "update",
          },
        ],
      },
      {
        id: "1732103815:0",
        data: [
          {
            creationtime: "2024-11-20T11:56:55Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: true },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "45c71dcf-69eb-441b-856f-9a23da40b3f8",
            type: "update",
          },
        ],
      },
      {
        id: "1732103816:0",
        data: [
          {
            creationtime: "2024-11-20T11:56:56Z",
            data: [
              {
                id: "e6451da5-3c76-4760-b0bd-dca3175cee40",
                id_v1: "/lights/1",
                on: { on: false },
                owner: {
                  rid: "5f017829-e3b6-49e7-b50d-545e4d2bf6c7",
                  rtype: "device",
                },
                service_id: 0,
                type: "light",
              },
            ],
            id: "3397b253-8e3f-40bc-b263-5093414ab961",
            type: "update",
          },
        ],
      },
    ],
  },
];
