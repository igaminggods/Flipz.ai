"use client";

import type { ReactNode } from "react";

type GlowCardProps = {
  children: ReactNode;
  className?: string;
};

export default function GlowCard({ children, className }: GlowCardProps) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--x", `${x}px`);
    e.currentTarget.style.setProperty("--y", `${y}px`);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.removeProperty("--x");
    e.currentTarget.style.removeProperty("--y");
  };

  const composedClassName = [
    "rounded-xl",
    "p-4",
    "bg-gradient-to-b from-white/5 to-white/0",
    "border border-white/10",
    "shadow-[0_0_40px_rgba(0,0,0,0.25)]",
    "glow-card",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={composedClassName} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>{children}</div>;
}



