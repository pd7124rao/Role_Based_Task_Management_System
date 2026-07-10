import express from "express"
import { createStudent, getAllStudents } from "../controllers/studentController.js";
import { authorization, protect } from "../middleware/authMiddleware.js";

const router=express.Router();

router.get("/getAllStudents",protect,authorization('admin'),getAllStudents)
router.post("/createStudent",protect,authorization('admin'),createStudent)

export default router