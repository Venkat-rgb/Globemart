import { motion } from "framer-motion";
import numeral from "numeral";
import { useNavigate } from "react-router-dom";

const DetailCard = ({
  title,
  linkText,
  icon,
  backgroundColor,
  iconColor,
  path,
  i,
  statsData,
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ delay: i * 0.13 }}
      onClick={() => path && navigate(path)}
      className="p-3 drop-shadow-xl rounded-xl space-y-2 bg-neutral-50"
    >
      <div className="flex items-center justify-between">
        {/* Card title */}
        <p className="text-neutral-400 font-semibold font-inter text-sm uppercase">
          {title}
        </p>
        <p className="text-green-600 font-semibold">^ 20%</p>
      </div>

      {/* Card values */}
      <p className="text-xl font-semibold font-inter text-neutral-600">
        {statsData?.title === "earnings"
          ? `₹${numeral(statsData?.value).format("0.0a")}`
          : statsData?.value}
      </p>

      <div className="flex items-end justify-between">
        {/* Card text */}
        <p className="text-sm font-public-sans">{linkText}</p>
        <div
          style={{
            color: iconColor,
            backgroundColor,
          }}
          className={`flex-shrink-0 pb-1 px-1 rounded-lg`}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default DetailCard;
