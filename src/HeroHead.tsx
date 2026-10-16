import { hardwareDemoDocument } from "./hardware-demo";

/** Isolate the supplied demo's DOM, styles and simulation from the website. */
export default function HeroHead({ label }: { label: string }) {
  return (
    <div className="hero-hardware">
      <iframe
        className="hero-hardware-frame"
        title={label}
        srcDoc={hardwareDemoDocument}
        sandbox="allow-scripts"
      />
      <p className="hero-hardware-note">外观与穿戴概念演示</p>
    </div>
  );
}
