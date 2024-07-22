import LazyImage from "../../LazyImage";
import chatImg from "../../../assets/images/basic/chat.svg";

const ChooseChatBanner = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-7 w-full h-full bg-gradient-to-br from-indigo-300 via-indigo-500 to-indigo-700">
      <div className="w-44 h-44">
        <LazyImage
          imageProps={{
            src: chatImg,
            alt: `chat-wallpaper`,
          }}
          skeletonWidth={176}
          skeletonHeight={176}
        />
      </div>

      <p className="text-2xl max-[500px]:text-xl font-public-sans font-medium text-white max-w-[55%] text-center">
        Please choose a chat to start conversation with customers!
      </p>
    </div>
  );
};

export default ChooseChatBanner;
