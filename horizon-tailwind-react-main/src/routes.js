import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import Order from "views/admin/order";
import Profile from "views/admin/profile";
import Product from "views/admin/product";
import Book from "views/admin/book";
import CreateBook from "views/admin/book/createBook";
import EditBook from "views/admin/book/editBook";
import Membership from "views/admin/membership";
import FAQ from "views/admin/faq/components/FAQ.jsx";
import CreateRecipe from "views/admin/product/createRecipe";
import EditRecipe from "views/admin/product/editRepice";
 import AddFAQ from "views/admin/faq/components/AddFAQ";
import EditFAQ from "views/admin/faq/components/EditFAQ";
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
    name: "Account Management",
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
    component: <Order />,
    secondary: true,
  },
  {
    name: "Recipe",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "recipe",
    component: <Product />,
  },
  {
    name: "Feedback",
    layout: "/admin",
    path: "feedback",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
  },
  {
    name: "FAQ",
    layout: "/admin",
    path: "faq",
    icon: <FaQuestion  className="h-6 w-6" />,
    component: <FAQ />,
  },
  {
    path: "add-faq",
    layout: "/admin",
    component: <AddFAQ />,
    name: "Create FAQ",
  },
  {
    path: "edit-faq/:id",
    layout: "/admin",
    component: <EditFAQ />,
    name: "Edit FAQ",
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
    component: <FAQ />,
  },
  {
    path: "create-recipe",
    layout: "/admin",
    component: <CreateRecipe />,
    name: "Create Recipe",
  },
  {
    path: "edit-recipe/:id",
    layout: "/admin",
    component: <EditRecipe />,
    name: "Edit Recipe",
  },
  {
    name:"Book",
    layout:"/admin",
    path: "book",
    icon: <FaAddressBook className="h-6 w-6"/>,
    component: <Book/>,
  },
  {
    path: "edit-book/:id",
    layout: "/admin",
    component: <EditBook />,
    name: "Edit Book",
  },
  {
  path: "create-book",
  layout: "/admin",
  component: <CreateBook />,
  name: "Create Book",
  },
];
export default routes;
