import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

export const detailCardCategories = [
  {
    title: "users",
    linkText: "See all users",
    icon: <PersonOutlinedIcon fontSize="small" />,
    backgroundColor: "rgba(255, 0, 0, 0.2)",
    iconColor: "crimson",
    price: 100,
    path: "/admin/users",
  },
  {
    title: "products",
    linkText: "See all products",
    icon: <ShoppingCartOutlinedIcon fontSize="small" />,
    backgroundColor: "rgba(218, 165, 32, 0.2)",
    iconColor: "goldenrod",
    price: 50,
    path: "/admin/products",
  },
  {
    title: "orders",
    linkText: "View all orders",
    icon: <FormatListBulletedIcon fontSize="small" />,
    backgroundColor: "rgba(128, 0, 128, 0.2)",
    iconColor: "purple",
    price: 150,
    path: "/admin/orders",
  },
  {
    title: "earnings",
    linkText: "View total earnings",
    icon: <MonetizationOnOutlinedIcon fontSize="small" />,
    backgroundColor: "rgba(0, 128, 0, 0.2)",
    iconColor: "green",
    price: "$2500",
  },
];
