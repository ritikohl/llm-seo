import React, { useState, useEffect, useRef } from "react";

// ── STYLES ────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Syne:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #080b0f;
    --surface: #0e1318;
    --surface2: #141b22;
    --border: #1e2a35;
    --border2: #243040;
    --lime: #b8ff3c;
    --lime-dim: #8ab82a;
    --cyan: #3cffd8;
    --red: #ff4444;
    --yellow: #ffcc00;
    --text: #e8eef4;
    --text-dim: #7a8fa0;
    --text-muted: #3d5060;
    --font-display: 'Syne', sans-serif;
    --font-mono: 'DM Mono', monospace;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-display); }

  .app {
    min-height: 100vh;
    background: var(--bg);
    position: relative;
    overflow-x: hidden;
  }

  /* grid bg */
  .app::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(184,255,60,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(184,255,60,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
    z-index: 0;
  }

  .wrap {
    position: relative;
    z-index: 1;
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 24px 80px;
  }

  /* ── HEADER ── */
  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 52px;
  }
  .logo-mark {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .logo-icon {
    width: 36px;
    height: 36px;
    border: 1.5px solid var(--lime);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }
  .logo-text {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-dim);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    line-height: 1.6;
  }
  .logo-text strong {
    display: block;
    color: var(--lime);
    font-size: 13px;
    letter-spacing: 0.08em;
  }
  .badge {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    color: var(--text-muted);
    border: 1px solid var(--border);
    padding: 4px 10px;
    border-radius: 20px;
    text-transform: uppercase;
  }

  /* ── HERO ── */
  .hero { margin-bottom: 44px; }
  .hero h1 {
    font-size: clamp(32px, 6vw, 54px);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.02em;
    color: var(--text);
    margin-bottom: 14px;
  }
  .hero h1 em {
    font-style: normal;
    color: var(--lime);
  }
  .hero p {
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--text-dim);
    line-height: 1.7;
    max-width: 520px;
  }

  /* ── INPUT PANEL ── */
  .input-panel {
    background: var(--surface);
    border: 1px solid var(--border2);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 40px;
    position: relative;
    overflow: hidden;
  }
  .input-panel::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--lime), transparent);
    opacity: 0.4;
  }
  .api-key-input {
    width: 100%;
    background: var(--bg);
    border: 1px solid var(--border2);
    border-radius: 10px;
    padding: 12px 16px;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--text);
    margin-bottom: 16px;
    outline: none;
    transition: border-color 0.2s;
  }
  .api-key-input::placeholder { color: var(--text-muted); }
  .api-key-input:focus { border-color: var(--lime); }

  .input-label {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 10px;
  }
  .input-row {
    display: flex;
    gap: 10px;
    align-items: stretch;
  }
  .url-input {
    flex: 1;
    background: var(--bg);
    border: 1px solid var(--border2);
    border-radius: 10px;
    padding: 14px 16px;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s;
  }
  .url-input::placeholder { color: var(--text-muted); }
  .url-input:focus { border-color: var(--lime); }
  .analyze-btn {
    background: var(--lime);
    color: var(--bg);
    border: none;
    border-radius: 10px;
    padding: 14px 24px;
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.04em;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .analyze-btn:hover { background: #d4ff60; transform: translateY(-1px); }
  .analyze-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .analyze-btn .spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(0,0,0,0.2);
    border-top-color: var(--bg);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .error-msg {
    margin-top: 12px;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--red);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  /* ── LOADING STATE ── */
  .loading-panel {
    background: var(--surface);
    border: 1px solid var(--border2);
    border-radius: 16px;
    padding: 40px 32px;
    text-align: center;
    margin-bottom: 40px;
  }
  .loading-pulse {
    width: 56px; height: 56px;
    border-radius: 50%;
    border: 2px solid var(--border);
    border-top-color: var(--lime);
    animation: spin 1s linear infinite;
    margin: 0 auto 24px;
  }
  .loading-step {
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--lime);
    margin-bottom: 8px;
  }
  .loading-sub {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-muted);
  }

  /* ── RESULTS ── */
  .results { animation: fadeUp 0.5s ease both; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Score hero */
  .score-hero {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 24px;
    background: var(--surface);
    border: 1px solid var(--border2);
    border-radius: 16px;
    padding: 32px;
    margin-bottom: 24px;
    align-items: center;
    position: relative;
    overflow: hidden;
  }
  .score-hero::after {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 200px; height: 200px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(184,255,60,0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  .score-ring-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  .score-ring {
    position: relative;
    width: 140px;
    height: 140px;
  }
  .score-ring svg {
    transform: rotate(-90deg);
    width: 140px;
    height: 140px;
  }
  .score-ring .track {
    fill: none;
    stroke: var(--border);
    stroke-width: 8;
  }
  .score-ring .fill {
    fill: none;
    stroke-width: 8;
    stroke-linecap: round;
    transition: stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1);
  }
  .score-center {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
  .score-num {
    font-size: 36px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.03em;
  }
  .score-label {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-muted);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-top: 2px;
  }
  .grade-badge {
    font-size: 28px;
    font-weight: 800;
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: -0.02em;
  }

  .score-meta { flex: 1; }
  .score-url {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-muted);
    margin-bottom: 6px;
    word-break: break-all;
  }
  .score-headline {
    font-size: 22px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 10px;
    line-height: 1.2;
  }
  .score-summary {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-dim);
    line-height: 1.7;
  }

  /* Categories */
  .section-label {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .categories-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 28px;
  }
  @media (max-width: 600px) { .categories-grid { grid-template-columns: 1fr; } }

  .cat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px 18px;
    transition: border-color 0.2s;
  }
  .cat-card:hover { border-color: var(--border2); }
  .cat-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
  }
  .cat-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
    line-height: 1.3;
  }
  .cat-icon { font-size: 16px; }
  .cat-score-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .cat-score-num {
    font-family: var(--font-mono);
    font-size: 24px;
    font-weight: 500;
  }
  .cat-weight {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-muted);
  }
  .bar-track {
    height: 4px;
    background: var(--border);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 8px;
  }
  .bar-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 1s cubic-bezier(0.16,1,0.3,1);
  }
  .cat-issue {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-muted);
    line-height: 1.5;
  }

  /* Suggestions */
  .suggestions-list { display: flex; flex-direction: column; gap: 12px; }
  .sug-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 18px 20px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 16px;
    transition: border-color 0.2s, background 0.2s;
    cursor: default;
  }
  .sug-card:hover { border-color: var(--border2); background: var(--surface2); }
  .sug-priority {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding-top: 2px;
  }
  .priority-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .priority-line {
    width: 1px;
    flex: 1;
    min-height: 20px;
    background: var(--border);
  }
  .sug-body {}
  .sug-head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
  }
  .sug-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
  }
  .priority-tag {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 2px 8px;
    border-radius: 20px;
    font-weight: 500;
  }
  .sug-desc {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-dim);
    line-height: 1.65;
    margin-bottom: 10px;
  }
  .sug-example {
    background: var(--bg);
    border: 1px solid var(--border);
    border-left: 3px solid var(--lime);
    border-radius: 6px;
    padding: 10px 14px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-dim);
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
  }

  /* color helpers */
  .clr-lime { color: var(--lime); }
  .clr-yellow { color: var(--yellow); }
  .clr-red { color: var(--red); }
  .clr-cyan { color: var(--cyan); }
  .clr-dim { color: var(--text-muted); }
`;

// ── HELPERS ───────────────────────────────────────────────────────────────────
function scoreColor(s) {
  if (s >= 75) return "#b8ff3c";
  if (s >= 50) return "#ffcc00";
  return "#ff4444";
}

function scoreGrade(s) {
  if (s >= 90) return "A+";
  if (s >= 80) return "A";
  if (s >= 70) return "B";
  if (s >= 60) return "C";
  if (s >= 50) return "D";
  return "F";
}

function gradeColor(g) {
  if (g === "A+" || g === "A") return { bg: "rgba(184,255,60,0.12)", color: "#b8ff3c" };
  if (g === "B") return { bg: "rgba(60,255,216,0.1)", color: "#3cffd8" };
  if (g === "C") return { bg: "rgba(255,204,0,0.1)", color: "#ffcc00" };
  return { bg: "rgba(255,68,68,0.1)", color: "#ff4444" };
}

function priorityStyle(p) {
  if (p === "high") return { dot: "#ff4444", tag: { background: "rgba(255,68,68,0.12)", color: "#ff4444" } };
  if (p === "medium") return { dot: "#ffcc00", tag: { background: "rgba(255,204,0,0.1)", color: "#ffcc00" } };
  return { dot: "#b8ff3c", tag: { background: "rgba(184,255,60,0.1)", color: "#b8ff3c" } };
}

const CAT_ICONS = {
  "Prompt Visibility Testing": "◉",
  "Semantic Depth & Topical Authority": "⊞",
  "Entity Clarity": "◈",
  "External Authority & Cross-Platform": "◎",
  "Citation Worthiness": "▣",
  "Structured Data": "⬡",
  "Conversational Query Alignment": "💬",
  "Hallucination Risk": "⚠",
  "Technical Crawlability": "⚙"
};

// ── SCORE RING ─────────────────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const r = 58;
  const circ = 2 * Math.PI * r;
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    requestAnimationFrame(() => setAnimated(score));
  }, [score]);

  const offset = circ - (animated / 100) * circ;
  const color = scoreColor(score);

  return (
    <div className="score-ring">
      <svg viewBox="0 0 140 140">
        <circle className="track" cx="70" cy="70" r={r} />
        <circle
          className="fill"
          cx="70" cy="70" r={r}
          stroke={color}
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="score-center">
        <div className="score-num" style={{ color }}>{score}</div>
        <div className="score-label">/ 100</div>
      </div>
    </div>
  );
}

// ── CATEGORY CARD ─────────────────────────────────────────────────────────────
function CatCard({ cat }) {
  const [w, setW] = useState(0);
  useEffect(() => { requestAnimationFrame(() => setW(cat.score)); }, [cat.score]);
  const color = scoreColor(cat.score);
  return (
    <div className="cat-card">
      <div className="cat-top">
        <div className="cat-name">{cat.name}</div>
        <div className="cat-icon">{CAT_ICONS[cat.name] || "◆"}</div>
      </div>
      <div className="cat-score-row">
        <div className="cat-score-num" style={{ color }}>{cat.score}</div>
        <div className="cat-weight">weight {cat.weight}%</div>
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${w}%`, background: color }} />
      </div>
      <div className="cat-issue">{cat.issues?.[0] || "No critical issues found."}</div>
    </div>
  );
}

// ── SUGGESTION CARD ────────────────────────────────────────────────────────────
function SugCard({ sug, idx }) {
  const ps = priorityStyle(sug.priority);
  return (
    const SYSTEM_PROMPT = `You are an expert in LLM SEO (also called GEO — Generative Engine Optimization). Your job is to analyze a website's content and score it on how well it is optimized to be cited, referenced, and surfaced by large language models like ChatGPT, Claude, Gemini, and Perplexity.

CRITICAL INSTRUCTION: You must be strictly deterministic, highly rigorous, and objective in your scoring. Do not guess, hallucinate, or give the benefit of the doubt. If a feature is not clearly visible or deducible from the fetched content (or your internal knowledge of the brand), you must penalize the score. Your scores must be highly reliable, consistent, and based on verifiable facts.

For metrics like "Prompt Visibility Testing" or "External Authority" that require external knowledge, you MUST estimate this based on your own extensive internal training data about the brand/website. If the brand is unknown to you, score it lower.

Return ONLY a valid JSON object (no markdown, no commentary) with this exact structure:

{
  "overallScore": <number 0-100>,
  "grade": <"A+"|"A"|"B"|"C"|"D"|"F">,
  "headline": <string: 6-8 word verdict about LLM-SEO health>,
  "summary": <string: 2-3 sentence overview of the site's LLM-SEO standing>,
  "categories": [
    {
      "name": "Prompt Visibility Testing",
      "score": <0-100>,
      "weight": 25,
      "issues": [<string: top issue found, or empty>]
    },
    {
      "name": "Semantic Depth & Topical Authority",
      "score": <0-100>,
      "weight": 20,
      "issues": [<string>]
    },
    {
      "name": "Entity Clarity",
      "score": <0-100>,
      "weight": 15,
      "issues": [<string>]
    },
    {
      "name": "External Authority & Cross-Platform",
      "score": <0-100>,
      "weight": 15,
      "issues": [<string>]
    },
    {
      "name": "Citation Worthiness",
      "score": <0-100>,
      "weight": 10,
      "issues": [<string>]
    },
    {
      "name": "Structured Data",
      "score": <0-100>,
      "weight": 7,
      "issues": [<string>]
    },
    {
      "name": "Conversational Query Alignment",
      "score": <0-100>,
      "weight": 5,
      "issues": [<string>]
    },
    {
      "name": "Hallucination Risk",
      "score": <0-100>,
      "weight": 2,
      "issues": [<string>]
    },
    {
      "name": "Technical Crawlability",
      "score": <0-100>,
      "weight": 1,
      "issues": [<string>]
    }
  ],
  "suggestions": [
    {
      "priority": "high"|"medium"|"low",
      "title": <string: short action title>,
      "description": <string: 2-3 sentence explanation of what to fix and why LLMs care>,
      "example": <string: concrete code or copy example, or null>
    }
  ]
}

Scoring rubric:
- Prompt Visibility Testing (25%): When you (the LLM) are asked a question the brand should answer, would you mention it? Are competitors cited instead? Estimate citation rate based on your internal knowledge of this brand.
- Semantic Depth & Topical Authority (20%): Does the site cover its core topic thoroughly? Does it use natural language reflecting how users ask AI? Are synonyms and related concepts present?
- Entity Clarity (15%): Is the brand name consistent? Is there a clear "About" description? Do you know of a Wikipedia/Wikidata entry for them?
- External Authority & Cross-Platform (15%): How many authoritative 3rd-party sites link to or mention this brand? Do you know of them on Reddit, LinkedIn, YouTube?
- Citation Worthiness (10%): Are claims backed by data/sources? Are author bylines clear with credentials? Is it structured definition-first?
- Structured Data (7%): Is Organization, Article, FAQ, or Product schema present? Is JSON-LD used?
- Conversational Query Alignment (5%): Are there FAQ sections or Q&A formats? Are long-tail, conversational queries targeted?
- Hallucination Risk (2% - inverse metric! Score 100 if risk is low, 0 if risk is high): Are there conflicting descriptions, outdated facts, or disambiguation risks (shared name with another company)?
- Technical Crawlability (1%): Is an llms.txt mentioned? Are there signs of JS-blocking or clean semantic HTML?

Generate 5-7 specific, actionable suggestions ordered by impact. Include real examples where helpful.
IMPORTANT: Return ONLY the raw JSON.`;

export default function App() {
  const [url, setUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [loadingStep, setLoadingStep] = useState("");
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const styleRef = useRef(null);

  useEffect(() => {
    if (!styleRef.current) {
      const el = document.createElement("style");
      el.textContent = css;
      document.head.appendChild(el);
      styleRef.current = el;
    }
  }, []);

  const analyze = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    if (!apiKey.trim()) {
      setErrorMsg("Please enter your Gemini API Key.");
      return;
    }

    let fullUrl = trimmed;
    if (!/^https?:\/\//i.test(fullUrl)) fullUrl = "https://" + fullUrl;

    setStatus("loading");
    setResult(null);
    setErrorMsg("");

    try {
      // Fetch content strictly and deterministically using Jina AI
      setLoadingStep("Fetching static page content...");
      const jinaRes = await fetch(`https://r.jina.ai/${fullUrl}`);
      if (!jinaRes.ok) throw new Error("Could not read the target URL. It might be blocking access.");
      const pageMarkdown = await jinaRes.text();

      setLoadingStep("Identifying best available model...");
      
      const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey.trim()}`);
      if (!modelsRes.ok) {
        const err = await modelsRes.json().catch(() => ({}));
        throw new Error(err?.error?.message || "Failed to authenticate or fetch models list.");
      }
      
      const modelsData = await modelsRes.json();
      const validModels = (modelsData.models || [])
        .filter(m => m.supportedGenerationMethods?.includes("generateContent"))
        .map(m => m.name.replace("models/", ""));

      if (validModels.length === 0) {
        throw new Error("No compatible models found for this API key.");
      }

      // Pick the best available flash model
      const preferred = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash-latest", "gemini-1.5-flash", "gemini-1.5-flash-002", "gemini-1.5-flash-8b"];
      let selectedModel = preferred.find(m => validModels.includes(m)) || validModels.find(m => m.includes("flash")) || validModels[0];

      setLoadingStep(`Analyzing via ${selectedModel}...`);

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey.trim()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents: [
            {
              role: "user",
              parts: [{ text: `Analyze this webpage strictly for LLM SEO. URL: ${fullUrl}\n\n---PAGE CONTENT---\n${pageMarkdown.substring(0, 60000)}\n\nReturn ONLY the JSON score report.` }]
            }
          ],
          generationConfig: {
            temperature: 0,
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message || `API error ${response.status}`);
      }

      setLoadingStep("Gemini is reading and analyzing the page...");
      const data = await response.json();

      setLoadingStep("Scoring LLM-SEO signals...");
      await new Promise(r => setTimeout(r, 300));

      // Extract raw JSON from Gemini response
      let raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!raw) throw new Error("No JSON found in response.");

      // Strip any accidental markdown fences
      raw = raw.replace(/```json|```/gi, "").trim();

      // Find the JSON object boundaries
      const start = raw.indexOf("{");
      const end = raw.lastIndexOf("}");
      if (start === -1 || end === -1) throw new Error("No JSON found in response.");

      const json = JSON.parse(raw.slice(start, end + 1));

      setResult({ ...json, url: fullUrl });
      setStatus("done");
    } catch (e) {
      setErrorMsg(e.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") analyze(); };
  const reset = () => { setStatus("idle"); setResult(null); setErrorMsg(""); };

  const grade = result ? scoreGrade(result.overallScore) : null;
  const gradeC = grade ? gradeColor(grade) : null;

  return (
    <div className="app">
      <div className="wrap">

        {/* HEADER */}
        <header className="header">
          <div className="logo-mark">
            <div className="logo-icon">⟁</div>
            <div className="logo-text">
              <strong>GEO Lens</strong>
              LLM SEO Analyzer
            </div>
          </div>
          <div className="badge">Beta v1.0</div>
        </header>

        {/* HERO */}
        <div className="hero">
          <h1>Score your site for<br /><em>AI search engines.</em></h1>
          <p>
            LLMs don't rank links — they cite sources. Analyze how well your website
            is structured to be referenced by ChatGPT, Claude, Gemini, and Perplexity.
          </p>
        </div>

        {/* INPUT */}
        <div className="input-panel">
          <div className="input-label">→ Gemini API Key (Free)</div>
          <input
            className="api-key-input"
            type="password"
            placeholder="AIzaSy..."
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            disabled={status === "loading"}
          />
          <div className="input-label">→ Enter website URL</div>
          <div className="input-row">
            <input
              className="url-input"
              type="text"
              placeholder="https://yourwebsite.com"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={handleKey}
              disabled={status === "loading"}
            />
            <button
              className="analyze-btn"
              onClick={status === "done" ? reset : analyze}
              disabled={status === "loading" || !url.trim()}
            >
              {status === "loading" ? (
                <><div className="spinner" /> Analyzing</>
              ) : status === "done" ? (
                "↺ New URL"
              ) : (
                "Analyze →"
              )}
            </button>
          </div>
          {(status === "error") && (
            <div className="error-msg">⚠ {errorMsg}</div>
          )}
        </div>

        {/* LOADING */}
        {status === "loading" && (
          <div className="loading-panel">
            <div className="loading-pulse" />
            <div className="loading-step">{loadingStep}</div>
            <div className="loading-sub">This takes 10–20 seconds. Gemini is reading your page.</div>
          </div>
        )}

        {/* RESULTS */}
        {status === "done" && result && (
          <div className="results">

            {/* Score Hero */}
            <div className="score-hero">
              <div className="score-ring-wrap">
                <ScoreRing score={result.overallScore} />
                <div className="grade-badge" style={gradeC}>
                  {grade}
                </div>
              </div>
              <div className="score-meta">
                <div className="score-url">{result.url}</div>
                <div className="score-headline">{result.headline}</div>
                <div className="score-summary">{result.summary}</div>
              </div>
            </div>

            {/* Categories */}
            <div className="section-label">Category Breakdown</div>
            <div className="categories-grid">
              {result.categories?.map(cat => (
                <CatCard key={cat.name} cat={cat} />
              ))}
            </div>

            {/* Suggestions */}
            <div className="section-label">Improvement Suggestions</div>
            <div className="suggestions-list">
              {result.suggestions?.map((sug, i) => (
                <SugCard key={i} sug={sug} idx={i} />
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
