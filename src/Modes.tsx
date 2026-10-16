import { useEffect, useState } from "react";
import Flo from "./Flo";
import type { FloTone } from "./Flo";
import type { L, Lang } from "./content";
import "./showcase.css";

type Mode = {
  id: string;
  time: string;
  scene: L;
  mount: L;
  mode: L;
  tone: FloTone;
  bg: string;
  signals: L[];
  tap: L;
  agent: L;
  note?: L;
};

const modes: Mode[] = [
  {
    id: "home", time: "07:30", tone: "amber", bg: "/images/bg_home.jpg",
    scene: { zh: "在家", en: "Home" }, mount: { zh: "插在记忆底座", en: "In the Memory Dock" }, mode: { zh: "家庭模式", en: "Home mode" },
    signals: [{ zh: "挂载 · 底座插槽", en: "Mount · dock slot" }, { zh: "地点 · 家里 Wi-Fi", en: "Place · home Wi-Fi" }, { zh: "时间 · 清晨", en: "Time · early morning" }],
    tap: { zh: "记一件家里的事", en: "Note a home errand" },
    agent: { zh: "早上 07:30 主动念今天的安排和昨天没办完的事；你说「Hey Flo，发吧」就直接替你发出去。", en: "At 07:30 it reads out today and yesterday’s leftovers; say “Hey Flo, send it” and it goes." },
    note: { zh: "能力：主动播报 + 语音确认", en: "Skill: spoken briefings + voice confirm" },
  },
  {
    id: "commute", time: "08:40", tone: "sky", bg: "/images/bg_city.jpg",
    scene: { zh: "通勤", en: "Commute" }, mount: { zh: "戴在手环上", en: "On the wristband" }, mode: { zh: "灵感模式", en: "Idea mode" },
    signals: [{ zh: "挂载 · 手环", en: "Mount · wristband" }, { zh: "动作 · 步行 / 地铁", en: "Motion · walking / subway" }, { zh: "日历 · 09:30 前无会", en: "Calendar · free till 09:30" }],
    tap: { zh: "记住这个想法", en: "Keep this idea" },
    agent: { zh: "把刚才那句话转成文字，按主题放进灵感库；到公司坐下再提醒你看。", en: "Turns the thought into text, files it by topic in your idea box, reminds you at your desk." },
    note: { zh: "能力：灵感速记 + 自动归档", en: "Skill: quick idea capture + auto filing" },
  },
  {
    id: "office", time: "11:20", tone: "mint", bg: "/images/bg_meadow.jpg",
    scene: { zh: "公司工位", en: "At the desk" }, mount: { zh: "吸在手机背面", en: "On the phone" }, mode: { zh: "工作模式", en: "Work mode" },
    signals: [{ zh: "挂载 · 手机背面", en: "Mount · phone back" }, { zh: "地点 · 公司 Wi-Fi", en: "Place · office Wi-Fi" }, { zh: "通话 · 进行中", en: "Call · in progress" }],
    tap: { zh: "这件事要跟进", en: "Follow up on this" },
    agent: { zh: "把电话里答应的事变成待办，时间写进日历，写好回复；你在 FloWork Bar 上单击一下就发出。", en: "Turns what you promised on the call into a task and a calendar slot, drafts the reply; one tap on the FloWork Bar sends it." },
    note: { zh: "能力：待办 + 日历同步", en: "Skill: tasks + calendar sync" },
  },
  {
    id: "meeting", time: "14:00", tone: "violet", bg: "/images/bg_ocean.jpg",
    scene: { zh: "会议", en: "Meeting" }, mount: { zh: "挂在胸前", en: "On the necklace" }, mode: { zh: "会议模式", en: "Meeting mode" },
    signals: [{ zh: "挂载 · 项链", en: "Mount · necklace" }, { zh: "日历 · 客户周会", en: "Calendar · client weekly" }, { zh: "声音 · 多人对话", en: "Audio · several voices" }],
    tap: { zh: "这是一个决策 / 行动项", en: "This is a decision / action" },
    agent: { zh: "会一结束就写好纪要，把每条行动项发给对应的负责人。", en: "The moment it ends: minutes written, each action item sent to its owner." },
    note: { zh: "能力：纪要 + 行动项分发 · 开录前提醒你告知在场的人", en: "Skill: minutes + action routing · reminds you to tell everyone present" },
  },
  {
    id: "gym", time: "19:10", tone: "coral", bg: "/images/bg_city.jpg",
    scene: { zh: "健身房", en: "Gym" }, mount: { zh: "戴在手环上", en: "On the wristband" }, mode: { zh: "训练模式", en: "Training mode" },
    signals: [{ zh: "挂载 · 手环", en: "Mount · wristband" }, { zh: "地点 · 健身房", en: "Place · gym" }, { zh: "动作 · 组间休息", en: "Motion · rest between sets" }],
    tap: { zh: "记下这一组", en: "Log this set" },
    agent: { zh: "手环里的动作传感器自己数组数；回到家，记忆底座给你念训练复盘和下次建议。", en: "The motion sensor counts your sets; back home, the Memory Dock reads your workout recap and next-time tips." },
    note: { zh: "能力：动作传感器计组 + 训练复盘 · 只留你自己的声音", en: "Skill: motion-sensor set count + recap · keeps only your voice" },
  },
];

const ui = {
  detect: { zh: "检测到", en: "Detected" },
  auto: { zh: "自动进入", en: "Switched to" },
  tap: { zh: "双击 =", en: "Double-press =" },
  agent: { zh: "Flow Agent 事后", en: "Flow Agent then" },
  manual: { zh: "识别错了？触控板上滑手动切换", en: "Wrong guess? Swipe up on the trackpad to switch" },
};

type Opt = { id: string; l: L };
const MOUNTS: Opt[] = [
  { id: "band", l: { zh: "手环", en: "Wristband" } },
  { id: "neck", l: { zh: "项链", en: "Necklace" } },
  { id: "phone", l: { zh: "手机背面", en: "Phone back" } },
  { id: "dock", l: { zh: "记忆底座", en: "Memory Dock" } },
];
const WHENS: Opt[] = [
  { id: "weekday", l: { zh: "工作日", en: "Weekdays" } },
  { id: "weekend", l: { zh: "周末", en: "Weekends" } },
  { id: "place", l: { zh: "指定地点", en: "A set place" } },
  { id: "cal", l: { zh: "日历有事件", en: "Calendar event" } },
  { id: "hours", l: { zh: "指定时间段", en: "Set hours" } },
];
const ACTS: Opt[] = [
  { id: "todo", l: { zh: "加入待办", en: "add a task" } },
  { id: "cal", l: { zh: "写进日历", en: "put it on the calendar" } },
  { id: "draft", l: { zh: "起草消息", en: "draft a message" } },
  { id: "brief", l: { zh: "回家播报", en: "read it out at home" } },
  { id: "recap", l: { zh: "生成复盘", en: "write a recap" } },
];

type Custom = { name: string; mount: string; when: string[]; tap: string; acts: string[] };
const KEY = "flowork.customScene";
const defaults = (lang: Lang): Custom => ({
  name: lang === "zh" ? "周末带娃" : "Weekend with kids",
  mount: "neck",
  when: ["weekend", "place"],
  tap: lang === "zh" ? "记下孩子想要的东西" : "Note what the kids asked for",
  acts: ["todo", "brief"],
});
const load = (lang: Lang): Custom => {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return { ...defaults(lang), ...(JSON.parse(raw) as Partial<Custom>) };
  } catch { /* storage unavailable */ }
  return defaults(lang);
};

const cui = {
  scene: { zh: "自定义场景", en: "Custom scene" },
  sub: { zh: "你来定规则", en: "Your own rules" },
  tag: { zh: "自定义", en: "Custom" },
  name: { zh: "场景名称", en: "Scene name" },
  mount: { zh: "挂在哪里", en: "Where it’s mounted" },
  when: { zh: "什么时候生效", en: "When it kicks in" },
  tap: { zh: "双击的含义", en: "What a double-press means" },
  acts: { zh: "Flow Agent 事后做什么", en: "What Flow Agent does after" },
  mountSig: { zh: "挂载 · ", en: "Mount · " },
  none: { zh: "先选一项", en: "pick one" },
  preview: { zh: "预览", en: "Preview" },
  reset: { zh: "恢复默认", en: "Reset" },
  hint: { zh: "只存在你这台设备上，随时可改", en: "Saved on this device only — change it any time" },
};

function Chips({ opts, on, pick, lang }: { opts: Opt[]; on: (id: string) => boolean; pick: (id: string) => void; lang: Lang }) {
  return (
    <div className="mx-chips">
      {opts.map((o) => (
        <button key={o.id} type="button" aria-pressed={on(o.id)} className={`mx-chip ${on(o.id) ? "on" : ""}`} onClick={() => pick(o.id)}>{o.l[lang]}</button>
      ))}
    </div>
  );
}

function Builder({ lang }: { lang: Lang }) {
  const [c, setC] = useState<Custom>(() => load(lang));
  const t = (l: L) => l[lang];
  const set = (p: Partial<Custom>) => setC((o) => ({ ...o, ...p }));
  const toggle = (arr: string[], id: string) => (arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);

  useEffect(() => {
    try { window.localStorage.setItem(KEY, JSON.stringify(c)); } catch { /* storage unavailable */ }
  }, [c]);

  const mount = MOUNTS.find((m) => m.id === c.mount);
  const whens = WHENS.filter((w) => c.when.includes(w.id));
  const acts = ACTS.filter((a) => c.acts.includes(a.id));
  const sep = lang === "zh" ? "、" : ", ";
  const name = c.name.trim() || t(cui.scene);

  return (
    <div className="mx">
      <form className="mx-form" onSubmit={(e) => e.preventDefault()}>
        <label className="mx-field">
          <span>{t(cui.name)}</span>
          <input className="mx-input" value={c.name} maxLength={16} onChange={(e) => set({ name: e.target.value })} />
        </label>
        <div className="mx-field">
          <span>{t(cui.mount)}</span>
          <Chips lang={lang} opts={MOUNTS} on={(id) => c.mount === id} pick={(id) => set({ mount: id })} />
        </div>
        <div className="mx-field">
          <span>{t(cui.when)}</span>
          <Chips lang={lang} opts={WHENS} on={(id) => c.when.includes(id)} pick={(id) => set({ when: toggle(c.when, id) })} />
        </div>
        <label className="mx-field">
          <span>{t(cui.tap)}</span>
          <input className="mx-input" value={c.tap} maxLength={30} onChange={(e) => set({ tap: e.target.value })} />
        </label>
        <div className="mx-field">
          <span>{t(cui.acts)}</span>
          <Chips lang={lang} opts={ACTS} on={(id) => c.acts.includes(id)} pick={(id) => set({ acts: toggle(c.acts, id) })} />
        </div>
        <div className="mx-foot">
          <small>{t(cui.hint)}</small>
          <button type="button" className="mx-reset" onClick={() => setC(defaults(lang))}>{t(cui.reset)}</button>
        </div>
      </form>

      <div className="mx-preview">
        <span className="mx-pv-k">{t(cui.preview)}</span>
        <div className="mode-card mx-card">
          <div className="mode-top">
            <Flo size={84} tone="silver" float className="mode-flo" />
            <div className="mode-head">
              <span className="mode-label">{t(ui.auto)}</span>
              <h3 className="mx-name">{name}</h3>
            </div>
          </div>
          <div className="mode-signals">
            <span className="mode-k">{t(ui.detect)}</span>
            {mount && <span className="sig">{t(cui.mountSig)}{t(mount.l)}</span>}
            {whens.map((w) => <span key={w.id} className="sig">{t(w.l)}</span>)}
          </div>
          <div className="mode-rows">
            <div className="mode-r"><span>{t(ui.tap)}</span><b>{c.tap.trim() || t(cui.none)}</b></div>
            <div className="mode-r"><span>{t(ui.agent)}</span><b>{acts.length ? acts.map((a) => t(a.l)).join(sep) : t(cui.none)}</b></div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DWELL = 5600;
const CUSTOM = modes.length;

export default function Modes({ lang }: { lang: Lang }) {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const t = (l: L) => l[lang];
  const custom = i === CUSTOM;
  const m = modes[custom ? 0 : i];

  useEffect(() => {
    if (!auto) return;
    const id = window.setTimeout(() => setI((n) => (n + 1) % modes.length), DWELL);
    return () => window.clearTimeout(id);
  }, [i, auto]);

  return (
    <div className="modes">
      <ol className="modes-list mx-list" role="tablist">
        {modes.map((x, k) => (
          <li key={x.id}>
            <button role="tab" aria-selected={k === i} className={`mode-row ${k === i ? "on" : ""}`} onClick={() => { setAuto(false); setI(k); }}>
              <Flo size={34} tone={x.tone} />
              <span className="mode-row-t">
                <b>{t(x.scene)}</b>
                <span>{x.time} · {t(x.mount)}</span>
              </span>
              <span className="mode-row-m">{t(x.mode)}</span>
              {k === i && auto && <span key={`p${i}`} className="mode-prog" style={{ animationDuration: `${DWELL}ms` }} />}
            </button>
          </li>
        ))}
        <li>
          <button role="tab" aria-selected={custom} className={`mode-row mx-row ${custom ? "on" : ""}`} onClick={() => { setAuto(false); setI(CUSTOM); }}>
            <Flo size={34} tone="silver" />
            <span className="mode-row-t">
              <b>{t(cui.scene)}</b>
              <span>{t(cui.sub)}</span>
            </span>
            <span className="mode-row-m">+ {t(cui.tag)}</span>
          </button>
        </li>
      </ol>

      {custom ? (
        <div className="mode-stage tone-silver mx-stage">
          <Builder lang={lang} />
        </div>
      ) : (
        <div className={`mode-stage tone-${m.tone}`}>
          <img key={`bg${m.id}`} className="mode-bg" src={m.bg} alt="" aria-hidden="true" />
          <div className="mode-veil" aria-hidden="true" />
          <div key={m.id} className="mode-card">
            <div className="mode-top">
              <Flo size={120} tone={m.tone} float className="mode-flo" />
              <div className="mode-head">
                <span className="mode-time">{m.time} · {t(m.scene)}</span>
                <span className="mode-label">{t(ui.auto)}</span>
                <h3>{t(m.mode)}</h3>
              </div>
            </div>
            <div className="mode-signals">
              <span className="mode-k">{t(ui.detect)}</span>
              {m.signals.map((s, k) => <span key={k} className="sig" style={{ animationDelay: `${120 + k * 110}ms` }}>{t(s)}</span>)}
            </div>
            <div className="mode-rows">
              <div className="mode-r" style={{ animationDelay: "420ms" }}><span>{t(ui.tap)}</span><b>{t(m.tap)}</b></div>
              <div className="mode-r" style={{ animationDelay: "540ms" }}><span>{t(ui.agent)}</span><b>{t(m.agent)}</b></div>
            </div>
            {m.note && <div className="mode-note" style={{ animationDelay: "660ms" }}>● {t(m.note)}</div>}
          </div>
          <small className="mode-manual">{t(ui.manual)}</small>
        </div>
      )}
    </div>
  );
}
