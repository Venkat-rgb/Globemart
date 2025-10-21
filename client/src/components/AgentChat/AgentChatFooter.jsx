import toast from "react-hot-toast";
import { BsSend } from "react-icons/bs";
import { memo, useRef } from "react";

const AgentChatFooter = ({ sendMessageToAI, isAgentResponseLoading }) => {
  const inputMsgRef = useRef(null);

  const submitHandler = async (e) => {
    try {
      e.preventDefault();

      // Trimming the user query
      const userQuery = inputMsgRef.current?.value?.trim();

      // If user doesn't enter anything, just return
      if (!userQuery) {
        return;
      }

      // Sending the user query to AI
      sendMessageToAI(userQuery);

      // Making the input empty
      inputMsgRef.current.value = "";
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  return (
    <form className="px-4" onSubmit={submitHandler}>
      <div className="border rounded-full text-sm flex items-center py-1.5 pl-4 pr-1 gap-2">
        <input
          type="text"
          placeholder="Enter your message..."
          className="outline-none w-full"
          ref={inputMsgRef}
        />

        <button
          className="bg-purple-600 text-white rounded-full p-1.5"
          disabled={isAgentResponseLoading}
        >
          <BsSend fontSize={15} />
        </button>
      </div>
    </form>
  );
};

export default memo(AgentChatFooter);
