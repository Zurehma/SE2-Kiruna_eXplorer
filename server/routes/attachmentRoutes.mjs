import { Router } from "express";
import { body, param, oneOf } from "express-validator";
import Utility from "../utils/utility.mjs";
import AttachmentController from "../controllers/attachmentController.mjs";

class AttachmentRoutes {
  constructor() {
    this.router = new Router();
    this.attachmentController = new AttachmentController();
  }

  getRouter = () => this.router;

  initRoutes = () => {
    this.router.post("/:docID/attachments/", Utility.isLoggedIn, param("docID").isInt(), Utility.validateRequest, (req, res, next) => {
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
  };
}

export default AttachmentRoutes;
