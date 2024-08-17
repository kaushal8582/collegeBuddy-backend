import { Team } from "../modals/team.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";


const addTeamMember = asyncHandler(async(req,res)=>{
  const {name,role,summary,portfolio,instagram,linkedin,github} = req.body

  if(!name || !role || !summary){
    throw new ApiError(400,"All fields are required");
  }

  const image = req.files?.profileImg[0]?.path;
  if(!image){
    throw new ApiError(400,"Profile pic is required ");
  }

  const profileImg = await uploadOnCloudinary(image);
  if(!profileImg){
    throw new ApiError(400,"Profile pic is required");
  }

  const team = await Team.create({
    name,
    role,
    summary,
    profilePic:profileImg.url,
    github:github? github: "",
    instagram:instagram?instagram:"",
    linkedin:linkedin?linkedin:"",
    portfolio:portfolio?portfolio:""
  })

  if(!team){
    throw new ApiError(500,"Something went wrong while team added");
  }

  return res.status(200).json(new ApiResponse(200,"Team member added successfully ", team));
})


const deleteTeamMember = asyncHandler(async(req,res)=>{
  const id = req.params?.id;

  const team = await Team.findByIdAndDelete(id);
  if(!team){
    throw new ApiError(400,"Team not found");
  }

  return res.status(200).json(new ApiResponse(200,"Team deleted successfully ",{}));
})


const getAllTeamMeber = asyncHandler(async(req,res)=>{
  
  const allTeamMember = await Team.find({});

  if(!allTeamMember || allTeamMember.length<=0 ){
    throw new ApiError(200,"Not have any team member ");
  }
  return res.status(200).json(new ApiResponse(200,"All team member fetch successfully ",allTeamMember));
})





export {
  addTeamMember,
  deleteTeamMember,
  getAllTeamMeber,
}