"use client";
import { useEffect, useMemo, useState } from "react";

type Mode = "instant" | "multiply";

const LOCK_KEY = "slots_lock_until";

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
    if (typeof window === 'undefined') return;
    const onScanCompleted = () => {
      try {
        const raw = localStorage.getItem(storageKey);
        const next = raw ? parseInt(raw, 10) : Date.now() + defaultMs;
        if (!Number.isNaN(next)) setEnd(next);
      } catch {}
    };
    window.addEventListener('scan-completed', onScanCompleted);
    return () => window.removeEventListener('scan-completed', onScanCompleted);
  }, [storageKey, defaultMs]);

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
  return `${h.toString().padStart(2, "0")}h ${m
    .toString()
    .padStart(2, "0")}m ${ss.toString().padStart(2, "0")}s`;
}

export default function SlotsCards() {
  const { remaining: remA } = useCountdown("patch_timer_instant", (1 * 60 + 13) * 60 * 1000);
  const { remaining: remB } = useCountdown("patch_timer_multiply", (1 * 60 + 16) * 60 * 1000);

  const [lockUntil, setLockUntil] = useState<number | null>(null);
  const disableLocks = false;

  // Randomized scan content for slots page
  const GAMES = [
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
  const BONUS_BUYS = [20, 40, 60, 80, 100, 120];

  type ScanConfig = { gameName: string; bonusBuy: number; totalX: number };
  const [scanA, setScanA] = useState<ScanConfig | null>(null);
  const [scanB, setScanB] = useState<ScanConfig | null>(null);

  function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function pick<T>(arr: T[]): T { return arr[randomInt(0, arr.length - 1)]; }

  function genScans() {
    // pick bonus buys where A < B
    const idxB = randomInt(1, BONUS_BUYS.length - 1);
    const idxA = randomInt(0, idxB - 1);
    const bonusA = BONUS_BUYS[idxA];
    const bonusB = BONUS_BUYS[idxB];

    // total return between 3x and 11x, A < B
    const totalA = Math.round((Math.random() * (5.5 - 3.0) + 3.0) * 100) / 100; // ~3.0–5.5x
    const totalB = Math.round((Math.random() * (11.0 - 6.0) + 6.0) * 100) / 100; // ~6.0–11.0x

    // distinct games if possible
    const gameA = pick(GAMES);
    let gameB = pick(GAMES);
    if (gameB === gameA) gameB = pick(GAMES);

    setScanA({ gameName: gameA, bonusBuy: bonusA, totalX: totalA });
    setScanB({ gameName: gameB, bonusBuy: bonusB, totalX: totalB });
  }

  useEffect(() => { genScans(); }, []);
  useEffect(() => {
    const onScan = () => genScans();
    window.addEventListener('scan-completed', onScan);
    return () => window.removeEventListener('scan-completed', onScan);
  }, []);

  const [gatewayHref, setGatewayHref] = useState(
    "https://track.padrinopartners.com/visit/?bta=35286&brand=needforslots&utm_campaign=slots"
  );
  const [eventId, setEventId] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const qs = new URLSearchParams(window.location.search);
      const afp1 = qs.get('afp1');
      const afp10 = qs.get('afp10') || 'Facebook';
      const fbp = (document.cookie.split('; ').find((x) => x.startsWith('_fbp=')) || '').split('=')[1];
      const fbc = (document.cookie.split('; ').find((x) => x.startsWith('_fbc=')) || '').split('=')[1];
      if (afp1) {
        document.cookie = `_clid=${encodeURIComponent(afp1)};path=/;max-age=${60 * 60 * 24 * 90}`;
      }
      const base = "https://track.padrinopartners.com/visit/?bta=35286&brand=needforslots&utm_campaign=slots";
      const out = `${base}&afp1=${encodeURIComponent(afp1 || '')}&afp10=${encodeURIComponent(afp10)}${fbp ? `&fbp=${encodeURIComponent(fbp)}` : ''}${fbc ? `&fbc=${encodeURIComponent(fbc)}` : ''}`;
      setGatewayHref(out);
      setEventId(afp1 || undefined);
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (disableLocks) {
      try {
        localStorage.removeItem(LOCK_KEY);
      } catch {}
      setLockUntil(null);
      return;
    }
    const l = localStorage.getItem(LOCK_KEY);
    const lParsed = l ? parseInt(l, 10) : null;
    setLockUntil(lParsed && !Number.isNaN(lParsed) ? lParsed : null);
  }, [disableLocks]);

  useEffect(() => {
    if (!lockUntil) return;
    const id = setInterval(() => {
      if (Date.now() > lockUntil) {
        setLockUntil(null);
        try {
          localStorage.removeItem(LOCK_KEY);
        } catch {}
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

  const card = (
    title: string,
    accuracy: number,
    remaining: number,
    mode: Mode,
    cfg: ScanConfig
  ) => {
    const isLocked = !disableLocks && lockRemaining > 0;
    return (
      <div className={`scan-card`}>
        <div className="flex items-center justify-between mb-3">
          <div className="scan-header">
            <span>⚡</span>
            <span>{title}</span>
          </div>
          <span className="scan-status">● ACTIVE</span>
        </div>

        <div className="scan-slot mb-4">
          <span>🎮 GAME NAME:</span>
          <span>{cfg.gameName}</span>
        </div>

        <p className="subtle text-xs md:text-sm mb-3 text-left">
          Optimized bonus window detected for {cfg.gameName}. Use the configured bonus buy while the window remains open.
        </p>

        <div className="scan-row">
          <div className="scan-label">💶 Bonus buy:</div>
          <div className="scan-value">€{cfg.bonusBuy}</div>
        </div>
        <div className="scan-row">
          <div className="scan-label">🔥 Total Return:</div>
          <div className="scan-value pill-badge">{`x${cfg.totalX}`}</div>
        </div>
        <div className="scan-row">
          <div className="scan-label">⏱ Time Until Patch:</div>
          <div className={`scan-value ${remaining <= 0 ? 'pill-danger' : 'pill-badge'}`}>
            {remaining <= 0 ? (
              'PATCHED'
            ) : (
              <span className="tabular-nums" style={{ display: 'inline-block', minWidth: '10ch' }}>
                {format(remaining)}
              </span>
            )}
          </div>
        </div>
        <div className="scan-row">
          <div className="scan-label">📈 Scan Accuracy:</div>
          <div className="scan-value">{accuracy}%</div>
        </div>

        <div className="scan-actions">
          {isLocked ? (
            <button className="btn-muted" disabled>
              Locked · <span className="tabular-nums" style={{ display: 'inline-block', minWidth: '10ch' }}>{format(lockRemaining)}</span>
            </button>
          ) : (
            <a
              className="btn-primary"
              href={gatewayHref}
              target="_blank"
              rel="nofollow noopener noreferrer"
              onClick={() => {
                // apply 24h lock on click
                const until = Date.now() + 24 * 60 * 60 * 1000;
                try {
                  localStorage.setItem(LOCK_KEY, String(until));
                  setLockUntil(until);
                } catch {}
                try {
                  const fbq =
                    typeof window !== 'undefined'
                      ? (window as unknown as { fbq?: (event: string, name: string, ...args: unknown[]) => void; }).fbq
                      : undefined;
                  if (typeof fbq === 'function') {
                    fbq('trackCustom', 'GatewayAccessClick', { event_id: eventId });
                  }
                } catch {}
              }}
            >
              Access Gateway Link
            </a>
          )}
          {remaining <= 0 && <button className="btn-danger">✖ Window closed</button>}
        </div>
      </div>
    );
  };

  return (
    <div className="grid md:grid-cols-2 gap-3 md:gap-6">
      {scanA && card(
        "SLOTS SCAN #1",
        89,
        remA,
        "instant",
        scanA
      )}

      {scanB && card(
        "SLOTS SCAN #2",
        93,
        remB,
        "multiply",
        scanB
      )}
    </div>
  );
}



