import { Router } from "express";
import { body, param, oneOf } from "express-validator";
import Utility from "../utils/utility.mjs";
import Storage from "../utils/storage.mjs";
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
      oneOf([body("issuanceDate").isISO8601({ strict: true }), body("issuanceDate").isString().notEmpty().custom(Utility.isValidYearMonthOrYear)]),
      body("type").isString().notEmpty(),
      body("language").isString().notEmpty(),
      body("description").isString().notEmpty(),
      body("coordinates").optional().isObject().custom(Utility.isValidCoordinatesObject),
      body("pages")
        .optional()
        .isInt({ gt: 0 })
        .custom((value, { req }) => {
          const pages = value;
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
      body("pageFrom").optional().isInt({ gt: 0 }),
      body("pageTo").optional().isInt({ gt: 0 }),
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

    this.router.get("/stakeholders", Utility.isLoggedIn, (req, res, next) => {
      this.documentController
        .getStakeholders()
        .then((stakeholders) => res.status(200).json(stakeholders))
        .catch((err) => next(err));
    });

    this.router.post("/:docID/attachments", Utility.isLoggedIn, param("docID").isInt(), Utility.validateRequest, (req, res, next) => {
      this.documentController
        .addAttachment(req, req.params.docID)
        .then(() => res.status(200).end())
        .catch((err) => next(err));
    });

    this.router.get("/link-types", Utility.isLoggedIn, (req, res, next) => res.status(200).json(this.documentController.getLinkTypes()));

    this.router.get("/links/:id", param("id").isInt({ gt: 0 }), Utility.validateRequest, Utility.isLoggedIn, (req, res, next) => {
      this.documentController
        .getLinks(req.params.id)
        .then((links) => {
          res.status(200).json(links);
        })
        .catch((err) => {
          next(err);
        });
    });

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
