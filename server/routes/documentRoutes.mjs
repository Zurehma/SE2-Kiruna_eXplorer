import { Router } from "express";
import { body } from "express-validator";
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

    this.router.post(
      "/",
      body("title").isString().notEmpty(),
      body("stakeholder").isString().notEmpty(),
      body("scale").isInt({ gt: 0 }),
      body("issuanceDate").isISO8601({ strict: true }),
      body("type").isString().notEmpty(),
      body("language").isString().notEmpty(),
      body("description").isString().notEmpty(),
      body("pages").isInt({ gt: 0 }).optional(),
      body("lat").isLatLong().optional(),
      body("long").isLatLong().optional(),
      Utility.validateRequest,
      (req, res, next) => {
        this.documentController
          .addDocument(
            req.body.title,
            req.body.stakeholder,
            req.body.scale,
            req.body.issuanceDate,
            req.body.type,
            req.body.language,
            req.body.description,
            req.body.pages || null,
            req.body.lat || null,
            req.body.long || null
          )
          .then((document) => res.status(200).json(document))
          .catch((err) => next(err));
      }
    );

    this.router.post("/:id/link", (req, res, next) => {});
  };
}

export default DocumentRoutes;
