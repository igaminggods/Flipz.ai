"use client";
import { useState } from "react";

export default function CoinflipGame({ className = "", maxFlips }: { className?: string; maxFlips?: number }){
  const [result, setResult] = useState<"head"|"tail"|null>(null);
  const [spinning, setSpinning] = useState(false);
  const [count, setCount] = useState(0);

  function flip(){
    if (typeof maxFlips === 'number' && count >= maxFlips) return;
    setSpinning(true);
    setResult(null);
    const r = Math.random() < 0.5 ? "head" : "tail";
    setTimeout(()=>{ setResult(r); setSpinning(false); setCount(c => c + 1); }, 900);
  }

  return (
    <section className={`container-max py-8 text-center ${className}`}>
      <div className="flip-area">
        <img src="/api/coinflip/image/flipbg" alt="" className="flip-img" />
        <div className="flip-dim" />
        <div className="coin-wrap">
          <div className="coin-spot">
            <div className="coin-inner" style={{transform: spinning ? 'rotateY(900deg)' : result === 'tail' ? 'rotateY(180deg)' : 'rotateY(0deg)'}}>
              <div className="coin-face coin-head">
                <img src="/api/coinflip/image/head" alt="Head" />
              </div>
              <div className="coin-face coin-tail">
                <img src="/api/coinflip/image/tail" alt="Tail" />
              </div>
            </div>
          </div>
        </div>
        <div className="flip-cta">
          <button className="btn-play btn-xl" onClick={flip} disabled={spinning || (typeof maxFlips === 'number' && count >= maxFlips)}>{spinning?"FLIPPING…": (typeof maxFlips === 'number' ? (count >= maxFlips ? "LOCKED" : `PLAY (${maxFlips - count})`) : "PLAY")}</button>
        </div>
      </div>
    </section>
  );
}


