const mongoose = require("mongoose");
const WorkspaceModel = require("../Models/workspaceModel");
const UserModel = require("../Models/userModel");

const createWorkspace = async (req, res) => {
  try {
    const { name, owner, members } = req.body;

    if (!name || !owner) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Name and owner are required!!",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Invalid owner user ID!!",
      });
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Workspace name cannot be empty!!",
      });
    }

    const existingWorkspace = await WorkspaceModel.findOne({
      name: trimmedName,
    });

    if (existingWorkspace) {
      return res.status(409).json({
        responseCode: "409",
        responseMessage: "Workspace already exists!!",
      });
    }

    let workspaceMembers = [owner];

    if (Array.isArray(members)) {
      const validMembers = members.filter((memberId) =>
        mongoose.Types.ObjectId.isValid(memberId),
      );

      workspaceMembers = [
        ...new Set([
          owner.toString(),
          ...validMembers.map((id) => id.toString()),
        ]),
      ];
    }

    const workspaceModel = new WorkspaceModel({
      name: trimmedName,
      owner,
      members: workspaceMembers,
    });

    await workspaceModel.save();

    const populatedWorkspace = await WorkspaceModel.findById(workspaceModel._id)
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar");

    return res.status(201).json({
      responseCode: "201",
      responseMessage: "Workspace created successfully!!",
      data: populatedWorkspace,
    });
  } catch (err) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await WorkspaceModel.find({})
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar");

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Workspaces fetched successfully!!",
      data: workspaces,
    });
  } catch (err) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

const getWorkspaceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Invalid workspace ID!!",
      });
    }

    const workspace = await WorkspaceModel.findById(id)
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar");

    if (!workspace) {
      return res.status(404).json({
        responseCode: "404",
        responseMessage: "Workspace not found!!",
      });
    }

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Workspace fetched successfully!!",
      data: workspace,
    });
  } catch (err) {
    console.error("Get workspace by ID error");

    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

const updateWorkspace = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Invalid workspace ID!!",
      });
    }

    if (name === undefined || name === null) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Workspace name is required!!",
      });
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Workspace name cannot be empty!!",
      });
    }

    const workspace = await WorkspaceModel.findById(id);

    if (!workspace) {
      return res.status(404).json({
        responseCode: "404",
        responseMessage: "Workspace not found!!",
      });
    }

    workspace.name = trimmedName;

    await workspace.save();

    const updatedWorkspace = await WorkspaceModel.findById(id)
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar");

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Workspace updated successfully!!",
      data: updatedWorkspace,
    });
  } catch (err) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

const addMember = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Invalid workspace ID!!",
      });
    }

    if (!userId) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "User ID is required!!",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage:
          "Invalid user ID. Workspace members must use MongoDB User IDs!!",
      });
    }

    const updatedWorkspace = await WorkspaceModel.findByIdAndUpdate(
      workspaceId,
      {
        $addToSet: {
          members: userId,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar");

    if (!updatedWorkspace) {
      return res.status(404).json({
        responseCode: "404",
        responseMessage: "Workspace not found!!",
      });
    }

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Member added successfully!!",
      data: updatedWorkspace,
    });
  } catch (err) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

const leaveWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Invalid workspace ID!!",
      });
    }

    if (!userId) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "User ID is required!!",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Invalid user ID. Please use the MongoDB User ID!!",
      });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        responseCode: "404",
        responseMessage: "User not found!!",
      });
    }

    const workspace = await WorkspaceModel.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        responseCode: "404",
        responseMessage: "Workspace not found!!",
      });
    }

    const isOwner = String(workspace.owner) === String(userId);

    console.log("Is Owner:", isOwner);

    if (isOwner && user.authProvider === "guest") {
      console.log("Guest owner is leaving workspace");

      const remainingMembers = workspace.members.filter(
        (memberId) => String(memberId) !== String(userId),
      );

      if (remainingMembers.length > 0) {
        workspace.owner = remainingMembers[0];

        workspace.members = remainingMembers;

        await workspace.save();

        const updatedWorkspace = await WorkspaceModel.findById(workspace._id)
          .populate("owner", "name email avatar")
          .populate("members", "name email avatar");

        return res.status(200).json({
          responseCode: "200",
          responseMessage: "You left the workspace successfully!!",
          data: updatedWorkspace,
        });
      }

      await WorkspaceModel.findByIdAndDelete(workspaceId);

      console.log("Guest was the only member. Workspace deleted.");

      return res.status(200).json({
        responseCode: "200",
        responseMessage: "You left the workspace successfully!!",
        data: null,
      });
    }

    if (isOwner) {
      return res.status(403).json({
        responseCode: "403",
        responseMessage:
          "Workspace owner cannot leave the workspace. Transfer ownership or delete the workspace first.",
      });
    }

    const isMember = workspace.members.some(
      (memberId) => String(memberId) === String(userId),
    );

    if (!isMember) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "You are not a member of this workspace!!",
      });
    }

    const updatedWorkspace = await WorkspaceModel.findByIdAndUpdate(
      workspaceId,
      {
        $pull: {
          members: userId,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar");

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "You left the workspace successfully!!",
      data: updatedWorkspace,
    });
  } catch (err) {
    console.error("Leave workspace error:", err);

    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

const deleteWorkspace = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Invalid workspace ID!!",
      });
    }

    const deletedWorkspace = await WorkspaceModel.findByIdAndDelete(id);

    if (!deletedWorkspace) {
      return res.status(404).json({
        responseCode: "404",
        responseMessage: "Workspace not found!!",
      });
    }

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Workspace deleted successfully!!",
      data: deletedWorkspace,
    });
  } catch (err) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

module.exports = {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  addMember,
  leaveWorkspace,
  deleteWorkspace,
};
