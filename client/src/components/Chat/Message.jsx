import { IoCheckmarkDone } from "react-icons/io5";
import moment from "moment";
import { Tooltip } from "@mui/material";

const Message = ({ role, message, username, messageTime, messageSeen }) => {
  // Displaying different styles for message, based on role (sender (or) admin)
  return (
    <div
      className={`flex flex-col gap-1.5 ${
        role === "sender"
          ? "items-start justify-start"
          : "items-end justify-end"
      } w-full`}
    >
      <p
        className={`text-sm max-w-[50%] py-1 px-2 rounded-md shadow-md ${
          role === "sender"
            ? "bg-white text-neutral-600"
            : "bg-neutral-800 text-white/90"
        } `}
      >
        {message}
      </p>

      <div className="text-xs font-medium text-neutral-400 flex items-center gap-1">
        <span className="capitalize">{username}</span>

        <div className="flex items-center gap-1">
          <Tooltip
            title={new Date(messageTime).toLocaleDateString()}
            placement="left"
            arrow
          >
            <span> • {moment(messageTime).format("LT")}</span>
          </Tooltip>

          {role !== "sender" && message && (
            <IoCheckmarkDone
              className={`text-[1rem] ${
                messageSeen ? "text-indigo-600" : "text-neutral-400"
              }`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;

{
  /* <div
      className={`flex flex-col gap-1.5 ${
        role === "sender"
          ? "items-start justify-start"
          : "items-end justify-end"
      } w-full`}
    >
      <p
        className={`text-sm max-w-1/2 py-1 px-2 rounded-lg shadow-md ${
          role === "sender"
            ? "bg-white text-neutral-500"
            : "bg-neutral-800 text-white/80"
        } `}
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde alias
        repudiandae modi. Quam porro dolorum inventore, accusantium dolore quis
        illum animi officia nulla saepe ex voluptate natus veniam, provident
        ratione.
      </p>
      <div className="text-xs font-medium text-neutral-400 flex items-center gap-1">
        <span>{role === "sender" ? "Michael Jordan" : "Venkat Reddy"} </span>
        <div className="flex items-center gap-1">
          <span> • 3:40PM</span>
          {role !== "sender" && (
            <IoCheckmarkDone className={`text-[1rem] text-indigo-600`} />
          )}
        </div>
      </div>
    </div> */
}
