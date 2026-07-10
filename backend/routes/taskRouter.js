import express from "express"
import { authorization, protect } from "../middleware/authMiddleware.js"
import { changeStatus, createTask, deleteTask, getTask, updateTask,getAllTasks } from "../controllers/taskController.js"

const router=express.Router()

router.post("/createTask",protect,authorization('admin','manager'),createTask)
router.get("/getTask",protect,getTask)
router.get("/getAllTask",protect,getAllTasks)
router.put("/changeStatus",protect,changeStatus)
router.put("/updateTask",protect,authorization('admin','manager'),updateTask)
router.delete("/deleteTask",protect,authorization('admin'),deleteTask)


export default router