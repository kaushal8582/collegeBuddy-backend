import { Router } from "express";
import { verifyAdmin, verifyJWT } from "../middleware/authMiddleware.js";
import { addCourseName, getAllCourseName } from "../controllers/Course.controller.js";

const router = Router()

router.route("/addcoursename").post(verifyJWT,verifyAdmin,addCourseName)
router.route("/getallcoursename").get(getAllCourseName)


export default router;