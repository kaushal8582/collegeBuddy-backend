import { Pyq } from "../modals/previousYearQuestion.modal.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js"


const uploadPYQ = asyncHandler(async (req, res) => {
  // data from fronted
  //validate data 
  // pdf ko upload karo local me using multer and then cloudinary pe upload karo 
  // object banao
  // upload on mongodb

  const { universityName, semester, year, courseName, questionLink } = req.body

  if (
    [universityName, semester, year, courseName, questionLink].some((item) => (item?.trim() === ""))
  ) {
    throw new ApiError(400, "All fields are required ");
  }

  // const pdfLink = req.files?.questionLink[0]?.path
  const img = req.files?.image[0]?.path;
  if(!img){
    throw new ApiError(400,"image is missing");
  }

  const collegeLogo = await uploadOnCloudinary(img);
  if(!collegeLogo){
    throw new ApiError(400,"Colege logo is required");
  }
  // if(!pdfLink){
  //   throw new ApiError(400,"Pdf are requires")
  // }
  // console.log(pdfLink);


  // const question = await uploadOnCloudinary(pdfLink)

  // if(!question){
  //   throw new ApiError(400,"Pdf file are required");
  // }

  const pyq = await Pyq.create({
    universityName,
    semester,
    year,
    courseName,
    questionLink,
    img:collegeLogo.url,
  })

  const previousYearQuestion = await Pyq.findById(pyq._id)

  if (!previousYearQuestion) {
    throw new ApiError(500, "Something went wrong while uploading a previous year question")
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "PYQ upload successfully ", previousYearQuestion)
    )

})

const findPYQ = asyncHandler(async (req, res) => {
  const { universityName, semester, courseName } = req.body
  if (
    [universityName, semester, courseName].some((item) => (item?.trim() === ""))
  ) {
    throw new ApiError(400, "all fields are required ");
  }

  const questionPaper = await Pyq.find({ universityName, semester, courseName })

  if (!questionPaper || questionPaper.length <= 0) {
    throw new ApiError(400, "Question not found")
  }

  console.log(questionPaper);


  return res
    .status(200)
    .json(
      new ApiResponse(200, "Question find successfully ", questionPaper)
    )



})

const downloadPYQ = asyncHandler(async (req, res) => {
  const id = req.params.id;


  const preiousQuestion = await Pyq.findById(id);


  if (!preiousQuestion) {
    throw new ApiError(400, "Previous year question not found ");
  }

  return res.status(200).json(new ApiResponse(200, "PYQ find successfully ", preiousQuestion.questionLink));

})

const getAllPyq = asyncHandler(async (req, res) => {
  const allPyq = await Pyq.find({})

  if (!allPyq) {
    throw new ApiError(400, "Not have any pyq")
  }

  return res.status(200).json(new ApiResponse(200, "Successfully find all question ", allPyq))

})


const deletePyq = asyncHandler(async (req, res) => {
  const id = req.params?.id

  if (!id) {
    throw new ApiError(400, "id is missing");
  }

  const pyq = await Pyq.findByIdAndDelete(id);
  if (!pyq) {
    throw new ApiError(400, "Invalid request")
  }

  return res.status(200).json(new ApiResponse(200,"PYQ delete successfully",{}))

})

export {
  uploadPYQ,
  findPYQ,
  downloadPYQ,
  getAllPyq,
  deletePyq,
}