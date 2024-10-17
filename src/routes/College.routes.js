import { Router } from "express";
import { verifyAdmin, verifyJWT } from "../middleware/authMiddleware.js";
import { addCollegeName, deleteCollegeName, getAllCollegeName } from "../controllers/College.controller.js";

const router = Router()

router.route("/addcollegename").post(verifyJWT,verifyAdmin,addCollegeName)
router.route("/getallcollegename").get(getAllCollegeName)
router.route("/deletecollegename/:id").get(deleteCollegeName)

export default  router