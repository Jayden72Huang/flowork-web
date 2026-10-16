import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Demo from "./Demo";
import ProjectOverview from "./ProjectOverview";
import Jobs from "./Jobs";
import Features from "./Features";
import Gestures from "./Gestures";
import BrandLogo from "./BrandLogo";
import Modes from "./Modes";
import AppShowcase from "./AppShowcase";
import HeroHead from "./HeroHead";
import Personas from "./Personas";
import Flo from "./Flo";
import Subscribe from "./Subscribe";
import Music from "./Music";
import { PRODUCT_EMAIL } from "../shared/product-email";
import { sectionTags, aiLayers, barCore, faqs, forms, hero, marquee, modules, nav, painStats, pains, scenes, solutionLoop, solutionParts, team } from "./content";
import type { L, Lang } from "./content";

function useReveal() {
  useEffect(() => {
    document.documentElement.classList.add("js");
    const els = Array.from(document.querySelectorAll(".reveal"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }),
      { rootMargin: "0px 0px -6% 0px" },
    );
    els.forEach((e) => io.observe(e));
    // Safety net: never leave content hidden
    const fallback = window.setTimeout(() => els.forEach((e) => e.classList.add("in")), 2500);
    return () => { io.disconnect(); window.clearTimeout(fallback); };
  }, []);
}

function SecTag({ id, lang }: { id: string; lang: Lang }) {
  const x = sectionTags[id];
  if (!x) return null;
  return <span className="sec-tag"><b>{x.n}</b>{x.k[lang]}<i>·</i>{x.v[lang]}</span>;
}

function Head({ title, sub, tag }: { title?: string; sub?: string; tag?: ReactNode }) {
  return (
    <div className="head reveal">
      {tag}
      {title && <h2>{title}</h2>}
      {sub && <p>{sub}</p>}
    </div>
  );
}

/** A painterly backdrop with content framed on top — the Grok Bot "UI on landscape" pattern. */
function Canvas({ bg, children, className = "" }: { bg: string; children: ReactNode; className?: string }) {
  return (
    <div className={`canvas ${className}`}>
      <img className="canvas-bg" src={bg} alt="" aria-hidden="true" loading="lazy" />
      <div className="canvas-grain" aria-hidden="true" />
      <div className="canvas-in">{children}</div>
    </div>
  );
}

const sceneVideo = ["/video/scene_out", "/video/scene_meet", "/video/scene_home"];

/** Muted looping clip that only plays while on screen. */
function SceneVideo({ src, label, tag }: { src: string; label: string; tag: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.3 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <div className="framed-v">
      <video ref={ref} src={`${src}.mp4`} poster={`${src}.jpg`} muted loop playsInline preload="metadata" aria-label={label} />
      <span className="framed-tag"><span className="rec" />{tag}</span>
    </div>
  );
}

const sceneBg = ["/images/bg_city.jpg", "/images/bg_meadow.jpg", "/images/bg_home.jpg"];

export default function App() {
  const [lang, setLang] = useState<Lang>(() => {
    try { return (localStorage.getItem("fw-lang") as Lang) || "zh"; } catch { return "zh"; }
  });
  const [joined, setJoined] = useState(false);
  const [email, setEmail] = useState("");
  const [wl, setWl] = useState<"idle" | "sending" | "error">("idle");

  const joinWaitlist = async () => {
    setWl("sending");
    try {
      const res = await fetch(import.meta.env.VITE_WAITLIST_ENDPOINT || "/api/waitlist", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, lang }) });
      if (!res.ok) throw new Error(String(res.status));
      setJoined(true);
      setWl("idle");
    } catch {
      setWl("error");
    }
  };
  const t = (l: L) => l[lang];
  useReveal();

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    try { localStorage.setItem("fw-lang", lang); } catch { /* storage unavailable */ }
  }, [lang]);

  return (
    <>
      <header className="nav">
        <div className="nav-in">
          <a href="#top" className="brand"><BrandLogo size={28} /><span className="brand-word">FloWork</span></a>
          <nav className="nav-links">
            {nav.map((n) => <a key={n.id} href={`#${n.id}`}>{t(n.label)}</a>)}
          </nav>
          <div className="nav-right">
            <div className="lang">
              <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
              <button className={lang === "zh" ? "on" : ""} onClick={() => setLang("zh")}>中</button>
            </div>
            <a className="pill sm account-link" href="https://floworks.app/account/login">{lang === "zh" ? "登录" : "Sign in"}</a>
            <a className="pill light sm" href="#demo">{t(hero.cta)}</a>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero hero-split wrap">
          <div className="hero-copy">
          <a className="announce beam reveal" href="#faq">
            <span className="announce-dot" />
            {t(hero.eyebrow)}
            <span className="announce-sep">•</span>
            <span className="announce-link">{t({ zh: "常见问题", en: "Read the FAQ" })} →</span>
          </a>
          <h1 className="reveal"><span className="shimmer">{t(hero.title)}</span></h1>
          <p className="hero-sub reveal">{t(hero.sub).split(/\[\[|\]\]/).map((part, i) => (i % 2 ? <mark key={i} className="hl">{part}</mark> : part))}</p>
          <div className="hero-cta reveal">
            <a className="pill light" href="#demo">{t(hero.cta)}</a>
            <a className="pill dark" href="#pain">▶ {t({ zh: "为什么需要它", en: "Why it matters" })}</a>
            <Subscribe lang={lang} label={t({ zh: "产品上线订阅", en: "Get launch updates" })} />
          </div>
          </div>
          <HeroHead label={t({ zh: "Flo 硬件 3D 交互演示", en: "Flo hardware interactive 3D concept demo (Chinese)" })} />
        </section>

        <ProjectOverview />

        <section id="people" className="wrap block">
          <Head tag={<SecTag id="people" lang={lang} />} title={t({ zh: "为谁而做：每天被会议和承诺追着跑的人", en: "Built for people chased by meetings and promises" })} sub={t({ zh: "精英白领的时间最贵。他们不缺记录工具，缺的是一个能把事情接过去、办到底的助理。", en: "Busy professionals don’t lack recorders. They lack an assistant that takes things off their plate and finishes them." })} />
          <Personas lang={lang} />
        </section>
        <section id="pain" className="wrap block">
          <Head tag={<SecTag id="pain" lang={lang} />} title={t({ zh: "录音不难，难的是录完之后没人管", en: "Recording is easy. Nobody handles what comes after." })} sub={t({ zh: "会上答应的事、电话里的安排，录下来了，却没人整理、没人跟进，第二天就忘了大半。", en: "Promises in meetings and plans on calls get recorded, then nobody sorts or follows up — and most of it is gone by tomorrow." })} />
          <div className="pain-stats reveal">
            {painStats.map((d, i) => (
              <div key={i} className="pain-stat">
                <b>{d.n}</b>
                <p>{t(d.l)}</p>
                <a href={d.url} target="_blank" rel="noreferrer">{t(d.src)} ↗</a>
              </div>
            ))}
          </div>
        </section>
        <section id="solution" className="wrap block">
          <Head tag={<SecTag id="solution" lang={lang} />} title={t({ zh: "FloWork 解决方案：记下来，办到底，带回家", en: "The FloWork solution: capture, finish, bring it home" })} sub={t({ zh: "四个部分组成一个闭环：记忆助理负责记，Jev 负责判断，Flow Agent 负责办，记忆底座把结果带回家。", en: "Four parts, one loop: the memory assistant captures, Jev decides, Flow Agent acts, and the Memory Dock brings it home." })} />
          <div className="sol-parts reveal">
            {solutionParts.map((x, i) => (
              <article key={i} className="sol-part">
                <div className="sol-media">{x.img ? <img src={x.img} alt={t(x.name)} loading="lazy" /> : <Flo size={96} tone="amber" float />}</div>
                <span className="sol-role">{t(x.role)}</span>
                <h3>{t(x.name)}</h3>
                <p>{t(x.body)}</p>
              </article>
            ))}
          </div>
          <ol className="sol-loop reveal">
            {solutionLoop.map((x, i) => (
              <li key={i}><span className="sol-n">{String(i + 1).padStart(2, "0")}</span><b>{t(x.k)}</b><span>{t(x.v)}</span></li>
            ))}
          </ol>
          <div className="table reveal sol-table">
            <div className="tr th">
              <span>{t({ zh: "现在", en: "Today" })}</span>
              <span>FloWork</span>
            </div>
            {pains.map((p, i) => (
              <div key={i} className="tr">
                <div><h3>{t(p.pain)}</h3><p>{t(p.painBody)}</p></div>
                <div><h3>{t(p.fix)}</h3><p>{t(p.fixBody)}</p></div>
              </div>
            ))}
          </div>
          <h3 className="sol-sub reveal">{t({ zh: "出门是耳朵，回家是管家", en: "An ear outside. A butler at home." })}</h3>
          <div className="rows">
            {scenes.map((s, i) => (
              <article key={s.img} className={`row reveal ${i % 2 ? "flip" : ""}`}>
                <div className="row-txt">
                  <span className="label">{t(s.tag)}</span>
                  <h3>{t(s.title)}</h3>
                  <p>{t(s.body)}</p>
                </div>
                <Canvas bg={sceneBg[i]}>
                  <SceneVideo src={sceneVideo[i]} label={t(s.title)} tag={t(s.tag)} />
                </Canvas>
              </article>
            ))}
          </div>
        </section>
        <section id="demo" className="wrap-wide">
          <div className="wrap"><Head tag={<SecTag id="demo" lang={lang} />} title={t({ zh: "看一位精英白领怎么用它过完一天", en: "Follow one busy professional through a day" })} /></div>
          <Canvas bg="/images/bg_meadow.jpg" className="demo-canvas reveal">
            <Demo lang={lang} />
          </Canvas>
          <div className="marquee" aria-hidden="true">
            <div className="marquee-track">
              {[0, 1].map((k) => (
                <div key={k} className="marquee-set">
                  {marquee.map((m, i) => <span key={i}>{t(m)}</span>)}
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="modes" className="wrap block">
          <Head tag={<SecTag id="modes" lang={lang} />} title={t({ zh: "五个场景，五种本事", en: "Five scenes, five skills" })} sub={t({ zh: "挂在哪里、在什么地方、在做什么，决定它此刻怎么帮你。也可以自定义你自己的场景。", en: "Where it’s worn, where you are and what you’re doing decide how it helps. Or define your own scene." })} />
          <Modes lang={lang} />
        </section>
        <section id="audience" className="wrap block">
          <Jobs lang={lang} tag={<SecTag id="audience" lang={lang} />} />
        </section>
        <section id="forms" className="wrap block">
          <Head tag={<SecTag id="forms" lang={lang} />} title={t({ zh: "戴哪都合适的记忆助理", en: "A memory assistant that fits everywhere" })} sub={t({ zh: "原装录音豆不拆不改，加上一块触控板。手腕、胸前、手机、家里，每种戴法对应一个场合。", en: "The stock recorder, untouched, plus a trackpad. Wrist, chest, phone or home — each way to wear it fits a moment." })} />
          <article className="bar-core reveal">
            <img src={barCore.img} alt={t(barCore.title)} loading="lazy" />
            <div>
              <h3>{t(barCore.title)}</h3>
              <p>{t(barCore.body)}</p>
              <ul>{barCore.specs.map((s, i) => <li key={i}>{t(s)}</li>)}</ul>
            </div>
          </article>
          <div className="grid4">
            {forms.map((f) => (
              <article key={f.no} className="form reveal">
                <img src={f.img} alt={t(f.title)} loading="lazy" />
                <h3>{t(f.title)}</h3>
                <p>{t(f.body)}</p>
                <ul>{f.specs.map((s, i) => <li key={i}>{t(s)}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>
        <section id="gestures" className="wrap block">
          <Head tag={<SecTag id="gestures" lang={lang} />} title={t({ zh: "怎么用：按、双击、点一下", en: "How to use it: press, double-press, tap" })} sub={t({ zh: "左边录音豆负责「记」，右边触控板负责「办」。六个手势，戴在哪都一样。", en: "The recorder on the left captures; the glass on the right acts. Six gestures, the same on every mount." })} />
          <Gestures lang={lang} />
        </section>
        <section id="app" className="wrap block">
          <Head tag={<SecTag id="app" lang={lang} />} title={t({ zh: "FloWork App：记下来，办到底", en: "FloWork App: capture it, finish it" })} sub={t({ zh: "三个页面：「记录」管记，「Flo」管办，「我的」管 Flo 知道什么。", en: "Three tabs: Record captures, Flo acts, Me controls what Flo knows." })} />
          <AppShowcase lang={lang} />
        </section>
        <section id="features" className="wrap block">
          <Head tag={<SecTag id="features" lang={lang} />} title={t({ zh: "FloWork 的产品方向：记录之后，继续推进", en: "FloWork: continuing beyond capture" })} sub={t({ zh: "以下动效说明使用场景，真实能力以可用版本和实机结果为准。", en: "These animations illustrate scenarios. Available features depend on the current build and device validation." })} />
          <Features lang={lang} />
        </section>
        <section id="ai" className="wrap block">
          <Head tag={<SecTag id="ai" lang={lang} />} title={t({ zh: "快判断交给 Jev，慢推进交给 Flow Agent", en: "Jev decides fast. Flow Agent follows through." })} sub={t({ zh: "Jev 像反应极快的秘书，一眼判断事情怎么处理；Flow Agent 像靠谱的助理，记住你的习惯，把事一步步办完。", en: "Two AIs, two jobs: Jev is the lightning-fast secretary who sorts each item; Flow Agent is the dependable assistant who knows your habits and gets it done." })} />
          <Canvas bg="/images/bg_ocean.jpg" className="stack-canvas reveal">
            <ol className="stack">
              {aiLayers.map((a) => (
                <li key={a.k}>
                  <span className="stack-k">{a.k}</span>
                  <div>
                    <h3>{t(a.title)} <span className="tag">{t(a.tag)}</span></h3>
                    <p>{t(a.body)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Canvas>
        </section>
        <section id="structure" className="wrap block">
          <Head tag={<SecTag id="structure" lang={lang} />} title={t({ zh: "拆开看：一根条，一座底座", en: "Inside: one bar, one dock" })} sub={t({ zh: "条负责随身记录和触控，底座负责充电、播报和对话。外观为产品概念，供电、连接与执行分别通过实机验证。", en: "The bar captures and takes touch; the dock charges, briefs and talks. Product concepts. Power, connectivity and execution require device validation." })} />
          <div className="structure-pair reveal">
            <figure>
              <img src="/images/bar_exploded.jpg" alt={t({ zh: "FloWork Bar 爆炸图", en: "FloWork Bar exploded view" })} loading="lazy" />
              <figcaption><span className="parts-h">FloWork Bar</span></figcaption>
            </figure>
            <figure>
              <img src="/images/exploded.jpg" alt={t({ zh: "记忆底座爆炸图", en: "Memory dock exploded view" })} loading="lazy" />
              <figcaption><span className="parts-h">{t({ zh: "记忆底座", en: "Memory Dock" })}</span></figcaption>
            </figure>
          </div>
          <div className="modules reveal">
            {modules.map((m, i) => <div key={i} className="module"><b>{t(m.k)}</b><span>{t(m.v)}</span></div>)}
          </div>
        </section>
        <section id="team" className="wrap block">
          <Head tag={<SecTag id="team" lang={lang} />} title={t({ zh: "我们是谁", en: "Who we are" })} sub={t({ zh: "产品与 AI、App 与前端、硬件与算法，三个人刚好覆盖从录音豆到云端再到家里的整条链路，而且都做过真正上线的产品。", en: "Product & AI, app & web, hardware & algorithms — together we cover the whole chain from recorder to cloud to home, and we’ve all shipped real products." })} />
          <img className="team-photo" src="/images/team-flowork.png" alt="FloWork 团队：Lew、Jayden、Carlos" loading="lazy" />
          <div className="grid3 lines reveal">
            {team.map((m, i) => (
              <div key={i} className="cell">
                <span className="label">{t(m.role)}</span>
                <h3>{t(m.who)}</h3>
                <p>{t(m.body)}</p>
              </div>
            ))}
          </div>
          <p className="team-call reveal">{t({ zh: "我们在做精英白领的下一代随身助理，期待更多优秀的伙伴加入。", en: "We’re building the next personal assistant for busy professionals — and we’d love more great people to join." })}</p>
        </section>
        <section id="trial" className="wrap-wide">
          <Canvas bg="/images/bg_home.jpg" className="cta-canvas reveal">
            <div className="cta">
              <SecTag id="trial" lang={lang} />
              <h2>{t({ zh: "成为第一批用上 FloWork 的人", en: "Be among the first to use FloWork" })}</h2>
              <p>{t({ zh: "留下邮箱申请 iOS 内测，团队审核后发送 TestFlight 邀请。", en: "Apply for the iOS beta. We send a TestFlight invitation after approval." })}</p>
              {!import.meta.env.VITE_WAITLIST_ENDPOINT && location.hostname !== "floworks.app" ? (<a className="pill light" href="https://floworks.app/#trial">前往官网申请 TestFlight 内测 ↗</a>) : joined ? (
                <p className="joined">{t({ zh: "已加入 Waiting list，有更新第一时间通知你。", en: "You’re on the waiting list — we’ll keep you posted." })}</p>
              ) : (
                <form className="wl" onSubmit={(e) => { e.preventDefault(); if (wl !== "sending") joinWaitlist(); }}>
                  <input aria-label="Email" type="email" required placeholder="you@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setWl("idle"); }} />
                  <button className="pill light" type="submit" disabled={wl === "sending"}>{wl === "sending" ? t({ zh: "提交中…", en: "Sending…" }) : t({ zh: "加入", en: "Join" })}</button>
                </form>
              )}
              {wl === "error" && <p className="wl-err">{t({ zh: "提交没成功，请稍后再试。", en: "That didn’t go through — please try again." })}</p>}
              <small>{t({ zh: "加入产品体验 Waiting list，获取我们的产品更新通知！", en: "Join the product waiting list for FloWork updates!" })}</small>
            </div>
          </Canvas>
        </section>

        <section id="faq" className="wrap block narrow">
          <Head tag={<SecTag id="faq" lang={lang} />} title="FAQs" />
          <div className="faq reveal">
            {faqs.map((f, i) => (
              <details key={i}>
                <summary>{t(f.q)}<span className="plus" aria-hidden="true" /></summary>
                <p>{t(f.a)}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="foot wrap">
        <span className="brand"><img className="brand-logo" src="/favicon-64.png" alt="" width="22" height="22" /><span className="brand-word">FloWork</span></span>
        <p>{t({ zh: "Anker 首届黑客松 · 赛道一「智能录音」参赛作品。soundcore Work 为安克创新产品。", en: "Anker Hackathon Track 01 (Smart Recording) entry. soundcore Work is an Anker product." })}<br />{t({ zh: "客服与产品通知：", en: "Support & product notifications: " })}<a href={PRODUCT_EMAIL.mailto}>{PRODUCT_EMAIL.support}</a></p>
        <p className="bgm-credit">Music by <a href="https://pixabay.com/users/romansenykmusic-11989248/" target="_blank" rel="noopener noreferrer">Roman Senyk</a> from <a href="https://pixabay.com/" target="_blank" rel="noopener noreferrer">Pixabay</a></p>
      </footer>
      <Music label={t({ zh: "背景音乐开关", en: "Toggle background music" })} />
    </>
  );
}
