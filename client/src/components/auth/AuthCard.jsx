import { GoogleLogin } from "@react-oauth/google";
import { RiGoogleFill } from "@remixicon/react";

import AuthButton from "./AuthButton";

const AuthCard = ({ onGuestLogin, onGoogleLogin, loading = false }) => {
  return (
    <div
      className="
        w-full
        max-w-[384px]
        rounded-[16px]
        border
        border-[#E5E5E5]
        bg-white
        px-6
        py-6
      "
    >
      <div className="text-center">
        <h2
          className="
            text-[20px]
            font-semibold
            leading-[24px]
            text-[#171717]
          "
        >
          Let's get back on track
        </h2>

        <p
          className="
            mt-[4px]
            text-[12px]
            leading-[16px]
            text-[#8A8A8A]
          "
        >
          Enter your email below to login to your account.
        </p>
      </div>

      <div
        className="
          mt-[24px]
          flex
          flex-col
          gap-[10px]
        "
      >
        <AuthButton onClick={onGuestLogin} disabled={loading}>
          {loading ? "Please wait..." : "Continue as Guest"}
        </AuthButton>

        <div className="relative">
          <AuthButton
            variant="secondary"
            disabled={loading}
            icon={<RiGoogleFill size={16} color="#000000" />}
          >
            Login with Google
          </AuthButton>

          <div
            className="
              absolute
              inset-0
              overflow-hidden
              opacity-0
            "
          >
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                onGoogleLogin(credentialResponse.credential);
              }}
              onError={() => {
                onGoogleLogin(null);
              }}
              useOneTap={false}
              size="large"
              width="100%"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
