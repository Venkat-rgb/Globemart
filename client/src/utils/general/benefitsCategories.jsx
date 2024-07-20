import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import { RiSecurePaymentLine } from "react-icons/ri";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

export const benefitCategories = [
  {
    title: "Enjoy Free Delivery",
    desc: `Shop with us and get your favorite products delivered right to
    your doorstep without any extra cost!`,
    icon: (
      <LocalShippingOutlinedIcon fontSize="large" className="text-orange-500" />
    ),
    backgroundColor: "bg-orange-500",
  },
  {
    title: "30-Day Return Guarantee",
    desc: `Shop confidently knowing that you have a 30-day window to return
    or exchange any item hassle-free.`,
    icon: <CurrencyExchangeIcon fontSize="large" className="text-purple-500" />,
    backgroundColor: "bg-purple-500",
  },
  {
    title: "Secure Payments",
    desc: `Enjoy a seamless shopping experience with secure and encrypted
    payment options.`,
    icon: <RiSecurePaymentLine className="text-[2.2rem] text-green-600" />,
    backgroundColor: "bg-green-600",
  },
];
