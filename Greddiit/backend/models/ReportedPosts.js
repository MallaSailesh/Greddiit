import mongoose from "mongoose";

const ReportedPostSchema = new mongoose.Schema({
    ReportedBy : String ,
    ReportedOn : String ,
    ReportedDate : Date,
    Concern : String ,
    PostText : String,
    PostId : String ,
    Ignore : Boolean
});

export default ReportedPostSchema;
