import Follower from "../models/followerModel.js"
import SubGreddiit from "../models/SubGredditt.js";
import { User } from "../models/userModel.js";

export const NewSubGreddiit = async (req, res) => {

    const NameExists = await SubGreddiit.findOne({ Name: req.body.Name });
    if (NameExists) {
      return res.json({ message: "A SubGreddiit with this name already exists" });
    }

    const subGreddiit = new SubGreddiit({
      Date: new Date(),
      UserName: req.UserName,
      Name: req.body.Name,
      Description: req.body.Description,
      Tags: req.body.Tags,
      BannedKeys: req.body.BannedKeys,
      Requests : [],
      Followers: [{Name : req.UserName, Time : new Date()}],
      Posts : [],
      Reports : [],
      BlockedUsers : [],
      UsersLeft : [],
    })

    try {
      await subGreddiit.save();
      res.status(200).json({ success: true,NewSubGreddiit : subGreddiit });
    } catch (error) {
      res.status(500).json({ message: "Error! Try Again" });
    }
};

export const MySubGreddiits = async (req, res) => {
  SubGreddiit.find({ UserName: req.UserName }, function (err, SubGreddiits) {
    if (!err) {
      res.status(200).json({ success: true, data: SubGreddiits });
    } else {
      res.status(500).json({ message: "Error! Try again" });
    }
  });
};

export const deleteSubGreddiit = async (req, res) => {
  SubGreddiit.findOneAndDelete({_id : req.body._id}, (err) => {
    if (!err) {   
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ message: "Error Try again Later" });
    }
  });
};

export const AllSubGreddiits = async (req, res) => {
  SubGreddiit.find({}, function (err, SubGreddiits) {
    if (!err) {
      // console.log(SubGreddiits);
      res.status(200).json({ success: true, data: SubGreddiits });
    } else {
      res.status(500).json({ message: "Error! Try again" });
    }
  });
};

export const LeaveSubGreddiit = async (req, res) => {
  SubGreddiit.updateOne(
    { _id: req.body.id },
    {
      $pull: { Followers: {Name : req.UserName} },
      $push: { UsersLeft: req.UserName },
    },
    function (err) {
      if (!err) {
        res.status(200).json({ success: true });
      } else {
        res.status(500).json({ message: "Error! Try again" });
      }
    }
  );
};

export const getDetails = async (req, res) => {
  SubGreddiit.findOne({_id : req.params.id}, async(err, found) => {
    if (!err) {
      if (found) { 
        let date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let currentDate = `${day}-${month}-${year}`;
        if(found.Followers.find(obj => obj.Name === req.UserName)) 
        {
          !found.Visitors.find(obj => obj.Time === currentDate && obj.visitors.includes(req.UserName)) 
            && found.Visitors.forEach((info) => {
            if(info.Time === currentDate){
              info.visitors.push(req.UserName);
            }
          })
         !found.Visitors.find(obj => obj.Time === currentDate) && found.Visitors.push({Time : currentDate, visitors : [req.UserName]})
          await  SubGreddiit.updateOne({_id: req.params.id}, {$set : found})
        }
        res.status(200).json({ success: true, data: found }); 
      } 
      else { res.status(404).json({ message: "No such SubGreddiit exists" }); }
    } else {
      res.status(500).json({ message: "Error Try again Later" });
    }
  });
};

// Joining Requests Page
export const Request = async (req, res) => {
  const Details = async () => {
    let user;
    try {
      user = await User.findById(req.userId);
      return user;
    } catch (err) {
      console.log(err);
    }
  };

  const userDetails = await Details();

  SubGreddiit.findOne(
    { _id: req.params.id, Requests: { $in: [userDetails] } },
    function (err, found) {
      if (!err) {
        if (found) {
          res.status(200).json({ message: "Request Aldready Sent" });
        } else {
          SubGreddiit.findOne(
            { _id: req.params.id, UsersLeft: { $in: [req.UserName] } },
            function (err, found) {
              if (!err) {
                if (found) {
                  res.status(200).json({
                    message:
                      "You Aldready Left this SubGreddiit Once . So You cant Join In Again",
                  });
                } else {
                  SubGreddiit.updateOne(
                    { _id: req.params.id },
                    { $push: { Requests: { $each: [userDetails] } } },
                    function (err) {
                      if (!err) {
                        res.status(200).json({ success: true });
                      } else {
                        res.status(500).json({ message: "Error!  Try again" });
                      }
                    }
                  );
                }
              }
            }
          );
        }
      } else {
        console.log(err);
      }
    }
  );
};

export const Accept = async (req, res) => {
  SubGreddiit.updateOne(
    { _id: req.params.id }, 
    {
      $pull: { Requests: { _id: req.body._id } },
      $push: { Followers: { $each: [{Name : req.body.UserName, Time : new Date()}] } },
    },
    function (err) {
      if (!err) {
        res.status(200).json({ success: true });
      } else {
        res.status(500).json({ message: "Error!  Try again" });
      }
    }
  );
};

export const Reject = async (req, res) => {
  SubGreddiit.updateOne(
    { _id: req.params.id },
    { $pull: { Requests: { _id: req.body._id } } },
    function (err) {
      if (!err) {
        res.status(200).json({ success: true });
      } else {
        res.status(500).json({ message: "Error!  Try again" });
      }
    }
  );
};

// Block user
export const Block = async (req, res) => {

  SubGreddiit.findOne(
    { _id: req.params.id },
    function(err,found){
      if(!err){
        if(found && !found.BlockedUsers.includes(req.body.Details.ReportedOn) ){ 
          SubGreddiit.updateOne(
            { _id: req.params.id },
            { $push: { BlockedUsers: { $each: [req.body.Details.ReportedOn] } } },
            function (err) {
              if(!err){
                res.status(200).json({success : true})
              } else {
                res.status(500).json({message :  "Error! Try again"})
              }
            }
          );
        }else if(!found) {
          res.status(500).json({message : "Not Found"})
        }
      } else {
        res.status(500).json({message : "Error Try again"})
      }
    }
  )
};

// Posts
export const getPosts = async(req, res) => {
  let { page, limit } = req.query;
  let skip = (page) * limit;
  let val = parseInt(skip) + parseInt(limit) ;
  SubGreddiit.findOne({_id : req.params.id}, function(err, found){
    if(!err && found){
      if(val > found.Posts.length) val = found.Posts.length
      res.status(200).json({success : true, Posts : found.Posts.slice(skip, val)});
    } else {
      res.json({message : "Error"});
    }
  })
}

export const NewPost = async (req, res) => {  
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${day}-${month}-${year}`; // 5-2-2023 (5th Feb)

  const Post = {
    Text: req.body.Text,
    PostedBy: req.UserName,
    PostedIn: currentDate,
    Upvotes: [],
    Downvotes: [],
  };

  SubGreddiit.findOne({_id: req.params.id}, function(err,found){
    if(!err && found){
      SubGreddiit.updateOne(
        { _id: req.params.id },
        { $push: { Posts: { $each: [Post] } } },
        function (err) {
          if (!err) { res.status(200).json({ success: true, postDetails : Post }); } 
          else { res.status(500).json({ message: "Error!  Try again" }); }
        }
      );
    } else {
      res.status(500).json({message : "Error"});
    }
  })

};

export const Status = async (req, res) => {
  const Details = async () => {
    let post;
    try {
      post = await User.findOne({
        _id: req.userId,
        SavedPosts: { $in: req.params.postId },
      });
      return post ? true : false;
    } catch (err) {
      console.log(err);
    }
  };

  const postDetails = await Details();

  SubGreddiit.findOne(
    { _id: req.params.id, "Posts._id": req.params.postId },
    async function (err, found) {
      if (!err) {
        let checkFollow = true, postOwner = "", reportPost = false;
        if (found) {
          found.Posts.forEach((post) => {
            if (post._id.toString() === req.params.postId.toString()) {
              if ( found.Reports.find(
                  (obj) =>
                    obj.PostId.toString() === req.params.postId.toString() &&
                    obj.ReportedBy === req.UserName
                )
              ) reportPost = true;
              postOwner = post.PostedBy;
            }
          });
        }

        const Details2 = async () => {
          let follow ;
          if (req.UserName !== postOwner) {
            try {
              follow = await Follower.findOne({
                follower: req.UserName,
                following : postOwner,
              });
            } catch (err) {
              console.log(err);
            } 
            return follow ? true : false;
          } else {
            return true ;
          }
        }
        checkFollow =  await Details2();
        res.status(200).json({
          success: true,
          savepost: postDetails,
          follow: checkFollow,
          report: reportPost,
        });
      } else {
        res.status(500).json({ message: "Error Try again" });
      }
    }
  );

};

export const NewComment = async(req,res) => {
  SubGreddiit.findOne({_id : req.params.id}, function(err,found){
    if(!err){
      if(found){
        found.Posts.forEach((post) => {
          if(post._id.toString() === req.params.postId.toString()){
            if (!post.Comments) {
              post.Comments = [req.body.comment];
            } else {
              post.Comments.push(req.body.comment); 
            }
            SubGreddiit.updateOne({_id : req.params.id}, {$set : found} , function(err){
              if(!err){
                res.status(200).json({success : true})
              } else {
                res.status(500).json({message : "Error"})
              }
            })
          }
        })
      } else {
        res.status(500).json({message : "Error!"})
      }
    } else {
      res.status(500).json({message : "Error!"})
    }
  })
}

export const UpVote = async (req, res) => {
  !req.body.upvote
    ? SubGreddiit.updateOne(
        { _id: req.params.id, "Posts._id": req.params.postId },
        {
          $push: { "Posts.$.Upvotes": req.UserName },
          $pull: { "Posts.$.Downvotes": req.UserName },
        },
        function (err) {
          if (!err) {
            res.status(200).json({ success: true });
          } else {
            res.status(500).json({ message: "Error Try again" });
          }
        }
      )
    : SubGreddiit.updateOne(
        { _id: req.params.id, "Posts._id": req.params.postId },
        { $pull: { "Posts.$.Upvotes": req.UserName } },
        function (err) {
          if (!err) {
            res.status(200).json({ success: true });
          } else {
            res.status(500).json({ message: "Error Try again" });
          }
        }
      );
};

export const DownVote = async (req, res) => {
  !req.body.downvote
    ? SubGreddiit.updateOne(
        { _id: req.params.id, "Posts._id": req.params.postId },
        {
          $push: { "Posts.$.Downvotes": req.UserName },
          $pull: { "Posts.$.Upvotes": req.UserName },
        },
        function (err) {
          if (!err) {
            res.status(200).json({ success: true });
          } else {
            res.status(500).json({ message: "Error Try again" });
          }
        }
      )
    : SubGreddiit.updateOne(
        { _id: req.params.id, "Posts._id": req.params.postId },
        { $pull: { "Posts.$.Downvotes": req.UserName } },
        function (err) {
          if (!err) {
            res.status(200).json({ success: true });
          } else {
            res.status(500).json({ message: "Error Try again" });
          }
        }
      );
};

export const SavePost = async (req, res) => {
  !req.body.savepost
    ? User.updateOne(
        { _id: req.userId },
        { $push: { SavedPosts: req.params.postId } },
        function (err) {
          if (!err) {
            console.log(req.params.postId);
            res.status(200).json({ success: true });
          } else {
            res.status(500).json({ message: "Error Try again" });
          }
        }
      )
    : User.updateOne(
        { _id: req.userId },
        { $pull: { SavedPosts: req.params.postId } },
        function (err) {
          if (!err) {
            res.status(200).json({ success: true });
          } else {
            res.status(500).json({ message: "Error Try again" });
          }
        }
      );
};

export const ReportPost = async (req, res) => {
  const date = new Date();
  const Report = {
    ReportedBy: req.UserName,
    ReportedOn: req.body.Details.PostedBy,
    ReportedDate: date,
    Concern: req.body.Concern,
    PostText: req.body.Details.Text,
    PostId: req.body.Details._id,
    Ignore: false,
  };

  SubGreddiit.updateOne(
    { _id: req.params.id, "Posts._id": req.params.postId },
    { $push: { Reports: { $each: [Report] } } },
    async function (err) {
      if (!err) {
        const subGreddiit = await SubGreddiit.findOne({_id : req.params.id});
        let date = new Date()
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let currentDate = `${month}-${year}`; 
        if(subGreddiit.Reports.filter(obj => obj.PostId === req.params.postId).length === 1){
          subGreddiit.DeletedPosts.find(obj => obj.Time === currentDate && obj.reportedPosts++)
          !subGreddiit.DeletedPosts.find(obj => obj.Time === currentDate) && subGreddiit.DeletedPosts.push({Time : currentDate, reportedPosts : 1, deletedPosts : 0})
        }
        await SubGreddiit.updateOne({_id: req.params.id}, {$set : subGreddiit});
        res.status(200).json({ success: true });
      } else {
        res.status(500).json({ message: "Error Try again" });
      }
    }
  );
};

export const IgnoreReportPost = async (req, res) => {
  SubGreddiit.updateOne(
    { _id: req.params.id, "Reports._id": req.params.reportId },
    { $set: { "Reports.$.Ignore": !req.body.ignore } },
    function (err) {
      if (!err) {
        res.status(200).json({ success: true });
      } else {
        res.status(500).json({ message: "Error Try again" });
      }
    }
  );
};

export const DeleteReportPost = async (req, res) => {
  const date1 = new Date();
  const time = date1 - Date.parse(req.body.CreatedDate);

  if (time >= req.body.time) {
    SubGreddiit.updateOne(
      { _id: req.params.id, "Reports._id": req.params.reportId },
      { $pull: { Reports: { _id: req.params.reportId } } },
      function (err) {
        if (!err) {
          res.status(200).json({ success: true });
        } else {
          res.status(500).json({ message: "Error Try again" });
        }
      }
    );
  } else {
    SubGreddiit.findOne({ _id: req.params.id }, function (err, found) {
      let Cancel = true;
      if (!err) {
        if (found) {
          if (found.BlockedUsers.includes(req.body.UserName)) {
            Cancel = false;
            console.log(Cancel);
          }
          found.Reports.forEach((report) => {
            if (report._id.toString() === req.params.reportId.toString()) {
              res
                .status(200)
                .json({ success: true, ignore: report.Ignore, cancel: Cancel });
            }
          });
        } else {
          res.status(500).json({ message: "Not Found" });
        }
      } else {
        res.status(500).json({ message: "Error! Try again" });
      }
    });
  }
};

export const DeletePost = async (req, res) => {
  SubGreddiit.updateOne(
    { _id: req.params.id },
    {
      $pull: {
        Reports: { PostId: req.params.postId },
        Posts: { _id: req.params.postId },
      },
    },
    async function (err) {
      if (!err) {
        const subGreddiit = await SubGreddiit.findOne({_id : req.params.id});
        let date = new Date()
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let currentDate = `${month}-${year}`; 
        subGreddiit.DeletedPosts.find(obj => obj.Time === currentDate && obj.deletedPosts++)
        await SubGreddiit.updateOne({_id: req.params.id}, {$set : subGreddiit});
        res.status(200).json({ success: true });
      } else {
        res.status(500).json({ message: "Error Try again" });
      }
    }
  );
};

export const PostCnt = async(req, res) => {
  const groupedData = {};
  SubGreddiit.findOne({_id : req.body.id}, function(err,found){
    if(!err){
      if(found){
        found.Posts.forEach((post) => {
          if(groupedData[post.PostedIn]){
            groupedData[post.PostedIn]++;
          } else {
            groupedData[post.PostedIn] = 1
          }
        });
        // const data = Object.entries(groupedData).map(([createdAt, value]) => ({ createdAt, value }));
        res.status(200).json({success : true, data : groupedData})
      } else {
        res.status(500).json({message : "Error"});
      }
    } else {
      res.status(500).json({message : "Error"});
    }
  })
}

export const FollowerCnt = async(req, res) => {
  const groupedData = {};
  SubGreddiit.findOne({_id : req.body.id}, function(err,found){
    if(!err){
      if(found){
        found.Followers.forEach((post) => {
          let day = post.Time.getDate();
          let month = post.Time.getMonth() + 1;
          let year = post.Time.getFullYear();
          let currentDate = `${day}-${month}-${year}`; 
          if(groupedData[currentDate]){
            groupedData[currentDate]++;
          } else {
            groupedData[currentDate] = 1
          }
        });
        res.status(200).json({success : true, data : groupedData})
      } else {
        res.status(500).json({message : "Error"});
      }
    } else {
      res.status(500).json({message : "Error"});
    }
  })
}

export const VisitorCnt = async(req, res) => {
  const groupedData = {};
  SubGreddiit.findOne({_id : req.body.id}, function(err,found){
    if(!err){
      if(found){
        found.Visitors.forEach((date) => {
          groupedData[date.Time] = date.visitors.length
        });
        res.status(200).json({success : true, data : groupedData})
      } else {
        res.status(500).json({message : "Error"});
      }
    } else {
      res.status(500).json({message : "Error"});
    }
  })
}

export const DeletedPostsCnt = async(req, res)=>{
  const groupedData = {};
  SubGreddiit.findOne({_id : req.body.id}, function(err,found){
    if(!err){
      if(found){
        found.DeletedPosts.forEach((date) => {
          groupedData[date.reportedPosts] = date.deletedPosts
        });
        res.status(200).json({success : true, data : groupedData})
      } else {
        res.status(500).json({message : "Error"});
      }
    } else {
      res.status(500).json({message : "Error"});
    }
  })
}
