import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { RiPencilLine } from "@remixicon/react";
import ProfileSidebar from "../../components/profile/ProfileSidebar";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useUpdateThemeMutation,
} from "../../redux/slices/userSlice";
import {
  useGetWorkspacesQuery,
  useLeaveWorkspaceMutation,
} from "../../redux/slices/workspaceSlice";

const COLOR_OPTIONS = {
  Amber: "#F59E0B",
  Blue: "#3B82F6",
  Pink: "#EC4899",
  Rose: "#F43F5E",
  Emerald: "#10B981",
  Black: "#222222",
};

const Profile = () => {
  const { data, isLoading, error } = useGetUsersQuery();

  const [updateUser] = useUpdateUserMutation();

  const [updateTheme, { isLoading: isUpdatingTheme }] =
    useUpdateThemeMutation();

  const {
    data: workspaceData,
    isLoading: isWorkspaceLoading,
    refetch: refetchWorkspaces,
  } = useGetWorkspacesQuery();

  const [leaveWorkspace, { isLoading: isLeavingWorkspace }] =
    useLeaveWorkspaceMutation();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    title: "",
    username: "",
    avatar: "",
  });

  const [theme, setTheme] = useState("light");
  const [color, setColor] = useState("Blue");
  const [editingField, setEditingField] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);

  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const userId =
    storedUser?._id ||
    storedUser?.id ||
    storedUser?.userId ||
    storedUser?.data?._id ||
    storedUser?.data?.id ||
    localStorage.getItem("userId") ||
    null;

  const isGuestUser =
    storedUser?.authProvider === "guest" ||
    storedUser?.data?.authProvider === "guest" ||
    localStorage.getItem("guestUser") === "true";

  const isDark = theme === "dark";

  const colors = {
    background: isDark ? "#181818" : "#FFFFFF",
    card: isDark ? "#181818" : "#FFFFFF",
    text: isDark ? "#F5F5F5" : "#171717",
    secondary: isDark ? "#A0A0A0" : "#8A8A8A",
    border: isDark ? "#2D2D2D" : "#E5E5E5",
    input: isDark ? "#242424" : "#F1F1F1",
    editingInput: isDark ? "#242424" : "#F5F5F5",
  };

  const accentColor = COLOR_OPTIONS[color] || COLOR_OPTIONS.Blue;

  useEffect(() => {
    if (!userId) {
      return;
    }

    let users = [];

    if (Array.isArray(data)) {
      users = data;
    } else if (Array.isArray(data?.data)) {
      users = data.data;
    } else if (Array.isArray(data?.data?.data)) {
      users = data.data.data;
    }

    let foundUser = users.find(
      (user) =>
        String(user?._id) === String(userId) ||
        String(user?.id) === String(userId),
    );

    if (!foundUser && storedUser) {
      foundUser = storedUser?.data || storedUser;
    }

    if (!foundUser) {
      return;
    }

    setCurrentUser(foundUser);

    setFormData({
      email: foundUser.email || "",
      name: foundUser.name || "",
      title: foundUser.title || "",
      username: foundUser.username || "",
      avatar: foundUser.avatar || "",
    });

    setTheme(foundUser.theme || "light");
    setColor(foundUser.color || "Blue");
  }, [data, userId, storedUser]);

  useEffect(() => {
    if (isGuestUser || !userId) {
      setCurrentWorkspace(null);
      return;
    }

    let workspaces = [];

    if (Array.isArray(workspaceData)) {
      workspaces = workspaceData;
    } else if (Array.isArray(workspaceData?.data)) {
      workspaces = workspaceData.data;
    } else if (Array.isArray(workspaceData?.data?.data)) {
      workspaces = workspaceData.data.data;
    }

    if (!workspaces.length) {
      setCurrentWorkspace(null);
      return;
    }

    const loggedInUserId = String(userId).trim();

    let foundWorkspace = null;

    for (const workspace of workspaces) {
      if (!workspace) {
        continue;
      }

      const workspaceId =
        workspace?._id || workspace?.id || workspace?.workspaceId;

      let ownerId = null;

      if (workspace.owner && typeof workspace.owner === "object") {
        ownerId = workspace.owner._id || workspace.owner.id;
      } else {
        ownerId = workspace.owner;
      }

      const ownerIdString = ownerId ? String(ownerId).trim() : "";

      const ownerMatch = ownerIdString === loggedInUserId;

      let memberMatch = false;

      if (Array.isArray(workspace.members)) {
        memberMatch = workspace.members.some((member) => {
          let memberId = null;

          if (member && typeof member === "object") {
            memberId = member._id || member.id;
          } else {
            memberId = member;
          }

          return memberId && String(memberId).trim() === loggedInUserId;
        });
      }

      if (ownerMatch || memberMatch) {
        foundWorkspace = {
          ...workspace,
          __workspaceId: workspaceId ? String(workspaceId) : null,
          __ownerId: ownerIdString || null,
          __isOwner: ownerMatch,
          __isMember: memberMatch,
        };

        break;
      }
    }

    setCurrentWorkspace(foundWorkspace);
  }, [workspaceData, userId, isGuestUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleEdit = (field) => {
    setEditingField(field);
  };

  const saveField = async () => {
    if (!userId || !editingField) {
      return;
    }

    const fieldValue = formData[editingField];

    if (fieldValue === undefined || fieldValue === null) {
      setEditingField(null);
      return;
    }

    const trimmedValue =
      typeof fieldValue === "string" ? fieldValue.trim() : fieldValue;

    if (editingField === "name" && trimmedValue.length < 3) {
      toast.error("Name must contain at least 3 characters.");
      return;
    }

    if (editingField === "email") {
      if (!trimmedValue) {
        toast.error("Email cannot be empty.");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(trimmedValue)) {
        toast.error("Please enter a valid email.");
        return;
      }
    }

    if (editingField === "username" && !trimmedValue) {
      setEditingField(null);
      return;
    }

    const updateData = {
      [editingField]: trimmedValue,
    };

    try {
      const response = await updateUser({
        id: String(userId),
        ...updateData,
      }).unwrap();

      const updatedUser = response?.data;

      if (!updatedUser) {
        throw new Error("Invalid update response");
      }

      setCurrentUser(updatedUser);

      setFormData({
        email: updatedUser.email || "",
        name: updatedUser.name || "",
        title: updatedUser.title || "",
        username: updatedUser.username || "",
        avatar: updatedUser.avatar || "",
      });

      const latestStoredUser = {
        ...(storedUser || {}),
        ...updatedUser,
        id: updatedUser._id || updatedUser.id || userId,
      };

      localStorage.setItem("user", JSON.stringify(latestStoredUser));

      localStorage.setItem(
        "userId",
        String(updatedUser._id || updatedUser.id || userId),
      );

      setEditingField(null);

      toast.success("Profile updated successfully!!");
    } catch (err) {
      console.error("PROFILE UPDATE ERROR:", err);

      const message =
        err?.data?.responseMessage ||
        err?.data?.message ||
        err?.error ||
        "Failed to update profile!!";

      toast.error(message);
    }
  };

  const handleFieldBlur = async () => {
    if (editingField) {
      await saveField();
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (editingField) {
        await saveField();
      }
    }

    if (e.key === "Escape") {
      setEditingField(null);
    }
  };

  const handleThemeChange = async (newTheme) => {
    if (!userId || newTheme === theme) {
      return;
    }

    try {
      const response = await updateTheme({
        id: String(userId),
        theme: newTheme,
        color,
      }).unwrap();

      const updatedUser = response?.data || {
        ...(currentUser || {}),
        theme: newTheme,
        color,
      };

      setTheme(updatedUser.theme || newTheme);

      setColor(updatedUser.color || color);

      setCurrentUser(updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...(storedUser || {}),
          ...updatedUser,
          id: updatedUser._id || updatedUser.id || userId,
        }),
      );

      toast.success("Theme updated successfully!!");
    } catch (err) {
      console.error("THEME UPDATE ERROR:", err);

      toast.error(err?.data?.responseMessage || "Failed to update theme!!");
    }
  };

  const handleColorChange = async (newColor) => {
    if (!userId || newColor === color) {
      return;
    }

    try {
      const response = await updateTheme({
        id: String(userId),
        theme,
        color: newColor,
      }).unwrap();

      const updatedUser = response?.data || {
        ...(currentUser || {}),
        theme,
        color: newColor,
      };

      setTheme(updatedUser.theme || theme);

      setColor(updatedUser.color || newColor);

      setCurrentUser(updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...(storedUser || {}),
          ...updatedUser,
          id: updatedUser._id || updatedUser.id || userId,
        }),
      );

      toast.success("Color updated successfully!!");
    } catch (err) {
      console.error("COLOR UPDATE ERROR:", err);

      toast.error(err?.data?.responseMessage || "Failed to update color!!");
    }
  };

  const handleLeaveWorkspace = async () => {
    if (isGuestUser) {
      toast.success("You left the workspace successfully!!");
      return;
    }

    if (!userId) {
      toast.error("User ID not found!!");
      return;
    }

    if (!currentWorkspace) {
      toast.error("Workspace not found!!");
      return;
    }

    const workspaceId =
      currentWorkspace.__workspaceId ||
      currentWorkspace._id ||
      currentWorkspace.id ||
      currentWorkspace.workspaceId;

    if (!workspaceId) {
      toast.error("Workspace ID not found!!");
      return;
    }

    if (isLeavingWorkspace) {
      return;
    }

    try {
      await leaveWorkspace({
        workspaceId: String(workspaceId),
        userId: String(userId),
      }).unwrap();

      toast.success("You left the workspace successfully!!");

      setCurrentWorkspace(null);

      try {
        const latestUser = JSON.parse(localStorage.getItem("user") || "null");

        if (latestUser) {
          delete latestUser.workspace;
          delete latestUser.workspaceId;

          localStorage.setItem("user", JSON.stringify(latestUser));
        }
      } catch {}

      refetchWorkspaces();
    } catch (err) {
      console.error("LEAVE WORKSPACE ERROR:", err);

      toast.error(err?.data?.responseMessage || "Failed to leave workspace!!");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm">
        Error loading profile.
      </div>
    );
  }

  const avatarSource = formData.avatar || "";

  const avatarUrl =
    avatarSource.startsWith("http://") ||
    avatarSource.startsWith("https://") ||
    avatarSource.startsWith("data:")
      ? avatarSource
      : avatarSource
        ? `https://taskforge-2026.onrender.com/${avatarSource.replace(
            /^\/+/,
            "",
          )}`
        : "";

  const avatarLetter = formData.name?.charAt(0)?.toUpperCase() || "A";

  const canLeaveWorkspace = isGuestUser
    ? true
    : Boolean(currentWorkspace) && !isLeavingWorkspace;

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{
        backgroundColor: colors.background,
        color: colors.text,
      }}
    >
      <ProfileSidebar
        user={currentUser}
        theme={theme}
        color={color}
        onThemeChange={handleThemeChange}
        onColorChange={handleColorChange}
        isUpdatingTheme={isUpdatingTheme}
      />

      <main className="min-h-screen w-full pt-[52px] md:ml-[256px] md:pt-0">
        <div className="flex min-h-screen w-full justify-center px-4 py-10 sm:px-6 md:px-[60px] md:py-[108px] lg:px-[80px]">
          <div className="w-full max-w-[543px] md:ml-[-128px]">
            <h1
              className="ml-[20px] text-[20px] font-medium leading-[28px]"
              style={{
                color: colors.text,
              }}
            >
              Profile
            </h1>

            <div
              className="mt-[28px] w-full overflow-hidden rounded-[8px] border"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
              }}
            >
              <div
                className="flex h-[54px] items-center justify-between border-b px-5"
                style={{
                  borderColor: colors.border,
                }}
              >
                <span
                  className="text-[11px]"
                  style={{
                    color: colors.text,
                  }}
                >
                  Profile picture
                </span>

                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full text-[10px] font-medium text-white"
                  style={{
                    backgroundColor: accentColor,
                  }}
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    avatarLetter
                  )}
                </div>
              </div>

              <div
                className="flex h-[65px] items-center justify-between border-b px-5"
                style={{
                  borderColor: colors.border,
                }}
              >
                <span
                  className="text-[11px]"
                  style={{
                    color: colors.text,
                  }}
                >
                  Email
                </span>

                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onClick={() => handleEdit("email")}
                    onBlur={handleFieldBlur}
                    onKeyDown={handleKeyDown}
                    readOnly={editingField !== "email"}
                    className="w-[125px] rounded-[6px] px-2 py-1 text-right text-[11px] outline-none"
                    style={{
                      backgroundColor:
                        editingField === "email"
                          ? colors.editingInput
                          : "transparent",
                      color: colors.text,
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => handleEdit("email")}
                    className="flex h-5 w-5 items-center justify-center rounded"
                  >
                    <RiPencilLine size={14} color={colors.text} />
                  </button>
                </div>
              </div>

              <div
                className="flex h-[64px] items-center justify-between border-b px-5"
                style={{
                  borderColor: colors.border,
                }}
              >
                <span
                  className="text-[11px]"
                  style={{
                    color: colors.text,
                  }}
                >
                  Full name
                </span>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onClick={() => handleEdit("name")}
                  onBlur={handleFieldBlur}
                  onKeyDown={handleKeyDown}
                  readOnly={editingField !== "name"}
                  className="h-[30px] w-[152px] rounded-[6px] px-3 text-[11px] outline-none"
                  style={{
                    backgroundColor:
                      editingField === "name"
                        ? colors.editingInput
                        : colors.input,
                    color:
                      editingField === "name" ? colors.text : colors.secondary,
                  }}
                />
              </div>

              <div
                className="flex h-[69px] items-center justify-between border-b px-5"
                style={{
                  borderColor: colors.border,
                }}
              >
                <div>
                  <p
                    className="text-[11px]"
                    style={{
                      color: colors.text,
                    }}
                  >
                    Title
                  </p>

                  <p
                    className="mt-[2px] text-[10px]"
                    style={{
                      color: colors.secondary,
                    }}
                  >
                    Your job title or role
                  </p>
                </div>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  onClick={() => handleEdit("title")}
                  onBlur={handleFieldBlur}
                  onKeyDown={handleKeyDown}
                  readOnly={editingField !== "title"}
                  placeholder="Designer"
                  className="h-[30px] w-[152px] rounded-[6px] px-3 text-[11px] outline-none"
                  style={{
                    backgroundColor:
                      editingField === "title"
                        ? colors.editingInput
                        : colors.input,
                    color: colors.text,
                  }}
                />
              </div>

              <div className="flex h-[84px] items-center justify-between px-5">
                <div className="min-w-0">
                  <p
                    className="text-[11px]"
                    style={{
                      color: colors.text,
                    }}
                  >
                    Username
                  </p>

                  <p
                    className="mt-[2px] text-[10px]"
                    style={{
                      color: colors.secondary,
                    }}
                  >
                    One word, like a nickname or first name
                  </p>
                </div>

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onClick={() => handleEdit("username")}
                  onBlur={handleFieldBlur}
                  onKeyDown={handleKeyDown}
                  readOnly={editingField !== "username"}
                  placeholder="Username"
                  className="h-[30px] w-[152px] shrink-0 rounded-[6px] px-3 text-[11px] outline-none"
                  style={{
                    backgroundColor:
                      editingField === "username"
                        ? colors.editingInput
                        : colors.input,
                    color: colors.text,
                  }}
                />
              </div>
            </div>

            <h2
              className="mt-[40px] text-[13px] font-medium leading-[18px]"
              style={{
                color: colors.text,
              }}
            >
              Workspace access
            </h2>

            <div
              className="mt-[19px] w-full overflow-hidden rounded-[8px] border"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
              }}
            >
              <div className="flex min-h-[69px] items-center justify-between gap-4 px-5">
                <span
                  className="text-[10px]"
                  style={{
                    color: colors.secondary,
                  }}
                >
                  Remove yourself from the workspace
                </span>

                <button
                  type="button"
                  onClick={handleLeaveWorkspace}
                  disabled={
                    !canLeaveWorkspace || (isLeavingWorkspace && !isGuestUser)
                  }
                  className="shrink-0 rounded-[6px] px-[10px] py-[7px] text-[10px] font-medium transition"
                  style={{
                    backgroundColor: canLeaveWorkspace
                      ? "#FFF0F0"
                      : isDark
                        ? "#303030"
                        : "#F1F1F1",
                    color: canLeaveWorkspace ? "#FF4D4D" : colors.secondary,
                    cursor: canLeaveWorkspace ? "pointer" : "not-allowed",
                    opacity: canLeaveWorkspace ? 1 : 0.5,
                  }}
                >
                  {isLeavingWorkspace && !isGuestUser
                    ? "Leaving..."
                    : "Leave Workspace"}
                </button>
              </div>
            </div>

            {!isGuestUser && isWorkspaceLoading && (
              <p
                className="mt-2 text-[10px]"
                style={{
                  color: colors.secondary,
                }}
              >
                Loading workspace...
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
