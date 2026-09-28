import { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from "react";
import Visualizer from "./Visualizer";

type Track = {
  id: string;
  name: string;
  artist: string;
  url: string;
};

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.72);
  const [dragging, setDragging] = useState(false);

  const track = tracks[current];

  const subtitle = useMemo(() => {
    if (!track) return "Drop MP3 / WAV / OGG files here";
    return track.artist || "Local audio";
  }, [track]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    return () => {
      tracks.forEach((t) => URL.revokeObjectURL(t.url));
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track) return;
    audio.load();
    setTime(0);
    if (playing) {
      audio.play().catch(() => setPlaying(false));
    }
  }, [current, track?.url]);

  function addFiles(files: File[]) {
    const accepted = files.filter((file) => file.type.startsWith("audio/"));
    if (!accepted.length) return;

    const newTracks = accepted.map((file) => {
      const base = file.name.replace(/\.[^.]+$/, "");
      const split = base.split(" - ");
      return {
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        name: split.length > 1 ? split.slice(1).join(" - ") : base,
        artist: split.length > 1 ? split[0] : "Local audio",
        url: URL.createObjectURL(file)
      };
    });

    setTracks((old) => [...old, ...newTracks]);
  }

  function onFileInput(event: ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    addFiles(Array.from(event.dataTransfer.files));
  }

  async function togglePlay() {
    const audio = audioRef.current;
    if (!audio || !track) {
      fileRef.current?.click();
      return;
    }

    if (audio.paused) {
      await audio.play();
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  function next() {
    if (!tracks.length) return;
    setCurrent((i) => (i + 1) % tracks.length);
  }

  function previous() {
    if (!tracks.length) return;
    if (time > 4 && audioRef.current) {
      audioRef.current.currentTime = 0;
      return;
    }
    setCurrent((i) => (i - 1 + tracks.length) % tracks.length);
  }

  return (
    <section
      className={`music-card glass ${dragging ? "drop-active" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <div className="music-topline">
        <span className="eyebrow">NOW PLAYING</span>
        <button className="ghost-button" onClick={() => fileRef.current?.click()}>
          + Add music
        </button>
        <input
          ref={fileRef}
          hidden
          multiple
          type="file"
          accept="audio/*,.mp3,.wav,.ogg,.m4a"
          onChange={onFileInput}
        />
      </div>

      <div className="album-row">
        <div className={`album-art ${playing ? "spin-soft" : ""}`}>
          <div className="disc-ring" />
          <div className="disc-core">TS</div>
        </div>

        <div className="track-copy">
          <h2>{track?.name ?? "Your personal soundtrack"}</h2>
          <p>{subtitle}</p>
          <Visualizer playing={playing} />
        </div>
      </div>

      <audio
        ref={audioRef}
        src={track?.url}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={next}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <div className="seek-row">
        <span>{formatTime(time)}</span>
        <input
          aria-label="Seek"
          className="range"
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(time, duration || 0)}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (audioRef.current) audioRef.current.currentTime = value;
            setTime(value);
          }}
        />
        <span>{formatTime(duration)}</span>
      </div>

      <div className="player-controls">
        <button onClick={previous} className="round-button secondary" aria-label="Previous">
          ◀◀
        </button>
        <button onClick={togglePlay} className="round-button play" aria-label="Play or pause">
          {playing ? "Ⅱ" : "▶"}
        </button>
        <button onClick={next} className="round-button secondary" aria-label="Next">
          ▶▶
        </button>

        <div className="volume">
          <span>⌁</span>
          <input
            aria-label="Volume"
            className="range"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </div>
      </div>

      {tracks.length > 0 && (
        <div className="playlist">
          {tracks.map((item, index) => (
            <button
              key={item.id}
              className={index === current ? "playlist-item active" : "playlist-item"}
              onClick={() => setCurrent(index)}
            >
              <span className="track-number">{index === current && playing ? "♪" : index + 1}</span>
              <span className="playlist-text">
                <strong>{item.name}</strong>
                <small>{item.artist}</small>
              </span>
            </button>
          ))}
        </div>
      )}

      {!tracks.length && <div className="drop-hint">Drop audio anywhere on this card</div>}
    </section>
  );
}
