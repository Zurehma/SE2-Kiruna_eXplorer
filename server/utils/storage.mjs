import path from "path";
import dayjs from "dayjs";
import multer from "multer";
import fs from "fs";

const sanitizeFileName = (fileName) => {
  const reservedNames = ["CON", "AUX", "PRN", "NUL", "COM1", "LPT1"];

  let sanitized = fileName.replace(/[^a-zA-Z0-9.\-_]/g, "_");

  if (reservedNames.includes(sanitized.toUpperCase())) {
    sanitized = sanitized + "_file";
  }

  return sanitized;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileType = file.mimetype.split("/")[1];
    let destination = path.join(".", "uploads");

    switch (fileType) {
      case "jpg":
      case "jpeg":
      case "png":
        destination = path.join(destination, "images");
        break;
      case "pdf":
        destination = path.join(destination, "documents");
        break;
      case "mp4":
        destination = path.join(destination, "videos");
        break;
      default:
        destination = path.join(destination, "others");
        break;
    }

    fs.mkdirSync(destination, { recursive: true });

    cb(null, destination);
  },
  filename: (req, file, cb) => {
    cb(null, sanitizeFileName(dayjs().toISOString() + "-" + Math.round(Math.random() * 1e9)) + path.extname(file.originalname));
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

const deleteFile = (filePath) => {
  fs.rmSync(path.join(".", filePath));
};

const Storage = {
  saveFile,
  deleteFile,
};

export default Storage;
