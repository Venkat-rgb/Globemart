import { Tooltip } from "@mui/material";
import moment from "moment";
import { IoChatbubbleSharp } from "react-icons/io5";
import Markdown from "react-markdown";

const AgentMessage = ({ message, role, timestamp }) => {
  return (
    <div className={`${role === "model" ? "flex items-start gap-2" : ""}`}>
      {role === "model" && (
        <IoChatbubbleSharp fontSize={18} className="text-purple-600" />
      )}

      <div className="flex flex-col items-end gap-1">
        <div
          className={`max-w-sm w-fit px-2.5 py-2 rounded-xl ${
            role === "user"
              ? "bg-neutral-800/90 text-neutral-200 ml-auto"
              : "bg-neutral-200/60 text-neutral-900 mr-auto"
          }`}
        >
          <p className="text-sm">
            <Markdown>{message}</Markdown>
          </p>
        </div>
        <Tooltip
          title={new Date(timestamp).toLocaleDateString()}
          placement="left"
          arrow
        >
          <p className={`whitespace-nowrap text-[0.7rem] text-neutral-500`}>
            {moment(timestamp).format("LT")}
          </p>
        </Tooltip>
      </div>
    </div>
  );
};

export default AgentMessage;
