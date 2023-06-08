import express from "express";

import auth from "../middleware/auth.js";
import {getAllPosts,getPost, deletePost} from "../controllers/savedPosts.js"

const router = express.Router();


router.get("/",auth,getAllPosts);
router.post("/getPost",auth,getPost);
router.put("/deletePost",auth,deletePost);

export default router ;