import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import InventoryIcon from "@mui/icons-material/Inventory";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import RateReviewIcon from "@mui/icons-material/RateReview";
import DiscountIcon from "@mui/icons-material/Discount";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";

// text-[#7451f8]
export const sidebarCategories = [
  {
    title: "Dashboard",
    icon: <DashboardIcon className="text-neutral-600" />,
    url: "/admin/dashboard",
  },
  {
    title: "Products",
    icon: <InventoryIcon className="text-neutral-600" />,
    url: "/admin/products",
  },
  {
    title: "Coupons",
    icon: <DiscountIcon className="text-neutral-600" />,
    url: "/admin/coupons",
  },
  {
    title: "Orders",
    icon: <FormatListBulletedIcon className="text-neutral-600" />,
    url: "/admin/orders",
  },
  {
    title: "Users",
    icon: <GroupIcon className="text-neutral-600" />,
    url: "/admin/users",
  },
  {
    title: "Chats",
    icon: <SmsOutlinedIcon className="text-neutral-600" />,
    url: "/admin/chats",
  },
  {
    title: "Reviews",
    icon: <RateReviewIcon className="text-neutral-600" />,
    url: "/admin/reviews",
  },
];
