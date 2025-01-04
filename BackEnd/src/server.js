import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";
import { uploadOnCloudinary } from "./utils/cloudinary.js";

dotenv.config({
  path: "./.env",
});

// api endpoint
app.get("/", (req, res) => {
  res.send("Api Working greats");
});
uploadOnCloudinary();
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3368, () => {
      console.log("Server is running at port:", process.env.PORT);
    });
    app.on("error", () => {
      console.log("Err!!", error);
      throw error;
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed!!!", err);
  });
