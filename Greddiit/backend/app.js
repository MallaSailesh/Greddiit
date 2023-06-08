import * as dotenv from 'dotenv';
dotenv.config();
import express from "express"; 
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cors());

import authRoutes from "./routes/auth.js";  
import followerRoutes from "./routes/follower.js";   
import subGreddiitRoutes from "./routes/subGreddiit.js";
import savedPostsRoutes from "./routes/savedPosts.js"
import chatRoutes from "./routes/chat.js"

app.use("/auth",authRoutes);
app.use("/follower",followerRoutes);
app.use("/sub-greddiit",subGreddiitRoutes);
app.use("/savedPosts",savedPostsRoutes);
app.use("/chat", chatRoutes);

mongoose.set('strictQuery', false);
console.log(process.env.MONGODB_USERNAME);
mongoose.connect("mongodb+srv://"+process.env.MONGODB_USERNAME+":"+process.env.MONGODB_PASSWORD+"@cluster0.cjaznah.mongodb.net/DassA1DB");

const port = process.env.PORT || 5000
app.listen(port, function () {
    console.log("Server started at port 5000");
});
