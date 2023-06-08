import { User } from "../models/userModel.js";
import SubGreddiit from "../models/SubGredditt.js"

export const getAllPosts = async(req,res) => {
    User.findOne({_id : req.userId},function(err,found){
        if(!err){
            if(found){
                res.status(200).json({success:true , data : found.SavedPosts})
            } else {
                res.status(500).json({message : "User Not Found"})
            }
        } else {
            res.status(500).json({message : "Error! try again"})
        }
    })
}

export const getPost = async(req,res) => {
    SubGreddiit.findOne({"Posts._id" : req.body.postId},function(err,found){
        if(!err){
            if(found){
                found.Posts.forEach(post => {
                    if (post._id.toString() === req.body.postId.toString() ) {
                        res.status(200).json({success:true , data : post, SubGreddiit : found})
                    }
                });
            } else {
                User.updateOne({ _id : req.userId },
                { $pull: { "SavedPosts": { $in : req.body.postId } } },
                function(err) {
                    if (err) {
                    res.status(500).json({ message: "Error! try again" });
                    } else {
                    res.status(200).json({ success: true});
                    }
                }
                );
            }
        } else {
            res.status(500).json({message : "Error! try again"})
        }
    })
}

export const deletePost = async(req,res) => {
    console.log(req.userId);
    User.updateOne({_id : req.userId},{$pull : {SavedPosts : {$in : req.body.postId}}},function(err){
        if(!err){
            res.status(200).json({success:true})
        } else {
            res.status(500).json({message : "Error! try again"})
        }
    })
}
