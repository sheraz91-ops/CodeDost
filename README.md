# CodeDost — Pakistan's First AI Coding Tutor 🇵🇰

<div align="center">

![CodeDost](https://img.shields.io/badge/CodeDost-AI%20Coding%20Tutor-C8972B?style=for-the-badge&logo=code&logoColor=white)
![Language](https://img.shields.io/badge/Language-Roman%20Urdu%20%2B%20English-1A4731?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-2D9E6B?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Live%20%F0%9F%9F%A2-success?style=for-the-badge)
![PWA](https://img.shields.io/badge/Android-PWA%20Ready-2D9E6B?style=for-the-badge&logo=android&logoColor=white)

**Pakistan's first AI-powered code debugging tutor that explains programming errors in Roman Urdu — with local Pakistani analogies, auto-fixed code, in-browser code execution, and detailed mistake pattern tracking.**

[🚀 Live App](https://code-dost.vercel.app) · [✨ Features](#-features) · [🛠️ Setup](#%EF%B8%8F-setup) · [🧪 Test Cases](#-test-cases) · [💳 Pro Plan](https://sherazramzan.gumroad.com/l/cfevjo)

</div>

---

## What is CodeDost?

The name "CodeDost" combines two words — "Code" (programming code) and "Dost" (the Urdu word for friend). Together the name means "your coding friend."

Every Pakistani computer science student has experienced this exact situation: an error appears on screen, the student searches Google, finds a Stack Overflow answer written entirely in English, copies the fix, applies it, the code runs, and the student has absolutely no idea why it worked. The following week the same error appears again.

The problem is not a lack of intelligence. The problem is language. Pakistani students think in Roman Urdu — Urdu written using English letters, which is how everyone in Pakistan texts, chats, and has conversations about technical topics. No existing tool speaks this language.

CodeDost solves this. Paste your broken code, receive a Roman Urdu explanation with a relatable local analogy, get the complete fixed code with line-by-line annotation explaining every change, run the corrected code directly in your browser, and receive a recommendation for what concept to study next so the same error never appears again.

No download. No account. No server. Open the website and start learning.

```
Student pastes broken code
        ↓
Groq AI (Llama 3.3 70B) analyses the code
        ↓
Roman Urdu explanation — "Yaar, tumhara loop index out of range ho gaya..."
        ↓
Local analogy makes the concept stick — chai, rickshaw, biryani comparisons
        ↓
Complete fixed code with syntax highlighting
        ↓
Line-by-line explanation of every change
        ↓
Concept recommendation — "Aab yeh seekho" (Now learn this)
        ↓
Error saved to pattern tracker — never make the same mistake twice
```

---

## ✨ Features

### 🗣️ Roman Urdu Explanations — 3 Modes

The AI explains bugs the way Pakistani developers actually talk to each other. Instead of "The variable is undefined," CodeDost says "Yaar, tum ne variable declare hi nahi kiya!" (Friend, you never even declared the variable!).

Three language modes are available:

- **Roman Urdu** — 70% Urdu words with 30% English technical terms. Example: "Yaar, is loop mein colon missing hai" (Friend, this loop is missing a colon). This is how Pakistani CS students naturally communicate.
- **Mixed** — 50/50 balance of Urdu and English, switching naturally between both languages the way Pakistani developers actually speak in real conversations.
- **Full English** — Clean, simple English with an encouraging tone.

Your selected mode is saved automatically and restored the next time you open the app.

### 🫖 Local Pakistani Analogies

Every error explanation includes a relatable everyday analogy drawn from Pakistani life — rickshaws, chai (tea), biryani, darwaza (door), number plates, dukaan (shop). These are not decorative additions. They are the core learning mechanism. A concept explained through something you already understand stays in memory far longer than an abstract technical definition.

Example: explaining why a function must have a return statement is compared to ordering chai at a tea stall — you placed the order, the stall owner made the chai, but never actually handed it to you. The function ran but never returned a value.

### 🔧 Auto-Fixed Code with Syntax Highlighting

The complete corrected version of your code is provided — not just the changed lines. Every fix is explained. Syntax highlighting is applied using Prism.js for all six supported languages.

Four actions are available on the fixed code block:

- **Copy** — copies the fixed code to your clipboard with a "Copied ✓" confirmation
- **Download** — saves the fixed file to your computer with the correct file extension (`.py` for Python, `.js` for JavaScript, `.java` for Java, `.cpp` for C++, etc.)
- **Show Diff** — reveals a red and green line-by-line comparison between your original broken code and the fixed version, powered by the jsdiff library
- **Run Code** — executes the fixed Python code directly in your browser

### ▶ In-Browser Code Execution

Fixed Python code can be executed directly inside the browser using Pyodide — a complete Python interpreter compiled to WebAssembly. This is not a simulation. It is the actual CPython runtime running inside your browser.

Both standard output (what your program prints) and standard error (error messages) are captured and displayed in a dedicated output card. No terminal. No Python installation. No server. The code runs entirely on your device.

### ⟺ Diff View

The Show Diff button reveals exactly what changed between your original code and the fixed version. Changed lines appear in red (removed) and green (added), identical to the diff view in GitHub pull requests. This helps you understand the precise change rather than reading through the entire file.

### 📊 Advanced Pattern Analytics

CodeDost tracks every error you make and builds a personal learning dashboard:

- **Error type tracking** — counts encounters with each category: syntax errors, type errors, index errors, scope errors, async errors, null reference errors, logic errors, import errors
- **Frequency counter** — shows how many times each specific error pattern has occurred
- **Last seen timestamp** — records when you most recently made each type of error
- **Date filter** — filter your pattern history by a specific date
- **Duplicate detection** — if the same error in the same language appears again, the frequency count increases by one rather than creating a duplicate entry
- **Export CSV** — download your complete error pattern history as a spreadsheet file openable in Microsoft Excel or Google Sheets

### 📋 Session History

The last 20 code analysis sessions are saved locally in your browser. Click any history entry to instantly restore the original code, the error message, and the complete AI explanation. A Clear History button removes all saved sessions after confirmation.

### 🌙 Dark and Light Theme

A theme toggle switches between dark mode (dark background, easier on the eyes at night) and light mode (white background, easier in daylight). Your preference is saved automatically and applied on the next visit before the page finishes loading, preventing any flash of the wrong theme.

### 📱 Android App — No Play Store Required

CodeDost is a Progressive Web App (PWA). When you open the website in Chrome on an Android phone, the browser displays a popup asking if you want to add it to your home screen. Tapping the option installs CodeDost as a standalone app with its own icon — it opens fullscreen without the browser address bar, exactly like a native app downloaded from the Play Store.

No Play Store approval process. No APK file. No installation fees. Session history and pattern analytics work offline because they are stored in the browser's local storage on your device.

### 🔑 Three Free AI Providers

| Provider | Model | Speed | Cost |
|----------|-------|-------|------|
| ⚡ Groq | Llama 3.3 70B Versatile | Fastest (~1–2 seconds) | 100% Free |
| 💎 Google Gemini | Gemini 1.5 Flash | Fast | 100% Free |
| 🔀 OpenRouter | Llama 3.1 8B Instruct | Moderate | Free tier |

All three providers are completely free. No credit card is required for any of them. Groq is recommended because it uses specialised LPU (Language Processing Unit) hardware that makes it significantly faster than standard GPU-based providers.

Your API key is stored only in your browser's local storage. It is never sent to any server other than the AI provider you have selected.

### ⌨️ Keyboard Shortcuts and Accessibility

- **Ctrl + Enter** — submits your code for analysis from anywhere on the page
- **Escape** — closes the API key modal
- **Tab in the code editor** — inserts two spaces instead of moving keyboard focus away
- ARIA labels on all interactive elements for screen reader compatibility
- `aria-live` on the output panel so screen readers announce new results as they appear
- `role="status"` on toast notifications for screen reader announcement

### 💻 6 Programming Languages

Python · JavaScript · Java · C++ · HTML/CSS · SQL

---

## 🛠️ Setup

### Step 1 — Clone or Visit

```bash
git clone https://github.com/sheraz91-ops/CodeDost.git
cd CodeDost
```

Or visit [code-dost.vercel.app](https://code-dost.vercel.app) directly — no download required.

### Step 2 — Get a Free API Key

**Recommended: Groq (fastest, 100% free, no credit card)**

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up with your Google account
3. Click **API Keys** in the left sidebar → **Create API Key**
4. Copy the key — it starts with `gsk_`

**Alternative: Google Gemini (also 100% free)**

1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Sign in with your Google account → **Create API Key**
3. Copy the key — it starts with `AIza`

**Alternative: OpenRouter (free tier)**

1. Go to [openrouter.ai/keys](https://openrouter.ai/keys)
2. Create a free account → **Create Key**
3. Copy the key — it starts with `sk-or-`

### Step 3 — Configure and Start

1. Open [code-dost.vercel.app](https://code-dost.vercel.app) in Chrome
2. Click the **Free API Key** button in the top right corner
3. Select your provider tab and paste your key
4. Click **Save**
5. Paste any broken code and press **Ctrl + Enter**

> Your API key is stored exclusively in your browser's local storage. It never leaves your device except when making a direct request to your chosen AI provider.

---

## 🧪 Test Cases

Nine ready-to-use broken code examples to test every feature.

<details>
<summary><b>Test 1 — Python SyntaxError (Beginner)</b></summary>

**Code:**
```python
def greet_student(name):
    print("Assalam o Alaikum " + name)
    print("Welcome to CS class")

greet_student("Ahmed"
greet_student("Sara")
```

**Error:**
```
SyntaxError: '(' was never closed (line 5)
```
</details>

<details>
<summary><b>Test 2 — Python TypeError (Beginner)</b></summary>

**Code:**
```python
student_name = "Ali Khan"
student_age = 20
student_marks = 85

report = "Name: " + student_name + ", Age: " + student_age + ", Marks: " + student_marks
print(report)
```

**Error:**
```
TypeError: can only concatenate str (not "int") to str
```
</details>

<details>
<summary><b>Test 3 — Python IndexError (Beginner)</b></summary>

**Code:**
```python
top_students = ["Ahmed", "Sara", "Bilal", "Fatima", "Usman"]

print("Top 5 students:")
for i in range(6):
    print(f"{i+1}. {top_students[i]}")
```

**Error:**
```
IndexError: list index out of range
```
</details>

<details>
<summary><b>Test 4 — Python NoneType Bug (Intermediate)</b></summary>

**Code:**
```python
def find_passing_student(students, min_marks):
    for student in students:
        if student["marks"] >= min_marks:
            return student

class_data = [
    {"name": "Ahmed", "marks": 45},
    {"name": "Sara",  "marks": 38},
    {"name": "Bilal", "marks": 52}
]

result = find_passing_student(class_data, 60)
print("Topper:", result["name"])
```

**Error:**
```
TypeError: 'NoneType' object is not subscriptable
```
</details>

<details>
<summary><b>Test 5 — JavaScript Scope Bug (Intermediate)</b></summary>

**Code:**
```javascript
function calculateFee(amount) {
    let discount = 0.05;

    if (amount > 5000) {
        let discount = 0.15;
        console.log("Big discount applied:", discount);
    }

    let finalAmount = amount - (amount * discount);
    return finalAmount;
}

console.log(calculateFee(8000));
// Expected: 6800  |  Got: 7600
```

**Error:**
```
No crash — wrong result: expected 6800, got 7600
```
</details>

<details>
<summary><b>Test 6 — JavaScript Async Bug (Advanced)</b></summary>

**Code:**
```javascript
function getStudentData(roll_no) {
    const response = fetch(`https://api.university.edu/student/${roll_no}`);
    const student = response.json();

    console.log("Student Name:", student.name);
    console.log("CGPA:", student.cgpa);
    return student;
}

getStudentData(2021001);
```

**Error:**
```
TypeError: response.json is not a function
Student Name: undefined
```
</details>

<details>
<summary><b>Test 7 — Java Missing Return (Intermediate)</b></summary>

**Code:**
```java
public class StudentPortal {

    static String getGrade(int marks) {
        if (marks >= 80) return "A";
        if (marks >= 60) return "B";
        if (marks >= 40) return "C";
        // missing return for fail case
    }

    public static void main(String[] args) {
        int[] scores = {85, 72, 35, 91};
        for (int score : scores) {
            String grade = getGrade(score);
            System.out.println("Grade: " + grade.toUpperCase());
        }
    }
}
```

**Error:**
```
error: missing return statement
NullPointerException at grade.toUpperCase()
```
</details>

<details>
<summary><b>Test 8 — C++ Array Out of Bounds (Beginner)</b></summary>

**Code:**
```cpp
#include <iostream>
using namespace std;

int main() {
    int marks[5] = {75, 88, 92, 65, 70};
    int total = 0;

    for (int i = 0; i <= 5; i++) {
        total += marks[i];
    }

    float average = total / 5;
    cout << "Class Average: " << average << endl;
    return 0;
}
```

**Error:**
```
Segmentation fault (core dumped)
```
</details>

<details>
<summary><b>Test 9 — Python Multiple NameErrors (Beginner)</b></summary>

**Code:**
```python
def calculate_gpa(marks_list):
    total = sum(marks_list)
    average = total / len(marks_list)
    gpa = squareroot(average / 25)
    return round(gpa, 2)

subjects = [75, 82, 90, 68, 77]
print("Your GPA:", calculate_gpa(subjects))
print("Percentage:", calculate_percentage(subjects))
```

**Error:**
```
NameError: name 'squareroot' is not defined
NameError: name 'calculate_percentage' is not defined
```
</details>

---

## 🏗️ Project Structure

```
CodeDost/
│
├── codedost.html      ← Main application interface
├── codedost.css       ← All styles including dark/light theme variables
├── codedost.js        ← All application logic
├── manifest.json      ← PWA configuration for Android installation
├── index.html         ← Public landing page
├── README.md          ← This file
├── LICENSE            ← MIT license
├── SECURITY.md        ← API key safety and vulnerability disclosure
├── CONTRIBUTING.md    ← Guide for contributors
└── CHANGELOG.md       ← Version history
```

### How It Works Internally

```
User pastes code + error message
        ↓
buildSystemPrompt()
  → Selects language mode (Roman Urdu / Mixed / English)
  → Builds JSON schema with all required output fields
  → Adds Pakistani analogy instruction
        ↓
fetch() with 30-second AbortController timeout
  → Groq API  OR  Gemini API  OR  OpenRouter API
        ↓
safeJSONParse()
  → Strips markdown fences if present
  → Falls back to regex extraction if normal parse fails
        ↓
validateResult()
  → Checks all required fields exist
  → Verifies severity is one of: beginner, intermediate, advanced
  → Confirms fix_bullets array has minimum 2 items
        ↓
renderOutput()
  → Error type badge + severity label
  → Roman Urdu explanation
  → Local Pakistani analogy
  → Syntax-highlighted fixed code (Prism.js)
  → Diff view (jsdiff)
  → Run Code button (Pyodide)
  → Line-by-line fix bullets
  → Concept recommendation with YouTube link
        ↓
saveToHistory()     → localStorage — last 20 sessions
updatePatterns()    → localStorage — error categories + detailed entries
```

---

## 🎨 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Vanilla HTML + CSS + JS | Zero build step, zero framework overhead |
| Syntax Highlighting | Prism.js | Output code rendering |
| Code Diff | jsdiff | Line-by-line comparison |
| Code Execution | Pyodide | Full Python runtime in WebAssembly |
| AI — Primary | Groq (Llama 3.3 70B) | Fastest responses via LPU hardware |
| AI — Secondary | Google Gemini 1.5 Flash | Free backup provider |
| AI — Tertiary | OpenRouter | Multi-model free tier fallback |
| Storage | Browser localStorage | No backend, no database, no server |
| Hosting | Vercel | Free hosting with GitHub auto-deploy |
| Android | PWA + manifest.json | Install from browser, no Play Store |
| Fonts | JetBrains Mono + Syne | Code and UI typography |
| Payments | Gumroad | Pro plan checkout at $0.99/month |

---

## 🔑 System Prompt Engineering

The system prompt is the technical core of CodeDost. Key design decisions:

- **JSON-only output** — forces the model to respond with a raw JSON object and nothing else, making parsing reliable
- **Language mode injection** — the Roman Urdu instruction is embedded at the system prompt level, not as a user message, giving it higher priority
- **Persona definition** — the model behaves like a warm, encouraging older sibling — never condescending, never robotic
- **Pakistani analogy instruction** — the prompt explicitly names the categories of analogies to use: chai, rickshaw, biryani, darwaza (door), dukaan (shop)
- **Severity classification** — each error is classified as beginner, intermediate, or advanced
- **Fallback parsing** — `safeJSONParse()` handles cases where the model wraps JSON in markdown fences, with regex fallback
- **Response validation** — `validateResult()` verifies the parsed object before anything is rendered on screen

---

## 💳 Pricing

| Tier | Price | What You Get |
|------|-------|-------------|
| Free | $0 forever | 20 explanations/month, basic tracking, all 6 languages, all 3 modes |
| Pro | $0.99 / month | Unlimited explanations, full CSV analytics, priority speed |
| Institution | $150 / semester | Unlimited students, admin dashboard, university branding |

Pro checkout: [sherazramzan.gumroad.com/l/cfevjo](https://sherazramzan.gumroad.com/l/cfevjo)

---

## 🗺️ Roadmap

**Completed:**
- [x] Roman Urdu explanation engine with 3 language modes
- [x] 6 programming language support
- [x] 3 free AI providers with per-provider key storage
- [x] In-browser Python execution via Pyodide
- [x] Diff view between original and fixed code
- [x] Download fixed code with correct extension
- [x] Dark and light theme with persistence
- [x] Advanced pattern analytics with date filter and CSV export
- [x] Session history with restore functionality
- [x] Android PWA with offline support
- [x] Pro plan live on Gumroad
- [x] Public landing page on Vercel

**Planned:**
- [ ] Hindi language mode for Indian market
- [ ] University admin dashboard with anonymised aggregate analytics
- [ ] VSCode extension
- [ ] Backend and user accounts for cross-device history sync
- [ ] Batch code review — upload an entire `.py` or `.js` file
- [ ] Voice input — speak your error, receive audio explanation

---

## 🤝 Contributing

Contributions are welcome. The most impactful areas:

- **New local analogies** for common error types
- **System prompt improvements** for Java, C++, or SQL quirks
- **Mobile UI refinements**
- **New programming language support** — PHP, TypeScript, Rust, R

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

---

## 📄 License

MIT License — free to use, modify, and distribute. See [LICENSE](LICENSE) for full terms.

---

## 👥 Team

Built by 2nd year Computer Science students for the **LALF Business Ideas Competition 2025**.

| Role | Responsibilities |
|------|-----------------|
| Lead Developer | Frontend, system prompt engineering, API integration, PWA |
| Business Lead | Market research, business model, financial projections |

---

## 🙏 Acknowledgements

- [Groq](https://groq.com) — Fastest free LLM API
- [Google Gemini](https://aistudio.google.com) — Free Gemini 1.5 Flash API
- [OpenRouter](https://openrouter.ai) — Multi-model free tier access
- [Pyodide](https://pyodide.org) — Python in WebAssembly
- [jsdiff](https://github.com/kpdecker/jsdiff) — Diff engine
- [Prism.js](https://prismjs.com) — Syntax highlighting
- [Vercel](https://vercel.com) — Free hosting
- [Gumroad](https://gumroad.com) — Payment infrastructure
- Every Pakistani CS student who ever stared at an error and had no idea what it meant

---

<div align="center">

**Made for Pakistani CS students**

*"Error ho gaya? Koi baat nahi."*
(Got an error? No problem.)

⭐ Star this repository if CodeDost helped you understand a bug

[code-dost.vercel.app](https://code-dost.vercel.app) · [GitHub](https://github.com/sheraz91-ops/CodeDost) · [Pro Plan](https://sherazramzan.gumroad.com/l/cfevjo)

</div>
