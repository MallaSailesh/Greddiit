import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    Text : String ,
    PostedBy : String ,
    PostedIn : Date ,
});


export default CommentSchema;
