"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type WinnerItem = {
  id: number;
  username: string;
  game: string;
  amount: number;
};

const NAMES_LEFT = [
  "Lucky","Crypto","Spin","Flip","Shadow","Neon","Nova","Aqua","Vortex","Pixel","Luna","Echo","Blitz","Frost","Jet",
];
const NAMES_RIGHT = [
  "Wolf","Rider","Whale","Hunter","Master","Ace","Guru","Maker","Wizard","Knight","Queen","King","Ninja","Ghost","Phoenix",
];

function randomInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomUsername(): string { const left = NAMES_LEFT[randomInt(0, NAMES_LEFT.length - 1)]; const right = NAMES_RIGHT[randomInt(0, NAMES_RIGHT.length - 1)]; const num = randomInt(10, 9999); return `${left}${right}${num}`; }

const SLOT_GAMES = [
  "Gates of Olympus",
  "Gates of Olympus 1000",
  "Sweet Bonanza",
  "Sweet Bonanza Xmas",
  "Sugar Rush",
  "Sugar Rush 1000",
  "The Dog House",
  "The Dog House Megaways",
  "Big Bass Bonanza",
  "Bigger Bass Bonanza",
  "Big Bass Splash",
  "Big Bass Amazon Xtreme",
  "Big Bass Hold & Spinner",
  "Starlight Princess",
  "Starlight Princess 1000",
  "Fruit Party",
  "Fruit Party 2",
];
function pickGame(): string { return SLOT_GAMES[randomInt(0, SLOT_GAMES.length - 1)]; }

function computeAmount(): number {
  // Ensure winnings > €200. Model as bet (40–120€) * multiplier (5.0–16.0x).
  const bet = randomInt(40, 120);
  const multiplier = 5 + Math.random() * 11; // 5.0–16.0x
  const amt = bet * multiplier;
  return Math.round(amt * 100) / 100;
}

export default function WinnersTickerSlots({ className }: { className?: string }) {
  const idRef = useRef(1);
  const mountedAt = useMemo(() => Date.now(), []);

  const [topItem, setTopItem] = useState<WinnerItem | null>(null);
  const [bottomItem, setBottomItem] = useState<WinnerItem | null>(null);

  const createItem = (): WinnerItem => {
    const game = pickGame();
    return {
      id: idRef.current++,
      username: randomUsername(),
      game,
      amount: computeAmount(),
    };
  };

  useEffect(() => {
    // initialize two fixed slots immediately
    setTopItem(createItem());
    setBottomItem(createItem());
  }, [mountedAt]);

  useEffect(() => {
    let cancelled = false;
    function advance() {
      if (cancelled) return;
      // Simple swap without animation; slower cadence
      setTopItem(() => bottomItem ?? createItem());
      setBottomItem(() => createItem());
      const nextDelay = randomInt(3600, 4600); // ~4s transitions
      timer = window.setTimeout(advance, nextDelay);
    }
    let timer = window.setTimeout(advance, 4000);
    return () => { cancelled = true; try { window.clearTimeout(timer); } catch {} };
  }, [bottomItem]);

  return (
    <div className={"winners-wrap winners-fixed " + (className ?? "")}> 
      <div className="winners-stream" style={{transform: 'translate3d(0,0,0)'}}>
        <div className="winner-toast">
          {topItem && (
            <div className="toast-text">
              <span className="toast-user">{topItem.username}</span>
              <span className="toast-sep">–</span>
              <span className="toast-game">{topItem.game}</span>
              <span className="toast-sep">–</span>
              <span className="toast-amt">€{topItem.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          )}
        </div>
        <div className="winner-toast">
          {bottomItem && (
            <div className="toast-text">
              <span className="toast-user">{bottomItem.username}</span>
              <span className="toast-sep">–</span>
              <span className="toast-game">{bottomItem.game}</span>
              <span className="toast-sep">–</span>
              <span className="toast-amt">€{bottomItem.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



