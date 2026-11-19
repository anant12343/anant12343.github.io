"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";

// The very first page load is not animated (so content paints immediately and LCP isn't delayed);
// every client-side navigation after that, e.g. clicking into a case study, slides the new page up.
let firstLoad = true;

export default function Template({ children }: { children: React.ReactNode }) {
  const animateIn = !firstLoad;
  useEffect(() => {
    firstLoad = false;
  }, []);
  return (
    <motion.div
      initial={animateIn ? { opacity: 0, y: 24 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
