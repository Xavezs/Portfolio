import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// TODO: replace with your real links
const LINKS = {
  linkedin: "https://www.linkedin.com/in/yalvin-clay-3841a3326/",
  github: "https://github.com/Xavezs",
  email: "mailto:yalvinclay22@gmail.com",
  // Put your CV in the public folder, e.g. "/Yalvin-Clay-CV.pdf". Empty hides the button.
  cv: "", // e.g. "/Yalvin-Clay-CV.pdf" once the file is in public/
};

// Put your photo path here, e.g. "/me.jpg". Empty shows a placeholder.
// For project screenshots, add image: "/shot.png" to a project below.
const PHOTO = "";

const Media = ({ src, alt, label, ratio }) =>
  src ? (
    <img src={src} alt={alt} className="media" style={{ aspectRatio: ratio }} />
  ) : (
    <div className="ph" style={{ aspectRatio: ratio }} role="img" aria-label={label}>
      {label}
    </div>
  );

const I = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props} />
);

// `src` can be one image path or an array of paths.
// Several images: arrows, dots and auto-advance (paused on hover/focus).
// Click an image (or the expand button) to open it full size; arrows, keyboard
// left/right and swipe change image there, Esc or a click outside closes it.
const SLIDE_MS = 4500;
const Gallery = ({ src, title, fit, captions }) => {
  const list = Array.isArray(src) ? src : src ? [src] : [];
  const n = list.length;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [open, setOpen] = useState(false);
  const closeRef = useRef(null);
  const touchX = useRef(null);

  useEffect(() => {
    if (n < 2 || paused || open) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI((v) => (v + 1) % n), SLIDE_MS);
    return () => clearTimeout(t);
  }, [i, n, paused, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
      else if (n > 1 && e.key === "ArrowRight") setI((v) => (v + 1) % n);
      else if (n > 1 && e.key === "ArrowLeft") setI((v) => (v - 1 + n) % n);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (closeRef.current) closeRef.current.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, n]);

  if (n === 0) {
    return <Media src="" alt="" label={`${title} screenshot`} ratio="16 / 9" />;
  }

  const go = (d) => setI((v) => (v + d + n) % n);
  const onSwipeEnd = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };

  return (
    <>
      <div
        className="gal"
        style={{ aspectRatio: "16 / 9" }}
        onClick={(e) => {
          if (!e.target.closest("button")) setOpen(true);
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        role="group"
        aria-roledescription={n > 1 ? "carousel" : undefined}
        aria-label={`${title} screenshots`}
      >
        {list.map((u, k) => (
          <img key={u} src={u} alt={(captions && captions[k]) || `${title} screenshot ${k + 1}`} className={"gal-img" + (fit === "contain" ? " fit" : "") + (k === i ? " on" : "")} aria-hidden={k !== i} />
        ))}
        <button type="button" className="gal-exp" onClick={() => setOpen(true)} aria-label="View full size">
          <I><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></I>
        </button>
        {n > 1 && (
          <>
            <button type="button" className="gal-btn l" onClick={() => go(-1)} aria-label="Previous screenshot">
              <I><path d="M15 5l-7 7 7 7" /></I>
            </button>
            <button type="button" className="gal-btn r" onClick={() => go(1)} aria-label="Next screenshot">
              <I><path d="M9 5l7 7-7 7" /></I>
            </button>
            <div className="gal-dots">
              {list.map((u, k) => (
                <button key={u} type="button" className={k === i ? "on" : ""} onClick={() => setI(k)} aria-label={`Show screenshot ${k + 1}`} />
              ))}
            </div>
          </>
        )}
      </div>
      {captions && captions[i] && <p className="cap">{captions[i]}</p>}

      {open &&
        createPortal(
          <div
            className="lb"
            role="dialog"
            aria-modal="true"
            aria-label={`${title} screenshots, full size`}
            onClick={() => setOpen(false)}
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={onSwipeEnd}
          >
            <img src={list[i]} alt={(captions && captions[i]) || `${title} screenshot ${i + 1}`} className="lb-img" onClick={(e) => e.stopPropagation()} />
            <button type="button" className="lb-btn lb-x" ref={closeRef} onClick={() => setOpen(false)} aria-label="Close">
              <I width="20" height="20"><path d="M6 6l12 12M18 6L6 18" /></I>
            </button>
            {n > 1 && (
              <>
                <button type="button" className="lb-btn lb-l" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous screenshot">
                  <I width="22" height="22"><path d="M15 5l-7 7 7 7" /></I>
                </button>
                <button type="button" className="lb-btn lb-r" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next screenshot">
                  <I width="22" height="22"><path d="M9 5l7 7-7 7" /></I>
                </button>
                <div className="lb-count">{captions && captions[i] ? `${captions[i]} · ` : ""}{i + 1} / {n}</div>
              </>
            )}
          </div>,
          document.querySelector(".pf") || document.body
        )}
    </>
  );
};

// Colors and fonts live in CSS variables so they work with or without a Tailwind build.
const css = `
.pf{position:relative;--g2:#ff5d73;--bg:#09080d;--surface:#15141c;--ink:#f6ece8;--mute:#a9a7b8;--line:#26242f;--hi:#FDA481;--crimson:#B4182D;--wine:#541628;
  background:var(--bg);color:var(--ink);min-height:100vh;transition:background-color .25s ease,color .25s ease;
  font-family:'Instrument Sans',system-ui,sans-serif;line-height:1.6;font-size:15px}
.pf.light{--g2:#e8604c;--bg:#faf6f3;--surface:#ffffff;--ink:#1c1519;--mute:#5f5a66;--line:#e6dcd8;--hi:#B4182D}
.pf h1,.pf h2,.pf h3,.pf .disp{font-family:'Bricolage Grotesque','Instrument Sans',system-ui,sans-serif}
.pf a{color:inherit;text-decoration:none}
.pf a:focus-visible{outline:2px solid var(--hi);outline-offset:3px}
.pf ::selection{background:var(--wine);color:var(--hi)}
.pf .mute{color:var(--mute)}
.pf .wrap{max-width:68rem;margin:0 auto;padding-left:1.25rem;padding-right:1.25rem}
.pf .top{position:sticky;top:0;z-index:10;background:color-mix(in srgb,var(--bg) 85%,transparent);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
.pf .nav{display:flex;gap:1.25rem;overflow-x:auto;white-space:nowrap}
.pf .nav a{padding:.25rem 0;border-bottom:2px solid transparent}
.pf .nav a:hover{color:var(--hi)}
.pf .nav a.on{color:var(--hi);border-bottom-color:var(--hi)}
.pf .hero{min-height:calc(100vh - 3.5rem);display:flex;flex-direction:column;justify-content:center}
.pf .bar{position:fixed;top:0;left:0;height:3px;width:0;z-index:30;background:var(--hi)}
.pf .tgl{border:1px solid var(--line);background:transparent;color:var(--mute);border-radius:999px;padding:.15rem .8rem;font:inherit;font-size:.8rem;cursor:pointer;flex-shrink:0}
.pf .tgl:hover{color:var(--hi);border-color:var(--hi)}
.pf .tag{font-size:1.2rem;line-height:1.5;font-style:italic;border-left:3px solid var(--hi);padding-left:.9rem}
.pf .pill{display:inline-block;border:1px solid var(--hi);color:var(--hi);border-radius:999px;padding:.1rem .8rem;font-size:.8rem;margin-bottom:1rem}
.pf .stats{display:flex;flex-wrap:wrap;gap:1.5rem 2.5rem;margin-top:1.25rem}
.pf .stats b{display:block;font-family:'JetBrains Mono',ui-monospace,monospace;font-weight:500;font-size:1.5rem;line-height:1.2;color:var(--hi)}
.pf .stats span{font-size:.8rem;color:var(--mute)}
.pf .gal{cursor:zoom-in;position:relative;overflow:hidden;border-radius:10px;border:1px solid var(--line);background:var(--surface)}
.pf .gal-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .5s ease}
.pf .gal-img{object-position:center}
.pf .gal-img.fit{object-fit:contain;background:#fff}
.pf .gal-img.on{opacity:1}
.pf .cap{text-align:center;font-size:.8rem;color:var(--mute);margin-top:.5rem}
.pf .gal-btn{position:absolute;top:50%;transform:translateY(-50%);width:2.1rem;height:2.1rem;border-radius:50%;border:0;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;background:rgba(9,8,13,.55);opacity:0;transition:opacity .2s ease,background-color .2s ease}
.pf .gal-btn.l{left:.6rem}.pf .gal-btn.r{right:.6rem}
.pf .gal:hover .gal-btn,.pf .gal:focus-within .gal-btn{opacity:1}
.pf .gal-btn:hover{background:var(--crimson)}
@media(hover:none){.pf .gal-btn{opacity:1}}
.pf .gal-dots{position:absolute;left:0;right:0;bottom:.55rem;display:flex;justify-content:center;gap:.4rem}
.pf .gal-dots button{width:.5rem;height:.5rem;padding:0;border:0;border-radius:50%;cursor:pointer;background:rgba(255,255,255,.5)}
.pf .gal-dots button.on{background:#fff;width:1.1rem;border-radius:999px}
.pf .gal-exp{position:absolute;top:.6rem;right:.6rem;width:2rem;height:2rem;border-radius:8px;border:0;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;background:rgba(9,8,13,.55);opacity:0;transition:opacity .2s ease,background-color .2s ease}
.pf .gal:hover .gal-exp,.pf .gal:focus-within .gal-exp{opacity:1}
.pf .gal-exp:hover{background:var(--crimson)}
@media(hover:none){.pf .gal-exp{opacity:1}}
.pf .lb{position:fixed;inset:0;z-index:60;background:rgba(5,4,8,.92);display:flex;align-items:center;justify-content:center;padding:1rem}
.pf .lb-img{max-width:94vw;max-height:86vh;object-fit:contain;border-radius:8px;cursor:default}
.pf .lb-btn{position:fixed;width:2.7rem;height:2.7rem;border-radius:50%;border:0;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;background:rgba(255,255,255,.14);transition:background-color .2s ease}
.pf .lb-btn:hover{background:var(--crimson)}
.pf .lb-x{top:1rem;right:1rem}
.pf .lb-l{left:1rem;top:50%;transform:translateY(-50%)}
.pf .lb-r{right:1rem;top:50%;transform:translateY(-50%)}
.pf .lb-count{position:fixed;bottom:1rem;left:0;right:0;text-align:center;color:#fff;font-size:.85rem;opacity:.8}
@media(prefers-reduced-motion:no-preference){.pf .lb{animation:pf-fade .2s ease both}}
@keyframes pf-fade{from{opacity:0}to{opacity:1}}
.pf .contact{background:var(--crimson);color:#fff;border-top:0}
.pf .contact .lnk{border-bottom-color:#fff}
.pf .contact .lnk:hover{background:#fff;color:var(--crimson)}
.pf .contact a:focus-visible,.pf .contact button:focus-visible{outline:2px solid #fff;outline-offset:3px}
.pf .ct{display:grid;gap:2rem;align-items:center}
@media(min-width:800px){.pf .ct{grid-template-columns:1.15fr 1fr;gap:3rem}}
.pf .ct h2{font-size:clamp(2.1rem,5.5vw,3.4rem);line-height:1.02;letter-spacing:-.02em}
.pf .ct-open{display:inline-flex;align-items:center;gap:.5rem;font-size:.85rem;margin-bottom:1rem;padding:.15rem .8rem;border:1px solid rgba(255,255,255,.4);border-radius:999px}
.pf .ct-open::before{content:"";width:.5rem;height:.5rem;border-radius:50%;background:#7CFFB2}
.pf .ct-copy{margin-top:.9rem;max-width:30rem;font-size:1.05rem;line-height:1.55;opacity:.92}
.pf .ct-card{background:rgba(9,8,13,.3);border:1px solid rgba(255,255,255,.22);border-radius:14px;padding:1.4rem}
.pf .ct-lbl{font-size:.8rem;opacity:.75}
.pf .ct-mail{display:block;margin:.2rem 0 1.1rem;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:clamp(.95rem,2.6vw,1.2rem);overflow-wrap:anywhere}
.pf .ct-mail:hover{text-decoration:underline;text-underline-offset:4px}
.pf .ct-row{display:flex;flex-wrap:wrap;gap:.6rem}
.pf .cb{display:inline-flex;align-items:center;justify-content:center;font:inherit;font-weight:500;cursor:pointer;padding:.5rem 1.15rem;border-radius:999px;border:1px solid #fff;background:#fff;color:var(--crimson)}
.pf .cb:hover{background:transparent;color:#fff}
.pf .cb2{background:transparent;color:#fff}
.pf .cb2:hover{background:#fff;color:var(--crimson)}
.pf .ct-soc{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:1rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,.22)}
.pf .ct-soc a{border-bottom:1px solid rgba(255,255,255,.6);padding:0 .1rem 1px}
.pf .ct-soc a:hover{background:#fff;color:var(--crimson);border-bottom-color:#fff}
@media(prefers-reduced-motion:no-preference){.pf .cb,.pf .ct-soc a{transition:background-color .15s ease,color .15s ease}}
.pf .cert img{width:100%;border-radius:8px;border:1px solid var(--line);margin-top:.75rem}
.pf .sec{scroll-margin-top:4rem;border-top:1px solid var(--line);padding:3rem 0}
.pf .btn{background:var(--hi);color:var(--bg);font-weight:500;padding:.5rem 1.1rem;border-radius:999px}
.pf .btn:hover{background:var(--ink)}
.pf .btn2{border:1px solid var(--hi);color:var(--hi);font-weight:500;padding:.5rem 1.1rem;border-radius:999px}
.pf .btn2:hover{background:var(--hi);color:var(--bg)}
.pf .lnk{border-bottom:1px solid var(--hi);padding:0 .3rem 1px;margin:0 -.3rem;border-radius:4px}
.pf .lnk:hover{background:var(--hi);color:var(--bg)}
.pf .social{display:flex;gap:.6rem;flex-wrap:wrap}
.pf .social a{border:1px solid var(--line);border-radius:999px;padding:.2rem .85rem;color:var(--mute)}
.pf .social a:hover{border-color:var(--hi);color:var(--hi)}
.pf .scroll{color:var(--mute);font-size:.8rem;margin-top:2.5rem}
.pf .scroll:hover{color:var(--hi)}
.pf .chip{background:var(--surface);border:1px solid var(--line);padding:.1rem .7rem;border-radius:999px;font-size:.82rem}
.pf .card{position:relative;background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:1.1rem 1.25rem}
.pf .card::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity .25s ease;background:radial-gradient(240px circle at var(--mx,50%) var(--my,50%),color-mix(in srgb,var(--hi) 18%,transparent),transparent 70%)}
.pf .card:hover::before{opacity:1}
.pf .blobs{position:absolute;inset:0 0 auto 0;height:110vh;overflow:hidden;pointer-events:none;z-index:0}
.pf .blob{position:absolute;border-radius:50%;filter:blur(80px);opacity:.28}
.pf.light .blob{opacity:.16}
.pf .b1{width:26rem;height:26rem;background:var(--crimson);top:-6rem;right:-4rem}
.pf .b2{width:20rem;height:20rem;background:var(--hi);top:18rem;left:-6rem;opacity:.16}
.pf main{position:relative;z-index:1}
.pf .shim{background:linear-gradient(90deg,var(--hi),var(--g2),var(--hi));background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent}
.pf .marq{overflow:hidden;border-block:1px solid var(--line);padding:.75rem 0;margin-top:1rem;-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.pf .marq-track{display:flex;gap:2.5rem;width:max-content;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.85rem;color:var(--mute)}
.pf .marq-track span::before{content:"";display:inline-block;width:.4rem;height:.4rem;border-radius:50%;background:var(--hi);margin-right:.7rem;vertical-align:middle}
@media(prefers-reduced-motion:reduce){.pf .marq-track{width:auto;flex-wrap:wrap;justify-content:center;gap:.5rem 1.5rem}.pf .marq-track .dup{display:none}}
.pf .res{display:flex;flex-wrap:wrap;gap:.5rem 1.5rem;margin-top:.75rem;padding:.6rem 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.pf .res>div{display:flex;flex-direction:column-reverse}
.pf .res b{display:block;font-family:'JetBrains Mono',ui-monospace,monospace;font-weight:500;font-size:1.1rem;line-height:1.3;color:var(--hi)}
.pf .res span{font-size:.78rem;color:var(--mute)}
.pf .kind{display:inline-block;border:1px solid var(--line);color:var(--mute);border-radius:4px;padding:0 .55rem;font-size:.78rem;margin-bottom:.4rem}
.pf .kind.rs{border-color:var(--hi);color:var(--hi)}
.pf .step{background:var(--surface);border:1px solid var(--line);padding:0 .5rem;border-radius:3px;font-size:.78rem}
.pf .step.out{background:var(--crimson);border-color:var(--crimson);color:#fff}
.pf .ph{display:flex;align-items:center;justify-content:center;text-align:center;padding:.5rem;
  border:1px dashed var(--line);background:var(--surface);color:var(--mute);font-size:.8rem;border-radius:10px}
.pf .media{width:100%;object-fit:cover;border-radius:10px;display:block}
.pf .proj{display:grid;gap:1.5rem;padding:2rem 0;border-top:1px solid var(--line)}
.pf .proj:first-child{border-top:0;padding-top:0}
@media(min-width:900px){.pf .proj{grid-template-columns:1.1fr 1fr;align-items:center}
.pf .proj:nth-child(even) .pimg{order:2}}
.pf .tl{display:grid;gap:.25rem 1.5rem;padding:1rem 0;border-top:1px solid var(--line)}
.pf .tl:first-child{border-top:0;padding-top:0}
.pf .foot{border-top:1px solid var(--line);padding:1.25rem 0;font-size:.8rem}
.pf .skip{position:absolute;left:-999px;top:0;background:var(--hi);color:var(--bg);padding:.4rem .9rem;z-index:20;border-radius:0 0 8px 0}
.pf .skip:focus{left:0}
@keyframes pf-shim{0%,100%{background-position:0 0}50%{background-position:100% 0}}
@keyframes pf-drift{from{transform:translate(0,0) scale(1)}to{transform:translate(-3rem,4rem) scale(1.18)}}
@keyframes pf-marq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes pf-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:no-preference){
html{scroll-behavior:smooth}
.pf .st{animation:pf-in .7s cubic-bezier(.2,.7,.2,1) both;animation-delay:calc(var(--i,0) * .1s)}
.pf .shim{animation:pf-shim 6s ease-in-out infinite}
.pf .blob{animation:pf-drift 16s ease-in-out infinite alternate}
.pf .b2{animation-duration:21s;animation-direction:alternate-reverse}
.pf .marq-track{animation:pf-marq 32s linear infinite}
.pf .marq:hover .marq-track{animation-play-state:paused}
.pf .pimg{transition:transform .35s ease}
.pf .proj:hover .pimg{transform:translateY(-4px) rotate(-.6deg)}
.pf .rv{opacity:0;transform:translateY(28px);transition:opacity .7s ease,transform .7s ease;transition-delay:var(--d,0s)}
.pf .rv.in{opacity:1;transform:none}
.pf .btn,.pf .btn2,.pf .lnk,.pf .nav a,.pf .social a{transition:background-color .15s ease,color .15s ease,border-color .15s ease}
}
`;

const projects = [
  {
    title: "Jeopardy Night",
    type: "Solo project",
    image: ["/Jeopardy/jeo_main_menu.png", "/Jeopardy/host.png", "/Jeopardy/edit.png", "/Jeopardy/team_order.png", "/Jeopardy/shop.png", "/Jeopardy/clue.png", "/Jeopardy/clue_revealed.png"],
    captions: ["Main menu: host a game or join as a player", "Host board with Normal, Double and Final Jeopardy rounds", "Board editor", "Team order", "In-game shop", "Clue screen", "Clue with the answer revealed"],
    summary: "A real-time multiplayer Jeopardy game played inside a Discord activity.",
    flow: ["Players", "WebSocket server", "Shared board", "Discord"],
    points: [
      "React + Vite front end styled with CSS.",
      "WebSockets sync the board, buzzers and scores for every player.",
      "Discord SDK launches the game from a voice channel.",
    ],
    stack: "React, Vite, CSS, WebSockets, Discord SDK",
    role: "", // your part, e.g. "Built the WebSocket server and board UI"
    learned: "", // optional, e.g. "How WebSockets keep players in sync"
    demo: "", // live demo link, optional
    repo: "https://github.com/Xavezs/Jeopardy",
    results: [], // optional, e.g. [["Players per room", "8"]]
  },
  {
    title: "BookWorm",
    type: "Campus project",
    summary: "A full-stack library borrowing and reservation system for librarians and members.",
    flow: ["Member", "React + Express API", "SQLite", "Reservation and fines"],
    points: [
      "JWT login with role-based access: an admin dashboard and a member dashboard.",
      "Librarians manage books, members and loans (check-out, check-in, renew) and set the daily fine rate.",
      "Members search and reserve books, view borrowing history and pay fines; unpaid fines block new reservations.",
    ],
    stack: "React, Tailwind CSS, Node.js, Express, SQLite, JWT",
    role: "Implemented fine payment from the SRS; wrote the user manual and project documents.",
    learned: "", // optional, e.g. "How WebSockets keep players in sync"
    demo: "https://bookworm-khaki.vercel.app/",
    image: ["/BookWorm/bookworm.png", "/BookWorm/bookworm_member.png"], 
    captions: ["BookWorm main screen", "Member dashboard"],
    repo: "https://github.com/Xavezs/BookingLibrary",
    results: [],
  },
  {
    title: "Reading Between the Lines",
    type: "Research",
    summary: "Sarcasm-aware sentiment analysis on Indonesian Twitter using IndoBERT, RoBERTa and mBERT.",
    flow: ["Tweet", "Sentiment model", "Sarcasm detector", "Negative if P > 0.8"],
    points: [
      "Compared three Transformer sarcasm detectors, with upsampling for a 95:5 class imbalance.",
      "If P(sarcasm) > 0.8, the sentiment is overridden to negative.",
      "Sentiment F1 improved for all three models, though the gains are small.",
    ],
    stack: "Python, IndoBERT, RoBERTa, mBERT, Transformers",
    role: "Wrote the abstract, keywords and conclusion, contributed to the methodology and data curation, and checked the notebook against the paper.",
    learned: "", 
    demo: "",
    fit: "contain",
    image: [
      "/Research/1-pipeline.png",
      "/Research/2-sarcasm-indobert.png",
      "/Research/3-sarcasm-roberta.png",
      "/Research/4-sarcasm-mbert.png",
      "/Research/5-sentiment-indobert.png",
      "/Research/6-sentiment-roberta.png",
      "/Research/7-sentiment-mbert.png",
    ],
    captions: [
      "Fig. 1: Sarcasm-aware sentiment pipeline",
      "Fig. 2: Sarcasm detection metrics, IndoBERT",
      "Fig. 3: Sarcasm detection metrics, RoBERTa",
      "Fig. 4: Sarcasm detection metrics, mBERT",
      "Fig. 5: Sentiment baseline vs enhanced, IndoBERT",
      "Fig. 6: Sentiment baseline vs enhanced, RoBERTa",
      "Fig. 7: Sentiment baseline vs enhanced, mBERT",
    ],
    repo: "",
    paper: "/Research/paper.pdf", 
    results: [["RoBERTa sarcasm F1", "0.7716"], ["IndoBERT sentiment F1", "0.9635 \u2192 0.9656"], ["Tweets", "12,861"]],
  },
  {
    title: "Ripe or Not",
    type: "Campus project",
    summary: "A fruit ripeness classifier using classical computer vision, no deep learning.",
    flow: ["Photo", "HSV, LAB, GLCM, LBP", "SVM", "Ripeness class"],
    points: [
      "HSV and LAB color features capture ripeness-related color shifts.",
      "GLCM and LBP texture plus shape features describe the fruit surface: 47 features in total.",
      "An SVM classifies the combined feature vector.",
    ],
    stack: "Python, HSV, LAB, GLCM, LBP, SVM",
    role: "Wrote the Results and Conclusion sections of the IEEE paper and merged the group report.",
    learned: "", // optional, e.g. "How WebSockets keep players in sync"
    demo: "https://fruit-classifier-mu.vercel.app/",
    image: "/Ripe/ripe.png",
    captions: ["Home page of the fruit ripeness detector"],
    repo: "",
    results: [["Accuracy", "89.82%"], ["Features", "47"]],
  },
  {
    title: "PM2.5 Predictor",
    type: "Campus project",
    summary: "A web app that predicts PM2.5 air pollution for five Jakarta-area monitoring stations.",
    flow: ["Form input", "FastAPI + Random Forest", "PM2.5 prediction", "Gemini explanation"],
    points: [
      "FastAPI service serves a scikit-learn Random Forest model that predicts PM2.5 from pollutant readings, date and station.",
      "Indonesian-language web form with per-field guidance and a chat-style results panel.",
      "Gemini turns the prediction into a short plain-language health explanation.",
    ],
    stack: "Python, FastAPI, scikit-learn, JavaScript, Tailwind CSS, Gemini API",
    role: "", // your part, e.g. "Built the WebSocket server and board UI"
    learned: "", // optional, e.g. "How WebSockets keep players in sync"
    demo: "", // live demo link, optional
    image: ["/PM25/1-form.png", "/PM25/2-result.png"],
    captions: ["Input form and results panel", "A prediction in the results panel"],
    // This is a teammate's repo (Agerbav). Swap in your own once your code is pushed.
    repo: "https://github.com/Agerbav/pm2.5-Predictor",
    results: [], // e.g. [["RMSE", "X.X"], ["R²", "0.XX"]]
  },
];

const skills = [
  ["Languages", "Python, C++, JavaScript"],
  ["Frontend", "React, Tailwind CSS, Vite"],
  ["Backend", "Node.js, WebSockets"],
  ["AI and ML", "Machine Learning, NLP, Computer Vision, Transformers, SVM"],
];

const marqueeItems = skills.flatMap(([, v]) => v.split(", "));

// Edit freely; shown as numbers under About.
const stats = [
  [String(projects.length), "Projects so far"],
  ["3", "Areas I'm exploring: web, NLP, vision"],
];

// Leave empty to hide the section. Example:
// { role: "Vice Coordinator, Sponsor Division", org: "HIMTI", period: "2025", points: ["What you did"] }
const experience = [];

// Leave empty to hide the section. Example:
// { title: "Certificate name", issuer: "Organizer", year: "2026", image: "/cert.png", link: "" }
const certificates = [];

const education = [
  {
    school: "BINUS University",
    degree: "Bachelor of Computer Science",
    period: "", // e.g. "2023 – 2027"
    note: "", // e.g. "GPA 3.8 · Relevant: Machine Learning, NLP, Computer Vision"
  },
];

const sections = [
  "about",
  "projects",
  "skills",
  ...(experience.length ? ["experience"] : []),
  "education",
  ...(certificates.length ? ["certificates"] : []),
  "contact",
];

export default function Portfolio() {
  const [active, setActive] = useState("");
  const [light, setLight] = useState(() => {
    try {
      return localStorage.getItem("pf-theme") === "light";
    } catch {
      return false;
    }
  });
  const barRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const email = LINKS.email.replace(/^mailto:/, "");

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const t = document.createElement("textarea");
      t.value = email;
      t.style.position = "fixed";
      t.style.opacity = "0";
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      document.body.removeChild(t);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleTheme = () =>
    setLight((v) => {
      try {
        localStorage.setItem("pf-theme", v ? "dark" : "light");
      } catch {
        /* storage unavailable */
      }
      return !v;
    });

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    const rv = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            rv.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".pf .rv").forEach((el) => rv.observe(el));
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
    };
    const onMove = (e) => {
      const c = e.target.closest && e.target.closest(".pf .card");
      if (!c) return;
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", e.clientX - r.left + "px");
      c.style.setProperty("--my", e.clientY - r.top + "px");
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      obs.disconnect();
      rv.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className={"pf" + (light ? " light" : "")}>
      <style>{css}</style>
      <a className="skip" href="#about">Skip to content</a>
      <div className="bar" ref={barRef} aria-hidden="true" />
      <div className="blobs" aria-hidden="true">
        <div className="blob b1" />
        <div className="blob b2" />
      </div>

      <header className="top">
        <div className="wrap flex items-center justify-between gap-4 py-3">
          <a href="#top" className="disp shrink-0 text-lg font-bold">Portfolio</a>
          <nav className="nav" aria-label="Sections">
            {sections.map((s) => (
              <a key={s} href={`#${s}`} className={active === s ? "on" : ""}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </a>
            ))}
          </nav>
          <button type="button" className="tgl" onClick={toggleTheme} aria-label="Switch between dark and light theme">
            {light ? "Dark" : "Light"}
          </button>
        </div>
      </header>

      <main id="top" className="wrap">
        <div className="hero">
          <div className="flex flex-col-reverse gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="pill st" style={{ "--i": 0 }}>Learning and open to internships</p>
              <h1 className="disp st max-w-2xl text-3xl font-bold leading-tight sm:text-5xl" style={{ "--i": 1 }}>
                Hello, I'm <span className="shim">Yalvin Clay</span>
              </h1>
              <p className="tag st mt-4 max-w-xl" style={{ "--i": 2 }}>
                Curious CS student, building things to learn how they work.
              </p>
              <p className="mute st mt-3 max-w-xl" style={{ "--i": 3 }}>
                Computer Science student at BINUS University, exploring full-stack
                development, NLP and computer vision.
              </p>
              <p className="st mt-6 flex flex-wrap items-center gap-3" style={{ "--i": 4 }}>
                <a className="btn" href="#projects">View projects</a>
                <a className="btn2" href={LINKS.email}>Email me</a>
                {LINKS.cv && (
                  <a className="btn2" href={LINKS.cv} download>Download CV</a>
                )}
              </p>
              <div className="social st mt-5" style={{ "--i": 5 }}>
                <a href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                <a href={LINKS.github} target="_blank" rel="noreferrer">GitHub</a>
              </div>
            </div>
            <div className="st w-40 shrink-0 sm:w-56" style={{ "--i": 3 }}>
              <Media src={PHOTO} alt="Portrait of Yalvin Clay" label="Your photo" ratio="1 / 1" />
            </div>
          </div>
        </div>

        <div className="marq" aria-hidden="true">
          <div className="marq-track">
            {[...marqueeItems, ...marqueeItems].map((t, k) => (
              <span key={k} className={k >= marqueeItems.length ? "dup" : ""}>{t}</span>
            ))}
          </div>
        </div>

        <section id="about" className="sec rv grid gap-3 md:grid-cols-[9rem_1fr]">
          <h2 className="disp text-lg font-bold">About</h2>
          <p className="max-w-2xl">
            I'm early in my journey and still exploring where I fit between
            software engineering and machine learning. So far that has meant
            building a multiplayer game in React and Node, and testing Transformer
            models on Indonesian social media text. I learn best by building real
            things with teammates, and I'm looking for internships and
            entry-level opportunities where I can keep learning and contribute.
          </p>
          <div className="stats md:col-start-2">
            {stats.map(([n, l]) => (
              <div key={l}>
                <b>{n}</b>
                <span>{l}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="projects" className="sec">
          <h2 className="disp rv mb-6 text-lg font-bold">Projects</h2>
          <div>
            {projects.map((p) => (
              <article key={p.title} className="proj rv">
                <div className="pimg">
                  <Gallery src={p.image} title={p.title} fit={p.fit} captions={p.captions} />
                </div>
                <div>
                  {p.type && <p className={"kind" + (p.type === "Research" ? " rs" : "")}>{p.type}</p>}
                  <h3 className="disp text-xl font-bold">{p.title}</h3>
                  <p className="mute mt-1">{p.summary}</p>
                  {p.learned && (
                    <p className="mt-1 text-sm"><span style={{ color: "var(--hi)" }}>What I learned:</span> {p.learned}</p>
                  )}
                  {p.role && (
                    <p className="mt-2 text-sm"><span style={{ color: "var(--hi)" }}>My role:</span> {p.role}</p>
                  )}
                  <div className="my-3 flex flex-wrap items-center gap-1">
                    {p.flow.map((s, i) => (
                      <React.Fragment key={s}>
                        <span className={"step" + (i === p.flow.length - 1 ? " out" : "")}>{s}</span>
                        {i < p.flow.length - 1 && (
                          <span className="mute text-xs" aria-hidden="true">›</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <ul className="list-disc space-y-1 pl-4">
                    {p.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                  {p.results.length > 0 && (
                    <dl className="res">
                      {p.results.map(([label, value]) => (
                        <div key={label}>
                          <dd><b>{value}</b></dd>
                          <dt><span>{label}</span></dt>
                        </div>
                      ))}
                    </dl>
                  )}
                  <p className="mt-4 flex flex-wrap gap-2">
                    {p.stack.split(", ").map((t) => (
                      <span key={t} className="chip">{t}</span>
                    ))}
                  </p>
                  {(p.repo || p.demo || p.paper) && (
                    <p className="mt-4 flex flex-wrap gap-3">
                      {p.demo && <a className="btn inline-block" href={p.demo} target="_blank" rel="noreferrer">Live demo</a>}
                      {p.repo && <a className="btn2 inline-block" href={p.repo} target="_blank" rel="noreferrer">GitHub</a>}
                      {p.paper && <a className="btn inline-block" href={p.paper} download="Sarcasm-Aware-Sentiment-Analysis-Indonesian-Twitter.pdf">Download paper</a>}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="sec">
          <h2 className="disp rv mb-5 text-lg font-bold">Skills I'm building</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map(([k, v], i) => (
              <div key={k} className="card rv" style={{ "--d": `${i * 0.1}s` }}>
                <h3 className="font-medium">{k}</h3>
                <p className="mt-3 flex flex-wrap gap-2">
                  {v.split(", ").map((t) => (
                    <span key={t} className="chip">{t}</span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </section>

        {experience.length > 0 && (
          <section id="experience" className="sec rv grid gap-3 md:grid-cols-[9rem_1fr]">
            <h2 className="disp text-lg font-bold">Experience</h2>
            <div>
              {experience.map((x) => (
                <div key={x.role + x.org} className="tl">
                  <h3 className="font-medium">{x.role}</h3>
                  <p className="mute">{x.org}{x.period && ` · ${x.period}`}</p>
                  {x.points && x.points.length > 0 && (
                    <ul className="mt-1 list-disc space-y-1 pl-4">
                      {x.points.map((pt) => <li key={pt}>{pt}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <section id="education" className="sec rv grid gap-3 md:grid-cols-[9rem_1fr]">
          <h2 className="disp text-lg font-bold">Education</h2>
          <div>
            {education.map((e) => (
              <div key={e.school} className="tl">
                <h3 className="font-medium">{e.school}</h3>
                <p className="mute">{e.degree}{e.period && ` · ${e.period}`}</p>
                {e.note && <p className="mt-1">{e.note}</p>}
              </div>
            ))}
          </div>
        </section>

        {certificates.length > 0 && (
          <section id="certificates" className="sec rv grid gap-3 md:grid-cols-[9rem_1fr]">
            <h2 className="disp text-lg font-bold">Certificates</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {certificates.map((c) => (
                <div key={c.title} className="card">
                  <h3 className="font-medium">{c.title}</h3>
                  <p className="mute">{c.issuer}{c.year && ` · ${c.year}`}</p>
                  {c.image && <img src={c.image} alt={`${c.title} certificate`} loading="lazy" />}
                  {c.link && <p className="mt-3"><a className="btn2 inline-block" href={c.link} target="_blank" rel="noreferrer">Verify</a></p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <section id="contact" className="sec contact rv">
        <div className="wrap ct">
          <div>
            <p className="ct-open">Open to internships and entry-level roles</p>
            <h2 className="disp font-bold">Let's talk</h2>
            <p className="ct-copy">
              Hiring, mentoring, or just want to compare notes on a project?
              Send me a message and I'll get back to you.
            </p>
          </div>
          <div className="ct-card">
            <p className="ct-lbl">Best way to reach me</p>
            <a className="ct-mail" href={LINKS.email}>{email}</a>
            <div className="ct-row">
              <a className="cb" href={LINKS.email}>Email me</a>
              <button type="button" className="cb cb2" onClick={copyEmail}>
                {copied ? "Copied" : "Copy email"}
              </button>
              {LINKS.cv && <a className="cb cb2" href={LINKS.cv} download>Download CV</a>}
            </div>
            <span className="sr-only" role="status" aria-live="polite">{copied ? "Email address copied" : ""}</span>
            <div className="ct-soc">
              <a href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={LINKS.github} target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="foot mute">
        <div className="wrap">© Yalvin Clay</div>
      </footer>
    </div>
  );
}