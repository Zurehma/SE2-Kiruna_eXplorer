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
    this.router.get("/", (req, res, next) => {
      this.documentController
        .getDocuments()
        .then((documents) => res.status(200).json(documents))
        .catch((err) => next(err));
    });

    this.router.get(
      "/filter/by",
      [
        query("type").optional().isString().withMessage("Type must be a string"),
        query("stakeholder").optional().isString().withMessage("Stakeholder must be a string"),
        query("issuanceDateFrom").optional().isISO8601({ strict: true }).withMessage("Issuance date must be a valid ISO8601 date string"),
        query("issuanceDateTo").optional().isISO8601({ strict: true }).withMessage("Issuance date must be a valid ISO8601 date string"),
      ],
      Utility.validateRequest,
      (req, res, next) => {
        this.documentController
          .filterDocuments(req.query.type, req.query.stakeholder, req.query.issuanceDateFrom, req.query.issuanceDateTo)
          .then((document) => {
            res.status(200).json(document);
          })
          .catch((err) => {
            next(err);
          });
      }
    );

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
      body("pages").optional().isInt({ gt: 0 }).custom(Utility.isValidPageParameter),
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
            res.status(201).json(document);
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

    this.router.get("/link-types", Utility.isLoggedIn, (req, res, next) => {
      this.documentController
        .getLinkTypes()
        .then((linkTypes) => res.status(200).json(linkTypes))
        .catch((err) => next(err));
    });

    this.router.get("/:id", param("id").isInt({ gt: 0 }), Utility.validateRequest, (req, res, next) => {
      this.documentController
        .getDocumentById(req.params.id)
        .then((document) => {
          res.status(200).json(document);
        })
        .catch((err) => {
          next(err);
        });
    });

    this.router.put(
      "/:docID",
      Utility.isLoggedIn,
      param("docID").isInt({ gt: 0 }),
      body("title").optional().isString().notEmpty(),
      body("stakeholder").optional().isString().notEmpty(),
      oneOf([body("scale").optional().isString().notEmpty(), body("scale").optional().isInt({ gt: 0 })]),
      oneOf([
        body("issuanceDate").optional().isISO8601({ strict: true }),
        body("issuanceDate").optional().isString().notEmpty().custom(Utility.isValidYearMonthOrYear),
      ]),
      body("type").optional().isString().notEmpty(),
      body("language").optional().isString().notEmpty(),
      body("description").optional().isString().notEmpty(),
      body("coordinates").optional().isObject().custom(Utility.isValidCoordinatesObject),
      body("pages").optional().isInt({ gt: 0 }).custom(Utility.isValidPageParameter),
      body("pageFrom").optional().isInt({ gt: 0 }),
      body("pageTo").optional().isInt({ gt: 0 }),
      body().custom(Utility.isBodyEmpty),
      Utility.validateRequest,
      (req, res, next) => {
        this.documentController
          .updateDocument(
            Number(req.params.docID),
            req.body.title || null,
            req.body.stakeholder || null,
            req.body.scale || null,
            req.body.issuanceDate || null,
            req.body.type || null,
            req.body.language || null,
            req.body.description || null,
            req.body.coordinates || null,
            req.body.hasOwnProperty("coordinates"),
            req.body.pages || null,
            req.body.hasOwnProperty("pages"),
            req.body.pageFrom || null,
            req.body.hasOwnProperty("pageFrom"),
            req.body.pageTo || null,
            req.body.hasOwnProperty("pageTo")
          )
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

          // Check if any of the provided IDs already have a link
          const existingLinks = await this.documentController.getLinks(id1);
          const existingIDs = existingLinks.map((link) => link.linkedDocID);

          const duplicates = ids.filter((id) => existingIDs.includes(id));
          if (duplicates.length > 0) {
            return res.status(409).json({
              message: `Link already exists for ID(s): ${duplicates.join(", ")}`,
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
  };
}

export default DocumentRoutes;
