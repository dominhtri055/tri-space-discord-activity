import { useEffect, useState } from "react";

type Profile = {
  name: string;
  handle: string;
  tagline: string;
  mood: string;
};

const defaultProfile: Profile = {
  name: "Tri",
  handle: "@baal2908",
  tagline: "Developer by day. Gamer & music enjoyer by night.",
  mood: "focus"
};

export default function ProfileCard() {
  const [profile, setProfile] = useState<Profile>(() => {
    try {
      const saved = localStorage.getItem("tri-space-profile");
      return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    localStorage.setItem("tri-space-profile", JSON.stringify(profile));
  }, [profile]);

  return (
    <section className="profile-card glass">
      <div className="profile-head">
        <div className="avatar-shell">
          <div className="avatar">T</div>
          <span className="online-dot" />
        </div>
        <div className="identity">
          {editing ? (
            <>
              <input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="inline-input title-input"
                aria-label="Display name"
              />
              <input
                value={profile.handle}
                onChange={(e) => setProfile({ ...profile, handle: e.target.value })}
                className="inline-input"
                aria-label="Handle"
              />
            </>
          ) : (
            <>
              <h1>{profile.name}</h1>
              <span>{profile.handle}</span>
            </>
          )}
        </div>
        <button className="icon-button" onClick={() => setEditing((v) => !v)} aria-label="Edit profile">
          {editing ? "✓" : "✎"}
        </button>
      </div>

      {editing ? (
        <textarea
          className="bio-editor"
          value={profile.tagline}
          onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
          maxLength={110}
        />
      ) : (
        <p className="tagline">{profile.tagline}</p>
      )}

      <div className="mood-row">
        {[
          ["focus", "◉ Focus"],
          ["chill", "☾ Chill"],
          ["code", "⌘ Code"],
          ["game", "◇ Game"]
        ].map(([id, label]) => (
          <button
            key={id}
            className={`mood-chip ${profile.mood === id ? "selected" : ""}`}
            onClick={() => setProfile({ ...profile, mood: id })}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="link-grid">
        <a href="https://tri-portfolio-pi.vercel.app" target="_blank" rel="noreferrer">
          <span>Portfolio</span><b>↗</b>
        </a>
        <a href="https://github.com/dominhtri055" target="_blank" rel="noreferrer">
          <span>GitHub</span><b>↗</b>
        </a>
      </div>
    </section>
  );
}
