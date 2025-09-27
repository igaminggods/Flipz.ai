"use client";
import { useState } from "react";
import GlowCard from "@/components/GlowCard";

type Item = { q: string; a: string };

const items: Item[] = [
  {
    q: "How does Flipz AI’s scanning system actually work?",
    a: "Flipz AI uses advanced machine learning algorithms to analyze real-time Coin Flip data. Our system detects temporary anomalies in outcome patterns that highlight irregularities in the game’s behavior.",
  },
  {
    q: "Is using Flipz AI legal?",
    a: "Yes, Flipz AI is completely legal. We analyze publicly available Coin Flip data and highlight statistical patterns. There’s no hacking or system manipulation, it is just informed decisions based on mathematical analysis.",
  },
  {
    q: "How accurate are the scan predictions?",
    a: "Flipz AI has demonstrated over 86% accuracy in detecting profitable Coin Flip anomalies. Still, gambling carries inherent risk, and past accuracy does not guarantee future outcomes.",
  },
  {
    q: "Why can I only scan once per day for free?",
    a: "Free scans are limited to guarantee fair access for all users and preserve the accuracy of our AI analysis.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="container-max py-16 text-center">
      <h2 className="section-title mb-8">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {items.map((it, idx) => (
          <GlowCard key={it.q}>
            <button
              className="relative w-full p-5 flex items-center justify-center"
              onClick={() => setOpen(open === idx ? null : idx)}
            >
              <span className="font-semibold text-center">{it.q}</span>
              <span className="text-white/60 absolute right-5">{open === idx ? "▾" : "▸"}</span>
            </button>
            {open === idx && (
              <div className="p-5 pt-0 subtle">{it.a}</div>
            )}
          </GlowCard>
        ))}
      </div>
    </section>
  );
}


