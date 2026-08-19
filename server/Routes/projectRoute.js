const express = require("express");
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../Controllers/projectController");

router.post("/createproj", createProject);
router.get("/projects", getProjects);
router.get("/getbyid/:id", getProjectById);
router.put("/editproj/:id", updateProject);
router.delete("/deleteproj/:id", deleteProject);

module.exports = router;
