import { useState } from "react";
import FlowMark from "./FlowMark";

/** The amber FloWork mark drawn on as one stroke — on load, and again on hover. */
export default function BrandLogo({ size = 28 }: { size?: number }) {
  const [run, setRun] = useState(0);
  return (
    <span className="brand-anim" onMouseEnter={() => setRun((n) => n + 1)}>
      <FlowMark key={run} size={size} tone="amber" tile className="draw" />
    </span>
  );
}
