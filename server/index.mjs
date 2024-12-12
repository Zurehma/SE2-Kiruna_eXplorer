/**
 * Express app entry point
 */

import { createServer } from "http";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import WebSocketInterface from "./ws/websocket.mjs";
import Utility from "./utils/utility.mjs";
import DocumentRoutes from "./routes/documentRoutes.mjs";
import AttachmentRoutes from "./routes/attachmentRoutes.mjs";
import AuthRoutes from "./routes/authRoutes.mjs";

const app = express();
const httpServer = createServer(app);
WebSocketInterface.initWebSocket(httpServer);
const { PORT = 3001 } = process.env;
const baseURL = "/api";
const allowedOrigins = ["http://localhost:3000", "http://localhost:5173", "http://frontend:3000", "http://backend:3001"];
const corsOptions = {
  origin: allowedOrigins,
  optionsSuccessStatus: 200,
  preflightContinue: false,
  credentials: true,
};

app.use(morgan("dev"));
app.use(express.json({ limit: "25mb" }));
app.use(cors(corsOptions));
app.use(bodyParser.json());

const documentRoutes = new DocumentRoutes();
documentRoutes.initRoutes();

const attachmentRoutes = new AttachmentRoutes();
attachmentRoutes.initRoutes();

const authRoutes = new AuthRoutes(app);
authRoutes.initRoutes();

app.use(baseURL + "/uploads", Utility.isLoggedIn, express.static("./uploads"));
app.use(baseURL + "/documents", documentRoutes.getRouter());
app.use(baseURL + "/documents", attachmentRoutes.getRouter());
app.use(baseURL + "/sessions", authRoutes.getRouter());

app.use(Utility.errorHandler);

httpServer.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

export { app };
