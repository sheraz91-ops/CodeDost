# Contributing to CodeDost

First off — shukria for wanting to contribute! 🙏

CodeDost is built for Pakistani CS students, and the best contributions come from people who *are* or *have been* Pakistani CS students. You know the problems better than anyone.

---

## What We Need Most

### 🫖 Better Desi Analogies
The desi analogy feature is what makes CodeDost different from every other debugger. If you have a better analogy for a common error — open a PR. No code required, just edit the system prompt.

**Example PR:** *"The current NullPointerException analogy uses a door metaphor. I replaced it with a dhaba order that was never placed — clearer for students."*

### 🐛 Bug Reports
Found something broken? Open an issue with:
- Which browser you were using
- Which AI provider (Groq / Gemini / OpenRouter)
- The exact code you pasted
- What you expected vs what happened
- A screenshot if possible

### 💬 Better Roman Urdu
If the Roman Urdu in the explanations sounds unnatural or uses the wrong register for a CS student audience — tell us. Open an issue or PR.

### 🌐 New Language Support
Want to add PHP, TypeScript, Rust, or another language? See the [Adding a Language](#adding-a-language) section below.

### 📱 Mobile UI Fixes
The app is primarily desktop. Mobile improvements are very welcome.

---

## Getting Started

```bash
# 1. Fork the repo on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/codedost.git
cd codedost

# 3. Open in browser
open codedost.html   # macOS
# or just double-click the file on Windows
```

Everything is in one file — `codedost.html`. No build step, no npm install.

---

## Making Changes

### Changing the System Prompt
The system prompt is inside the `buildSystemPrompt()` function in `codedost.html`.

This is the most impactful place to contribute. The prompt controls:
- The language/tone of the Roman Urdu explanation
- The structure of the JSON response
- The quality of the desi analogy
- The concept recommendation logic

When editing the prompt:
1. Test with all 9 test cases in the README
2. Check all 3 language modes (Roman Urdu / Mixed / English)
3. Make sure the JSON output still parses correctly

### Adding a Language

1. Add your language to the `lang-picker` dropdown in the HTML:
```html
<option value="rust">Rust</option>
```

2. Add the file extension to `LANG_TAGS`:
```javascript
const LANG_TAGS = {
  ...
  rust: 'main.rs',
};
```

3. Add Prism.js support (if available):
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-rust.min.js"></script>
```

4. Add at least one test case for the new language in the `EXAMPLES` object.

### Changing the UI
- The app uses vanilla CSS with CSS variables — no framework
- All CSS is in the `<style>` block at the top of `codedost.html`
- Dark theme colors are defined in `:root` — change there for global effect
- The layout is a CSS grid: left panel (input) + right panel (output)

---

## Testing Your Changes

Before submitting a PR, test these manually:

- [ ] All 9 quick example chips load correctly
- [ ] Roman Urdu mode gives Urdu-dominant response
- [ ] Mixed mode gives balanced response
- [ ] English mode gives English-only response
- [ ] Fixed code renders with syntax highlighting
- [ ] Copy button copies correctly
- [ ] Session history saves and reloads
- [ ] Mistake patterns update after each query
- [ ] API modal saves key correctly for all 3 providers
- [ ] Ctrl+Enter submits the form
- [ ] Tab key in code editor inserts spaces (not jumps focus)

---

## Pull Request Guidelines

- **One PR per change** — don't bundle unrelated fixes
- **Describe what you changed and why** in the PR description
- **Test cases in the PR** — show which of the 9 test cases you tested
- **Keep it in one file** — don't split into separate CSS/JS files unless there is a very strong reason

### PR Title Format
```
fix: [short description]        # for bug fixes
feat: [short description]       # for new features
prompt: [short description]     # for system prompt changes
docs: [short description]       # for README/docs only changes
style: [short description]      # for UI-only changes
```

---

## Code Style

Since this is a single HTML file, keep it readable:

- Comments above each major section (`// ═══ SECTION NAME ═══`)
- Consistent 2-space indentation in JS
- CSS variables for all colors — no hardcoded hex in CSS rules
- Function names in `camelCase`
- Constants in `UPPER_SNAKE_CASE`

---

## First-Time Contributors

Never contributed to open source before? This is a great place to start.

Issues labelled `good first issue` are small, well-defined changes that don't require deep knowledge of the codebase. Look for them in the Issues tab.

---

## Questions?

Open a GitHub Discussion or reach out via the Issues tab. We read everything.

**Shukria again for helping make CodeDost better for Pakistani students. 🇵🇰**
