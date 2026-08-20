import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

import {
  RiSearchLine,
  RiFilter3Line,
  RiAddLine,
  RiMoreLine,
  RiCloseLine,
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiCheckLine,
  RiDeleteBinLine,
  RiEditLine,
  RiCalendarLine,
  RiUserLine,
  RiPriceTag3Line,
  RiTeamLine,
  RiUserSearchLine,
  RiCheckboxCircleLine,
  RiLayoutLeftLine,
  RiLoader4Line,
} from "@remixicon/react";

import Sidebar from "../components/layout/Sidebar";

import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "../redux/slices/projectSlice";

import { useGetUsersQuery } from "../redux/slices/userSlice";
import { useGetTasksQuery } from "../redux/slices/taskSlice";
import { useGetWorkspacesQuery } from "../redux/slices/workspaceSlice";

const COLORS = {
  urgent: "#E53935",
  high: "#F26B21",
  medium: "#D69B00",
  low: "#A9B9C8",
};

const PRIORITIES = ["No Priority", "Urgent", "High", "Medium", "Low"];

const getPriorityColor = (priority) => {
  switch (priority) {
    case "Urgent":
      return COLORS.urgent;

    case "High":
      return COLORS.high;

    case "Medium":
      return COLORS.medium;

    case "Low":
      return COLORS.low;

    default:
      return "#B7B7B7";
  }
};

const PriorityIcon = ({ priority }) => {
  if (priority === "No Priority") {
    return (
      <span className="mr-1 inline-flex h-[11px] w-[12px] items-center justify-center">
        <span className="h-[1px] w-[9px] bg-[#B7B7B7]" />
      </span>
    );
  }

  const color = getPriorityColor(priority);

  const count =
    priority === "Urgent"
      ? 4
      : priority === "High"
        ? 3
        : priority === "Medium"
          ? 2
          : 1;

  return (
    <span className="mr-1 inline-flex h-[12px] w-[12px] items-end gap-[1px]">
      {[1, 2, 3, 4].map((bar) => (
        <span
          key={bar}
          className="w-[2px] rounded-[1px]"
          style={{
            height: `${bar * 2 + 2}px`,
            backgroundColor: bar <= count ? color : `${color}30`,
          }}
        />
      ))}
    </span>
  );
};

const PriorityDisplay = ({ priority }) => {
  return (
    <div
      className="inline-flex items-center text-[12px] font-normal"
      style={{
        color: getPriorityColor(priority),
      }}
    >
      <PriorityIcon priority={priority} />
      {priority}
    </div>
  );
};

const getId = (value) => {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "object") {
    return (
      value._id?.toString?.() ||
      value.id?.toString?.() ||
      value.userId?.toString?.() ||
      value.user_id?.toString?.() ||
      ""
    );
  }

  return "";
};

const getUserName = (user) => {
  if (!user) return "";

  if (typeof user === "string") {
    return user;
  }

  return (
    user.name ||
    user.username ||
    user.fullName ||
    user.full_name ||
    user.displayName ||
    user.email ||
    ""
  );
};

const getUserAvatar = (user) => {
  if (!user || typeof user !== "object") {
    return "";
  }

  let avatar =
    user.avatar ||
    user.profile?.avatar ||
    user.profile?.profilePic ||
    user.profile?.profileImage ||
    user.profile?.image ||
    user.profile?.photo ||
    user.profilePic ||
    user.profileImage ||
    user.picture ||
    user.photo ||
    user.image ||
    user.profile_picture ||
    user.profile_picture_url ||
    user.profileImageUrl ||
    "";

  if (
    !avatar ||
    avatar === "null" ||
    avatar === "undefined" ||
    typeof avatar !== "string"
  ) {
    return "";
  }

  avatar = avatar.trim();

  if (!avatar) {
    return "";
  }

  if (
    avatar.startsWith("http://") ||
    avatar.startsWith("https://") ||
    avatar.startsWith("data:")
  ) {
    return avatar;
  }

  if (avatar.startsWith("/")) {
    return `https://taskforge-2026.onrender.com/${avatar}`;
  }

  return `https://taskforge-2026.onrender.com/${avatar}`;
};

const normalizeText = (value) => {
  if (value === undefined || value === null) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim().toLowerCase();
  }

  if (typeof value === "object") {
    return (
      value.name ||
      value.username ||
      value.fullName ||
      value.full_name ||
      value.email ||
      value.label ||
      value.title ||
      getId(value) ||
      ""
    )
      .toString()
      .trim()
      .toLowerCase();
  }

  return String(value).trim().toLowerCase();
};

const formatDate = (date) => {
  if (!date) return "—";

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) {
    return "—";
  }

  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInputDate = (date) => {
  if (!date) return "";

  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const resolveUserValue = (value, users = []) => {
  if (!value) {
    return null;
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    const valueId = normalizeText(getId(value));

    if (valueId) {
      const byId = users.find((user) => normalizeText(getId(user)) === valueId);

      if (byId) {
        return byId;
      }
    }

    const valueName = normalizeText(getUserName(value));

    if (valueName) {
      const byName = users.find(
        (user) => normalizeText(getUserName(user)) === valueName,
      );

      if (byName) {
        return byName;
      }
    }

    return value;
  }

  const normalizedValue = normalizeText(value);

  if (!normalizedValue) {
    return null;
  }

  return (
    users.find((user) => {
      const userId = normalizeText(getId(user));
      const userName = normalizeText(getUserName(user));
      const email = normalizeText(user?.email);

      return (
        userId === normalizedValue ||
        userName === normalizedValue ||
        email === normalizedValue
      );
    }) || null
  );
};

const LeadCell = ({ user }) => {
  if (!user) {
    return (
      <div className="flex h-[28px] w-full items-center" title="No lead">
        <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full bg-[#F0F0F0] text-[#999]">
          <RiUserLine size={13} />
        </div>
      </div>
    );
  }

  const leadName = getUserName(user);
  const avatar = getUserAvatar(user);

  const initial = leadName ? leadName.trim().charAt(0).toUpperCase() : "?";

  return (
    <div
      className="flex h-[28px] w-full items-center"
      title={leadName || "Lead"}
    >
      <div className="flex h-[16px] w-[16px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E7E7E7]">
        {avatar ? (
          <img
            src={avatar}
            alt=""
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";

              const parent = event.currentTarget.parentElement;

              if (parent) {
                parent.innerHTML = `
                  <span style="
                    font-size:10px;
                    color:#555;
                    font-weight:500;
                    line-height:1;
                  ">
                    ${initial}
                  </span>
                `;
              }
            }}
          />
        ) : (
          <span className="text-[10px] font-medium text-[#555]">{initial}</span>
        )}
      </div>
    </div>
  );
};

const Projects = () => {
  const {
    data: projectData,
    isLoading: projectsLoading,
    isFetching: projectsFetching,
  } = useGetProjectsQuery();

  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery();

  const { data: taskData, isLoading: tasksLoading } = useGetTasksQuery();

  const { data: workspaceData, isLoading: workspacesLoading } =
    useGetWorkspacesQuery();

  const [createProject, { isLoading: creating }] = useCreateProjectMutation();

  const [updateProject, { isLoading: updating }] = useUpdateProjectMutation();

  const [deleteProject, { isLoading: deleting }] = useDeleteProjectMutation();

  const projects = useMemo(() => {
    if (Array.isArray(projectData?.data)) {
      return projectData.data;
    }

    if (Array.isArray(projectData?.projects)) {
      return projectData.projects;
    }

    if (Array.isArray(projectData?.results)) {
      return projectData.results;
    }

    if (Array.isArray(projectData)) {
      return projectData;
    }

    return [];
  }, [projectData]);

  const users = useMemo(() => {
    if (Array.isArray(usersData?.data)) {
      return usersData.data;
    }

    if (Array.isArray(usersData?.users)) {
      return usersData.users;
    }

    if (Array.isArray(usersData?.results)) {
      return usersData.results;
    }

    if (Array.isArray(usersData)) {
      return usersData;
    }

    return [];
  }, [usersData]);

  const workspaces = useMemo(() => {
    if (Array.isArray(workspaceData?.data)) {
      return workspaceData.data;
    }

    if (Array.isArray(workspaceData?.workspaces)) {
      return workspaceData.workspaces;
    }

    if (Array.isArray(workspaceData?.results)) {
      return workspaceData.results;
    }

    if (Array.isArray(workspaceData)) {
      return workspaceData;
    }

    return [];
  }, [workspaceData]);

  const tasks = useMemo(() => {
    if (Array.isArray(taskData?.data)) {
      return taskData.data;
    }

    if (Array.isArray(taskData?.tasks)) {
      return taskData.tasks;
    }

    if (Array.isArray(taskData)) {
      return taskData;
    }

    return [];
  }, [taskData]);

  const resolveLead = (project) => {
    return resolveUserValue(project?.lead, users);
  };

  const resolveWorkspace = (project) => {
    if (!project?.workspace) {
      return null;
    }

    if (
      typeof project.workspace === "object" &&
      !Array.isArray(project.workspace)
    ) {
      return project.workspace;
    }

    const workspaceId = getId(project.workspace);

    return (
      workspaces.find((workspace) => getId(workspace) === workspaceId) || null
    );
  };

  const taskMembers = useMemo(() => {
    const map = {};

    tasks.forEach((task) => {
      const members = Array.isArray(task?.members)
        ? task.members
        : task?.members
          ? [task.members]
          : [];

      members.forEach((member) => {
        const user = resolveUserValue(member, users);

        if (user) {
          const id = getId(user);

          if (id) {
            map[id] = user;
          }
        }
      });
    });

    return Object.values(map);
  }, [tasks, users]);

  const taskReporters = useMemo(() => {
    const map = {};

    tasks.forEach((task) => {
      const reporter = resolveUserValue(task?.reporter, users);

      if (reporter) {
        const id = getId(reporter);

        if (id) {
          map[id] = reporter;
        }
      }
    });

    return Object.values(map);
  }, [tasks, users]);

  const taskLabels = useMemo(() => {
    const map = {};

    tasks.forEach((task) => {
      const labels = Array.isArray(task?.labels)
        ? task.labels
        : task?.labels
          ? [task.labels]
          : [];

      labels.forEach((label) => {
        if (!label) return;

        const value =
          typeof label === "object"
            ? label.name || label.label || label.title || ""
            : String(label);

        if (value) {
          map[value.toLowerCase()] = value;
        }
      });
    });

    return Object.values(map);
  }, [tasks]);

  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [fieldsOpen, setFieldsOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);

  const [selectedPriority, setSelectedPriority] = useState("All");
  const [selectedMember, setSelectedMember] = useState("All");
  const [selectedLabel, setSelectedLabel] = useState("All");
  const [selectedReporter, setSelectedReporter] = useState("All");
  const [selectedDueDate, setSelectedDueDate] = useState("All");

  const [visibleFields, setVisibleFields] = useState({
    project: true,
    priority: true,
    lead: true,
    dueDate: true,
    actions: true,
  });

  const [menuProject, setMenuProject] = useState(null);

  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [form, setForm] = useState({
    name: "",
    priority: "",
    lead: "",
    dueDate: "",
    workspace: "",
  });

  const [deleteTarget, setDeleteTarget] = useState(null);

  const searchRef = useRef(null);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        searchRef.current?.focus();
      }, 50);
    }
  }, [searchOpen]);

  const getProjectTasks = (project) => {
    const projectId = normalizeText(project?._id || project?.id);
    const projectName = normalizeText(project?.name);

    return tasks.filter((task) => {
      const taskProject = task?.projectId || task?.project || task?.project_id;

      if (!taskProject) {
        return false;
      }

      if (typeof taskProject === "object" && !Array.isArray(taskProject)) {
        const taskProjectId = normalizeText(getId(taskProject));
        const taskProjectName = normalizeText(taskProject?.name);

        return taskProjectId === projectId || taskProjectName === projectName;
      }

      return (
        normalizeText(taskProject) === projectId ||
        normalizeText(taskProject) === projectName
      );
    });
  };

  const projectHasMember = (project, selectedId) => {
    if (selectedId === "All") {
      return true;
    }

    return getProjectTasks(project).some((task) => {
      const members = Array.isArray(task?.members)
        ? task.members
        : task?.members
          ? [task.members]
          : [];

      return members.some((member) => {
        const user = resolveUserValue(member, users);

        return user && getId(user) === selectedId;
      });
    });
  };

  const projectHasLabel = (project, selectedLabelValue) => {
    if (selectedLabelValue === "All") {
      return true;
    }

    return getProjectTasks(project).some((task) => {
      const labels = Array.isArray(task?.labels)
        ? task.labels
        : task?.labels
          ? [task.labels]
          : [];

      return labels.some((label) => {
        const labelValue =
          typeof label === "object"
            ? label.name || label.label || label.title || ""
            : String(label);

        return normalizeText(labelValue) === normalizeText(selectedLabelValue);
      });
    });
  };

  const projectHasReporter = (project, selectedReporterId) => {
    if (selectedReporterId === "All") {
      return true;
    }

    return getProjectTasks(project).some((task) => {
      const reporter = resolveUserValue(task?.reporter, users);

      return reporter && getId(reporter) === selectedReporterId;
    });
  };

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects.filter((project) => {
      const lead = resolveLead(project);

      const projectName = project?.name?.toString().toLowerCase() || "";

      const leadName = getUserName(lead)?.toString().toLowerCase() || "";

      const priority = project?.priority?.toString().toLowerCase() || "";

      const matchesSearch =
        !query ||
        projectName.includes(query) ||
        leadName.includes(query) ||
        priority.includes(query);

      const matchesPriority =
        selectedPriority === "All" || project?.priority === selectedPriority;

      const matchesMember = projectHasMember(project, selectedMember);

      const matchesLabel = projectHasLabel(project, selectedLabel);

      const matchesReporter = projectHasReporter(project, selectedReporter);

      let matchesDueDate = true;

      if (selectedDueDate !== "All") {
        const date = project?.dueDate ? new Date(project.dueDate) : null;

        if (!date || Number.isNaN(date.getTime())) {
          matchesDueDate = false;
        } else {
          const today = new Date();

          today.setHours(0, 0, 0, 0);

          if (selectedDueDate === "Today") {
            matchesDueDate = date.toDateString() === today.toDateString();
          }

          if (selectedDueDate === "Tomorrow") {
            const target = new Date(today);

            target.setDate(target.getDate() + 1);

            matchesDueDate = date.toDateString() === target.toDateString();
          }

          if (selectedDueDate === "This Week") {
            const start = new Date(today);

            const day = start.getDay();

            const diff = day === 0 ? -6 : 1 - day;

            start.setDate(start.getDate() + diff);

            const end = new Date(start);

            end.setDate(end.getDate() + 6);

            end.setHours(23, 59, 59, 999);

            matchesDueDate = date >= start && date <= end;
          }

          if (selectedDueDate === "Overdue") {
            matchesDueDate = date < today;
          }
        }
      }

      return (
        matchesSearch &&
        matchesPriority &&
        matchesMember &&
        matchesLabel &&
        matchesReporter &&
        matchesDueDate
      );
    });
  }, [
    projects,
    search,
    selectedPriority,
    selectedMember,
    selectedLabel,
    selectedReporter,
    selectedDueDate,
    users,
    tasks,
  ]);

  const openCreateModal = () => {
    setEditingProject(null);

    setForm({
      name: "",
      priority: "",
      lead: "",
      dueDate: "",
      workspace: workspaces.length === 1 ? getId(workspaces[0]) : "",
    });

    setMenuProject(null);
    setFieldsOpen(false);
    setFilterOpen(false);
    setActiveFilter(null);

    setModalOpen(true);
  };

  const openEditModal = (project) => {
    if (!project) {
      return;
    }

    const projectId = getId(project);

    if (!projectId) {
      toast.error("Project ID is missing!!");
      return;
    }

    const resolvedLead = resolveUserValue(project?.lead, users);

    setEditingProject({
      ...project,
      _id: projectId,
    });

    setForm({
      name: project?.name || "",
      priority: project?.priority || "",
      lead: getId(resolvedLead) || getId(project?.lead),
      dueDate: getInputDate(project?.dueDate),
      workspace: "",
    });

    setMenuProject(null);
    setFieldsOpen(false);
    setFilterOpen(false);
    setActiveFilter(null);

    setModalOpen(true);
  };

  const closeModal = () => {
    if (creating || updating) {
      return;
    }

    setModalOpen(false);
    setEditingProject(null);

    setForm({
      name: "",
      priority: "",
      lead: "",
      dueDate: "",
      workspace: "",
    });
  };

  const getCreatePayload = () => {
    return {
      name: form.name.trim(),
      priority: form.priority,
      lead: form.lead,
      dueDate: form.dueDate,
      workspace: form.workspace,
    };
  };

  const getEditPayload = () => {
    return {
      name: form.name.trim(),
      priority: form.priority,
      lead: form.lead,
      dueDate: form.dueDate,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!editingProject) {
      if (!form.name.trim()) {
        toast.error("Project name is required!!");
        return;
      }

      if (!form.priority) {
        toast.error("Please select priority.");
        return;
      }

      if (!form.workspace) {
        toast.error("Please select workspace.");
        return;
      }

      if (!form.lead) {
        toast.error("Please select lead.");
        return;
      }

      if (!form.dueDate) {
        toast.error("Please select due date.");
        return;
      }
    }

    if (editingProject) {
      if (!form.name.trim()) {
        toast.error("Project name is required!!");
        return;
      }

      if (!form.priority) {
        toast.error("Please select priority.");
        return;
      }

      if (!form.lead) {
        toast.error("Please select lead.");
        return;
      }

      if (!form.dueDate) {
        toast.error("Please select due date.");
        return;
      }
    }

    try {
      if (editingProject) {
        const id = getId(editingProject);

        if (!id) {
          toast.error("Project ID is missing!!");
          return;
        }

        const payload = getEditPayload();

        console.log("UPDATE PROJECT:", {
          id,
          ...payload,
        });

        await updateProject({
          id,
          ...payload,
        }).unwrap();

        toast.success("Project updated successfully!!");
      } else {
        const payload = getCreatePayload();

        await createProject(payload).unwrap();

        toast.success("Project added successfully!!");
      }

      closeModal();
    } catch (error) {
      const message =
        error?.data?.responseMessage ||
        error?.data?.message ||
        error?.data?.error ||
        error?.error ||
        "";

      toast.error(
        message ||
          (editingProject
            ? "Failed to update project"
            : "Failed to add project"),
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    const id = getId(deleteTarget);

    if (!id) {
      toast.error("Project ID is missing!!");
      return;
    }

    try {
      await deleteProject(id).unwrap();

      toast.success("Project deleted successfully!!");

      setDeleteTarget(null);
      setMenuProject(null);
    } catch (error) {
      toast.error("Failed to delete project!!");
    }
  };

  const toggleField = (field) => {
    setVisibleFields((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const filterActive =
    selectedPriority !== "All" ||
    selectedMember !== "All" ||
    selectedLabel !== "All" ||
    selectedReporter !== "All" ||
    selectedDueDate !== "All";

  const clearFilters = () => {
    setSelectedPriority("All");
    setSelectedMember("All");
    setSelectedLabel("All");
    setSelectedReporter("All");
    setSelectedDueDate("All");
    setActiveFilter(null);
  };

  useEffect(() => {
    const closeMenus = (event) => {
      if (!event.target.closest("[data-project-menu]")) {
        setMenuProject(null);
      }

      if (!event.target.closest("[data-filter-menu]")) {
        setActiveFilter(null);
      }

      if (!event.target.closest("[data-fields-menu]")) {
        setFieldsOpen(false);
      }
    };

    document.addEventListener("mousedown", closeMenus);

    return () => {
      document.removeEventListener("mousedown", closeMenus);
    };
  }, []);

  const visibleColumnCount =
    Object.values(visibleFields).filter(Boolean).length;

  const openProjectMenu = (event, projectId) => {
    event.stopPropagation();

    const buttonRect = event.currentTarget.getBoundingClientRect();

    const menuWidth = 145;
    const menuHeight = 90;
    const gap = 6;

    let left = buttonRect.right - menuWidth;

    let top = buttonRect.bottom + gap;

    if (left < 8) {
      left = 8;
    }

    if (left + menuWidth > window.innerWidth - 8) {
      left = window.innerWidth - menuWidth - 8;
    }

    if (top + menuHeight > window.innerHeight - 8) {
      top = buttonRect.top - menuHeight - gap;
    }

    if (top < 8) {
      top = 8;
    }

    setMenuPosition({
      top,
      left,
    });

    setMenuProject((previous) => (previous === projectId ? null : projectId));
  };

  return (
    <div className="min-h-screen bg-white text-[#222]">
      <Sidebar />

      <main className="min-h-screen md:ml-[256px]">
        <header className="flex h-[64px] w-full items-center border-b border-[#E5E5E5] bg-white px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px]  bg-white text-[#222] hover:bg-[#F5F5F5]"
          >
            <RiLayoutLeftLine size={17} />
          </button>
        </header>

        <section className="px-4 pb-8 pt-6 sm:px-6 md:px-8 lg:px-10">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-[15px] font-semibold text-[#222]">Projects</h1>

            <div className="flex items-center justify-end gap-2">
              {searchOpen ? (
                <div className="relative">
                  <input
                    ref={searchRef}
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search projects..."
                    className="h-[36px] w-[180px] rounded-[6px] border border-[#E5E5E5] bg-white px-3 pr-8 text-[12px] outline-none placeholder:text-[#999] focus:border-[#CFCFCF] sm:w-[220px]"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setSearchOpen(false);
                    }}
                    className="absolute right-1 top-1 flex h-[28px] w-[28px] items-center justify-center rounded-[5px] text-[#777] hover:bg-[#F3F3F3]"
                  >
                    <RiCloseLine size={15} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="flex h-[36px] w-[36px] items-center justify-center rounded-[6px] border border-[#E5E5E5] bg-white text-[#222] hover:bg-[#F5F5F5]"
                >
                  <RiSearchLine size={17} />
                </button>
              )}

              <div className="relative" data-fields-menu>
                <button
                  type="button"
                  onClick={() => {
                    setFieldsOpen((previous) => !previous);
                    setFilterOpen(false);
                  }}
                  className="flex h-[36px] items-center gap-2 rounded-[6px] border border-[#E5E5E5] bg-white px-3 text-[12px] text-[#333] hover:bg-[#F5F5F5]"
                >
                  <span className="text-[13px]">▦</span>

                  <span className="hidden sm:inline">Fields</span>
                </button>

                {fieldsOpen && (
                  <div className="absolute right-0 top-[42px] z-[100] w-[190px] rounded-[7px] border border-[#E5E5E5] bg-white p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
                    <p className="px-2 py-1.5 text-[9px] font-medium text-[#999]">
                      Fields
                    </p>

                    {[
                      ["project", "Projects"],
                      ["priority", "Priority"],
                      ["lead", "Lead"],
                      ["dueDate", "Due Date"],
                      ["actions", "Actions"],
                    ].map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleField(key)}
                        className="flex w-full items-center justify-between rounded-[5px] px-2 py-2 text-left text-[12px] text-[#333] hover:bg-[#F5F5F5]"
                      >
                        <span>{label}</span>

                        {visibleFields[key] && <RiCheckLine size={15} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative" data-filter-menu>
                <button
                  type="button"
                  onClick={() => {
                    setFilterOpen((previous) => !previous);
                    setFieldsOpen(false);
                    setActiveFilter(null);
                  }}
                  className={`relative flex h-[36px] w-[36px] items-center justify-center rounded-[6px] border bg-white hover:bg-[#F5F5F5] ${
                    filterActive ? "border-[#222]" : "border-[#E5E5E5]"
                  }`}
                >
                  <RiFilter3Line size={17} />

                  {filterActive && (
                    <span className="absolute -right-[2px] -top-[2px] h-[6px] w-[6px] rounded-full bg-[#222]" />
                  )}
                </button>

                {filterOpen && (
                  <div className="absolute right-0 top-[42px] z-[100] flex max-w-[calc(100vw-32px)]">
                    <div className="w-[165px] shrink-0 rounded-[7px] border border-[#E5E5E5] bg-white p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
                      <p className="px-2 py-1.5 text-[11px] font-medium text-[#999]">
                        Filter
                      </p>

                      {[
                        {
                          key: "status",
                          icon: <RiCheckboxCircleLine size={15} />,
                          label: "Status",
                        },
                        {
                          key: "priority",
                          icon: <PriorityIcon priority="High" />,
                          label: "Priority",
                        },
                        {
                          key: "members",
                          icon: <RiUserLine size={15} />,
                          label: "Members",
                        },
                        {
                          key: "dueDate",
                          icon: <RiCalendarLine size={15} />,
                          label: "Due Date",
                        },
                        {
                          key: "teams",
                          icon: <RiTeamLine size={15} />,
                          label: "Teams",
                        },
                        {
                          key: "labels",
                          icon: <RiPriceTag3Line size={15} />,
                          label: "Labels",
                        },
                        {
                          key: "reporter",
                          icon: <RiUserSearchLine size={15} />,
                          label: "Reporter",
                        },
                      ].map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() =>
                            setActiveFilter(
                              activeFilter === item.key ? null : item.key,
                            )
                          }
                          className={`flex w-full items-center justify-between rounded-[5px] px-2 py-2 text-[12px] text-[#333] ${
                            activeFilter === item.key
                              ? "bg-[#F1F1F1]"
                              : "hover:bg-[#F5F5F5]"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {item.icon}
                            {item.label}
                          </span>

                          <RiArrowRightSLine
                            size={14}
                            className="text-[#888]"
                          />
                        </button>
                      ))}

                      {filterActive && (
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="mt-1 w-full border-t border-[#EEEEEE] px-2 pt-2 text-left text-[11px] text-[#777] hover:text-[#222]"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>

                    {activeFilter === "priority" && (
                      <div className="ml-1 w-[160px] shrink-0 rounded-[7px] border border-[#E5E5E5] bg-white p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
                        <p className="px-2 py-1.5 text-[11px] text-[#999]">
                          Priority
                        </p>

                        <button
                          type="button"
                          onClick={() => setSelectedPriority("All")}
                          className="flex w-full items-center justify-between rounded-[5px] px-2 py-2 text-[12px] hover:bg-[#F5F5F5]"
                        >
                          No Priority
                          {selectedPriority === "All" && (
                            <RiCheckLine size={14} />
                          )}
                        </button>

                        {PRIORITIES.slice(1).map((priority) => (
                          <button
                            key={priority}
                            type="button"
                            onClick={() => setSelectedPriority(priority)}
                            className="flex w-full items-center justify-between rounded-[5px] px-2 py-2 text-[12px] hover:bg-[#F5F5F5]"
                          >
                            <PriorityDisplay priority={priority} />

                            {selectedPriority === priority && (
                              <RiCheckLine size={14} />
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {activeFilter === "members" && (
                      <div className="ml-1 max-h-[300px] w-[190px] shrink-0 overflow-y-auto rounded-[7px] border border-[#E5E5E5] bg-white p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
                        <p className="px-2 py-1.5 text-[11px] text-[#999]">
                          Members
                        </p>

                        <button
                          type="button"
                          onClick={() => setSelectedMember("All")}
                          className="flex w-full items-center justify-between rounded-[5px] px-2 py-2 text-[12px] hover:bg-[#F5F5F5]"
                        >
                          All Members
                          {selectedMember === "All" && (
                            <RiCheckLine size={14} />
                          )}
                        </button>

                        {taskMembers.map((user) => {
                          const id = getId(user);

                          return (
                            <button
                              key={id}
                              type="button"
                              onClick={() => setSelectedMember(id)}
                              className="flex w-full items-center justify-between rounded-[5px] px-2 py-2 text-[12px] hover:bg-[#F5F5F5]"
                            >
                              <span className="flex min-w-0 items-center gap-2">
                                <span className="flex h-[20px] w-[20px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E7E7E7]">
                                  {getUserAvatar(user) ? (
                                    <img
                                      src={getUserAvatar(user)}
                                      alt=""
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-[8px]">
                                      {getUserName(user)
                                        .charAt(0)
                                        .toUpperCase()}
                                    </span>
                                  )}
                                </span>

                                <span className="truncate">
                                  {getUserName(user)}
                                </span>
                              </span>

                              {selectedMember === id && (
                                <RiCheckLine size={14} />
                              )}
                            </button>
                          );
                        })}

                        {!taskMembers.length && (
                          <p className="px-2 py-2 text-[11px] text-[#999]">
                            No task members found
                          </p>
                        )}
                      </div>
                    )}

                    {activeFilter === "labels" && (
                      <div className="ml-1 max-h-[300px] w-[180px] shrink-0 overflow-y-auto rounded-[7px] border border-[#E5E5E5] bg-white p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
                        <p className="px-2 py-1.5 text-[11px] text-[#999]">
                          Labels
                        </p>

                        <button
                          type="button"
                          onClick={() => setSelectedLabel("All")}
                          className="flex w-full items-center justify-between rounded-[5px] px-2 py-2 text-[12px] hover:bg-[#F5F5F5]"
                        >
                          All Labels
                          {selectedLabel === "All" && <RiCheckLine size={14} />}
                        </button>

                        {taskLabels.map((label) => (
                          <button
                            key={label}
                            type="button"
                            onClick={() => setSelectedLabel(label)}
                            className="flex w-full items-center justify-between rounded-[5px] px-2 py-2 text-[12px] hover:bg-[#F5F5F5]"
                          >
                            <span className="truncate">{label}</span>

                            {selectedLabel === label && (
                              <RiCheckLine size={14} />
                            )}
                          </button>
                        ))}

                        {!taskLabels.length && (
                          <p className="px-2 py-2 text-[11px] text-[#999]">
                            No labels found
                          </p>
                        )}
                      </div>
                    )}

                    {activeFilter === "reporter" && (
                      <div className="ml-1 max-h-[300px] w-[190px] shrink-0 overflow-y-auto rounded-[7px] border border-[#E5E5E5] bg-white p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
                        <p className="px-2 py-1.5 text-[11px] text-[#999]">
                          Reporter
                        </p>

                        <button
                          type="button"
                          onClick={() => setSelectedReporter("All")}
                          className="flex w-full items-center justify-between rounded-[5px] px-2 py-2 text-[12px] hover:bg-[#F5F5F5]"
                        >
                          All Reporters
                          {selectedReporter === "All" && (
                            <RiCheckLine size={14} />
                          )}
                        </button>

                        {taskReporters.map((user) => {
                          const id = getId(user);

                          return (
                            <button
                              key={id}
                              type="button"
                              onClick={() => setSelectedReporter(id)}
                              className="flex w-full items-center justify-between rounded-[5px] px-2 py-2 text-[12px] hover:bg-[#F5F5F5]"
                            >
                              <span className="truncate">
                                {getUserName(user)}
                              </span>

                              {selectedReporter === id && (
                                <RiCheckLine size={14} />
                              )}
                            </button>
                          );
                        })}

                        {!taskReporters.length && (
                          <p className="px-2 py-2 text-[11px] text-[#999]">
                            No reporters found
                          </p>
                        )}
                      </div>
                    )}

                    {activeFilter === "dueDate" && (
                      <div className="ml-1 w-[150px] shrink-0 rounded-[7px] border border-[#E5E5E5] bg-white p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
                        <p className="px-2 py-1.5 text-[11px] text-[#999]">
                          Due Date
                        </p>

                        {[
                          "All",
                          "Today",
                          "Tomorrow",
                          "This Week",
                          "Overdue",
                        ].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setSelectedDueDate(option)}
                            className="flex w-full items-center justify-between rounded-[5px] px-2 py-2 text-[12px] hover:bg-[#F5F5F5]"
                          >
                            {option === "All" ? "No Filter" : option}

                            {selectedDueDate === option && (
                              <RiCheckLine size={14} />
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {["status", "teams"].includes(activeFilter) && (
                      <div className="ml-1 w-[160px] shrink-0 rounded-[7px] border border-[#E5E5E5] bg-white p-3 shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
                        <p className="text-[11px] text-[#999]">
                          {activeFilter === "status" ? "Status" : "Teams"}
                        </p>

                        <p className="mt-2 text-[11px] text-[#999]">
                          No filter options available
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={openCreateModal}
                className="flex h-[36px] items-center gap-1.5 rounded-[6px] bg-[#222] px-3 text-[12px] font-medium text-white hover:bg-[#111]"
              >
                <RiAddLine size={17} />

                <span className="hidden sm:inline">Add Project</span>
              </button>
            </div>
          </div>

          <div className="relative w-full overflow-x-auto rounded-[7px] border border-[#E5E5E5]">
            <table className="w-full min-w-[720px] table-fixed border-collapse">
              <thead>
                <tr className="h-[38px] bg-[#F7F7F7]">
                  {visibleFields.project && (
                    <th className="w-[38%] border-b border-[#E5E5E5] px-3 text-left text-[10px] font-semibold text-[#333]">
                      Projects
                    </th>
                  )}

                  {visibleFields.priority && (
                    <th className="w-[18%] border-b border-[#E5E5E5] px-3 text-left text-[10px] font-semibold text-[#333]">
                      Priority
                    </th>
                  )}

                  {visibleFields.lead && (
                    <th className="w-[16%] border-b border-[#E5E5E5] px-3 text-left text-[10px] font-semibold text-[#333]">
                      Lead
                    </th>
                  )}

                  {visibleFields.dueDate && (
                    <th className="w-[18%] border-b border-[#E5E5E5] px-3 text-left text-[10px] font-semibold text-[#333]">
                      Due Date
                    </th>
                  )}

                  {visibleFields.actions && (
                    <th className="w-[10%] border-b border-[#E5E5E5] px-3 text-right text-[10px] font-semibold text-[#333]">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {projectsLoading ||
                usersLoading ||
                tasksLoading ||
                workspacesLoading ? (
                  <tr>
                    <td
                      colSpan={visibleColumnCount}
                      className="h-[70px] text-center text-[10px] text-[#999]"
                    >
                      Loading projects...
                    </td>
                  </tr>
                ) : filteredProjects.length === 0 ? (
                  <tr>
                    <td
                      colSpan={visibleColumnCount}
                      className="h-[70px] text-center text-[10px] text-[#999]"
                    >
                      No projects found
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => {
                    const projectId = getId(project);

                    const lead = resolveLead(project);

                    return (
                      <tr
                        key={projectId}
                        className="h-[36px] border-b border-[#EEEEEE] last:border-b-0 hover:bg-[#FAFAFA]"
                      >
                        {visibleFields.project && (
                          <td className="px-3 py-[4px] text-[10px] text-[#222]">
                            <button
                              type="button"
                              onClick={() => openEditModal(project)}
                              className="max-w-full truncate text-left hover:underline"
                            >
                              {project.name}
                            </button>
                          </td>
                        )}

                        {visibleFields.priority && (
                          <td className="px-3 py-[4px]">
                            <PriorityDisplay
                              priority={project.priority || "No Priority"}
                            />
                          </td>
                        )}

                        {visibleFields.lead && (
                          <td className="px-3 py-[4px]">
                            <LeadCell user={lead} />
                          </td>
                        )}

                        {visibleFields.dueDate && (
                          <td className="px-3 py-[4px] text-[12px] text-[#222]">
                            <div className="flex items-center gap-2">
                              {formatDate(project.dueDate)}
                            </div>
                          </td>
                        )}

                        {visibleFields.actions && (
                          <td className="overflow-visible px-3 py-[4px] text-right">
                            <button
                              type="button"
                              data-project-menu
                              onClick={(event) =>
                                openProjectMenu(event, projectId)
                              }
                              className="inline-flex h-[28px] w-[28px] items-center justify-center rounded-[5px] text-[#777] hover:bg-[#EDEDED] hover:text-[#222]"
                              title="Project actions"
                            >
                              <RiMoreLine size={17} />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}

                {!projectsLoading &&
                  !usersLoading &&
                  !tasksLoading &&
                  filteredProjects.length > 0 && (
                    <tr className="h-[40px]">
                      <td colSpan={visibleColumnCount} className="px-3">
                        <button
                          type="button"
                          onClick={openCreateModal}
                          className="flex items-center gap-1.5 text-[12px] text-[#333] hover:text-[#000]"
                        >
                          <RiAddLine size={14} />
                          Add Project
                        </button>
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>

          {menuProject && (
            <div
              data-project-menu
              className="fixed z-[300] w-[145px] rounded-[7px] border border-[#E5E5E5] bg-white p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
              style={{
                top: menuPosition.top,
                left: menuPosition.left,
              }}
            >
              {(() => {
                const selectedProject = projects.find(
                  (project) => getId(project) === menuProject,
                );

                if (!selectedProject) {
                  return null;
                }

                return (
                  <>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();

                        openEditModal(selectedProject);
                      }}
                      className="flex w-full items-center gap-2 rounded-[5px] px-2.5 py-2 text-left text-[12px] font-medium text-[#1FA34A] hover:bg-[#F0FFF4]"
                    >
                      <RiEditLine size={15} className="text-[#1FA34A]" />

                      <span className="text-[#1FA34A]">Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();

                        setDeleteTarget(selectedProject);

                        setMenuProject(null);
                      }}
                      className="flex w-full items-center gap-2 rounded-[5px] px-2.5 py-2 text-left text-[12px] font-medium text-[#E53935] hover:bg-[#FFF5F5]"
                    >
                      <RiDeleteBinLine size={15} className="text-[#E53935]" />

                      <span>Delete</span>
                    </button>
                  </>
                );
              })()}
            </div>
          )}

          {projectsFetching && !projectsLoading && (
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#999]">
              <RiLoader4Line size={12} className="animate-spin" />
              Updating...
            </div>
          )}
        </section>
      </main>

      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-[540px] overflow-y-auto rounded-[10px] border border-[#E5E5E5] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.16)]">
            <div className="relative flex h-[52px] items-center justify-center border-b border-[#E5E5E5] px-25">
              <h2 className="text-center text-[16px] font-semibold text-[#222]">
                {editingProject ? "Edit Project" : "Create Project"}
              </h2>

              <button
                type="button"
                onClick={closeModal}
                disabled={creating || updating}
                className="absolute right-5 flex h-7 w-7 items-center justify-center rounded-[5px] text-[#777] hover:bg-[#F3F3F3] disabled:opacity-50"
              >
                <RiCloseLine size={17} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5">
              <div className="mb-4">
                <label className="mb-1.5 block text-[11px] font-medium text-[#333]">
                  Project Name <span className="text-[#E53935]">*</span>
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Enter project name"
                  className="h-[38px] w-full rounded-[6px] border border-[#E5E5E5] px-3 text-[12px] outline-none focus:border-[#BDBDBD]"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-[11px] font-medium text-[#333]">
                  Priority <span className="text-[#E53935]">*</span>
                </label>

                <div className="relative">
                  <select
                    value={form.priority}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        priority: event.target.value,
                      }))
                    }
                    className="h-[38px] w-full appearance-none rounded-[6px] border border-[#E5E5E5] bg-white px-3 text-[12px] outline-none focus:border-[#BDBDBD]"
                    required
                  >
                    <option value="">Select priority</option>

                    {PRIORITIES.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>

                  <RiArrowDownSLine
                    size={15}
                    className="pointer-events-none absolute right-3 top-[11px] text-[#777]"
                  />
                </div>
              </div>

              {!editingProject && (
                <div className="mb-4">
                  <label className="mb-1.5 block text-[11px] font-medium text-[#333]">
                    Workspace <span className="text-[#E53935]">*</span>
                  </label>

                  <div className="relative">
                    <select
                      value={form.workspace}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          workspace: event.target.value,
                        }))
                      }
                      className="h-[38px] w-full appearance-none rounded-[6px] border border-[#E5E5E5] bg-white px-3 text-[12px] outline-none focus:border-[#BDBDBD]"
                      required
                    >
                      <option value="">Select workspace</option>

                      {workspaces.map((workspace) => {
                        const id = getId(workspace);

                        if (!id) {
                          return null;
                        }

                        return (
                          <option key={id} value={id}>
                            {workspace.name || workspace.title || "Workspace"}
                          </option>
                        );
                      })}
                    </select>

                    <RiArrowDownSLine
                      size={15}
                      className="pointer-events-none absolute right-3 top-[11px] text-[#777]"
                    />
                  </div>

                  {!workspacesLoading && !workspaces.length && (
                    <p className="mt-1.5 text-[10px] text-[#E53935]">
                      No workspace available.
                    </p>
                  )}
                </div>
              )}

              <div className="mb-4">
                <label className="mb-1.5 block text-[11px] font-medium text-[#333]">
                  Lead <span className="text-[#E53935]">*</span>
                </label>

                <div className="relative">
                  <select
                    value={form.lead}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        lead: event.target.value,
                      }))
                    }
                    className="h-[38px] w-full appearance-none rounded-[6px] border border-[#E5E5E5] bg-white px-3 text-[12px] outline-none focus:border-[#BDBDBD]"
                    required
                  >
                    <option value="">Select lead</option>

                    {users.map((user) => {
                      const id = getId(user);

                      if (!id) {
                        return null;
                      }

                      return (
                        <option key={id} value={id}>
                          {getUserName(user)}
                        </option>
                      );
                    })}
                  </select>

                  <RiArrowDownSLine
                    size={15}
                    className="pointer-events-none absolute right-3 top-[11px] text-[#777]"
                  />
                </div>

                {!usersLoading && !users.length && (
                  <p className="mt-1.5 text-[10px] text-[#E53935]">
                    No users available.
                  </p>
                )}
              </div>

              <div className="mb-5">
                <label className="mb-1.5 block text-[11px] font-medium text-[#333]">
                  Due Date <span className="text-[#E53935]">*</span>
                </label>

                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      dueDate: event.target.value,
                    }))
                  }
                  className="h-[38px] w-full rounded-[6px] border border-[#E5E5E5] bg-white px-3 text-[12px] outline-none focus:border-[#BDBDBD]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-[#EEEEEE] pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={creating || updating}
                  className="h-[36px] rounded-[6px] border border-[#E5E5E5] px-4 text-[12px] text-[#444] hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    creating ||
                    updating ||
                    (!editingProject && workspacesLoading)
                  }
                  className="flex h-[36px] items-center gap-1.5 rounded-[6px] bg-[#222] px-4 text-[12px] font-medium text-white hover:bg-[#111] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {(creating || updating) && (
                    <RiLoader4Line size={14} className="animate-spin" />
                  )}

                  {editingProject
                    ? updating
                      ? "Saving..."
                      : "Save Changes"
                    : creating
                      ? "Creating..."
                      : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/20 p-4">
          <div className="w-full max-w-[400px] rounded-[10px] border border-[#E5E5E5] bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.16)]">
            <h2 className="text-[14px] font-semibold text-[#222]">
              Delete Project?
            </h2>

            <p className="mt-2 text-[12px] leading-5 text-[#777]">
              Are you sure you want to delete{" "}
              <span className="font-medium text-[#333]">
                {deleteTarget.name}
              </span>
              ?
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="h-[36px] rounded-[6px] border border-[#E5E5E5] px-4 text-[12px] hover:bg-[#F5F5F5]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex h-[36px] items-center gap-1.5 rounded-[6px] bg-[#E53935] px-4 text-[12px] font-medium text-white hover:bg-[#D32F2F]"
              >
                {deleting && (
                  <RiLoader4Line size={14} className="animate-spin" />
                )}

                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
