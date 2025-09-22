import AgentMessage from "./AgentMessage";

const AgentChatBody = ({ messages }) => {
  return (
    <div className="h-80 px-4 pt-2.5 py-4 overflow-y-scroll">
      <div className="space-y-3">
        {messages.map((message, i) => (
          <AgentMessage key={i} i={i} message={message} />
        ))}
      </div>
    </div>
  );
};

export default AgentChatBody;
