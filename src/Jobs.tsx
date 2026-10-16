import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { L, Lang } from "./content";
import Flo from "./Flo";
import type { FloTone } from "./Flo";

type Entry =
  | { k: "time"; text: L }
  | { k: "user"; text: L }
  | { k: "meta"; label: L; value: L }
  | { k: "bot"; text: L }
  | { k: "tool"; icon: string; title: L; rows: [L, L][] };

type Job = { name: L; hue: number; lead: L; rest: L; entries: Entry[] };

const jobs: Job[] = [
  {
    name: { zh: "家人照护", en: "Family Care" },
    hue: 330,
    lead: { zh: "家里的事，出门也记得。", en: "Home stays on your mind." },
    rest: { zh: "电话里提到的复诊、药和化验单，进日历、生成请假申请，前一晚再提醒一次。", en: "Appointments, meds and lab reports mentioned on calls go to the calendar, with leave drafted." },
    entries: [
      { k: "time", text: { zh: "星期一 09:40 · 录音豆", en: "Mon 09:40 · Recorder" } },
      { k: "user", text: { zh: "你爸下周三上午十点复查，记得带上次的化验单。", en: "Dad’s check-up is next Wednesday 10am, bring the last lab report." } },
      { k: "meta", label: { zh: "Jev 判定", en: "Jev decided" }, value: { zh: "日程 · 家庭 · 日历+请假 0.84", en: "Appointment · Family · Calendar+leave 0.84" } },
      { k: "time", text: { zh: "星期一 20:15 · 记忆底座", en: "Mon 20:15 · Dock" } },
      { k: "bot", text: { zh: "已加进日历，请假申请也提交了。周二晚上我提醒你找化验单。", en: "Added to calendar and leave submitted. I’ll remind you about the report Tuesday night." } },
      { k: "tool", icon: "◷", title: { zh: "日历", en: "Calendar" }, rows: [[{ zh: "事件", en: "Event" }, { zh: "陪爸爸复查", en: "Dad’s check-up" }], [{ zh: "时间", en: "When" }, { zh: "周三 10:00", en: "Wed 10:00" }], [{ zh: "提醒", en: "Reminder" }, { zh: "周二 21:00 · 化验单", en: "Tue 21:00 · lab report" }]] },
    ],
  },  {
    name: { zh: "孩子成长", en: "Kids" },
    hue: 35,
    lead: { zh: "孩子随口一句，你都接得住。", en: "Catch every little thing they say." },
    rest: { zh: "家长群的通知、老师电话里的交代、孩子想要的生日礼物，双击一下就记进家庭日程和清单。", en: "School notices, teacher calls and birthday wishes go straight into the family calendar and lists." },
    entries: [
      { k: "time", text: { zh: "星期三 18:10 · 录音豆", en: "Wed 18:10 · Recorder" } },
      { k: "user", text: { zh: "周五家长会下午四点，老师说要带上这学期的作文本。", en: "Parent meeting Friday 4pm; bring this term’s writing book." } },
      { k: "meta", label: { zh: "Jev 判定", en: "Jev decided" }, value: { zh: "日程 · 家庭 · 前一晚提醒 0.90", en: "Event · Family · Remind night before 0.90" } },
      { k: "time", text: { zh: "星期四 21:00 · 记忆底座", en: "Thu 21:00 · Dock" } },
      { k: "bot", text: { zh: "明天 16:00 家长会，作文本记得放进包里。我已经把你 15:30 以后的会挪开了。", en: "Parent meeting tomorrow at 16:00 — pack the writing book. I cleared your calendar after 15:30." } },
      { k: "tool", icon: "◷", title: { zh: "家庭日程", en: "Family calendar" }, rows: [[{ zh: "事件", en: "Event" }, { zh: "家长会", en: "Parent meeting" }], [{ zh: "时间", en: "When" }, { zh: "周五 16:00", en: "Fri 16:00" }], [{ zh: "带上", en: "Bring" }, { zh: "作文本", en: "Writing book" }]] },
    ],
  },  {
    name: { zh: "家庭生活", en: "Home life" },
    hue: 265,
    lead: { zh: "家里的琐事，交给它来记。", en: "Let it keep the household list." },
    rest: { zh: "冰箱缺什么、周末约了谁、物业说的维修时间，说一句就进清单，路过超市时提醒你。", en: "What the fridge needs, weekend plans, the repair visit — say it once and get reminded near the store." },
    entries: [
      { k: "time", text: { zh: "星期六 09:15 · 记忆底座", en: "Sat 09:15 · Dock" } },
      { k: "user", text: { zh: "Hey Flo，牛奶和咖啡豆没了，周日晚上请爸妈来家里吃饭。", en: "Hey Flo, out of milk and coffee beans; parents over for dinner Sunday night." } },
      { k: "meta", label: { zh: "Jev 判定", en: "Jev decided" }, value: { zh: "采购 + 日程 · 家庭 · 路过时提醒 0.87", en: "Shopping + event · Family · Remind nearby 0.87" } },
      { k: "time", text: { zh: "星期六 17:40 · 手环", en: "Sat 17:40 · Wristband" } },
      { k: "bot", text: { zh: "你在超市附近：牛奶、咖啡豆，再加周日晚饭要的食材，清单已经按爸妈的口味列好了。", en: "You’re near the store: milk, coffee beans and Sunday dinner ingredients, listed to your parents’ taste." } },
      { k: "tool", icon: "☐", title: { zh: "购物清单", en: "Shopping list" }, rows: [[{ zh: "日常", en: "Daily" }, { zh: "牛奶 · 咖啡豆", en: "Milk · coffee beans" }], [{ zh: "周日晚饭", en: "Sunday dinner" }, { zh: "清蒸鱼 · 时蔬", en: "Steamed fish · greens" }], [{ zh: "日程", en: "Event" }, { zh: "周日 18:30 家宴", en: "Sun 18:30 dinner" }]] },
    ],
  },  {
    name: { zh: "训练复盘", en: "Training" },
    hue: 180,
    lead: { zh: "练的时候说，回家看复盘。", en: "Say it mid-set, read it at home." },
    rest: { zh: "训练中的感受和数据被记下，回家后底座给出复盘和下次调整建议。", en: "Feelings and numbers from the session become a debrief at home." },
    entries: [
      { k: "time", text: { zh: "星期六 07:30 · 录音豆", en: "Sat 07:30 · Recorder" } },
      { k: "user", text: { zh: "第三组深蹲 100 公斤，右膝有点紧，下次先热身久一点。", en: "Third set squat 100kg, right knee a bit tight, warm up longer next time." } },
      { k: "meta", label: { zh: "Jev 判定", en: "Jev decided" }, value: { zh: "训练记录 · 个人 · 回家复盘 0.88", en: "Training log · Personal · Debrief 0.88" } },
      { k: "time", text: { zh: "星期六 19:00 · 记忆底座", en: "Sat 19:00 · Dock" } },
      { k: "bot", text: { zh: "今天的复盘好了：总量比上周多 8%，下次热身我加了 5 分钟膝关节激活。", en: "Debrief ready: volume up 8% on last week, and I added 5 min of knee activation to warm-up." } },
      { k: "tool", icon: "▲", title: { zh: "训练复盘", en: "Debrief" }, rows: [[{ zh: "总量", en: "Volume" }, { zh: "+8% 对比上周", en: "+8% vs last week" }], [{ zh: "注意", en: "Watch" }, { zh: "右膝紧张", en: "Right knee tight" }], [{ zh: "下次", en: "Next" }, { zh: "热身 +5 分钟", en: "Warm-up +5 min" }]] },
    ],
  },  {
    name: { zh: "客户会议", en: "Client Meetings" },
    hue: 145,
    lead: { zh: "承诺不再掉地上。", en: "Promises don’t get dropped." },
    rest: { zh: "会上双击一下，助理把答应的事变成待办，按截止时间起草邮件，晚上回家提醒你发出。", en: "Double-tap in the meeting; the assistant turns promises into to-dos, drafts the email and reminds you at home." },
    entries: [
      { k: "time", text: { zh: "星期三 14:02 · 录音豆", en: "Wed 14:02 · Recorder" } },
      { k: "user", text: { zh: "没问题，我周五前把第二批 200 台的报价发给您，抄送采购小李。", en: "Sure, I’ll send the quote for the second batch of 200 by Friday, cc Li from procurement." } },
      { k: "meta", label: { zh: "Jev 判定", en: "Jev decided" }, value: { zh: "承诺 · 工作 · 今晚提醒 0.93", en: "Commitment · Work · Remind tonight 0.93" } },
      { k: "time", text: { zh: "今天 20:15 · 记忆底座", en: "Today 20:15 · Dock" } },
      { k: "bot", text: { zh: "报价草稿好了，你确认后我就发。周五前完成。", en: "Quote draft is ready. Say the word and I’ll send it before Friday." } },
      { k: "tool", icon: "✉", title: { zh: "邮件", en: "Email" }, rows: [[{ zh: "收件人", en: "To" }, { zh: "王总", en: "Mr. Wang" }], [{ zh: "抄送", en: "Cc" }, { zh: "采购 · 小李", en: "Li, Procurement" }], [{ zh: "主题", en: "Subject" }, { zh: "第二批 200 台报价", en: "Batch-2 quote, 200 units" }]] },
    ],
  },  {
    name: { zh: "外勤拜访", en: "Field Visits" },
    hue: 205,
    lead: { zh: "拜访结束，记录已写好。", en: "Visit over, notes done." },
    rest: { zh: "客户说的预算、竞品和下次时间，自动整理进 CRM，并起草跟进消息。", en: "Budget, competitors and next steps land in the CRM with a follow-up drafted." },
    entries: [
      { k: "time", text: { zh: "星期四 10:40 · 录音豆", en: "Thu 10:40 · Recorder" } },
      { k: "user", text: { zh: "他们预算大概 30 万，在比另外两家，下周二再约一次。", en: "Budget is about 300k, comparing two vendors, meet again next Tuesday." } },
      { k: "meta", label: { zh: "Jev 判定", en: "Jev decided" }, value: { zh: "商机 · 工作 · 立即记录 0.89", en: "Lead · Work · Log now 0.89" } },
      { k: "time", text: { zh: "星期四 11:05", en: "Thu 11:05" } },
      { k: "bot", text: { zh: "CRM 已更新，下周二 15:00 的回访也放进日历了。", en: "CRM updated and next Tuesday 15:00 is on your calendar." } },
      { k: "tool", icon: "◧", title: { zh: "CRM 记录", en: "CRM record" }, rows: [[{ zh: "客户", en: "Account" }, { zh: "星河制造", en: "Xinghe Mfg." }], [{ zh: "预算", en: "Budget" }, { zh: "约 30 万", en: "~300k" }], [{ zh: "下一步", en: "Next" }, { zh: "周二 15:00 回访", en: "Tue 15:00 visit" }]] },
    ],
  },];

const ui = {
  title: { zh: "一个 Flo，工作和生活两副面孔", en: "One Flo, at work and at home" },
  more: { zh: "试玩完整 Demo", en: "Try the full demo" },
  placeholder: { zh: "给「{n}」发消息…", en: "Message {n}…" },
  running: { zh: "执行中", en: "Running" },
  done: { zh: "已完成", en: "Done" },
};

// Timings follow the reference: entries pop in one by one, typing dots precede the bot reply.
const STEP = 700;
const TYPING = 1100;

const TONES: Record<number, FloTone> = { 145: "mint", 205: "sky", 330: "coral", 35: "amber", 265: "violet", 180: "silver" };

/** Each job is a Flo in its own colour; it hops in when picked. */
function Avatar({ hue, size = 24, draw = false }: { hue: number; size?: number; draw?: boolean }) {
  return <Flo size={size} tone={TONES[hue] ?? "amber"} className={draw ? "hop" : ""} />;
}

export default function Jobs({ lang, tag }: { lang: Lang; tag?: ReactNode }) {
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);
  const [toolDone, setToolDone] = useState(false);
  const [auto, setAuto] = useState(true);
  const scroller = useRef<HTMLDivElement>(null);
  const t = (l: L) => l[lang];
  const job = jobs[idx];

  // Play the conversation for the selected job
  useEffect(() => {
    setShown(0); setTyping(false); setToolDone(false);
    const timers: number[] = [];
    let at = 300;
    job.entries.forEach((e, i) => {
      if (e.k === "bot") {
        timers.push(window.setTimeout(() => setTyping(true), at));
        at += TYPING;
        timers.push(window.setTimeout(() => setTyping(false), at));
      }
      timers.push(window.setTimeout(() => setShown(i + 1), at));
      at += e.k === "time" ? 250 : STEP;
    });
    timers.push(window.setTimeout(() => setToolDone(true), at + 900));
    if (auto) timers.push(window.setTimeout(() => setIdx((n) => (n + 1) % jobs.length), at + 4200));
    return () => timers.forEach(window.clearTimeout);
  }, [idx, auto, job.entries]);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [shown, typing, toolDone]);

  const pick = (i: number) => { setAuto(false); setIdx(i); };
  const listening = shown === 1; // waveform while the recorder clip lands

  return (
    <div className="jobs">
      <div className="jobs-left">
        {tag && <div className="reveal">{tag}</div>}
        <h2 className="reveal">{t(ui.title)}</h2>
        <p className="jobs-sub reveal">{t({ zh: "白天它是你的工作助理，回到家就换成家里的管家：照顾家人、孩子的事、柴米油盐，Flo 都替你记着。", en: "By day it’s your work assistant; at home it becomes the house butler — family, kids and errands, Flo keeps track." })}</p>
        <div className="chips reveal" role="tablist">
          {jobs.map((j, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === idx}
              className={`chip-job ${i === idx ? "on" : ""}`}
              style={{ "--h": j.hue } as CSSProperties}
              onClick={() => pick(i)}
            >
              {i === idx && <Avatar key={idx} hue={j.hue} draw />}
              {t(j.name)}
            </button>
          ))}
        </div>
        <p key={idx} className="jobs-desc">
          <b>{t(job.lead)}</b> {t(job.rest)}
        </p>
        <a className="pill dark" href="#demo">{t(ui.more)}</a>
      </div>

      <div className="iphone reveal">
        <div className="iphone-island" />
        <div className="iphone-head">
          <span className="ic-btn" aria-hidden="true">‹</span>
          <span className="bot-pill"><Avatar key={idx} hue={job.hue} size={24} draw />{t(job.name)}</span>
          <span className="ic-btn" aria-hidden="true">◎</span>
        </div>
        <div className="iphone-feed" ref={scroller}>
          <div key={idx} className="feed-in">
            {job.entries.slice(0, shown).map((e, i) => {
              if (e.k === "time") return <div key={i} className="f-time pop">{t(e.text)}</div>;
              if (e.k === "user") return <div key={i} className="f-user pop">{t(e.text)}</div>;
              if (e.k === "meta") return (
                <div key={i} className="f-meta pop">
                  <span>{t(e.label)}</span><span className="clock" aria-hidden="true" /><b>{t(e.value)}</b>
                </div>
              );
              if (e.k === "bot") return <div key={i} className="f-bot pop">{t(e.text)}</div>;
              return (
                <div key={i} className="f-tool pop">
                  <div className="f-tool-h">
                    <span className="f-tool-ic">{e.icon}</span>
                    <b>{t(e.title)}</b>
                    <span className={`f-status ${toolDone ? "ok" : ""}`}>
                      {toolDone ? <><svg className="check" viewBox="0 0 12 12"><path d="M2.5 6.2l2.3 2.3 4.7-5" /></svg>{t(ui.done)}</> : <><span className="spin" />{t(ui.running)}</>}
                    </span>
                  </div>
                  <div className="f-rows">
                    {e.rows.map(([k, v], j) => (
                      <div key={j} className="f-row" style={{ animationDelay: `${120 + j * 110}ms` }}>
                        <span>{t(k)}</span><span>{t(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {typing && <div className="f-typing pop" aria-label="typing"><i /><i /><i /></div>}
          </div>
        </div>
        <div className="iphone-input">
          <span className="ic-btn add" aria-hidden="true">+</span>
          <span className="msg">{t(ui.placeholder).replace("{n}", t(job.name))}</span>
          <span className={`mic ${listening ? "live" : ""}`} aria-hidden="true">
            {listening ? <span className="wave"><i /><i /><i /><i /><i /></span> : <svg viewBox="0 0 16 16" width="14" height="14"><rect x="5.5" y="1.5" width="5" height="8" rx="2.5" /><path d="M3 7.5a5 5 0 0 0 10 0M8 12.5v2" /></svg>}
          </span>
        </div>
      </div>
    </div>
  );
}
