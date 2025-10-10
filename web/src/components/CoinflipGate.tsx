"use client";

import { useEffect, useState } from "react";

export default function CoinflipGate() {
  const [clicked, setClicked] = useState(false);
  const [gatewayHref, setGatewayHref] = useState(
    "https://track.padrinopartners.com/visit/?bta=35286&brand=needforslots"
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
      const base = "https://track.padrinopartners.com/visit/?bta=35286&brand=needforslots";
      setGatewayHref(`${base}&afp1=${encodeURIComponent(afp1 || '')}&afp10=${encodeURIComponent(afp10)}${fbp ? `&fbp=${encodeURIComponent(fbp)}` : ''}${fbc ? `&fbc=${encodeURIComponent(fbc)}` : ''}`);
      setEventId(afp1 || undefined);
    } catch {}
  }, []);
  return (
    <div className="py-8">
      <a
        className="inline-flex items-center gap-2 rounded-lg px-5 py-3 bg-white/10 hover:bg-white/15 border border-white/20"
        href={gatewayHref}
        target="_blank"
        rel="nofollow noopener noreferrer"
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
              fbq('trackCustom', 'GatewayAccessClick', { event_id: eventId });
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



