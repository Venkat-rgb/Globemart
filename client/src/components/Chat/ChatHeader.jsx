import { Tooltip } from "@mui/material";
import LazyImage from "../LazyImage";

const ChatHeader = ({
  profileImg,
  isCustomerOnline,
  username,
  receiverId,
  socketReceiverId,
  isTyping,
}) => {
  return (
    <div className="border-b h-[3.5rem] px-7 py-1.5 flex items-center justify-between bg-white">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 relative w-10 h-10">
          {/* User profile Image */}
          {/* <Avatar
            src={profileImg}
            alt="profile-img"
            sx={{
              width: 40,
              height: 40,
              cursor: "pointer",
              border: "1px solid #f1f1f1",
            }}
          /> */}

          <LazyImage
            imageProps={{
              src: profileImg,
              alt: "profile-img",
            }}
            styleProp="border rounded-full"
            skeletonVariant="circular"
            skeletonWidth={40}
            skeletonHeight={40}
          />

          {/* Checking if user is online (or) offline */}
          <Tooltip
            title={isCustomerOnline ? "Online" : "Offline"}
            placement="top"
          >
            <div
              className={`absolute ${
                isCustomerOnline ? "bg-green-500" : "bg-neutral-400"
              } top-0 right-0 w-3 h-3 border border-white rounded-full`}
            />
          </Tooltip>
        </div>
        <div>
          <p className="text-neutral-500 font-medium capitalize max-[500px]:text-sm">
            {username}
          </p>
          <p className="text-green-500 font-medium text-sm transition-all duration-200">
            {/* Only showing typing status of user to admin and not to all other chats on admin dashboard */}
            {receiverId === socketReceiverId && isTyping && "typing..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
