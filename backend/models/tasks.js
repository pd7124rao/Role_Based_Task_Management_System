import mongoose from "mongoose"

const taskSchema=new mongoose.Schema({
    task:{
        type:String,
        required:true
    },
    description:String,
    assignTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    status:{
        type:String,
        enum:['pending','in-progress','completed'],
        default:'pending'
    }
})

const Task=mongoose.model("Task",taskSchema)

export default Task;