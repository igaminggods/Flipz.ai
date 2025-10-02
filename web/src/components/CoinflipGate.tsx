"use client";

import { useState } from "react";

export default function CoinflipGate() {
  const [clicked, setClicked] = useState(false);
  return (
    <div className="py-8">
      <a
        className="inline-flex items-center gap-2 rounded-lg px-5 py-3 bg-white/10 hover:bg-white/15 border border-white/20"
        href="https://track.padrinopartners.com/visit/?bta=35286&brand=needforslots"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          setClicked(true);
          try {
            // Fire Meta Pixel custom event for Access Gateway clicks
            const fbq =
              typeof window !== 'undefined'
                ? (window as unknown as {
                    fbq?: (event: string, name: string, ...args: unknown[]) => void;
                  }).fbq
                : undefined;
            if (typeof fbq === 'function') {
              fbq('trackCustom', 'GatewayAccessClick');
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



