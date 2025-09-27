"use client";
import { useState } from "react";

export default function CoinflipPage(){
  const [result, setResult] = useState<"head"|"tail"|null>(null);
  const [spinning, setSpinning] = useState(false);

  async function flip(){
    setSpinning(true);
    setResult(null);
    // simple client RNG for demo; replace with server RNG for fairness
    const r = Math.random() < 0.5 ? "head" : "tail";
    setTimeout(()=>{ setResult(r); setSpinning(false); }, 900);
  }

  return (
    <section className="container-max py-12 text-center">
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
      </div>

      <div className="mt-6">
        <button className="btn-primary" onClick={flip} disabled={spinning}>{spinning?"Flipping…":"Flip"}</button>
      </div>
    </section>
  );
}


