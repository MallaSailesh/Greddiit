import * as dotenv from "dotenv";
dotenv.config();
import { User } from "../models/userModel.js";
import Follower from "../models/followerModel.js";
import SubGreddiit from "../models/SubGredditt.js";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import PostSchema from "../models/posts.js";

const saltRounds = 10;

export const register =
  (body("UserName").notEmpty(),
  // email must be not empty
  body("Email", "Incorrect Email").isEmail().notEmpty(),
  // phone number must have 10 digits
  body("PhoneNumber", "Incorrect Phone Number").isLength(10),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), message: "Enter Valid Credentials" });
    }

    if (req.body.Password.length < 5) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 5 characters long" });
    }

    //Check the user is already in the db
    const emailExists = await User.findOne({ Email: req.body.Email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const UserNameExists = await User.findOne({ UserName: req.body.UserName });
    if (UserNameExists) {
      return res.status(400).json({ message: "UserName already exists" });
    }

    const hashPassword = await bcrypt.hash(req.body.Password, saltRounds);

    const user = new User({
      FirstName: req.body.FirstName,
      LastName: req.body.Password,
      UserName: req.body.UserName,
      Email: req.body.Email,
      Password: hashPassword,
      Age: req.body.Age,
      PhoneNumber: req.body.PhoneNumber,
    });

    try {
      await user.save();
      const token = jwt.sign(
        { Email: user.Email, UserName: user.UserName, id: user._id },
        process.env.JWT_SECRET_KEY
      );
      res.send({ success: true, token: token });
    } catch (error) {
      res.json({ message: "Enter Valid Credentials" });
    }
  });

export const login =
  (body("UserName").notEmpty(),
  body("Password").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), message: "Enter Valid Credentials" });
    }

    // if(req.userId) return res.send({ success: true});

    User.findOne({ UserName: req.body.UserName }, function (err, foundUser) {
      if (!err) {
        if (foundUser) {
          bcrypt.compare(
            req.body.Password,
            foundUser.Password,
            function (err, result) {
              if (!err) {
                if (result == true) {
                  const token = jwt.sign(
                    {
                      Email: foundUser.Email,
                      UserName: foundUser.UserName,
                      id: foundUser._id,
                    },
                    process.env.JWT_SECRET_KEY
                  );
                  // {expiresIn : "1h"}
                  res.send({ success: true, token: token });
                } else {
                  res.json({ message: "Incorrect Password" });
                }
              } else {
                res.status(500).json({ message: "Error! Try Again" });
              }
            }
          );
        } else {
          res.json({
            message:
              "User Not Found.You dont have an account.\n\t So register first\n or \n may be you entered incorrect UserName",
          });
        }
      } else {
        res.status(500).json({ message: "Error Occured ! Try Again" });
      }
    });
  });

export const profile = async (req, res) => {
  const user = await User.findOne({ _id: req.userId });
  const calc_followers = async () => {
    let count;
    try {
      count = await Follower.count({ following: req.UserName });
      return count;
    } catch (err) {
      console.log(err);
    }
  };
  const calc_following = async () => {
    let count;
    try {
      count = await Follower.count({ follower: req.UserName });
      return count;
    } catch (err) {
      console.log(err);
    }
  };

  const no_followers = await calc_followers();
  const no_following = await calc_following();

  try {
    res.status(200).json({
      success: true,
      userDetails: user,
      followers: no_followers,
      following: no_following,
    });
  } catch (err) {
    res.status(500).json({ message: "Error Occured ! Try Again" });
  }
};

export const editProfile =
  (body("user.UserName").notEmpty(),
  body("user.Email", "Incorrect Email").isEmail().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {  
      return res
        .status(400)
        .json({ errors: errors.array(), message: "Enter Valid Credentials" });
    }

    // Check the user is already in the db
    const emailExists = await User.findOne({ Email: req.body.user.Email });
    if (req.body.oldEmail !== req.body.user.Email && emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const UserNameExists = await User.findOne({
      UserName: req.body.user.UserName,
    });
    if (req.body.oldUserName !== req.body.user.UserName && UserNameExists) {
      return res.status(400).json({ message: "UserName already exists" });
    }

    User.findOneAndUpdate(
      { _id: req.userId },
      req.body.user,
      { new: true },
      function (err, updatedUser) {
        if (err) {
          res.status(500).json({ message: "Error! Try again Later" });
        } else {
          Follower.updateMany(
            { follower: req.body.oldUserName },
            { $set: { follower: req.body.user.UserName } },
            function (err) {
              if (err) {
                console.log(err);
              }
            }
          );
          Follower.updateMany(
            { following: req.body.oldUserName },
            { $set: { following: req.body.user.UserName } },
            function (err) {
              if (err) {
                console.log(err);
              }
            }
          );
          SubGreddiit.find(
            { },
            function (err, found) {
              if (err) {
                console.log(err);
              } else {
                if (found) {
                  found.forEach((subgreddiit) => {
                    subgreddiit.Posts.forEach((post) => {
                      if (post.PostedBy === req.body.oldUserName) {
                        post.PostedBy = req.body.user.UserName;
                      }
                      post.Upvotes.forEach((vote,index) => {
                        if(vote === req.body.oldUserName){
                          post.Upvotes[index] = req.body.user.UserName
                        }
                      })
                      post.Downvotes.forEach((vote,index) => {
                        if(vote === req.body.oldUserName){
                          post.Downvotes[index] = req.body.user.UserName
                        }
                      })
                    });
                    if(subgreddiit.UserName === req.body.oldUserName){
                      subgreddiit.UserName = req.body.user.UserName
                    }
                    subgreddiit.Followers.forEach((user,index) => {
                      if(user.Name === req.body.oldUserName){
                        subgreddiit.Followers[index].Name = req.body.user.UserName
                      }
                    })
                    subgreddiit.Reports.forEach((report) => {
                      if (report.ReportedBy === req.body.oldUserName) {
                        report.ReportedBy = req.body.user.UserName;
                      }
                      if (report.ReportedOn === req.body.oldUserName) {
                        report.ReportedOn = req.body.user.UserName;
                      }
                    });
                    subgreddiit.UsersLeft.forEach((userleft,index) => {
                        if (userleft === req.body.oldUserName) {
                            subgreddiit.UsersLeft[index] = req.body.user.UserName;
                        }
                    });
                    subgreddiit.Requests.forEach((user) => {
                        if (user.UserName === req.body.oldUserName) {
                          user.UserName = req.body.user.UserName;
                        }
                    });
                    subgreddiit.BlockedUsers.forEach((user,index) => {
                        if (user === req.body.oldUserName) {
                          subgreddiit.BlockedUsers[index] = req.body.user.UserName;
                        }
                    });
                    SubGreddiit.updateOne(
                      { _id: subgreddiit._id },
                      { $set: subgreddiit},
                      function (err) {
                        if (err) {
                          console.log(err);
                        }
                      }
                    );
                  });
                }
              }
            }
          );
          const token = jwt.sign(
            {
              Email: req.body.user.Email,
              UserName: req.body.user.UserName,
              id: updatedUser._id,
            },
            process.env.JWT_SECRET_KEY
          );
          res.status(200).json({ success: true, token: token });
        }
      }
    );
  });

// google login
export const googleLogin = async (req, res) => {
  const credentials = req.body.token;

  const decodedData = jwt.decode(credentials);

  User.findOne({ googleId: decodedData.sub }, function (err, foundUser) {
    if (!err) {
      if (foundUser) {
        const token = jwt.sign(
          {
            Email: foundUser.Email,
            UserName: foundUser.UserName,
            id: foundUser._id,
          },
          process.env.JWT_SECRET_KEY
        );
        res.send({ success: true, token: token });
      } else {
        const NewUser = new User({
          UserName: decodedData.name,
          Email: decodedData.email,
          googleId: decodedData.sub,
        });
        NewUser.save();
        const token = jwt.sign(
          {
            Email: decodedData.email,
            UserName: decodedData.name,
            id: NewUser._id,
          },
          process.env.JWT_SECRET_KEY
        );
        res.status(200).json({ success: true, token: token });
      }
    } else {
      res.status(500).json({ message: "Error try again." });
    }
  });
};
