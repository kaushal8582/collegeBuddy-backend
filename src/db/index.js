import mongoose from "mongoose";
import DB_NAME  from "../../constant.js";

const mongoConnect = async()=>{
  try {
  const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
  console.log("Monog DB connect successfully !!!! DB HOST",connectionInstance.connection.host);
  } catch (error) {
    console.log("MongoDb connection failed : ", error);
    
  }
}

export {mongoConnect}