import { Variants } from "framer-motion";

const duration = 0.5;
const ease = "easeOut";

export const fadeInAnimation: Variants = {
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration, ease }
  },
  hidden: {
    opacity: 0,
    scale: 0.65,
    y: 50,
    transition: { duration, ease }
  }
};

export const fadeUpAnimation: Variants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration, ease }
  },
  hidden: {
    opacity: 0,
    y: 50,
    transition: { duration, ease }
  }
};

export const fadeLeftAnimation: Variants = {
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration, ease }
  },
  hidden: {
    opacity: 0,
    x: 50,
    transition: { duration, ease }
  }
};

export const fadeRightAnimation: Variants = {
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration, ease }
  },
  hidden: {
    opacity: 0,
    x: -50,
    transition: { duration, ease }
  }
};
