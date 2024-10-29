/**
 * Express app entry point
 */

import { createServer } from "http";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";

import Utility from "./utility.mjs";
import DocumentRoutes from "./routes/documentRoutes.mjs";
import AuthRoutes from "./routes/authRoutes.mjs";

const app = express();
const port = 3001;
const baseURL = "/api";
const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(morgan("dev"));
app.use(express.json({ limit: "25mb" }));
app.use(cors(corsOptions));
app.use(bodyParser.json());

const documentRoutes = new DocumentRoutes();
documentRoutes.initRoutes();

const authRoutes = new AuthRoutes(app);
authRoutes.initRoutes();

app.use(baseURL + "/documents", documentRoutes.getRouter());
app.use(baseURL + "/sessions", authRoutes.getRouter());

app.use(Utility.errorHandler);

const httpServer = createServer(app);

httpServer.listen(port, () => console.log(`Server running at http://localhost:${port}`));
