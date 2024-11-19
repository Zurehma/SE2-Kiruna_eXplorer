import { Router } from "express";
import { param } from "express-validator";
import path from "path";
import Utility from "../utils/utility.mjs";
import AttachmentController from "../controllers/attachmentController.mjs";

class AttachmentRoutes {
  constructor() {
    this.router = new Router();
    this.attachmentController = new AttachmentController();
  }

  getRouter = () => this.router;

  initRoutes = () => {
    this.router.get("/:docID/attachments", Utility.isLoggedIn, param("docID").isInt(), Utility.validateRequest, (req, res, next) => {
      this.attachmentController
        .getAttachments(Number(req.params.docID))
        .then((attachments) => res.status(200).json(attachments))
        .catch((err) => next(err));
    });

    this.router.post("/:docID/attachments", Utility.isLoggedIn, param("docID").isInt(), Utility.validateRequest, (req, res, next) => {
      this.attachmentController
        .addAttachment(req, Number(req.params.docID))
        .then((attachmentInfo) => res.status(201).json(attachmentInfo))
        .catch((err) => next(err));
    });

    this.router.delete(
      "/:docID/attachments/:attachmentID",
      Utility.isLoggedIn,
      param("docID").isInt(),
      param("attachmentID").isInt(),
      Utility.validateRequest,
      (req, res, next) => {
        this.attachmentController
          .deleteAttachment(Number(req.params.docID), Number(req.params.attachmentID))
          .then(() => res.status(204).end())
          .catch((err) => next(err));
      }
    );

    this.router.get(
      "/:docID/attachments/:attachmentID/download",
      Utility.isLoggedIn,
      param("docID").isInt(),
      param("attachmentID").isInt(),
      Utility.validateRequest,
      (req, res, next) => {
        this.attachmentController
          .getAttachment(Number(req.params.docID), Number(req.params.attachmentID))
          .then((attachmentInfo) => res.download(path.join(".", attachmentInfo.path)))
          .catch((err) => next(err));
      }
    );
  };
}

export default AttachmentRoutes;
