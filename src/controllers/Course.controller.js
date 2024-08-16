import { Course } from "../modals/course.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"

const getAllCourseName = asyncHandler(async (req, res) => {
  const allCourse = await Course.find({})

  if (!allCourse) {
    throw new ApiError(400, "Not have any course")
  }

  return res.status(200).json(new ApiResponse(200, "Find successfully", allCourse))

})

const addCourseName = asyncHandler(async (req, res) => {
  const {name} = req.body

  if (!name) {
    throw new ApiError(400, "course name is required");
  }

  const data = await Course.create({
    name: name
  })

  if (!data) {
    throw new ApiError(500, "Something went wrong while add Course name ")
  }

  return res.status(200).json(new ApiResponse(200, "add Course name successfully ", data))

})

export {
  addCourseName,
  getAllCourseName,
}