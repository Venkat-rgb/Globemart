import { motion } from "framer-motion";

const ProfileFormat = ({ title, value }) => {
  return (
    <motion.div
      className="flex flex-col gap-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p className="font-semibold text-neutral-600">{title}: </p>
      <p className="border rounded py-2 px-4">{value}</p>
    </motion.div>
  );
};

export default ProfileFormat;
