import { useId } from "react";

/** The FloWork glyph: one continuous stroke (f → w wave) ending in the memory dot. */
export const FLOW_PATH = "M6 24 C10 21 14 12 13 7.5 C12 3.5 8 5 8.6 10 C9.3 16 11 24.5 12.6 24 C14.4 23.4 15 16.5 18.2 16.6 C21.4 16.7 20.8 23 24 23";

const PALETTES: Record<string, [string, string]> = {
  amber: ["#f5a524", "#ffd27a"],
  mint: ["#4ccf7f", "#2dd4bf"],
  sky: ["#6f9bff", "#8fd3ff"],
  coral: ["#ff7a59", "#ff4d8d"],
  violet: ["#8b7bff", "#c6a8ff"],
  silver: ["#ffffff", "#b4b7bc"],
};

type Props = {
  size?: number;
  tone?: keyof typeof PALETTES;
  /** Draw the stroke on (0 → 1). Leave undefined for a static mark. */
  draw?: number;
  tile?: boolean;
  className?: string;
};

export default function FlowMark({ size = 22, tone = "amber", draw, tile = false, className = "" }: Props) {
  const id = useId().replace(/:/g, "");
  const [a, b] = PALETTES[tone] ?? PALETTES.amber;
  const k = draw === undefined ? 1 : Math.max(0, Math.min(1, draw));
  return (
    <svg className={`flowmark ${tile ? "tile" : ""} ${className}`} width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
      {tile && <rect x="0.5" y="0.5" width="31" height="31" rx="8" fill="#161618" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />}
      <path d={FLOW_PATH} fill="none" stroke={`url(#g${id})`} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"
        pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - k} />
      <circle cx="27.6" cy="22.2" r="2.1" fill={b} opacity={k >= 0.98 ? 1 : 0} style={{ transition: "opacity .25s" }} />
    </svg>
  );
}
