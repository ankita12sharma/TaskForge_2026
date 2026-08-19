const ProjectModel = require("../Models/projectModel");

const createProject = async (req, res) => {
  try {
    const {
      name,
      priority,
      lead,
      members,
      labels,
      reporter,
      dueDate,
      workspace,
    } = req.body;

    if (!name || !workspace) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Project name and workspace are required!!",
      });
    }

    const project = await ProjectModel.findOne({
      name,
      workspace,
    });

    if (project) {
      return res.status(409).json({
        responseCode: "409",
        responseMessage: "Project already exists in this workspace!!",
      });
    }

    const projectModel = new ProjectModel({
      name,
      priority,
      lead,
      members: Array.isArray(members) ? members : [],
      labels: Array.isArray(labels) ? labels : [],
      reporter,
      dueDate,
      workspace,
    });

    await projectModel.save();

    return res.status(201).json({
      responseCode: "201",
      responseMessage: "Project created successfully!!",
      data: projectModel,
    });
  } catch (err) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await ProjectModel.find({})
      .populate("lead", "name email avatar")
      .populate("members", "name email avatar")
      .populate("reporter", "name email avatar")
      .populate("workspace", "name");

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Projects fetched successfully!!",
      data: projects,
    });
  } catch (err) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await ProjectModel.findById(id)
      .populate("lead", "name email avatar")
      .populate("members", "name email avatar")
      .populate("reporter", "name email avatar")
      .populate("workspace", "name");

    if (!project) {
      return res.status(404).json({
        responseCode: "404",
        responseMessage: "Project not found!!",
      });
    }

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Project fetched successfully!!",
      data: project,
    });
  } catch (err) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const {
      name,
      priority,
      lead,
      members,
      labels,
      reporter,
      dueDate,
      workspace,
    } = req.body;

    const { id } = req.params;

    const updateProjectData = {};

    if (name !== undefined) {
      updateProjectData.name = name;
    }

    if (priority !== undefined) {
      updateProjectData.priority = priority;
    }

    if (lead !== undefined) {
      updateProjectData.lead = lead;
    }

    if (members !== undefined) {
      updateProjectData.members = Array.isArray(members) ? members : [];
    }

    if (labels !== undefined) {
      updateProjectData.labels = Array.isArray(labels) ? labels : [];
    }

    if (reporter !== undefined) {
      updateProjectData.reporter = reporter;
    }

    if (dueDate !== undefined) {
      updateProjectData.dueDate = dueDate;
    }

    if (workspace !== undefined) {
      updateProjectData.workspace = workspace;
    }

    const updatedData = await ProjectModel.findByIdAndUpdate(
      id,
      {
        $set: updateProjectData,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    )
      .populate("lead", "name email avatar")
      .populate("members", "name email avatar")
      .populate("reporter", "name email avatar")
      .populate("workspace", "name");

    if (!updatedData) {
      return res.status(404).json({
        responseCode: "404",
        responseMessage: "Project not found!!",
      });
    }

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Project updated successfully!!",
      data: updatedData,
    });
  } catch (err) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProject = await ProjectModel.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({
        responseCode: "404",
        responseMessage: "Project not found!!",
      });
    }

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Project deleted successfully!!",
      data: deletedProject,
    });
  } catch (err) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
