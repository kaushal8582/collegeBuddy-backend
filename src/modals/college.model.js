import mongoose from "mongoose"

const collegeSchema =  new mongoose.Schema({
  name:{
    type:String,
    required:true,
  }
},{timestamps:true})


export const College = mongoose.model("College",collegeSchema)