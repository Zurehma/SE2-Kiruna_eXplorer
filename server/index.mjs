/**
 * Express app entry point
 */

import { createServer } from "http";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import Utility from "./utils/utility.mjs";
import DocumentRoutes from "./routes/documentRoutes.mjs";
import AttachmentRoutes from "./routes/attachmentRoutes.mjs";
import AuthRoutes from "./routes/authRoutes.mjs";

const app = express();
const port = 3001;
const baseURL = "/api";
const ORIGIN_SOURCE = process?.env?.NODE_ENV?.trim() === "production" ? "http://localhost:3000" : "http://localhost:5173";
const corsOptions = {
  origin: ORIGIN_SOURCE,
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

const httpServer = createServer(app);

httpServer.listen(port, () => console.log(`Server running at http://localhost:${port}`));

export { app };
