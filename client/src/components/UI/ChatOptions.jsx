import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Tooltip } from "@mui/material";
import { FaRobot } from "react-icons/fa";
import { MdOutlineSupportAgent } from "react-icons/md";
import { BsFillChatDotsFill } from "react-icons/bs";
import AgentChat from "../AgentChat/AgentChat";

const ChatOptions = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state?.auth);
  const [chatOptions, setChatOptions] = useState(false);
  const [isAgentChatOpen, setIsAgentChatOpen] = useState(false);

  return (
    <>
      {isAgentChatOpen && (
        <AgentChat
          userId={userInfo?.id}
          setIsAgentChatOpen={setIsAgentChatOpen}
        />
      )}

      {/* Showing Chat Options only when user is logged in and user's role is not admin */}
      {userInfo?.username && userInfo?.role !== "admin" && chatOptions && (
        <motion.div
          className="fixed z-40 bottom-[6rem] right-9 max-[1024px]:right-7 flex items-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Tooltip title="Chat with AI Support" placement="left-start" arrow>
            <div
              className="bg-indigo-600 rounded-t-full rounded-br-full p-2 cursor-pointer"
              style={{ boxShadow: "0px 0px 30px rgba(0,0,0,0.3)" }}
              onClick={() => {
                setChatOptions(false);
                setIsAgentChatOpen(true);
              }}
            >
              <FaRobot className="text-[1rem] text-[#f1f1f1] cursor-pointer" />
            </div>
          </Tooltip>

          <Tooltip title="Chat with Our Agent" placement="top" arrow>
            <div
              className="bg-indigo-600 rounded-t-full rounded-br-full p-2 cursor-pointer"
              style={{ boxShadow: "0px 0px 30px rgba(0,0,0,0.3)" }}
              onClick={() => {
                setChatOptions(false);
                navigate("/chat");
              }}
            >
              <MdOutlineSupportAgent className="text-[1rem] text-[#f1f1f1] cursor-pointer" />
            </div>
          </Tooltip>
        </motion.div>
      )}

      {/* Showing ChatIcon only if user's role is not admin */}
      {userInfo?.username && userInfo?.role !== "admin" && (
        <Tooltip title="Chat with us!" placement="left-end" arrow>
          <div
            className="fixed z-40 bottom-9 right-14 max-[1024px]:right-7 bg-[#f1f1f1] rounded-t-full rounded-br-full p-2 cursor-pointer"
            style={{ boxShadow: "0px 0px 30px rgba(0,0,0,0.3)" }}
            onClick={() => {
              setChatOptions((prev) => !prev);
            }}
          >
            <BsFillChatDotsFill className="text-[1.5rem] cursor-pointer" />
          </div>
        </Tooltip>
      )}
    </>
  );
};

export default ChatOptions;
