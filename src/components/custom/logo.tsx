"use client";

import Link from "next/link";
import { motion } from "framer-motion";


const cx = 32, cy = 32, step = 9, s = 3.5, dur = 6;
const ring3 = [
  [0, -3], [1, -3], [2, -3], [3, -3], [3, -2], [3, -1],
  [3, 0], [2, 1], [1, 2], [0, 3], [-1, 3], [-2, 3],
  [-3, 3], [-3, 2], [-3, 1], [-3, 0], [-2, -1], [-1, -2]
];
const ring2 = [
  [0, -2], [1, -2], [2, -2], [2, -1], [2, 0], [1, 1],
  [0, 2], [-1, 2], [-2, 2], [-2, 1], [-2, 0], [-1, -1]
];
const ring1 = [[0, -1], [1, -1], [1, 0], [0, 1], [-1, 1], [-1, 0]];
const ring0 = [[0, 0]];

const all = [...ring3, ...ring2, ...ring1, ...ring0];
const stepD = dur / all.length;

export default function Logo() {
  return (
    <Link href="/" className="flex items-center group">
      <motion.div
        className="flex items-center justify-center gap-1"
        initial={{ opacity: 0, y: -10, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <SciBitHubIcon />
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

export function SciBitHubIcon() {
  return (
    <motion.div
      className="relative w-7 h-7 flex items-center justify-center mr-2"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
    >
      <svg width="28" height="28" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        {all.map(([q, r], i) => {
          const [x, y] = ax2px(q, r);
          const delay = i * stepD;
          const sz = i === 36 ? s + 1 : s;
          return (
            <g key={i}>
              <motion.polygon
                className={ringClass(i)}
                points={diamond(x, y, sz)}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{
                  repeat: Infinity,
                  duration: dur,
                  delay,
                  ease: "easeInOut",
                  times: [0, 0.1, 0.22],
                }}
              />
              {i === 36 && (
                <motion.polygon
                  className="fill-green"
                  points={diamond(x, y, 2)}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{
                    repeat: Infinity,
                    duration: dur,
                    delay,
                    ease: "easeInOut",
                    times: [0, 0.1, 0.22],
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>
    </motion.div>
  );
}

function ax2px(q: number, r: number) {
  return [cx + step * (q + r * 0.5), cy + step * (r * 0.866)];
}

function diamond(x: number, y: number, size: number) {
  return `${x},${y - size} ${x + size},${y} ${x},${y + size} ${x - size},${y}`;
}

const ringClass = (i: number) =>
  i < 18 ? "fill-green" :
    i < 30 ? "fill-primary" :
      i < 36 ? "fill-green" :
        "fill-primary";