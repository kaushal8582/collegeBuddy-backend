import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { deleteEbook, downloadEbook, getAllEbook, uploadEbook } from "../controllers/EbookController.js";
import { verifyAdmin, verifyJWT } from "../middleware/authMiddleware.js";

const router = Router();

router.route("/uploadebook").post( verifyJWT,verifyAdmin, upload.fields([
  {
    name:"thumbnail",
    maxCount:1,
  }
]),uploadEbook)

router.route("/getallebooks").get(getAllEbook);

router.route("/ebookdownload/:id").get(verifyJWT,downloadEbook);
router.route("/ebookdelete/:id").get(verifyJWT,deleteEbook);

export default router

