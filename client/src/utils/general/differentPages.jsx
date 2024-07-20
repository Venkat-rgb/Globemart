import { RiDashboardFill } from "react-icons/ri";
import { BsFillPersonFill } from "react-icons/bs";
import { MdCategory, MdShoppingCart } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";

export const pages = [
  {
    title: "Dashboard",
    icon: <RiDashboardFill className="text-[1.2rem]" />,
    path: "/admin",
  },
  {
    title: "Products",
    icon: <MdCategory className="text-[1.2rem]" />,
    path: "/products",
  },
  {
    title: "My Wishlist",
    icon: <FaHeart className="text-[1.2rem]" />,
    path: "/wishlist",
  },
  {
    title: "My Orders",
    icon: <TbTruckDelivery className="text-[1.2rem]" />,
    path: "orders",
  },
  {
    title: "Cart",
    icon: <MdShoppingCart className="text-[1.2rem]" />,
    path: "cart",
  },
  {
    title: "Profile",
    icon: <BsFillPersonFill className="text-[1.2rem]" />,
    path: "/profile",
  },
];
