import {Router} from "express"
import { verifyAdmin, verifyJWT } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { addTeamMember, deleteTeamMember, getAllTeamMeber } from "../controllers/Team.controller.js";

const router = Router();

router.route("/upload-team").post(verifyJWT,verifyAdmin,upload.fields([
  {
    name:"profileImg",
    maxCount:1,
  }
]),addTeamMember)

router.route("/delete-member/:id").post(verifyJWT,verifyAdmin,deleteTeamMember);
router.route("/all-team-member").get(getAllTeamMeber);

export default router