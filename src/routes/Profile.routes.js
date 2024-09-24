import { Router } from "express";
import { verifyJWT } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { addProfile, getProfileData, updateProfile,uploadImage } from "../controllers/Profile.controller.js";


const router = Router();

router.route("/addprofile").post(verifyJWT,addProfile)
router.route("/updateprofile").post(verifyJWT,updateProfile)
router.route("/getprofiledetails/:userId").get(verifyJWT,getProfileData)
router.route("/uploadprofileimg").post(verifyJWT, upload.fields([
    {
      name:"profileImg",
      maxCount:1,
    }
  ]),uploadImage)




export default router;