import { useEffect, useState } from "react";

export default function ClockCard() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="clock-card glass">
      <span className="eyebrow">LOCAL TIME</span>
      <div className="clock">{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
      <div className="date">{now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}</div>
      <div className="mini-status"><span className="pulse"/> personal space online</div>
    </section>
  );
}
