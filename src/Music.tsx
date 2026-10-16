import { useEffect, useRef, useState } from "react";

const BASE_VOL = 0.25;
const SWELL_VOL = 0.35; // while the bottom sign-up section is on screen
const KEY = "fw-bgm";

/** Floating background-music toggle, bottom-right. On by default; starts on the first gesture if autoplay is blocked. */
export default function Music({ label }: { label: string }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [on, setOn] = useState(() => {
    try { return localStorage.getItem(KEY) !== "off"; } catch { return true; }
  });
  const [ready, setReady] = useState(false);
  const onRef = useRef(on);
  const target = useRef(BASE_VOL);
  const fade = useRef<number | undefined>(undefined);

  const fadeTo = (to: number, ms: number, done?: () => void) => {
    const a = audio.current;
    if (!a) return;
    window.clearInterval(fade.current);
    const from = a.volume;
    const steps = 24;
    let i = 0;
    fade.current = window.setInterval(() => {
      i++;
      const eased = 1 - Math.pow(1 - i / steps, 3);
      a.volume = Math.min(0.4, Math.max(0, from + (to - from) * eased));
      if (i >= steps) { window.clearInterval(fade.current); done?.(); }
    }, ms / steps);
  };

  const play = () => {
    const a = audio.current;
    if (!a) return;
    a.play().then(() => fadeTo(target.current, 1400)).catch(() => {});
  };

  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    a.volume = 0;
    const show = window.setTimeout(() => setReady(true), 800);

    // Autoplay is usually blocked until the first user gesture.
    const events = ["pointerdown", "keydown", "touchstart", "scroll"] as const;
    const unlock = () => {
      events.forEach((e) => document.removeEventListener(e, unlock));
      if (onRef.current && a.paused) play();
    };
    if (onRef.current) {
      a.play().then(() => fadeTo(BASE_VOL, 1600)).catch(() => {
        events.forEach((e) => document.addEventListener(e, unlock, { passive: true }));
      });
    }

    const onVis = () => {
      if (document.hidden) a.pause();
      else if (onRef.current) a.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVis);

    const cta = document.getElementById("trial");
    const io = cta && "IntersectionObserver" in window
      ? new IntersectionObserver(([e]) => {
          target.current = e.isIntersecting ? SWELL_VOL : BASE_VOL;
          if (onRef.current && !a.paused) fadeTo(target.current, 1400);
        }, { threshold: 0.4 })
      : null;
    if (cta && io) io.observe(cta);

    return () => {
      window.clearTimeout(show);
      window.clearInterval(fade.current);
      events.forEach((e) => document.removeEventListener(e, unlock));
      document.removeEventListener("visibilitychange", onVis);
      io?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    onRef.current = next;
    try { localStorage.setItem(KEY, next ? "on" : "off"); } catch { /* storage unavailable */ }
    if (next) play();
    else fadeTo(0, 400, () => audio.current?.pause());
  };

  return (
    <>
      <audio ref={audio} src="/audio/bgm.mp3" loop preload="auto" playsInline onCanPlay={() => setReady(true)} />
      <button
        type="button"
        className={`bgm ${ready ? "ready" : ""} ${on ? "" : "muted"}`}
        aria-label={label}
        aria-pressed={on}
        title={label}
        onClick={toggle}
      >
        <span className="bgm-ring" aria-hidden="true" />
        <span className="bgm-bars" aria-hidden="true"><span /><span /><span /><span /></span>
      </button>
    </>
  );
}
