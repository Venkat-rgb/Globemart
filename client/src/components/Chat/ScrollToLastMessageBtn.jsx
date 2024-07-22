import { motion } from "framer-motion";
import { forwardRef, useEffect, useState } from "react";
import { BsArrowDownShort } from "react-icons/bs";

const ScrollToLastMessageBtn = forwardRef(({ chatId, messages }, ref) => {
  const [showDownBtn, setShowDownBtn] = useState(false);

  const scrollToLastMessageHandler = () => {
    // If ref is present then only we scroll the chat till last message
    if (ref?.current) {
      const lastMessage = ref?.current?.lastElementChild;

      lastMessage?.scrollIntoView({ behavior: "smooth" });

      setShowDownBtn(false);
    }
  };

  // Scroll down to last message when chat (or) messages change
  useEffect(() => {
    scrollToLastMessageHandler();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, messages]);

  // // When we click on showDownBtn then scroll to last message
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
    const lastMessage = ref?.current?.lastElementChild;

    if (ref?.current) {
      // Observing the last message of chat
      lastMessage && observer.observe(lastMessage);
    }

    // Making sure to disconnect (or) stop observing when chat is changed
    return () => {
      lastMessage && observer.disconnect();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  return (
    // Showing scrollDownBtn only when showDownBtn is true
    showDownBtn && (
      <motion.div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 bg-indigo-500 rounded-full shadow cursor-pointer p-0.5"
        onClick={scrollToLastMessageHandler}
        initial={{
          opacity: 0,
          y: 50,
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
});

export default ScrollToLastMessageBtn;
