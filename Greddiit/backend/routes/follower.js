import express from "express";

import {follow , unfollow, countFollowers, countFollowing, followers, following} from "../controllers/follower.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/follow",auth,follow);
router.delete("/unfollow",unfollow);
router.get("/countFollowers/:Email",countFollowers);
router.get("/count/Following/:Email",countFollowing);
router.post("/followers",auth,followers);
router.post("/following",auth,following);

export default router ;