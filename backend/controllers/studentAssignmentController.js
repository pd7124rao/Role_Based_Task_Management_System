import Assignment from '../models/assignment.js';
import Student from '../models/students.js';
import StudentAssignment from '../models/studentAssignment.js';

export const createStudentAssignment = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required.'
      });
    }

    const due = new Date(dueDate);
    if (isNaN(due.getTime()) || due < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Due date must be a valid future date.'
      });
    }

  
    const assignment = await Assignment.create({ title, description, dueDate });

    const students = await Student.find();
    if (!students.length) {
      return res.status(404).json({
        success: false,
        message: 'No students found to assign the assignment.'
      });
    }


    const records = students.map(student => ({
      assignmentId: assignment._id,
      studentId: student._id,
      marks: 0
    }));

    await StudentAssignment.insertMany(records);

    return res.status(201).json({
      success: true,
      message: 'Assignment created and assigned to students successfully.',
      assignment
    });

  } catch (error) {
    console.error('Error creating student assignment:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        error: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while creating assignment.',
      error: error.message
    });
  }
};

export const getStudentAssignment=async(req,res)=>{
     try {
    const { assignmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid assignment ID'
      });
    }


    const data = await StudentAssignment.find({ assignmentId })
      .populate('studentId', 'name rollNumber')
      .exec();

    if (!data.length) {
      return res.status(404).json({
        success: false,
        message: 'No student assignments found for this assignment ID'
      });
    }

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Error fetching student assignments:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching student assignments',
      error: error.message
    });
  }
}

export const updateStudentMarks=async(req,res)=>{
      try {
    const { studentAssignmentId } = req.params;
    const { marks } = req.body;

    if (!mongoose.Types.ObjectId.isValid(studentAssignmentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid student assignment ID.'
      });
    }

    if (marks === undefined || typeof marks !== 'number' || marks < 0) {
      return res.status(400).json({
        success: false,
        message: 'Marks must be a non-negative number.'
      });
    }

    const updated = await StudentAssignment.findByIdAndUpdate(
      studentAssignmentId,
      { marks },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Student assignment not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Marks updated successfully.',
      data: updated
    });
  } catch (error) {
    console.error('Error updating marks:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating marks.',
      error: error.message
    });
  }
}