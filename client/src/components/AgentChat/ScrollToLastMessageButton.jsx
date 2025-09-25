import { useEffect, useState } from "react";
import { BsArrowDownShort } from "react-icons/bs";
import { motion } from "framer-motion";

const ScrollToLastMessageButton = ({ messages, messageRef }) => {
  const [showDownBtn, setShowDownBtn] = useState(false);

  const scrollToLastMessageHandler = () => {
    // If messageRef is present then only we scroll the chat till last message
    if (messageRef?.current) {
      const lastMessage = messageRef?.current?.lastElementChild;

      lastMessage?.scrollIntoView({ behavior: "smooth" });

      setShowDownBtn(false);
    }
  };

  // When chat window is open initially (or) when messages change, we scroll to last message
  useEffect(() => {
    scrollToLastMessageHandler();
  }, [messages]);

  // When we click on showDownBtn then scroll to last message
  useEffect(() => {
    // Keeps track whether last message is intersecting (or) not
    const handleIntersection = (entries) => {
      const position = entries[0].isIntersecting;

      setShowDownBtn(!position);
    };

    // Initialising observer
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0,
    });

    // Selecting last message of the chat
    const lastMessage = messageRef?.current?.lastElementChild;

    if (messageRef?.current) {
      // Observing the last message of chat
      lastMessage && observer.observe(lastMessage);
    }

    // Making sure to disconnect (or) stop observing when chat is changed
    return () => {
      lastMessage && observer.disconnect();
    };
  }, [messages]);

  return (
    showDownBtn && (
      <motion.div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 bg-purple-600 rounded-full shadow cursor-pointer p-0.5"
        onClick={scrollToLastMessageHandler}
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      >
        <BsArrowDownShort className="text-2xl text-white" />
      </motion.div>
    )
  );
};

export default ScrollToLastMessageButton;
