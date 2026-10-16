import type { CSSProperties } from "react";

/** Flo — the glass-jelly sprite that personifies Flow Agent. Colour follows the scene mode. */
export type FloTone = "amber" | "mint" | "sky" | "violet" | "coral" | "silver";

const SRC: Record<FloTone, { img: "amber" | "mint" | "sky"; filter?: string }> = {
  amber: { img: "amber" },
  mint: { img: "mint" },
  sky: { img: "sky" },
  violet: { img: "sky", filter: "hue-rotate(38deg) saturate(1.1)" },
  coral: { img: "amber", filter: "hue-rotate(-28deg) saturate(1.2)" },
  silver: { img: "sky", filter: "saturate(0.15) brightness(1.15)" },
};

type Props = { size?: number; tone?: FloTone; float?: boolean; className?: string; style?: CSSProperties };

export default function Flo({ size = 28, tone = "amber", float = false, className = "", style }: Props) {
  const s = SRC[tone] ?? SRC.amber;
  return (
    <span className={`flo ${float ? "float" : ""} ${className}`} style={{ width: size, height: size, ...style }} aria-hidden="true">
      <img src={`/flo/flo_${s.img}.png`} alt="" width={size} height={size} style={s.filter ? { filter: s.filter } : undefined} />
    </span>
  );
}
