import { useEffect, useRef, useState } from "react";
import type { Lang } from "./content";

type Status = "idle" | "sending" | "done" | "error";

const copy = {
  eyebrow: { zh: "限量邀请", en: "Limited invites" },
  title: { zh: "产品上线，第一时间通知你", en: "Be first to know when we launch" },
  body: {
    zh: "留下邮箱，成为 FloWork 的首批体验者。内测开放时，我们会第一时间发邀请给你，不用排队。",
    en: "Leave your email to be among FloWork’s first users. When the beta opens, your invite goes out first — no queue.",
  },
  art: { zh: ["事情，记下来。", "也办到底。"], en: ["Capture it.", "Finish it."] },
  submit: { zh: "锁定我的席位", en: "Save my spot" },
  sending: { zh: "提交中…", en: "Sending…" },
  done: { zh: "已加入等待列表，上线时第一时间通知你。", en: "You’re on the list — we’ll email you at launch." },
  error: { zh: "提交没成功，请稍后再试。", en: "That didn’t go through — please try again." },
  note: { zh: "只用于产品上线通知，不发广告", en: "Launch updates only. No spam." },
  close: { zh: "关闭", en: "Close" },
};

/** Hero button that opens a modal and saves the visitor's email to the Feishu waiting list. */
export default function Subscribe({ lang, label }: { lang: Lang; label: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const t = (l: { zh: string; en: string }) => l[lang];

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onClose = () => document.documentElement.classList.remove("modal-open");
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  const open = () => {
    if (status === "error") setStatus("idle");
    document.documentElement.classList.add("modal-open");
    ref.current?.showModal();
  };

  const submit = async () => {
    setStatus("sending");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, lang, source: "hero" }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <button className="pill glass" type="button" onClick={open}>
        <span className="sub-dot" aria-hidden="true" />
        {label}
      </button>
      <dialog ref={ref} className="sub-modal" aria-labelledby="sub-title" onClick={(e) => { if (e.target === e.currentTarget) ref.current?.close(); }}>
        <div className="sub-card">
          <div className="sub-art" aria-hidden="true">
            <img src="/images/hero_dock.jpg" alt="" />
            <p>{t({ zh: copy.art.zh[0], en: copy.art.en[0] })}<br /><em>{t({ zh: copy.art.zh[1], en: copy.art.en[1] })}</em></p>
          </div>
          <div className="sub-body">
            <button className="sub-close" type="button" aria-label={t(copy.close)} onClick={() => ref.current?.close()}>×</button>
            <span className="sub-eyebrow">{t(copy.eyebrow)}</span>
            <h2 id="sub-title">{t(copy.title)}</h2>
            <p className="sub-desc">{t(copy.body)}</p>
            {status === "done" ? (
              <p className="sub-done" role="status">{t(copy.done)}</p>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if (status !== "sending") submit(); }}>
                <input
                  aria-label={t({ zh: "邮箱地址", en: "Email address" })}
                  type="email"
                  required
                  autoComplete="email"
                  placeholder={t({ zh: "邮箱地址", en: "Email address" })}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
                />
                <button className="sub-submit" type="submit" disabled={status === "sending"}>
                  {status === "sending" ? t(copy.sending) : `${t(copy.submit)} →`}
                </button>
                {status === "error" && <p className="wl-err" role="alert">{t(copy.error)}</p>}
              </form>
            )}
            <small className="sub-note">{t(copy.note)}</small>
          </div>
        </div>
      </dialog>
    </>
  );
}
