import { WebSocket, WebSocketServer } from "ws";
import fs from "fs";

const clients = new Set();
const graphConfigFilePath = "./ws/GraphConfig.json";
const MESSAGE_TYPES = { updateNode: "update-node", updateConnection: "update-connection", updateConfiguration: "update-configuration" };
const ELEMENT_TYPES = { nodes: "nodes", connections: "connections" };

const loadGraphConfiguration = async () => {
  if (!fs.existsSync(graphConfigFilePath)) {
    const baseSetup = {};
    Object.values(ELEMENT_TYPES).forEach((element) => (baseSetup[element] = {}));
    console.log(baseSetup);
    await fs.promises.writeFile(graphConfigFilePath, JSON.stringify(baseSetup), "utf8");
  }

  const graphConfig = await fs.promises.readFile(graphConfigFilePath, "utf8");
  return JSON.parse(graphConfig);
};

const editGraphConfiguration = async (type, id, content) => {
  const graphConfig = await loadGraphConfiguration();

  graphConfig[type][id] = content;
  await fs.promises.writeFile(graphConfigFilePath, JSON.stringify(graphConfig), "utf8");
};

const handleMessage = async (message) => {
  const data = JSON.parse(message);
  let elementType;

  if (data.messageType === MESSAGE_TYPES.updateConnection) {
    elementType = ELEMENT_TYPES.connections;
  } else if (data.messageType === MESSAGE_TYPES.updateNode) {
    elementType = ELEMENT_TYPES.nodes;
  }

  const content = { x: data.x, y: data.y };
  await editGraphConfiguration(elementType, data.id, content);

  const graphConfiguration = await loadGraphConfiguration();
  broadcastMessage({ messageType: MESSAGE_TYPES.updateConfiguration, ...graphConfiguration });
};

const initWebSocket = (httpServer) => {
  const wss = new WebSocketServer({ server: httpServer });

  wss.on("connection", (ws) => {
    clients.add(ws);

    if (ws.readyState === WebSocket.OPEN) {
      (async () => {
        const graphConfiguration = await loadGraphConfiguration();
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

const WebSocketInterface = {
  initWebSocket,
};

export default WebSocketInterface;
