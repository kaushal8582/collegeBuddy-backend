import { Router } from "express";
import { verifyAdmin, verifyJWT } from "../middleware/authMiddleware.js";
import { addCourseName, deleteCourseName, getAllCourseName } from "../controllers/Course.controller.js";

const router = Router()

router.route("/addcoursename").post(verifyJWT,verifyAdmin,addCourseName)
router.route("/getallcoursename").get(getAllCourseName)
router.route("/deletecoursename/:id").get(deleteCourseName)


export default router;