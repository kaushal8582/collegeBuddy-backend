import { Router } from "express";
import { verifyJWT } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { addProfile, getProfileData, getProfileDataForEveryone, incrementProfileViews, toggleProfileLike, updateProfile,uploadImage, uploadProject } from "../controllers/Profile.controller.js";


const router = Router();

router.route("/toggleprofilelike/:profileId").post(verifyJWT,toggleProfileLike);
router.route("/incprofileviews/:profileId").get(incrementProfileViews);
router.route("/getprofiledataforeveryone/:username").post(getProfileDataForEveryone);
router.route("/addprofile").post(verifyJWT,addProfile);
router.route("/updateprofile").post(verifyJWT,updateProfile);
router.route("/uploadproject").post(verifyJWT,upload.fields([
  {
    name:"projectImg",
    maxCount:1,
  }
]),uploadProject);
router.route("/getprofiledetails/:userId").get(verifyJWT,getProfileData);
router.route("/uploadprofileimg").post(verifyJWT, upload.fields([
    {
      name:"profileImg",
      maxCount:1,
    }
  ]),uploadImage);




export default router;