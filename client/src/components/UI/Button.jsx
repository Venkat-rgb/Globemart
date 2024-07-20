import { memo } from "react";

const Button = ({
  isLoading = false,
  moreStyles = "",
  onClick = () => {},
  children,
}) => {
  return (
    <button
      className={`${
        isLoading ? "bg-neutral-700" : "bg-neutral-800"
      }  px-4 py-2 rounded shadow-lg transition-all duration-300 text-[#f1f1f1] font-inter flex items-center justify-center ${moreStyles}`}
      onClick={onClick}
      disabled={isLoading}
    >
      {children}
    </button>
  );
};

export default memo(Button);
