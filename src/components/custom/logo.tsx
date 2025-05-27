"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="flex items-center justify-center">
        <motion.div
          className="text-2xl font-extrabold flex items-center gap-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <CircuitIcon />
          <motion.div
            className="flex gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <span className="text-primary">S</span>
            <span className="">c</span>
            <span className="+">i</span>
            <span className="text-green">B</span>
            <span className="">i</span>
            <span className="">t</span>
            <span className="text-primary">H</span>
            <span className="">u</span>
            <span className="">b</span>
          </motion.div>
        </motion.div>
      </div>
    </Link>
  );
}

const CircuitIcon = () => {
  return (
    <motion.div
      className="relative w-8 h-8 bg-background/80 rounded-sm shadow-lg border border-primary/40"
      animate={{ rotate: 360, scale: [0.5, 0.8, 0.5] }}
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
    >
      <div className="absolute top-0 left-1/2 w-0.5 h-2 bg-green animate-pulse" />
      <div className="absolute top-1/2 left-0 h-0.5 w-2 bg-primary animate-pulse" />
      <div className="absolute bottom-0 left-1/2 w-0.5 h-2 bg-green/70 animate-pulse" />
      <div className="absolute top-1/2 right-0 h-0.5 w-2 bg-primary/70 animate-pulse" />

      <div className="absolute w-1.5 h-1.5 bg-green rounded-full top-0 left-0" />
      <div className="absolute w-1.5 h-1.5 bg-primary rounded-full bottom-0 left-0" />
      <div className="absolute w-1.5 h-1.5 bg-green rounded-full bottom-0 right-0" />
      <div className="absolute w-1.5 h-1.5 bg-primary rounded-full top-0 right-0" />

      <div className="absolute inset-2 border border-dashed border-primary/60 rounded-sm" />
    </motion.div >
  );
}
