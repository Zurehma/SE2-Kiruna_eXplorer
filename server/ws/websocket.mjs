import { WebSocket, WebSocketServer } from "ws";
import fs from "fs";

const clients = new Set();

const graphConfigFilePath = "./ws/GraphConfig.json";

const loadGraphConfiguration = async () => {
  if (!fs.existsSync(graphConfigFilePath)) {
    await fs.promises.writeFile(graphConfigFilePath, JSON.stringify({}), "utf8");
  }

  const graphConfig = await fs.promises.readFile(graphConfigFilePath, "utf8");
  return JSON.parse(graphConfig);
};

const editGraphConfiguration = async (docId, x, y) => {
  const graphConfig = await loadGraphConfiguration();

  graphConfig[docId] = { x, y };
  await fs.promises.writeFile(graphConfigFilePath, JSON.stringify(graphConfig), "utf8");
};

const initWebSocket = (httpServer) => {
  const wss = new WebSocketServer({ server: httpServer });

  wss.on("connection", (ws) => {
    clients.add(ws);

    if (ws.readyState === WebSocket.OPEN) {
      (async () => {
        const graphConfiguration = await loadGraphConfiguration();
        ws.send(JSON.stringify(graphConfiguration));
      })();
    }

    ws.on("message", (data) => {
      const { docId, x, y } = JSON.parse(data);

      (async () => {
        await editGraphConfiguration(docId, x, y);
        const graphConfiguration = await loadGraphConfiguration();
        broadcastMessage(graphConfiguration);
      })();
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
