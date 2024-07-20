import { AiOutlineSend } from "react-icons/ai";
import { FaRegSmileBeam } from "react-icons/fa";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useCreateMessageMutation } from "../../redux/features/messages/messagesApiSlice";
import { useSelector } from "react-redux";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { CircularProgress } from "@mui/material";

const ChatFooter = ({
  chatId,
  socket,
  receiverId,
  setMessagesHandler,
  messages,
  emojiPlaceOfUse,
}) => {
  // Keeps track of message which user is typing
  const [message, setMessage] = useState("");

  // Opens (or) closes emoji picker
  const [openColorPicker, setOpenColorPicker] = useState(false);

  // Accessing userInfo from the redux store to identify the sender and receiver of messages
  const { userInfo } = useSelector((state) => state?.auth);

  const [createMessage, { isLoading }] = useCreateMessageMutation();

  const sendMessageHandler = async (e) => {
    e.preventDefault();

    // Trimming the message
    const trimmedMessage = message?.trim();

    // Check if trimmed message is not empty
    if (!trimmedMessage) return;

    try {
      // Saving this trimmed message to database by passing message, chatId
      const messageRes = await createMessage({
        message: trimmedMessage,
        chatId,
      }).unwrap();

      // Adding this trimmedMessage to messages array inorder to show messages till now to the user
      setMessagesHandler([...messages, { ...messageRes?.messageData }]);

      // Sending this message to other user by emitting createMessage event
      socket.emit("createMessage", { ...messageRes?.messageData, receiverId });

      // Clearing message input
      setMessage("");
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  const addEmoji = (e) => {
    // let sym = e.unified.split("-");
    // let codesArray = [];
    // sym.forEach((el) => codesArray.push("0x" + el));
    // let emoji = String.fromCodePoint(...codesArray);

    // Adding the emoji to current message
    setMessage(message + e.native);
  };

  // Typing Indication Feature
  useEffect(() => {
    let timer;

    // If user is typing then send status as true
    if (message) {
      socket.emit("isTyping", {
        senderId: userInfo?.id,
        receiverId,
        typingStatus: true,
      });

      // Checking if user is typing for every 3 seconds
      timer = setTimeout(() => {
        socket.emit("isTyping", {
          senderId: userInfo?.id,
          receiverId,
          typingStatus: false,
        });
      }, 3000);
    } else {
      // If user is not typing then send status as false
      socket.emit("isTyping", {
        senderId: userInfo?.id,
        receiverId,
        typingStatus: false,
      });
    }

    // Ensuring that each timeout is cleared, when he starts typing each new letter
    return () => timer && clearTimeout(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, socket]);

  return (
    <div className="px-10 py-3 flex items-center gap-10 bg-white">
      {/* Emoji picker */}

      <FaRegSmileBeam
        className="text-[1.35rem] text-neutral-500 cursor-pointer"
        onClick={(e) => {
          // Using e.stopPropagation(), so that onClickOutside prop can work properly below in Picker component
          e.stopPropagation();
          setOpenColorPicker((prev) => !prev);
        }}
      />

      {/* Only displaying emoji picker if openColorPicker state is true */}
      {openColorPicker && (
        <div className={`absolute ${emojiPlaceOfUse}`}>
          <Picker
            data={data}
            onEmojiSelect={addEmoji}
            theme="dark"
            onClickOutside={() => setOpenColorPicker(false)}
          />
        </div>
      )}

      {/* Message textbox */}
      <form className="flex items-center w-full" onSubmit={sendMessageHandler}>
        <div className="border-t border-b border-l w-full px-4 rounded-tl-md rounded-bl-md">
          {/* <input
            type="text"
            className="w-full outline-none text-sm py-2.5"
            placeholder="Type a message..."
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          /> */}

          {/* Input for typing a message */}
          <input
            type="text"
            className="w-full outline-none text-sm py-2.5"
            placeholder="Type a message..."
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
        </div>
        <button
          className="bg-neutral-800 py-[0.65rem] px-4 text-white/80 
        rounded-tr-md rounded-br-md"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <CircularProgress
                sx={{
                  color: "white",
                  opacity: 0.8,
                }}
                size={20}
              />
            </div>
          ) : (
            <AiOutlineSend size={20} />
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatFooter;
