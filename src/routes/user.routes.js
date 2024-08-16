import { Router } from "express";
import { admin, exportUserData, loginUser, logOutUser, rejisterUser, sendOtp, updatePassword, verifyOtp } from "../controllers/user.controllers.js";
import { verifyAdmin, verifyJWT } from "../middleware/authMiddleware.js";
const router = Router();



router.route("/rejister").post(rejisterUser);
router.route("/login").post(loginUser);
router.route("/sendotp").post(sendOtp)
router.route("/verifyotp").post(verifyOtp)
router.route("/resetpassword").post(updatePassword)

// secure toutes
router.route("/logout").post(verifyJWT,logOutUser)
router.route("/admin").get(verifyJWT,verifyAdmin,admin)
router.route("/export-usrdata").get(verifyJWT,verifyAdmin,exportUserData)


export default router