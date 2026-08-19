const mongoose = require("mongoose");
const SubtaskModel = require("../Models/subTasksModel");
const TaskModel = require("../Models/taskModel");

const createSubtask = async (req, res) => {
  try {
    const { task, title, priority, member, startDate, dueDate, completed } =
      req.body;

    if (!task) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Task ID is required!!",
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Subtask title is required!!",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(task)) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Invalid task ID!!",
      });
    }

    const parentTask = await TaskModel.findById(task);

    if (!parentTask) {
      return res.status(404).json({
        responseCode: "404",
        responseMessage: "Parent task not found!!",
      });
    }

    if (member) {
      if (!mongoose.Types.ObjectId.isValid(member)) {
        return res.status(400).json({
          responseCode: "400",
          responseMessage: "Invalid member ID!!",
        });
      }

      const memberExists = await mongoose.model("User").findById(member);

      if (!memberExists) {
        return res.status(404).json({
          responseCode: "404",
          responseMessage: "Selected member not found!!",
        });
      }
    }

    const subtask = new SubtaskModel({
      task: task,

      title: title.trim(),

      priority: priority || "Low",

      member: member || null,

      startDate: startDate || null,

      dueDate: dueDate || null,

      completed: completed === true,
    });

    await subtask.save();

    const populatedSubtask = await SubtaskModel.findById(subtask._id)
      .populate("task", "title")
      .populate("member", "name username email avatar");

    return res.status(201).json({
      responseCode: "201",
      responseMessage: "Subtask created successfully!!",
      data: populatedSubtask,
    });
  } catch (err) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

const getSubtasksByTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Invalid task ID",
        data: [],
      });
    }

    const subtasks = await SubtaskModel.find({
      task: new mongoose.Types.ObjectId(taskId),
    })
      .populate("task", "title")
      .populate("member", "name username email avatar")
      .sort({
        createdAt: 1,
      });

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Subtasks fetched successfully!!",
      data: subtasks,
    });
  } catch (err) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

const getSubtaskById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Invalid subtask ID",
      });
    }

    const subtask = await SubtaskModel.findById(id)
      .populate("task", "title")
      .populate("member", "name username email avatar");

    if (!subtask) {
      return res.status(404).json({
        responseCode: "404",
        responseMessage: "Subtask not found!!",
      });
    }

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Subtask fetched successfully!!",
      data: subtask,
    });
  } catch (err) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

const updateSubtask = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, priority, member, startDate, dueDate, completed } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Invalid subtask ID!!",
      });
    }

    const updateData = {};

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          responseCode: "400",
          responseMessage: "Subtask title cannot be empty!!",
        });
      }

      updateData.title = title.trim();
    }

    if (priority !== undefined) {
      updateData.priority = priority;
    }

    if (member !== undefined) {
      if (member && !mongoose.Types.ObjectId.isValid(member)) {
        return res.status(400).json({
          responseCode: "400",
          responseMessage: "Invalid member ID!!",
        });
      }

      updateData.member = member || null;
    }

    if (startDate !== undefined) {
      updateData.startDate = startDate || null;
    }

    if (dueDate !== undefined) {
      updateData.dueDate = dueDate || null;
    }

    if (completed !== undefined) {
      updateData.completed = Boolean(completed);
    }

    const updatedSubtask = await SubtaskModel.findByIdAndUpdate(
      id,
      {
        $set: updateData,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    )
      .populate("task", "title")
      .populate("member", "name username email avatar");

    if (!updatedSubtask) {
      return res.status(404).json({
        responseCode: "404",
        responseMessage: "Subtask not found!!",
      });
    }

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Subtask updated successfully!!",
      data: updatedSubtask,
    });
  } catch (err) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

const deleteSubtask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Invalid subtask ID!!",
      });
    }

    const deletedSubtask = await SubtaskModel.findByIdAndDelete(id);

    if (!deletedSubtask) {
      return res.status(404).json({
        responseCode: "404",
        responseMessage: "Subtask not found!!",
      });
    }

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Subtask deleted successfully!!",
      data: deletedSubtask,
    });
  } catch (err) {
    console.error("DELETE SUBTASK ERROR:", err);

    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

const toggleSubtask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Invalid subtask ID!!",
      });
    }

    const subtask = await SubtaskModel.findById(id);

    if (!subtask) {
      return res.status(404).json({
        responseCode: "404",
        responseMessage: "Subtask not found!!",
      });
    }

    subtask.completed = !subtask.completed;

    await subtask.save();

    const populatedSubtask = await SubtaskModel.findById(subtask._id)
      .populate("task", "title")
      .populate("member", "name username email avatar");

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Subtask status updated successfully!!",
      data: populatedSubtask,
    });
  } catch (err) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

module.exports = {
  createSubtask,
  getSubtasksByTask,
  getSubtaskById,
  updateSubtask,
  deleteSubtask,
  toggleSubtask,
};
