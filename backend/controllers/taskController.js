import Task from "../models/tasks.js";

export const createTask=async(req,res)=>{
    const {task}=req.body;
    if(!task){
        return res.status(400).json({message:"bad request : task is required"})
    }
    try{
        const newTask=await Task.create(req.body)
        res.status(201).json({message:"Task created successfully",
            task:newTask
        })
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Internal server error"})
    }
}

export const getTask=async(req,res)=>{
    try{
        const Tasks=await Task.find({assignTo:req.user.id}).populate("assignTo","name email role");
        res.status(200).json({
            message:"Task retreived successful",
            tasksList:Tasks
        })
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Internal server error"})
    }
}

export const getAllTasks=async(req,res)=>{
       try{
        const Tasks=await Task.find().populate("assignTo","name email role");
        res.status(200).json({
            message:"Task retreived successful",
            tasksList:Tasks
        })
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Internal server error"})
    }
}

export const updateTask=async(req,res)=>{
    const {id}=req.body;
    if(!id){
        res.status(400).json({
            message:"bad request : missing projet id"
        })
    }
    try{
        const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });

        res.status(201).json({
            message:"Task modified",
            task:updatedTask
        })
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Internal server error"})
    }

}

export const changeStatus=async(req,res)=>{
    const {status,id}=req.body;
    if(!id){
        res.status(400).json({message:"need to select task for changing its status"})
    }
    try{
        const TaskAssigned=await Task.findById(id)
        if(TaskAssigned?.assignTo==req.user.id){
            const task=await Task.findByIdAndUpdate(id,{status},{new:true})
            res.status(200).json({message:"status changed successfully",task})
        }else{
             res.status(400).json({message:"task is not assigned to you, your manager or admin change its status or task assinged to can change status"})
        }
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Internal server error"})
    }
}


export const deleteTask=async(req,res)=>{
    const {id}=req.body;
    try{
        const deletedTask=await Task.findByIdAndDelete(id)
        res.status(200).json({message:"task deleted successfully"})
    }catch(err){
        console.error(err)
        res.status(500).json({message:"Internal server error"})
    }
}