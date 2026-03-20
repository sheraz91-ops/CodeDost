# Security Policy

## API Key Safety

CodeDost handles third-party API keys (Groq, Gemini, OpenRouter).
Here is exactly how they are stored and why they are safe:

| Question | Answer |
|----------|--------|
| Where is the key stored? | Browser `localStorage` only |
| Is it sent to any server? | No — only to the chosen AI provider directly |
| Is it included in the HTML source? | No |
| Can CodeDost contributors see your key? | No |
| Does the key leave your device? | Only to the API provider you chose |

### The API call flow

```
Your Browser → [your API key] → Groq / Gemini / OpenRouter
                                        ↓
Your Browser ← AI explanation  ←───────┘

No intermediate server. No logging. No storage outside your browser.
```

### Best practices for users

1. **Set a usage limit** on your API key dashboard (Groq, Google AI Studio, OpenRouter all support this). Recommended: $5 limit for personal use.
2. **Never paste your key into the URL bar** or share screenshots that show the key input field.
3. **Rotate your key** if you ever suspect it was exposed. All three providers allow instant key deletion and regeneration.
4. **Use Groq or Gemini** — both are free with no billing attached, so even if a key is leaked, the financial risk is zero.

---

## Reporting a Vulnerability

If you discover a security vulnerability in CodeDost:

1. **Do not open a public GitHub issue.**
2. Email us at: `[your-email@university.edu.pk]`
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if you have one)

We will respond within **48 hours** and aim to release a fix within **7 days** for critical issues.

We follow responsible disclosure — we will credit you in the fix commit unless you prefer to remain anonymous.

---

## Supported Versions

| Version | Supported |
|---------|-----------|
| v2.0 (current) | ✅ Yes |
| v1.0 | ❌ No longer maintained |

---

## Known Limitations

- **API keys in frontend:** For a competition demo, the key lives in `localStorage`. In a production deployment, keys should be server-side. See the [Roadmap](README.md#roadmap) for planned backend support.
- **localStorage is not encrypted:** Any person with physical access to your unlocked browser can read `localStorage`. Do not use CodeDost on shared or public computers without clearing localStorage afterwards (`localStorage.clear()` in the browser console).
