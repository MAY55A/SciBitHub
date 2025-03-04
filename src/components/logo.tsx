"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const colors = ["#4D163D", "#840037", "#BD0034", "#BD0034", "#FDB731"];

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <Image
        src="/images/logo-1.png"
        alt="SciBiHub Logo"
        width={100}
        height={100}
        className="w-10 h-10"
      />
      <svg viewBox="0 0 400 100" className="flex align-items w-40 h-10">
        <symbol id="s-text">
          <text textAnchor="middle" x="50%" y="80%" fontSize="40">
            SciBitHub
          </text>
        </symbol>

        <g>
          {colors.map((color, index) => (
            <motion.use
              key={index}
              href="#s-text"
              stroke={color}
              strokeWidth="5"
              fill="none"
              strokeDasharray="6% 29%"
              strokeDashoffset="0%"
              animate={{ strokeDashoffset: ["0%", "-35%"] }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "linear",
                delay: index * -1,
              }}
            />
          ))}
        </g>
      </svg>
    </Link>
  );
}
