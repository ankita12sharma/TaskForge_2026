const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../Controllers/taskController");

router.post("/create", createTask);
router.get("/tasks", getTasks);
router.get("/getbyid/:id", getTaskById);
router.put("/updatetask/:id", updateTask);
router.delete("/del/:id", deleteTask);

module.exports = router;
