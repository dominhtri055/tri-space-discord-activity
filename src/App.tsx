import { useEffect, useState } from "react";
import MusicPlayer from "./components/MusicPlayer";
import ProfileCard from "./components/ProfileCard";
import ClockCard from "./components/ClockCard";
import { initDiscord, type DiscordState } from "./lib/discord";

export default function App() {
  const [discord, setDiscord] = useState<DiscordState>({ embedded: false, ready: false });
  const [accent, setAccent] = useState(() => localStorage.getItem("tri-space-accent") ?? "268");

  useEffect(() => {
    initDiscord().then(setDiscord);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent-h", accent);
    localStorage.setItem("tri-space-accent", accent);
  }, [accent]);

  return (
    <main className="app-shell">
      <div className="noise" />
      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <div className="orb orb-three" />

      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">T</div>
          <div>
            <strong>TRI SPACE</strong>
            <small>personal Discord activity</small>
          </div>
        </div>

        <div className="top-actions">
          <label className="accent-picker">
            <span>accent</span>
            <input
              type="range"
              min="180"
              max="340"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
            />
          </label>
          <div className={`sdk-pill ${discord.ready ? "connected" : ""}`}>
            <span />
            {discord.ready ? "Discord connected" : "Browser preview"}
          </div>
        </div>
      </header>

      <div className="hero-copy">
        <span className="eyebrow">WELCOME BACK</span>
        <h2>Your room. Your music.<br />Your little corner of Discord.</h2>
      </div>

      <div className="dashboard-grid">
        <div className="left-stack">
          <ProfileCard />
          <ClockCard />
        </div>
        <MusicPlayer />
      </div>

      <footer>
        <span>Tri Space v1</span>
        <span>Audio stays local in your browser session.</span>
      </footer>
    </main>
  );
}
