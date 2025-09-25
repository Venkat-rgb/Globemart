import { Tooltip } from "@mui/material";
import { IoChatbubbleSharp, IoCloseOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";

const AgentChatHeader = ({
  deleteChatMessages,
  closeAgentChat,
  deletingAgentChat,
}) => {
  return (
    <div className="flex items-center justify-between py-3 px-4 border-b">
      <div className="flex items-center gap-3">
        <IoChatbubbleSharp fontSize={22} className="text-purple-600" />
        <p className="text-neutral-600 font-medium">AI Support Agent</p>
      </div>
      <div className="flex items-center gap-4">
        <Tooltip title="Reset Chat" placement="top" arrow>
          <button
            type="button"
            onClick={deleteChatMessages}
            disabled={deletingAgentChat}
          >
            <MdDeleteOutline fontSize={20} />
          </button>
        </Tooltip>

        <button type="button" onClick={closeAgentChat}>
          <IoCloseOutline fontSize={20} />
        </button>
      </div>
    </div>
  );
};

export default AgentChatHeader;
