import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { User } from "../modals/user.modal.js";
import noemailer from "nodemailer"
import crypto from "crypto"

import exceljs from "exceljs"

import { OTP } from "../modals/otp.model.js";

import dotenv from "dotenv"


dotenv.config({
  path: "./.env"
})


const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    user.refreshToken = refreshToken
    user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }

  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating access and refresh token ");
  }
}


const rejisterUser = asyncHandler(async (req, res) => {

  // data from fronted
  // validate data !empty or other
  // check user already not exists
  // create a object and upload on database

  const { name, email, password, phoneNo, college, course, semester } = req.body

  if (
    [name, email, password, phoneNo, college, course, semester].some((item) => (item?.trim() === ""))
  ) {
    throw new ApiError(400, "Required all fields");
  }

  const alreadyExists = await User.findOne({ email })
  if (alreadyExists) {
    throw new ApiError(401, "User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    phoneNo,
    college,
    course,
    semester
  })

  const createdUser = await User.findById(user._id).select("-password -refreshToken")
  if (!createdUser) {
    throw new ApiError(500, "Something while wrong when user rejister")
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "User rejister successfully", createdUser)
    )
})


const loginUser = asyncHandler(async (req, res) => {
  // get data from fronted
  // validate data !null
  // find the user
  // password validate
  // access and refresh token generate
  //send cookies

  const { email, password } = req.body
  if (!email) {
    throw new ApiError(400, "Email is required ");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User not rejister plz rejister")
  }

  const isCorrectPassword = await user.isPasswordCorrect(password)

  if (!isCorrectPassword) {
    throw new ApiError(400, "Invalid user password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly: true,
    secure: true,
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "User login successfully ", { user: loggedInUser, accessToken, refreshToken })
    )

})

const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  )

  const options = {
    httpOnly: true,
    secure: true,
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(200, "User log out successfully", {})
    )

})

const admin = asyncHandler(async (req, res) => {
  const admin = req.user;
  // console.log(admin);

  if (!admin) {
    throw new ApiError(400, "Access denied")
  }

  return res.status(200).json(new ApiResponse(200, "Access guranted ", admin))

})


const transpoter = noemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kaushalkumar02918@gmail.com',
    pass: "ssox ujuf uygu cqis"
  }
})

const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    throw new ApiError(400, "user not found");
  }

  const otp = crypto.randomInt(100000, 999999).toString()

  const otpEntry = new OTP({
    userId: user._id,
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 min for valid
  })

  await otpEntry.save()

  await transpoter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "your password Reset Otp",
    text: `Your OTP for resetting your password is ${otp}. It will expire in 10 minutes.`
  })

  return res.status(200).json(new ApiResponse(200, "Otp sent successfully", {}))

})


const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body
  if (!email) {
    throw new ApiError(400, "email is required");
  }
  if (!otp) {
    throw new ApiError(400, "otp is required");
  }

  const user = await User.findOne({ email })

  if (!user) {
    throw new ApiError(400, "User does not exists");
  }
  console.log(user);

  const otpEntry = await OTP.findOne({ userId: user._id, otp })

  if (!otpEntry) {
    throw new ApiError(400, "Invalid otp");
  }

  if (Date.now() > otpEntry.expiresAt) {
    throw new ApiError(400, "Otp has expire");
  }

  return res.status(200).json(new ApiResponse(200, "Otp verify successfully", { userId: user._id }))


})

const updatePassword = asyncHandler(async (req, res) => {
  const { userId, newPassword } = req.body;
  if (!userId) {
    throw new ApiError(400, "userId is missing");
  }
  if (!newPassword) {
    throw new ApiError(400, "password is missing");
  }

  const user = await User.findById(userId)

  if (!user) {
    throw new ApiError(400, "User does not exists")
  }

  user.password = newPassword
  await user.save({ validateBeforeSave: false })
  return res.status(200).json(new ApiResponse(200, "Update password successfully", {}))

})


const exportUserData = asyncHandler(async (req, res) => {
  const workbook = new exceljs.Workbook()
  const worksheet = workbook.addWorksheet("My Users");
  worksheet.columns = [
    { header:"S no.",key:"s_no" },
    { header:"Name" ,key:"name" },
    { header:"Email", key:"email" },
    { header:"Phone No",key:"phoneNo" },
    { header:"College",key:"college" },
    { header:"Course",key:"course" },
    { header:"Semester",key:"semester" },
  ]

  let counter =1;

  const userData = await User.find({})

  userData.forEach((user)=>{
    user.s_no = counter;
    worksheet.addRow(user)    
    counter++;
  })

  worksheet.getRow(1).eachCell((cell)=>{
    cell.font = {bold:true}
  })

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", `attachment; filename=users.xlsx`);

  await workbook.xlsx.write(res)
  res.end()
})

export {
  rejisterUser,
  loginUser,
  logOutUser,
  admin,
  sendOtp,
  verifyOtp,
  updatePassword,
  exportUserData
}