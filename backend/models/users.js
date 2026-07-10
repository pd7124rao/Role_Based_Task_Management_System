import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        enum:['admin','manager','team-lead','employee'],
        default:'employee'
    }
})


userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
    this.password=await bcrypt.hash(this.password, 10)
    next();
})

userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  console.log(update.password)

  if (update.password) {
    try {
      const hashed = await bcrypt.hash(update.password, 10);
      this.setUpdate({ ...update, password: hashed });
    } catch (err) {
      return next(err);
    }
  }

  next();
});


userSchema.methods.checkPassword=async function(password){
    return await bcrypt.compare(password,this.password)
}

const User=mongoose.model("User",userSchema)

export default User;