import { Profile } from "../modals/userProfile.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";
import { User } from "../modals/user.modal.js";

const uploadImage = asyncHandler(async (req, res) => {
  // Check if req.files or req.files.profileImg exists
  

  if (
    !req.files ||
    !req.files.profileImg ||
    req.files.profileImg.length === 0
  ) {
    throw new ApiError(400, "Profile image is required");
  }

  // Fetch the image path safely
  const imgPath = req.files.profileImg[0].path;


  const uploadedImg = await uploadOnCloudinary(imgPath);

  if (!uploadedImg) {
    throw new ApiError(400, "Image upload failed");
  }

  const imageUrl = uploadedImg.url;

  const { userId } = req.body;
 

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const updatedProfile = await Profile.findOneAndUpdate(
    { userId: new mongoose.Types.ObjectId(userId) },
    { $set: { img: imageUrl } },
    { new: true, runValidators: true }
  );

  if (!updatedProfile) {
    throw new ApiError(404, "User profile not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Profile image uploaded successfully",
        updatedProfile
      )
    );
});

const uploadProject = asyncHandler(async (req, res) => {
  const { title, desc, livelink, githublink, profileId } = req.body;
  

  if (!mongoose.Types.ObjectId.isValid(profileId)) {
    throw new ApiError(400, "Invalid profileId");
  }

  if ([title, desc, livelink, githublink, profileId].some((item) => !item)) {
    throw new ApiError(400, "all fields are required");
  }
  

  

  const profile = await Profile.findById(profileId);
  if (!profile) {
    throw new ApiError("Profile not created");
  }


  if (!req.files || !req.files.projectImg || !req.files.projectImg[0]) {
    throw new ApiError(400, "Project image is required and must be uploaded.");
  }

  const imgPath = req.files?.projectImg[0]?.path;
  if (!imgPath) {
    throw new ApiError(400, "Image is required");
  }
  const imgLink = await uploadOnCloudinary(imgPath);
  if (!imgLink) {
    throw new ApiError(400, "Img is required");
  }

  const updatePro = await Profile.findByIdAndUpdate(
    profileId,
    {
      $push: {
        projects: {
          projectTitle: title,
          projectDesc: desc,
          projectLiveLink: livelink || "",
          projectGithubLink: githublink || "" ,
          projectImg: imgLink.url,
        },
      },
    },
    { new: true, runValidators: true }
  );

  if (!updatePro) {
    throw new ApiError(400, "project  not upload");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "UploadProject successfully"));
});

const addProfile = asyncHandler(async (req, res) => {
  const {
    userId,
    about,
    gender,
    username,
    city,
    bio,
    skills,
    links,
    education,
    experiences,
  } = req.body;
  if (!userId) {
    throw new ApiError(400, "userId is required");
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "invalid user format is required");
  }
  if (!username) {
    throw new ApiError(400, "username is required");
  }

  const existingUser = await Profile.findOne({ username });
  if (existingUser) {
    throw new ApiError(409, "User name is already existing");
  }

  if (!city) {
    throw new ApiError(400, "city is required");
  }
  if (!gender) {
    throw new ApiError(400, "gender is required");
  }
  if (!bio) {
    throw new ApiError(400, "Bio is required");
  }
  if (!about) {
    throw new ApiError(400, "Bio is required");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: { createdProfile: true },
    },
    { new: true, runValidators: true } // Return updated user and run validation
  );

  const newProfile = await Profile.create({
    userId: new mongoose.Types.ObjectId(userId),
    username,
    about,
    gender,
    city,
    bio,
    img: "",
    skills,
    links,
    experiences,
    education,
  });

  const ProfileData = await Profile.findById(newProfile._id);

  if (!ProfileData) {
    throw new ApiError(500, "Something went wrong while uploading data");
  }

  return res.status(200).json(new ApiResponse(200, "profile data uploaded"));
});

const getProfileData = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid userId format");
  }

  const profile = await Profile.findOne({
    userId: new mongoose.Types.ObjectId(userId),
  }).populate("userId");

  if (!profile) {
    throw new ApiError(400, "Profile not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Get student data successfully", profile));
});


const getProfileDataForEveryone = asyncHandler(async(req,res)=>{
  const {username} = req.params;

  if(!username){
    throw new ApiError(400,"Username is required");
  }

  const userProfileData = await Profile.findOne({username});
  if(!userProfileData){
    throw new ApiError(400,"User not foud");
  }

  const updatedProfile = await Profile.findByIdAndUpdate(
    userProfileData._id,
    { $inc: { views: 1 } },
    { new: true }
  ).populate("userId",'-email -phoneNo');

  return res.status(200).json(new ApiResponse(200,"Profile Data found successfully ",updatedProfile));
})


const updateProfile = asyncHandler(async (req, res) => {
  const {
    userId,
    about,
    gender,
    username,
    city,
    bio,
    skills,
    links,
    education,
    experiences,
    name,
  } = req.body;

  if (!userId) {
    throw new ApiError(400, "userId is required");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      name: name || user.name,
    },
    { new: true, runValidators: true } // Return updated user and run validation
  );

  // Find the profile by userId
  const profile = await Profile.findOne({ userId });
  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  // Check if the username already exists and is not the current profile's username
  if (username && username !== profile.username) {
    const existingUser = await Profile.findOne({ username });
    if (existingUser) {
      throw new ApiError(409, "Username already exists");
    }
  }

  const updatedProfile = await Profile.findByIdAndUpdate(
    profile._id,
    {
      username: username || profile.username,
      about: about || profile.about,
      gender: gender || profile.gender,
      city: city || profile.city,
      bio: bio || profile.bio,
      img: profile.img,
      skills: skills || profile.skills,
      links: links || profile.links,
      education: education || profile.education,
      experiences: experiences || profile.experiences,
    },
    { new: true, runValidators: true } // Option to return the updated document and run validation
  );

  if (!updatedProfile || !updatedUser) {
    throw new ApiError(
      500,
      "Something went wrong while updating the profile and user"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Profile updated successfully", updatedProfile));
});

const incrementProfileViews = asyncHandler(async (req, res) => {
  const { profileId } = req.params;
  const profile = await Profile.findByIdAndUpdate(
    profileId,
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Profile views updated", profile.views));
});

const toggleProfileLike = asyncHandler(async (req, res) => {
  const { profileId } = req.params;
  const userId = req.user._id;

  const profile = await Profile.findById(profileId);
  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  const liked = profile.likes.includes(userId);

  if (liked) {
    profile.likes.pull(userId);
  } else {
    profile.likes.push(userId);
  }

  await profile.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        liked ? "Profile unliked" : "Profile liked",
        profile.likes.length
      )
    );
});

export {
  addProfile,
  updateProfile,
  getProfileData,
  uploadImage,
  incrementProfileViews,
  toggleProfileLike,
  uploadProject,
  getProfileDataForEveryone,
};
