export const pageVariants = {
  initial: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.5 }
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 }
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.5 }
  }
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

export const itemFadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};
