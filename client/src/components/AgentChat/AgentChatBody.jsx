import AgentMessage from "./AgentMessage";
import SmallLoader from "../UI/SmallLoader";

const AgentChatBody = ({
  isAgentChatLoading,
  isAgentResponseLoading,
  messages,
}) => {
  return (
    <div className="h-80 px-4 pt-2.5 py-4 overflow-y-scroll">
      {isAgentChatLoading && (
        <SmallLoader styleProp="flex items-center justify-center h-full" />
      )}

      {!isAgentChatLoading && (
        <div className="space-y-4">
          {messages.map((message) => (
            <AgentMessage
              key={message?._id}
              role={message?.role}
              message={message?.content}
              timestamp={message?.timestamp}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentChatBody;
