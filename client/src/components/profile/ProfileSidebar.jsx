import React, { useState } from "react";
import {
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiCheckLine,
  RiMoonLine,
  RiSunLine,
  RiUserLine,
  RiLogoutBoxRLine,
} from "@remixicon/react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const COLOR_OPTIONS = [
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
    color: "#F43F5E",
  },
  {
    name: "Emerald",
    value: "Emerald",
    color: "#10B981",
  },
  {
    name: "Black",
    value: "Black",
    color: "#222222",
  },
];

const getAccentColor = (color) => {
  const found = COLOR_OPTIONS.find((item) => item.value === color);
  return found?.color || "#3B82F6";
};

const ProfileSidebar = ({
  user,
  theme,
  color,
  onThemeChange,
  onColorChange,
  isUpdatingTheme,
}) => {
  const navigate = useNavigate();

  const [themeOpen, setThemeOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);

  const isDark = theme === "dark";
  const accentColor = getAccentColor(color);

  const sidebarBg = isDark ? "#202020" : "#F7F7F5";
  const textColor = isDark ? "#F5F5F5" : "#222222";
  const secondaryColor = isDark ? "#A0A0A0" : "#777777";
  const borderColor = isDark ? "#333333" : "#E2E2E0";
  const hoverBg = isDark ? "#2A2A2A" : "#EEEEEC";

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");

    sessionStorage.clear();

    toast.success("Logout successful!!");

    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 500);
  };

  const handleBackToApp = () => {
    navigate(-1);
  };

  return (
    <aside
      className="
        fixed
        left-0
        top-0
        z-[50]
        hidden
        h-screen
        w-[256px]
        border-r
        md:block
      "
      style={{
        backgroundColor: sidebarBg,
        borderColor,
        color: textColor,
      }}
    >
      <div
        className="flex h-[64px] items-center border-b px-5"
        style={{
          borderColor,
        }}
      >
        <button
          type="button"
          onClick={handleBackToApp}
          className="
            cursor-pointer
            text-[12px]
            transition
            hover:opacity-70
          "
          style={{
            color: textColor,
          }}
        >
          ← Back to app
        </button>
      </div>

      <div className="px-4 pt-4">
        <div
          className="
            flex
            h-[34px]
            items-center
            rounded-[6px]
            border
            px-3
          "
          style={{
            borderColor,
            backgroundColor: isDark ? "#272727" : "#FFFFFF",
          }}
        >
          <span
            className="mr-2 text-[13px]"
            style={{
              color: secondaryColor,
            }}
          >
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent text-[12px] outline-none"
            style={{
              color: textColor,
            }}
          />
        </div>
      </div>

      <div className="px-4 pt-3">
        <button
          type="button"
          className="
            flex
            h-[36px]
            w-full
            cursor-default
            items-center
            rounded-[6px]
            px-2
            text-left
          "
          style={{
            backgroundColor: hoverBg,
            color: textColor,
          }}
        >
          <RiUserLine size={16} className="mr-3" />
          <span className="text-[12px] font-medium">Profile</span>
        </button>

        <div className="mt-1">
          <button
            type="button"
            onClick={() => {
              setThemeOpen((previous) => !previous);
              setColorOpen(false);
            }}
            className="
              flex
              h-[36px]
              w-full
              cursor-pointer
              items-center
              justify-between
              rounded-[6px]
              px-2
              text-left
              transition
              hover:opacity-80
            "
            style={{
              color: textColor,
            }}
          >
            <span className="flex items-center">
              {isDark ? (
                <RiMoonLine size={16} className="mr-3" />
              ) : (
                <RiSunLine size={16} className="mr-3" />
              )}

              <span className="text-[12px]">Theme</span>
            </span>

            {themeOpen ? (
              <RiArrowDownSLine size={15} />
            ) : (
              <RiArrowRightSLine size={15} />
            )}
          </button>

          {themeOpen && (
            <div
              className="ml-7 mt-1 rounded-[6px] border p-1"
              style={{
                backgroundColor: sidebarBg,
                borderColor,
              }}
            >
              <button
                type="button"
                disabled={isUpdatingTheme}
                onClick={() => onThemeChange("light")}
                className="
                  flex
                  w-full
                  cursor-pointer
                  items-center
                  justify-between
                  rounded-[5px]
                  px-3
                  py-2
                  text-left
                  text-[12px]
                "
                style={{
                  backgroundColor: theme === "light" ? hoverBg : "transparent",
                  color: textColor,
                }}
              >
                <span className="flex items-center gap-2">
                  <RiSunLine size={14} />
                  Light
                </span>

                {theme === "light" && <RiCheckLine size={14} />}
              </button>

              <button
                type="button"
                disabled={isUpdatingTheme}
                onClick={() => onThemeChange("dark")}
                className="
                  flex
                  w-full
                  cursor-pointer
                  items-center
                  justify-between
                  rounded-[5px]
                  px-3
                  py-2
                  text-left
                  text-[12px]
                "
                style={{
                  backgroundColor: theme === "dark" ? hoverBg : "transparent",
                  color: textColor,
                }}
              >
                <span className="flex items-center gap-2">
                  <RiMoonLine size={14} />
                  Dark
                </span>

                {theme === "dark" && <RiCheckLine size={14} />}
              </button>
            </div>
          )}
        </div>

        <div className="mt-1">
          <button
            type="button"
            onClick={() => {
              setColorOpen((previous) => !previous);
              setThemeOpen(false);
            }}
            className="
              flex
              h-[36px]
              w-full
              cursor-pointer
              items-center
              justify-between
              rounded-[6px]
              px-2
              text-left
              transition
              hover:opacity-80
            "
            style={{
              color: textColor,
            }}
          >
            <span className="flex items-center">
              <span
                className="mr-3 h-[15px] w-[15px] rounded-[3px]"
                style={{
                  backgroundColor: accentColor,
                }}
              />

              <span className="text-[12px]">Color</span>
            </span>

            {colorOpen ? (
              <RiArrowDownSLine size={15} />
            ) : (
              <RiArrowRightSLine size={15} />
            )}
          </button>

          {colorOpen && (
            <div
              className="ml-7 mt-1 rounded-[6px] border p-1"
              style={{
                backgroundColor: sidebarBg,
                borderColor,
              }}
            >
              {COLOR_OPTIONS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  disabled={isUpdatingTheme}
                  onClick={() => onColorChange(item.value)}
                  className="
                    flex
                    w-full
                    cursor-pointer
                    items-center
                    justify-between
                    rounded-[5px]
                    px-3
                    py-2
                    text-left
                    text-[12px]
                  "
                  style={{
                    backgroundColor:
                      color === item.value ? hoverBg : "transparent",
                    color: textColor,
                  }}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="h-[12px] w-[12px] rounded-[3px]"
                      style={{
                        backgroundColor: item.color,
                      }}
                    />

                    {item.name}
                  </span>

                  {color === item.value && <RiCheckLine size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          border-t
          px-4
          py-4
        "
        style={{
          borderColor,
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="
              flex
              h-[30px]
              w-[30px]
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-full
              text-[11px]
              font-medium
              text-white
            "
            style={{
              backgroundColor: accentColor,
            }}
          >
            {user?.avatar ? (
              <img
                src={
                  user.avatar.startsWith("http")
                    ? user.avatar
                    : `https://taskforge-2026.onrender.com/${user.avatar.replace(/^\//, "")}`
                }
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              user?.name?.charAt(0)?.toUpperCase() || "U"
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p
              className="truncate text-[11px] font-medium"
              style={{
                color: textColor,
              }}
            >
              {user?.name || "User"}
            </p>

            <p
              className="truncate text-[10px]"
              style={{
                color: secondaryColor,
              }}
            >
              {user?.email || ""}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="
            mt-3
            flex
            h-[34px]
            w-full
            cursor-pointer
            items-center
            rounded-[6px]
            px-2
            text-left
            text-[11px]
            transition
          "
          style={{
            color: isDark ? "#F87171" : "#E5484D",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = isDark
              ? "#3A2424"
              : "#FFF0F0";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <RiLogoutBoxRLine size={16} className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
