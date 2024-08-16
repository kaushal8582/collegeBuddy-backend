import { StudyMaterial } from "../modals/studyMaterial.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";



const uploadStudyMaterial = asyncHandler(async(req,res)=>{
  const{title,desc,university,sem,materialLink} = req.body
  if(
    [title,desc,university,sem,materialLink].some((item)=>(item?.trim()===""))
  ){
    throw new ApiError(400,"all fields are required..");
  }

  // const studyMaterial =  req.files?.studymaterial[0]?.path
  const studyMaterialThumbnail =req.files?.studyMaterialThumbnail[0]?.path
  console.log("study thum controler se " , studyMaterialThumbnail);
  

  // if(!studyMaterial){
  //   throw new ApiError(400,"Study material file is required");
  // }

  // const stuMaterial =  await uploadOnCloudinary(studyMaterial)
  const studyMaterialThumb = await uploadOnCloudinary(studyMaterialThumbnail);
  // if(!stuMaterial){
  //   throw new ApiError(400,"Study material file is required");
  // }

  const resourse = await StudyMaterial.create({
    title,
    desc,
    university,
    sem,
    materialLink,
    thumbnail:studyMaterialThumb?.url || ""
  })

  const stuMate = await  StudyMaterial.findById(resourse._id);
  if(!stuMate){
    throw new ApiError(500,"Something went wront while uploading a study material")
  }
  console.log(stuMate);
  

  return res.status(200).json( new ApiResponse(200,"Study material upload successfully",stuMate))
})


const getAllStudyMaterial = asyncHandler(async(req,res)=>{
  const allStudyMaterial = await StudyMaterial.find({})

  if(!allStudyMaterial.length>0){
    throw new ApiError(400,"Not have any study material ")
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200,"Fetch all study material successfully ",allStudyMaterial)
    )

})


const downloadStudyMaterial = asyncHandler(async(req,res)=>{
  const id = req.params.id;

  const studyMaterial = await StudyMaterial.findById(id);
  if(!studyMaterial){
    throw new ApiError(400,"Study Material not found ");
  }

  return res.status(200).json(new ApiResponse(200,"Study Material find successfully ", studyMaterial.materialLink))
  
})

const deleteStudyMaterial = asyncHandler(async(req,res)=>{
  const id =req.params?.id

  if(!id){
    throw new ApiError(400, "id is missing");
  }

  const study = await StudyMaterial.findByIdAndDelete(id)
  if(!study){
    throw new ApiError(400, "Invalid request")
  }

  return res.status(200).json(new ApiResponse(200,"StudyMaterial delete successfully",{}))

})

export {
  uploadStudyMaterial,
  getAllStudyMaterial,
  downloadStudyMaterial,
  deleteStudyMaterial,
}