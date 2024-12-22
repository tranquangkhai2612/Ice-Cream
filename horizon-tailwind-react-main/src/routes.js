import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import DataTables from "views/admin/tables";
import RTLDefault from "views/rtl/default";
import Membership from "views/admin/membership";
// Auth Imports
import SignIn from "views/auth/SignIn";

// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdPerson,
  MdLock,
} from "react-icons/md";
import { FaAddressBook,FaQuestion  } from "react-icons/fa";
const routes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "Order",
    layout: "/admin",
    path: "order",
    icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    component: <NFTMarketplace />,
    secondary: true,
  },
  {
    name: "Product",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "product",
    component: <DataTables />,
  },
  {
    name: "Feedback",
    layout: "/admin",
    path: "feedback",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
  },
  {
    name: "Membership",
    layout: "/admin",
    path: "membership",
    icon: <FaAddressBook className="h-6 w-6" />,
    component: <Membership />,
  },
  {
    name: "FAQ",
    layout: "/admin",
    path: "faq",
    icon: <FaQuestion  className="h-6 w-6" />,
    component: <Membership />,
  },
  
  
];
export default routes;
