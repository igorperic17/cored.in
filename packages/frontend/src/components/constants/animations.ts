// hero subheading
export const fadeInWithDelayAnimation = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: { duration: 2, delay: 0.6 }
  }
};

// benefit item, progress text
export const appearFromRightOneByOne = {
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

// tech card, progress lines
export const fadeInOneByOne = {
  initial: {
    opacity: 0
  },
  animate: (index: number) => ({
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: 0.3 * index
    }
  })
};

// footer
export const fadeInAnimation = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: { duration: 2 }
  }
};
