import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { deleteStudyMaterial, downloadStudyMaterial, getAllStudyMaterial, uploadStudyMaterial } from "../controllers/StydyMaterial.controller.js";
import { verifyAdmin, verifyJWT } from "../middleware/authMiddleware.js";

const router = Router()

router.route("/uploadstudymaterial").post(verifyJWT,verifyAdmin, upload.fields([
  {
    name:"studyMaterialThumbnail",
    maxCount:1,
  }
]),uploadStudyMaterial)

router.route("/getallstudymaterial").get(getAllStudyMaterial);
router.route("/downloadstudymaterial/:id").post(verifyJWT,downloadStudyMaterial);
router.route("/deletestudymaterial/:id").get(verifyJWT,deleteStudyMaterial);



export default router;