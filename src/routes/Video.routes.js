import {Router} from "express"
import { verifyAdmin, verifyJWT } from "../middleware/authMiddleware.js";
import { deleteVideo, getAllVideo, uploadVideo } from "../controllers/Video.controller.js";

const router = Router();

router.route("/get-all-video").get(getAllVideo);

router.route("/upload-video").post(verifyJWT,verifyAdmin,uploadVideo)
router.route("/delete-video/:id").post(verifyJWT,verifyAdmin,deleteVideo)

export default router;