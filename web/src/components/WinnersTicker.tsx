"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type WinnerItem = {
  id: number;
  username: string;
  game: "Coinflip (Instant)" | "Coinflip (Multiply)";
  amount: number; // in USD (or site currency)
};

const NAMES_LEFT = [
  "Lucky",
  "Crypto",
  "Spin",
  "Flip",
  "Shadow",
  "Neon",
  "Nova",
  "Aqua",
  "Vortex",
  "Pixel",
  "Luna",
  "Echo",
  "Blitz",
  "Frost",
  "Jet",
];
const NAMES_RIGHT = [
  "Wolf",
  "Rider",
  "Whale",
  "Hunter",
  "Master",
  "Ace",
  "Guru",
  "Maker",
  "Wizard",
  "Knight",
  "Queen",
  "King",
  "Ninja",
  "Ghost",
  "Phoenix",
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomUsername(): string {
  const left = NAMES_LEFT[randomInt(0, NAMES_LEFT.length - 1)];
  const right = NAMES_RIGHT[randomInt(0, NAMES_RIGHT.length - 1)];
  const num = randomInt(10, 9999);
  return `${left}${right}${num}`;
}

function pickGame(): WinnerItem["game"] {
  // Bias towards Multiply per request
  return Math.random() < 0.7 ? "Coinflip (Multiply)" : "Coinflip (Instant)";
}

function computeAmount(game: WinnerItem["game"]): number {
  // Generate a random base bet and apply multiplier by game type
  // Instant: lower amounts around 3.8x
  // Multiply: higher amounts around 15.56x
  if (game === "Coinflip (Instant)") {
    const base = randomInt(2, 12); // small base stake
    const multiplier = 3.8;
    return Math.round(base * multiplier * 100) / 100;
  } else {
    const base = randomInt(3, 20); // medium base stake
    const multiplier = 15.56;
    return Math.round(base * multiplier * 100) / 100;
  }
}

export default function WinnersTicker({ className }: { className?: string }) {
  const [items, setItems] = useState<WinnerItem[]>([]);
  const idRef = useRef(1);
  const mountedAt = useMemo(() => Date.now(), []);
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    function pushRandom() {
      if (cancelled) return;
      const game = pickGame();
      const item: WinnerItem = {
        id: idRef.current++,
        username: randomUsername(),
        game,
        amount: computeAmount(game),
      };
      setItems((prev) => {
        const next = [item, ...prev];
        // If more than 2, fade out the oldest (last) before trimming
        if (next.length > 2) {
          const oldest = next[next.length - 1];
          setRemovingId(oldest.id);
          // trim after fade
          window.setTimeout(() => {
            setItems((curr) => curr.slice(0, 2));
            setRemovingId(null);
          }, 420);
        }
        return next;
      });
      // schedule next between 2.5s and 6s
      const nextDelay = randomInt(2500, 6000);
      timer = window.setTimeout(pushRandom, nextDelay);
    }
    // Stagger first show quickly after mount
    let timer = window.setTimeout(pushRandom, 900);
    return () => {
      cancelled = true;
      try { window.clearTimeout(timer); } catch {}
    };
  }, [mountedAt]);

  return (
    <div className={"winners-wrap winners-fixed " + (className ?? "")}> 
      <div className="winners-stream">
        {items.map((w) => (
          <div key={w.id} className={"winner-toast reveal-pop" + (removingId === w.id ? " fade-out" : "") }>
            <div className="toast-dot" />
            <div className="toast-text">
              <span className="toast-user">{w.username}</span>
              <span className="toast-sep">–</span>
              <span className="toast-game">{w.game}</span>
              <span className="toast-sep">–</span>
              <span className="toast-amt">${w.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


