"use client";

import { useState } from "react";

export default function CoinflipGate() {
  const [clicked, setClicked] = useState(false);
  return (
    <div className="py-8">
      <button
        className="inline-flex items-center gap-2 rounded-lg px-5 py-3 bg-white/10 hover:bg-white/15 border border-white/20"
        onClick={() => setClicked(true)}
      >
        Access Gateway
      </button>
      {clicked && (
        <p className="subtle mt-3">
          Gateway URL not configured. Replace this component with your link.
        </p>
      )}
    </div>
  );
}



