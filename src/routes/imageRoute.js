import express from "express";
import multer from "multer";

import ExpressFormidable from "express-formidable";
import { imageUploadController } from "../controllers/imageUpload.js";

const router = express.Router();
router.post(
  "/upload-image",
  ExpressFormidable({ maxFieldsSize: 5 * 1024 * 1024 }),
  imageUploadController
);
export default router;
