# CodeDost — آپ کا AI Coding Tutor 🇵🇰

<div align="center">

![CodeDost Banner](https://img.shields.io/badge/CodeDost-AI%20Coding%20Tutor-C8972B?style=for-the-badge&logo=code&logoColor=white)
![Language](https://img.shields.io/badge/Language-Roman%20Urdu%20%2B%20English-1A4731?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-2D9E6B?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Live%20%F0%9F%9F%A2-success?style=for-the-badge)

**Pakistan's first AI-powered code debugging tutor that explains errors in Roman Urdu — with desi analogies, auto-fixed code, and mistake pattern tracking.**

[🚀 Live Demo](#-live-demo) · [✨ Features](#-features) · [🛠️ Setup](#%EF%B8%8F-setup-5-minutes) · [🧪 Test Cases](#-test-cases) · [📸 Screenshots](#-screenshots)

</div>

---

## 🤔 What is CodeDost?

Every Pakistani CS student has asked *"Ye error kya hai?"* — and gotten no answer they actually understood.

**CodeDost** solves this. Paste your buggy code, get an explanation in Roman Urdu with a desi analogy, the complete fixed code with line-by-line annotations, and a recommended concept to study next.

No app to download. No account to create. No server to run. **Just open one HTML file in your browser.**

```
Student pastes buggy code  →  Groq AI analyses it  →  Roman Urdu explanation appears
                           →  Desi analogy helps it stick
                           →  Fixed code with annotations
                           →  "Aab yeh seekho" concept recommendation
```

---

## ✨ Features

### 🗣️ Roman Urdu Explanations
AI explains bugs the way Pakistani students actually talk — Roman Urdu mixed with English technical terms. Not *"The variable is undefined"* but *"Yaar, tum ne variable declare hi nahi kiya!"*

### 🫖 Desi Analogies
Every error comes with a relatable Pakistani everyday analogy — rickshaws, chai, biryani, darwaza — so the concept actually sticks in memory.

### 🔧 Auto-Fixed Code
Complete corrected code with line-by-line annotation of every change. Not just *what* changed — *why* it changed.

### 📊 Mistake Pattern Tracker
Session history stored locally. Tracks which error categories you hit most — turns a debugger into a personalised learning coach.

### 📚 Concept Roadmap
After every fix, recommends the exact concept to study with a direct YouTube search link.

### ⚡ Zero Setup
Single `.html` file. Open in Chrome. Works. No npm, no pip, no servers, no accounts.

### 🌐 3 Language Modes
- 🇵🇰 **Roman Urdu** — Urdu-heavy, maximum cultural relatability  
- ⚡ **Mixed** — 50/50 Urdu and English, natural dev conversation  
- 🇬🇧 **Full English** — For when you want clean, simple English  

### 💻 6 Programming Languages
Python · JavaScript · Java · C++ · HTML/CSS · SQL

### 🔑 3 Free AI Providers
| Provider | Model | Cost |
|----------|-------|------|
| ⚡ Groq | Llama 3.3 70B | 100% Free |
| 💎 Gemini | Gemini 1.5 Flash | 100% Free |
| 🔀 OpenRouter | Llama 3.1 8B | Free tier |

---

## 🛠️ Setup (5 minutes)

### Step 1 — Download
```bash
git clone https://github.com/yourusername/codedost.git
cd codedost
```
Or just download `codedost.html` directly.

### Step 2 — Get a Free API Key

**Recommended: Groq (fastest, 100% free)**

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up with Google (one click)
3. Click **API Keys** → **Create API Key**
4. Copy the key (starts with `gsk_`)

**Alternative: Google Gemini**

1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Sign in with Google
3. Click **Create API Key**
4. Copy the key (starts with `AIza`)

### Step 3 — Open & Configure
1. Open `codedost.html` in Chrome/Firefox/Edge
2. Click **"🔑 Free API Key"** button (top right)
3. Select your provider, paste your key, click Save
4. Start debugging!

> **Note:** Your API key is stored only in your browser's localStorage. It never leaves your device.

---

## 🧪 Test Cases

Ready-to-use buggy code snippets to test every feature. Copy-paste into CodeDost.

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

**Error Message:**
```
SyntaxError: '(' was never closed (line 5)
```

**Tests:** Error type badge · Beginner severity · Desi analogy · Fixed code
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

**Error Message:**
```
TypeError: can only concatenate str (not "int") to str
```

**Tests:** TypeError badge · str() fix · Desi analogy · Concept=Data Types
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

**Error Message:**
```
IndexError: list index out of range
```

**Tests:** IndexError · Off-by-one logic · Fix = range(5) · Concept=Array Indexing
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

**Error Message:**
```
TypeError: 'NoneType' object is not subscriptable
```

**Tests:** Logic error · Intermediate severity · Missing return · NoneType explanation
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

**Error Message:**
```
No crash — wrong result: expected 6800, got 7600
```

**Tests:** Logic error · JS scope (let vs var) · No crash detection · Concept=Variable Scope
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

**Error Message:**
```
TypeError: response.json is not a function
Student Name: undefined
```

**Tests:** Async bug · Advanced severity · Promise explanation · Fix = async/await
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

**Error Message:**
```
error: missing return statement
NullPointerException at grade.toUpperCase()
```

**Tests:** Java language switch · NPE · Missing return · Fix = return "F"
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

**Error Message:**
```
Segmentation fault (core dumped)
```

**Tests:** C++ · Memory bug · Fix = i<5 not i<=5 · Concept=Array Bounds
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

**Error Message:**
```
NameError: name 'squareroot' is not defined
NameError: name 'calculate_percentage' is not defined
```

**Tests:** Multiple NameErrors · Missing import · Undefined function · Multiple fix bullets
</details>

---

## 📸 Screenshots

### Main Interface
```
┌─────────────────────────────────────────────────────────────────┐
│  {} CodeDost                    🇵🇰 Roman Urdu    🔑 Free API Key │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Apna Code Yahan Paste Karo     │  💬 Kya Hua — Roman Urdu Mein │
│  ┌──────────────────────────┐   │  ┌───────────────────────────┐│
│  │ ● ● ●  script.py        │   │  │ Yaar, tum ne for loop ke  ││
│  │                          │   │  │ baad colon (:) dalna bhool││
│  │ def calculate(items):    │   │  │ gaya! Python ko har block ││
│  │     total = 0            │   │  │ ke baad colon chahiye...  ││
│  │     for item in items    │   │  └───────────────────────────┘│
│  │         total += ...     │   │                               │
│  └──────────────────────────┘   │  🫖 Desi Analogy              │
│                                  │  ┌───────────────────────────┐│
│  ⚠ SyntaxError: expected ':'    │  │ Samjho aise: jaise ghar ka││
│                                  │  │ darwaza khulne ke liye    ││
│  🚀 Explain Karo — Samjha Do!  │  │ handle zaroori hai...     ││
│                                  │  └───────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Project Structure

```
codedost/
│
├── codedost.html          # ← The entire app. One file. That's it.
├── README.md
└── LICENSE
```

### How It Works Internally

```
User Input (code + error)
        │
        ▼
buildSystemPrompt()        ← Crafts the Roman Urdu persona + JSON schema
        │
        ▼
fetch() → Groq/Gemini/OpenRouter API
        │
        ▼
JSON Response parsed:
  ├── error_type           → Badge (e.g. "SyntaxError")
  ├── severity             → Beginner / Intermediate / Advanced
  ├── plain_explanation    → Roman Urdu explanation
  ├── desi_analogy         → Desi everyday analogy
  ├── fixed_code           → Complete corrected code
  ├── fix_bullets          → Line-by-line what changed
  ├── concept_to_study     → Next learning concept
  └── mistake_category     → Stored in localStorage for patterns
        │
        ▼
renderOutput() → Displays all 6 output cards
        │
        ▼
saveToHistory() + updatePatterns() → localStorage
```

---

## 🎨 Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Vanilla HTML + CSS + JS | Zero build step, maximum compatibility |
| Code Editor | CodeMirror 6 (CDN) | Syntax highlighting, tab support |
| Syntax Highlighting | Prism.js (CDN) | Output code rendering |
| AI Provider | Groq / Gemini / OpenRouter | Free, fast, powerful LLMs |
| Storage | Browser localStorage | No backend needed |
| Fonts | JetBrains Mono + Syne (Google Fonts) | Developer aesthetic |

---

## 🔑 System Prompt Engineering

The core of CodeDost is its system prompt — carefully engineered to produce consistent, structured, culturally-aware Roman Urdu explanations.

**Key design decisions:**

- Forces JSON-only output (no markdown fences, no preamble)
- Embeds the Roman Urdu persona at the instruction level, not the example level
- Uses `breakLine` formatting to prevent text blending
- Instructs the model to use Pakistani-specific analogies (chai, rickshaw, biryani, darwaza)
- Error severity classification (beginner/intermediate/advanced) improves student self-awareness
- `mistake_category` field enables cross-session pattern tracking

The prompt switches between 3 modes (Roman Urdu / Mixed / English) by swapping the language instruction block — the rest of the schema stays identical.

---

## 🗺️ Roadmap

- [x] Core debugging + Roman Urdu explanation
- [x] 6 language support (Python, JS, Java, C++, HTML, SQL)
- [x] 3 AI provider support (Groq, Gemini, OpenRouter)
- [x] Session history + mistake pattern tracking
- [x] 3 language modes (Urdu / Mixed / English)
- [ ] Mobile-optimised PWA version
- [ ] Hindi mode (for Indian market)
- [ ] University admin dashboard (aggregate anonymised data)
- [ ] VSCode extension
- [ ] Backend + user accounts for cross-device history
- [ ] Batch code review (upload entire `.py` file)
- [ ] Voice input (speak your error, get Urdu audio response)

---

## 🤝 Contributing

Contributions are welcome — especially:

- **More desi analogies** for common error types
- **Better system prompt** for specific language quirks
- **UI improvements** for mobile
- **New language support** (PHP, TypeScript, R)

```bash
# Fork the repo
# Make your changes to codedost.html
# Test with the 9 test cases above
# Open a PR with a description of what you changed
```

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 👥 Team

Built by 2nd year CS students participating in the **LALF Business Ideas Competition 2025**.

| Role | Responsibilities |
|------|-----------------|
| Lead Developer | Frontend, system prompt engineering, API integration |
| Business Lead | Market research, business model, financial projections |

---

## 🙏 Acknowledgements

- [Groq](https://groq.com) — For the blazing-fast free LLM API
- [Google Gemini](https://aistudio.google.com) — For the free Gemini API
- [OpenRouter](https://openrouter.ai) — For the free model access
- [CodeMirror](https://codemirror.net) — For the code editor component
- [Prism.js](https://prismjs.com) — For syntax highlighting
- Every Pakistani CS student who ever asked *"yaar ye error kya hai?"*

---

<div align="center">

**Made with ❤️ for Pakistani CS students**

*"Error ho gaya? Koi baat nahi."*

⭐ Star this repo if CodeDost helped you fix a bug!

</div>
