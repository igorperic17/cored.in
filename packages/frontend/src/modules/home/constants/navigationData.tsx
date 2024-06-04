import { ROUTES } from "@/router/routes";
import { FaGear, FaHouse, FaPaperPlane, FaUser } from "react-icons/fa6";

export const navigationData = [
  {
    title: "home",
    icon: FaHouse,
    link: ROUTES.HOME.path
  },
  {
    title: "messages",
    icon: FaPaperPlane,
    link: "#"
  },
  {
    title: "profile",
    icon: FaUser, // maybe replace with a user avatar
    link: ROUTES.USER.path
  },
  {
    title: "settings",
    icon: FaGear,
    link: "#"
  }
];
