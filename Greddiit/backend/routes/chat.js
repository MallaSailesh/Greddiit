import express from "express";
import auth from "../middleware/auth.js";
import {Chat, getData, submitData} from "../controllers/chat.js"

const router = express.Router();

router.post("/:other",Chat);
router.post("/:other/submitData",submitData);
router.post("/:other/getData",getData);

export default router ;
