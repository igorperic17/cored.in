export const fadeInAnimation = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: { duration: 2 }
  }
};

export const fadeInWithDelayAnimation = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: { duration: 2, delay: 0.7 }
  }
};

export const appearFromRightAnimation = {
  initial: {
    opacity: 0,
    x: 300
  },
  animate: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      delay: 0.2 * index
    }
  })
};
