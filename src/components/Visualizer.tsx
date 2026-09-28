type Props = {
  playing: boolean;
};

export default function Visualizer({ playing }: Props) {
  return (
    <div className={`visualizer ${playing ? "is-playing" : ""}`} aria-hidden="true">
      {Array.from({ length: 34 }).map((_, i) => (
        <span
          key={i}
          style={{
            animationDelay: `${(i % 9) * 0.06}s`,
            height: `${18 + ((i * 17) % 52)}%`
          }}
        />
      ))}
    </div>
  );
}
