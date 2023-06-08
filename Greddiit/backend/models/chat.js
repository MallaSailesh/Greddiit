import mongoose, { Schema } from "mongoose";

const PersonSchema = new mongoose.Schema({
    UserName : String ,
    Message : String 
})

const ChatSchema = new mongoose.Schema({
    Members : [String],
    Text : [PersonSchema] ,
    Time : Date ,
});

const Chat = new mongoose.model("Chat", ChatSchema)

export default Chat;
