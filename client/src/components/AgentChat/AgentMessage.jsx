import { IoChatbubbleSharp } from "react-icons/io5";

const AgentMessage = ({ message, i }) => {
  return (
    <div className={`${i % 2 !== 0 ? "flex items-center gap-2" : ""}`}>
      {i % 2 !== 0 && (
        <div>
          <IoChatbubbleSharp fontSize={18} className="text-purple-600" />
        </div>
      )}

      {/* {isLoading && (
    <p className="text-[0.95rem] text-neutral-700 font-medium animate-pulse">
      Thinking...
    </p>
  )} */}

      <div
        className={`flex items-end justify-between max-w-xs w-fit gap-2 px-2.5 py-2 rounded-xl ${
          i % 2 === 0
            ? "bg-neutral-800/90 text-neutral-200 ml-auto"
            : "bg-neutral-100 mr-auto"
        }`}
      >
        <p className="text-sm">{message}</p>
        <p
          className={`text-[0.7rem] ${
            i % 2 === 0 ? "text-neutral-300/90" : "text-neutral-500"
          }`}
        >
          11.15AM
        </p>
      </div>
    </div>
  );
};

export default AgentMessage;
