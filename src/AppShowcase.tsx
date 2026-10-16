import { useEffect, useRef, useState } from "react";
import type { L, Lang } from "./content";
import "./showcase.css";

type Tab = "note" | "flow" | "me";
type Screen = { img: string; title: L; body: L };

// Screens exported from the historical App v1 design canvas (current specification: DESIGN.md). Kept black & white on purpose:
// in the App, amber only ever means "recording".
const screens: Record<Tab, Screen[]> = {
  note: [
    { img: "/app/main.jpg", title: { zh: "Note 首页", en: "Note" }, body: { zh: "上面是录音状态，中间两个大键：录音、拍摄。往下是今日总结和按时间排好的记录。", en: "Recording bar, record & capture keys, today’s summary and your cards." } },
    { img: "/app/record.jpg", title: { zh: "录音中", en: "Recording" }, body: { zh: "看得到计时和声音波形。重要的话点「标记这一句」，不想录就一键静音，还会提醒你告诉在场的人。", en: "Timer and waveform, “mark this line”, privacy mute, consent reminder." } },
    { img: "/app/summary.jpg", title: { zh: "今日总结", en: "Today" }, body: { zh: "分成三块：等你确认的、已经办完的、明天要做的。点一下就能让底座念给你听。", en: "Waiting on you, done, tomorrow — and play it on the dock." } },
    { img: "/app/action.jpg", title: { zh: "待确认", en: "Confirm" }, body: { zh: "附上原话录音、Jev 的判断和写好的邮件。在 App、Bar、底座上都能确认，3 秒内还能撤回。", en: "Source clip, Jev’s three calls and the draft; confirm on app, Bar or dock, undo within 3 s." } },
  ],
  flow: [
    { img: "/app/flow.jpg", title: { zh: "Flow Agent", en: "Flow Agent" }, body: { zh: "Flo 的信息从哪来，一眼看清。常用问题点一下就问，也可以按白色键说「Hey Flo」。", en: "Every source Flo knows, quick asks and the Hey Flo voice key." } },
    { img: "/app/ask.jpg", title: { zh: "对话", en: "Ask" }, body: { zh: "每个回答都写明查了哪些资料，下面直接给出能一键去做的事。", en: "Each answer shows the sources it checked and actions you can take." } },
  ],
  me: [
    { img: "/app/me.jpg", title: { zh: "我的", en: "Me" }, body: { zh: "Flo 知道你的六类信息，每一类都能单独关掉或删除。", en: "Six kinds of things Flo knows — each can be switched off or deleted." } },
    { img: "/app/schedule.jpg", title: { zh: "日程", en: "Schedule" }, body: { zh: "白色是 Flo 从录音里帮你加的，灰色来自你的日历，两边自动同步。", en: "White lines came from your recordings, grey from your calendars — synced both ways." } },
  ],
};

const tabs: { id: Tab; label: L; desc: L }[] = [
  { id: "note", label: { zh: "记录", en: "Record" }, desc: { zh: "录音、拍摄、今日总结，所有记下来的东西", en: "Recordings, photos, today’s summary — everything you captured" } },
  { id: "flow", label: { zh: "Flo", en: "Flo" }, desc: { zh: "和 Flow Agent 对话，让它替你跟进", en: "Talk to Flow Agent and let it follow up for you" } },
  { id: "me", label: { zh: "我的", en: "Me" }, desc: { zh: "日程、设备、隐私，Flo 知道什么由你决定", en: "Schedule, devices, privacy — you decide what Flo knows" } },
];

const DWELL = 4000;

export default function AppShowcase({ lang }: { lang: Lang }) {
  const [tab, setTab] = useState<Tab>("note");
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const touchX = useRef<number | null>(null);
  const t = (l: L) => l[lang];
  const list = screens[tab];
  const cur = list[idx] ?? list[0];

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (paused || reduced || list.length < 2) return;
    const id = window.setTimeout(() => setIdx((n) => (n + 1) % list.length), DWELL);
    return () => window.clearTimeout(id);
  }, [idx, tab, paused, reduced, list.length]);

  const pick = (id: Tab) => { setTab(id); setIdx(0); };
  const step = (d: number) => setIdx((n) => (n + d + list.length) % list.length);

  return (
    <div className="sx">
      <div className="sx-tabs reveal" role="tablist">
        {tabs.map((x) => (
          <button key={x.id} role="tab" aria-selected={tab === x.id} className={`sx-tab ${tab === x.id ? "on" : ""}`} onClick={() => pick(x.id)}>
            <span className="sx-tab-glow" aria-hidden="true" />
            <b>{t(x.label)}</b>
            <span>{t(x.desc)}</span>
          </button>
        ))}
      </div>

      <div
        className="sx-stage reveal"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={(e) => { setPaused(true); touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const x0 = touchX.current;
          touchX.current = null;
          if (x0 == null) return;
          const dx = e.changedTouches[0].clientX - x0;
          if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
        }}
      >
        <div className="sx-glow" aria-hidden="true" />
        <div className="sx-phone">
          <span className="sx-btn sx-btn-a" aria-hidden="true" />
          <span className="sx-btn sx-btn-b" aria-hidden="true" />
          <span className="sx-btn sx-btn-c" aria-hidden="true" />
          <div className="sx-bezel">
            <div className="sx-screen">
              {(Object.keys(screens) as Tab[]).flatMap((k) =>
                screens[k].map((s, j) => (
                  <img key={s.img} src={s.img} alt={k === tab && j === idx ? t(s.title) : ""} className={k === tab && j === idx ? "on" : ""} loading={k === "note" && j === 0 ? "eager" : "lazy"} />
                )),
              )}
              <span className="sx-island" aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className="sx-cap">
          <div key={`${tab}${idx}`} className="sx-cap-txt" aria-live="polite">
            <span className="sx-no">{String(idx + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}</span>
            <b>{t(cur.title)}</b>
            <p>{t(cur.body)}</p>
          </div>
          <div className="sx-nav">
            <button className="sx-arrow" aria-label={lang === "zh" ? "上一屏" : "Previous"} onClick={() => step(-1)}>‹</button>
            <div className="sx-dots">
              {list.map((s, j) => (
                <button key={s.img} aria-label={t(s.title)} aria-current={j === idx} className={`sx-dot ${j === idx ? "on" : ""}`} onClick={() => setIdx(j)} />
              ))}
            </div>
            <button className="sx-arrow" aria-label={lang === "zh" ? "下一屏" : "Next"} onClick={() => step(1)}>›</button>
          </div>
        </div>
      </div>

      <p className="sx-note reveal">
        {t({ zh: "每个确认都能在 App 点、在 Bar 触控板单击，或对底座说「Hey Flo，发吧」。iOS 版已用 SwiftUI 实现全部 12 屏。", en: "Confirm in the app, tap the Bar’s touch surface, or tell the dock “Hey Flo, send it.” All 12 screens are built in SwiftUI on iOS." })}
      </p>
    </div>
  );
}
