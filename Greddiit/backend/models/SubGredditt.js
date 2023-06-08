import mongoose from "mongoose";
import PostSchema from "./posts.js";
import ReportedPostSchema from "./ReportedPosts.js";
import {UserSchema} from "./userModel.js" 

const JoinSchema = new mongoose.Schema({
    Name : String,
    Time : Date 
});

const ObjectSchema1 = new mongoose.Schema({
    Time : String , 
    visitors : [String]
})

const ObjectSchema2 = new mongoose.Schema({
    Time : String ,
    reportedPosts : Number,
    deletedPosts : Number 
})

const SubGreddiitSchema = new mongoose.Schema({
    Date : Date ,
    UserName : String ,
    Name : String ,
    Description  : String ,
    Tags : [String],
    BannedKeys : [String],
    Requests : [UserSchema],
    Followers : [JoinSchema],
    Posts : [PostSchema],
    Reports : [ReportedPostSchema],
    BlockedUsers : [String],
    UsersLeft : [String],
    Visitors : [ObjectSchema1],
    DeletedPosts : [ObjectSchema2]
});

const SubGreddiit = new mongoose.model("SubGreddiit",SubGreddiitSchema);

export default SubGreddiit ; 