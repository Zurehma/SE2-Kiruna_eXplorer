import { Router } from "express";
import { body, param, oneOf, query } from "express-validator";
import Utility from "../utils/utility.mjs";
import DocumentController from "../controllers/documentController.mjs";

class DocumentRoutes {
  constructor() {
    this.router = new Router();
    this.documentController = new DocumentController();
  }

  getRouter = () => this.router;

  initRoutes = () => {
    this.router.get("/allExistingLinks", (req, res, next) => {
      this.documentController
        .getAllLinks()
        .then((links) => {
          res.status(200).json(links);
        })
        .catch((err) => {
          next(err);
        });
    });

    this.router.get(
      "/",
      query("pageNo").optional().isInt({ gt: 0 }),
      query("subtext").optional().isString().withMessage("Type must be a string"),
      query("type").optional().isString().withMessage("Type must be a string"),
      query("stakeholder").optional().isString().withMessage("Stakeholder must be a string"),
      query("issuanceDateFrom").optional().isISO8601({ strict: true }).withMessage("Issuance date must be a valid ISO8601 date string"),
      query("issuanceDateTo").optional().isISO8601({ strict: true }).withMessage("Issuance date must be a valid ISO8601 date string"),
      Utility.validateRequest,
      (req, res, next) => {
        this.documentController
          .getDocuments(req.query.pageNo, req.query.subtext, req.query.type, req.query.stakeholder, req.query.issuanceDateFrom, req.query.issuanceDateTo)
          .then((document) => res.status(200).json(document))
          .catch((err) => next(err));
      }
    );

    this.router.post(
      "/",
      Utility.isLoggedIn,
      body("title").isString().notEmpty(),
      body("stakeholders").isArray().notEmpty(),
      body("stakeholders.*").isString().notEmpty(),
      oneOf([body("scale").isString().notEmpty(), body("scale").isInt({ gt: 0 })]),
      oneOf([body("issuanceDate").isISO8601({ strict: true }), body("issuanceDate").isString().notEmpty().custom(Utility.isValidYearMonthOrYear)]),
      body("type").isString().notEmpty(),
      body("language").isString().notEmpty(),
      body("description").isString().notEmpty(),
      oneOf([
        body("coordinates").optional().custom(Utility.isValidCoordinatesObject),
        body("coordinates").optional().custom(Utility.isValidCoordinatesArray),
      ]),
      body("pages").optional().isString().notEmpty().custom(Utility.isValidPages),
      Utility.validateRequest,
      (req, res, next) => {
        this.documentController
          .addDocument({
            title: req.body.title,
            stakeholders: req.body.stakeholders,
            scale: req.body.scale,
            issuanceDate: req.body.issuanceDate,
            type: req.body.type,
            language: req.body.language,
            description: req.body.description,
            coordinates: req.body.coordinates || null,
            pages: req.body.pages || null,
          })
          .then((document) => res.status(201).json(document))
          .catch((err) => next(err));
      }
    );

    this.router.delete("/:id", Utility.isLoggedIn, param("id").isInt({ gt: 0 }), Utility.validateRequest, (req, res, next) => {
      this.documentController
        .deleteDocument(req.params.id)
        .then(() => res.status(204).end())
        .catch((err) => next(err));
    });

    this.router.get("/document-types", (req, res, next) => {
      this.documentController
        .getDocumentTypes()
        .then((documentTypes) => res.status(200).json(documentTypes))
        .catch((err) => next(err));
    });

    this.router.get("/stakeholders", (req, res, next) => {
      this.documentController
        .getStakeholders()
        .then((stakeholders) => res.status(200).json(stakeholders))
        .catch((err) => next(err));
    });

    this.router.get("/link-types", (req, res, next) => {
      this.documentController
        .getLinkTypes()
        .then((linkTypes) => res.status(200).json(linkTypes))
        .catch((err) => next(err));
    });

    this.router.get("/:id", param("id").isInt({ gt: 0 }), Utility.validateRequest, (req, res, next) => {
      this.documentController
        .getDocumentById(req.params.id)
        .then((document) => res.status(200).json(document))
        .catch((err) => next(err));
    });

    this.router.put(
      "/:docID",
      Utility.isLoggedIn,
      param("docID").isInt({ gt: 0 }),
      body("title").isString().notEmpty(),
      body("stakeholders").isArray().notEmpty(),
      body("stakeholders.*").isString().notEmpty(),
      oneOf([body("scale").isString().notEmpty(), body("scale").optional().isInt({ gt: 0 })]),
      oneOf([body("issuanceDate").isISO8601({ strict: true }), body("issuanceDate").isString().notEmpty().custom(Utility.isValidYearMonthOrYear)]),
      body("type").isString().notEmpty(),
      body("language").isString().notEmpty(),
      body("description").isString().notEmpty(),
      oneOf([
        body("coordinates").optional().custom(Utility.isValidCoordinatesObject),
        body("coordinates").optional().custom(Utility.isValidCoordinatesArray),
      ]),
      body("pages").optional().isString().notEmpty().custom(Utility.isValidPages),
      Utility.validateRequest,
      (req, res, next) => {
        this.documentController
          .updateDocument({
            id: Number(req.params.docID),
            title: req.body.title,
            stakeholders: req.body.stakeholders,
            scale: req.body.scale,
            issuanceDate: req.body.issuanceDate,
            type: req.body.type,
            language: req.body.language,
            description: req.body.description,
            coordinates: req.body.coordinates || null,
            pages: req.body.pages || null,
          })
          .then(() => res.status(204).end())
          .catch((err) => next(err));
      }
    );

    this.router.get("/links/:id", param("id").isInt({ gt: 0 }), Utility.validateRequest, (req, res, next) => {
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
      body("ids").isArray().notEmpty(),
      body("ids.*").isInt({ gt: 0 }),
      body("type").isString().notEmpty(),
      Utility.validateRequest,
      Utility.isLoggedIn,
      async (req, res, next) => {
        try {
          const { id1, ids, type } = req.body;

          // Find links that exist with the same document pairs and the same type
          const existingLinks = await this.documentController.getLinks(id1);
          const duplicates = ids.filter((id) => existingLinks.some((link) => link.linkedDocID === id && link.type === type));

          if (duplicates.length > 0) {
            return res.status(409).json({
              message: `Link already exists for ID(s): ${duplicates.join(", ")} with type '${type}'`,
            });
          }

          // Add links for all IDs sequentially
          const addedLinks = [];
          for (const id of ids) {
            const newLink = await this.documentController.addLink(id1, id, type);
            addedLinks.push({ id1, id2: id, type });
          }

          // Respond with the added links
          res.status(200).json({
            message: "Links added successfully",
            addedLinks,
          });
        } catch (err) {
          next(err); // Pass the error to the error handling middleware
        }
      }
    );

    this.router.delete("/link/:linkID", Utility.isLoggedIn, param("linkID").isInt({ gt: 0 }), Utility.validateRequest, (req, res, next) => {
      this.documentController
        .deleteLink(Number(req.params.linkID))
        .then(() => res.status(204).end())
        .catch((err) => next(err));
    });
  };
}

export default DocumentRoutes;
