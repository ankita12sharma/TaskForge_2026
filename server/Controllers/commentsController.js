const mongoose = require("mongoose");
const CommentModel = require("../Models/commentModel");

const createComment = async (req, res) => {
  try {
    const { task, user, message } = req.body;

    if (!task || !user || !message) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Task, user and message are required!!",
      });
    }

    if (!mongoose.isValidObjectId(task)) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Invalid task ID!!",
      });
    }

    if (!mongoose.isValidObjectId(user)) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Invalid user ID!!",
      });
    }

    const cleanMessage = String(message).trim();

    if (!cleanMessage) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Comment message is required!!",
      });
    }

    const comment = new CommentModel({
      task,
      user,
      message: cleanMessage,
    });

    await comment.save();

    const populatedComment = await CommentModel.findById(comment._id)
      .populate("user", "name username email avatar")
      .lean();

    return res.status(201).json({
      responseCode: "201",
      responseMessage: "Comment added successfully!!",
      data: populatedComment,
    });
  } catch (err) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

const getCommentsByTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!taskId || !mongoose.isValidObjectId(taskId)) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Invalid task ID!!",
        data: [],
      });
    }

    const comments = await CommentModel.find({
      task: new mongoose.Types.ObjectId(taskId),
    })
      .populate("user", "name username email avatar")
      .sort({ createdAt: 1 })
      .lean();

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Comments fetched successfully!!",
      data: comments,
    });
  } catch (err) {
    console.error("Get comments error:", err);

    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
      data: [],
    });
  }
};

const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Invalid comment ID!!",
      });
    }

    const comment = await CommentModel.findById(id)
      .populate("user", "name username email avatar")
      .lean();

    if (!comment) {
      return res.status(404).json({
        responseCode: "404",
        responseMessage: "Comment not found!!",
      });
    }

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Comment fetched successfully!!",
      data: comment,
    });
  } catch (err) {
    console.error("Get comment by ID error:", err);

    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Invalid comment ID!!",
      });
    }

    if (message === undefined || message === null) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Comment message is required!!",
      });
    }

    const cleanMessage = String(message).trim();

    if (!cleanMessage) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Comment message is required!!",
      });
    }

    const updatedComment = await CommentModel.findByIdAndUpdate(
      id,
      {
        $set: {
          message: cleanMessage,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("user", "name username email avatar")
      .lean();

    if (!updatedComment) {
      return res.status(404).json({
        responseCode: "404",
        responseMessage: "Comment not found!!",
      });
    }

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Comment updated successfully!!",
      data: updatedComment,
    });
  } catch (err) {
    console.error("Update comment error:", err);

    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Invalid comment ID!!",
      });
    }

    const deletedComment = await CommentModel.findByIdAndDelete(id).lean();

    if (!deletedComment) {
      return res.status(404).json({
        responseCode: "404",
        responseMessage: "Comment not found!!",
      });
    }

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Comment deleted successfully!!",
      data: deletedComment,
    });
  } catch (err) {
    console.error("Delete comment error:", err);

    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

const addReply = async (req, res) => {
  return res.status(400).json({
    responseCode: "400",
    responseMessage: "Replies are not supported by the current Comment model.",
  });
};

const deleteReply = async (req, res) => {
  return res.status(400).json({
    responseCode: "400",
    responseMessage: "Replies are not supported by the current Comment model.",
  });
};

module.exports = {
  createComment,
  getCommentsByTask,
  getCommentById,
  updateComment,
  deleteComment,
  addReply,
  deleteReply,
};
