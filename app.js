import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"
import dotenv from "dotenv"
import cron from "node-cron"


dotenv.config({
  path:"./.env"
})

const app = express();

app.use(cors({
  origin:"*",
  credentials:true
}))




app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:false}))
app.use(express.static("public"))
app.use(cookieParser())


import userRoute from "./src/routes/user.routes.js"
import pyqRoutes from "./src/routes/PYQ.routes.js"
import eBooksRoute from "./src/routes/Ebooks.routes.js"
import studyMaterialRoute from "./src/routes/StudyMaterial.routes.js"
import UniversityRoute from "./src/routes/College.routes.js"
import CourseRoute from "./src/routes/Course.routes.js"
import VideoRoute from "./src/routes/Video.routes.js"
import TeamRoute from "./src/routes/Team.routes.js"
import ProfileRoute from "./src/routes/Profile.routes.js"
import { ApiResponse } from "./src/utils/apiResponse.js";

app.use("/collegebuddy/api/v1/users",userRoute)
app.use("/collegebuddy/api/v1/pyq",pyqRoutes)
app.use("/collegebuddy/api/v1/ebooks",eBooksRoute)
app.use("/collegebuddy/api/v1/studymaterial",studyMaterialRoute)
app.use("/collegebuddy/api/v1/college",UniversityRoute)
app.use("/collegebuddy/api/v1/course",CourseRoute)
app.use("/collegebuddy/api/v1/video",VideoRoute)
app.use("/collegebuddy/api/v1/team",TeamRoute)
app.use("/collegebuddy/api/v1/profile",ProfileRoute)

app.get("/",(req,res)=>{
  return res.status(200).json(new ApiResponse(200,"System call successfully"))
})


cron.schedule( '*/2 * * * *' ,async function(){
 
  try {
    const res = await fetch('http://localhost:3000/',{
      method:"GET",
      headers:{
        "Content-Type": "application/json",
      }
    })

    let value = await res.json();

    if(res.ok){
      console.log("ok",value);
      
    }

  } catch (error) {
    console.log(error);
    
  }
  
})



export {app}