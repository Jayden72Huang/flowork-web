import { useEffect, useState } from "react";
import { gestures, hciRules } from "./content";
import type { L, Lang } from "./content";

/** Top-down drawing of the V2 bar: titanium cap over the recorder, same-colour AG glass touch surface, one hidden status line. */
function BarSvg({ g }: { g: string }) {
  return (
    <svg className={`gs-bar g-${g}`} viewBox="0 0 420 260" role="img" aria-label="FloWork Bar">
      <defs>
        <linearGradient id="gs-metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d4d3cf" />
          <stop offset="1" stopColor="#9c9b97" />
        </linearGradient>
      </defs>
      {/* 42 × 26 mm at 10 units/mm, R10 corners */}
      <rect x="0" y="0" width="420" height="260" rx="100" fill="url(#gs-metal)" />
      <rect x="2" y="2" width="416" height="256" rx="98" className="gs-edge" />
      {/* Zone A: Ø23.2 mm recorder under a titanium cap (hairline seam, mic holes) */}
      <circle cx="130" cy="130" r="112" className="gs-puck" />
      <circle cx="130" cy="130" r="112" className={`gs-puck-ring ${g === "double" || g === "press" ? "on" : ""}`} />
      <circle cx="130" cy="74" r="3" className="gs-mic" /><circle cx="150" cy="78" r="3" className="gs-mic" />
      {/* Zone B: 12 × 16 mm trackpad, same colour, hairline seam only */}
      <rect x="270" y="50" width="120" height="160" rx="36" className="gs-pad" />
      {/* Hidden status line */}
      <rect x="374" y="80" width="5" height="100" rx="2.5" className="gs-line" />
      {/* Finger cue */}
      {g === "double" && <circle cx="130" cy="130" r="40" className="gs-ripple r2" />}
      {g === "double" && <circle cx="130" cy="130" r="40" className="gs-ripple" />}
      {g === "press" && <circle cx="130" cy="130" r="40" className="gs-ripple" />}
      {g === "tap" && <circle cx="322" cy="130" r="30" className="gs-ripple" />}
      {g === "hold" && <circle cx="322" cy="130" r="30" className="gs-hold" />}
      {(g === "up" || g === "down") && <circle cx="322" cy="130" r="22" className={`gs-dot ${g}`} />}
    </svg>
  );
}

export default function Gestures({ lang }: { lang: Lang }) {
  const t = (l: L) => l[lang];
  const [cur, setCur] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const id = window.setInterval(() => setCur((c) => (c + 1) % gestures.length), 3200);
    return () => window.clearInterval(id);
  }, [auto]);

  return (
    <>
      <div className="gs reveal">
        <div className="gs-stage">
          <BarSvg key={cur} g={gestures[cur].g} />
          <p className="gs-note">{t({ zh: "实际尺寸 42 × 26 mm，横放为手环 / 手机方向，沿触控板短边上下滑，最右侧细线是状态线；竖挂时 IMU 自动把「上」对准重力方向。状态线是唯一的指示，平时看不见。", en: "Actual size 42 × 26 mm, shown flat (wrist / phone), swipe across the short side; when hung, the IMU maps “up” to gravity. The hairline on the outer edge is the only indicator, invisible at rest." })}</p>
        </div>
        <ol className="gs-list">
          {gestures.map((x, i) => (
            <li key={x.g}>
              <button className={i === cur ? "on" : ""} onClick={() => { setAuto(false); setCur(i); }}>
                <span className="gs-where">{t(x.where)}</span>
                <b>{t(x.name)}</b>
                <span className="gs-does">{t(x.does)}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div className="grid3 lines gs-rules reveal">
        {hciRules.map((r, i) => (
          <div key={i} className="cell">
            <span className="label">{String(i + 1).padStart(2, "0")}</span>
            <h3>{t(r.t)}</h3>
            <p>{t(r.b)}</p>
          </div>
        ))}
      </div>
    </>
  );
}
