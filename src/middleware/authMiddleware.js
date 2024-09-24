import JWT from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../modals/user.modal.js";
import dotenv from "dotenv"


dotenv.config({
  path:"./.env"
})



const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      throw new ApiError(400, "Invalid access token");
    }
    const decodedToken = JWT.verify(token, process.env.ACCESS_TOKEN_SECREAT);
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    
    throw new ApiError(401, "Invalid user");
  }
});


const verifyAdmin = asyncHandler(async(req,res,next)=>{
  try {
    const adminemail = req.user.email
    if(adminemail!== process.env.ADMIN_EMAIL && adminemail!== process.env.ADMIN_EMAIL1) {
     throw new ApiError(400,"Access denied")
    }
   next()
  } catch (error) {
    next(new ApiError(400,"Access denied"))
  }
})

export {
  verifyJWT,
  verifyAdmin,
}