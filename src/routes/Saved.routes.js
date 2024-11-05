
import {Router} from "express"
import { verifyJWT } from "../middleware/authMiddleware.js";
import { getAllSavedData, savedItem } from "../controllers/Saved.controller.js";

const router = Router();


router.route("/saved-item").post(verifyJWT,savedItem);
router.route("/get-all-saved-data/:userId").get(verifyJWT,getAllSavedData);



export default router;