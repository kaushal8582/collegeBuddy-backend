import mongoose from "mongoose";

const previousYearQuestionSchema = new mongoose.Schema({
  universityName:{
    type:String,
    required:true,
  },
  semester:{
    type:String,
    required:true,
  },
  year:{
    type:Number,
    required:true
  },
  courseName:{
    type:String,
    required:true,
  },
  questionLink:{
    type:String,
    required:true,
  },
  img:{
    type:String,
    required:true,
  }
},{timestamps:true})


export const Pyq = mongoose.model("Pyq",previousYearQuestionSchema);