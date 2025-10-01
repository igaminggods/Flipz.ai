"use client";

import { useState } from "react";

export default function CoinflipGate() {
  const [clicked, setClicked] = useState(false);
  return (
    <div className="py-8">
      <a
        className="inline-flex items-center gap-2 rounded-lg px-5 py-3 bg-white/10 hover:bg-white/15 border border-white/20"
        href="https://track.intrklnkmain.com/visit/?bta=48672&brand=oscarspin&utm_campaign=CoinFlip"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          setClicked(true);
          try {
            // Fire Meta Pixel custom event for Access Gateway clicks
            // @ts-ignore - fbq is injected globally by Meta Pixel script
            if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
              (window as any).fbq('trackCustom', 'GatewayAccessClick');
            }
          } catch {}
        }}
      >
        Access Gateway
      </a>
      {clicked && (
        <p className="subtle mt-3">
          Gateway URL not configured. Replace this component with your link.
        </p>
      )}
    </div>
  );
}



