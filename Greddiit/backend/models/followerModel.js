import mongoose from "mongoose";

const followerSchema = new mongoose.Schema({
    follower : String ,
    following : String 
});

const Follower = mongoose.model("Follower", followerSchema);

export default Follower ; 

