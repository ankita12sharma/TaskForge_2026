const AuthButton = ({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  icon,
}) => {
  const baseClasses =
    "w-full h-10 rounded-full flex items-center justify-center gap-2 text-sm font-medium transition";

  const variants = {
    primary: "bg-black text-white hover:bg-[#222222]",

    secondary: "border border-[#E5E5E5] bg-white text-black hover:bg-gray-50",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
    >
      {icon && <span className="flex items-center">{icon}</span>}

      <span>{children}</span>
    </button>
  );
};

export default AuthButton;
