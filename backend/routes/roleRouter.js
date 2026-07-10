import express from "express";
import { authorization, protect } from "../middleware/authMiddleware.js";
import { changeRole } from "../controllers/roleController.js";

const router=express.Router();


router.patch("/changeRole",protect,authorization("admin","manager"),changeRole)


export default router