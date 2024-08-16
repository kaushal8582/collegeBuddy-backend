import { College } from "../modals/college.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"

const getAllCollegeName = asyncHandler(async(req,res)=>{
  const allCollege = await College.find({})

  if(!allCollege){
    throw new ApiError(400,"Not have any college")
  }

  return res.status(200).json(new ApiResponse(200,"Find successfully",allCollege))

})

const addCollegeName = asyncHandler(async(req,res)=>{
  const {name} = req.body

  if(!name){
    throw new ApiError(400,"college name is required");
  }

  const data = await College.create({name:name})

  if(!data){
    throw new ApiError(500,"Something went wrong while add college name ")
  }

  return res.status(200).json(new ApiResponse(200,"add college name successfully ",data))

})

export {
  getAllCollegeName,
  addCollegeName,
}