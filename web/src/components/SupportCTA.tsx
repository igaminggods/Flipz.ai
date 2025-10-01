"use client";

export default function SupportCTA(){
  const handleClick = () => {
    try {
      const fbq =
        typeof window !== 'undefined'
          ? (window as unknown as {
              fbq?: (event: string, name: string, ...args: unknown[]) => void;
            }).fbq
          : undefined;
      if (typeof fbq === 'function') {
        fbq('trackCustom', 'SupportContactClick');
      }
    } catch {}
    try {
      if (typeof window !== 'undefined') {
        window.open('https://t.me/Flipzaisupport', '_blank', 'noopener,noreferrer');
      }
    } catch {}
  };

  return (
    <section className="container-max pt-12 pb-4 text-center">
      <div className="card glow-card p-8 max-w-3xl mx-auto">
        <h3 className="section-title gradient-text mb-2">Still have questions?</h3>
        <p className="subtle mb-5">Contact Us on Telegram and we will be happy to assist you.</p>
        <button type="button" onClick={handleClick} className="btn-primary inline-flex items-center gap-2">
          <span role="img" aria-label="chat">💬</span>
          CONTACT
        </button>
      </div>
    </section>
  );
}


