import { useState } from 'react';

function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [stage, setStage] = useState("idle");

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setResult(null);

    try {
      setStage("scraping");

      const response = await fetch('/api/digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      setStage("analyzing");

      const data = await response.json();

      setStage("generating");

      if (response.ok) {
        setResult(data);
        setStage("done");
      } else {
        alert(data.error || "Something went wrong during extraction.");
        setStage("idle");
      }

    } catch (err) {
      console.error("Connection error:", err);
      setStage("idle");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="w-full min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">

    {/* subtle background grid glow */}
    <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#ff2a2a_1px,transparent_1px)] [background-size:22px_22px]" />

    {/* SYSTEM STATUS */}
      <div className="mb-6 flex items-center gap-2 text-xs font-mono text-zinc-500">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        SYSTEM ONLINE • DIGESTER ENGINE ACTIVE
      </div>

    {/* HEADER */}
    <div className="text-center mb-10 z-10">
      
    <h1 className="text-6xl md:text-7xl font-black tracking-tighter uppercase mb-4">
        DIGESTER
      </h1>

      <span className="text-red-500 text-xs font-mono tracking-[0.35em] uppercase block mb-4 opacity-80">
         AI KNOWLEDGE CONCIERGE 
      </span>

      <p className="text-zinc-500 text-xs md:text-sm tracking-widest uppercase max-w-md mx-auto leading-relaxed">
        Turn links into structured intelligence in seconds.
      </p>
    </div>

    {/* INPUT CARD */}
    <div className="w-full max-w-2xl bg-zinc-950/80 backdrop-blur border border-red-900/60 p-6 md:p-8 rounded-xl shadow-[0_40px_120px_-40px_rgba(255,0,0,0.25)] z-10">

      <form onSubmit={handleAnalyze} className="flex flex-col gap-4">

        <input
          type="url"
          placeholder="Paste URL to analyze..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="w-full bg-black/60 border border-red-950/60 px-4 py-4 text-sm font-mono tracking-widest uppercase placeholder-zinc-600 focus:outline-none focus:border-red-600 transition"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-800 hover:bg-red-700 disabled:bg-zinc-900 text-white font-bold text-xs tracking-[0.2em] uppercase py-4 border border-red-950 transition-all"
        >
          {stage === "idle" && "ANALYZE ARTIFACT"}
          {stage === "scraping" && "[ SCRAPING SOURCE... ]"}
          {stage === "analyzing" && "[ AI PROCESSING CONTENT... ]"}
          {stage === "generating" && "[ GENERATING INSIGHTS... ]"}
          {stage === "done" && "[ COMPLETE ]"}
        </button>

      </form>
    </div>

    {/* RESULT CARD */}
    {result && (
      <div className="w-full max-w-2xl mt-6 z-10">

        <div className="bg-zinc-950/80 backdrop-blur border border-red-900/50 p-6 md:p-8 rounded-xl shadow-[0_40px_120px_-50px_rgba(255,0,0,0.25)]">

          {/* HEADER */}
          <div className="mb-6">
            <div className="text-red-400 text-xs font-mono tracking-widest mb-2 opacity-80">
              PIPELINE ANALYSIS
            </div>

            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
              {result.focusMatch}
            </h2>
          </div>

          {/* INSIGHTS */}
          <div className="flex flex-col gap-4">
            {result.insights.map((insight, idx) => (
              <div
                key={idx}
                className="relative bg-black/50 border border-red-950/40 p-4 rounded-lg text-sm leading-relaxed hover:border-red-700/60 transition"
              >
                <div className="absolute left-0 top-0 h-full w-[2px] bg-red-600 opacity-70" />
                
                <span className="text-red-400 font-mono mr-2">//</span>
                <span className="text-zinc-200">{insight}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    )}

  </div>
);
}

export default Home;