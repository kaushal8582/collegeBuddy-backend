import mongoose from "mongoose";

const eBooksSchema  = new mongoose.Schema({
  title:{
    type:String,
    required:true,
  },
  description:{
    type:String
  },
  thumbnail:{
    type:String,
    required:true,
  },
  ebookLink:{
    type:String,
    required:true,
  }
},{timestamps:true})



export const Ebook = mongoose.model("Ebook",eBooksSchema);