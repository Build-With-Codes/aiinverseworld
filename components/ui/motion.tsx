"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

const easeOut = [0.16, 1, 0.3, 1] as const;

/**
 * `useReducedMotion` can resolve synchronously on the client (from
 * `matchMedia`) while SSR always sees `null`, so branching render output on
 * it directly causes a hydration mismatch. Gating on `mounted` keeps the
 * first client render identical to the server's, deferring the reduced-motion
 * swap to a normal post-hydration update.
 */
function useSettledReducedMotion() {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setMounted(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  return mounted && Boolean(prefersReducedMotion);
}

type FadeInSectionProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  id?: string;
};

export function FadeInSection({ children, delay = 0, className = "", y = 24, id }: FadeInSectionProps) {
  const shouldReduceMotion = useSettledReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      id={id}
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

export function StaggerGrid({ children, className = "" }: { children: ReactNode; className?: string }) {
  const shouldReduceMotion = useSettledReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}

export function HoverLift({ children, className = "" }: { children: ReactNode; className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      whileHover={shouldReduceMotion ? undefined : { y: -6 }}
      transition={{ duration: 0.25, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}
