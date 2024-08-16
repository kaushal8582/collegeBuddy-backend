import mongoose from "mongoose";

const studyMaterialSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true,
  },
  desc:{
    type:String,
    required:true,
  },
  university:{
    type:String,
    required:true,
  },
  sem:{
    type:String,
    required:true,
  },
  materialLink:{
    type:String,
    required:true,
  },
  thumbnail:{
    type:String,

  }
},{timestamps:true})



export const StudyMaterial = mongoose.model("StudyMaterial",studyMaterialSchema)