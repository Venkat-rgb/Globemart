import "regenerator-runtime";
import { BsMic, BsMicFill } from "react-icons/bs";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Tooltip } from "@mui/material";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { memo, useEffect } from "react";

const VoiceSearch = ({ setProductsHandler, getProductsByVoiceSearch }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    browserSupportsContinuousListening,
  } = useSpeechRecognition();

  const startListener = async () => {
    try {
      if (isMicrophoneAvailable) {
        // Listening to user's voice continuosly only if browser supports continuous listening
        await SpeechRecognition.startListening({
          continuous: browserSupportsContinuousListening ? true : false,
        });
      }
    } catch (err) {
      toast.error(err?.message);
    }
  };

  const stopListener = async () => {
    try {
      // Stopped Listening to user's voice
      await SpeechRecognition.stopListening();
    } catch (err) {
      toast.error(err?.message);
    }
  };

  const resetListener = async () => {
    // Resetting the transcript and stop the listener
    try {
      // Stopping listening to customer only when he is currently speaking
      if (listening) {
        await SpeechRecognition.stopListening();
      }

      resetTranscript();
    } catch (err) {
      toast.error(err?.message);
    }
  };

  // Sending the customer's voice text to server
  const searchProductsHandler = async () => {
    try {
      const trimmedText = transcript?.trim();

      // As customer clicked confirm we stopped listening to their voice
      await SpeechRecognition.stopListening();

      // If customer didn't talk anything then returning
      if (!trimmedText) {
        return;
      }

      // Making API request to search products based on customer's voice text
      const productsRes = await getProductsByVoiceSearch(trimmedText).unwrap();

      // Resetting (or) clearing the transcript (transcript = customer's voice text)
      resetTranscript();

      setProductsHandler(productsRes?.products);
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  useEffect(() => {
    // If microphone is not turned on, then requesting user to turn it on
    if (browserSupportsSpeechRecognition && !isMicrophoneAvailable) {
      toast.error(
        "Please turn on your microphone to search products using voice!"
      );
    }
  }, [browserSupportsSpeechRecognition, isMicrophoneAvailable]);

  // VoiceSearch can be only used when browser supports Speech Recognition
  return (
    browserSupportsSpeechRecognition && (
      <motion.div
        className="flex items-start flex-col gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{
          delay: 0.2,
        }}
      >
        <div className="cursor-pointer border rounded-full p-2 bg-black text-white">
          {listening && (
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{
                repeat: Infinity,
                duration: 1,
              }}
            >
              <BsMicFill size={28} onClick={stopListener} />
            </motion.div>
          )}

          {!listening && <BsMic size={28} onClick={startListener} />}
        </div>

        {/* Showing transcript only if customer is speaking */}
        {transcript?.trim() && (
          <div className="border rounded-md py-2 px-3 space-y-1.5 w-56">
            <p className="text-sm text-neutral-600">{transcript}</p>
            <div className="flex items-center justify-end gap-3">
              {/* Resetting the transcript to speak again */}
              <Tooltip title="Try speaking again" arrow>
                <button
                  className="text-sm text-[#f1f1f1] bg-neutral-700 py-0.5 px-3 rounded"
                  onClick={resetListener}
                >
                  Retry
                </button>
              </Tooltip>

              {/* Confirming the final text */}
              <Tooltip
                title="Do you confirm that your speech is correct?"
                arrow
              >
                <button
                  className="text-sm text-[#f1f1f1] bg-neutral-700 py-0.5 px-3 rounded"
                  onClick={searchProductsHandler}
                >
                  Confirm
                </button>
              </Tooltip>
            </div>
          </div>
        )}
      </motion.div>
    )
  );
};

export default memo(VoiceSearch);
