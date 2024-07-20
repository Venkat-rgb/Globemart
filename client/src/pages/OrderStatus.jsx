import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import OrderSuccessAnimation from "../assets/paymentSuccessful2.json";
import OrderFailureAnimation from "../assets/paymentFailed2.json";
import OrderSuccessSound from "../assets/OrderSuccessSound.mp3";
import Confetti from "react-confetti";

const OrderStatus = ({ status }) => {
  const navigate = useNavigate();

  // Keeps track of the Lottie animation
  const ref = useRef(null);

  // Keeps track whether order is successfully placed (or) not
  const [showConfetti, setShowConfetti] = useState(
    status === "success" ? true : false
  );

  useEffect(() => {
    const paymentSuccessMusic = new Audio(OrderSuccessSound);

    // If order is successfully placed then only play the OrderSuccessSound
    if (status === "success") {
      paymentSuccessMusic
        .play()
        .catch((err) =>
          console.log("Error while playing paymentSuccessMusic", err?.message)
        );
    }

    // Making sure to set music time to start, when component unmounts
    return () => {
      if (status === "success") {
        paymentSuccessMusic.pause();
        paymentSuccessMusic.currentTime = 0;
      }
    };
  }, [status]);

  // Displaying confetti animation for 10s
  useEffect(() => {
    let timer = "";
    if (showConfetti) {
      timer = setTimeout(() => {
        setShowConfetti(false);
      }, 10000);
    }

    // Making sure to clear the timer each time component unmounts
    return () => timer && clearTimeout(timer);
  }, [showConfetti]);

  return (
    <div className="flex flex-col items-center pt-24 h-[90vh] bg-gradient-to-br">
      {/* Showing animation based on orderStatus */}
      <Lottie
        animationData={
          status === "success" ? OrderSuccessAnimation : OrderFailureAnimation
        }
        className="w-96 max-[450px]:w-72"
        loop={false}
        lottieRef={ref}
      />

      <motion.p
        className="text-3xl max-[500px]:text-xl drop-shadow font-semibold font-inter text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {status === "success" ? (
          <p className="space-y-2">
            <p className="text-center">
              Your Order has been placed successfully!
            </p>
            <p className="text-2xl max-[500px]:text-lg text-neutral-500">
              (Please check your email for order invoice that we sent!)
            </p>
          </p>
        ) : (
          `Your Order has not been placed!`
        )}
      </motion.p>

      <motion.div whileTap={{ scale: 0.95 }} className="pt-10 max-[450px]:pt-5">
        {/* Redirecting to different pages based on orderStatus */}
        <motion.button
          className="font-inter bg-neutral-800 text-[#f1f1f1] rounded-md py-2 px-5 font-medium shadow flex items-center gap-2"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() =>
            status === "success" ? navigate("/orders") : navigate("/order")
          }
        >
          <FaRegEye />
          <p>{status === "success" ? `View Orders` : `Go To Your Order`}</p>
        </motion.button>
      </motion.div>

      {/* Showing confetti */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth || 300}
          height={window.innerHeight || 200}
          numberOfPieces={200}
        />
      )}
    </div>
  );
};

export default OrderStatus;
