import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  classSection: {
    type: String,
    required: true,
  },
  rollNumber: {
    type: String,
    required: true,
  },
  college: {
    type: String,
    required: true,
    default:"GITS, Udaipur"
  },
});


studentSchema.index({ college: 1, classSection: 1, rollNumber: 1 }, { unique: true });

const Student = mongoose.model("Student", studentSchema);

export default Student;
