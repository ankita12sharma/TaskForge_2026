const TaskModel = require("../Models/taskModel");

const createTask = async (req, res) => {
  try {
    const {
      project,
      title,
      description,
      status,
      priority,
      members,
      reporter,
      labels,
      startDate,
      dueDate,
      resources,
      createdBy,
    } = req.body;

    if (!project || !title || !createdBy) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Project, title and createdBy are required!!",
      });
    }

    const taskModel = new TaskModel({
      project,
      title,
      description,
      status,
      priority,
      members,
      reporter,
      labels,
      startDate,
      dueDate,
      resources,
      createdBy,
    });

    await taskModel.save();

    const populatedTask = await TaskModel.findById(taskModel._id)
      .populate("project", "name priority")
      .populate("members", "name email avatar")
      .populate("reporter", "name email avatar")
      .populate("createdBy", "name email avatar");

    return res.status(201).json({
      responseCode: "201",
      responseMessage: "Task created successfully!!",
      data: populatedTask,
    });
  } catch (err) {
    console.log("Create task error:", err);

    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.find({})
      .populate("project", "name priority")
      .populate("members", "name email avatar")
      .populate("reporter", "name email avatar")
      .populate("createdBy", "name email avatar");

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Tasks fetched successfully!!",
      data: tasks,
    });
  } catch (err) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await TaskModel.findById(id)
      .populate("project", "name priority")
      .populate("members", "name email avatar")
      .populate("reporter", "name email avatar")
      .populate("createdBy", "name email avatar");

    if (!task) {
      return res.status(404).json({
        responseCode: "404",
        responseMessage: "Task not found!!",
      });
    }

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Task fetched successfully!!",
      data: task,
    });
  } catch (err) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const {
      project,
      title,
      description,
      status,
      priority,
      members,
      reporter,
      labels,
      startDate,
      dueDate,
      resources,
    } = req.body;

    const { id } = req.params;

    const updateTaskData = {};

    if (project !== undefined) {
      updateTaskData.project = project;
    }

    if (title !== undefined) {
      updateTaskData.title = title;
    }

    if (description !== undefined) {
      updateTaskData.description = description;
    }

    if (status !== undefined) {
      updateTaskData.status = status;
    }

    if (priority !== undefined) {
      updateTaskData.priority = priority;
    }

    if (members !== undefined) {
      updateTaskData.members = members;
    }

    if (reporter !== undefined) {
      updateTaskData.reporter = reporter;
    }

    if (labels !== undefined) {
      updateTaskData.labels = labels;
    }

    if (startDate !== undefined) {
      updateTaskData.startDate = startDate;
    }

    if (dueDate !== undefined) {
      updateTaskData.dueDate = dueDate;
    }

    if (resources !== undefined) {
      updateTaskData.resources = resources;
    }

    const updatedData = await TaskModel.findByIdAndUpdate(
      id,
      {
        $set: updateTaskData,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    )
      .populate("project", "name priority")
      .populate("members", "name email avatar")
      .populate("reporter", "name email avatar")
      .populate("createdBy", "name email avatar");

    if (!updatedData) {
      return res.status(404).json({
        responseCode: "404",
        responseMessage: "Task not found!!",
      });
    }

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Task updated successfully!!",
      data: updatedData,
    });
  } catch (err) {
    console.log("Update task error:", err);

    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await TaskModel.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({
        responseCode: "404",
        responseMessage: "Task not found!!",
      });
    }

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Task deleted successfully!!",
      data: deletedTask,
    });
  } catch (err) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
