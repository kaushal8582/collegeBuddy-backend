import { Video } from "../modals/video.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const uploadVideo = asyncHandler(async(req,res)=>{
  const {title,desc,link} = req.body;

  if(!link || !title){
    throw new ApiError(400,"All fields are required ");
  }

  const video =  await Video.create({
    title,
    desc,
    videoLink:link
  })

  if(!video){
    throw new ApiError(500,"Something went wrong while uploading a video ")
  }

  return res.status(200).json(new ApiResponse(200,"Video upload successfully "));
})


const getAllVideo  = asyncHandler(async(req,res)=>{
  const allVideo = await Video.find({})

  if(!allVideo || allVideo.length<=0 ){
    throw new ApiError(200,"not have any video ");
  }


  return res.status(200).json(new ApiResponse(200,"Fetch all video successfully ",allVideo));
})

const deleteVideo = asyncHandler(async(req,res)=>{
  const id = req.params?.id;

  if(!id){
    throw new ApiError(400,"Id is necessary");
  }

  const video  = await Video.findByIdAndDelete(id);

  if(!video){
    throw new ApiError(400,"Invalid id");
  }

  return res.status(200).json(new ApiResponse(200,"Video delete successfully "));


})




export {
  uploadVideo,
  getAllVideo,
  deleteVideo,
}