import { Router } from "express";
import { deletePyq, downloadPYQ, findPYQ, getAllPyq, uploadPYQ } from "../controllers/PYQ.controllers.js"
import { upload } from "../middleware/multer.middleware.js";
import { verifyAdmin, verifyJWT } from "../middleware/authMiddleware.js";

const router = Router()

router.route("/uploadpyq").post(verifyJWT, verifyAdmin, upload.fields([
  {
    name: "image",
    maxCount: 1
  }
]), uploadPYQ)

router.route("/findpyq").post(findPYQ)
router.route("/getallpyq").get(getAllPyq)
router.route("/downloadpyq/:id").post(verifyJWT, downloadPYQ)
router.route("/deletepyq/:id").post(verifyJWT, deletePyq)

export default router
