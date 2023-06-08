import express from "express";

import { register,login,profile, googleLogin, editProfile } from "../controllers/auth.js";
import auth from "../middleware/auth.js";


const router = express.Router()
 
router.post("/Register",register);
router.post("/Login",login);
router.post("/Profile",auth,profile);
router.post("/google/Login",googleLogin);
router.put("/editProfile",auth,editProfile);

export default router ;
