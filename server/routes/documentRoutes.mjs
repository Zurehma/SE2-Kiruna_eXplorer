import { Router } from "express";
import { body, param, oneOf } from "express-validator";
import Utility from "../utility.mjs";
import DocumentController from "../controllers/documentController.mjs";

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
      Utility.isLoggedIn,
      body("title").isString().notEmpty(),
      body("stakeholder").isString().notEmpty(),
      oneOf([body("scale").isString().notEmpty(), body("scale").isInt({ gt: 0 })]),
      body("type").isString().notEmpty(),
      body("language").isString().notEmpty(),
      body("description").isString().notEmpty(),
      body("coordinates")
        .optional()
        .isJSON()
        .custom((value) => {
          const lat = value.lat;
          const long = value.long;
          const numProperties = Object.keys(value).length;

          if (lat == undefined || long == undefined || numProperties !== 2) {
            throw new Error("Invalid coordinates object!");
          }

          if (lat > 90 || lat < -90 || long > 180 || long < -180) {
            throw new Error("Invalid latitude and longitude values!");
          }

          return true;
        }),
      body("pages").optional().isInt({ gt: 0 }),
      body("pageFrom").optional().isInt({ gt: 0 }),
      body("pageTo").optional().isInt({ gt: 0 }),
      body().custom((value, { req }) => {
        const pages = req.body.pages;
        const pageFrom = req.body.pageFrom;
        const pageTo = req.body.pageTo;

        if ((pages && pageFrom) || (pages && pageTo)) {
          throw new Error("");
        }

        if ((pageFrom || pageTo) && !(pageFrom && pageTo)) {
          throw new Error("");
        }

        return true;
      }),
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
            req.body.coordinates || null,
            req.body.pages || null,
            req.body.pageFrom || null,
            req.body.pageTo || null
          )
          .then((document) => {
            res.status(200).json(document);
          })
          .catch((err) => next(err));
      }
    );

    this.router.get("/document-types", Utility.isLoggedIn, (req, res, next) => {
      this.documentController
        .getDocumentTypes()
        .then((documentTypes) => res.status(200).json(documentTypes))
        .catch((err) => next(err));
    });

    this.router.get("/scale-types", Utility.isLoggedIn, (req, res, next) => {
      this.documentController
        .getScaleTypes()
        .then((scaleTypes) => res.status(200).json(scaleTypes))
        .catch((err) => next(err));
    });

    this.router.get("/link-types", Utility.isLoggedIn, (req, res, next) => res.status(200).json(this.documentController.getLinkTypes()));

    this.router.post(
      "/link",
      body("id1").isInt({ gt: 0 }),
      body("id2").isInt({ gt: 0 }).notEmpty(),
      body("type").isString().notEmpty(),
      Utility.validateRequest,
      Utility.isLoggedIn,
      (req, res, next) => {
        this.documentController
          .addLink(req.body.id1, req.body.id2, req.body.type)
          .then((link) => {
            // Assuming link resolves successfully, send the response
            res.status(200).json({
              id1: req.body.id1,
              id2: req.body.id2,
              type: req.body.type,
            });
          })
          .catch((err) => {
            next(err); // Pass the error to the error handling middleware
          });
      }
    );
  };
}

export default DocumentRoutes;
