import mongoose from "mongoose"

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  profilePic:{
    type:String,
    required:true,
  },
  role: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  portfolio: {
    type: String,
    required: false,
  },
  instagram: {
    type: String,
    required: false,
  },
  linkedin: {
    type: String,
    required: false,
  },
  github: {
    type: String,
    required: false,
  }
}, { timestamps: true });


export const Team = mongoose.model("Team", teamSchema);