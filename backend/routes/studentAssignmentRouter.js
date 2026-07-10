import express from "express"
import { createStudentAssignment, getStudentAssignment, updateStudentMarks } from "../controllers/studentAssignmentController.js";
import { authorization, protect } from "../middleware/authMiddleware.js";
import { leaderBoard } from "../controllers/studentController.js";

const router=express.Router();

router.post("/createStudentAssignment",protect,authorization('admin'),createStudentAssignment)
router.get("/getStudentAssignment",protect,authorization('admin'),getStudentAssignment)
router.put("/updateStudentMarks",protect,authorization('admin'),updateStudentMarks)
router.get("/leaderBoard",protect,authorization('admin'),leaderBoard)



export default router