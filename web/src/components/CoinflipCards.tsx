"use client";
import { useEffect, useMemo, useState } from "react";
import GlowCard from "@/components/GlowCard";

type Mode = "instant" | "multiply";

const LOCK_KEY = "coinflip_lock_until"; // locks both after a selection
const SELECTED_KEY = "coinflip_selected"; // which one selected

function useCountdown(storageKey: string, defaultMs: number) {
  const [end, setEnd] = useState<number>(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
    return raw ? parseInt(raw, 10) : Date.now() + defaultMs;
  });

  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    localStorage.setItem(storageKey, String(end));
  }, [end, storageKey]);

  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = Math.max(0, end - now);
  return { remaining, setEnd };
}

function format(ms: number) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return `${h}h ${m}m ${ss}s`;
}

export default function CoinflipCards() {
  const { remaining: remA } = useCountdown("patch_timer_instant", (1 * 60 + 13) * 60 * 1000);
  const { remaining: remB } = useCountdown("patch_timer_multiply", (1 * 60 + 16) * 60 * 1000);

  const [lockUntil, setLockUntil] = useState<number | null>(null);
  const [selected, setSelected] = useState<Mode | null>(null);
  const disableLocks = true;

  useEffect(() => {
    if (disableLocks) {
      try {
        localStorage.removeItem(LOCK_KEY);
        localStorage.removeItem(SELECTED_KEY);
      } catch {}
      setLockUntil(null);
      setSelected(null);
      return;
    }
    const l = localStorage.getItem(LOCK_KEY);
    const s = localStorage.getItem(SELECTED_KEY) as Mode | null;
    setLockUntil(l ? parseInt(l, 10) : null);
    setSelected(s);
  }, []);

  useEffect(() => {
    if (!lockUntil) return;
    const id = setInterval(() => {
      if (Date.now() > lockUntil) {
        setLockUntil(null);
        setSelected(null);
        localStorage.removeItem(LOCK_KEY);
        localStorage.removeItem(SELECTED_KEY);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [lockUntil]);

  const [nowTick, setNowTick] = useState<number>(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const lockRemaining = useMemo(() => disableLocks ? 0 : (lockUntil ? Math.max(0, lockUntil - nowTick) : 0), [lockUntil, disableLocks, nowTick]);

  const handleSelect = (mode: Mode) => {
    if (disableLocks) {
      setLockUntil(null);
      setSelected(mode);
      try { window.dispatchEvent(new CustomEvent('scan-selected', { detail: { mode } })); } catch {}
      return;
    }
    const until = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem(LOCK_KEY, String(until));
    localStorage.setItem(SELECTED_KEY, mode);
    setLockUntil(until);
    setSelected(mode);
    try { window.dispatchEvent(new CustomEvent('scan-selected', { detail: { mode } })); } catch {}
  };

  const card = (
    title: string,
    data: string[],
    accuracy: number,
    remaining: number,
    mode: Mode
  ) => {
    const isLocked = !disableLocks && lockRemaining > 0 && selected !== mode;
    const isSelected = disableLocks ? selected === mode : (selected === mode && lockRemaining > 0);
    return (
      <div className="scan-card">
        <div className="flex items-center justify-between mb-3">
          <div className="scan-header">
            <span>⚡</span>
            <span>{title}</span>
          </div>
          <span className="scan-status">● ACTIVE</span>
        </div>

        <div className="scan-slot mb-4">
          <span>🎮 GAME NAME:</span>
          <span>{mode === "instant" ? "Coinflip (Instant)" : "Coinflip (Multiply)"}</span>
        </div>

        <p className="subtle text-xs md:text-sm mb-3 text-left">
          {mode === "instant"
            ? "In Coinflip (Instant), you start with €20 stake, make two separate flips, and win the multiplier of x3.9 turning your €20 to €78."
            : "In Coinflip (Multiply), you start with a €100 stake, flip the coin four times in a row, and win the multiplier of x15.52, turning your €100 into €1,552."}
        </p>

        <div className="scan-row">
          <div className="scan-label">💶 Bet Value:</div>
          <div className="scan-value">{data[0]}</div>
        </div>
        <div className="scan-row">
          <div className="scan-label">⚡ Number of Flips:</div>
          <div className="scan-value">{mode === "instant" ? 2 : 4}</div>
        </div>
        <div className="scan-row">
          <div className="scan-label">🔥 Total Return:</div>
          <div className="scan-value pill-badge">{data[3]?.replace("Total return: ", "")}</div>
        </div>
        <div className="scan-row">
          <div className="scan-label">⏱ Time Until Patch:</div>
          <div className={`scan-value ${remaining <= 0 ? 'pill-danger' : 'pill-badge'}`}>{remaining <= 0 ? 'PATCHED' : format(remaining)}</div>
        </div>
        <div className="scan-row">
          <div className="scan-label">📈 Scan Accuracy:</div>
          <div className="scan-value">{accuracy}%</div>
        </div>
       

        <div className="scan-actions">
          {isSelected ? (
            <>
              <button className="btn-muted" disabled>{disableLocks ? "Selected" : `Selected · Locked ${format(lockRemaining)}`}</button>
              <a className="btn-primary" href="#gateway" onClick={(e)=>e.preventDefault()}>Access Gateway Link</a>
            </>
          ) : (
            <button className="btn-primary" disabled={isLocked} onClick={() => handleSelect(mode)}>
              {isLocked ? `Locked ${format(lockRemaining)}` : "Select"}
            </button>
          )}
          {remaining <= 0 && <button className="btn-danger">✖ Exploit patched</button>}
        </div>
      </div>
    );
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {card(
        "COINFLIP SCAN #1",
        [
          "€20 per flip",
          "Number of flips: 2",
          "Return per flip: €39",
          "Total return: €78 (x3.9)",
        ],
        89,
        remA,
        "instant"
      )}

      {card(
        "COINFLIP SCAN #2",
        [
          "€100 per game",
          "Number of flips: 4",
          "Return per flip: €39",
          "Total return: €1552 (x15.52)",
        ],
        93,
        remB,
        "multiply"
      )}
    </div>
  );
}


