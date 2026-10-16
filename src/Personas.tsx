import { useEffect, useState } from "react";
import type { L, Lang } from "./content";
import "./personas.css";

type Persona = {
  img: string;
  layer: L;
  headline: L;
  meta: L;
  traits: { k: L; v: L }[];
  problems: L[];
  short: L;
};

const personas: Persona[] = [
  {
    img: "/personas/founder.jpg",
    layer: { zh: "01 / 核心人群", en: "01 / Core" },
    headline: { zh: "一天 8 场会的决策者。", en: "The decision-maker with 8 meetings a day." },
    meta: { zh: "28–45 岁 · 创始人 / 部门负责人 · 愿意为效率付费", en: "28–45 · Founders & heads of teams · Pay for time" },
    traits: [
      { k: { zh: "会议密集", en: "Back-to-back" }, v: { zh: "客户会、周会、董事会连轴转", en: "Client calls, stand-ups, board meetings" } },
      { k: { zh: "承诺很多", en: "Many promises" }, v: { zh: "一句「我来跟进」一天说十次", en: "“I’ll follow up” ten times a day" } },
      { k: { zh: "常用工具", en: "Tools" }, v: { zh: "飞书 · Outlook · Apple 日历", en: "Lark · Outlook · Apple Calendar" } },
    ],
    problems: [
      { zh: "会上答应的事，散会就忘。", en: "Promises vanish when the meeting ends." },
      { zh: "跟进全靠自己，助理跟不上。", en: "Follow-ups are all on you." },
      { zh: "下班回家，脑子还在开会。", en: "Home, but your head is still in the meeting." },
    ],
    short: { zh: "创始人与管理者", en: "Founders & leaders" },
  },
  {
    img: "/personas/sales.jpg",
    layer: { zh: "02 / 扩张人群", en: "02 / Expanding" },
    headline: { zh: "每天在路上的成交者。", en: "The closer who lives on the road." },
    meta: { zh: "26–40 岁 · 大客户销售 / 客户经理 · 按业绩说话", en: "26–40 · Key-account sales · Paid on results" },
    traits: [
      { k: { zh: "拜访频繁", en: "Always visiting" }, v: { zh: "一天见三四个客户", en: "Three or four clients a day" } },
      { k: { zh: "线索在嘴上", en: "Leads are spoken" }, v: { zh: "预算、竞品、下次时间都在对话里", en: "Budget, rivals and next steps live in conversation" } },
      { k: { zh: "常在", en: "Found at" }, v: { zh: "客户现场 · 高铁 · 机场", en: "Client sites · trains · airports" } },
    ],
    problems: [
      { zh: "客户说的预算，回头就记不全。", en: "The budget they mentioned — half forgotten." },
      { zh: "拜访完还要补 CRM 到深夜。", en: "CRM notes until midnight." },
      { zh: "跟进消息总拖到第二天。", en: "Follow-ups slip to tomorrow." },
    ],
    short: { zh: "销售与客户经理", en: "Sales & account managers" },
  },
  {
    img: "/personas/consultant.jpg",
    layer: { zh: "03 / 扩张人群", en: "03 / Expanding" },
    headline: { zh: "时间就是收入的专业人士。", en: "The professional whose time is billable." },
    meta: { zh: "30–45 岁 · 咨询顾问 / 律师 / 投资人", en: "30–45 · Consultants, lawyers, investors" },
    traits: [
      { k: { zh: "访谈密集", en: "Interview-heavy" }, v: { zh: "一场访谈动辄两三小时", en: "Interviews run two or three hours" } },
      { k: { zh: "细节即专业", en: "Details matter" }, v: { zh: "需要能追溯的原话", en: "Needs the exact words, traceable" } },
      { k: { zh: "常用工具", en: "Tools" }, v: { zh: "Word · Notion · 邮件", en: "Word · Notion · email" } },
    ],
    problems: [
      { zh: "三小时录音，关键一句找不到。", en: "Three hours of audio; the key line is lost." },
      { zh: "整理纪要，挤掉了能计费的时间。", en: "Writing notes eats billable hours." },
      { zh: "客户的要求，散落在不同的会里。", en: "Client asks are scattered across meetings." },
    ],
    short: { zh: "顾问与专业人士", en: "Consultants & pros" },
  },
  {
    img: "/personas/parent.jpg",
    layer: { zh: "04 / 生活人群", en: "04 / Life" },
    headline: { zh: "工作和家庭两头兼顾的人。", en: "The one holding work and family together." },
    meta: { zh: "32–45 岁 · 双职工 · 家有老人和孩子", en: "32–45 · Dual-income · Parents and kids at home" },
    traits: [
      { k: { zh: "两头都忙", en: "Busy both ways" }, v: { zh: "白天开会，晚上辅导作业", en: "Meetings by day, homework by night" } },
      { k: { zh: "通知很多", en: "Endless notices" }, v: { zh: "家长群、医院、物业一起来", en: "School chats, hospitals, the building office" } },
      { k: { zh: "最缺", en: "Short on" }, v: { zh: "陪家人的完整时间", en: "Unbroken time with family" } },
    ],
    problems: [
      { zh: "爸妈的复诊，电话里说过就忘。", en: "Mum’s check-up, mentioned once, forgotten." },
      { zh: "孩子的事，总是最后一个知道。", en: "Always the last to hear about school." },
      { zh: "人回到家，心还在工作上。", en: "Home in body, still at work in mind." },
    ],
    short: { zh: "职场父母", en: "Working parents" },
  },
];

const ui = {
  traits: { zh: "他们的特征", en: "Who they are" },
  problems: { zh: "遇到的问题", en: "What goes wrong" },
};

export default function Personas({ lang }: { lang: Lang }) {
  const [cur, setCur] = useState(0);
  const [auto, setAuto] = useState(true);
  const t = (l: L) => l[lang];

  useEffect(() => {
    if (!auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => setCur((c) => (c + 1) % personas.length), 7000);
    return () => window.clearTimeout(id);
  }, [cur, auto]);

  return (
    <div className="ps reveal" onPointerEnter={() => setAuto(false)}>
      {personas.map((p, i) => {
        const on = i === cur;
        return (
          <article key={i} className={`ps-card ${on ? "on" : ""}`} onClick={() => { setAuto(false); setCur(i); }} aria-expanded={on}>
            <div className="ps-img"><img src={p.img} alt={t(p.short)} loading="lazy" /></div>
            {on ? (
              <div className="ps-body">
                <span className="ps-layer">{t(p.layer)}</span>
                <h3>{t(p.headline)}</h3>
                <p className="ps-meta">{t(p.meta)}</p>
                <span className="ps-k">{t(ui.traits)}</span>
                <ul className="ps-traits">
                  {p.traits.map((x, k) => <li key={k}><b>{t(x.k)}</b><span>{t(x.v)}</span></li>)}
                </ul>
                <span className="ps-k warn">{t(ui.problems)}</span>
                <ul className="ps-problems">
                  {p.problems.map((x, k) => <li key={k}>{t(x)}</li>)}
                </ul>
              </div>
            ) : (
              <div className="ps-tab">
                <span className="ps-layer-sm">{t(p.layer)}</span>
                <b>{t(p.short)}</b>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
