const express = require("express");

const {
  createSubtask,
  getSubtasksByTask,
  getSubtaskById,
  updateSubtask,
  deleteSubtask,
  toggleSubtask,
} = require("../Controllers/subTasksController");

const router = express.Router();

router.post("/createsubtask", createSubtask);

router.get("/subtasks/:taskId", getSubtasksByTask);

router.get("/getbyid/:id", getSubtaskById);

router.put("/editsubtask/:id", updateSubtask);

router.delete("/delete/:id", deleteSubtask);

router.patch("/toggle/:id", toggleSubtask);

module.exports = router;
