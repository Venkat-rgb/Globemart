import { motion } from "framer-motion";
import FeedOutlinedIcon from "@mui/icons-material/FeedOutlined";
import AddressTag from "./AddressTag";

const ShippingInfo = ({ shippingInfo, customerName }) => {
  return (
    <motion.div
      className="p-3 bg-neutral-50 rounded-xl font-inter space-y-2 h-[170px] overflow-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
    >
      <div className="flex items-center justify-between">
        <p className="text-neutral-400 font-bold border-b-[1px] inline-block">
          SHIPPING INFO
        </p>
        <div
          style={{
            color: "purple",
            backgroundColor: "rgba(128, 0, 128, 0.2)",
          }}
          className="flex-shrink-0 pb-1 px-1 rounded-lg"
        >
          <FeedOutlinedIcon />
        </div>
      </div>

      <AddressTag title="Customer Name" value={customerName} />

      <AddressTag
        title="Country"
        value={`${shippingInfo.country.countryName} (${shippingInfo.country.countryCode})`}
      />

      <AddressTag
        title="State"
        value={`${shippingInfo.state.stateName} (${shippingInfo.state.stateCode})`}
      />

      <AddressTag title="City" value={shippingInfo.city} />

      <AddressTag title="Address" value={shippingInfo.address} />

      <AddressTag title="PhoneNo" value={shippingInfo.phoneNo.phone} />
    </motion.div>
  );
};

export default ShippingInfo;
