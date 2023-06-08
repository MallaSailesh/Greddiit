import mongoose from "mongoose";
import CommentSchema from "./comments.js";

const PostSchema = new mongoose.Schema({
    Text : String ,
    PostedBy : String ,
    PostedIn : String ,
    Upvotes : [String],
    Downvotes : [String],  
    Comments : [CommentSchema]
});

export default PostSchema;
