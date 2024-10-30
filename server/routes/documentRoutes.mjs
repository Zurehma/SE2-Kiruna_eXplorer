import { Router } from "express";
import { body,param } from "express-validator";
import Utility from "../utility.mjs";
import DocumentController from "../controllers/documentController.mjs";
import DocumentDAO from "../dao/documentDAO.mjs";

class DocumentRoutes {
  constructor() {
    this.router = new Router();
    this.documentController = new DocumentController();
  }

  getRouter = () => this.router;

  initRoutes = () => {
    this.router.get("/", async (req, res, next) => {
      try {
        const doc = await this.documentController.getDocuments();

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
          .then((document) => {
            res.status(200).json(document);
          })
          .catch((err) => next(err));
      }
    );

    this.router.post("/:id/link",
    param("id").isInt({ gt: 0 }),
    body("id2").isInt({ gt: 0 }).notEmpty(),
    body("type").isString().notEmpty(),
    Utility.validateRequest,
    Utility.isLoggedIn,
    (req, res, next) => {
      this.documentController
      .addLink(req.params.id, req.body.id2, req.body.type)
      .then((link) => {
        // Assuming link resolves successfully, send the response
        res.status(200).json({
          id1: req.params.id,
          id2: req.body.id2,
          type: req.body.type,
        });
      })
      .catch((err) => {
        next(err); // Pass the error to the error handling middleware
      });
    });


  };
}

export default DocumentRoutes;
