import { motion } from "framer-motion";

// className={`w-full py-4 px-6 shadow-lg flex items-center flex-col gap-5 ${
//   i === 2 ? "max-[1024px]:col-span-2" : ""
// } ${backgroundColor} rounded-lg`}

const BenefitItem = ({ i, title, desc, icon, backgroundColor }) => {
  return (
    <motion.div
      className={`w-full py-4 px-6 shadow-lg flex items-center flex-col gap-5 ${
        i === 2 ? "max-[1024px]:col-span-2 max-[640px]:col-span-1" : ""
      } ${backgroundColor} rounded-lg`}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ delay: i * 0.1 }}
    >
      {/* Displaying icon */}
      <motion.div
        className="bg-white p-5 rounded-full drop-shadow-lg"
        whileHover={{ scale: 1.12 }}
      >
        {icon}
      </motion.div>

      <div className="space-y-1">
        {/* Displaying title */}
        <p className="font-semibold font-inter text-center text-white text-lg drop-shadow">
          {title}
        </p>

        {/* Explaining what are the benefits of this ecommerce */}
        <p className="font-inter text-sm text-center text-neutral-50 leading-relaxed">
          {desc}
        </p>
      </div>
    </motion.div>
  );
};

export default BenefitItem;
