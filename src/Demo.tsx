import "./demo-day.css";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { L, Lang } from "./content";
import Flo from "./Flo";

/* ---------------------------------------------------------------
   精英白领的一天 — a day-timeline walkthrough.
   Each step is a short sequence of beats; a beat decides what the
   phone app shows (left) and what the context panel shows (right).
   --------------------------------------------------------------- */

type Scene = "out" | "meet" | "home";
type Bubble = { who: "flo" | "you"; text: L; undo?: boolean };
type Right =
  | { kind: "video"; scene: Scene; bubbles?: Bubble[] }
  | { kind: "agent"; pipe: Pipe };
type Beat = { ms: number; phone: ReactNode; phoneKey: string; right: Right };
type Step = { id: string; time: L; place: L; mount: L; mode: L; say: L; clock: string; beats: Beat[] };

type Pipe = {
  clip: L;
  quote: L;
  who: L;
  q: L;
  opts: { label: L; p: number }[];
  more: L;
  latency: number;
  draft: L;
  wait: L;
};

type T = (l: L) => string;

/* ---------- copy ---------- */

const ui = {
  eyebrow: { zh: "交互 Demo", en: "Interactive demo" },
  title: { zh: "精英白领的一天", en: "A day with FloWork" },
  sub: { zh: "从早上的晨报到第二天的闭环：在录音豆上双击，剩下交给 Flo", en: "From one morning briefing to the next: double-press the recorder, Flo handles the rest" },
  play: { zh: "自动播放", en: "Autoplay" },
  pause: { zh: "暂停", en: "Pause" },
  prev: { zh: "上一步", en: "Previous" },
  next: { zh: "下一步", en: "Next" },
  phone: { zh: "手机 App", en: "Phone app" },
  rec: { zh: "录音中", en: "Recording" },
  mark: { zh: "标记这一句", en: "Mark this line" },
  marked: { zh: "已交给 Flo", en: "Handed to Flo" },
  judging: { zh: "Jev 判断中…", en: "Jev deciding…" },
  consent: { zh: "已提示你告知在场的人 · 在录音豆上按一下即可停止", en: "Reminded you to tell people present · press the recorder to stop" },
  marks: { zh: "标记", en: "Marks" },
  agentHead: { zh: "Flow Agent 正在处理", en: "Flow Agent at work" },
  s1: { zh: "截取片段", en: "Clip" },
  s2: { zh: "转写", en: "Transcribe" },
  s3: { zh: "Jev 判断", en: "Jev decides" },
  s4: { zh: "Flow Agent 起草", en: "Flow Agent drafts" },
  s5: { zh: "等你确认", en: "Waiting for you" },
  jevNote: { zh: "只输出选项与概率", en: "Options + probabilities only" },
  you: { zh: "你", en: "You" },
  undo: { zh: "撤销", en: "Undo" },
};

const quoteLine: L = { zh: "没问题，我周五前把报价单发给您。", en: "Sure, I'll send you the quote by Friday." };

const deskPipe: Pipe = {
  clip: { zh: "11:19:24 – 11:20:16 · 电话 · 0:52", en: "11:19:24 – 11:20:16 · call · 0:52" },
  who: { zh: "陈可 · 设计", en: "Chen Ke · Design" },
  quote: { zh: "设计评审挪到周四上午十点，你顺手建个飞书待办。", en: "Design review moves to Thu 10 am, can you add a Feishu to-do?" },
  q: { zh: "这段话是", en: "This clip is" },
  opts: [
    { label: { zh: "日程", en: "Schedule" }, p: 0.88 },
    { label: { zh: "承诺", en: "Promise" }, p: 0.09 },
    { label: { zh: "闲聊", en: "Chit-chat" }, p: 0.03 },
  ],
  more: { zh: "工作 0.97 · 会前 15 分钟提醒 0.84", en: "Work 0.97 · remind 15 min before 0.84" },
  latency: 96,
  draft: { zh: "日历 周四 10:00 · 飞书待办 +1 · 回复「好的，周四见」", en: "Calendar Thu 10:00 · Feishu to-do +1 · reply “OK, see you Thu”" },
  wait: { zh: "日历已同步，回复等你点发送", en: "Calendar synced; the reply waits for your tap" },
};

const meetPipe: Pipe = {
  clip: { zh: "14:01:40 – 14:02:38 · 客户会 · 0:58", en: "14:01:40 – 14:02:38 · client call · 0:58" },
  who: { zh: "我 → 王总", en: "Me → Mr. Wang" },
  quote: quoteLine,
  q: { zh: "这段话是", en: "This clip is" },
  opts: [
    { label: { zh: "承诺", en: "Promise" }, p: 0.93 },
    { label: { zh: "日程", en: "Schedule" }, p: 0.05 },
    { label: { zh: "闲聊", en: "Chit-chat" }, p: 0.02 },
  ],
  more: { zh: "工作 0.96 · 今晚回家提醒 0.81", en: "Work 0.96 · remind tonight at home 0.81" },
  latency: 118,
  draft: { zh: "邮件 · 收件王总 · 抄送小李 · 附报价单", en: "Email · to Mr. Wang · cc Li · quote attached" },
  wait: { zh: "回家后提醒你：App 点一下、Bar 轻触或说 Hey Flo", en: "At home: tap the app, touch the Bar, or say Hey Flo" },
};

/* ---------- phone screens ---------- */

type Item = { at: string; text: L; tag?: L; state?: "done" | "carry" };

function TodayScreen({ t, title, date, items, foot }: { t: T; title: L; date: L; items: Item[]; foot?: L }) {
  return (
    <div className="dd-scr dd-today">
      <div className="dd-scr-top"><span className="dd-sub">{t(date)}</span></div>
      <h4 className="dd-h">{t(title)}</h4>
      <ul className="dd-list">
        {items.map((it, i) => (
          <li key={i} className={`dd-item ${it.state ?? ""}`} style={{ "--i": i } as CSSProperties}>
            <span className="dd-at">{it.at}</span>
            <span className="dd-it">
              {t(it.text)}
              {it.tag && <em>{t(it.tag)}</em>}
            </span>
            <span className="dd-tick" aria-hidden="true">{it.state === "done" ? <Check /> : null}</span>
          </li>
        ))}
      </ul>
      {foot && <p className="dd-foot">{t(foot)}</p>}
    </div>
  );
}

const WAVE = [5, 9, 14, 8, 18, 11, 22, 15, 9, 20, 13, 24, 10, 17, 7, 19, 12, 21, 8, 14, 6, 11, 16, 9, 5, 8];

function Clock({ from }: { from: number }) {
  const [s, setS] = useState(from);
  useEffect(() => {
    setS(from);
    const id = window.setInterval(() => setS((v) => v + 1), 1000);
    return () => window.clearInterval(id);
  }, [from]);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return <>{mm}:{ss}</>;
}

type Mark = { at: string; text: L; note?: L };

function RecScreen({ t, mode, from, lines, marks, pressed, toast, chip }: {
  t: T; mode: L; from: number; lines?: { who: L; text: L }[]; marks: Mark[]; pressed?: boolean; toast?: L; chip?: L;
}) {
  return (
    <div className="dd-scr dd-rec">
      <div className="dd-rec-top"><span className="dd-amber" />{t(ui.rec)}</div>
      <div className="dd-timer"><Clock from={from} /></div>
      <div className="dd-mode">{t(mode)}</div>
      {chip && <div className="dd-chip">{t(chip)}</div>}
      <div className="dd-wave" aria-hidden="true">
        {WAVE.map((h, i) => <i key={i} style={{ height: h * 1.6, animationDelay: `${(i % 7) * -0.17}s` } as CSSProperties} />)}
      </div>
      {lines && (
        <div className="dd-lines">
          {lines.map((l, i) => (
            <p key={i} className="dd-line"><span>{t(l.who)}</span>{t(l.text)}</p>
          ))}
        </div>
      )}
      <div className="dd-marks">
        {marks.length > 0 && <div className="dd-sub">{t(ui.marks)} · {marks.length}</div>}
        {marks.map((m, i) => (
          <div key={i} className="dd-mcard dd-pop">
            <span className="dd-mono">{m.at} · {m.note ? t(m.note) : t(ui.marked)}</span>
            <span>“{t(m.text)}”</span>
          </div>
        ))}
      </div>
      {toast && <div className="dd-toast dd-pop"><Check />{t(toast)}</div>}
      <div className="dd-rec-foot">
        <p>{t(ui.consent)}</p>
        <div className="dd-btns">
          <span className={`dd-btn-w ${pressed ? "press" : ""}`}>{t(ui.mark)}</span>
          <span className="dd-btn-o" aria-hidden="true"><MicOff /></span>
        </div>
      </div>
    </div>
  );
}

function ConfirmScreen({ t, state }: { t: T; state: "wait" | "heard" | "sent" }) {
  return (
    <div className="dd-scr dd-confirm">
      <div className="dd-bar-h"><span>‹</span><b>{state === "sent" ? t({ zh: "已完成", en: "Done" }) : t({ zh: "待确认 1/1", en: "To confirm 1/1" })}</b><span /></div>
      <span className="dd-tag">{t({ zh: "周五前 · 工作", en: "By Friday · Work" })}</span>
      <h4 className="dd-h sm">{t({ zh: "给王总发第二批 200 台报价，抄送小李", en: "Send Mr. Wang the batch-2 quote, cc Li" })}</h4>
      <div className="dd-quote">
        <span className="dd-play" aria-hidden="true">▶</span>
        <div>
          <p>“{t(quoteLine)}”</p>
          <span className="dd-mono">14:02 · {t({ zh: "客户会 · 0:58 片段", en: "client call · 0:58 clip" })}</span>
        </div>
      </div>
      <div className="dd-sub">Jev {t({ zh: "判断", en: "judgment" })}</div>
      {[
        { q: { zh: "这段话是 承诺", en: "Clip is a promise" }, p: 0.93 },
        { q: { zh: "属于 工作", en: "Domain: work" }, p: 0.96 },
        { q: { zh: "何时提醒 今晚回家", en: "Remind: tonight" }, p: 0.81 },
      ].map((r, i) => (
        <div key={i} className="dd-pbar">
          <div><span>{t(r.q)}</span><span className="dd-mono">{Math.round(r.p * 100)}%</span></div>
          <span className="dd-track"><i style={{ "--p": r.p, animationDelay: `${0.15 + i * 0.12}s` } as CSSProperties} /></span>
        </div>
      ))}
      <div className="dd-draft">
        <div className="dd-draft-h">
          <span className="dd-sub">{t({ zh: "邮件草稿", en: "Email draft" })}</span>
          <span>{t({ zh: "收件：王总 · 抄送：小李（采购）", en: "To: Mr. Wang · cc: Li (procurement)" })}</span>
        </div>
        <p>{t({ zh: "王总您好，附件是第二批 200 台的报价单，已抄送采购李工。如有疑问随时联系。", en: "Hi Mr. Wang, attached is the quote for the second batch of 200 units, cc'ing Li. Any questions, just let me know." })}</p>
      </div>
      {state === "wait" && (
        <div className="dd-btns">
          <span className="dd-btn-w">{t({ zh: "确认发送", en: "Confirm & send" })}</span>
          <span className="dd-btn-g">{t({ zh: "回家再说", en: "Later" })}</span>
        </div>
      )}
      {state === "heard" && (
        <div className="dd-heard dd-pop"><Flo size={20} />{t({ zh: "底座听到：“Hey Flo，发吧”", en: "Dock heard: “Hey Flo, send it”" })}</div>
      )}
      {state === "sent" && (
        <div className="dd-sent dd-pop">
          <div><Check />{t({ zh: "已发送给王总，抄送小李", en: "Sent to Mr. Wang, cc Li" })}<span className="dd-undo">{t(ui.undo)} <Countdown from={3} /></span></div>
          <span className="dd-undo-bar"><i /></span>
        </div>
      )}
    </div>
  );
}

function Countdown({ from }: { from: number }) {
  const [n, setN] = useState(from);
  useEffect(() => {
    const id = window.setInterval(() => setN((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="dd-mono">{n}s</span>;
}

function SyncedScreen({ t }: { t: T }) {
  const rows: { ic: string; h: L; b: L; state: L; ok?: boolean }[] = [
    { ic: "◷", h: { zh: "日历", en: "Calendar" }, b: { zh: "周四 10:00 设计评审（已从周三改期）", en: "Thu 10:00 design review (moved from Wed)" }, state: { zh: "已同步", en: "Synced" }, ok: true },
    { ic: "☐", h: { zh: "飞书待办", en: "Feishu to-do" }, b: { zh: "评审前整理第二版设计稿", en: "Prep design v2 before review" }, state: { zh: "已同步", en: "Synced" }, ok: true },
    { ic: "✉", h: { zh: "回复陈可", en: "Reply to Chen Ke" }, b: { zh: "好的，周四十点见，我把第二版带上。", en: "OK, see you Thu at 10, I'll bring v2." }, state: { zh: "待发送", en: "To send" } },
  ];
  return (
    <div className="dd-scr dd-synced">
      <div className="dd-bar-h"><span>‹</span><b>{t({ zh: "Flo 处理好了", en: "Flo is done" })}</b><span /></div>
      <p className="dd-sub">{t({ zh: "11:20 · 电话 · 工作模式", en: "11:20 · call · Work mode" })}</p>
      {rows.map((r, i) => (
        <div key={i} className="dd-row" style={{ "--i": i } as CSSProperties}>
          <span className="dd-ic" aria-hidden="true">{r.ic}</span>
          <div><b>{t(r.h)}</b><p>{t(r.b)}</p></div>
          <span className={`dd-state ${r.ok ? "ok" : ""}`}>{r.ok && <Check />}{t(r.state)}</span>
        </div>
      ))}
      <div className="dd-btns">
        <span className="dd-btn-w">{t({ zh: "发送回复", en: "Send reply" })}</span>
        <span className="dd-btn-g">{t({ zh: "改一下", en: "Edit" })}</span>
      </div>
    </div>
  );
}

function IdeaScreen({ t }: { t: T }) {
  const ideas: { at: L; text: L; tag: L; fresh?: boolean }[] = [
    { at: { zh: "08:41", en: "08:41" }, text: { zh: "发布会开场别讲参数，讲「一天只需要按两次」。", en: "Open the launch with “you only press twice a day”, not specs." }, tag: { zh: "发布会", en: "Launch" }, fresh: true },
    { at: { zh: "周一", en: "Mon" }, text: { zh: "周报改成三句话模板：做了什么、卡在哪、要谁帮。", en: "Weekly report as three lines: done, blocked, need." }, tag: { zh: "团队", en: "Team" } },
    { at: { zh: "周日", en: "Sun" }, text: { zh: "给爸妈的体检预约做成共享日历。", en: "Shared calendar for parents' check-ups." }, tag: { zh: "家庭", en: "Family" } },
  ];
  return (
    <div className="dd-scr dd-ideas">
      <div className="dd-bar-h"><span>‹</span><b>{t({ zh: "灵感库", en: "Idea vault" })}</b><span /></div>
      <div className="dd-toast static dd-pop"><Check />{t({ zh: "已存入灵感库 · 08:41", en: "Saved to Idea vault · 08:41" })}</div>
      {ideas.map((d, i) => (
        <div key={i} className={`dd-idea ${d.fresh ? "fresh" : ""}`} style={{ "--i": i } as CSSProperties}>
          <span className="dd-mono">{t(d.at)} · {t(d.tag)}</span>
          <p>{t(d.text)}</p>
        </div>
      ))}
    </div>
  );
}

function LogScreen({ t }: { t: T }) {
  const sets = [
    { n: 1, w: "70 kg × 10" },
    { n: 2, w: "75 kg × 8" },
    { n: 3, w: "80 kg × 8", fresh: true },
  ];
  return (
    <div className="dd-scr dd-log">
      <div className="dd-bar-h"><span>‹</span><b>{t({ zh: "训练日志", en: "Training log" })}</b><span /></div>
      <div className="dd-toast static dd-pop"><Check />{t({ zh: "已记下第 3 组", en: "Set 3 logged" })}</div>
      <h4 className="dd-h sm">{t({ zh: "深蹲", en: "Squat" })}</h4>
      {sets.map((s) => (
        <div key={s.n} className={`dd-set ${s.fresh ? "fresh" : ""}`}>
          <span className="dd-mono">{t({ zh: "第", en: "Set " })}{s.n}{t({ zh: " 组", en: "" })}</span>
          <b className="dd-mono">{s.w}</b>
        </div>
      ))}
      <p className="dd-foot">{t({ zh: "只保留了你的声音，旁边的人声已丢弃。", en: "Only your voice was kept; other voices were dropped." })}</p>
    </div>
  );
}

function PhoneFrame({ clock, rec, children, label }: { clock: string; rec: boolean; children: ReactNode; label: string }) {
  return (
    <div className="dd-phone" aria-label={label}>
      <div className="dd-screen">
        <div className="dd-status">
          <span className="dd-mono">{clock}</span>
          <span className={`dd-island ${rec ? "rec" : ""}`}><i /></span>
          <span className="dd-sig" aria-hidden="true"><i /><i /><i /></span>
        </div>
        <div className="dd-view">{children}</div>
        <span className="dd-home" aria-hidden="true" />
      </div>
    </div>
  );
}

/* ---------- right panel ---------- */

function Pipeline({ t, pipe }: { t: T; pipe: Pipe }) {
  const stages = [ui.s1, ui.s2, ui.s3, ui.s4, ui.s5];
  const body = (i: number) => {
    if (i === 0) return <span className="dd-mono">{t(pipe.clip)}</span>;
    if (i === 1) return <p><span className="dd-who">{t(pipe.who)}</span>“{t(pipe.quote)}”</p>;
    if (i === 2) return (
      <div className="dd-jev">
        <div className="dd-jev-q"><span>{t(pipe.q)}</span><span className="dd-mono">{pipe.latency} ms</span></div>
        {pipe.opts.map((o, j) => (
          <div key={j} className={`dd-jrow ${j === 0 ? "top" : ""}`}>
            <span>{t(o.label)}</span>
            <span className="dd-track"><i style={{ "--p": o.p, animationDelay: `${1.6 + j * 0.12}s` } as CSSProperties} /></span>
            <span className="dd-mono">{o.p.toFixed(2)}</span>
          </div>
        ))}
        <span className="dd-mono dd-more">{t(pipe.more)} · {t(ui.jevNote)}</span>
      </div>
    );
    if (i === 3) return <p>{t(pipe.draft)}</p>;
    return <p>{t(pipe.wait)}</p>;
  };
  return (
    <div className="dd-agent">
      <div className="dd-agent-h">
        <Flo size={34} float />
        <div><b>{t(ui.agentHead)}</b><span className="dd-mono">Jev · Flow Agent</span></div>
      </div>
      <ol className="dd-pipe">
        <span className="dd-pipe-rail" aria-hidden="true"><i /></span>
        {stages.map((s, i) => (
          <li key={i} className={`dd-pstage ${i === 4 ? "last" : ""}`} style={{ "--d": `${i * 0.75}s` } as CSSProperties}>
            <span className="dd-node" aria-hidden="true"><span className="dd-mono">{i + 1}</span><Check /></span>
            <div className="dd-card">
              <div className="dd-card-h">{t(s)}</div>
              {body(i)}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

const VIDEOS: Record<Scene, { src: string; poster: string }> = {
  out: { src: "/video/scene_out.mp4", poster: "/video/scene_out.jpg" },
  meet: { src: "/video/scene_meet.mp4", poster: "/video/scene_meet.jpg" },
  home: { src: "/video/scene_home.mp4", poster: "/video/scene_home.jpg" },
};

function Media({ t, right, stepKey, caption, live }: { t: T; right: Right; stepKey: string; caption: string; live: boolean }) {
  const refs = useRef<Record<Scene, HTMLVideoElement | null>>({ out: null, meet: null, home: null });
  const [seen, setSeen] = useState<Record<Scene, boolean>>({ out: false, meet: false, home: false });
  const active: Scene | null = right.kind === "video" ? right.scene : null;

  useEffect(() => {
    if (active && !seen[active]) setSeen((s) => ({ ...s, [active]: true }));
    (Object.keys(refs.current) as Scene[]).forEach((k) => {
      const v = refs.current[k];
      if (!v) return;
      if (k === active && live) v.play().catch(() => {});
      else v.pause();
    });
  }, [active, live, seen]);

  return (
    <div className="dd-media">
      {(Object.keys(VIDEOS) as Scene[]).map((k) => (
        <video
          key={k}
          ref={(el) => { refs.current[k] = el; }}
          className={`dd-video ${k === active ? "on" : ""}`}
          src={seen[k] || k === active ? VIDEOS[k].src : undefined}
          poster={VIDEOS[k].poster}
          muted
          loop
          playsInline
          preload={k === active ? "auto" : "none"}
          aria-hidden="true"
        />
      ))}
      <div className={`dd-veil ${active ? "" : "dim"}`} aria-hidden="true" />
      {active && <span className="dd-cap"><span className={`dd-cap-dot ${active === "home" ? "" : "rec"}`} />{caption}</span>}
      {right.kind === "agent" && <div key={stepKey} className="dd-agent-wrap"><Pipeline t={t} pipe={right.pipe} /></div>}
      {right.kind === "video" && right.bubbles && (
        <div className="dd-talk">
          {right.bubbles.map((b, i) => (
            <div key={`${stepKey}-${i}`} className={`dd-bub dd-bub-${b.who} dd-pop`}>
              <span className="dd-bub-who">{b.who === "flo" ? <><Flo size={16} /> FLO · {t({ zh: "记忆底座", en: "Memory dock" })}</> : <>{t(ui.you)} · Hey Flo</>}</span>
              {t(b.text)}
              {b.undo && <span className="dd-undo">{t(ui.undo)} <Countdown from={3} /></span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- icons ---------- */

const Check = () => <svg className="dd-check" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.2l2.3 2.3 4.7-5" /></svg>;
const MicOff = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><rect x="5.5" y="1.5" width="5" height="8" rx="2.5" /><path d="M3 7.5a5 5 0 0 0 10 0M8 12.5v2M2 2l12 12" /></svg>
);

/* ---------- the day ---------- */

function buildSteps(t: T): Step[] {
  const briefing: Bubble = { who: "flo", text: { zh: "早上好。今天 3 件事：11:00 和陈可电话对设计稿，14:00 王总客户会，19:00 健身。昨天还剩 1 件：回复 HR 的体检预约。", en: "Morning. Three things today: 11:00 call with Chen Ke on the design, 14:00 client meeting with Mr. Wang, 19:00 gym. One left from yesterday: reply to HR about the check-up." } };
  const nightBrief: Bubble = { who: "flo", text: { zh: "欢迎回家。今天标记了 3 件事，还有 1 件没办完：给王总的报价邮件待发送。要现在发吗？", en: "Welcome home. You marked 3 things today; 1 is still open: the quote email to Mr. Wang. Send it now?" } };
  const youSend: Bubble = { who: "you", text: { zh: "Hey Flo，发吧。", en: "Hey Flo, send it." } };
  const sent: Bubble = { who: "flo", text: { zh: "已发送，抄送了小李。", en: "Sent, with Li cc'd." }, undo: true };
  const morning2: Bubble = { who: "flo", text: { zh: "早上好。报价已发，王总昨晚已读；今天 14:00 回访确认，10:00 设计评审别忘了带第二版。", en: "Morning. The quote went out and Mr. Wang read it last night; follow up at 14:00, and bring design v2 to the 10:00 review." } };

  const commuteRec = (marks: Mark[], pressed?: boolean, toast?: L) => (
    <RecScreen t={t} mode={{ zh: "灵感模式 · 手环 · 通勤", en: "Idea mode · wristband · commute" }} from={612} marks={marks} pressed={pressed} toast={toast} />
  );
  const idea: Mark = { at: "08:41:07", text: { zh: "发布会开场别讲参数，讲「一天只需要按两次」。", en: "Open the launch with “you only press twice a day”." } };

  const callLines = [
    { who: { zh: "陈可", en: "Chen Ke" }, text: { zh: "设计评审挪到周四上午十点，你顺手建个飞书待办。", en: "Design review moves to Thu 10 am, add a Feishu to-do?" } },
  ];
  const callRec = (marks: Mark[], pressed?: boolean) => (
    <RecScreen t={t} mode={{ zh: "工作模式 · 手机背面 · 电话", en: "Work mode · phone back · call" }} from={47} lines={callLines} marks={marks} pressed={pressed} />
  );

  const meetLines = [
    { who: { zh: "王总", en: "Mr. Wang" }, text: { zh: "第二批 200 台的价格，能再给个方案吗？", en: "Can you send a new price for the second 200 units?" } },
    { who: { zh: "我", en: "Me" }, text: quoteLine },
  ];
  const meetRec = (marks: Mark[], pressed?: boolean) => (
    <RecScreen t={t} mode={{ zh: "会议模式 · 项链 · 客户会", en: "Meeting mode · necklace · client call" }} from={2538} lines={meetLines} marks={marks} pressed={pressed} />
  );

  const gymRec = (marks: Mark[], pressed?: boolean) => (
    <RecScreen t={t} mode={{ zh: "训练模式 · 手环 · 健身房", en: "Training mode · wristband · gym" }} from={1325} chip={{ zh: "只保留佩戴者的声音", en: "Wearer's voice only" }} marks={marks} pressed={pressed} />
  );

  return [
    {
      id: "am", clock: "07:30",
      time: { zh: "07:30", en: "07:30" }, place: { zh: "在家", en: "Home" }, mount: { zh: "记忆底座", en: "Memory dock" }, mode: { zh: "晨报", en: "Briefing" },
      say: { zh: "起床时，记忆底座用语音播报今天的日程，顺带提醒昨天还没做完的事。", en: "As you get up, the memory dock reads out today's plan and what's left from yesterday." },
      beats: [{
        ms: 6500, phoneKey: "am",
        phone: <TodayScreen t={t} date={{ zh: "周三 · 07:30", en: "Wed · 07:30" }} title={{ zh: "今天", en: "Today" }} items={[
          { at: "11:00", text: { zh: "陈可电话 · 设计稿", en: "Call Chen Ke · design" } },
          { at: "14:00", text: { zh: "王总客户会", en: "Client meeting, Mr. Wang" }, tag: { zh: "第二批报价", en: "batch-2 pricing" } },
          { at: "19:00", text: { zh: "健身 · 腿部", en: "Gym · legs" } },
          { at: "↺", text: { zh: "回复 HR 体检预约", en: "Reply to HR about check-up" }, tag: { zh: "昨天遗留", en: "from yesterday" }, state: "carry" },
        ]} foot={{ zh: "底座已播报 · 出门记得带上 FloWork Bar", en: "Briefed by the dock · take your FloWork Bar" }} />,
        right: { kind: "video", scene: "home", bubbles: [briefing] },
      }],
    },
    {
      id: "commute", clock: "08:41",
      time: { zh: "08:40", en: "08:40" }, place: { zh: "通勤", en: "Commute" }, mount: { zh: "手环", en: "Wristband" }, mode: { zh: "灵感模式", en: "Idea mode" },
      say: { zh: "通勤路上冒出一个点子，双击录音豆留住这一句，Flow Agent 把它放进灵感库。", en: "An idea on the way in: double-press the recorder to keep that line, and Flow Agent files it in your Idea vault." },
      beats: [
        { ms: 2200, phoneKey: "c-rec", phone: commuteRec([]), right: { kind: "video", scene: "out" } },
        { ms: 1600, phoneKey: "c-rec", phone: commuteRec([idea], true), right: { kind: "video", scene: "out" } },
        { ms: 2800, phoneKey: "c-idea", phone: <IdeaScreen t={t} />, right: { kind: "video", scene: "out" } },
      ],
    },
    {
      id: "desk", clock: "11:20",
      time: { zh: "11:20", en: "11:20" }, place: { zh: "工位", en: "Desk" }, mount: { zh: "手机背面", en: "Phone back" }, mode: { zh: "工作模式", en: "Work mode" },
      say: { zh: "工位上接电话，双击标记改期那句：Jev 判断是日程，日历和飞书待办同步好，回复草稿等你点发送。", en: "On a call at your desk, mark the reschedule: Jev calls it a schedule item, calendar and Feishu sync, and the reply waits for your tap." },
      beats: [
        { ms: 2200, phoneKey: "d-rec", phone: callRec([]), right: { kind: "video", scene: "out" } },
        { ms: 4400, phoneKey: "d-rec", phone: callRec([{ at: "11:20:02", text: callLines[0].text, note: ui.judging }], true), right: { kind: "agent", pipe: deskPipe } },
        { ms: 3000, phoneKey: "d-sync", phone: <SyncedScreen t={t} />, right: { kind: "agent", pipe: deskPipe } },
      ],
    },
    {
      id: "meet", clock: "14:02",
      time: { zh: "14:00", en: "14:00" }, place: { zh: "会议", en: "Meeting" }, mount: { zh: "项链", en: "Necklace" }, mode: { zh: "会议模式", en: "Meeting mode" },
      say: { zh: "客户说要周五前的报价，你双击标记。Jev 只给选项和概率，Flow Agent 起草好邮件，先放着等你确认。", en: "The client wants a quote by Friday; you double-press. Jev returns options with probabilities, Flow Agent drafts the email, and it waits for you." },
      beats: [
        { ms: 2600, phoneKey: "m-rec", phone: meetRec([]), right: { kind: "video", scene: "meet" } },
        { ms: 1400, phoneKey: "m-rec", phone: meetRec([{ at: "14:02:31", text: quoteLine }], true), right: { kind: "video", scene: "meet" } },
        { ms: 4200, phoneKey: "m-rec", phone: meetRec([{ at: "14:02:31", text: quoteLine, note: ui.judging }]), right: { kind: "agent", pipe: meetPipe } },
        { ms: 3200, phoneKey: "m-confirm", phone: <ConfirmScreen t={t} state="wait" />, right: { kind: "agent", pipe: meetPipe } },
      ],
    },
    {
      id: "gym", clock: "19:12",
      time: { zh: "19:10", en: "19:10" }, place: { zh: "健身房", en: "Gym" }, mount: { zh: "手环", en: "Wristband" }, mode: { zh: "训练模式", en: "Training mode" },
      say: { zh: "练完一组，说出重量和次数再双击，自动记进训练日志；只留你自己的声音。", en: "After a set, say the weight and reps and double-press: it lands in your training log, keeping only your voice." },
      beats: [
        { ms: 2200, phoneKey: "g-rec", phone: gymRec([]), right: { kind: "video", scene: "out" } },
        { ms: 1500, phoneKey: "g-rec", phone: gymRec([{ at: "19:12:40", text: { zh: "深蹲 80 公斤，8 个，第三组。", en: "Squat 80 kg, 8 reps, set three." } }], true), right: { kind: "video", scene: "out" } },
        { ms: 2800, phoneKey: "g-log", phone: <LogScreen t={t} />, right: { kind: "video", scene: "out" } },
      ],
    },
    {
      id: "home", clock: "21:30",
      time: { zh: "21:30", en: "21:30" }, place: { zh: "回家", en: "Home" }, mount: { zh: "插上底座", en: "Docked" }, mode: { zh: "晚间收尾", en: "Wrap-up" },
      say: { zh: "回家把 FloWork Bar 插上记忆底座，它提醒报价邮件还没发。说一句「Hey Flo，发吧」就发出，3 秒内可以撤销。", en: "Home: slot the FloWork Bar into the memory dock and it reminds you the quote is unsent. Say “Hey Flo, send it” and it goes, with 3 s to undo." },
      beats: [
        { ms: 2800, phoneKey: "h-c", phone: <ConfirmScreen t={t} state="wait" />, right: { kind: "video", scene: "home", bubbles: [nightBrief] } },
        { ms: 1800, phoneKey: "h-c", phone: <ConfirmScreen t={t} state="heard" />, right: { kind: "video", scene: "home", bubbles: [nightBrief, youSend] } },
        { ms: 3600, phoneKey: "h-c", phone: <ConfirmScreen t={t} state="sent" />, right: { kind: "video", scene: "home", bubbles: [nightBrief, youSend, sent] } },
      ],
    },
    {
      id: "next", clock: "07:30",
      time: { zh: "次日 07:30", en: "Next 07:30" }, place: { zh: "在家", en: "Home" }, mount: { zh: "记忆底座", en: "Memory dock" }, mode: { zh: "晨报", en: "Briefing" },
      say: { zh: "第二天早上，底座告诉你报价已发、王总已读，今天 14:00 回访。一件事从说出口到办完，形成闭环。", en: "Next morning the dock tells you the quote is out, Mr. Wang read it, and the follow-up is at 14:00. Said, done, closed." },
      beats: [{
        ms: 6500, phoneKey: "next",
        phone: <TodayScreen t={t} date={{ zh: "周四 · 07:30", en: "Thu · 07:30" }} title={{ zh: "今天", en: "Today" }} items={[
          { at: "✓", text: { zh: "报价已发 · 王总已读", en: "Quote sent · read by Mr. Wang" }, tag: { zh: "昨晚 21:31", en: "last night 21:31" }, state: "done" },
          { at: "10:00", text: { zh: "设计评审 · 带第二版", en: "Design review · bring v2" } },
          { at: "14:00", text: { zh: "回访王总 · 确认报价", en: "Follow up with Mr. Wang" } },
          { at: "✓", text: { zh: "训练 3 组已记录", en: "3 sets logged" }, state: "done" },
        ]} foot={{ zh: "昨天标记 3 次 · 全部处理完", en: "3 marks yesterday · all handled" }} />,
        right: { kind: "video", scene: "home", bubbles: [morning2] },
      }],
    },
  ];
}

/* ---------- main ---------- */

export default function Demo({ lang }: { lang: Lang }) {
  const t: T = (l) => l[lang];
  const steps = buildSteps(t);
  const [step, setStep] = useState(0);
  const [beat, setBeat] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => { setReduced(mq.matches); if (mq.matches) setPlaying(false); };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el || !("IntersectionObserver" in window)) { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cur = steps[step];
  const beats = cur.beats;
  const b = beats[Math.min(beat, beats.length - 1)];
  const total = beats.reduce((s, x) => s + x.ms, 0);
  const before = beats.slice(0, beat).reduce((s, x) => s + x.ms, 0);

  // Beats always play through inside a step; auto-advance to the next step only while playing.
  useEffect(() => {
    if (!inView) return;
    const id = window.setTimeout(() => {
      if (beat < beats.length - 1) setBeat(beat + 1);
      else if (playing && !reduced) { setStep((s) => (s + 1) % steps.length); setBeat(0); }
    }, b.ms);
    return () => window.clearTimeout(id);
  }, [inView, step, beat, playing, reduced, b.ms, beats.length, steps.length]);

  // Keep the current step visible inside the horizontally scrolling rail (mobile).
  useEffect(() => {
    const r = rail.current;
    const el = r?.children[step] as HTMLElement | undefined;
    if (!r || !el || r.scrollWidth <= r.clientWidth) return;
    r.scrollTo({ left: el.offsetLeft - (r.clientWidth - el.offsetWidth) / 2, behavior: reduced ? "auto" : "smooth" });
  }, [step, reduced]);

  const go = (i: number) => { setPlaying(false); setStep((i + steps.length) % steps.length); setBeat(0); };
  const toggle = () => setPlaying((p) => !p);

  const caption = `${t(cur.time)} · ${t(cur.place)} · ${t(cur.mount)} · ${t(cur.mode)}`;
  const rec = b.phoneKey.endsWith("-rec");

  return (
    <div className={`dd-root ${inView ? "" : "dd-paused"} ${reduced ? "dd-reduced" : ""}`} ref={root}>
      <div className="dd-head">
        <div>
          <span className="dd-eyebrow"><span className="dd-amber" />{t(ui.eyebrow)}</span>
          <h3 className="dd-title">{t(ui.title)}</h3>
          <p className="dd-lede">{t(ui.sub)}</p>
        </div>
        <div className="dd-ctrl">
          <button className="dd-ic-btn" onClick={() => go(step - 1)} aria-label={t(ui.prev)}>‹</button>
          <button className={`dd-pill ${playing ? "" : "light"}`} onClick={toggle} disabled={reduced} aria-pressed={playing}>
            {playing ? <>❚❚ {t(ui.pause)}</> : <>▶ {t(ui.play)}</>}
          </button>
          <button className="dd-ic-btn" onClick={() => go(step + 1)} aria-label={t(ui.next)}>›</button>
        </div>
      </div>

      <div className="dd-rail" ref={rail} role="tablist" aria-label={t(ui.title)}>
        {steps.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={i === step}
            className={`dd-step ${i === step ? "cur" : i < step ? "past" : ""}`}
            onClick={() => go(i)}
          >
            <span className="dd-track">
              {i === step ? (
                <i
                  key={`${step}-${beat}`}
                  className="run"
                  style={{ "--from": before / total, "--to": (before + b.ms) / total, animationDuration: `${b.ms}ms` } as CSSProperties}
                />
              ) : <i />}
            </span>
            <span className="dd-step-t dd-mono">{t(s.time)}</span>
            <span className="dd-step-l">{t(s.place)} · {t(s.mode)}</span>
          </button>
        ))}
      </div>

      <div className="dd-stage">
        <div className="dd-left">
          <PhoneFrame clock={cur.clock} rec={rec} label={t(ui.phone)}>
            <div key={`${cur.id}-${b.phoneKey}`} className="dd-in">{b.phone}</div>
          </PhoneFrame>
        </div>
        <div className="dd-right">
          <Media t={t} right={b.right} stepKey={cur.id} caption={caption} live={inView} />
        </div>
      </div>

      <p key={cur.id} className="dd-say">
        <b className="dd-mono">{String(step + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}</b>
        {t(cur.say)}
      </p>
    </div>
  );
}
