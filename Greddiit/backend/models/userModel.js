import mongoose from "mongoose";
import PostSchema from "./posts.js"

const UserSchema = new mongoose.Schema({
    FirstName: String,
    LastName: String,
    UserName: String,
    Email: String,
    Password: String,
    Age: Number,
    PhoneNumber: Number,
    googleId: String,
    SavedPosts: [String]
});

const User = new mongoose.model('User', UserSchema);

export { User, UserSchema } ;
