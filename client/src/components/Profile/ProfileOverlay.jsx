import { FiEdit } from "react-icons/fi";
import { motion } from "framer-motion";
import LazyImage from "../LazyImage";

const ProfileOverlay = ({ placeOfUse, image, onChange = () => {} }) => {
  return (
    <div className="h-52 relative bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-500 to-neutral-900 shadow-md">
      <div>
        {placeOfUse === "profile" && (
          <p className="pt-20 text-center font-inter text-2xl font-semibold text-neutral-50 drop-shadow max-[640px]:text-xl">
            My Profile
          </p>
        )}
        <div className="w-24 absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full drop-shadow-xl ring ring-slate-300 p-1">
          <div className="w-[90px] h-[90px]">
            <LazyImage
              imageProps={{
                src:
                  placeOfUse === "editProfile" ? (image ? image : "") : image,
                alt: "profile-img",
              }}
              skeletonVariant="circular"
              styleProp="rounded-full"
              skeletonWidth={90}
              skeletonHeight={90}
            />
          </div>
        </div>

        {placeOfUse === "editProfile" && (
          <>
            {/* Selecting new image */}
            <input
              type="file"
              className="hidden"
              id="profile-img"
              name="profileImg"
              onChange={onChange}
            />
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2"
              onClick={() => document.getElementById("profile-img").click()}
            >
              <motion.div
                className="bg-white/70 rounded-full cursor-pointer p-2"
                whileTap={{ scale: 0.9 }}
              >
                <FiEdit className="text-lg" />
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileOverlay;
