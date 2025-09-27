import GlowCard from "@/components/GlowCard";

export default function QuickGuide(){
  const steps = [
    {t:"Access Gateway", d:"Use the gateway link above"},
    {t:"Create Account", d:"Register a new account"},
    {t:"Find Slot", d:"Find the Coin Flip Minigame"},
    {t:"Set Bet Value", d:"Use the exact bet amount"},
    {t:"Use Flipz AI", d:"Use our minigame to predict the next flip"},
    {t:"Time Limit", d:"Play before the glitch is patched"},
    
  ];
  return (
    <section id="quick-guide" className="container-max py-16 text-center">
      <div className="card p-6 md:p-8 lg:p-10">
        <div className="title-wrap mb-4">
          <span className="title-icon">🧾</span>
          <h2 className="section-title gradient-text">Quick Usage Guide</h2>
        </div>
        {/* removed underline above boxes */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {steps.map((s, i) => (
            <GlowCard key={s.t} className="card p-5 md:p-6 text-center">
              <div className="step-badge">{i+1}</div>
              <div className="text-sm font-semibold mt-1">{s.t}</div>
              <div className="subtle text-xs mt-2">{s.d}</div>
            </GlowCard>
          ))}
        </div>

        <div className="mt-6 md:mt-8">
          <span className="guide-footnote">
            <span className="dot"></span>
            Follow these steps exactly for the best results
          </span>
        </div>
      </div>
    </section>
  )
}


