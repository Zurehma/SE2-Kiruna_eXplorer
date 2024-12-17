import { WebSocket, WebSocketServer } from "ws";
import GraphConfig from "./graphConfig.mjs";

const clients = new Set();
const MESSAGE_TYPES = { updateNode: "update-node", updateConnection: "update-connection", updateConfiguration: "update-configuration" };

const initWebSocket = (httpServer) => {
  const wss = new WebSocketServer({ server: httpServer });

  wss.on("connection", (ws) => {
    clients.add(ws);

    if (ws.readyState === WebSocket.OPEN) {
      (async () => {
        const graphConfiguration = await GraphConfig.loadGraphConfiguration();
        ws.send(JSON.stringify({ messageType: MESSAGE_TYPES.updateConfiguration, ...graphConfiguration }));
      })();
    }

    ws.on("message", (message) => {
      handleMessage(message);
    });

    ws.on("close", () => {
      clients.delete(ws);
    });
  });
};

const broadcastMessage = (message) => {
  clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  });
};

const handleMessage = async (message) => {
  const data = JSON.parse(message);
  let elementType;

  if (data.messageType === MESSAGE_TYPES.updateConnection) {
    elementType = GraphConfig.ELEMENT_TYPES.connections;
  } else if (data.messageType === MESSAGE_TYPES.updateNode) {
    elementType = GraphConfig.ELEMENT_TYPES.nodes;
  }

  const content = { x: data.x, y: data.y };
  await GraphConfig.editGraphConfiguration(elementType, data.id, content);

  const graphConfiguration = await GraphConfig.loadGraphConfiguration();
  broadcastMessage({ messageType: MESSAGE_TYPES.updateConfiguration, ...graphConfiguration });
};

const WebSocketInterface = {
  initWebSocket,
};

export default WebSocketInterface;
