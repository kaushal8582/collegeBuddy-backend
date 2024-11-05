import mongoose from "mongoose";

const savedSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    itemId:{
        type:String,
        required:true,
    },
    itemType:{
        type:String,
        required:true,
    },
    itemDetails:{
        type:Object,
        required:true,
    }

},{timestamps:true})


export const Saved = mongoose.model("Saved",savedSchema);