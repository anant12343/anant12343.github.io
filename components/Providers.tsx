"use client";
import { MotionConfig } from "framer-motion";

/** reducedMotion="user": Framer Motion drops transforms when the OS asks for reduced motion. */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
