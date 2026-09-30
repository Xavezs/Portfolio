import React, { useEffect, useState } from "react";

// TODO: replace with your real links
const LINKS = {
  linkedin: "https://www.linkedin.com/in/your-handle",
  github: "https://github.com/Xavezs",
  email: "mailto:you@example.com",
  // Put your CV in the public folder, e.g. "/Yalvin-Clay-CV.pdf". Empty hides the button.
  cv: "/your-cv.pdf",
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

// Colors and fonts live in CSS variables so they work with or without a Tailwind build.
const css = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;700&family=Instrument+Sans:wght@400;500&family=JetBrains+Mono:wght@500&display=swap');
.pf{--bg:#181A2F;--surface:#242E49;--ink:#f6ece8;--mute:#a9b1c9;--line:#37415C;--hi:#FDA481;--crimson:#B4182D;--wine:#541628;
  background:var(--bg);color:var(--ink);min-height:100vh;
  font-family:'Instrument Sans',system-ui,sans-serif;line-height:1.6;font-size:15px}
.pf h1,.pf h2,.pf h3,.pf .disp{font-family:'Bricolage Grotesque','Instrument Sans',system-ui,sans-serif}
.pf a{color:inherit;text-decoration:none}
.pf a:focus-visible{outline:2px solid var(--hi);outline-offset:3px}
.pf ::selection{background:var(--wine);color:var(--hi)}
.pf .mute{color:var(--mute)}
.pf .wrap{max-width:68rem;margin:0 auto;padding-left:1.25rem;padding-right:1.25rem}
.pf .top{position:sticky;top:0;z-index:10;background:var(--bg);border-bottom:1px solid var(--line)}
.pf .nav{display:flex;gap:1.25rem;overflow-x:auto;white-space:nowrap}
.pf .nav a{padding:.25rem 0;border-bottom:2px solid transparent}
.pf .nav a:hover{color:var(--hi)}
.pf .nav a.on{color:var(--hi);border-bottom-color:var(--hi)}
.pf .sec{scroll-margin-top:4rem;border-top:1px solid var(--line);padding:2rem 0}
.pf .btn{background:var(--hi);color:var(--bg);font-weight:500;padding:.3rem .9rem;border-radius:4px}
.pf .btn:hover{background:var(--ink)}
.pf .lnk{border-bottom:1px solid var(--hi);padding:0 .3rem 1px;margin:0 -.3rem;border-radius:4px}
.pf .lnk:hover{background:var(--hi);color:var(--bg)}
.pf .btn2{border:1px solid var(--hi);color:var(--hi);font-weight:500;padding:.3rem .9rem;border-radius:4px}
.pf .btn2:hover{background:var(--hi);color:var(--bg)}
.pf .res{display:flex;flex-wrap:wrap;gap:.5rem 1.5rem;margin-top:.75rem;padding:.6rem 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.pf .res b{display:block;font-family:'JetBrains Mono',ui-monospace,monospace;font-weight:500;font-size:1.1rem;line-height:1.3;color:var(--hi)}
.pf .res span{font-size:.78rem;color:var(--mute)}
.pf .step{background:var(--surface);border:1px solid var(--line);padding:0 .5rem;border-radius:3px;font-size:.78rem}
.pf .step.out{background:var(--crimson);border-color:var(--crimson);color:#fff}
.pf .ph{display:flex;align-items:center;justify-content:center;text-align:center;padding:.5rem;
  border:1px dashed var(--mute);background:var(--surface);color:var(--mute);font-size:.8rem;border-radius:4px}
.pf .media{width:100%;object-fit:cover;border-radius:4px;display:block}
.pf .proj{padding:1.25rem 0;border-top:1px solid var(--line)}
.pf .proj:first-child{border-top:0;padding-top:0}
@media(min-width:1024px){
.pf .projs{display:grid;grid-template-columns:1fr 1fr;column-gap:3rem}
.pf .proj:nth-child(2){border-top:0;padding-top:0}
}
@keyframes pf-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:no-preference){
html{scroll-behavior:smooth}
.pf .hero{animation:pf-in .6s ease-out both}
.pf .btn,.pf .btn2,.pf .lnk,.pf .nav a{transition:background-color .15s ease,color .15s ease,border-color .15s ease}
}
`;

const projects = [
  {
    title: "Jeopardy Night",
    summary: "A real-time multiplayer Jeopardy game played inside a Discord activity.",
    flow: ["Players", "WebSocket server", "Shared board", "Discord"],
    points: [
      "React + Vite front end styled with Tailwind CSS.",
      "WebSockets sync the board, buzzers and scores for every player.",
      "Discord SDK launches the game from a voice channel.",
    ],
    stack: "React, Vite, Tailwind CSS, WebSockets, Discord SDK",
    image: "", // e.g. "/jeopardy.png"
    repo: "https://github.com/Xavezs/Jeopardy",
    results: [], // optional, e.g. [["Players per room", "8"]]
  },
  {
    title: "Reading Between the Lines",
    summary: "NLP research on sarcasm and irony in Indonesian social media.",
    flow: ["Post", "IndoBERT / RoBERTa", "Classifier", "Sarcastic or not"],
    points: [
      "Fine-tuned Transformers on informal, slang-heavy Indonesian text.",
      "Compared IndoBERT and RoBERTa on the same task.",
      "Framed as a research study with reproducible evaluation.",
    ],
    stack: "Python, IndoBERT, RoBERTa, Transformers",
    image: "",
    repo: "", // not on GitHub yet; add the link when you upload it
    // TODO: replace with your real numbers
    results: [["IndoBERT F1", "XX%"], ["RoBERTa F1", "XX%"], ["Dataset", "X,XXX posts"]],
  },
  {
    title: "Ripe or Not",
    summary: "A fruit ripeness classifier using classical computer vision, no deep learning.",
    flow: ["Photo", "HSV + GLCM", "SVM", "Ripeness class"],
    points: [
      "HSV color features capture ripeness-related color shifts.",
      "GLCM texture analysis captures changes in the surface.",
      "An SVM classifies the combined feature vector.",
    ],
    stack: "Python, HSV, GLCM, SVM",
    image: "",
    repo: "", // not on GitHub yet; add the link when you upload it
    // TODO: replace with your real numbers
    results: [["Accuracy", "XX%"], ["Classes", "X"], ["Images", "X,XXX"]],
  },
  {
    title: "PM2.5 Predictor",
    // TODO: confirm what it predicts and where
    summary: "A web app that predicts PM2.5 air pollution levels.",
    flow: ["Input", "Python API", "Prediction", "Chat interface"],
    points: [
      "Python API served with Uvicorn.",
      "Chat-style web front end that talks to the API.",
      "TODO: what you built, and the model and data used.",
    ],
    stack: "Python, Uvicorn, JavaScript", // TODO: confirm
    image: "",
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

const sections = ["about", "projects", "skills", "contact"];

export default function Portfolio() {
  const [active, setActive] = useState("");

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
    return () => obs.disconnect();
  }, []);

  return (
    <div className="pf">
      <style>{css}</style>

      <header className="top">
        <div className="wrap flex items-center justify-between gap-4 py-3">
          <a href="#top" className="disp shrink-0 text-lg font-bold">Yalvin Clay</a>
          <nav className="nav" aria-label="Sections">
            {sections.map((s) => (
              <a key={s} href={`#${s}`} className={active === s ? "on" : ""}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main id="top" className="wrap">
        <div className="hero flex flex-col-reverse gap-6 py-10 sm:py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="disp max-w-2xl text-3xl font-bold leading-tight sm:text-5xl">
              I build web apps, and I train the models that make them smarter.
            </h1>
            <p className="mute mt-3 max-w-xl">
              Computer Science student at BINUS University. Full-stack development,
              NLP and computer vision.
            </p>
            <p className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
              <a className="btn" href={LINKS.email}>Email me</a>
              {LINKS.cv && (
                <a className="btn2" href={LINKS.cv} download>Download CV</a>
              )}
              <a className="lnk" href={LINKS.linkedin}>LinkedIn</a>
              <a className="lnk" href={LINKS.github}>GitHub</a>
            </p>
          </div>
          <div className="w-40 shrink-0 sm:w-48">
            <Media src={PHOTO} alt="Portrait of Yalvin Clay" label="Your photo" ratio="1 / 1" />
          </div>
        </div>

        <section id="about" className="sec grid gap-3 md:grid-cols-[9rem_1fr]">
          <h2 className="disp text-lg font-bold">About</h2>
          <p className="max-w-2xl">
            I like problems between software engineering and machine learning: one
            week a real-time multiplayer game in React and Node, the next a
            Transformer fine-tuned on Indonesian social media text. I enjoy the whole
            path from idea to something people can use, and I'm looking for
            internships, junior roles and research collaborations.
          </p>
        </section>

        <section id="projects" className="sec">
          <h2 className="disp mb-5 text-lg font-bold">Projects</h2>
          <div className="projs">
            {projects.map((p) => (
              <article key={p.title} className="proj">
                <Media src={p.image} alt={`${p.title} screenshot`} label={`${p.title} screenshot`} ratio="16 / 9" />
                <h3 className="disp mt-4 text-xl font-bold">{p.title}</h3>
                <p className="mute mt-1">{p.summary}</p>
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
                <p className="mute mt-3 text-sm">{p.stack}</p>
                {p.repo && (
                  <p className="mt-3">
                    <a className="lnk" href={p.repo}>GitHub</a>
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="sec">
          <h2 className="disp mb-4 text-lg font-bold">Skills</h2>
          <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map(([k, v]) => (
              <div key={k}>
                <h3 className="font-medium">{k}</h3>
                <p className="mute text-sm">{v}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <section id="contact" className="sec" style={{ background: "var(--crimson)", borderTop: 0 }}>
        <div className="wrap flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="disp text-2xl font-bold">Say hello</h2>
            <p>Hiring, or have a research idea? I'd like to hear about it.</p>
          </div>
          <p className="flex flex-wrap gap-x-6 gap-y-2 text-lg">
            <a className="lnk" href={LINKS.linkedin}>LinkedIn</a>
            <a className="lnk" href={LINKS.github}>GitHub</a>
            <a className="lnk" href={LINKS.email}>Email</a>
          </p>
        </div>
      </section>
    </div>
  );
}