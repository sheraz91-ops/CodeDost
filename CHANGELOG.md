# Changelog

All notable changes to CodeDost are documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] — 2025-03-20

### 🎉 Major Release — Multi-Provider Support

#### Added
- **Multi-provider API support** — Groq, Gemini, and OpenRouter now all supported from a single modal
- **Groq integration** (Llama 3.3 70B) — primary provider, 100% free, fastest response time
- **Gemini integration** (Gemini 1.5 Flash) — alternative provider, 100% free via Google AI Studio
- **OpenRouter integration** (Llama 3.1 8B free tier) — fallback provider
- **Provider selector tabs** in API key modal — switch providers without losing saved keys
- **Per-provider key storage** — all three keys saved independently in localStorage
- **Provider badge** shown in success toast after each analysis

#### Changed
- Removed dependency on OpenAI API (was paid / credit-limited)
- Updated footer tagline to reflect Groq + Llama 3 stack
- Updated hero tagline: "100% Free" now featured prominently
- API button label changed from "🔑 API Key" to "🔑 Free API Key"

#### Fixed
- API key validation now checks per-provider prefix (`gsk_` for Groq, `AIza` for Gemini, `sk-or-` for OpenRouter)
- Modal auto-focuses the correct input field when switching provider tabs

---

## [1.0.0] — 2025-03-15

### 🚀 Initial Release — MVP

#### Added
- **Core feature:** AI-powered code error explanation in Roman Urdu
- **3 language modes:** Roman Urdu (70% Urdu), Mixed (50/50), Full English
- **6 programming languages:** Python, JavaScript, Java, C++, HTML/CSS, SQL
- **6 output cards:**
  - 🔴 Error type + severity badge (Beginner / Intermediate / Advanced)
  - 💬 Plain explanation in Roman Urdu
  - 🫖 Desi analogy (chai, rickshaw, biryani, darwaza metaphors)
  - 🔧 Auto-fixed code with Prism.js syntax highlighting
  - 📋 Line-by-line fix explanation (bullet points)
  - 📚 Concept to study + YouTube search link
- **9 quick example chips** — one-click load for common error types
- **Session history** — last 20 queries saved in localStorage, click to reload
- **Mistake pattern tracker** — counts error categories, shows bar chart
- **3 info tabs** — Session History, Common Mistakes, Pro Tips
- **Copy button** on fixed code block with "Copied ✓" feedback
- **Ctrl+Enter** keyboard shortcut to submit
- **Tab key** in code editor inserts 2 spaces instead of jumping focus
- **Toast notifications** for success, error, and copy events
- **API key modal** with instructions and direct link to OpenAI key page
- **OpenAI GPT-4o** as the initial AI provider
- **JetBrains Mono + Syne** typography
- **Dark terminal theme** — forest green + gold accent palette
- **Zero backend** — single `.html` file, no server required

---

## [Unreleased] — Planned

### Coming in v2.1.0
- [ ] Mobile-optimised layout (responsive below 768px)
- [ ] PWA manifest (installable as app on Android)
- [ ] Export session history as PDF
- [ ] Hindi language mode

### Coming in v3.0.0
- [ ] Optional backend (Node.js/Flask) for secure server-side API keys
- [ ] User accounts with cross-device history sync
- [ ] University admin dashboard (anonymised aggregate data)
- [ ] VSCode extension
- [ ] Batch code review (upload entire `.py`/`.js` file)

---

## Version History Summary

| Version | Date | Highlight |
|---------|------|-----------|
| 2.0.0 | 2025-03-20 | Multi-provider (Groq, Gemini, OpenRouter) — 100% free |
| 1.0.0 | 2025-03-15 | Initial MVP with OpenAI GPT-4o |
