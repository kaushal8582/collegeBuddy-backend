import mongoose from "mongoose"

const videoSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true,
  },
  desc:{
    type:String
  },
  videoLink:{
    type:String,
    required:true,
  }

},{timestamps:true})


export const Video = mongoose.model("Video",videoSchema)