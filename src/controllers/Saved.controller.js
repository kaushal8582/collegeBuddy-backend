import { Saved } from "../modals/saved.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js"


const savedItem = asyncHandler(async(req,res)=>{
    const {userId,itemId,itemType,itemDetails} = req.body;

    const exist = await Saved.findOne({itemId:itemId});
    if(exist){
        throw new ApiError(409,"Already exists")
    }

    if([userId,itemId,itemType].some((item)=> (item?.trim()==""))){
        throw new ApiError(400,"all field are required");
    }

    const savedData = await Saved.create({
        userId,
        itemDetails,
        itemId,
        itemType,
    })

    const finded = await Saved.findById(savedData._id);
    if(!finded){
        throw new ApiError(500,"Something went wrong while uploading savedData");
    }

    return res.status(200).json(new ApiResponse(200,"saved data successfully ", finded));
})


const getAllSavedData = asyncHandler(async(req,res)=>{
    const userId = req.params?.userId;

    console.log(userId)

    const allSavedData = await Saved.find({userId})

    if(!allSavedData){
        throw new ApiError(400,"Not find any data");
    }

    return res.status(200).json(new ApiResponse(200,"finded saved data successfully ", allSavedData))

})




export {savedItem,getAllSavedData}