import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import {  Ebook } from "../modals/ebooks.model.js"
import { ApiResponse } from "../utils/apiResponse.js"

const uploadEbook = asyncHandler(async (req, res) => {
  const { title, description ,ebookLink} = req.body

  if (
    [title, description,ebookLink].some((item) => (item?.trim()===""))
  ) {
    throw new ApiError(400, "All fields are required")
  }

  console.log(title,description,ebookLink);
  

  console.log(req.files?.thumbnail[0]);
  

  const thumbnail = req.files?.thumbnail[0]?.path
  console.log(thumbnail);
  
  if (!thumbnail) {
    throw new ApiError(400, "Ebooks thumbnail are required ");
  }
  // const EbookPdf = req.files?.eBookPdf[0]?.path
  // if (!EbookPdf) {
  //   throw new ApiError(400, "Ebook are required ")
  // }

  const EbookThum = await uploadOnCloudinary(thumbnail)
  if (!EbookThum) {
    throw new ApiError(400, "Ebooks thumbnail are required cl");
  }

  // const EbookUrl = await uploadOnCloudinary(EbookPdf)
  // if (!EbookUrl) {
  //   throw new ApiError(400, "Ebook are required ")
  // }

  const uploadedEbook = await Ebook.create({
    title,
    description,
    thumbnail: EbookThum.url,
    ebookLink
  })

  const eBooks = await Ebook.findById(uploadedEbook._id);
  if (!eBooks) {
    throw new ApiError(500, "Something went wront while uploading Ebook");
  }



  return res
    .status(200)
    .json(
      new ApiResponse(200, "Ebook Upload successfully", eBooks)
    )

})

const getAllEbook = asyncHandler(async (req, res) => {
  const allEbooks = await Ebook.find({});

  if (!allEbooks.length > 0) {
    throw new ApiError(400, "Not have any ebooks");
  }

  return res.status(200).json(new ApiResponse(200, "Fetched all Ebooks Successfully ", allEbooks))
})

const downloadEbook = asyncHandler(async(req,res)=>{
  const id = req.params?.id  
  const eBook = await Ebook.findById(id)
  if(!eBook){
    throw new ApiError(400,"Not Found");
  }
  console.log(eBook);
  
  return res.status(200).json(new ApiResponse(200,"Find Ebook successfully ", eBook.ebookLink));
})

const deleteEbook = asyncHandler(async(req,res)=>{
  const id = req.params?.id
  if(!id){
    throw new ApiError(400,"required id")
  }

  const book = await Ebook.findByIdAndDelete(id);
  if(!book){
    throw new ApiError(400,"Invalid request")
  }
  return res.status(200).json(new ApiResponse(200,"Delete eBook successfully",{}));
  

})

export {
  uploadEbook,
  getAllEbook,
  downloadEbook,
  deleteEbook
}