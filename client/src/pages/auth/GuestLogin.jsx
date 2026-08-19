import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Logo from "../../components/common/Logo";
import AuthCard from "../../components/auth/AuthCard";

import {
  useGoogleLoginMutation,
  useGuestLoginMutation,
} from "../../redux/slices/userSlice";

const GuestLogin = () => {
  const navigate = useNavigate();

  const [googleLogin, { isLoading: googleLoading }] = useGoogleLoginMutation();

  const [guestLogin, { isLoading: guestLoading }] = useGuestLoginMutation();

  const [googleProcessing, setGoogleProcessing] = useState(false);

  const handleGuestLogin = async () => {
    try {
      const response = await guestLogin().unwrap();

      console.log("Guest login response:", response);

      const loggedInUser = response?.data;

      if (!loggedInUser) {
        toast.error("Guest user data not received from server!!");
        return;
      }

      if (response?.token) {
        localStorage.setItem("token", response.token);
      }

      const userId = loggedInUser?._id || loggedInUser?.id;

      if (!userId) {
        toast.error("Guest user ID not received from server!!");
        return;
      }

      localStorage.setItem("userId", String(userId));

      const guestUser = {
        ...loggedInUser,

        _id: userId,
        id: userId,

        name: loggedInUser?.name || "Guest",

        username: loggedInUser?.username || "Guest",

        email: loggedInUser?.email || "",

        title: loggedInUser?.title || "",

        avatar: loggedInUser?.avatar || "",

        profilePic: loggedInUser?.avatar || "",

        profileImage: loggedInUser?.avatar || "",

        authProvider: "guest",
      };

      console.log("FINAL GUEST USER:", guestUser);

      localStorage.setItem("user", JSON.stringify(guestUser));

      localStorage.setItem("guestUser", "true");

      toast.success("Welcome to TaskForge!!");

      navigate("/tasks");
    } catch (error) {
      toast.error("Guest login failed!!");
    }
  };

  const handleGoogleLogin = async (credential) => {
    if (!credential) {
      toast.error("Google login failed!!");
      return;
    }

    try {
      setGoogleProcessing(true);

      const response = await googleLogin(credential).unwrap();

      console.log("Google login response:", response);

      const loggedInUser = response?.data;

      if (!loggedInUser) {
        toast.error("User data not received from server!!");
        return;
      }

      if (response?.token) {
        localStorage.setItem("token", response.token);
      }

      const userId = loggedInUser?._id || loggedInUser?.id;

      if (!userId) {
        toast.error("User ID not received from server!!");
        return;
      }

      localStorage.setItem("userId", String(userId));

      const googleUser = {
        ...loggedInUser,

        _id: userId,
        id: userId,

        name: loggedInUser?.name || "Google User",

        username: loggedInUser?.username || loggedInUser?.name || "Google User",

        avatar: loggedInUser?.avatar || "",

        profilePic: loggedInUser?.avatar || "",

        profileImage: loggedInUser?.avatar || "",

        authProvider: loggedInUser?.authProvider || "google",
      };

      console.log("Google user:", googleUser);

      localStorage.setItem("user", JSON.stringify(googleUser));

      localStorage.removeItem("guestUser");

      toast.success(`Welcome ${googleUser.name}!!`);

      navigate("/tasks");
    } catch (error) {
      toast.error("Google login failed!!");
    } finally {
      setGoogleProcessing(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-white">
      <div
        className="
          mx-auto
          flex
          min-h-screen
          w-full
          max-w-[1200px]
          flex-col
          items-center
          px-4
        "
      >
        <div
          className="
            mt-[200px]
            flex
            w-full
            justify-center
            sm:mt-[180px]
            md:mt-[200px]
          "
        >
          <Logo />
        </div>

        <div className="mt-[20px] w-full">
          <div className="mx-auto w-full max-w-[384px]">
            <AuthCard
              onGuestLogin={handleGuestLogin}
              onGoogleLogin={handleGoogleLogin}
              loading={guestLoading || googleProcessing || googleLoading}
            />
          </div>
        </div>

        <p
          className="
            mt-[12px]
            w-full
            max-w-[384px]
            text-center
            text-[10px]
            leading-[12px]
            text-[#8A8A8A]
          "
        >
          By clicking continue, you agree to
          <br />
          <span className="cursor-pointer underline">
            our Terms of Service
          </span>{" "}
          and <span className="cursor-pointer underline">Privacy</span>
          <br />
          <span className="cursor-pointer underline">Policy</span>
        </p>
      </div>
    </main>
  );
};

export default GuestLogin;
