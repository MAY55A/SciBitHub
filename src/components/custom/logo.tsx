"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center group">
      <motion.div
        className="flex items-center justify-center gap-2"
        initial={{ opacity: 0, y: -10, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <CircuitIcon />
        <motion.div
          className="flex items-baseline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-green">S</span>ci
            <span className="text-primary">B</span>it
            <span className="text-green">H</span>ub
          </span>
        </motion.div>
      </motion.div>
    </Link>
  );
}

const CircuitIcon = () => {
  return (
    <motion.div
      className="relative w-7 h-7 bg-background rounded-md border border-primary/30 shadow-sm mr-2"
      animate={{ rotate: 360, scale: [0.7, 1, 0.7] }}
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
    >
      {/* Circuit lines */}
      <motion.div
        className="absolute top-0 left-1/2 w-0.5 h-2 bg-green origin-top"
        animate={{
          scaleX: [0.8, 1.2, 0.8],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          delay: 0.2
        }}
      />
      <motion.div
        className="absolute top-1/2 left-0 h-0.5 w-2 bg-primary origin-left"
        animate={{
          scaleX: [0.8, 1.2, 0.8],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          repeat: Infinity,
          duration: 1.8,
          delay: 0.4
        }}
      />
      <motion.div
        className="absolute bottom-0 left-1/2 w-0.5 h-2 bg-green/80 origin-bottom"
        animate={{
          scaleX: [0.8, 1.2, 0.8],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          repeat: Infinity,
          duration: 1.7,
          delay: 0.1
        }}
      />
      <motion.div
        className="absolute top-1/2 right-0 h-0.5 w-2 bg-primary/80 origin-right"
        animate={{
          scaleX: [0.8, 1.2, 0.8],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          repeat: Infinity,
          duration: 1.6,
          delay: 0.3
        }}
      />

      {/* Circuit nodes */}
      <motion.div
        className="absolute w-1.5 h-1.5 bg-green rounded-full top-0 left-0"
        animate={{ scale: [0.8, 1.2, 0.8] }}
        transition={{
          repeat: Infinity,
          duration: 2,
          delay: 0.5
        }}
      />
      <motion.div
        className="absolute w-1.5 h-1.5 bg-primary rounded-full bottom-0 left-0"
        animate={{ scale: [0.8, 1.2, 0.8] }}
        transition={{
          repeat: Infinity,
          duration: 2.2,
          delay: 0.7
        }}
      />
      <motion.div
        className="absolute w-1.5 h-1.5 bg-green rounded-full bottom-0 right-0"
        animate={{ scale: [0.8, 1.2, 0.8] }}
        transition={{
          repeat: Infinity,
          duration: 2.1,
          delay: 0.6
        }}
      />
      <motion.div
        className="absolute w-1.5 h-1.5 bg-primary rounded-full top-0 right-0"
        animate={{ scale: [0.8, 1.2, 0.8] }}
        transition={{
          repeat: Infinity,
          duration: 2.3,
          delay: 0.4
        }}
      />

      {/* Inner dashed border */}
      <motion.div
        className="absolute inset-1 border border-dashed border-primary rounded-sm"
        animate={{
          rotate: [0, -5, 0, 5, 0],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          rotate: {
            repeat: Infinity,
            duration: 5,
            ease: "easeInOut"
          },
          opacity: {
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
          }
        }}
      />
    </motion.div>
  );
};