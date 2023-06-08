import express from "express";

const router = express.Router();
import {
  NewSubGreddiit,getDetails,MySubGreddiits,deleteSubGreddiit,AllSubGreddiits,
  Request,Accept,Reject,Block,getPosts,NewPost,Status,NewComment,
  UpVote,DownVote,SavePost,LeaveSubGreddiit,
  ReportPost,IgnoreReportPost,DeleteReportPost,DeletePost,
  PostCnt,FollowerCnt,VisitorCnt,DeletedPostsCnt
} from "../controllers/subGreddiit.js";
import auth from "../middleware/auth.js";

router.post("/", auth, NewSubGreddiit);
router.get("/MySubGreddiits", auth, MySubGreddiits);
router.delete("/delete", deleteSubGreddiit);
router.get("/AllSubGreddiits", AllSubGreddiits);
router.post("/LeaveSubGreddiit",auth,LeaveSubGreddiit)
router.get("/:id",auth, getDetails);
router.post("/:id/request", auth, Request);
router.put("/:id/request/accept",Accept);
router.put("/:id/request/reject",Reject);
router.post("/:id/blockUser",Block);
router.get("/:id/getPosts",getPosts);
router.post("/:id/post", auth, NewPost);
router.get("/:id/:postId/status",auth,Status);
router.post("/:id/:postId/NewComment",NewComment);
router.post("/:id/:postId/upvote",auth,UpVote);
router.post("/:id/:postId/downvote",auth,DownVote);
router.post("/:id/:postId/savepost",auth,SavePost);
router.post("/:id/:postId/report",auth,ReportPost);
router.post("/:id/:reportId/ignoreReport",IgnoreReportPost);
router.post("/:id/:reportId/deleteReport",auth,DeleteReportPost);
router.post("/:id/:postId/delete",DeletePost);
router.post("/stats/posts",PostCnt);
router.post("/stats/Followers",FollowerCnt);
router.post("/stats/Visitors",VisitorCnt);
router.post("/stats/DeletedPosts",DeletedPostsCnt);

export default router;
