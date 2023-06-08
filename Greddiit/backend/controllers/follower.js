import Follower from "../models/followerModel.js";

export const follow = async(req,res) =>  {
    
    const follower = new Follower({
        follower : req.UserName,
        following : req.body.follow
    });
    
    try {
        await follower.save();
        res.status(200).json({success : true})
    } catch (error) {
        res.status(500).json({message : "Error try again later."});
    }
}

export const unfollow = async(req,res) => {

    Follower.findByIdAndDelete(req.body.id , (err) => {
        if(!err){
            res.status(200).json({success : true});
        } else {
            res.status(500).json({message : "Error Try again Later"});
        }
    });
    
}

export const countFollowers = async(req,res) => {
    Follower.count({following : req.params.Email}, (err, count) => {
        if(!err){
            res.status(200).json({success : true , data : count})
        } else {
            res.status(500).json({message : "Error. Try again"});
        }
    })
}

export const countFollowing = async(req,res) => {
    Follower.count({follower : req.params.Email}, (err, count) => {
        if(!err){
            res.status(200).json({success : true , data : count})
        } else {
            res.status(500).json({message : "Error. Try again"});
        }
    })
}

export const followers = async(req,res) => {
    Follower.find({following : req.UserName}, (err, followers) => {
        if(!err){
            // console.log(followers);
            res.status(200).json({success:true , data:followers});
        } else {
            res.status(500).json({message : "Error. Try again"});
        }
    })
}

export const following = async(req,res) => {
    Follower.find({follower : req.UserName}, (err, following) => {
        if(!err){
            // console.log(following);
            res.status(200).json({success: true , data:following})
        } else {
            res.status(500).json({message : "Error. Try again"});
        }
    })
}

