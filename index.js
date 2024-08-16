import { app } from "./app.js";
import { mongoConnect } from "./src/db/index.js"
import dotenv from "dotenv"


dotenv.config({
  path:"./.env"
})




mongoConnect()
.then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log("App is started on server : ", process.env.PORT);

  })
})
.catch((err) => {
  console.log("mongo db connection failed : ", err);
  throw err;
})