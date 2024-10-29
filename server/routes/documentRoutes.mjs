import { Router } from "express";
import { body } from "express-validator";
import Utility from "../utility.mjs";
import DocumentController from "../controllers/documentController.mjs";

function DocumentRoutes() {
  this.router = new Router();
  this.documentController = new DocumentController();

  this.getRouter = () => this.router;

  this.initRoutes = () => {
    this.router.get("/", (req, res, next) => {});

    this.router.post(
      "/",
      Utility.isLoggedIn,
      body("title").isString().notEmpty(),
      body("stakeholder").isString().notEmpty(),
      body("scale").isInt({ gt: 0 }),
      body("issuanceDate").isISO8601({ strict: true }),
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
