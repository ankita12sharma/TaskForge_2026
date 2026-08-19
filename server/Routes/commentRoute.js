const express = require("express");

const {
  createComment,
  getCommentsByTask,
  getCommentById,
  updateComment,
  deleteComment,
  addReply,
  deleteReply,
} = require("../Controllers/commentsController");

const router = express.Router();

router.get("/task/:taskId", getCommentsByTask);

router.get("/comments/:id", getCommentById);

router.post("/createcomments", createComment);

router.put("/updatecom/:id", updateComment);

router.delete("/deletecomment/:id", deleteComment);

router.post("/:commentId/reply", addReply);

router.delete("/:commentId/reply/:replyId", deleteReply);

module.exports = router;
