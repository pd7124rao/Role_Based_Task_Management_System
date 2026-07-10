import mongoose from "mongoose";

const studentAssignmentSchema=new mongoose.Schema({
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
     marks: { type: Number, default: 0 }
})

const StudentAssignemt=mongoose.model("StudentAssignemt",studentAssignmentSchema)

export default StudentAssignemt