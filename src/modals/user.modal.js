import mongoose from "mongoose";
import bcrypt from "bcrypt"
import JWT from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
  },
  email:{
    type:String,
    required:true,
    unique: true,
  },
  password:{
    type:String,
    required:true
  },
  phoneNo:{
    type:String,
    required:true
  },
  college:{
    type:String,
    required:true,
  },
  course:{
    type:String,
    required:true
  },
  semester:{
    type:String,
    required:true,
  },
  profilePic:{
    type:String,
    required:false
  },
  refreshToken:{
    type:String,
  }

},{timestamps:true})


userSchema.pre("save",async function(next){
  if(!this.isModified("password")) return next();

  this.password= await bcrypt.hash(this.password,10)
  next();
})

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password,this.password)
}


userSchema.methods.generateAccessToken = function(){
  return JWT.sign(
    {
      _id:this._id,
      email:this.email,
      name:this.name,
    },
    process.env.ACCESS_TOKEN_SECREAT,
    {
      expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}
userSchema.methods.generateRefreshToken = function(){
  return JWT.sign(
    {
      _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}


export const User = mongoose.model("User",userSchema)