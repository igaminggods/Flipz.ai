"use client";
import { useEffect, useMemo, useState } from "react";

const SCAN_LOCK_KEY = "slots_scan_lock_until";

function getRemainingMs(until: number | null) {
  if (!until) return 0;
  return Math.max(0, until - Date.now());
}

export default function ScanLockSlots() {
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [scanning, setScanning] = useState(false);
  const disableLocks = false;
  const steps = [
    "Scanning casino database…",
    "Analyzing slot algorithms…",
    "Extracting optimal betting strategies…",
  ];
  const [stepIdx, setStepIdx] = useState(0);
  const [nowTick, setNowTick] = useState<number>(Date.now());

  useEffect(() => {
    if (disableLocks) {
      try { localStorage.removeItem(SCAN_LOCK_KEY); } catch {}
      setLockedUntil(null);
      return;
    }
    const raw = localStorage.getItem(SCAN_LOCK_KEY);
    setLockedUntil(raw ? parseInt(raw, 10) : null);
  }, []);

  useEffect(() => {
    if (!lockedUntil) return;
    const id = setInterval(() => {
      if (getRemainingMs(lockedUntil) === 0) {
        setLockedUntil(null);
        localStorage.removeItem(SCAN_LOCK_KEY);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [lockedUntil]);

  useEffect(() => {
    const id = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = useMemo(
    () => (disableLocks ? 0 : getRemainingMs(lockedUntil)),
    [lockedUntil, scanning, disableLocks, nowTick]
  );

  const onScan = async () => {
    setScanning(true);
    setStepIdx(0);
    let i = 0;
    const interval = setInterval(() => {
      i = Math.min(i + 1, steps.length - 1);
      setStepIdx(i);
    }, 1000);
    await new Promise((r) => setTimeout(r, 3000));
    setScanning(false);
    try { clearInterval(interval); } catch {}
    if (!disableLocks) {
      const until = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem(SCAN_LOCK_KEY, String(until));
      localStorage.setItem('scan_completed', '1');
      setLockedUntil(until);
    }
    try { window.dispatchEvent(new Event('scan-completed')); } catch {}
    try {
      localStorage.setItem('patch_timer_instant', String(Date.now() + (1 * 60 + 13) * 60 * 1000));
      localStorage.setItem('patch_timer_multiply', String(Date.now() + (1 * 60 + 16) * 60 * 1000));
      window.dispatchEvent(new Event('scan-completed'));
    } catch {}
  };

  const format = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
  };

  const disabled = scanning || (!disableLocks && remaining > 0);

  return (
    <div className="card glow-card p-6 text-center max-w-3xl mx-auto">
      <div className="pill mx-auto mb-3">Free daily scan</div>
      <h2 className="display-title gradient-text mb-6" style={{fontFamily:"var(--font-display)"}}>Scan for Profitable Slot Games</h2>
      {!disableLocks && remaining > 0 ? (
        <div className="space-y-3">
          <div className="text-sm subtle">Scan available again in</div>
          <div className="text-3xl font-bold tabular-nums">
            <span style={{ display: 'inline-block', minWidth: '8ch' }}>{format(remaining)}</span>
          </div>
          <button className="btn-primary" disabled>
            Locked for 24h
          </button>
        </div>
      ) : (
        <>
          <button className="btn-primary" onClick={onScan} disabled={disabled}>
            {scanning ? "SCANNING…" : "SCAN SLOTS"}
          </button>
          {scanning && (
            <p className="subtle mt-3">{steps[stepIdx]}</p>
          )}
        </>
      )}
    </div>
  );
}



