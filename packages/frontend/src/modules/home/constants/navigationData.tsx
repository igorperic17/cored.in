import { ROUTES } from "@/router/routes";
import {
  FaGear,
  FaHouse,
  FaPaperPlane,
  FaUser,
  FaCertificate,
  FaBinoculars
} from "react-icons/fa6";

export const navigationData = (wallet: string) => [
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
    title: "credentials",
    icon: FaCertificate,
    link: ROUTES.CREDENTIALS.path
  },
  {
    title: "subscriptions",
    icon: FaBinoculars,
    link: ROUTES.SUBSCRIPTIONS.path
  },
  {
    title: "profile",
    icon: FaUser, // maybe replace with a user avatar
    link: ROUTES.USER.buildPath(wallet)
  },
  {
    title: "settings",
    icon: FaGear,
    link: ROUTES.SETTINGS.path
  }
];
