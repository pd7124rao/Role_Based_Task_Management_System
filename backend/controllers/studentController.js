import Student from "../models/students.js";

export const createStudent=async(req,res)=>{
    const { name, email, classSection, rollNumber, college } = req.body;

  if (!name || !email || !classSection || !rollNumber) {
    return res.status(400).json({ error: "All fields except 'college' are required." });
  }

  try {
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ error: "Email already exists." });
    }

    const student = new Student({
      name,
      email,
      classSection,
      rollNumber,
      college, 
    });

    await student.save();
    res.status(201).json(student);
  } catch (err) {
    console.error("Error creating student:", err);
    res.status(500).json({ error: "Internal server error." });
  }
}

export const getAllStudents=async(req,res)=>{
    try {
    const allStudents = await Student.find();

    if (!allStudents.length) {
      return res.status(404).json({
        message: "No students found in the database.",
        studentList: [],
      });
    }

    res.status(200).json({
      message: "Successfully retrieved all students.",
      count: allStudents.length,
      studentList: allStudents,
    });
  } catch (err) {
    console.error("Error retrieving students:", err.message, err.stack);
    res.status(500).json({
      message: "Internal server error while retrieving students.",
      error: err.message,
    });
  }
}

export const leaderBoard=async(req,res)=>{
     try {
    const leaderboard = await StudentAssignment.aggregate([
      {
        $group: {
          _id: "$studentId",
          totalMarks: { $sum: "$marks" }
        }
      },
      {
        $lookup: {
          from: "students",
          localField: "_id",
          foreignField: "_id",
          as: "student"
        }
      },
      { $unwind: "$student" },
      {
        $project: {
          _id: 0,
          studentId: "$student._id",
          name: "$student.name",
          rollNumber: "$student.rollNumber",
          totalMarks: 1
        }
      },
      { $sort: { totalMarks: -1 } } 
    ]);

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}