import { BsSend } from "react-icons/bs";

const AgentChatFooter = () => {
  const sendMessage = async (e) => {
    try {
      e.preventDefault();

      console.log("Sending message to agent...");
    } catch (err) {
      console.log("Error while sending message: ", err?.message);
    }
  };

  return (
    <form className="px-4" onSubmit={sendMessage}>
      <div className="border rounded-full text-sm flex items-center py-1.5 pl-4 pr-1 gap-2">
        <input
          type="text"
          placeholder="Enter your message..."
          className="outline-none w-full"
        />

        <button className="bg-purple-600 text-white rounded-full p-1.5">
          <BsSend fontSize={15} />
        </button>
      </div>
    </form>
  );
};

export default AgentChatFooter;
