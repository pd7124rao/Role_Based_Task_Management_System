import express from "express";
import { changePasword, getAllusers, login, register } from "../controllers/authController.js";
import { authorization, protect } from "../middleware/authMiddleware.js";

const router=express.Router();

router.post("/register",register)
router.post("/login",login)
router.get("/myProfile",protect,(req,res)=>{
    res.status(200).json({data:req.user})
})
router.get("/admin",protect,authorization('admin'),(req,res)=>{
    res.status(200).json({message:"admin content"})
})

router.post("/changePasword",protect,changePasword)
router.get("/getAllusers",protect,authorization('admin','manager','team-lead') ,getAllusers)
export default router;