import { Router } from "express";
import Utility from "../utility.mjs";
import DocumentController from "../controllers/documentController.mjs";

function DocumentRoutes() {
  this.router = new Router();
  this.documentController = new DocumentController();

  this.getRouter = () => this.router;

  this.initRoutes = () => {
    this.router.get("/", (req, res, next) => {});

    this.router.post("/", (req, res, next) => {});

    this.router.post("/:id/link", (req, res, next) => {});
  };
}

export default DocumentRoutes;
