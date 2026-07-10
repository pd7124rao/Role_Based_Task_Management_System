import jwt from "jsonwebtoken"
import User from "../models/users.js"

const generateToken=(user)=>{
    return jwt.sign({id:user.id,email:user.email,role:user.role,name:user.name},process.env.JWT_SECRET,{expiresIn:"1d"})
}

export const register=async(req,res)=>{
    const {name,email,password}=req.body;
    if(!name || !email || !password){
        res.status(400).json({message:"bad request : missing parameters"})
    }
    try{
        const userExists=await User.findOne({email});

        if(userExists){
            res.status(400).json({message :"User already exists"})
        }else{
            const newUser=await User.create({name,email,password})
            res.status(201).json({
                token:generateToken(newUser),
                user:{id:newUser.id,email:newUser.email,role:newUser.role}
            })
        }
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Internal server error"})
    }
}

export const login=async(req,res)=>{
    const {email,password}= req.body;
    console.log(email,password)
    if(!email || !password){
        res.status(400).json({message:"Bad request : missing paramters"})
    }
    try{
        const userExists=await User.findOne({email});
        if(!userExists){
            res.status(400).json({message:"User not found"})
        }

        if(!await userExists.checkPassword(password)){
            res.status(400).json({message:"Invalid password"})
        }
        res.status(200).json({
            token:generateToken(userExists),
            user:{id:userExists.id,email:userExists.email,role:userExists.role,name:userExists.name}
        })

    }catch(err){
        console.error(err);
        res.status(500).json({message:"Internal server error"})
    }
}

export const changePasword=async(req,res)=>{
    console.log(req)
    const {email}=req.user
    const {currentPassword,newPassword}=req.body;
    try{
        const user=await User.findOne({email})
        if(!user){
            res.status(400).json({message:"Bad request user not found"})
        }
        console.log(user, "in request")

         const isPasswordValid  =await user.checkPassword(currentPassword)

         if(!isPasswordValid){
            res.status(401).json({message:"Incorrect password"})
         }
         const updatedUser=await User.findOneAndUpdate({email},{password:newPassword},{new:true,runValidators:true}).select("-password")

         res.status(200).json({
            user:updatedUser,
            message:"Password change successfully"
         })

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal server error"})
    }
}

export const getAllusers=async(req,res)=>{
    try{

        const allUsers=await User.find().select("-password");

        res.status(200).json({
            users:allUsers
        })

    }catch(err){
        console.error(err)
        res.status(500).json({message:"Internal server error"})
    }
}