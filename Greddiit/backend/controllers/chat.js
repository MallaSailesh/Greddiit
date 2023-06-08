import Follower from "../models/followerModel.js";
import chat from "../models/chat.js"

export const Chat = async(req, res) => {

    const me = req.body.me ;
    const other = req.params.other ;

    Follower.findOne({follower : me , following : other}, function(err,found1){
        if(!err){
            if(found1){
                Follower.findOne({follower : other, following : me}, function(err, found2){
                    if(!err){
                        if(found2){
                            res.status(200).json({success : true});
                        } else {
                            res.status(200).json({message : "Both of them must follow each other to chat"}); 
                        }
                    } else {
                        res.status(500).json({message : "Error Try again"})
                    }
                })
            } else {
                res.status(200).json({message : "Both of them must follow each other to chat"}); 
            }
        } else {
            res.status(500).json({message : "Error Try again"})
        }
    })
}

export const submitData = async(req, res) => {

    const me = req.body.me;
    const other = req.params.other;
    chat.find({Members : {$all : [me, other] }}, function(err, found){
        if(!err){
            if(found && found.length === 0){
                const Person = new chat({
                    Members : [me, other],
                    Text : [ {UserName : me, Message : req.body.text} ],
                    Time : new Date()
                });
                Person.save();
                res.status(200).json({success : true});
            } else {
                const Person = {
                    UserName : me ,
                    Message : req.body.text ,
                }

                chat.updateOne({Members : {$all : [me, other]}}, {$push : {Text : {$each : [Person]}}}, function(err){
                    if(err){
                        res.status(500).json({message : "Error"});
                    } else {
                        res.status(200).json({success : true});
                    }
                })  
            }
        } else {
            res.status(500).json({message : "Error"});
        }
    })
}

export const getData = async(req, res) => {

    const me = req.body.me;
    const other = req.params.other;

    chat.find({Members : {$all : [me, other] }}, function(err, found){
        if(!err ){
            Follower.findOne({follower : me , following : other}, function(err,found1){
                if(!err){
                    if(found1){
                        Follower.findOne({follower : other, following : me}, function(err, found2){
                            if(!err){
                                if(found2){
                                    if(found && found.length ){res.status(200).json({success : true, chats : found[0].Text})}
                                    else {res.status(200).json({success : true, chats : []});}
                                } else {
                                    res.status(200).json({message : "Both of them must follow each other to chat"}); 
                                }
                            } else {
                                res.status(500).json({message : "Error Try again"})
                            }
                        })
                    } else {
                        res.status(200).json({message : "Both of them must follow each other to chat"}); 
                    }
                } else {
                    res.status(500).json({message : "Error Try again"})
                }
            })
        } else {
            res.status(500).json({message : "Error"});
        }
    })

}
