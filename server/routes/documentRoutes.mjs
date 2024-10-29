import { Router } from "express";
import Utility from "../utility.mjs";
import DocumentController from "../controllers/documentController.mjs";
import DocumentDAO from "../dao/documentDAO.mjs";

function DocumentRoutes() {
  this.router = new Router();
  this.documentController = new DocumentController();
  this.documentDAO = new DocumentDAO();

  this.getRouter = () => this.router;

  this.initRoutes = () => {
    this.router.get("/", Utility.isLoggedIn, async (req, res, next) => {
      try {
        const doc = await this.documentDAO.getDocuments();

        return res.status(200).json(doc);
      } catch (err) {
        return next(err);
      }
    });

    this.router.post("/", (req, res, next) => {});

    this.router.post("/:id/link", (req, res, next) => {});
  };
}

export default DocumentRoutes;
