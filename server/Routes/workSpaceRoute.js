const express = require("express");
const router = express.Router();

const {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  addMember,
  leaveWorkspace,
  deleteWorkspace,
} = require("../Controllers/workspaceController");

router.post("/createspace", createWorkspace);

router.get("/getspace", getWorkspaces);

router.get("/workspace/:id", getWorkspaceById);

router.put("/editworkspace/:id", updateWorkspace);

router.put("/addmember/:workspaceId", addMember);
router.put("/leaveworkspace/:workspaceId", leaveWorkspace);
router.delete("/deleteworkspace/:id", deleteWorkspace);

module.exports = router;
