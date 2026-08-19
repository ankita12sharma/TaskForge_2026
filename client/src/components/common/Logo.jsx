import { Pyramid } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex h-5 w-5 items-center justify-center rounded-md bg-black">
        <Pyramid size={12} strokeWidth={2} className="text-white" />
      </div>

      <span className="text-sm font-semibold text-black">Pyramid</span>
    </div>
  );
};

export default Logo;
