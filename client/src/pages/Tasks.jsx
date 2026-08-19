import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

import {
  RiAddLine,
  RiSearchLine,
  RiMoreLine,
  RiDeleteBinLine,
  RiPencilLine,
  RiCloseLine,
  RiFilter3Line,
  RiArrowDownSLine,
  RiCheckLine,
  RiListCheck,
  RiLayoutGridLine,
  RiLayoutLeftLine,
  RiCalendarLine,
  RiUserLine,
  RiPriceTag3Line,
  RiFileTextLine,
  RiSendPlaneLine,
  RiAttachment2,
  RiSettings3Line,
  RiLockLine,
  RiShareLine,
  RiEyeLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiTimeLine,
  RiReplyLine,
  RiExternalLinkLine,
} from "@remixicon/react";

import Sidebar from "../components/layout/Sidebar";

import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "../redux/slices/taskSlice";

import { useGetProjectsQuery } from "../redux/slices/projectSlice";
import { useGetUsersQuery } from "../redux/slices/userSlice";
import {
  useGetSubtasksQuery,
  useCreateSubtaskMutation,
  useUpdateSubtaskMutation,
  useDeleteSubtaskMutation,
} from "../redux/slices/subtaskSlice";
import {
  useGetCommentsByTaskQuery,
  useCreateCommentMutation,
  useAddReplyMutation,
  useDeleteCommentMutation,
} from "../redux/slices/commentsSlice";

const Tasks = () => {
  const { data: taskResponse, isLoading, error } = useGetTasksQuery();

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();

  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const { data: projectResponse, isLoading: projectsLoading } =
    useGetProjectsQuery();

  const { data: usersResponse, isLoading: usersLoading } = useGetUsersQuery();

  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const [priorityFilter, setPriorityFilter] = useState("All");
  const [memberFilter, setMemberFilter] = useState("All");

  const [showFilter, setShowFilter] = useState(false);
  const [showFields, setShowFields] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  const [openMenu, setOpenMenu] = useState(null);

  const [viewMode, setViewMode] = useState("list");

  const [labelsInput, setLabelsInput] = useState("");

  const dateInputRef = useRef(null);

  const [selectedTask, setSelectedTask] = useState(null);

  const selectedTaskId = selectedTask
    ? String(selectedTask._id || selectedTask.id || "")
    : "";

  const { data: subtasksResponse, refetch: refetchSubtasks } =
    useGetSubtasksQuery(selectedTaskId, {
      skip: !selectedTaskId,
    });

  const [createSubtask, { isLoading: isCreatingSubtask }] =
    useCreateSubtaskMutation();
  const [updateSubtask, { isLoading: isUpdatingSubtask }] =
    useUpdateSubtaskMutation();
  const [deleteSubtaskApi, { isLoading: isDeletingSubtask }] =
    useDeleteSubtaskMutation();

  const { data: commentsResponse, refetch: refetchComments } =
    useGetCommentsByTaskQuery(selectedTaskId, {
      skip: !selectedTaskId,
    });

  const [createComment, { isLoading: isCreatingComment }] =
    useCreateCommentMutation();
  const [addReplyApi, { isLoading: isAddingReply }] = useAddReplyMutation();
  const [deleteCommentApi, { isLoading: isDeletingComment }] =
    useDeleteCommentMutation();

  useEffect(() => {
    if (!selectedTask) return undefined;

    const html = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY;

    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyPosition = body.style.position;
    const previousBodyTop = body.style.top;
    const previousBodyWidth = body.style.width;
    const previousBodyOverscroll = body.style.overscrollBehavior;

    html.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.position = previousBodyPosition;
      body.style.top = previousBodyTop;
      body.style.width = previousBodyWidth;
      body.style.overscrollBehavior = previousBodyOverscroll;
      window.scrollTo(0, scrollY);
    };
  }, [selectedTask]);

  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [subtaskPriority, setSubtaskPriority] = useState("Low");
  const [subtaskMember, setSubtaskMember] = useState("");
  const [subtaskStartDate, setSubtaskStartDate] = useState("");
  const [subtaskDueDate, setSubtaskDueDate] = useState("");
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  const [subtaskActionMenu, setSubtaskActionMenu] = useState(null);
  const [editingSubtaskId, setEditingSubtaskId] = useState(null);
  const subtaskStartDateRef = useRef(null);
  const subtaskDueDateRef = useRef(null);

  const [commentInput, setCommentInput] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  const [taskUpdates, setTaskUpdates] = useState({});

  const storageHydratedRef = useRef(false);

  useEffect(() => {
    try {
      const savedUpdates = localStorage.getItem("tasks_updates");
      if (savedUpdates) {
        const parsed = JSON.parse(savedUpdates);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          setTaskUpdates(parsed);
        }
      }
    } catch {
    } finally {
      storageHydratedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!storageHydratedRef.current) return;
    try {
      localStorage.setItem("tasks_updates", JSON.stringify(taskUpdates));
    } catch {}
  }, [taskUpdates]);

  const [detailDate, setDetailDate] = useState("");
  const [detailStartDate, setDetailStartDate] = useState("");
  const [detailEndDate, setDetailEndDate] = useState("");

  const detailDateRef = useRef(null);
  const detailStartDateRef = useRef(null);
  const detailEndDateRef = useRef(null);

  const [showPropertyMenu, setShowPropertyMenu] = useState(null);

  const [visibleFields, setVisibleFields] = useState({
    status: false,
    priority: true,
    members: true,
    dueDate: true,
    labels: false,
    reporter: false,
  });

  const [formData, setFormData] = useState({
    title: "",
    dueDate: "",
    status: "To Do",
    priority: "",
    labels: [],
    members: [],
    createdBy: "",
  });

  const statusOptions = ["Backlog", "To Do", "Doing", "Completed", "On Hold"];

  const priorityOptions = ["No Priority", "Low", "Medium", "High", "Urgent"];

  const tasks = Array.isArray(taskResponse?.data)
    ? taskResponse.data
    : Array.isArray(taskResponse?.tasks)
      ? taskResponse.tasks
      : Array.isArray(taskResponse?.responseData)
        ? taskResponse.responseData
        : Array.isArray(taskResponse)
          ? taskResponse
          : [];

  const projects = Array.isArray(projectResponse?.data)
    ? projectResponse.data
    : Array.isArray(projectResponse?.projects)
      ? projectResponse.projects
      : Array.isArray(projectResponse?.responseData)
        ? projectResponse.responseData
        : Array.isArray(projectResponse)
          ? projectResponse
          : [];

  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const getId = (item) => {
    if (!item) return "";

    if (typeof item === "string") {
      return item;
    }

    if (typeof item === "object") {
      return (
        item._id ||
        item.id ||
        item.userId ||
        item.user_id ||
        item.memberId ||
        item.member_id ||
        item.user?._id ||
        item.user?.id ||
        item.user?.userId ||
        ""
      );
    }

    return "";
  };

  const apiUsers = useMemo(() => {
    if (Array.isArray(usersResponse?.data)) {
      return usersResponse.data;
    }

    if (Array.isArray(usersResponse?.users)) {
      return usersResponse.users;
    }

    if (Array.isArray(usersResponse?.responseData)) {
      return usersResponse.responseData;
    }

    if (Array.isArray(usersResponse?.responseData?.users)) {
      return usersResponse.responseData.users;
    }

    if (Array.isArray(usersResponse)) {
      return usersResponse;
    }

    return [];
  }, [usersResponse]);

  const members = useMemo(() => {
    const memberMap = new Map();

    apiUsers.forEach((user) => {
      const id = getId(user);

      if (id) {
        memberMap.set(String(id), user);
      }
    });

    const currentId = getId(storedUser);

    if (currentId) {
      memberMap.set(String(currentId), storedUser);
    }

    return Array.from(memberMap.values());
  }, [apiUsers, storedUser]);

  const currentUserId = getId(storedUser);

  const getMemberName = (member) => {
    if (!member) {
      return "Unknown";
    }

    let user = member;

    if (typeof member === "string") {
      user =
        members.find((item) => String(getId(item)) === String(member)) || null;

      if (!user) {
        return member;
      }
    }

    if (user?.user && typeof user.user === "object") {
      user = user.user;
    }

    return (
      user?.name ||
      user?.username ||
      user?.fullName ||
      user?.full_name ||
      user?.displayName ||
      user?.display_name ||
      user?.email ||
      "Unknown"
    );
  };

  const getSubtaskMemberUser = (member) => {
    if (!member) return null;

    if (typeof member === "object") {
      const nestedUser =
        member?.user && typeof member.user === "object" ? member.user : member;

      const id = getId(nestedUser) || getId(member);
      if (id) {
        return getUserById(id) || nestedUser;
      }

      const name =
        nestedUser?.name ||
        nestedUser?.username ||
        nestedUser?.fullName ||
        nestedUser?.full_name ||
        nestedUser?.displayName ||
        nestedUser?.display_name ||
        nestedUser?.email;

      return name ? nestedUser : null;
    }

    const user = getUserById(member);
    return user || null;
  };

  const getMemberAvatar = (member) => {
    if (!member) {
      return "";
    }

    let user = member;

    if (typeof member === "string") {
      user =
        members.find((item) => String(getId(item)) === String(member)) || null;
    }

    if (!user) {
      return "";
    }

    if (user?.user && typeof user.user === "object") {
      user = user.user;
    }

    const avatar =
      user?.avatar ||
      user?.avatarUrl ||
      user?.avatar_url ||
      user?.profilePic ||
      user?.profile_pic ||
      user?.profileImage ||
      user?.profile_image ||
      user?.profilePicture ||
      user?.profile_picture ||
      user?.picture ||
      user?.photo ||
      user?.photoUrl ||
      user?.photo_url ||
      user?.image ||
      user?.imageUrl ||
      user?.image_url ||
      user?.photoURL ||
      "";

    if (!avatar || typeof avatar !== "string") {
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
      return `http://localhost:8666${avatar}`;
    }

    return `http://localhost:8666/${avatar}`;
  };

  const Avatar = ({ member, size = "26px" }) => {
    const [imageError, setImageError] = useState(false);

    const name = getMemberName(member);
    const avatar = getMemberAvatar(member);

    const firstLetter =
      name && name !== "Unknown" ? name.charAt(0).toUpperCase() : "?";

    return (
      <div
        title={name}
        className="flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white bg-[#E7E7E7] text-[10px] font-medium text-[#555]"
        style={{
          width: size,
          height: size,
        }}
      >
        {avatar && !imageError ? (
          <img
            src={avatar}
            alt={name}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span>{firstLetter}</span>
        )}
      </div>
    );
  };

  const getUserById = (id) => {
    if (!id) return null;

    return (
      members.find((member) => String(getId(member)) === String(id)) || null
    );
  };

  const defaultProjectId = useMemo(() => {
    const storedProject =
      localStorage.getItem("projectId") || localStorage.getItem("project_id");

    if (storedProject) {
      return storedProject;
    }

    if (projects.length > 0) {
      return getId(projects[0]);
    }

    return "";
  }, [projects]);

  const getProjectName = (project) => {
    return (
      project?.name ||
      project?.title ||
      project?.projectName ||
      project?.project_name ||
      "Project"
    );
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const dateString = String(date).substring(0, 10);
    const parts = dateString.split("-");

    if (parts.length !== 3) {
      return "-";
    }

    const [year, month, day] = parts;

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthIndex = Number(month) - 1;

    if (!year || !day || monthIndex < 0 || monthIndex > 11) {
      return "-";
    }

    return `${day} ${monthNames[monthIndex]} ${year}`;
  };

  const formatShortDate = (date) => {
    if (!date) return "-";

    const dateString = String(date).substring(0, 10);
    const parts = dateString.split("-");
    if (parts.length !== 3) return "-";

    const [, month, day] = parts;
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthIndex = Number(month) - 1;

    if (!day || monthIndex < 0 || monthIndex > 11) return "-";
    return `${day} ${monthNames[monthIndex]}`;
  };

  const formatBoardDate = (date) => {
    if (!date) return "-";

    const dateString = String(date).substring(0, 10);
    const parts = dateString.split("-");

    if (parts.length !== 3) {
      return "-";
    }

    const [, month, day] = parts;

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthIndex = Number(month) - 1;

    if (!day || monthIndex < 0 || monthIndex > 11) {
      return "-";
    }

    return `${day} ${monthNames[monthIndex]}`;
  };

  const getCreatedBy = (task) => {
    if (!task) return null;

    if (task.createdBy) {
      if (typeof task.createdBy === "object") {
        return task.createdBy;
      }

      return getUserById(task.createdBy);
    }

    if (task.created_by) {
      if (typeof task.created_by === "object") {
        return task.created_by;
      }

      return getUserById(task.created_by);
    }

    if (task.creator) {
      return task.creator;
    }

    if (task.createdByUser) {
      return task.createdByUser;
    }

    return null;
  };

  const getTaskLabels = (task) => {
    if (!task) return [];

    const labels = task.labels || task.label || task.tags || [];

    if (!Array.isArray(labels)) {
      if (typeof labels === "string") {
        return labels
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }

      return [];
    }

    return labels
      .map((label) => {
        if (typeof label === "string") {
          return label;
        }

        return (
          label?.name || label?.title || label?.label || label?.value || ""
        );
      })
      .filter(Boolean);
  };

  const filteredTasks = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return tasks.filter((task) => {
      const matchesSearch =
        !searchText || task.title?.toLowerCase().includes(searchText);

      const matchesPriority =
        priorityFilter === "All" || task.priority === priorityFilter;

      const matchesMember =
        memberFilter === "All" ||
        (Array.isArray(task.members) &&
          task.members.some(
            (member) => String(getId(member)) === String(memberFilter),
          ));

      return matchesSearch && matchesPriority && matchesMember;
    });
  }, [tasks, search, priorityFilter, memberFilter]);

  const groupedTasks = useMemo(() => {
    const statusOptions = ["Backlog", "To Do", "Doing", "Completed", "On Hold"];

    return statusOptions
      .map((status) => ({
        status,
        tasks: filteredTasks.filter(
          (task) => (task.status || "To Do") === status,
        ),
      }))
      .filter((group) => group.tasks.length > 0);
  }, [filteredTasks]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleLabelChange = (e) => {
    const value = e.target.value;

    setLabelsInput(value);

    const labels = value
      .split(",")
      .map((label) => label.trim())
      .filter(Boolean);

    setFormData((previous) => ({
      ...previous,
      labels,
    }));
  };

  const handleAddTask = (status = "To Do") => {
    setEditingTask(null);
    setLabelsInput("");

    setFormData({
      title: "",
      dueDate: "",
      status,
      priority: "",
      labels: [],
      members: [],
      createdBy: currentUserId || "",
    });

    setShowModal(true);
  };

  const handleEditTask = (task) => {
    const createdBy = getCreatedBy(task);
    const taskLabels = getTaskLabels(task);

    setEditingTask(task);
    setLabelsInput(taskLabels.join(", "));

    setFormData({
      title: task.title || "",
      dueDate: task.dueDate ? String(task.dueDate).substring(0, 10) : "",
      status: task.status || "To Do",
      priority: task.priority || "",
      labels: taskLabels,
      members: Array.isArray(task.members)
        ? task.members.map((member) => String(getId(member)))
        : [],
      createdBy: String(
        getId(createdBy) || task.createdBy || task.created_by || "",
      ),
    });

    setOpenMenu(null);
    setShowModal(true);
  };

  const handleDeleteClick = (task) => {
    setDeletingTask(task);
    setOpenMenu(null);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingTask) return;

    const taskId = deletingTask._id || deletingTask.id;

    if (!taskId) {
      toast.error("Task ID not found!!");
      return;
    }

    try {
      await deleteTask(taskId).unwrap();

      toast.success("Task deleted successfully!!");

      setShowDeleteModal(false);

      if (
        selectedTask &&
        String(selectedTask._id || selectedTask.id) === String(taskId)
      ) {
        setSelectedTask(null);
      }

      setDeletingTask(null);
    } catch {
      toast.error("Error in deleting record!!");
    }
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;

    setShowDeleteModal(false);
    setDeletingTask(null);
  };

  const handleCloseModal = () => {
    if (isCreating || isUpdating) return;

    setShowModal(false);
    setEditingTask(null);
    setLabelsInput("");
  };

  const openDatePicker = () => {
    if (!dateInputRef.current) return;

    if (typeof dateInputRef.current.showPicker === "function") {
      dateInputRef.current.showPicker();
    } else {
      dateInputRef.current.click();
    }
  };

  const openDetailDatePicker = () => {
    if (!detailDateRef.current) return;

    if (typeof detailDateRef.current.showPicker === "function") {
      detailDateRef.current.showPicker();
    } else {
      detailDateRef.current.click();
    }
  };

  const openDetailStartDatePicker = () => {
    if (!detailStartDateRef.current) return;
    if (typeof detailStartDateRef.current.showPicker === "function") {
      detailStartDateRef.current.showPicker();
    } else {
      detailStartDateRef.current.click();
    }
  };

  const openDetailEndDatePicker = () => {
    if (!detailEndDateRef.current) return;
    if (typeof detailEndDateRef.current.showPicker === "function") {
      detailEndDateRef.current.showPicker();
    } else {
      detailEndDateRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalLabels = labelsInput
      .split(",")
      .map((label) => label.trim())
      .filter(Boolean);

    if (!formData.title.trim()) {
      toast.error("Title is required!!");
      return;
    }

    if (!formData.status) {
      toast.error("Please select a status.");
      return;
    }

    if (!formData.dueDate) {
      toast.error("Due date is required!!");
      return;
    }

    if (viewMode === "list" && !formData.priority) {
      toast.error("Please select a priority");
      return;
    }

    if (viewMode === "board" && finalLabels.length === 0) {
      toast.error("Please add at least one label!!");
      return;
    }

    if (!Array.isArray(formData.members) || formData.members.length === 0) {
      toast.error("Please select at least one member.");
      return;
    }

    if (!formData.createdBy) {
      toast.error("Please select created by.");
      return;
    }

    if (!currentUserId) {
      toast.error("Logged-in user not found.");
      return;
    }

    if (!defaultProjectId) {
      toast.error("Project is required. Please create a project first.");
      return;
    }

    try {
      const taskPayload = {
        title: formData.title.trim(),
        dueDate: formData.dueDate,
        status: formData.status,
        priority: formData.priority,
        labels: finalLabels,
        members: formData.members,
        createdBy: formData.createdBy,
        project: defaultProjectId,
      };

      if (editingTask) {
        await updateTask({
          id: editingTask._id || editingTask.id,
          ...taskPayload,
        }).unwrap();

        toast.success("Task updated successfully!!");
      } else {
        await createTask(taskPayload).unwrap();

        toast.success("Task added successfully!!");
      }

      setShowModal(false);
      setEditingTask(null);
      setLabelsInput("");

      setFormData({
        title: "",
        dueDate: "",
        status: "To Do",
        priority: "",
        labels: [],
        members: [],
        createdBy: "",
      });
    } catch {
      toast.error("Server Error!!");
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case "Urgent":
        return {
          color: "#B42318",
          activeColumns: 4,
        };

      case "High":
        return {
          color: "#D92D20",
          activeColumns: 3,
        };

      case "Medium":
        return {
          color: "#E85D04",
          activeColumns: 2,
        };

      case "Low":
        return {
          color: "#98A2B3",
          activeColumns: 1,
        };

      default:
        return {
          color: "#98A2B3",
          activeColumns: 0,
        };
    }
  };

  const PriorityDisplay = ({ priority }) => {
    if (!priority || priority === "No Priority") {
      return (
        <span className="text-[10px] font-medium text-[#98A2B3]">
          No Priority
        </span>
      );
    }

    const { color, activeColumns } = getPriorityConfig(priority);

    return (
      <div className="flex items-center gap-1.5">
        <div className="flex h-[13px] items-end gap-[1.5px]">
          {[1, 2, 3, 4].map((column) => (
            <span
              key={column}
              className="block w-[1px] rounded-[1px]"
              style={{
                height:
                  column === 1
                    ? "4px"
                    : column === 2
                      ? "6px"
                      : column === 3
                        ? "8px"
                        : "10px",
                backgroundColor: column <= activeColumns ? color : "#E4E7EC",
              }}
            />
          ))}
        </div>

        <span className="text-[10px] font-medium" style={{ color }}>
          {priority}
        </span>
      </div>
    );
  };

  const BoardDatePill = ({ date }) => {
    if (!date) return null;

    return (
      <div className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#D92D20] bg-[#FFF1F0] px-1.5 py-0.5 text-[10px] font-medium leading-none text-[#D92D20] ">
        <RiCalendarLine size={12} />

        <span>{formatBoardDate(date)}</span>
      </div>
    );
  };

  const ListDate = ({ date }) => {
    if (!date) return null;

    return (
      <span className="text-[12px] font-normal text-black">
        {formatDate(date)}
      </span>
    );
  };

  const LabelsDisplay = ({ task }) => {
    const labels = getTaskLabels(task);

    if (labels.length === 0) {
      return <span className="text-[10px] text-[#999]">No labels</span>;
    }

    return (
      <div className="flex flex-wrap gap-1.5">
        {labels.map((label, index) => (
          <span
            key={`${label}-${index}`}
            className="rounded-[4px] bg-[#F2F2F2] px-1.5 py-0.5 text-[9px] font-medium text-[#555]"
          >
            {label}
          </span>
        ))}
      </div>
    );
  };

  const openTaskDetails = (task) => {
    setSelectedTask(task);
    setDetailDate(task?.dueDate ? String(task.dueDate).substring(0, 10) : "");
    setDetailStartDate(
      task?.startDate || task?.start_date
        ? String(task.startDate || task.start_date).substring(0, 10)
        : "",
    );
    setDetailEndDate(
      task?.dueDate ? String(task.dueDate).substring(0, 10) : "",
    );

    setCommentInput("");
    setReplyingTo(null);
    setShowPropertyMenu(null);
    setOpenMenu(null);
  };

  const updateSelectedTask = async (changes) => {
    if (!selectedTask) return;

    const id = selectedTask._id || selectedTask.id;

    if (!id) {
      toast.error("Task ID not found!!");
      return;
    }

    try {
      await updateTask({
        id,
        ...changes,
      }).unwrap();

      setSelectedTask((previous) => ({
        ...previous,
        ...changes,
      }));

      const taskKey = String(id);
      const updateEntries = [];

      if (Object.prototype.hasOwnProperty.call(changes, "priority")) {
        updateEntries.push(
          `changed priority to ${changes.priority || "No Priority"}`,
        );
      }

      if (Object.prototype.hasOwnProperty.call(changes, "status")) {
        updateEntries.push(`changed status to ${changes.status}`);
      }

      if (Object.prototype.hasOwnProperty.call(changes, "startDate")) {
        updateEntries.push(
          `changed start date to ${changes.startDate || "not set"}`,
        );
      }

      if (Object.prototype.hasOwnProperty.call(changes, "endDate")) {
        updateEntries.push(
          `changed end date to ${changes.endDate || "not set"}`,
        );
      }

      if (Object.prototype.hasOwnProperty.call(changes, "dueDate")) {
        updateEntries.push(
          `changed due date to ${changes.dueDate || "not set"}`,
        );
      }

      if (updateEntries.length > 0) {
        setTaskUpdates((previous) => ({
          ...previous,
          [taskKey]: [
            ...(previous[taskKey] || []),
            ...updateEntries.map((message) => ({
              id: `update-${Date.now()}-${Math.random()}`,
              author: currentUserId || "current-user",
              message,
              createdAt: new Date().toISOString(),
            })),
          ].slice(-10),
        }));
      }

      toast.success("Task Details updated successfully!!");
    } catch {
      toast.error("Unable to update task details!!");
    }
  };

  const changeDetailStatus = (status) => {
    setShowPropertyMenu(null);
    updateSelectedTask({
      status,
    });
  };

  const changeDetailPriority = (priority) => {
    setShowPropertyMenu(null);
    updateSelectedTask({
      priority,
    });
  };

  const changeDetailDate = async (value) => {
    setDetailDate(value);

    await updateSelectedTask({
      dueDate: value,
    });
  };

  const changeDetailStartDate = async (value) => {
    setDetailStartDate(value);
    await updateSelectedTask({ startDate: value });
  };

  const changeDetailEndDate = async (value) => {
    setDetailEndDate(value);
    await updateSelectedTask({ dueDate: value });
  };

  const currentSubtasks = Array.isArray(subtasksResponse?.data)
    ? subtasksResponse.data
    : Array.isArray(subtasksResponse?.subtasks)
      ? subtasksResponse.subtasks
      : Array.isArray(subtasksResponse?.responseData)
        ? subtasksResponse.responseData
        : Array.isArray(subtasksResponse?.responseData?.subtasks)
          ? subtasksResponse.responseData.subtasks
          : Array.isArray(subtasksResponse)
            ? subtasksResponse
            : [];

  const currentCommentsRaw = Array.isArray(commentsResponse?.data)
    ? commentsResponse.data
    : Array.isArray(commentsResponse?.comments)
      ? commentsResponse.comments
      : Array.isArray(commentsResponse)
        ? commentsResponse
        : [];

  const currentComments = currentCommentsRaw.map((comment) => ({
    ...comment,
    id: comment.id || comment._id,
    user: comment.user || comment.author || null,
    message: comment.message ?? comment.text ?? "",
    replies: Array.isArray(comment.replies) ? comment.replies : [],
  }));

  const openSubtaskStartDatePicker = () => {
    if (!subtaskStartDateRef.current) return;
    if (typeof subtaskStartDateRef.current.showPicker === "function") {
      subtaskStartDateRef.current.showPicker();
    } else {
      subtaskStartDateRef.current.click();
    }
  };

  const openSubtaskDueDatePicker = () => {
    if (!subtaskDueDateRef.current) return;
    if (typeof subtaskDueDateRef.current.showPicker === "function") {
      subtaskDueDateRef.current.showPicker();
    } else {
      subtaskDueDateRef.current.click();
    }
  };

  const resetSubtaskForm = () => {
    setSubtaskTitle("");
    setSubtaskPriority("Low");
    setSubtaskMember("");
    setSubtaskStartDate("");
    setSubtaskDueDate("");
    setEditingSubtaskId(null);
    setShowSubtaskForm(false);
    setSubtaskActionMenu(null);
  };

  const addOrUpdateSubtask = async () => {
    if (!selectedTaskId) {
      toast.error("Select a task first!!");
      return;
    }

    if (!subtaskTitle.trim()) {
      toast.error("Subtask title is required!!");
      return;
    }

    if (
      subtaskStartDate &&
      subtaskDueDate &&
      subtaskStartDate > subtaskDueDate
    ) {
      toast.error("Start date cannot be after end date!!");
      return;
    }

    const payload = {
      task: selectedTaskId,
      taskId: selectedTaskId,
      title: subtaskTitle.trim(),
      priority: subtaskPriority || "Low",
      ...(subtaskMember
        ? { member: subtaskMember, memberId: subtaskMember }
        : {}),
      ...(subtaskStartDate ? { startDate: subtaskStartDate } : {}),
      ...(subtaskDueDate ? { dueDate: subtaskDueDate } : {}),
    };

    try {
      if (editingSubtaskId) {
        await updateSubtask({
          id: editingSubtaskId,
          ...payload,
        }).unwrap();
        toast.success("Subtask updated successfully!!");
      } else {
        await createSubtask(payload).unwrap();
        toast.success("Subtask added successfully!!");
      }

      if (typeof refetchSubtasks === "function") {
        await refetchSubtasks();
      }

      resetSubtaskForm();
    } catch (err) {
      const message =
        err?.data?.message ||
        err?.error ||
        err?.message ||
        "Unable to save subtask!!";
      toast.error(message);
    }
  };

  const editSubtask = (subtask) => {
    setSubtaskActionMenu(null);
    setShowSubtaskForm(true);
    setEditingSubtaskId(subtask._id || subtask.id);
    setSubtaskTitle(subtask.title || "");
    setSubtaskPriority(subtask.priority || "Low");
    setSubtaskMember(String(getId(subtask.member) || subtask.member || ""));
    setSubtaskStartDate(
      subtask.startDate ? String(subtask.startDate).substring(0, 10) : "",
    );
    setSubtaskDueDate(
      subtask.dueDate ? String(subtask.dueDate).substring(0, 10) : "",
    );
  };

  const deleteSubtask = async (subtaskId) => {
    if (!subtaskId) return;

    try {
      await deleteSubtaskApi(subtaskId).unwrap();
      if (typeof refetchSubtasks === "function") {
        await refetchSubtasks();
      }
      setSubtaskActionMenu(null);
      toast.success("Subtask deleted successfully!!");
    } catch (err) {
      console.error(err);
      toast.error("Unable to delete subtask!!");
    }
  };

  const toggleSubtask = async (subtask) => {
    const id = subtask._id || subtask.id;
    if (!id) return;

    try {
      await updateSubtask({
        id,
        completed: !subtask.completed,
      }).unwrap();
      if (typeof refetchSubtasks === "function") {
        await refetchSubtasks();
      }
    } catch (err) {
      console.error(err);
      toast.error("Unable to update subtask!!");
    }
  };

  const addComment = async () => {
    if (!selectedTaskId) {
      toast.error("Select a task first.");
      return;
    }

    const message = commentInput.trim();

    if (!message) {
      toast.error("Write a comment first.");
      return;
    }

    const userId = currentUserId || getId(storedUser);

    if (!userId) {
      toast.error("Logged-in user not found!!");
      return;
    }

    try {
      const commentPayload = {
        task: selectedTaskId,
        user: userId,
        message,
      };

      await createComment(commentPayload).unwrap();

      if (typeof refetchComments === "function") {
        await refetchComments();
      }

      setCommentInput("");
      setReplyingTo(null);
      toast.success("Comment added successfully!!");
    } catch (err) {
      const messageFromServer =
        err?.data?.responseMessage ||
        err?.data?.message ||
        err?.error ||
        err?.message ||
        "Unable to save comment.";
      toast.error(messageFromServer);
    }
  };

  const deleteComment = async (commentId) => {
    if (!commentId) return;

    try {
      await deleteCommentApi(commentId).unwrap();
      toast.success("Comment deleted successfully!!");
    } catch (err) {
      console.error(err);
      toast.error("Unable to delete comment!!");
    }
  };

  const TaskMenu = ({ task, openUp = false }) => {
    const taskId = task._id || task.id;

    return (
      <div className="relative shrink-0">
        <button
          type="button"
          title="More actions"
          onClick={(e) => {
            e.stopPropagation();

            setOpenMenu(openMenu === taskId ? null : taskId);
          }}
          className="flex h-7 w-7 items-center justify-center rounded-[5px] text-[#777] hover:bg-[#EEEEEE]"
        >
          <RiMoreLine size={17} />
        </button>

        {openMenu === taskId && (
          <div
            className={`absolute right-0 z-[99999] w-[140px] rounded-[7px] border border-[#E5E5E5] bg-white p-1 shadow-lg ${
              openUp ? "bottom-8 mb-1" : "top-8 mt-1"
            }`}
          >
            <button
              type="button"
              onClick={() => openTaskDetails(task)}
              className="flex h-8 w-full items-center gap-2 rounded-[5px] px-2 text-left text-[10px] text-[#333] hover:bg-[#F5F5F5]"
            >
              <RiEyeLine size={13} />
              View details
            </button>

            <button
              type="button"
              onClick={() => handleEditTask(task)}
              className="flex h-8 w-full items-center gap-2 rounded-[5px] px-2 text-left text-[10px] text-[#22C55E] hover:bg-[#F5F5F5]"
            >
              <RiPencilLine size={13} />
              Edit
            </button>

            <button
              type="button"
              disabled={isDeleting}
              onClick={() => handleDeleteClick(task)}
              className="flex h-8 w-full items-center gap-2 rounded-[5px] px-2 text-left text-[10px] text-[#E53935] hover:bg-[#FFF5F5]"
            >
              <RiDeleteBinLine size={13} />
              Delete
            </button>
          </div>
        )}
      </div>
    );
  };

  const TaskRow = ({ task, openUp = false }) => {
    const createdBy = getCreatedBy(task);

    return (
      <div
        onDoubleClick={() => openTaskDetails(task)}
        className="hidden cursor-pointer items-center border-t border-[#E7E7E7] px-3 py-1 text-[10px] hover:bg-[#FAFAFA] md:flex md:px-4"
      >
        <div
          className="min-w-0 flex-1 pr-3"
          onClick={() => openTaskDetails(task)}
        >
          <p className="truncate text-[10px] font-normal  text-[#222]">
            {task.title || "Untitled task"}
          </p>
        </div>

        {visibleFields.status && (
          <div className="w-[100px] shrink-0">
            <span className="rounded-[4px] bg-[#F2F2F2] px-1.5 py-1 text-[10px] font-medium text-[#555]">
              {task.status || "To Do"}
            </span>
          </div>
        )}

        {visibleFields.priority && (
          <div className="w-[110px] shrink-0">
            <PriorityDisplay priority={task.priority} />
          </div>
        )}

        {visibleFields.members && (
          <div className="w-[140px] shrink-0">
            <div className="flex items-center">
              {Array.isArray(task.members) && task.members.length > 0 ? (
                <div className="flex items-center">
                  {task.members.slice(0, 4).map((member, index) => (
                    <div
                      key={`${getId(member)}-${index}`}
                      className="-ml-1 first:ml-0"
                    >
                      <Avatar member={member} size="20px" />
                    </div>
                  ))}

                  {task.members.length > 4 && (
                    <span className="ml-1 text-[10px] font-medium text-[#666]">
                      +{task.members.length - 4}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-[10px] text-[#999]">-</span>
              )}
            </div>
          </div>
        )}

        {visibleFields.dueDate && (
          <div className="w-[130px] shrink-0">
            <ListDate date={task.dueDate} />
          </div>
        )}

        {visibleFields.labels && (
          <div className="w-[130px] shrink-0">
            <LabelsDisplay task={task} />
          </div>
        )}

        {visibleFields.reporter && (
          <div className="w-[130px] shrink-0">
            <div className="flex min-w-0 items-center gap-1.5">
              {createdBy && <Avatar member={createdBy} size="16px" />}

              <span className="truncate text-[9px] text-[#555]">
                {createdBy ? getMemberName(createdBy) : "-"}
              </span>
            </div>
          </div>
        )}

        <div className="flex w-[60px] shrink-0 justify-end">
          <TaskMenu task={task} openUp={openUp} />
        </div>
      </div>
    );
  };

  const MobileTaskCard = ({ task, openUp = false }) => {
    const createdBy = getCreatedBy(task);

    return (
      <div
        className="border-t border-[#E7E7E7] p-3 md:hidden"
        onDoubleClick={() => openTaskDetails(task)}
      >
        <div className="flex items-start justify-between gap-3">
          <button
            type="button"
            onClick={() => openTaskDetails(task)}
            className="min-w-0 flex-1 break-words text-left text-[12px] font-semibold leading-5 text-[#222]"
          >
            {task.title || "Untitled task"}
          </button>

          <TaskMenu task={task} openUp={openUp} />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          {visibleFields.status && (
            <div>
              <p className="mb-1 text-[9px] text-[#999] font-normal">Status</p>

              <span className="rounded-[4px] bg-[#F2F2F2] px-1.5 py-1 text-[12px] font-normal text-[#555]">
                {task.status || "To Do"}
              </span>
            </div>
          )}

          {visibleFields.priority && (
            <div>
              <p className="mb-1 text-[9px] text-[#999]">Priority</p>

              <PriorityDisplay priority={task.priority} />
            </div>
          )}

          {visibleFields.dueDate && (
            <div>
              <p className="mb-1 text-[9px] text-[#999] font-normal">
                Due Date
              </p>

              <ListDate date={task.dueDate} />
            </div>
          )}

          {visibleFields.members && (
            <div>
              <p className="mb-1 text-[9px] text-[#999]">Members</p>

              <div className="flex items-center">
                {Array.isArray(task.members) && task.members.length > 0 ? (
                  <>
                    {task.members.slice(0, 4).map((member, index) => (
                      <div
                        key={`${getId(member)}-${index}`}
                        className="-ml-1 first:ml-0"
                      >
                        <Avatar member={member} size="25px" />
                      </div>
                    ))}
                  </>
                ) : (
                  <span className="text-[10px] text-[#999]">-</span>
                )}
              </div>
            </div>
          )}

          {visibleFields.reporter && (
            <div>
              <p className="mb-1 text-[9px] text-[#999]">Reporter</p>

              <div className="flex items-center gap-1.5">
                {createdBy && <Avatar member={createdBy} size="22px" />}

                <span className="truncate text-[9px] text-[#555]">
                  {createdBy ? getMemberName(createdBy) : "-"}
                </span>
              </div>
            </div>
          )}
        </div>

        {visibleFields.labels && (
          <div className="mt-3">
            <p className="mb-1 text-[9px] text-[#999]">Labels</p>

            <LabelsDisplay task={task} />
          </div>
        )}
      </div>
    );
  };

  const BoardCard = ({ task }) => {
    const labels = getTaskLabels(task);

    const createdBy = getCreatedBy(task);

    return (
      <div className="group relative w-full rounded-[7px] border border-[#E5E5E5] bg-white p-3 transition hover:border-[#D5D5D5] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex items-start justify-between gap-2">
          <button
            type="button"
            onClick={() => openTaskDetails(task)}
            className="min-w-0 flex-1 break-words text-left text-[12px] font-semibold leading-5 text-[#222]"
          >
            {task.title || "Untitled task"}
          </button>

          <TaskMenu task={task} />
        </div>

        <div className="mt-3 flex min-w-0 items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            {createdBy ? (
              <Avatar member={createdBy} size="24px" />
            ) : (
              <div className="flex h-[25px] w-[25px] shrink-0 items-center justify-center rounded-full bg-[#E7E7E7] text-[10px] text-[#777]">
                ?
              </div>
            )}

            <span className="truncate text-[9px] font-normal text-[#555]">
              Admin
            </span>
          </div>

          <BoardDatePill date={task.dueDate} />
        </div>

        {labels.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {labels.map((label, index) => (
              <span
                key={`${label}-${index}`}
                className="rounded-[4px] bg-[#F2F2F2] px-1.5 py-0.5 text-[9px] font-medium text-[#555]"
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  const PropertyDropdown = ({ property, children }) => {
    const isOpen = showPropertyMenu === property;

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowPropertyMenu(isOpen ? null : property)}
          className="flex max-w-full items-center gap-1.5 rounded-[5px] px-2 py-1.5 text-[10px] hover:bg-[#F5F5F5]"
        >
          {children}

          <RiArrowDownSLine size={12} className="shrink-0 text-[#999]" />
        </button>

        {isOpen && (
          <div className="absolute left-0 top-full z-[100] mt-1 w-[150px] rounded-[7px] border border-[#E5E5E5] bg-white p-1 shadow-lg">
            {property === "status" &&
              statusOptions.map((status) => (
                <button
                  type="button"
                  key={status}
                  onClick={() => changeDetailStatus(status)}
                  className="flex w-full items-center justify-between rounded-[5px] px-2 py-2 text-left text-[10px] hover:bg-[#F5F5F5]"
                >
                  <span>{status}</span>

                  {selectedTask?.status === status && <RiCheckLine size={13} />}
                </button>
              ))}

            {property === "priority" &&
              priorityOptions.map((priority) => (
                <button
                  type="button"
                  key={priority}
                  onClick={() => changeDetailPriority(priority)}
                  className="flex w-full items-center justify-between rounded-[5px] px-2 py-2 text-left text-[10px] hover:bg-[#F5F5F5]"
                >
                  <span>{priority}</span>

                  {selectedTask?.priority === priority && (
                    <RiCheckLine size={13} />
                  )}
                </button>
              ))}

            {property === "member" &&
              members.map((member) => {
                const id = getId(member);

                const selected =
                  Array.isArray(selectedTask?.members) &&
                  selectedTask.members.some(
                    (item) => String(getId(item)) === String(id),
                  );

                return (
                  <button
                    type="button"
                    key={id}
                    onClick={() => {
                      const current = Array.isArray(selectedTask?.members)
                        ? selectedTask.members.map((item) =>
                            String(getId(item)),
                          )
                        : [];

                      const next = current.includes(String(id))
                        ? current.filter((item) => item !== String(id))
                        : [...current, String(id)];

                      updateSelectedTask({
                        members: next,
                      });
                    }}
                    className="flex w-full items-center justify-between gap-2 rounded-[5px] px-2 py-2 text-left text-[10px] hover:bg-[#F5F5F5]"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <Avatar member={member} size="20px" />

                      <span className="truncate">{getMemberName(member)}</span>
                    </span>

                    {selected && <RiCheckLine size={13} />}
                  </button>
                );
              })}
          </div>
        )}
      </div>
    );
  };

  const TaskDetails = () => {
    if (!selectedTask) return null;

    const createdBy = getCreatedBy(selectedTask);

    const labels = getTaskLabels(selectedTask);

    return (
      <div className="fixed inset-0 z-[70] overflow-y-auto bg-white">
        <div className="sticky top-0 z-[80] flex min-h-[58px] items-center justify-between border-b border-[#E7E7E7] bg-white px-3 sm:px-5 lg:px-7">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              title="Back to tasks"
              onClick={() => setSelectedTask(null)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[5px] text-[#777] hover:bg-[#F5F5F5]"
            >
              <RiArrowLeftLine size={17} />
            </button>

            <span className="truncate text-[11px] text-[#999]">Tasks</span>

            <span className="text-[#CCC]">/</span>

            <span className="max-w-[180px] truncate text-[11px] font-medium text-[#333] sm:max-w-[300px]">
              {selectedTask.title}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              title="Lock"
              onClick={() => toast.info("Task is available for editing.")}
              className="flex h-8 w-8 items-center justify-center rounded-[5px] text-[#777] hover:bg-[#F5F5F5]"
            >
              <RiLockLine size={15} />
            </button>

            <button
              type="button"
              title="View"
              onClick={() => toast.info("You are viewing this task.")}
              className="hidden h-8 w-8 items-center justify-center rounded-[5px] text-[#777] hover:bg-[#F5F5F5] sm:flex"
            >
              <RiEyeLine size={15} />
            </button>

            <button
              type="button"
              title="Share task"
              onClick={() => {
                const text = `${window.location.href} - ${selectedTask.title}`;

                if (navigator.clipboard) {
                  navigator.clipboard
                    .writeText(text)
                    .then(() => toast.success("Task link copied."))
                    .catch(() => toast.info("Share link could not be copied."));
                }
              }}
              className="flex h-8 w-8 items-center justify-center rounded-[5px] text-[#777] hover:bg-[#F5F5F5]"
            >
              <RiShareLine size={15} />
            </button>

            <button
              type="button"
              title="Edit task"
              onClick={() => handleEditTask(selectedTask)}
              className="flex h-8 w-8 items-center justify-center rounded-[5px] text-[#777] hover:bg-[#F5F5F5]"
            >
              <RiPencilLine size={15} />
            </button>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-3 py-5 sm:px-5 md:px-7 lg:flex-row lg:gap-8 lg:px-10 lg:py-8">
          <div className="min-w-0 flex-1">
            <div>
              <button
                type="button"
                onClick={() => handleEditTask(selectedTask)}
                className="group flex w-full items-start gap-2 text-left"
              >
                <h1 className="break-words text-[20px] font-medium leading-7 text-[#222] sm:text-[23px]">
                  {selectedTask.title || "Untitled task"}
                </h1>

                <RiPencilLine
                  size={15}
                  className="mt-1 shrink-0 text-[#AAA] opacity-0 transition group-hover:opacity-100"
                />
              </button>

              <p className="mt-1 max-w-[720px] text-[10px] leading-5 text-[#999]">
                Create clear and detailed task information and keep everything
                related to this task in one place.
              </p>
            </div>

            <div className="mt-5 rounded-[8px] border border-[#E5E5E5] bg-white lg:hidden">
              <div className="flex items-center justify-between border-b border-[#EEEEEE] px-3 py-2.5">
                <span className="text-[11px] font-semibold text-[#333]">
                  Properties
                </span>

                <RiSettings3Line size={14} className="text-[#999]" />
              </div>

              <div className="grid grid-cols-1 divide-y divide-[#EEEEEE]">
                <div className="flex min-h-[45px] items-center justify-between px-3">
                  <span className="text-[10px] text-[#888]">Status</span>

                  <PropertyDropdown property="status">
                    <span className="rounded-[4px] bg-[#F2F2F2] px-2 py-1 text-[9px] font-medium text-[#555]">
                      {selectedTask.status || "To Do"}
                    </span>
                  </PropertyDropdown>
                </div>

                <div className="flex min-h-[45px] items-center justify-between px-3">
                  <span className="text-[10px] text-[#888]">Priority</span>

                  <PropertyDropdown property="priority">
                    <PriorityDisplay priority={selectedTask.priority} />
                  </PropertyDropdown>
                </div>

                <div className="flex min-h-[45px] items-center justify-between px-3">
                  <span className="text-[10px] text-[#888]">Members</span>

                  <PropertyDropdown property="member">
                    <div className="flex items-center">
                      {Array.isArray(selectedTask.members) &&
                      selectedTask.members.length > 0 ? (
                        selectedTask.members
                          .slice(0, 3)
                          .map((member, index) => (
                            <div
                              key={`${getId(member)}-${index}`}
                              className="-ml-1 first:ml-0"
                            >
                              <Avatar member={member} size="24px" />
                            </div>
                          ))
                      ) : (
                        <RiUserLine size={15} className="text-[#999]" />
                      )}
                    </div>
                  </PropertyDropdown>
                </div>

                <div className="px-3 py-3">
                  <span className="mb-2 block text-[8px] text-[#888]">
                    Dates
                  </span>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-[#999]">Start</span>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={openDetailStartDatePicker}
                          className="flex items-center gap-1.5 rounded-[5px] px-2 py-1.5 text-[9px] text-[#555] hover:bg-[#F5F5F5]"
                        >
                          <RiCalendarLine size={12} />
                          {detailStartDate
                            ? formatShortDate(detailStartDate)
                            : "Set date"}
                        </button>
                        <input
                          ref={detailStartDateRef}
                          type="date"
                          value={detailStartDate}
                          onChange={(e) =>
                            changeDetailStartDate(e.target.value)
                          }
                          className="pointer-events-none absolute h-0 w-0 opacity-0"
                          tabIndex={-1}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-[#999]">End</span>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={openDetailEndDatePicker}
                          className="flex items-center gap-1.5 rounded-[5px] px-2 py-1.5 text-[9px] text-[#555] hover:bg-[#F5F5F5]"
                        >
                          <RiCalendarLine size={12} />
                          {detailEndDate
                            ? formatShortDate(detailEndDate)
                            : "Set date"}
                        </button>
                        <input
                          ref={detailEndDateRef}
                          type="date"
                          value={detailEndDate}
                          onChange={(e) => changeDetailEndDate(e.target.value)}
                          className="pointer-events-none absolute h-0 w-0 opacity-0"
                          tabIndex={-1}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="text-[10px] font-medium text-[#888]">
                Properties
              </span>

              {(() => {
                const createdBy = getCreatedBy(selectedTask);
                return createdBy ? (
                  <div
                    className="flex min-w-0 items-center gap-1.5"
                    title="Developer"
                  >
                    <Avatar member={createdBy} size="22px" />
                    <span className="max-w-[150px] truncate text-[10px] text-[#555]">
                      Developer
                    </span>
                  </div>
                ) : null;
              })()}

              <div className="relative">
                <button
                  type="button"
                  title="Change date"
                  onClick={openDetailDatePicker}
                  className="flex items-center gap-1 rounded-full border border-[#E5484D] px-1 py-0.5 text-[9px] font-normal text-[#E5484D] bg-[#FFF1F0]"
                >
                  <RiCalendarLine size={13} />
                  {detailDate ? formatShortDate(detailDate) : "No date"}
                </button>

                <input
                  ref={detailDateRef}
                  type="date"
                  value={detailDate}
                  onChange={(e) => changeDetailDate(e.target.value)}
                  className="pointer-events-none absolute h-0 w-0 opacity-0"
                  tabIndex={-1}
                />
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2">
                <RiPriceTag3Line size={15} className="text-[#999]" />

                <span className="text-[10px] font-medium text-[#777]">
                  Labels
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {labels.length > 0 ? (
                  labels.map((label, index) => (
                    <span
                      key={`${label}-${index}`}
                      className="rounded-[4px] bg-[#F2F2F2] px-2 py-1 text-[9px] font-medium text-[#555]"
                    >
                      {label}
                    </span>
                  ))
                ) : (
                  <button
                    type="button"
                    onClick={() => handleEditTask(selectedTask)}
                    className="rounded-[5px] border border-dashed border-[#DDD] px-2 py-1 text-[9px] text-[#999] hover:bg-[#F8F8F8]"
                  >
                    + Add label
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2">
                <RiFileTextLine size={15} className="text-[#999]" />

                <span className="text-[10px] font-medium text-[#777]">
                  Resources
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  toast.info("Resource linking can be added here.")
                }
                className="mt-2 inline-flex items-center gap-1.5 rounded-[5px] px-0 text-left text-[10px] text-[#999] hover:text-[#555]"
              >
                <RiAttachment2 size={13} />
                Add document or link...
              </button>
            </div>

            <div className="mt-7 border-t border-[#EEEEEE] pt-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-[12px] font-semibold text-[#333]">
                    Subtasks
                  </h2>

                  <p className="mt-0.5 text-[9px] text-[#999]">
                    Break this task into smaller actionable items.
                  </p>
                </div>
              </div>

              {showSubtaskForm && (
                <div className="mt-3 rounded-[7px] border border-[#E5E5E5] bg-[#FAFAFA] p-3">
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,1fr)_110px_150px_130px_130px_auto]">
                    <input
                      type="text"
                      value={subtaskTitle}
                      onChange={(e) => setSubtaskTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addOrUpdateSubtask();
                        }
                      }}
                      placeholder="Subtask name"
                      className="h-[34px] min-w-0 rounded-[5px] border border-[#E5E5E5] bg-white px-2.5 text-[10px] outline-none focus:border-[#BBB]"
                    />

                    <select
                      value={subtaskPriority}
                      onChange={(e) => setSubtaskPriority(e.target.value)}
                      className="h-[34px] rounded-[5px] border border-[#E5E5E5] bg-white px-2 text-[10px] outline-none"
                    >
                      {priorityOptions
                        .filter((item) => item !== "No Priority")
                        .map((priority) => (
                          <option key={priority} value={priority}>
                            {priority}
                          </option>
                        ))}
                    </select>

                    <select
                      value={subtaskMember}
                      onChange={(e) => setSubtaskMember(e.target.value)}
                      className="h-[34px] rounded-[5px] border border-[#E5E5E5] bg-white px-2 text-[10px] outline-none"
                    >
                      <option value="">Member</option>

                      {members.map((member) => {
                        const id = getId(member);

                        return (
                          <option key={id} value={id}>
                            {getMemberName(member)}
                          </option>
                        );
                      })}
                    </select>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={openSubtaskStartDatePicker}
                        className="flex h-[34px] w-full items-center gap-1.5 rounded-[5px] border border-[#E5E5E5] bg-white px-2 text-left text-[10px] text-[#555]"
                      >
                        <RiCalendarLine size={12} />
                        {subtaskStartDate
                          ? formatShortDate(subtaskStartDate)
                          : "Start date"}
                      </button>
                      <input
                        ref={subtaskStartDateRef}
                        type="date"
                        value={subtaskStartDate}
                        onChange={(e) => setSubtaskStartDate(e.target.value)}
                        className="pointer-events-none absolute h-0 w-0 opacity-0"
                        tabIndex={-1}
                      />
                    </div>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={openSubtaskDueDatePicker}
                        className="flex h-[34px] w-full items-center gap-1.5 rounded-[5px] border border-[#E5E5E5] bg-white px-2 text-left text-[10px] text-[#555]"
                      >
                        <RiCalendarLine size={12} />
                        {subtaskDueDate
                          ? formatShortDate(subtaskDueDate)
                          : "End date"}
                      </button>
                      <input
                        ref={subtaskDueDateRef}
                        type="date"
                        value={subtaskDueDate}
                        onChange={(e) => setSubtaskDueDate(e.target.value)}
                        className="pointer-events-none absolute h-0 w-0 opacity-0"
                        tabIndex={-1}
                      />
                    </div>

                    <button
                      type="button"
                      disabled={isCreatingSubtask || isUpdatingSubtask}
                      onClick={addOrUpdateSubtask}
                      className="h-[34px] rounded-[5px] bg-black px-3 text-[9px] font-medium text-white hover:bg-[#222]"
                    >
                      {editingSubtaskId ? "Update" : "Add"}
                    </button>
                  </div>

                  {editingSubtaskId && (
                    <button
                      type="button"
                      onClick={resetSubtaskForm}
                      className="mt-2 text-[9px] text-[#999] hover:text-black"
                    >
                      Cancel editing
                    </button>
                  )}
                </div>
              )}

              <div className="mt-3 overflow-hidden rounded-[7px] border border-[#E5E5E5] bg-white">
                <div className="hidden grid-cols-[minmax(0,1fr)_100px_150px_120px_60px] bg-[#FAFAFA] px-3 py-2.5 text-[9px] font-semibold text-[#555] md:grid">
                  <span>Task</span>
                  <span>Priority</span>
                  <span>Members</span>
                  <span>Due Date</span>
                  <span className="text-right">Actions</span>
                </div>

                {currentSubtasks.length === 0 ? (
                  <div className="px-4 py-7 text-center">
                    <p className="text-[10px] font-medium text-[#777]">
                      No subtasks yet
                    </p>

                    <p className="mt-1 text-[9px] text-[#AAA]">
                      Add a subtask to break this work down.
                    </p>
                  </div>
                ) : (
                  currentSubtasks.map((subtask) => (
                    <div
                      key={subtask._id || subtask.id}
                      className="border-t border-[#EEEEEE] px-3 py-2.5 first:border-t-0"
                    >
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,1fr)_100px_150px_120px_60px] md:items-center">
                        <div className="flex min-w-0 items-center gap-2">
                          <button
                            type="button"
                            title={
                              subtask.completed
                                ? "Mark incomplete"
                                : "Mark complete"
                            }
                            onClick={() => toggleSubtask(subtask)}
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border ${
                              subtask.completed
                                ? "border-black bg-black text-white"
                                : "border-[#CCC] bg-white"
                            }`}
                          >
                            {subtask.completed && <RiCheckLine size={11} />}
                          </button>

                          <span
                            className={`min-w-0 break-words text-[10px] font-medium ${
                              subtask.completed
                                ? "text-[#999] line-through"
                                : "text-[#333]"
                            }`}
                          >
                            {subtask.title}
                          </span>
                        </div>

                        <div>
                          <PriorityDisplay priority={subtask.priority} />
                        </div>

                        <div className="flex min-w-0 items-center gap-1.5">
                          {(() => {
                            const subtaskMemberUser = getSubtaskMemberUser(
                              subtask.member,
                            );

                            if (!subtaskMemberUser) {
                              return (
                                <span className="text-[9px] text-[#999]">
                                  -
                                </span>
                              );
                            }

                            return (
                              <>
                                <Avatar
                                  member={subtaskMemberUser}
                                  size="23px"
                                />

                                <span className="truncate text-[9px] text-[#555]">
                                  {getMemberName(subtaskMemberUser)}
                                </span>
                              </>
                            );
                          })()}
                        </div>

                        <div className="flex items-center gap-1.5 text-[12px] text-[#666]">
                          {subtask.dueDate ? (
                            <>
                              <RiCalendarLine size={12} />
                              {formatShortDate(subtask.dueDate)}
                            </>
                          ) : (
                            "-"
                          )}
                        </div>

                        <div className="relative flex justify-end">
                          <button
                            type="button"
                            title="Actions"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSubtaskActionMenu((current) => {
                                const subtaskId = subtask._id || subtask.id;
                                return current === subtaskId ? null : subtaskId;
                              });
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded-[5px] text-[#777] hover:bg-[#F5F5F5]"
                          >
                            <RiMoreLine size={15} />
                          </button>

                          {subtaskActionMenu ===
                            (subtask._id || subtask.id) && (
                            <div className="absolute right-0 top-8 z-[120] w-[110px] rounded-[7px] border border-[#E5E5E5] bg-white p-1 shadow-lg">
                              <button
                                type="button"
                                onClick={() => editSubtask(subtask)}
                                className="flex h-7 w-full items-center gap-2 rounded-[5px] px-2 text-left text-[9px] text-[#333] hover:bg-[#F5F5F5]"
                              >
                                <RiPencilLine size={12} />
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSubtaskActionMenu(null);
                                  deleteSubtask(subtask._id || subtask.id);
                                }}
                                className="flex h-7 w-full items-center gap-2 rounded-[5px] px-2 text-left text-[9px] text-[#D92D20] hover:bg-[#FFF5F5]"
                              >
                                <RiDeleteBinLine size={12} />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <button
                  type="button"
                  onClick={() => {
                    setEditingSubtaskId(null);
                    setSubtaskTitle("");
                    setSubtaskPriority("Low");
                    setSubtaskMember("");
                    setSubtaskStartDate("");
                    setSubtaskDueDate("");
                    setSubtaskActionMenu(null);
                    setShowSubtaskForm(true);
                  }}
                  className="flex w-full items-center gap-1 border-t border-[#E7E7E7] px-3 py-2.5 text-left text-[10px] text-[#777] hover:bg-[#FAFAFA] sm:px-4"
                >
                  <RiAddLine size={12} />
                  Add Subtask
                </button>
              </div>
            </div>

            <div className="mt-7 border-t border-[#EEEEEE] pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[12px] font-semibold text-[#333]">
                    Comments
                  </h2>

                  <p className="mt-0.5 text-[9px] text-[#999]">
                    Discuss this task with your team.
                  </p>
                </div>
              </div>

              <div className="mt-3 mb-2 text-[10px] font-medium text-[#777]">
                Leave a reply...
              </div>

              <div className="rounded-[7px] border border-[#E5E5E5] bg-white">
                {replyingTo && (
                  <div className="flex items-center justify-between border-b border-[#EEEEEE] bg-[#FAFAFA] px-3 py-2">
                    <span className="text-[9px] text-[#777]">
                      Replying to comment
                    </span>

                    <button
                      type="button"
                      onClick={() => setReplyingTo(null)}
                      className="text-[9px] text-[#999] hover:text-black"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                <textarea
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      addComment();
                    }
                  }}
                  placeholder={
                    replyingTo ? "Write a reply..." : "Add a comment..."
                  }
                  rows={3}
                  className="w-full resize-none overscroll-contain px-3 py-2.5 text-[10px] outline-none"
                  style={{ WebkitOverflowScrolling: "touch" }}
                />

                <div className="flex items-center justify-between border-t border-[#EEEEEE] px-2 py-2">
                  <button
                    type="button"
                    title="Attach file"
                    onClick={() =>
                      toast.info(
                        "Attachment picker can be connected to your storage API!!",
                      )
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-[5px] text-[#888] hover:bg-[#F5F5F5]"
                  >
                    <RiAttachment2 size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={addComment}
                    className="flex h-7 items-center gap-1.5 rounded-[5px] bg-black px-3 text-[9px] font-medium text-white hover:bg-[#222]"
                  >
                    {replyingTo ? "Reply" : "Send"}

                    <RiSendPlaneLine size={12} />
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {currentComments.length === 0 ? (
                  <div className="rounded-[7px] border border-dashed border-[#E0E0E0] px-4 py-6 text-center">
                    <p className="text-[10px] text-[#999]">No comments yet.</p>
                  </div>
                ) : (
                  currentComments.map((comment) => (
                    <div
                      key={comment._id || comment.id}
                      className="rounded-[7px] border border-[#E7E7E7] p-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <Avatar
                          member={
                            (typeof comment.user === "object"
                              ? comment.user
                              : getUserById(comment.user)) || storedUser
                          }
                          size="28px"
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-semibold text-[#333]">
                              {getMemberName(
                                (typeof comment.user === "object"
                                  ? comment.user
                                  : getUserById(comment.user)) || storedUser,
                              )}
                            </span>

                            <span className="text-[8px] text-[#AAA]">
                              just now
                            </span>
                          </div>

                          <p className="mt-1 break-words text-[10px] leading-5 text-[#555]">
                            {comment.message}
                          </p>

                          <div className="mt-2 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                deleteComment(comment._id || comment.id)
                              }
                              className="rounded-[4px] px-1.5 py-1 text-[9px] text-[#999] hover:bg-[#FFF5F5] hover:text-[#D92D20]"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <aside className="hidden w-[280px] shrink-0 lg:block">
            <div className="sticky top-[78px] rounded-[8px] border border-[#E5E5E5] bg-white">
              <div className="flex items-center justify-between border-b border-[#EEEEEE] px-3 py-3">
                <span className="text-[11px] font-semibold text-[#333]">
                  Details
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    title="Add property"
                    onClick={() =>
                      toast.info("All available properties are shown.")
                    }
                    className="flex h-6 w-6 items-center justify-center rounded-[4px] text-[#777] hover:bg-[#F5F5F5]"
                  >
                    <RiAddLine size={13} />
                  </button>

                  <button
                    type="button"
                    title="Settings"
                    onClick={() => toast.info("Property settings.")}
                    className="flex h-6 w-6 items-center justify-center rounded-[4px] text-[#777] hover:bg-[#F5F5F5]"
                  >
                    <RiSettings3Line size={13} />
                  </button>
                </div>
              </div>

              <div className="flex min-h-[47px] items-center justify-between border-b border-[#F0F0F0] px-3">
                <span className="text-[10px] text-[#888]">Status</span>

                <PropertyDropdown property="status">
                  <span className="flex items-center gap-1.5 text-[10px] text-[#555]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />

                    {selectedTask.status || "Backlog"}
                  </span>
                </PropertyDropdown>
              </div>

              <div className="flex min-h-[47px] items-center justify-between border-b border-[#F0F0F0] px-3">
                <span className="text-[10px] text-[#888]">Priority</span>

                <PropertyDropdown property="priority">
                  <PriorityDisplay priority={selectedTask.priority} />
                </PropertyDropdown>
              </div>

              <div className="flex min-h-[47px] items-center justify-between border-b border-[#F0F0F0] px-3">
                <span className="text-[10px] text-[#888]">Members</span>

                <PropertyDropdown property="member">
                  <div className="flex items-center">
                    {Array.isArray(selectedTask.members) &&
                    selectedTask.members.length > 0 ? (
                      selectedTask.members.slice(0, 4).map((member, index) => (
                        <div
                          key={`${getId(member)}-${index}`}
                          className="-ml-1 first:ml-0"
                        >
                          <Avatar member={member} size="25px" />
                        </div>
                      ))
                    ) : (
                      <span className="text-[9px] text-[#999]">
                        Add members
                      </span>
                    )}
                  </div>
                </PropertyDropdown>
              </div>

              <div className="border-b border-[#F0F0F0] px-3 py-2.5">
                <span className="mb-2 block text-[10px] text-[#888]">
                  Dates
                </span>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-[#999]">Start</span>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={openDetailStartDatePicker}
                        className="flex items-center gap-1.5 rounded-[5px] px-2 py-1.5 text-[9px] text-[#555] hover:bg-[#F5F5F5]"
                      >
                        <RiCalendarLine size={12} />
                        {detailStartDate
                          ? formatShortDate(detailStartDate)
                          : "Set date"}
                      </button>
                      <input
                        ref={detailStartDateRef}
                        type="date"
                        value={detailStartDate}
                        onChange={(e) => changeDetailStartDate(e.target.value)}
                        className="pointer-events-none absolute h-0 w-0 opacity-0"
                        tabIndex={-1}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-[#999]">End</span>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={openDetailEndDatePicker}
                        className="flex items-center gap-1.5 rounded-[5px] px-2 py-1.5 text-[9px] text-[#555] hover:bg-[#F5F5F5]"
                      >
                        <RiCalendarLine size={12} />
                        {detailEndDate
                          ? formatShortDate(detailEndDate)
                          : "Set date"}
                      </button>
                      <input
                        ref={detailEndDateRef}
                        type="date"
                        value={detailEndDate}
                        onChange={(e) => changeDetailEndDate(e.target.value)}
                        className="pointer-events-none absolute h-0 w-0 opacity-0"
                        tabIndex={-1}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b border-[#F0F0F0] px-3 py-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] text-[#888]">Labels</span>

                  <button
                    type="button"
                    title="Edit labels"
                    onClick={() => handleEditTask(selectedTask)}
                    className="flex h-6 w-6 items-center justify-center rounded-[4px] text-[#999] hover:bg-[#F5F5F5]"
                  >
                    <RiPencilLine size={12} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-1">
                  {labels.length > 0 ? (
                    labels.map((label, index) => (
                      <span
                        key={`${label}-${index}`}
                        className="rounded-[4px] bg-[#F2F2F2] px-1.5 py-1 text-[8px] text-[#555]"
                      >
                        {label}
                      </span>
                    ))
                  ) : (
                    <span className="text-[9px] text-[#AAA]">No labels</span>
                  )}
                </div>
              </div>

              <div className="flex min-h-[47px] items-center justify-between px-3">
                <span className="text-[10px] text-[#888]">Reporter</span>

                <div className="flex min-w-0 items-center gap-1.5">
                  {createdBy && <Avatar member={createdBy} size="22px" />}

                  <span className="max-w-[100px] truncate text-[9px] text-[#555]">
                    {createdBy ? getMemberName(createdBy) : "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-[8px] border border-[#E5E5E5] bg-white">
              <div className="flex items-center gap-2 border-b border-[#EEEEEE] px-3 py-2.5">
                <RiArrowDownSLine size={13} className="text-[#777]" />

                <span className="text-[10px] font-semibold text-[#555]">
                  Updates
                </span>
              </div>

              <div className="px-3 py-2">
                {(taskUpdates[String(selectedTaskId)] || []).length === 0 ? (
                  <p className="py-2 text-[9px] text-[#AAA]">No updates yet.</p>
                ) : (
                  <div className="space-y-3">
                    {(taskUpdates[String(selectedTaskId)] || [])
                      .slice()
                      .reverse()
                      .map((update) => (
                        <div key={update.id} className="flex items-start gap-2">
                          <Avatar
                            member={getUserById(update.author) || storedUser}
                            size="22px"
                          />

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-semibold text-[#444]">
                                {getMemberName(
                                  getUserById(update.author) || storedUser,
                                )}
                              </span>

                              <span className="text-[8px] text-[#AAA]">
                                just now
                              </span>
                            </div>

                            <p className="mt-0.5 truncate text-[9px] text-[#777]">
                              {update.message}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar />

        <main className="flex min-h-screen min-w-0 flex-1 items-center justify-center px-4 pt-[56px] md:ml-[256px] md:pt-0">
          <span className="text-[12px] text-[#777]">Loading tasks...</span>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar />

        <main className="flex min-h-screen min-w-0 flex-1 items-center justify-center px-4 pt-[56px] md:ml-[256px] md:pt-0">
          <span className="text-[12px] text-red-500">Error loading tasks.</span>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Sidebar />

      <main className="min-w-0 pt-[56px] md:ml-[244px] md:pt-0">
        <header className="relative -top-2 flex h-[64px] w-full items-center border-b border-[#E5E5E5] bg-white px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-[30px] w-[30px] items-center justify-center   border-[#E5E5E5] bg-white text-[#222]">
              <RiLayoutLeftLine size={17} />
            </div>

            <span className="text-[13px] font-normal text-[#222]"></span>
          </div>
        </header>

        <div className="w-full px-3 pt-0 pb-4 sm:px-5 sm:pt-1 sm:pb-5 md:px-7 lg:px-10 lg:pt-2 lg:pb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[16px] font-medium text-black">Tasks</h1>

              <p className=" text-[10px] text-[#999]">
                Manage and organize your tasks
              </p>
            </div>

            <div className=" flex w-full flex-wrap items-center justify-end gap-2">
              {searchOpen ? (
                <div className="relative min-w-0 flex-1 sm:flex-none">
                  <RiSearchLine
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]"
                  />

                  <input
                    autoFocus
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search tasks..."
                    className="h-[34px] w-full rounded-[6px] border border-[#E5E5E5] bg-white pl-9 pr-8 text-[10px] outline-none focus:border-[#BBB] sm:w-[205px]"
                  />

                  <button
                    type="button"
                    title="Close search"
                    onClick={() => {
                      setSearch("");
                      setSearchOpen(false);
                    }}
                    className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center text-[#999] hover:text-black"
                  >
                    <RiCloseLine size={15} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  title="Search"
                  onClick={() => setSearchOpen(true)}
                  className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[6px] border border-[#E5E5E5] bg-white text-[#555] hover:bg-[#F5F5F5]"
                >
                  <RiSearchLine size={15} />
                </button>
              )}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowFields(!showFields);
                    setShowFilter(false);
                  }}
                  className="flex h-[34px] items-center gap-1.5 rounded-[6px] border border-[#E5E5E5] bg-white px-3 text-[10px] text-[#222] hover:bg-[#F7F7F7]"
                >
                  <span>Fields</span>

                  <RiArrowDownSLine size={13} />
                </button>

                {showFields && (
                  <div className="absolute right-0 top-[39px] z-50 w-[190px] max-w-[calc(100vw-24px)] rounded-[8px] border border-[#E5E5E5] bg-white p-2 shadow-[0_4px_18px_rgba(0,0,0,0.10)]">
                    <div className="mb-2 flex h-[30px] rounded-[5px] bg-[#F5F5F5] p-[2px]">
                      <button
                        type="button"
                        onClick={() => setViewMode("list")}
                        className={`flex flex-1 items-center justify-center gap-1 rounded-[4px] text-[9px] font-medium ${
                          viewMode === "list"
                            ? "bg-white text-[#222] shadow-sm"
                            : "text-[#777]"
                        }`}
                      >
                        <RiListCheck size={12} />
                        List
                      </button>

                      <button
                        type="button"
                        onClick={() => setViewMode("board")}
                        className={`flex flex-1 items-center justify-center gap-1 rounded-[4px] text-[9px] font-medium ${
                          viewMode === "board"
                            ? "bg-white text-[#222] shadow-sm"
                            : "text-[#777]"
                        }`}
                      >
                        <RiLayoutGridLine size={12} />
                        Board
                      </button>
                    </div>

                    <div className="mb-1 border-t border-[#EEEEEE]" />

                    {[
                      ["status", "Status"],
                      ["priority", "Priority"],
                      ["members", "Members"],
                      ["dueDate", "Due Date"],
                      ["labels", "Labels"],
                      ["reporter", "Reporter"],
                    ].map(([key, label]) => (
                      <button
                        type="button"
                        key={key}
                        onClick={() =>
                          setVisibleFields((previous) => ({
                            ...previous,
                            [key]: !previous[key],
                          }))
                        }
                        className="flex h-[30px] w-full items-center justify-between rounded-[4px] px-2 text-[9px] text-[#333] hover:bg-[#F5F5F5]"
                      >
                        <span>{label}</span>

                        {visibleFields[key] && (
                          <span className="flex h-[14px] w-[14px] items-center justify-center rounded-[3px] bg-[#222] text-white">
                            <RiCheckLine size={10} />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowFilter(!showFilter);
                    setShowFields(false);
                  }}
                  className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[6px] border border-[#E5E5E5] ${
                    priorityFilter !== "All" || memberFilter !== "All"
                      ? "bg-[#F3F3F3]"
                      : "bg-white"
                  }`}
                  title="Filter"
                >
                  <RiFilter3Line size={15} />
                </button>

                {showFilter && (
                  <div className="absolute right-0 top-[39px] z-40 w-[210px] max-w-[calc(100vw-24px)] rounded-[8px] border border-[#E5E5E5] bg-white p-3 shadow-lg">
                    <p className="mb-2 text-[10px] font-medium text-[#555]">
                      Filter tasks
                    </p>

                    <label className="mb-1 block text-[9px] text-[#888]">
                      Priority
                    </label>

                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="mb-2.5 h-[32px] w-full rounded-[5px] border border-[#E5E5E5] bg-white px-2 text-[10px] outline-none"
                    >
                      <option value="All">All Priority</option>

                      {priorityOptions.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>

                    <label className="mb-1 block text-[9px] text-[#888]">
                      Members
                    </label>

                    <select
                      value={memberFilter}
                      onChange={(e) => setMemberFilter(e.target.value)}
                      className="h-[32px] w-full rounded-[5px] border border-[#E5E5E5] bg-white px-2 text-[10px] outline-none"
                    >
                      <option value="All">All Members</option>

                      {members.map((member) => {
                        const id = getId(member);

                        return (
                          <option key={id} value={id}>
                            {getMemberName(member)}
                          </option>
                        );
                      })}
                    </select>

                    <button
                      type="button"
                      onClick={() => {
                        setPriorityFilter("All");
                        setMemberFilter("All");
                      }}
                      className="mt-2.5 text-[10px] text-[#777] hover:text-black"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleAddTask("To Do")}
                className="flex h-[34px] shrink-0 items-center gap-1.5 rounded-[6px] bg-black px-3 text-[11px] text-white hover:bg-[#222]"
              >
                <RiAddLine size={10} />

                <span>Add Task</span>
              </button>
            </div>
          </div>

          {viewMode === "board" ? (
            <div className="mt-5 grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
              {groupedTasks.map(({ status, tasks: statusTasks }) => (
                <div
                  key={status}
                  className="min-w-0 rounded-[8px] bg-[#F7F7F7] p-4"
                >
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <div className="flex min-w-0 items-center">
                      <span className="truncate text-[11px] font-semibold text-black">
                        {status}
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {status !== "Completed" && (
                        <button
                          type="button"
                          title="Add task"
                          onClick={() => handleAddTask(status)}
                          className="flex h-7 w-7 items-center justify-center rounded-[5px] text-[#777] hover:bg-white hover:text-[#222]"
                        >
                          <RiAddLine size={14} />
                        </button>
                      )}

                      <button
                        type="button"
                        title="Column actions"
                        onClick={() =>
                          setOpenMenu(
                            openMenu === `column-${status}`
                              ? null
                              : `column-${status}`,
                          )
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-[5px] text-[#777] hover:bg-white hover:text-[#222]"
                      >
                        <RiMoreLine size={15} />
                      </button>
                    </div>
                  </div>

                  {openMenu === `column-${status}` && (
                    <div className="relative">
                      <div className="absolute right-2 top-0 z-40 w-[130px] rounded-[7px] border border-[#E5E5E5] bg-white p-1 shadow-lg">
                        {status !== "Completed" && (
                          <button
                            type="button"
                            onClick={() => {
                              handleAddTask(status);
                              setOpenMenu(null);
                            }}
                            className="flex h-7 w-full items-center gap-2 rounded-[5px] px-2 text-left text-[10px] text-[#555] hover:bg-[#F5F5F5]"
                          >
                            <RiAddLine size={13} />
                            Add Task
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenu(null);

                            toast.info(`${status} column`);
                          }}
                          className="flex h-7 w-full items-center gap-2 rounded-[5px] px-2 text-left text-[10px] text-[#555] hover:bg-[#F5F5F5]"
                        >
                          <RiSettings3Line size={13} />
                          Settings
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    {statusTasks.map((task) => (
                      <BoardCard key={task._id || task.id} task={task} />
                    ))}
                  </div>
                </div>
              ))}

              {groupedTasks.length === 0 && (
                <div className="col-span-full rounded-[8px] border border-[#E5E5E5] px-5 py-8 text-center">
                  <p className="text-[11px] font-medium text-[#555]">
                    No tasks found
                  </p>

                  <p className="mt-0.5 text-[10px] text-[#999]">
                    Create a task to get started.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {groupedTasks.map(({ status, tasks: statusTasks }) => (
                <section key={status} className="min-w-0">
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <RiArrowDownSLine
                      size={14}
                      className="shrink-0 text-[#777]"
                    />

                    <span className="text-[10px] font-normal text-black">
                      {status}
                    </span>
                  </div>

                  <div className="overflow-visible rounded-[7px] border border-[#E5E5E5]">
                    <div className="hidden items-center bg-[#FAFAFA] px-3 py-2.5 text-[10px] font-semibold text-black md:flex md:px-4">
                      <span className="min-w-0 flex-1">Task</span>

                      {visibleFields.status && (
                        <span className="w-[100px] shrink-0">Status</span>
                      )}

                      {visibleFields.priority && (
                        <span className="w-[110px] shrink-0">Priority</span>
                      )}

                      {visibleFields.members && (
                        <span className="w-[140px] shrink-0">Members</span>
                      )}

                      {visibleFields.dueDate && (
                        <span className="w-[130px] shrink-0">Due Date</span>
                      )}

                      {visibleFields.labels && (
                        <span className="w-[130px] shrink-0">Labels</span>
                      )}

                      {visibleFields.reporter && (
                        <span className="w-[130px] shrink-0">Reporter</span>
                      )}

                      <span className="w-[60px] shrink-0 pr-1 text-right">
                        Actions
                      </span>
                    </div>

                    {statusTasks.map((task, index) => (
                      <TaskRow
                        key={`desktop-${task._id || task.id}`}
                        task={task}
                        openUp={index >= statusTasks.length - 2}
                      />
                    ))}

                    {statusTasks.map((task, index) => (
                      <MobileTaskCard
                        key={`mobile-${task._id || task.id}`}
                        task={task}
                        openUp={index >= statusTasks.length - 2}
                      />
                    ))}

                    {status !== "Completed" && (
                      <button
                        type="button"
                        onClick={() => handleAddTask(status)}
                        className="flex w-full items-center gap-1 border-t border-[#E7E7E7] px-3 py-2.5 text-left text-[10px] text-[#777] hover:bg-[#FAFAFA] sm:px-4"
                      >
                        <RiAddLine size={12} />
                        Add Task
                      </button>
                    )}
                  </div>
                </section>
              ))}

              {groupedTasks.length === 0 && (
                <div className="rounded-[8px] border border-[#E5E5E5] px-5 py-8 text-center">
                  <p className="text-[11px] font-medium text-[#555]">
                    No tasks found
                  </p>

                  <p className="mt-0.5 text-[10px] text-[#999]">
                    Create a task to get started.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {selectedTask && TaskDetails()}

      {showModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/25 px-3 py-3 sm:px-4">
          <div className="flex max-h-[94vh] w-full max-w-[540px] flex-col overflow-hidden rounded-[9px] bg-white shadow-xl">
            <div className="relative flex shrink-0 items-center justify-between border-b border-[#E5E5E5] bg-white px-4 py-3 sm:px-5">
              <h2 className="absolute left-1/2 -translate-x-1/2 text-[16px] font-semibold text-black">
                {editingTask ? "Edit task" : "Create task"}
              </h2>

              <button
                type="button"
                title="Close"
                onClick={handleCloseModal}
                className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-[#F5F5F5]"
              >
                <RiCloseLine size={17} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="min-h-0 space-y-3 overflow-y-auto px-4 py-4 sm:px-5"
            >
              <div>
                <label className="mb-1 block text-[10px] font-medium text-[#555]">
                  Title <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter task title"
                  className="h-[38px] w-full rounded-[6px] border border-[#E5E5E5] px-3 text-[11px] outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-medium text-[#555]">
                  Status <span className="text-red-500">*</span>
                </label>

                <select
                  required
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="h-[38px] w-full rounded-[6px] border border-[#E5E5E5] bg-white px-3 text-[11px] outline-none focus:border-black"
                >
                  <option value="">Select status</option>

                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-medium text-[#555]">
                  Due Date <span className="text-red-500">*</span>
                </label>

                <div
                  onClick={openDatePicker}
                  className="relative flex h-[38px] w-full cursor-pointer items-center rounded-[6px] border border-[#E5E5E5] bg-white px-3 text-[11px] outline-none hover:border-[#BBB]"
                >
                  <span
                    className={formData.dueDate ? "text-[#222]" : "text-[#999]"}
                  >
                    {formData.dueDate
                      ? formatDate(formData.dueDate)
                      : "Select due date"}
                  </span>

                  <input
                    ref={dateInputRef}
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="pointer-events-none absolute h-0 w-0 opacity-0"
                    tabIndex={-1}
                  />

                  <RiCalendarLine size={15} className="ml-auto text-[#777]" />
                </div>
              </div>

              {viewMode === "list" && (
                <div>
                  <label className="mb-1 block text-[10px] font-medium text-[#555]">
                    Priority <span className="text-red-500">*</span>
                  </label>

                  <select
                    required
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="h-[38px] w-full rounded-[6px] border border-[#E5E5E5] bg-white px-3 text-[11px] outline-none focus:border-black"
                  >
                    <option value="">Select priority</option>

                    {priorityOptions.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {viewMode === "board" && (
                <div>
                  <label className="mb-1 block text-[10px] font-medium text-[#555]">
                    Labels <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    value={labelsInput}
                    onChange={handleLabelChange}
                    placeholder="e.g. Bug, Frontend, Urgent"
                    className="h-[38px] w-full rounded-[6px] border border-[#E5E5E5] px-3 text-[11px] outline-none"
                  />

                  <p className="mt-1 text-[9px] text-[#999]">
                    Add multiple labels separated by commas.
                  </p>

                  {labelsInput.trim() && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {labelsInput
                        .split(",")
                        .map((label) => label.trim())
                        .filter(Boolean)
                        .map((label, index) => (
                          <span
                            key={`${label}-${index}`}
                            className="rounded-[4px] bg-[#F2F2F2] px-1.5 py-0.5 text-[9px] font-medium text-[#555]"
                          >
                            {label}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="mb-1 block text-[10px] font-medium text-[#555]">
                  Members <span className="text-red-500">*</span>
                </label>

                <div className="max-h-[160px] overflow-y-auto rounded-[6px] border border-[#E5E5E5]">
                  {usersLoading ? (
                    <p className="p-3 text-[10px] text-[#999]">
                      Loading members...
                    </p>
                  ) : members.length === 0 ? (
                    <p className="p-3 text-[10px] text-[#999]">
                      No members found.
                    </p>
                  ) : (
                    members.map((member) => {
                      const id = getId(member);

                      const selected = formData.members.includes(String(id));

                      return (
                        <label
                          key={id}
                          className="flex min-h-[38px] cursor-pointer items-center gap-2 px-3 py-1.5 hover:bg-[#F7F7F7]"
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => {
                              setFormData((previous) => {
                                const current = previous.members.map(String);

                                if (current.includes(String(id))) {
                                  return {
                                    ...previous,
                                    members: current.filter(
                                      (item) => item !== String(id),
                                    ),
                                  };
                                }

                                return {
                                  ...previous,
                                  members: [...current, String(id)],
                                };
                              });
                            }}
                            className="h-3.5 w-3.5 shrink-0"
                          />

                          <Avatar member={member} size="25px" />

                          <span className="min-w-0 truncate text-[10px] font-medium text-[#333]">
                            {getMemberName(member)}

                            {String(id) === String(currentUserId) && (
                              <span className="ml-1 text-[9px] text-[#999]">
                                (You)
                              </span>
                            )}
                          </span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-medium text-[#555]">
                  Created By <span className="text-red-500">*</span>
                </label>

                <select
                  required
                  name="createdBy"
                  value={formData.createdBy}
                  onChange={handleChange}
                  className="h-[38px] w-full rounded-[6px] border border-[#E5E5E5] bg-white px-3 text-[11px] outline-none focus:border-black"
                >
                  <option value="">Select created by</option>

                  {members.map((member) => {
                    const id = getId(member);

                    return (
                      <option key={id} value={id}>
                        {getMemberName(member)}
                      </option>
                    );
                  })}
                </select>

                {formData.createdBy && (
                  <div className="mt-2 flex items-center gap-2">
                    <Avatar
                      member={getUserById(formData.createdBy)}
                      size="25px"
                    />

                    <span className="text-[10px] text-[#555]">
                      {getMemberName(getUserById(formData.createdBy))}
                    </span>
                  </div>
                )}
              </div>

              <div className="rounded-[6px] bg-[#F7F7F7] px-3 py-2.5">
                <p className="text-[9px] text-[#888]">Project</p>

                <p className="mt-0.5 truncate text-[10px] font-semibold text-[#333]">
                  {projectsLoading
                    ? "Loading project..."
                    : projects.length > 0
                      ? getProjectName(projects[0])
                      : "No project found"}
                </p>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-[#E5E5E5] pt-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="h-[36px] rounded-[6px] border border-[#E5E5E5] px-4 text-[10px] text-[#555] hover:bg-[#F7F7F7]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="h-[36px] rounded-[6px] bg-black px-5 text-[10px] text-white disabled:opacity-50"
                >
                  {isCreating || isUpdating
                    ? "Saving..."
                    : editingTask
                      ? "Update task"
                      : "Create task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/25 px-3 sm:px-4">
          <div className="w-full max-w-[360px] rounded-[10px] border border-[#E5E5E5] bg-white p-4 shadow-xl sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF1F1] text-[#D92D20]">
                <RiDeleteBinLine size={17} />
              </div>

              <div className="min-w-0">
                <h3 className="text-[13px] font-semibold text-black">
                  Delete task?
                </h3>

                <p className="mt-1 break-words text-[10px] leading-5 text-[#777]">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-[#333]">
                    {deletingTask?.title || "this task"}
                  </span>
                  ?
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="h-[34px] rounded-[6px] border border-[#E5E5E5] px-4 text-[10px] font-medium text-[#555] hover:bg-[#F5F5F5]"
              >
                No
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="h-[34px] rounded-[6px] bg-[#D92D20] px-4 text-[10px] font-medium text-white hover:bg-[#B42318] disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
