import path from "path";
import dayjs from "dayjs";
import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileType = file.mimetype.split("/")[1];
    let destination = "./uploads";

    switch (fileType) {
      case "jpg":
      case "jpeg":
      case "png":
        destination += "/images";
        break;
      case "pdf":
        destination += "/documents";
        break;
      case "mp4":
        destination += "/videos";
        break;
      default:
        destination += "/others";
        break;
    }

    cb(null, destination);
  },
  filename: (req, file, cb) => {
    cb(null, dayjs().toISOString() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf", "video/mp4"];
  const fileLimits = {
    "image/jpeg": 5 * 1024 * 1024,
    "image/png": 10 * 1024 * 1024,
    "application/pdf": 100 * 1024 * 1024,
    "video/mp4": 500 * 1024 * 1024,
  };

  if (!allowedTypes.includes(file.mimetype)) {
    cb({ errCode: 400, errMessage: "Only .pdf, .mp4, .jpg, .jpeg and .png are allowed." });
    return;
  }

  if (file.size >= fileLimits[file.mimetype]) {
    cb({ errCode: 400, errMessage: "File exceed size supported." });
    return;
  }

  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single("file");

const saveFile = (req) => {
  return new Promise((resolve, reject) => {
    upload(req, null, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(req.file);
      }
    });
  });
};

const deleteFile = () => {};

const Storage = {
  saveFile: saveFile,
};

export default Storage;
