import React, { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";

import {
  RiArrowDownSLine,
  RiCheckLine,
  RiGridLine,
  RiArchiveStackLine,
  RiMenuLine,
  RiCloseLine,
  RiSunLine,
  RiMoonLine,
  RiSettings3Line,
} from "@remixicon/react";

import { useGetWorkspacesQuery } from "../../redux/slices/workspaceSlice";
import { useUpdateUserMutation } from "../../redux/slices/userSlice";

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [colorMenuOpen, setColorMenuOpen] = useState(false);

  const userMenuRef = useRef(null);

  let storedUser = null;

  try {
    storedUser = JSON.parse(localStorage.getItem("user") || "null");
  } catch (error) {
    storedUser = null;
  }

  const [currentUser, setCurrentUser] = useState(storedUser);

  const [updateUser] = useUpdateUserMutation();

  const userName =
    currentUser?.name ||
    currentUser?.username ||
    currentUser?.fullName ||
    currentUser?.email ||
    "Guest";

  const userEmail = currentUser?.email || "";

  const currentTheme = currentUser?.theme || "light";

  const currentColor = currentUser?.color || "Blue";

  const userId = currentUser?.id || currentUser?._id;

  const avatar =
    currentUser?.avatar ||
    currentUser?.profile?.avatar ||
    currentUser?.profile?.profilePic ||
    currentUser?.profilePic ||
    currentUser?.profileImage ||
    currentUser?.picture ||
    currentUser?.photo ||
    currentUser?.image ||
    "";

  let userAvatar = "";

  if (avatar) {
    if (
      avatar.startsWith("http://") ||
      avatar.startsWith("https://") ||
      avatar.startsWith("data:")
    ) {
      userAvatar = avatar;
    } else if (avatar.startsWith("/")) {
      userAvatar = `https://taskforge-2026.onrender.com${avatar}`;
    } else {
      userAvatar = `https://taskforge-2026.onrender.com/${avatar}`;
    }
  }

  const { data: workspaceData, isLoading: workspaceLoading } =
    useGetWorkspacesQuery();

  const workspaces = Array.isArray(workspaceData?.data)
    ? workspaceData.data
    : Array.isArray(workspaceData?.workspaces)
      ? workspaceData.workspaces
      : Array.isArray(workspaceData)
        ? workspaceData
        : [];

  const workspace = workspaces[0];

  const workspaceName =
    workspace?.name ||
    workspace?.workspaceName ||
    workspace?.workspace_name ||
    "Workspace";

  const colorOptions = [
    {
      name: "Amber",
      value: "Amber",
      color: "#F59E0B",
    },
    {
      name: "Blue",
      value: "Blue",
      color: "#3B82F6",
    },
    {
      name: "Pink",
      value: "Pink",
      color: "#EC4899",
    },
    {
      name: "Rose",
      value: "Rose",
      color: "#E11D48",
    },
    {
      name: "Emerald",
      value: "Emerald",
      color: "#059669",
    },
    {
      name: "Black",
      value: "Black",
      color: "#111111",
    },
  ];

  const getColorValue = (color) => {
    switch (color) {
      case "Amber":
        return "#F59E0B";

      case "Blue":
        return "#3B82F6";

      case "Pink":
        return "#EC4899";

      case "Rose":
        return "#E11D48";

      case "Emerald":
        return "#059669";

      case "Black":
        return "#111111";

      default:
        return "#3B82F6";
    }
  };

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty("--app-accent", getColorValue(currentColor));

    if (currentTheme === "dark") {
      root.style.setProperty("--sidebar-bg", "#181818");
      root.style.setProperty("--sidebar-text", "#FFFFFF");
      root.style.setProperty("--sidebar-muted", "#999999");
      root.style.setProperty("--sidebar-hover", "#292929");
      root.style.setProperty("--sidebar-active", "#303030");
      root.style.setProperty("--sidebar-border", "#333333");
      root.style.setProperty("--menu-bg", "#222222");
      root.style.setProperty("--menu-border", "#3A3A3A");
      root.style.setProperty("--menu-hover", "#303030");
    } else {
      root.style.setProperty("--sidebar-bg", "#FAFAFA");
      root.style.setProperty("--sidebar-text", "#000000");
      root.style.setProperty("--sidebar-muted", "#666666");
      root.style.setProperty("--sidebar-hover", "#F1F1F1");
      root.style.setProperty("--sidebar-active", "#F1F1F1");
      root.style.setProperty("--sidebar-border", "#E5E5E5");
      root.style.setProperty("--menu-bg", "#FFFFFF");
      root.style.setProperty("--menu-border", "#E4E4E4");
      root.style.setProperty("--menu-hover", "#F5F5F5");
    }
  }, [currentTheme, currentColor]);

  const saveUserToStorage = (updatedUser) => {
    try {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Unable to save user:", error);
    }

    setCurrentUser(updatedUser);
  };

  const handleThemeChange = async (theme) => {
    if (!userId) {
      console.error("User ID not found");
      return;
    }

    const updatedUser = {
      ...currentUser,
      theme: theme,
    };

    saveUserToStorage(updatedUser);

    try {
      await updateUser({
        id: userId,
        theme: theme,
      }).unwrap();
    } catch (error) {
      console.error("Theme update failed:", error);
    }

    setThemeMenuOpen(false);
    setColorMenuOpen(false);
    setUserMenuOpen(false);
  };

  const handleColorChange = async (color) => {
    if (!userId) {
      console.error("User ID not found");
      return;
    }

    const updatedUser = {
      ...currentUser,
      color: color,
    };

    saveUserToStorage(updatedUser);

    try {
      await updateUser({
        id: userId,
        color: color,
      }).unwrap();
    } catch (error) {
      console.error("Color update failed:", error);
    }

    setThemeMenuOpen(false);
    setColorMenuOpen(false);
    setUserMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
        setThemeMenuOpen(false);
        setColorMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeMobileSidebar = () => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setThemeMenuOpen(false);
    setColorMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen((prev) => !prev);
    setThemeMenuOpen(false);
    setColorMenuOpen(false);
  };

  const sidebarContent = (
    <div
      className="flex h-full w-full flex-col"
      style={{
        backgroundColor: "var(--sidebar-bg)",
        color: "var(--sidebar-text)",
      }}
    >
      <div
        ref={userMenuRef}
        className="relative flex h-[64px] shrink-0 items-center px-[14px]"
      >
        <button
          type="button"
          onClick={toggleUserMenu}
          className="flex min-w-0 w-full items-center gap-2 rounded-[6px] px-1 py-1 text-left"
          style={{
            color: "var(--sidebar-text)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--sidebar-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <div
            className="flex h-[30px] w-[30px] shrink-0 items-center justify-center overflow-hidden rounded-full"
            style={{
              backgroundColor: currentTheme === "dark" ? "#333333" : "#E7E7E7",
            }}
          >
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <span
                className="flex h-full w-full items-center justify-center text-[12px] font-medium"
                style={{
                  color: currentTheme === "dark" ? "#FFFFFF" : "#555555",
                }}
              >
                {userName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="truncate text-[12px] font-medium">{userName}</div>

            {userEmail && (
              <div
                className="truncate text-[10px]"
                style={{
                  color: "var(--sidebar-muted)",
                }}
              >
                {userEmail}
              </div>
            )}
          </div>

          <RiArrowDownSLine
            size={15}
            strokeWidth={1.7}
            className={`shrink-0 transition-transform ${
              userMenuOpen ? "rotate-180" : ""
            }`}
            style={{
              color: "var(--sidebar-muted)",
            }}
          />
        </button>

        {userMenuOpen && (
          <div
            className="absolute left-[14px] top-[55px] z-[100] w-[150px] rounded-[7px] border py-1 shadow-[0_4px_14px_rgba(0,0,0,0.12)]"
            style={{
              backgroundColor: "var(--menu-bg)",
              borderColor: "var(--menu-border)",
            }}
          >
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setThemeMenuOpen((prev) => !prev);
                  setColorMenuOpen(false);
                }}
                className="flex h-[44px] w-full items-center gap-2 px-3 text-left text-[11px]"
                style={{
                  color: "var(--sidebar-text)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--menu-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <RiSunLine size={15} strokeWidth={1.7} />

                <span className="flex-1 text-[12px]">Change Theme</span>

                <RiArrowDownSLine
                  size={13}
                  className="-rotate-90"
                  style={{
                    color: "var(--sidebar-muted)",
                  }}
                />
              </button>

              {themeMenuOpen && (
                <div
                  className="absolute left-[146px] top-[-4px] z-[110] w-[112px] rounded-[7px] border py-1 shadow-[0_4px_14px_rgba(0,0,0,0.12)]"
                  style={{
                    backgroundColor: "var(--menu-bg)",
                    borderColor: "var(--menu-border)",
                  }}
                >
                  <div
                    className="px-3 pb-1 pt-1 text-[10px]"
                    style={{
                      color: "var(--sidebar-muted)",
                    }}
                  >
                    Theme
                  </div>

                  <button
                    type="button"
                    onClick={() => handleThemeChange("light")}
                    className="flex h-[30px] w-full items-center gap-2 px-3 text-left text-[11px]"
                    style={{
                      color: "var(--sidebar-text)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "var(--menu-hover)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <RiSunLine size={14} strokeWidth={1.7} />

                    <span className="flex-1">Light</span>

                    {currentTheme === "light" && (
                      <RiCheckLine
                        size={14}
                        style={{
                          color: "var(--app-accent)",
                        }}
                      />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleThemeChange("dark")}
                    className="flex h-[30px] w-full items-center gap-2 px-3 text-left text-[11px]"
                    style={{
                      color: "var(--sidebar-text)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "var(--menu-hover)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <RiMoonLine size={14} strokeWidth={1.7} />

                    <span className="flex-1">Dark</span>

                    {currentTheme === "dark" && (
                      <RiCheckLine
                        size={14}
                        style={{
                          color: "var(--app-accent)",
                        }}
                      />
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setColorMenuOpen((prev) => !prev);
                  setThemeMenuOpen(false);
                }}
                className="flex h-[32px] w-full items-center gap-2 px-3 text-left text-[11px]"
                style={{
                  color: "var(--sidebar-text)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--menu-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <span
                  className="h-[10px] w-[10px] rounded-[2px]"
                  style={{
                    backgroundColor: getColorValue(currentColor),
                  }}
                />

                <span className="flex-1 text-[12px]">Color Mode</span>

                <RiArrowDownSLine
                  size={13}
                  className="-rotate-90"
                  style={{
                    color: "var(--sidebar-muted)",
                  }}
                />
              </button>

              {colorMenuOpen && (
                <div
                  className="absolute left-[146px] top-[-50px] z-[110] w-[125px] rounded-[7px] border py-1 shadow-[0_4px_14px_rgba(0,0,0,0.12)]"
                  style={{
                    backgroundColor: "var(--menu-bg)",
                    borderColor: "var(--menu-border)",
                  }}
                >
                  <div
                    className="px-3 pb-1 pt-1 text-[10px]"
                    style={{
                      color: "var(--sidebar-muted)",
                    }}
                  >
                    Color Mode
                  </div>

                  {colorOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleColorChange(option.value)}
                      className="flex h-[28px] w-full items-center gap-2 px-3 text-left text-[10px]"
                      style={{
                        color: "var(--sidebar-text)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--menu-hover)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <span
                        className="h-[10px] w-[10px] rounded-[2px]"
                        style={{
                          backgroundColor: option.color,
                        }}
                      />

                      <span className="flex-1">{option.name}</span>

                      {currentColor === option.value && (
                        <RiCheckLine
                          size={13}
                          style={{
                            color: "var(--app-accent)",
                          }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div
              className="my-1 border-t"
              style={{
                borderColor: "var(--menu-border)",
              }}
            />

            <Link
              to="/profile"
              onClick={closeMobileSidebar}
              className="flex h-[32px] w-full items-center gap-2 px-3 text-[11px]"
              style={{
                color: "var(--sidebar-text)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--menu-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <RiSettings3Line size={15} strokeWidth={1.7} />

              <span>Settings</span>
            </Link>
          </div>
        )}
      </div>

      <div className="px-3 pt-[10px]">
        <div className="mb-1 flex h-8 items-center justify-between px-2">
          <span className="truncate text-[12px] font-medium">
            {workspaceLoading ? "Loading..." : workspaceName}
          </span>

          <RiArrowDownSLine
            size={15}
            strokeWidth={1.7}
            style={{
              color: "var(--sidebar-muted)",
            }}
          />
        </div>

        <NavLink
          to="/tasks"
          onClick={closeMobileSidebar}
          className="flex h-8 w-full items-center gap-2 rounded-[6px] px-2 text-[12px] transition-colors"
          style={({ isActive }) => ({
            backgroundColor: isActive ? "var(--sidebar-active)" : "transparent",
            color: isActive ? "var(--app-accent)" : "var(--sidebar-text)",
          })}
          onMouseEnter={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.backgroundColor = "var(--sidebar-hover)";
            }
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
        >
          <RiGridLine size={17} strokeWidth={1.7} className="shrink-0" />

          <span>Tasks</span>
        </NavLink>

        <NavLink
          to="/projects"
          onClick={closeMobileSidebar}
          className="flex h-8 w-full items-center gap-2 rounded-[6px] px-2 text-[12px] transition-colors"
          style={({ isActive }) => ({
            backgroundColor: isActive ? "var(--sidebar-active)" : "transparent",
            color: isActive ? "var(--app-accent)" : "var(--sidebar-text)",
          })}
          onMouseEnter={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.backgroundColor = "var(--sidebar-hover)";
            }
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
        >
          <RiArchiveStackLine
            size={17}
            strokeWidth={1.7}
            className="shrink-0"
          />

          <span>Projects</span>
        </NavLink>
      </div>
    </div>
  );

  return (
    <>
      <div
        className="fixed left-0 right-0 top-0 z-40 flex h-[56px] items-center border-b px-4 md:hidden"
        style={{
          backgroundColor: "var(--sidebar-bg)",
          borderColor: "var(--sidebar-border)",
          color: "var(--sidebar-text)",
        }}
      >
        <button
          type="button"
          aria-label="Open navigation"
          onClick={() => setMobileOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-[6px]"
        >
          <RiMenuLine size={18} strokeWidth={1.7} />
        </button>

        <span className="ml-2 truncate text-[12px] font-medium">
          {workspaceName}
        </span>
      </div>

      <aside
        className="fixed left-0 top-0 z-40 hidden h-screen w-[256px] shrink-0 border-r md:block"
        style={{
          backgroundColor: "var(--sidebar-bg)",
          borderColor: "var(--sidebar-border)",
        }}
      >
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={closeMobileSidebar}
            className="fixed inset-0 z-40 bg-black/20 md:hidden"
          />

          <aside
            className="fixed left-0 top-0 z-50 h-screen w-[min(256px,85vw)] border-r shadow-xl md:hidden"
            style={{
              backgroundColor: "var(--sidebar-bg)",
              borderColor: "var(--sidebar-border)",
            }}
          >
            <button
              type="button"
              aria-label="Close navigation"
              onClick={closeMobileSidebar}
              className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full"
              style={{
                color: "var(--sidebar-muted)",
              }}
            >
              <RiCloseLine size={17} strokeWidth={1.7} />
            </button>

            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;
