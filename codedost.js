const BACKEND_URL = 'https://codedost-backend-production.up.railway.app';

async function checkQuota() {
  try {
    const r = await fetch(`${BACKEND_URL}/api/analyze/quota`, {
      credentials: 'include'
    });
    if (!r.ok) return { allowed: true }; // if backend down, allow anyway
    return await r.json();
  } catch {
    return { allowed: true }; // if backend unreachable, allow anyway
  }
}

async function incrementQuota() {
  try {
    await fetch(`${BACKEND_URL}/api/analyze/increment`, {
      method: 'POST',
      credentials: 'include'
    });
  } catch (e) {
    console.log('Increment quota failed (backend may be down):', e.message);
  }
}

async function handleLoginNew() {
  const email = document.getElementById('auth-email-login').value.trim();
  const password = document.getElementById('auth-pass-login').value;
  
  if (!email || !password) {
    showAuthError('Email and password required.');
    return;
  }
  
  const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  });
  
  const data = await res.json();
  
  if (!res.ok || !data.success) {
    showAuthError(data.message || 'Login failed.');
    return;
  }
  
  authToken = data.accessToken || data.token;
  currentUser = data.user;
  localStorage.setItem('cd_auth_token', authToken);
  localStorage.setItem('cd_user', JSON.stringify(currentUser));
  
  showAuthSuccess(`Welcome ${currentUser.name}! 🎉`);
  updateAuthUI();
  loadQuotaFromBackend();
  
  setTimeout(() => {
    const modal = document.getElementById('auth-modal-overlay');
    if (modal) modal.style.display = 'none';
  }, 1500);
}

async function handleRegisterNew() {
  const name = document.getElementById('auth-name-register').value.trim();
  const email = document.getElementById('auth-email-register').value.trim();
  const password = document.getElementById('auth-pass-register').value;
  const university = document.getElementById('auth-university-register').value.trim();
  
  if (!name || !email || !password) {
    showAuthError('Name, email, and password required.');
    return;
  }
  
  if (password.length < 8) {
    showAuthError('Password must be at least 8 characters.');
    return;
  }
  console.log(({ name, email, password, university }))
  const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, email, password, university })
  });
  console.log(res)
  const data = await res.json();
  console.log(data)
  
  if (!res.ok || !data.success) {
    showAuthError(data.message || 'Registration failed.');
    return;
  }
  
  authToken = data.accessToken || data.token;
  currentUser = data.user;
  localStorage.setItem('cd_auth_token', authToken);
  localStorage.setItem('cd_user', JSON.stringify(currentUser));
  
  showAuthSuccess('✅ Account created! Check email for verification link.');
  updateAuthUI();
  
  // Clear form
  const nameInput = document.getElementById('auth-name-register');
  const emailInput = document.getElementById('auth-email-register');
  const passInput = document.getElementById('auth-pass-register');
  const univInput = document.getElementById('auth-university-register');
  if (nameInput) nameInput.value = '';
  if (emailInput) emailInput.value = '';
  if (passInput) passInput.value = '';
  if (univInput) univInput.value = '';
  
  setTimeout(() => {
    const modal = document.getElementById('auth-modal-overlay');
    if (modal) modal.style.display = 'none';
  }, 2500);
}

async function handleForgotPassword() {
  const email = document.getElementById('auth-email-forgot').value.trim();
  
  if (!email) {
    showAuthError('Please enter your email address.');
    return;
  }
  
  const res = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email })
  });
  
  const data = await res.json();
  
  if (!data.success) {
    showAuthError(data.message || 'Failed to send reset link.');
    return;
  }
  
  showAuthSuccess('✅ Reset link sent! Check your email inbox.');
  const emailForgot = document.getElementById('auth-email-forgot');
  if (emailForgot) emailForgot.value = '';
  
  setTimeout(() => {
    const modal = document.getElementById('auth-modal-overlay');
    if (modal) modal.style.display = 'none';
  }, 2000);
}

async function handleResetPassword() {
  const newPassword = document.getElementById('auth-pass-reset-new').value;
  const confirmPassword = document.getElementById('auth-pass-reset-confirm').value;
  
  if (!newPassword || !confirmPassword) {
    showAuthError('Please enter both passwords.');
    return;
  }
  
  if (newPassword.length < 8) {
    showAuthError('Password must be at least 8 characters.');
    return;
  }
  
  if (newPassword !== confirmPassword) {
    showAuthError('Passwords do not match.');
    return;
  }
  
  // Get token from URL if available
  const params = new URLSearchParams(window.location.search);
  const token = params.get('reset_token');
  
  if (!token) {
    showAuthError('Invalid reset link. Please request a new one.');
    return;
  }
  
  const res = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ token, newPassword, confirmPassword })
  });
  
  const data = await res.json();
  
  if (!data.success) {
    showAuthError(data.message || 'Password reset failed.');
    return;
  }
  
  showAuthSuccess('✅ Password reset successfully! You can now login.');
  
  // Clear form
  const newPassInput = document.getElementById('auth-pass-reset-new');
  const confirmPassInput = document.getElementById('auth-pass-reset-confirm');
  if (newPassInput) newPassInput.value = '';
  if (confirmPassInput) confirmPassInput.value = '';
  
  setTimeout(() => {
    switchAuthTab('login');
    window.location.href = 'codedost.html'; // Remove token from URL
  }, 2000);
}

function showAuthError(message) {
  const el = document.getElementById('auth-error-msg');
  if (!el) return; // Safety check
  el.textContent = '❌ ' + message;
  el.style.display = 'block';
}

function showAuthSuccess(message) {
  const el = document.getElementById('auth-success-msg');
  if (!el) return; // Safety check
  el.textContent = message;
  el.style.display = 'block';
}
async function loadQuotaFromBackend() {
  if (!authToken) return;
  try {
    const r = await fetch(`${BACKEND_URL}/api/analyze/quota`, {
      credentials: 'include',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!r.ok) return;
    const data = await r.json();
    if (data.used !== undefined) {
      document.getElementById('quota-used').textContent = data.used;
      document.getElementById('quota-limit').textContent = data.limit || 20;
    }
  } catch {}
}
// ═══════════════════════════════════════
// STATE
// ═══════════════════════════════════════
let currentMode = "urdu"; // urdu | mixed | english
let currentLang = "python";
let sessionHistory = JSON.parse(localStorage.getItem("cd_history") || "[]");
let mistakePatterns = JSON.parse(localStorage.getItem("cd_patterns") || "{}");

// Auth State
let authToken = localStorage.getItem('cd_auth_token') || null;
let currentUser = JSON.parse(localStorage.getItem('cd_user') || 'null');
let authMode = 'login'; // login | register | forgot | reset

const LANG_TAGS = {
  python: "script.py",
  javascript: "app.js",
  java: "Main.java",
  cpp: "main.cpp",
  html: "index.html",
  sql: "query.sql",
};

// ═══════════════════════════════════════
// SYSTEM PROMPT — THE HEART OF CODEDOST
// ═══════════════════════════════════════
function buildSystemPrompt() {
  const modeInstructions = {
    urdu: `Respond in Roman Urdu (70%) with English technical terms (30%). Be conversational like you're explaining to a friend. Example: "Is function ne return nahi kiya—sirf None aa gaya."`,
    mixed: `Mix Roman Urdu and English naturally (50/50). Code-switch like real Pakistani developers—sometimes Urdu, sometimes English, sometimes both in one sentence.`,
    english: `Clear, simple English. Warm tone like a mentor. No technical jargon overload.`,
  };

  const DESI_ANALOGIES = {
    // ═══════ CORE CONCEPTS ═══════
    null_reference: {
      urdu: "Phone number save nahi ہے toh friend ko call nahi kar sakte. None bhi same—uska value nahi ہے, access nahi kar sakte.",
      english: "No phone number saved = can't call your friend. None is the same—no value, can't access it."
    },
    
    scope_error: {
      urdu: "Variable hostel room ke andar rakha ہے. Hallway se access nahi kar sakte. Code mein bhi sirf uske block mein visible ہے.",
      english: "Your stuff is in your room. You can't grab it from the hallway. Variables work the same—only visible in their block."
    },
    
    async_await: {
      urdu: "Pizza order diya (fetch), number likha likha. Abb chai banao aur wait karo. Agar number likha likha aur phone karo—order ready nahi ہے, crash hoga.",
      english: "Order pizza, get a number, make tea. If you call immediately without waiting—order's not ready, you crash."
    },
    
    array_index: {
      urdu: "5 seats mein (0,1,2,3,4). 6th seat dhundo—nahi milega. IndexError.",
      english: "5 items means indices 0-4. Ask for item 5—doesn't exist."
    },
    
    type_error: {
      urdu: "Rupay (5) aur gram (3) add nahi kar sakte. Pehle same unit mein convert karo: str(5) likho.",
      english: "Can't add 5 rupees + 3 kilos. Convert to same unit first."
    },
    
    function_no_return: {
      urdu: "Exam likha, teacher check kiya lekin marks diye nahi—None likha. Agar marks dekhna chaho toh crash.",
      english: "Wrote exam, teacher checked, gave nothing back (None). Try to use marks—crash."
    },
    
    syntax_error: {
      urdu: "Urdu full stop lazmi ہے sentence ke end mein. Python mein `if:` ke baad colon lazmi ہے—nahi toh parser samjh nahi sakta.",
      english: "Urdu needs a period. Python needs a colon after `if`—parser gets confused without it."
    },
    
    import_error: {
      urdu: "Book library se maangni padti ہے—ghar baithkay padha nahi kar sakte. Module import kiye bina use nahi kar sakte.",
      english: "You need a library card to borrow books. Can't use modules without importing them."
    },
    
    logic_error: {
      urdu: "40+ pass ہے exam mein. Agar `if marks > 40` likho toh exactly 40 fail hoga. `>=` likho.",
      english: "40+ passes exam. If you code `if marks > 40`, exactly 40 fails. Use `>=`."
    },
    
    infinite_loop: {
      urdu: "While loop mein exit condition nahi likhi—jaise exam mein 'kya likha?' 'kya likha?' baari baari pucho toh answer kabhi nahi milega.",
      english: "While loop with no exit = infinite 'why? why? why?' No answer ever."
    },
    
    indentation_error: {
      urdu: "Urdu likha left-right proper alignment se. Python spaces lazmi ہیں—ek space kam likha toh code samjh nahi aayega.",
      english: "Urdu needs proper alignment. Python indentation is mandatory—one space off breaks everything."
    },
    
    key_error: {
      urdu: "Record mein 'name' likha ہے lekin tum 'Name' (capital) se search karo—nahi milega. Exact key likho.",
      english: "Record says 'name', you search for 'Name'—doesn't match. Use exact key."
    },
    
    recursion_stack_overflow: {
      urdu: "Mirror ke saamne mirror—infinite reflections. Recursion base case nahi likhi toh function apne ko baari baari call karta ہے—crash.",
      english: "Mirror facing mirror = infinite reflections. No base case = function calls itself forever—crash."
    }
  };

  return `You are CodeDost, Pakistan's AI coding tutor. Explain errors warmly like an older sibling—encouraging but real, never condescending.

╔════════════════════════════════════════╗
║        LANGUAGE MODE INSTRUCTION       ║
╚════════════════════════════════════════╝

${modeInstructions[currentMode]}

╔════════════════════════════════════════╗
║         CRITICAL OUTPUT RULE           ║
╚════════════════════════════════════════╝

Respond with ONLY a valid JSON object.
- No text before or after
- No markdown fences
- No explanations outside JSON
- Just raw JSON, nothing else

╔════════════════════════════════════════╗
║          JSON OUTPUT FORMAT            ║
╚════════════════════════════════════════╝

{
  "error_type": "SyntaxError, TypeError, IndexError, NullReference, ScopeError, AsyncError, ImportError, LogicError, UndefinedVariable, InfiniteLoop, RecursionOverflow, IndentationError, KeyError",
  
  "severity": "beginner (syntax/basic) OR intermediate (logic/scope) OR advanced (async/recursion/complex)",
  
  "plain_explanation": "2-3 sentences. (1) Root cause WHY happened. (2) What the fix does. Natural, conversational. ${currentMode === "english" ? "Simple English." : "Roman Urdu with tech terms."}",
  
  "desi_analogy": "${currentMode === "english" ? "Real English analogy (1-2 sentences max). Relatable, not forced." : "Real Urdu analogy (1-2 sentences max). From Pakistani daily life—exam, dukaan, hostel, phone, etc. NOT generic."}",
  
  "fixed_code": "Complete corrected code. Preserve original logic structure—only fix the bug(s). NO markdown backticks.",
  
  "fix_bullets": [
    "Change 1 description (what changed and why)",
    "Change 2 if any",
    "Change 3 if any (optional)"
  ],
  
  "concept_to_study": "One core CS concept (e.g. 'Variable Scope', 'Array Indexing', 'Async/Await', 'Return Values')",
  
  "concept_why": "${currentMode !== "english" ? "Is concept ko samjhoge toh aisi mistakes nahi hogi." : "Learning this prevents similar errors."}",
  
  "concept_search": "Exact YouTube search query (e.g. 'Python function return values explained')",
  
  "mistake_category": "EXACTLY ONE: syntax_error, logic_error, type_error, null_reference, scope_error, async_error, import_error, index_error, recursion_error, indentation_error, key_error, other"
}

╔════════════════════════════════════════╗
║       HIGH-QUALITY ANALOGY LIBRARY     ║
╚════════════════════════════════════════╝

${currentMode === "english" 
  ? Object.entries(DESI_ANALOGIES).map(([key, val]) => `${key}: "${val.english}"`).join("\n")
  : Object.entries(DESI_ANALOGIES).map(([key, val]) => `${key}: "${val.urdu}"`).join("\n")
}

╔════════════════════════════════════════╗
║           STRICT QUALITY RULES         ║
╚════════════════════════════════════════╝

1. ✅ JSON VALIDITY
   - No trailing commas
   - Quote escaping only inside strings
   - Valid structure, always valid

2. ✅ PLAIN_EXPLANATION (Natural & Direct)
   - Root cause first (WHY)
   - What fix does (WHAT)
   - 2-3 sentences, conversational
   - NO artificial phrases like "ghabbrao mat" or "Ye common mistake"
   - NO forced openings like "Yaar..." or "Dekho..."

3. ✅ DESI_ANALOGY (Genuine & Relatable)
   - 1-2 sentences MAXIMUM
   - From real Pakistani context (exam, dukaan, hostel, family, traffic, phone, cricket, university)
   - NO forced format prefixes
   - NO generic examples (chai, biryani unless directly relevant)
   - Must resonate immediately—student should go "Haan! Bilkul!")

4. ✅ FIXED_CODE (Complete & Runnable)
   - Entire code block, not snippets
   - Same structure as original
   - Only bug fixes, no refactoring
   - Syntax-highlighted for language

5. ✅ FIX_BULLETS (Clear & Brief)
   - 2-3 items
   - Explain WHAT changed and WHY
   - Conversational but concise

6. ✅ SEVERITY ASSIGNMENT (Correct Classification)
   - beginner: syntax errors, missing colons, undefined variables, basic type mismatches
   - intermediate: logic errors, scope issues, off-by-one, simple None bugs
   - advanced: async/await, recursion, complex type systems, memory issues

7. ✅ TONE (Warm But Real)
   - Encouraging without being fake
   - Mentor-like, not condescending
   - Acknowledge struggle but push forward
   - Pakistani context appreciated naturally`;
}
// ═══════════════════════════════════════
// EXAMPLE SNIPPETS
// ═══════════════════════════════════════
const EXAMPLES = {
  syntax: {
    lang: "python",
    code: `def calculate_total(items):
    total = 0
    for item in items
        total += item['price']
    return total

result = calculate_total([{'price': 100}, {'price': 250}])
print(result)`,
    error: `SyntaxError: expected ':' (line 3)`,
  },
  typeerror: {
    lang: "python",
    code: `def get_username(user):
    name = user['name']
    upper_name = name.upper()
    return "Hello " + upper_name + " your age is " + user['age']

print(get_username({'name': 'Ali', 'age': 21}))`,
    error: `TypeError: can only concatenate str (not "int") to str`,
  },
  index: {
    lang: "python",
    code: `students = ['Ahmed', 'Sara', 'Bilal', 'Fatima']

for i in range(len(students) + 1):
    print(f"Student {i+1}: {students[i]}")`,
    error: `IndexError: list index out of range`,
  },
  undefined: {
    lang: "javascript",
    code: `function calculateDiscount(price) {
    let discountRate = 0.1;

    if (price > 1000) {
        let discountRate = 0.2;
    }

    return price - (price * discountRate);
}

console.log(calculateDiscount(1500));`,
    error: `Expected: 300 discount, Got: 150 discount (wrong result)`,
  },
  async: {
    lang: "javascript",
    code: `function getUserData(userId) {
    const response = fetch(\`https://api.example.com/users/\${userId}\`);
    const data = response.json();
    return data.name;
}

const name = getUserData(123);
console.log("User:", name);`,
    error: `TypeError: response.json is not a function (data shows [object Promise])`,
  },
  null: {
    lang: "python",
    code: `def find_student(students, name):
    for student in students:
        if student['name'] == name:
            return student
    # Function ends without returning anything

class_list = [{'name': 'Ahmed', 'grade': 'A'}, {'name': 'Sara', 'grade': 'B'}]
result = find_student(class_list, 'Usman')
print(result['grade'])`,
    error: `TypeError: 'NoneType' object is not subscriptable`,
  },
};

function loadExample(key) {
  const ex = EXAMPLES[key];
  if (!ex) return;
  document.getElementById("code-input").value = ex.code;
  document.getElementById("error-input").value = ex.error;
  const picker = document.getElementById("lang-picker");
  picker.value = ex.lang;
  updateLang();
  showToast("success", `Example loaded: ${key}`);
}

// Attach click listeners for example chips (decoupled from HTML inline handlers)
function initExampleChips() {
  document.querySelectorAll(".example-chip").forEach((button) => {
    button.addEventListener("click", () => {
      loadExample(button.dataset.example);
    });
  });
}

// ═══════════════════════════════════════
// PROVIDER CONFIG
// ═══════════════════════════════════════
let currentProvider = localStorage.getItem("cd_provider") || "groq";

const PROVIDERS = {
  groq: {
    url: "https://api.groq.com/openai/v1/chat/completions",
    model: "llama-3.3-70b-versatile",
    header: (key) => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    }),
    keyPrefix: "gsk_",
    storageKey: "cd_api_key_groq",
    label: "Groq",
  },
  gemini: {
    url: null, // handled separately via gemini REST
    model: "gemini-1.5-flash",
    header: (key) => ({ "Content-Type": "application/json" }),
    keyPrefix: "AIza",
    storageKey: "cd_api_key_gemini",
    label: "Gemini",
  },
  openrouter: {
    url: "https://openrouter.ai/api/v1/chat/completions",
    model: "meta-llama/llama-3.1-8b-instruct:free",
    header: (key) => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      "HTTP-Referer": "https://codedost.app",
      "X-Title": "CodeDost",
    }),
    keyPrefix: "sk-or-",
    storageKey: "cd_api_key_openrouter",
    label: "OpenRouter",
  },
};

function getActiveKey() {
  return localStorage.getItem(PROVIDERS[currentProvider].storageKey) || "";
}

// Utility: parse JSON robustly even with markdown/fence noise
function safeJSONParse(text) {
  if (!text || typeof text !== "string") return null;
  const cleaned = text
    .replace(/^\s*```json\s*/i, "")
    .replace(/^\s*```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // Fallback: find first JSON object substring
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch (innerErr) {
      console.error("safeJSONParse failed", innerErr);
      return null;
    }
  }
}

function validateResult(r) {
  if (!r || typeof r !== "object") return false;
  const required = [
    "error_type",
    "severity",
    "plain_explanation",
    "desi_analogy",
    "fixed_code",
    "fix_bullets",
    "concept_to_study",
    "concept_why",
    "concept_search",
    "mistake_category",
  ];
  const hasAll = required.every((k) =>
    Object.prototype.hasOwnProperty.call(r, k),
  );
  if (!hasAll) return false;
  if (!Array.isArray(r.fix_bullets) || r.fix_bullets.length < 2) return false;
  const severityValues = ["beginner", "intermediate", "advanced"];
  if (!severityValues.includes(String(r.severity))) return false;
  return true;
}

// ═══════════════════════════════════════
// MAIN ANALYZE FUNCTION
// ═══════════════════════════════════════
async function analyzeCode() {
  const code = document.getElementById("code-input").value.trim();
  const errorMsg = document.getElementById("error-input").value.trim();

  if (!code) {
    showToast("error", "Pehle code paste karo yaar!");
    return;
  }

  // Check quota before proceeding
  const quota = await checkQuota();
  if (quota.allowed === false) {
    showToast('error', `Monthly limit khatam — ${quota.used}/${quota.limit} analyses used`);
    return;
  }
  const apiKey = getActiveKey();
  if (!apiKey) {
    showToast("error", "API key daalo pehle — upar wali button se");
    openModal();
    return;
  }

  const btn = document.getElementById("submit-btn");
  btn.classList.add("loading");
  btn.disabled = true;

  try {
    // Set up timeout controller (30 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const userMessage = `Language: ${currentLang.toUpperCase()}\n\nCode:\n${code}\n\n${errorMsg ? `Error Message: ${errorMsg}` : "(No error message — analyze the code for bugs)"}`;
    let rawContent = "";

    if (currentProvider === "gemini") {
      // Gemini REST API (different format)
      const gemUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const gemBody = {
        contents: [
          {
            parts: [
              {
                text: buildSystemPrompt() + "\n\nUser request:\n" + userMessage,
              },
            ],
          },
        ],
        generationConfig: { temperature: 0.4, maxOutputTokens: 1800 },
      };
      const res = await fetch(gemUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gemBody),
        signal: controller.signal,
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e?.error?.message || `Gemini Error ${res.status}`);
      }
      const d = await res.json();
      rawContent = d.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } else {
      // OpenAI-compatible (Groq + OpenRouter)
      const p = PROVIDERS[currentProvider];
      const res = await fetch(p.url, {
        method: "POST",
        headers: p.header(apiKey),
        body: JSON.stringify({
          model: p.model,
          max_tokens: 1800,
          temperature: 0.4,
          messages: [
            { role: "system", content: buildSystemPrompt() },
            { role: "user", content: userMessage },
          ],
        }),
        signal: controller.signal,
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e?.error?.message || `API Error ${res.status}`);
      }
      const d = await res.json();
      rawContent = d.choices?.[0]?.message?.content?.trim() || "";
    }

    // Clear timeout on success
    clearTimeout(timeoutId);

    // Parse JSON — strip any accidental markdown fences
    const result = safeJSONParse(rawContent);
    if (!result || !validateResult(result)) {
      throw new Error("Invalid or malformed JSON response from model");
    }

    renderOutput(result, code, errorMsg);
    saveToHistory(result, code, errorMsg);
    updatePatterns(result.mistake_category, errorMsg, code);
    showToast(
      "success",
      `Explanation ready! (via ${PROVIDERS[currentProvider].label})`,
    );
  await incrementQuota();
    updateStreak();
    incrementUsageCounter();
    checkSimilarErrors(result.mistake_category);
  } catch (err) {
    console.error("CodeDost error:", err);
    let msg = "Kuch error ho gaya. Dobara try karo.";
    if (err.name === "AbortError")
      msg = "Request timeout — 30 seconds se zyada laga. Dobara try karo.";
    else if (err.message.includes("API key") || err.message.includes("401"))
      msg = "API key galat hai. Check karo.";
    else if (err.message.includes("quota") || err.message.includes("429")) {
      startRateLimitCountdown(30);
      return;
    } else if (err.message.includes("JSON"))
      msg = "Response parse nahi hua. Dobara try karo.";
    else if (err.message.includes("fetch"))
      msg = "Internet connection check karo.";
    showToast("error", msg);
  } finally {
    btn.classList.remove("loading");
    btn.disabled = false;
  }
}

// ═══════════════════════════════════════
// RENDER OUTPUT
// ═══════════════════════════════════════
function renderOutput(r, originalCode, errorMsg) {
  // Show output panel
  document.getElementById("output-empty").style.display = "none";
  const content = document.getElementById("output-content");
  content.classList.add("visible");

  // Store original code for diff
  window.originalCode = originalCode;

  // Error type + severity
  document.getElementById("out-error-type").textContent =
    r.error_type || "Unknown Error";
  const sevEl = document.getElementById("out-severity");
  sevEl.textContent = r.severity ? capitalize(r.severity) : "Unknown";
  sevEl.className = "severity-badge sev-" + (r.severity || "beginner");

  // Explanation
  document.getElementById("out-explanation").textContent =
    r.plain_explanation || "—";

  // Analogy
  document.getElementById("out-analogy").innerHTML = r.desi_analogy
    ? `<strong>🫖 Desi Analogy:</strong> ${r.desi_analogy}`
    : "—";

  // Fixed code with syntax highlighting
  const langClass =
    {
      python: "language-python",
      javascript: "language-javascript",
      java: "language-java",
      cpp: "language-cpp",
      html: "language-html",
      sql: "language-sql",
    }[currentLang] || "language-python";

  const codeEl = document.getElementById("out-fixed-code");
  codeEl.className = langClass;
  codeEl.textContent = r.fixed_code || "# No fix generated";
  document.getElementById("out-fix-lang").textContent =
    LANG_TAGS[currentLang] || "fixed_code.py";
  Prism.highlightElement(codeEl);

  // Reset diff view
  document.getElementById("code-diff-view").style.display = "none";
  document.getElementById("out-fixed-code").parentElement.style.display =
    "block";
  document.getElementById("diff-toggle-btn").textContent = "Show Diff";

  // Fix bullets
  const fixList = document.getElementById("out-fix-list");
  fixList.innerHTML = "";
  if (r.fix_bullets && Array.isArray(r.fix_bullets)) {
    r.fix_bullets.forEach((bullet) => {
      const li = document.createElement("li");
      li.textContent = bullet;
      fixList.appendChild(li);
    });
  }

  // Concept card
  document.getElementById("out-concept-name").textContent =
    r.concept_to_study || "General Debugging";
  document.getElementById("out-concept-why").textContent = r.concept_why || "";
  const conceptLink = document.getElementById("out-concept-link");
  const searchQuery =
    r.concept_search || r.concept_to_study || "programming debugging tutorial";
  conceptLink.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
  conceptLink.textContent = `"${searchQuery}" ↗`;

  // Populate share card
  document.getElementById("sc-error-type").textContent =
    r.error_type || "Error";
  const scSev = document.getElementById("sc-severity");
  scSev.textContent = capitalize(r.severity || "beginner");
  scSev.className = "severity-badge sev-" + (r.severity || "beginner");
  document.getElementById("sc-explanation").textContent =
    r.plain_explanation || "";
  document.getElementById("sc-analogy").textContent = r.desi_analogy || "";

  // Check repeat errors
  const errorKey = `${currentLang}_${r.mistake_category}`;
  const repeatCount = parseInt(
    localStorage.getItem("cd_error_repeat_" + errorKey) || "0",
  );
  const newRepeat = repeatCount + 1;
  localStorage.setItem("cd_error_repeat_" + errorKey, newRepeat);
  const repeatBanner = document.getElementById("repeat-banner");
  if (newRepeat >= 2) {
    repeatBanner.style.display = "flex";
    const txt = document.getElementById("repeat-banner-text");
    if (newRepeat === 2)
      txt.textContent =
        "You have seen this error type before — good news: now you will recognise it faster.";
    else if (newRepeat === 3)
      txt.textContent =
        "This is the 3rd time — let us go deeper. Focus on the Aab Yeh Seekho concept below.";
    else
      txt.textContent = `You have hit this error ${newRepeat} times. Time to master this concept once and for all.`;
  } else {
    repeatBanner.style.display = "none";
  }

  // Reset understood buttons
  document.getElementById("understood-yes").classList.remove("active");
  document.getElementById("understood-no").classList.remove("active");
  document.getElementById("understood-stats").style.display = "none";

  // Scroll output into view on mobile
  if (window.innerWidth < 900) {
    document
      .getElementById("panel-right")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// ═══════════════════════════════════════
// HISTORY
// ═══════════════════════════════════════
function saveToHistory(result, code, errorMsg) {
  const entry = {
    id: Date.now(),
    time: new Date().toLocaleTimeString("en-PK", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    errorType: result.error_type,
    errorMsg: errorMsg || result.error_type,
    lang: currentLang,
    code: code,
    result: result,
  };
  sessionHistory.unshift(entry);
  if (sessionHistory.length > 20) sessionHistory.pop();
  localStorage.setItem("cd_history", JSON.stringify(sessionHistory));
  renderHistory();
}

function renderHistory() {
  renderHistoryWithNav();
  return; // use new nav version
}
function _renderHistoryOld() {
  const list = document.getElementById("history-list");
  const empty = document.getElementById("history-empty");
  const clearBtn = document.getElementById("clear-history-btn");
  if (clearBtn) {
    clearBtn.onclick = () => {
      if (confirm("History clear karna hai?")) {
        sessionHistory = [];
        localStorage.removeItem("cd_history");
        renderHistory();
        renderPatterns();
        showToast("success", "History cleared");
      }
    };
  }
  if (sessionHistory.length === 0) {
    empty.classList.remove("hidden");
    list.classList.add("hidden");
    return;
  }

  empty.classList.add("hidden");
  list.classList.remove("hidden");
  list.innerHTML = "";

  sessionHistory.forEach((entry) => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.onclick = () => reloadHistory(entry);
    div.innerHTML = `
      <span class="history-time">${entry.time}</span>
      <span class="history-err">${entry.errorMsg || entry.errorType}</span>
      <span class="history-lang">${entry.lang}</span>
    `;
    list.appendChild(div);
  });
}

function reloadHistory(entry) {
  document.getElementById("code-input").value = entry.code;
  document.getElementById("error-input").value = entry.errorMsg || "";
  const picker = document.getElementById("lang-picker");
  picker.value = entry.lang;
  currentLang = entry.lang;
  updateLang();
  renderOutput(entry.result, entry.code, entry.errorMsg);
  showToast("success", "History se load kiya");
}

// ═══════════════════════════════════════
// MISTAKE PATTERNS
// ═══════════════════════════════════════
const PATTERN_LABELS = {
  syntax_error: "Syntax Errors",
  logic_error: "Logic Errors",
  type_error: "Type Errors",
  null_reference: "Null Reference",
  scope_error: "Scope Errors",
  async_error: "Async Bugs",
  import_error: "Import Errors",
  index_error: "Index Errors",
  other: "Other Bugs",
};

function updatePatterns(category, errorMsg, codeSnippet) {
  if (!category) return;

  // Update old pattern counts for backward compatibility
  mistakePatterns[category] = (mistakePatterns[category] || 0) + 1;
  localStorage.setItem("cd_patterns", JSON.stringify(mistakePatterns));

  // Create detailed pattern entry
  const patterns = JSON.parse(
    localStorage.getItem("codedost-patterns") || "[]",
  );
  const now = new Date().toISOString();

  // Extract meaningful pattern from error message
  const pattern =
    errorMsg.length > 100 ? errorMsg.substring(0, 100) + "..." : errorMsg;

  // Check if similar pattern already exists
  const existingPattern = patterns.find(
    (p) =>
      p.language === currentLang &&
      p.errorType === category &&
      p.pattern === pattern,
  );

  if (existingPattern) {
    existingPattern.frequency += 1;
    existingPattern.lastSeen = now;
  } else {
    patterns.push({
      date: now.split("T")[0],
      language: currentLang,
      errorType: category,
      pattern: pattern,
      frequency: 1,
      lastSeen: now,
      codeSnippet: codeSnippet ? codeSnippet.substring(0, 200) : "",
    });
  }

  localStorage.setItem("codedost-patterns", JSON.stringify(patterns));
  renderPatterns();
}

function renderPatterns(patterns = null) {
  const grid = document.getElementById("pattern-grid");
  const noPatterns = document.getElementById("no-patterns");

  if (!patterns) {
    // Use old pattern system for backward compatibility
    const total = Object.values(mistakePatterns).reduce((a, b) => a + b, 0);
    if (total === 0) {
      noPatterns.classList.remove("hidden");
      grid.classList.add("hidden");
      return;
    }

    noPatterns.classList.add("hidden");
    grid.classList.remove("hidden");
    grid.innerHTML = "";

    const sorted = Object.entries(mistakePatterns).sort((a, b) => b[1] - a[1]);
    const maxVal = sorted[0][1];

    sorted.forEach(([cat, count]) => {
      const pct = Math.round((count / maxVal) * 100);
      const card = document.createElement("div");
      card.className = "pattern-card";
      card.innerHTML = `
        <div class="pattern-count">${count}</div>
        <div class="pattern-name">${PATTERN_LABELS[cat] || cat}</div>
        <div class="pattern-bar-wrap">
          <div class="pattern-bar" style="width:${pct}%"></div>
        </div>
      `;
      grid.appendChild(card);
    });
    return;
  }

  // New pattern analytics system
  if (!patterns || patterns.length === 0) {
    grid.classList.add("hidden");
    noPatterns.classList.remove("hidden");
    return;
  }

  grid.classList.remove("hidden");
  noPatterns.classList.add("hidden");

  grid.innerHTML = patterns
    .map(
      (pattern) => `
    <div class="pattern-card">
      <div class="pattern-header">
        <span class="pattern-language">${pattern.language}</span>
        <span class="pattern-frequency">×${pattern.frequency}</span>
      </div>
      <div class="pattern-error">${pattern.errorType}</div>
      <div class="pattern-text">${pattern.pattern}</div>
      <div class="pattern-meta">
        <span>Last seen: ${new Date(pattern.lastSeen).toLocaleDateString()}</span>
        <span>Added: ${new Date(pattern.date).toLocaleDateString()}</span>
      </div>
    </div>
  `,
    )
    .join("");
}

// ═══════════════════════════════════════
// PATTERN ANALYTICS FUNCTIONS
// ═══════════════════════════════════════
function filterPatternsByDate() {
  const dateFilter = document.getElementById("pattern-date-filter").value;
  const patterns = JSON.parse(
    localStorage.getItem("codedost-patterns") || "[]",
  );
  const filtered = dateFilter
    ? patterns.filter((p) => p.date.startsWith(dateFilter))
    : patterns;
  renderPatterns(filtered);
}

function clearDateFilter() {
  document.getElementById("pattern-date-filter").value = "";
  filterPatternsByDate();
}

function exportPatterns() {
  const patterns = JSON.parse(
    localStorage.getItem("codedost-patterns") || "[]",
  );
  if (patterns.length === 0) {
    alert("No patterns to export!");
    return;
  }

  const csv = [
    ["Date", "Language", "Error Type", "Pattern", "Frequency", "Last Seen"],
    ...patterns.map((p) => [
      p.date,
      p.language,
      p.errorType,
      p.pattern,
      p.frequency,
      p.lastSeen,
    ]),
  ]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `codedost-patterns-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════
// CODE EXECUTION SANDBOX
// ═══════════════════════════════════════
let pyodide = null;

async function initPyodide() {
  if (pyodide) return pyodide;

  try {
    pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
    });
    return pyodide;
  } catch (error) {
    console.error("Failed to load Pyodide:", error);
    throw new Error("Code execution not available - Pyodide failed to load");
  }
}

async function runCodeSandbox() {
  const code = document.getElementById("out-fixed-code").textContent.trim();
  if (!code) {
    showToast("error", "Pehele code analyze karo!");
    return;
  }

  const executionCard = document.getElementById("card-execution");
  const loadingDiv = document.getElementById("execution-loading");
  const resultDiv = document.getElementById("execution-result");
  const runBtn = document.getElementById("run-code-btn");
  const executionOutput = document.getElementById("execution-output");

  // Show execution card and loading state
  executionCard.style.display = "block";
  loadingDiv.style.display = "block";
  resultDiv.style.display = "none";
  if (executionOutput) executionOutput.style.display = "block";
  runBtn.disabled = true;
  runBtn.textContent = "Running...";

  try {
    // Initialize Pyodide if not already done
    if (!pyodide) {
      await initPyodide();
    }

    // Execute code and capture stdout/stderr reliably
    pyodide.globals.set("user_code", code);
    const finalOutput = await pyodide.runPythonAsync(`
import sys
import traceback
from io import StringIO

stdout_buffer = StringIO()
stderr_buffer = StringIO()
original_stdout = sys.stdout
original_stderr = sys.stderr

sys.stdout = stdout_buffer
sys.stderr = stderr_buffer

try:
    exec(user_code, globals(), globals())
except Exception:
    traceback.print_exc(file=stderr_buffer)
finally:
    sys.stdout = original_stdout
    sys.stderr = original_stderr

stdout_text = stdout_buffer.getvalue()
stderr_text = stderr_buffer.getvalue()

if stdout_text or stderr_text:
    result = stdout_text + stderr_text
else:
    result = "Code executed successfully (no output)"

result
    `);

    loadingDiv.style.display = "none";
    resultDiv.style.display = "block";
    resultDiv.textContent = finalOutput || "Code executed successfully (no output)";
    executionCard.scrollIntoView({ behavior: "smooth", block: "start" });

    showToast("success", "Code executed successfully!");
  } catch (error) {
    console.error("Execution error:", error);
    loadingDiv.style.display = "none";
    resultDiv.style.display = "block";
    resultDiv.textContent = `Execution Error: ${error.message}`;
    executionCard.scrollIntoView({ behavior: "smooth", block: "start" });
    showToast("error", "Code execution failed");
  } finally {
    runBtn.disabled = false;
    runBtn.textContent = "▶ Run Code";
  }
}
function setMode(mode, el) {
  currentMode = mode;
  localStorage.setItem("cd_mode", mode);
  document
    .querySelectorAll(".mode-btn")
    .forEach((b) => b.classList.remove("active"));
  if (el) el.classList.add("active");
}

// ═══════════════════════════════════════
// THEME CUSTOMIZATION
// ═══════════════════════════════════════
let currentTheme = "dark";

function toggleTheme() {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", currentTheme);
  localStorage.setItem("cd_theme", currentTheme);

  const themeBtn = document.getElementById("theme-toggle");
  themeBtn.textContent = currentTheme === "dark" ? "🌙" : "☀️";
  themeBtn.classList.toggle("active", currentTheme === "light");

  showToast("success", `Switched to ${currentTheme} theme`);
}

function initModeButtons() {
  document.querySelectorAll(".mode-btn").forEach((button) => {
    button.addEventListener("click", () => {
      setMode(button.dataset.mode, button);
      showToast("success", `Mode switched to ${button.textContent}`);
    });
  });
}

function updateLang() {
  currentLang = document.getElementById("lang-picker").value;
  localStorage.setItem("cd_lang", currentLang);
  document.getElementById("lang-tag").textContent =
    LANG_TAGS[currentLang] || "code.txt";
  const codeEl = document.getElementById("out-fixed-code");
  if (codeEl) {
    document.getElementById("out-fix-lang").textContent =
      LANG_TAGS[currentLang] || "fixed_code";
  }
}

function switchTab(tabId, el) {
  document
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.remove("active"));
  document
    .querySelectorAll(".tab-panel")
    .forEach((p) => p.classList.remove("active"));
  el.classList.add("active");
  document.getElementById("tab-" + tabId).classList.add("active");
}

async function copyCode() {
  const code = document.getElementById("out-fixed-code").textContent;
  try {
    await navigator.clipboard.writeText(code);
    const btn = document.getElementById("copy-btn");
    btn.textContent = "Copied ✓";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.textContent = "Copy";
      btn.classList.remove("copied");
    }, 2000);
  } catch {
    showToast("error", "Copy nahi hua — manually select karo");
  }
}

function downloadCode() {
  const code = document.getElementById("out-fixed-code").textContent;
  const lang = currentLang;
  const extension =
    {
      python: "py",
      javascript: "js",
      java: "java",
      cpp: "cpp",
      html: "html",
      sql: "sql",
    }[lang] || "txt";
  const filename = `fixed_code.${extension}`;
  const blob = new Blob([code], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("success", `Downloaded: ${filename}`);
}

function toggleDiffView() {
  const diffView = document.getElementById("code-diff-view");
  const codeView = document.getElementById("out-fixed-code").parentElement;
  const toggleBtn = document.getElementById("diff-toggle-btn");

  if (diffView.style.display === "none") {
    // Show diff
    renderDiff();
    diffView.style.display = "block";
    codeView.style.display = "none";
    toggleBtn.textContent = "Hide Diff";
  } else {
    // Hide diff
    diffView.style.display = "none";
    codeView.style.display = "block";
    toggleBtn.textContent = "Show Diff";
  }
}

function renderDiff() {
  const originalCode = window.originalCode || "";
  const fixedCode = document.getElementById("out-fixed-code").textContent || "";

  if (!originalCode || !fixedCode) {
    document.getElementById("code-diff-view").innerHTML =
      '<div style="padding:16px;color:var(--text-muted);">No diff available</div>';
    return;
  }

  // Create diff using jsdiff
  const diff = Diff.diffLines(originalCode, fixedCode);
  let diffHtml = "";

  diff.forEach((part) => {
    const className = part.added
      ? "diff-added"
      : part.removed
        ? "diff-removed"
        : "diff-unchanged";
    const prefix = part.added ? "+" : part.removed ? "-" : " ";
    const lines = part.value.split("\n");

    lines.forEach((line, index) => {
      if (line === "" && index === lines.length - 1) return; // Skip empty last line
      diffHtml += `<div class="diff-line ${className}"><span class="diff-prefix">${prefix}</span><span class="diff-content">${escapeHtml(line)}</span></div>`;
    });
  });

  document.getElementById("code-diff-view").innerHTML =
    `<pre class="diff-container">${diffHtml}</pre>`;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function showToast(type, msg) {
  const toast = document.getElementById("toast");
  const dot = toast.querySelector(".toast-dot");
  document.getElementById("toast-msg").textContent = msg;
  toast.className = "toast toast-" + type;
  dot.style.background = type === "success" ? "var(--green)" : "var(--red)";
  void toast.offsetWidth;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

// ── MODAL ──────────────────────────────
function openModal() {
  const modal = document.getElementById("modal-overlay");
  if (!modal) return; // Safety check
  modal.classList.add("open");
  // Load saved keys into inputs
  ["groq", "gemini", "openrouter"].forEach((p) => {
    const saved = localStorage.getItem(PROVIDERS[p].storageKey) || "";
    const el = document.getElementById("key-" + p);
    if (el && saved) el.value = saved;
  });
  // Restore active tab
  setProvider(currentProvider, false);
  setTimeout(() => {
    const el = document.getElementById("key-" + currentProvider);
    if (el) el.focus();
  }, 100);
}

function openAuthModal() {
  const modal = document.getElementById("auth-modal-overlay");
  if (!modal) return; // Safety check
  modal.style.display = 'flex';
  // Reset form and show login tab by default
  if (authMode !== 'reset') {
    switchAuthTab('login');
  }
  // Clear error/success messages
  const errorEl = document.getElementById('auth-error-msg');
  const successEl = document.getElementById('auth-success-msg');
  if (errorEl) errorEl.style.display = 'none';
  if (successEl) successEl.style.display = 'none';
}

function closeModalOutside(e) {
  if (e.target === document.getElementById("modal-overlay"))
    document.getElementById("modal-overlay").classList.remove("open");
}

function setProvider(p, focus = true) {
  currentProvider = p;
  localStorage.setItem("cd_provider", p);
  // Update tabs
  ["groq", "gemini", "openrouter"].forEach((id) => {
    document.getElementById("ptab-" + id)?.classList.remove("active-tab");
    document.getElementById("provider-" + id).style.display = "none";
  });
  document.getElementById("ptab-" + p)?.classList.add("active-tab");
  document.getElementById("provider-" + p).style.display = "block";
  if (focus) setTimeout(() => document.getElementById("key-" + p)?.focus(), 50);
}

function saveApiKey() {
  const key = document.getElementById("key-" + currentProvider)?.value.trim();
  if (!key) {
    showToast("error", "Key paste karo pehle");
    return;
  }

  const prefix = PROVIDERS[currentProvider].keyPrefix;
  if (!key.startsWith(prefix)) {
    showToast(
      "error",
      `${PROVIDERS[currentProvider].label} key "${prefix}" se shuru honi chahiye`,
    );
    return;
  }

  localStorage.setItem(PROVIDERS[currentProvider].storageKey, key);
  document.getElementById("modal-overlay").classList.remove("open");
  showToast(
    "success",
    `${PROVIDERS[currentProvider].label} key save! Ab analyze kar sakte ho.`,
  );
}

function convertTime(date, to = "ms") {
  if (to === "ms") return new Date(date).getTime();
  return new Date(date).toLocaleString();
}
function daysBetween(baseMs, targetMs) {
  return Math.floor((targetMs - baseMs) / (1000 * 60 * 60 * 24));
}

// ═══════════════════════════════════════
// FEATURE 1: STREAK COUNTER
// ═══════════════════════════════════════
function updateStreak() {
  const today = new Date().toDateString();
  const lastDate = localStorage.getItem("cd_streak_date");
  let streak = parseInt(localStorage.getItem("cd_streak") || "0");
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (lastDate === today) {
    // already used today, no change
  } else if (lastDate === yesterday) {
    streak += 1;
    localStorage.setItem("cd_streak", streak);
    localStorage.setItem("cd_streak_date", today);
  } else {
    streak = 1;
    localStorage.setItem("cd_streak", streak);
    localStorage.setItem("cd_streak_date", today);
  }
  renderStreak(streak);
}

function renderStreak(streak) {
  const el = document.getElementsByClassName("streak-num");
  if (el && el.length > 0) el[0].textContent = streak;
  if (el && el.length > 1) el[1].textContent = streak;
  const badge = document.getElementById("streak-badge");
  if (badge && streak >= 3) {
    badge.style.borderColor = "var(--amber)";
  }
}

function initStreak() {
  let streak = parseInt(localStorage.getItem("cd_streak") || "0");
  const lastDate = localStorage.getItem("cd_streak_date");
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const developedDays = daysBetween(new Date("2026-03-20"), new Date());
  const value = Number(localStorage.getItem("cd_streak"));
  if (developedDays < Number(streak) || isNaN(value)) {
    streak = 0;
    localStorage.setItem("cd_streak", "0");
    console.log("DOME");
    return;
  }
  if (lastDate !== today && lastDate !== yesterday) {
    localStorage.setItem("cd_streak", "0");
    renderStreak(0);
  } else {
    renderStreak(streak);
  }
}

// ═══════════════════════════════════════
// FEATURE 2: UNDERSTOOD BUTTON
// ═══════════════════════════════════════
function markUnderstood(understood) {
  const yesBtn = document.getElementById("understood-yes");
  const noBtn = document.getElementById("understood-no");
  const statsEl = document.getElementById("understood-stats");

  yesBtn.classList.toggle("active", understood);
  noBtn.classList.toggle("active", !understood);

  const key = understood ? "cd_understood_yes" : "cd_understood_no";
  const total_yes =
    parseInt(localStorage.getItem("cd_understood_yes") || "0") +
    (understood ? 1 : 0);
  const total_no =
    parseInt(localStorage.getItem("cd_understood_no") || "0") +
    (!understood ? 1 : 0);
  localStorage.setItem(
    "cd_understood_yes",
    understood
      ? total_yes
      : parseInt(localStorage.getItem("cd_understood_yes") || "0"),
  );
  localStorage.setItem(
    "cd_understood_no",
    !understood
      ? total_no
      : parseInt(localStorage.getItem("cd_understood_no") || "0"),
  );

  const totalAll = total_yes + total_no;
  const pct = totalAll > 0 ? Math.round((total_yes / totalAll) * 100) : 0;
  statsEl.style.display = "block";
  statsEl.textContent = `Your understanding rate: ${pct}% (${total_yes}/${totalAll} explanations understood)`;

  showToast(
    "success",
    understood
      ? "Great! Keep it up."
      : 'No worries — try the "Aab Yeh Seekho" concept below.',
  );
}

// ═══════════════════════════════════════
// FEATURE 5: USAGE COUNTER (CountAPI)
// ═══════════════════════════════════════
async function loadUsageCounter() {
  try {
    const r = await fetch(
     `${BACKEND_URL}/api/counter`,
    );
    const d = await r.json();
    const count = d.counter;
    const el = document.getElementById("usage-count");
    if (el) el.textContent = count;
  } catch {
    const el = document.getElementById("usage-count");
    if (el) el.textContent = "****";
  }
}

async function incrementUsageCounter() {
  try {
    const r = await fetch(
        `${BACKEND_URL}/api/counter`,
        { method: "POST" }
      );
    const d = await r.json();
    const count = d.counter;
    const el = document.getElementById("usage-count");
    if (el) el.textContent = count;
  } catch {
    const el = document.getElementById("usage-count");
    if (el) el.textContent = "****";
  }
}

// ═══════════════════════════════════════
// FEATURE 7: SHORTCUTS MODAL
// ═══════════════════════════════════════
function openHelpModal() {
  document.getElementById("help-modal").classList.add("open");
}
function closeHelpModal(e) {
  if (!e || e.target === document.getElementById("help-modal")) {
    document.getElementById("help-modal").classList.remove("open");
  }
}

// ═══════════════════════════════════════
// FEATURE 8: EDITOR LINE/CHAR COUNTER
// ═══════════════════════════════════════
function initEditorCounter() {
  const textarea = document.getElementById("code-input");
  const counter = document.getElementById("editor-counter");
  if (!textarea || !counter) return;
  function updateCounter() {
    const lines = textarea.value.split("\n").length;
    const chars = textarea.value.length;
    counter.textContent = `${lines} lines · ${chars} chars`;
  }
  textarea.addEventListener("input", updateCounter);
  updateCounter();
}

// ═══════════════════════════════════════
// FEATURE 9: RATE LIMIT COUNTDOWN
// ═══════════════════════════════════════
let rateLimitTimer = null;

function startRateLimitCountdown(seconds) {
  const bar = document.getElementById("rate-limit-bar");
  const countdown = document.getElementById("rate-countdown");
  const fill = document.getElementById("rate-progress-fill");
  if (!bar) return;

  if (rateLimitTimer) clearInterval(rateLimitTimer);
  bar.classList.add("visible");
  let remaining = seconds;

  function tick() {
    countdown.textContent = remaining;
    fill.style.width = (remaining / seconds) * 100 + "%";
    if (remaining <= 0) {
      clearInterval(rateLimitTimer);
      bar.classList.remove("visible");
      showToast("success", "Rate limit lifted — try again!");
    }
    remaining--;
  }
  tick();
  rateLimitTimer = setInterval(tick, 1000);
}

// ═══════════════════════════════════════
// FEATURE 10: PASTE ERROR FROM CLIPBOARD
// ═══════════════════════════════════════
async function pasteErrorFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    document.getElementById("error-input").value = text;
    showToast("success", "Error message pasted from clipboard!");
  } catch {
    showToast("error", "Clipboard permission denied — paste manually");
  }
}

// ═══════════════════════════════════════
// FEATURE 11: SHARE CARD (html2canvas)
// ═══════════════════════════════════════
function openShareCard() {
  const content = document.getElementById("output-content");
  if (!content || !content.classList.contains("visible")) {
    showToast("error", "Pehle code analyze karo!");
    return;
  }
  document.getElementById("share-card-modal").classList.add("open");
}

function closeShareCard(e) {
  if (!e || e.target === document.getElementById("share-card-modal")) {
    document.getElementById("share-card-modal").classList.remove("open");
  }
}

function downloadShareCard() {
  const card = document.getElementById("share-card-dom");
  if (!card) return;
  if (typeof html2canvas === "undefined") {
    showToast(
      "error",
      "html2canvas library not loaded. Check internet connection.",
    );
    return;
  }
  html2canvas(card, {
    backgroundColor: "#0e0e10",
    scale: 2,
    useCORS: true,
    logging: false,
  })
    .then((canvas) => {
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "codedost-result.png";
      a.click();
      showToast("success", "Image downloaded! WhatsApp pe share karo.");
    })
    .catch(() => {
      showToast("error", "Image generate nahi hua — retry karo");
    });
}

// ═══════════════════════════════════════
// FEATURE 12: HISTORY NAVIGATION
// ═══════════════════════════════════════
let historyNavIndex = 0;

function renderHistoryWithNav() {
  const list = document.getElementById("history-list");
  const empty = document.getElementById("history-empty");
  if (sessionHistory.length === 0) {
    empty.classList.remove("hidden");
    list.classList.add("hidden");
    return;
  }
  empty.classList.add("hidden");
  list.classList.remove("hidden");
  list.innerHTML = "";
  sessionHistory.forEach((entry, idx) => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.tabIndex = 0;
    div.onclick = () => {
      historyNavIndex = idx;
      reloadHistory(entry);
    };
    div.onkeydown = (e) => {
      if (e.key === "Enter") {
        historyNavIndex = idx;
        reloadHistory(entry);
      }
    };
    div.innerHTML = `<span class="history-time">${entry.time}</span><span class="history-err">${entry.errorMsg || entry.errorType}</span><span class="history-lang">${entry.lang}</span>`;
    list.appendChild(div);
  });
}

function initHistorySwipe() {
  const list = document.getElementById("history-list");
  if (!list) return;
  let startX = 0;
  list.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
    },
    { passive: true },
  );
  list.addEventListener(
    "touchend",
    (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 60) {
        if (diff > 0 && historyNavIndex < sessionHistory.length - 1) {
          historyNavIndex++;
          reloadHistory(sessionHistory[historyNavIndex]);
          showToast(
            "success",
            `History: ${historyNavIndex + 1}/${sessionHistory.length}`,
          );
        } else if (diff < 0 && historyNavIndex > 0) {
          historyNavIndex--;
          reloadHistory(sessionHistory[historyNavIndex]);
          showToast(
            "success",
            `History: ${historyNavIndex + 1}/${sessionHistory.length}`,
          );
        }
      }
    },
    { passive: true },
  );
}

// ═══════════════════════════════════════
// FEATURE 13: CONCEPT OF THE DAY
// ═══════════════════════════════════════
const CONCEPTS_OF_DAY = [
  {
    icon: "🔄",
    title: "Variable Scope",
    desc: "A variable's scope determines where it can be accessed. Variables declared inside a function only exist inside that function.",
  },
  {
    icon: "📋",
    title: "Data Types",
    desc: "Python has strings (text), integers (whole numbers), floats (decimals), and booleans (True/False). You cannot mix them without converting.",
  },
  {
    icon: "📑",
    title: "Array Indexing",
    desc: "Lists start at index 0, not 1. A list with 5 items has indices 0,1,2,3,4. Index 5 does not exist — that causes IndexError.",
  },
  {
    icon: "⏳",
    title: "Async/Await",
    desc: "fetch() returns a Promise, not data. You must await it. Without await, you get [object Promise] instead of your actual data.",
  },
  {
    icon: "↩️",
    title: "Return Values",
    desc: "A function without a return statement returns None. If you try to use that None value as a dictionary or object, you get NoneType error.",
  },
  {
    icon: "📦",
    title: "Imports",
    desc: "You must import a module before using it. import math lets you use math.sqrt(). Without the import, Python doesn't know what math is.",
  },
  {
    icon: "🔁",
    title: "For Loop Syntax",
    desc: "Python for loops require a colon at the end: for item in list: — the colon tells Python the loop body starts on the next line.",
  },
  {
    icon: "🔗",
    title: "String Concatenation",
    desc: 'In Python, you can only join strings with +. Numbers must be converted first: "Age: " + str(age) — not "Age: " + age.',
  },
  {
    icon: "🏗️",
    title: "Object Oriented Programming",
    desc: "A class is a blueprint. An object is a real instance of that blueprint. self refers to the specific object calling the method.",
  },
  {
    icon: "🔍",
    title: "Null Reference",
    desc: "When a variable is None (Python) or null (Java/JS), you cannot access properties on it. Always check if a value exists before using it.",
  },
];

function showConceptOfDay() {
  const today = new Date().toDateString();
  const dismissed = localStorage.getItem("cd_cotd_dismissed");
  if (dismissed === today) return;

  const dayIndex = new Date().getDay(); // 0-6
  const concept = CONCEPTS_OF_DAY[dayIndex % CONCEPTS_OF_DAY.length];
  const container = document.getElementById("cotd-container");
  if (!container) return;

  container.innerHTML = `
    <div class="cotd-banner" id="cotd-banner">
      <span class="cotd-icon">${concept.icon}</span>
      <div class="cotd-content">
        <div class="cotd-label">Concept of the Day</div>
        <div class="cotd-title">${concept.title}</div>
        <div class="cotd-desc">${concept.desc}</div>
      </div>
      <button type="button" class="cotd-dismiss" onclick="dismissCotd()" title="Dismiss">✕</button>
    </div>`;
}

function dismissCotd() {
  const el = document.getElementById("cotd-banner");
  if (el) el.remove();
  localStorage.setItem("cd_cotd_dismissed", new Date().toDateString());
}

// ═══════════════════════════════════════
// FEATURE 15: SIMILAR ERRORS SUGGESTION
// ═══════════════════════════════════════
function checkSimilarErrors(category) {
  if (!category) return;
  const count = mistakePatterns[category] || 0;
  const card = document.getElementById("card-similar");
  const text = document.getElementById("similar-errors-text");
  if (!card || !text) return;

  if (count >= 2) {
    card.style.display = "block";
    const CATEGORY_TIPS = {
      type_error:
        "You have hit TypeErrors " +
        count +
        " times. Focus on understanding data types — especially str(), int(), and float() conversion.",
      syntax_error:
        "You have hit SyntaxErrors " +
        count +
        " times. Watch out for missing colons (:) after loops and if statements.",
      index_error:
        "You have hit IndexErrors " +
        count +
        " times. Remember: lists start at index 0. Use len(list)-1 for the last item.",
      null_reference:
        "You have hit NullReference errors " +
        count +
        " times. Always check if a value is None before using it.",
      scope_error:
        "You have hit Scope errors " +
        count +
        " times. Variables declared inside an if block do not exist outside it.",
      async_error:
        "You have hit Async errors " +
        count +
        " times. Always use await before fetch() and async def for the function.",
      import_error:
        "You have hit ImportErrors " +
        count +
        " times. Remember to import every module before using it.",
      other:
        "You have encountered similar errors " + count + " times. Study this concept thoroughly.",
    };
    text.textContent =
      CATEGORY_TIPS[category] ||
      `You have encountered ${category.replace("_", " ")} ${count} times. Study this concept thoroughly.`;
  } else {
    card.style.display = "none";
  }
}

// ═══════════════════════════════════════
// FEATURE 16: EMAIL WAITLIST
// ═══════════════════════════════════════
async function joinWaitlist() {
  const email = document.getElementById("waitlist-email").value.trim();
  if (!email || !email.includes("@")) {
    showToast("error", "Valid email address enter karo");
    return;
  }
  try {
    await fetch("https://formspree.io/f/xpwzodkr", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        source: "CodeDost in-app waitlist",
        date: new Date().toISOString(),
      }),
    });
    document.getElementById("waitlist-email").value = "";
    showToast("success", "Waitlist join ho gaye! 3 months free milenge.");
    localStorage.setItem("cd_waitlist_joined", "true");
  } catch {
    showToast("error", "Could not submit — try again later");
  }
}
// Static exercises library (no AI needed)
const TOPIC_EXERCISES = {
  variables: {
    title: "Variables Basics",
    description: "Create variables for a student's name, age, and GPA",
    starter_code: `# Create variables for:
# name: your name (string)
# age: your age (number)  
# gpa: your GPA (decimal)

name = "Ahmed"
age = 20
gpa = 3.5

print(f"Name: {name}, Age: {age}, GPA: {gpa}")`,
    test_cases: [
      { input: "name='Ali', age=21, gpa=3.8", output: "Name: Ali, Age: 21, GPA: 3.8" }
    ],
    hints: ["Use quotes for strings", "Numbers don't need quotes", "Use f-strings for printing"]
  },
  
  conditionals: {
    title: "If-Else Statements",
    description: "Check if a number is positive, negative, or zero",
    starter_code: `num = 5

if num > 0:
    print("Positive")
elif num < 0:
    print("Negative")
else:
    print("Zero")`,
    test_cases: [
      { input: "num=5", output: "Positive" },
      { input: "num=-3", output: "Negative" },
      { input: "num=0", output: "Zero" }
    ],
    hints: ["Use > and < for comparisons", "elif is 'else if'", "Always use colons after if/elif/else"]
  },
  
  loops: {
    title: "For Loop Practice",
    description: "Print numbers from 1 to 5",
    starter_code: `for i in range(1, 6):
    print(i)`,
    test_cases: [
      { input: "range(1,6)", output: "1\\n2\\n3\\n4\\n5" }
    ],
    hints: ["range(1,6) gives 1,2,3,4,5", "The end number is NOT included", "Use for loops for iteration"]
  },
  
  functions: {
    title: "Create a Function",
    description: "Write a function that adds two numbers",
    starter_code: `def add(a, b):
    return a + b

result = add(5, 3)
print(result)`,
    test_cases: [
      { input: "add(5,3)", output: "8" },
      { input: "add(10,20)", output: "30" }
    ],
    hints: ["Functions start with 'def'", "Use 'return' to send back a value", "Call functions with ()"]
  },
  
  lists: {
    title: "List Operations",
    description: "Create a list and access its elements",
    starter_code: `fruits = ["apple", "banana", "mango", "orange"]

print(fruits[0])   # First element
print(fruits[-1])  # Last element
print(len(fruits)) # Number of items`,
    test_cases: [
      { input: "fruits[0]", output: "apple" },
      { input: "fruits[-1]", output: "orange" },
      { input: "len(fruits)", output: "4" }
    ],
    hints: ["Lists start at index 0", "Negative index counts from the end", "len() gives list size"]
  },

  dictionaries: {
    title: "Dictionary Basics",
    description: "Create and access a dictionary",
    starter_code: `student = {"name": "Ali", "age": 20, "city": "Lahore"}

print(student["name"])
print(student["age"])`,
    test_cases: [
      { input: 'student["name"]', output: "Ali" },
      { input: 'student["age"]', output: "20" }
    ],
    hints: ["Dictionaries use key-value pairs", "Use {'key': 'value'} format", "Access with dict['key']"]
  },

  file_io: {
    title: "Reading Files",
    description: "Open and read a file",
    starter_code: `# Writing to a file
with open("data.txt", "w") as f:
    f.write("Hello, World!")

# Reading from a file
with open("data.txt", "r") as f:
    content = f.read()
    print(content)`,
    test_cases: [
      { input: 'open("file.txt")', output: "<opened file>" }
    ],
    hints: ["Use 'with' for file handling", "'w' is write mode, 'r' is read mode", "Always close files after use"]
  },

  oop: {
    title: "Classes and Objects",
    description: "Create a simple class",
    starter_code: `class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def display(self):
        print(f"Name: {self.name}, Age: {self.age}")

student = Student("Ahmed", 20)
student.display()`,
    test_cases: [
      { input: 'Student("Ahmed", 20)', output: "Name: Ahmed, Age: 20" }
    ],
    hints: ["__init__ is the constructor", "self refers to the object", "Methods are functions inside classes"]
  },

  exceptions: {
    title: "Try-Except Handling",
    description: "Handle errors gracefully",
    starter_code: `try:
    num = int("hello")
except ValueError:
    print("Invalid number!")
except Exception as e:
    print(f"Error: {e}")`,
    test_cases: [
      { input: 'int("hello")', output: "Invalid number!" }
    ],
    hints: ["try block runs first", "except catches errors", "Use specific exceptions first"]
  }
};

function startTopic(topicId) {
  console.log('Starting topic:', topicId);
  showToast('info', '📝 Loading exercise...');
  
  try {
    // Get exercise from static library
    const exercise = TOPIC_EXERCISES[topicId] || TOPIC_EXERCISES.variables;
    
    if (!exercise) {
      showToast('error', 'Exercise not found');
      return;
    }

    // Remove old panel
    document.querySelector('.learning-path-exercise-panel')?.remove();

    // Create exercise panel
    const panel = document.createElement('div');
    panel.className = 'learning-path-exercise-panel';
    panel.style.cssText = `
      position: fixed;
      top: 100px;
      right: 24px;
      width: 350px;
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
      z-index: 99;
      max-height: 70vh;
      overflow-y: auto;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    `;

    panel.innerHTML = `
      <div style="font-weight: 700; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
        📝 ${exercise.title}
      </div>
      <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px; line-height: 1.5;">
        ${exercise.description}
      </div>
      
      <div style="background: var(--bg-surface); padding: 10px; border-radius: 6px; margin-bottom: 12px;">
        <div style="font-size: 11px; font-weight: 600; color: var(--amber); margin-bottom: 6px;">💻 Starter Code:</div>
        <pre style="font-size: 11px; color: var(--text-code); margin: 0; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;"><code>${exercise.starter_code}</code></pre>
      </div>

      ${exercise.test_cases && exercise.test_cases.length > 0 ? `
        <div style="margin-bottom: 12px;">
          <div style="font-size: 11px; font-weight: 600; color: var(--green); margin-bottom: 6px;">✅ Test Case:</div>
          ${exercise.test_cases.map((tc, i) => `
            <div style="background: var(--bg-surface); padding: 8px; border-radius: 4px; margin-bottom: 6px; font-size: 11px;">
              <div style="color: var(--text-muted);"><strong>Input:</strong> ${tc.input}</div>
              <div style="color: var(--green);"><strong>Expected:</strong> ${tc.output}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${exercise.hints && exercise.hints.length > 0 ? `
        <details style="margin-bottom: 12px;">
          <summary style="cursor: pointer; color: var(--amber); font-size: 12px; font-weight: 600;">💡 Hints</summary>
          <ul style="margin-top: 8px; font-size: 11px; color: var(--text-muted); list-style: none; padding-left: 8px;">
            ${exercise.hints.map(h => `<li style="margin-bottom: 4px;">• ${h}</li>`).join('')}
          </ul>
        </details>
      ` : ''}

      <button 
        onclick="learningPath.completeTopic('${topicId}'); document.querySelector('.learning-path-exercise-panel')?.remove();"
        style="
          width: 100%;
          margin-top: 12px;
          padding: 8px;
          background: var(--green);
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          color: white;
          font-size: 12px;
          transition: all 0.2s;
        "
        onmouseover="this.style.background='#059669'"
        onmouseout="this.style.background='var(--green)'"
      >
        ✅ Mark Complete
      </button>
    `;

    document.body.appendChild(panel);
    showToast('success', '✅ Exercise loaded!');
    closeModal();

  } catch (error) {
    console.error('Exercise loading failed:', error);
    showToast('error', 'Failed to load exercise: ' + error.message);
  }
}
// ═══════════════════════════════════════════
// LEARNING PATH GENERATOR CLASS
// ═══════════════════════════════════════════

class LearningPathGenerator {
  constructor() {
    this.userProfile = this.loadUserProfile();
    this.learningPaths = this.initializePaths();
  }

  loadUserProfile() {
    const saved = localStorage.getItem('cd_learning_profile');
    if (saved) {
      return JSON.parse(saved);
    }
    
    return {
      weakAreas: {},
      strongAreas: {},
      completedTopics: [],
      currentLevel: 'beginner',
      totalErrors: 0,
      streakDays: 0,
      lastActive: Date.now()
    };
  }

  saveUserProfile() {
    localStorage.setItem('cd_learning_profile', JSON.stringify(this.userProfile));
  }

  analyzeError(code, errorMsg, category) {
    const topics = this.detectTopics(code, errorMsg, category);
    
    topics.forEach(topic => {
      this.userProfile.weakAreas[topic] = (this.userProfile.weakAreas[topic] || 0) + 1;
    });
    
    this.userProfile.totalErrors++;
    this.userProfile.lastActive = Date.now();
    this.saveUserProfile();
    
    if (this.userProfile.totalErrors >= 5) {
      this.showLearningPathWidget();
    }
  }

  detectTopics(code, errorMsg, category) {
    const topics = [];
    
    const keywords = {
      'loops': ['for', 'while', 'range', 'iterator', 'loop'],
      'functions': ['def', 'function', 'return', 'parameter', 'argument'],
      'lists': ['list', 'array', '[', ']', 'append', 'index'],
      'dictionaries': ['dict', '{', '}', 'key', 'value'],
      'conditionals': ['if', 'else', 'elif', 'condition'],
      'strings': ['str', 'string', '"', "'", 'substring'],
      'file_io': ['open', 'read', 'write', 'file'],
      'oop': ['class', 'self', 'object', '__init__'],
      'exceptions': ['try', 'except', 'raise', 'error'],
      'async': ['async', 'await', 'promise', 'fetch']
    };
    
    const codeL = code.toLowerCase();
    for (const [topic, keys] of Object.entries(keywords)) {
      if (keys.some(k => codeL.includes(k))) {
        topics.push(topic);
      }
    }
    
    const errorL = errorMsg.toLowerCase();
    if (errorL.includes('index')) topics.push('lists');
    if (errorL.includes('key')) topics.push('dictionaries');
    if (errorL.includes('type')) topics.push('data_types');
    if (errorL.includes('syntax')) topics.push('syntax_basics');
    if (errorL.includes('name')) topics.push('variables');
    
    return [...new Set(topics)];
  }

  initializePaths() {
  return {
    python_beginner: {
      name: 'Python Fundamentals',
      level: 'beginner',
      duration: '4 weeks',
      topics: [
        { id: 'variables', name: 'Variables & Data Types', duration: '3 days', exercises: 5, description: 'Learn Python variables, strings, numbers' },
        { id: 'conditionals', name: 'If-Else Statements', duration: '3 days', exercises: 6, description: 'Master conditional logic' },
        { id: 'loops', name: 'Loops (For & While)', duration: '5 days', exercises: 8, description: 'Understand iteration' },
        { id: 'functions', name: 'Functions & Modules', duration: '5 days', exercises: 7, description: 'Create reusable code' },
        { id: 'lists', name: 'Lists & Arrays', duration: '4 days', exercises: 10, description: 'Work with collections' },
        { id: 'dictionaries', name: 'Dictionaries & Sets', duration: '4 days', exercises: 8, description: 'Master key-value data' },
        { id: 'file_io', name: 'File Operations', duration: '3 days', exercises: 5, description: 'Read and write files' },
        { id: 'oop', name: 'Classes and Objects', duration: '5 days', exercises: 12, description: 'Object-oriented programming' },
        { id: 'exceptions', name: 'Try-Except Handling', duration: '4 days', exercises: 8, description: 'Error handling' }
      ]
    }
  };
}

  generatePersonalizedPath() {
    const weakTopics = Object.entries(this.userProfile.weakAreas)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }));
    
    if (weakTopics.length === 0) {
      return this.learningPaths.python_beginner;
    }
    
    const customPath = {
      name: 'Your Personalized Path',
      level: this.userProfile.currentLevel,
      duration: 'Flexible',
      topics: []
    };
    
    Object.values(this.learningPaths).forEach(path => {
      path.topics.forEach(topic => {
        const isWeak = weakTopics.some(w => topic.id.includes(w.topic) || w.topic.includes(topic.id));
        if (isWeak && !customPath.topics.find(t => t.id === topic.id)) {
          customPath.topics.push({
            ...topic,
            priority: weakTopics.find(w => topic.id.includes(w.topic)) ? weakTopics.find(w => topic.id.includes(w.topic)).count : 0
          });
        }
      });
    });
    
    customPath.topics.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    
    return customPath.topics.length > 0 ? customPath : this.learningPaths.python_beginner;
  }

showLearningPathWidget() {
  const existing = document.getElementById('learning-path-widget');
  if (existing) existing.remove();

  // If there's an 'Open Learning Path' quick button remove it when showing the full widget
  const openBtn = document.getElementById('open-learning-path-btn');
  if (openBtn) openBtn.remove();
    
    const path = this.generatePersonalizedPath();
    const progress = this.calculateProgress(path);
    const topWeakAreas = Object.entries(this.userProfile.weakAreas).sort((a, b) => b[1] - a[1]).slice(0, 3);
    
    const widget = document.createElement('div');
    widget.id = 'learning-path-widget';
    widget.style.cssText = 'position:fixed;bottom:24px;left:24px;width:350px;background:var(--bg-elevated);border:1px solid var(--border);border-radius:12px;padding:20px;z-index:95;box-shadow:0 8px 32px rgba(0,0,0,0.3);';
    
    let html = '<div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:16px;"><div><div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;margin-bottom:4px;">📚 Your Learning Path</div><div style="font-size:16px;font-weight:700;color:var(--text-primary);">' + path.name + '</div></div><button onclick="closeLearningPath()" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:18px;">×</button></div>';
    
    html += '<div style="background:var(--bg-surface);padding:12px;border-radius:8px;margin-bottom:12px;"><div style="font-size:11px;color:var(--text-muted);margin-bottom:6px;">Overall Progress</div><div style="display:flex;align-items:center;gap:12px;"><div style="flex:1;height:8px;background:var(--bg-base);border-radius:99px;overflow:hidden;"><div style="height:100%;background:var(--amber);width:' + progress + '%;transition:width 0.5s;"></div></div><div style="font-size:18px;font-weight:700;color:var(--amber);">' + progress + '%</div></div></div>';
    
    if (topWeakAreas.length > 0) {
      html += '<div style="margin-bottom:12px;"><div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;">⚠️ Focus On:</div>';
      topWeakAreas.forEach(function([topic, count]) {
        html += '<div style="background:var(--red-bg);padding:6px 10px;border-radius:6px;margin-bottom:4px;font-size:12px;color:var(--red);">' + topic.replace('_', ' ') + ' - ' + count + ' errors</div>';
      });
      html += '</div>';
    }
    
    html += '<div style="max-height:200px;overflow-y:auto;margin-bottom:12px;">';
    // FIXED: Show ALL topics, not just first 5
    path.topics.forEach((topic, i) => {
      const isCompleted = this.userProfile.completedTopics.includes(topic.id);
      const isCurrent = i === this.userProfile.completedTopics.length;
      const icon = isCompleted ? '✅' : isCurrent ? '🔥' : '⭕';
      const borderColor = isCompleted ? 'var(--green)' : isCurrent ? 'var(--amber)' : 'var(--border)';
      html += '<div style="display:flex;align-items:start;gap:12px;padding:10px;border-radius:6px;margin-bottom:6px;border-left:3px solid ' + borderColor + ';"><div style="font-size:20px;">' + icon + '</div><div style="flex:1;"><div style="font-size:13px;font-weight:600;color:var(--text-primary);">' + topic.name + '</div><div style="font-size:11px;color:var(--text-muted);">' + topic.duration + ' • ' + topic.exercises + ' exercises</div></div></div>';
    });
    html += '</div>';
    
    html += '<button onclick="openFullLearningPath()" style="width:100%;padding:10px;background:var(--amber);color:#0e0e10;border:none;border-radius:6px;cursor:pointer;font-weight:600;font-size:13px;">🚀 Start Learning Path</button>';
    html += '<div style="font-size:10px;color:var(--text-muted);text-align:center;margin-top:8px;">Based on your ' + this.userProfile.totalErrors + ' coding sessions</div>';
    
    widget.innerHTML = html;
    document.body.appendChild(widget);
  }
  calculateProgress(path) {
    const completed = this.userProfile.completedTopics.length;
    const total = path.topics.length;
    return Math.round((completed / total) * 100);
  }

  completeTopic(topicId) {
    if (!this.userProfile.completedTopics.includes(topicId)) {
      this.userProfile.completedTopics.push(topicId);
      this.saveUserProfile();
      showToast('success', '🎉 Topic completed! Keep going!');
      this.showLearningPathWidget();
    }
  }

  generateCertificate() {
    if (this.userProfile.completedTopics.length < 5) {
      showToast('error', 'Complete at least 5 topics to get certificate');
      return;
    }
    
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#0e0e10';
    ctx.fillRect(0, 0, 1200, 800);
    
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, 1120, 720);
    
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Achievement', 600, 150);
    
    ctx.fillStyle = '#f1f0ee';
    ctx.font = '40px Arial';
    ctx.fillText(currentUser && currentUser.name ? currentUser.name : 'CodeDost Learner', 600, 250);
    
    ctx.font = '24px Arial';
    ctx.fillStyle = '#cfcfcf';
    ctx.fillText('Has successfully completed', 600, 320);
    
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 48px Arial';
    ctx.fillText(this.userProfile.completedTopics.length + ' Coding Topics', 600, 400);
    
    ctx.fillStyle = '#cfcfcf';
    ctx.font = '20px Arial';
    ctx.fillText(new Date().toLocaleDateString('en-PK'), 600, 500);
    
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 32px monospace';
    ctx.fillText('{ CodeDost }', 600, 650);
    
    canvas.toBlob(function(blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'codedost-certificate.png';
      a.click();
      showToast('success', '🎓 Certificate downloaded!');
    });
  }
}

const learningPath = new LearningPathGenerator();

// ═══════════════════════════════════════════
// LEARNING PATH HELPER FUNCTIONS
// ═══════════════════════════════════════════

function closeLearningPath() {
  const el = document.getElementById('learning-path-widget');
  if (el) el.remove();

  // When widget is closed create a small open button so user can reopen it
  createOpenLearningPathButton();
}

function createOpenLearningPathButton() {
  if (document.getElementById('open-learning-path-btn')) return;
  const btn = document.createElement('button');
  btn.id = 'open-learning-path-btn';
  btn.textContent = 'Open Learning Path';
  btn.style.cssText = 'position:fixed;bottom:24px;left:24px;padding:10px 12px;background:var(--amber);border:none;border-radius:8px;cursor:pointer;z-index:96;font-weight:600;color:#0e0e10;box-shadow:0 8px 24px rgba(0,0,0,0.15);';
  btn.onclick = function() {
    learningPath.showLearningPathWidget();
    const b = document.getElementById('open-learning-path-btn');
    if (b) b.remove();
  };
  document.body.appendChild(btn);
}

function openFullLearningPath() {
  const path = learningPath.generatePersonalizedPath();

  // Build topics HTML fragment
  let topicsHtml = '';
  path.topics.forEach(function(topic, i) {
    const isCompleted = learningPath.userProfile.completedTopics.includes(topic.id);
    const borderColor = isCompleted ? 'var(--green)' : 'var(--border)';
    const startBtn = !isCompleted ? '<button onclick="startTopic(\'' + topic.id + '\')" style="padding:6px 14px;background:var(--amber);border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;color:#0e0e10;">Start</button>' : '';
    const title = isCompleted ? '✅ ' + topic.name : (i + 1) + '. ' + topic.name;

    topicsHtml +=
      '<div style="background:var(--bg-surface);padding:16px;border-radius:10px;border-left:4px solid ' +
      borderColor +
      ';margin-bottom:12px;">' +
      '<div style="display:flex;justify-content:space-between;align-items:start;">' +
      '<div style="flex:1;">' +
      '<div style="font-size:15px;font-weight:600;margin-bottom:6px;">' + title + '</div>' +
      '<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">' + topic.description + '</div>' +
      '<div style="font-size:11px;color:var(--text-muted);">⏱️ ' + topic.duration + ' • 📝 ' + topic.exercises + ' exercises</div>' +
      '</div>' +
      startBtn +
      '</div>' +
      '</div>';
  });

  // If a static modal overlay exists in the DOM, reuse it so closeModal() works consistently
  const existingModal = document.getElementById('learning-path-modal-overlay');
  if (existingModal) {
    const infoEl = document.getElementById('path-info');
    const topicsContainer = document.getElementById('learning-path-topics-container');
    if (infoEl) infoEl.textContent = path.name + ' • ' + path.duration + ' • ' + path.topics.length + ' topics';
    if (topicsContainer) topicsContainer.innerHTML = topicsHtml;
    existingModal.style.display = 'flex';
    return;
  }

  // Fallback: create a dynamic modal if static overlay not present
  const modal = document.createElement('div');
  modal.id = 'learning-path-modal-overlay-dynamic';
  modal.className = 'modal-overlay';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:1000;display:flex;align-items:center;justify-content:center;';
  modal.onclick = function(e) { if (e.target === modal) closeModal(); };

  modal.innerHTML = '<div class="modal" style="max-width:700px;width:90%;max-height:90vh;overflow-y:auto;background:var(--bg-elevated);border:1px solid var(--border);border-radius:12px;padding:24px;">'
    + '<h2 style="color:var(--text-primary);margin-bottom:8px;">📚 Your Complete Learning Path</h2>'
    + '<p style="color:var(--text-muted);margin-bottom:20px;">' + path.name + ' • ' + path.duration + ' • ' + path.topics.length + ' topics</p>'
    + topicsHtml
    + '<div style="margin-top:20px;display:flex;gap:12px;"><button onclick="learningPath.generateCertificate()" class="modal-save" style="flex:1;padding:10px;background:var(--amber);color:#0e0e10;border:none;border-radius:6px;cursor:pointer;font-weight:600;">🎓 Get Certificate</button><button onclick="closeModal()" class="modal-save" style="flex:1;padding:10px;background:var(--bg-surface);color:var(--text-primary);border:1px solid var(--border);border-radius:6px;cursor:pointer;font-weight:600;">Close</button></div></div>';

  document.body.appendChild(modal);
}

// The `startTopic` function is defined earlier (kept as the canonical implementation).
// Removed duplicated/corrupted second copy to avoid conflicts.

function closeModal() {
  const apiKeyModal = document.getElementById('modal-overlay');
  const learningPathModal = document.getElementById('learning-path-modal-overlay');
  const dynamicLP = document.getElementById('learning-path-modal-overlay-dynamic');

  if (apiKeyModal) apiKeyModal.classList.remove('open');
  if (learningPathModal) learningPathModal.style.display = 'none';
  if (dynamicLP) dynamicLP.remove();
}

function closeAuthModalOutside(e) {
  if (!e || !e.target) return; // Safety check
  const modal = document.getElementById('auth-modal-overlay');
  if (modal && e.target === modal) {
    modal.style.display = 'none';
  }
}

function switchAuthTab(tab) {
  if (!tab) return;
  authMode = tab;
  
  const formLogin = document.getElementById('auth-form-login');
  const formReg = document.getElementById('auth-form-register');
  const formForgot = document.getElementById('auth-form-forgot');
  const formReset = document.getElementById('auth-form-reset');
  const tabLogin = document.getElementById('auth-tab-login');
  const tabReg = document.getElementById('auth-tab-register');
  const tabForgot = document.getElementById('auth-tab-forgot');
  const errorMsg = document.getElementById('auth-error-msg');
  const successMsg = document.getElementById('auth-success-msg');
  const btn = document.getElementById('auth-submit-btn');
  const title = document.getElementById('auth-modal-title');
  
  // Hide all forms and tabs
  if (formLogin) formLogin.style.display = 'none';
  if (formReg) formReg.style.display = 'none';
  if (formForgot) formForgot.style.display = 'none';
  if (formReset) formReset.style.display = 'none';
  if (tabLogin) tabLogin.classList.remove('active-tab');
  if (tabReg) tabReg.classList.remove('active-tab');
  if (tabForgot) tabForgot.classList.remove('active-tab');
  if (errorMsg) errorMsg.style.display = 'none';
  if (successMsg) successMsg.style.display = 'none';
  
  if (tab === 'login') {
    if (formLogin) formLogin.style.display = 'block';
    if (tabLogin) tabLogin.classList.add('active-tab');
    if (title) title.textContent = '👤 Login to CodeDost';
    if (btn) btn.textContent = 'Login';
  } else if (tab === 'register') {
    if (formReg) formReg.style.display = 'block';
    if (tabReg) tabReg.classList.add('active-tab');
    if (title) title.textContent = '👤 Sign Up — It\'s Free';
    if (btn) btn.textContent = 'Sign Up';
  } else if (tab === 'forgot') {
    if (formForgot) formForgot.style.display = 'block';
    if (tabForgot) tabForgot.classList.add('active-tab');
    if (title) title.textContent = '🔑 Forgot Password?';
    if (btn) btn.textContent = 'Send Reset Link';
  } else if (tab === 'reset') {
    if (formReset) formReset.style.display = 'block';
    if (title) title.textContent = '🔐 Reset Password';
    if (btn) btn.textContent = 'Reset Password';
  }
}

function submitAuth() {
  if (authMode === 'login') {
    handleLoginNew();
  } else if (authMode === 'register') {
    handleRegisterNew();
  } else if (authMode === 'forgot') {
    handleForgotPassword();
  } else if (authMode === 'reset') {
    handleResetPassword();
  }
}

function updateAuthUI() {
  const authBtn = document.getElementById('auth-btn');
  const quotaPill = document.getElementById('quota-pill');
  
  if (authToken && currentUser && authBtn) {
    // User is logged in
    authBtn.textContent = `👤 ${currentUser.name || 'Account'}`;
    authBtn.style.background = 'var(--green)';
    if (quotaPill) quotaPill.style.display = 'block';
  } else if (authBtn) {
    // User is not logged in
    authBtn.textContent = '👤 Login / Sign Up';
    authBtn.style.background = 'var(--purple)';
    if (quotaPill) quotaPill.style.display = 'none';
  }
}

// Integrate with existing analyze function
if (typeof window.analyzeCode === 'function') {
  const originalAnalyze = window.analyzeCode;
  window.analyzeCode = async function() {
    const code = document.getElementById('code-input').value;
    const error = document.getElementById('error-input').value;
    
    await originalAnalyze();
    
    const category = detectErrorCategory(error);
    learningPath.analyzeError(code, error, category);
  };
}

function detectErrorCategory(error) {
  const e = (error || '').toLowerCase();
  if (e.includes('syntax')) return 'syntax_error';
  if (e.includes('type')) return 'type_error';
  if (e.includes('index')) return 'index_error';
  if (e.includes('null') || e.includes('none') || e.includes("noneType".toLowerCase())) return 'null_reference';
  if (e.includes('import') || e.includes('module') || e.includes('no module')) return 'import_error';
  if (e.includes('name') || e.includes('undefined') || e.includes('not defined')) return 'scope_error';
  return 'other';
}
// ═══════════════════════════════════════
// FEATURE 17: WHATSAPP REFERRAL
// ═══════════════════════════════════════
function shareOnWhatsApp() {
  const msg = encodeURIComponent(
    "Yaar try karo CodeDost — Pakistan ka pehla AI coding tutor!\n\n" +
      "Apna buggy code paste karo, Roman Urdu mein explain karta hai + desi analogies + code run karta hai browser mein 🇵🇰\n\n" +
      "100% FREE. No login. No download.\n\n" +
      "👉 code-dost.vercel.app",
  );
  window.open("https://wa.me/?text=" + msg, "_blank");
}


// ── KEYBOARD SHORTCUTS ─────────────────
document.addEventListener("keydown", (e) => {
  // Ctrl+Enter = Submit
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    analyzeCode();
  }
  // Escape = close modal
  if (e.key === "Escape") {
    document.getElementById("modal-overlay").classList.remove("open");
    document.getElementById("help-modal").classList.remove("open");
    document.getElementById("share-card-modal").classList.remove("open");
  }
  if (
    e.key === "?" &&
    !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)
  ) {
    openHelpModal();
  }
});

// Tab key in code editor inserts spaces (guarded)
const _codeInputEl = document.getElementById("code-input");
if (_codeInputEl) {
  _codeInputEl.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = this.selectionStart;
      const end = this.selectionEnd;
      this.value = this.value.substring(0, start) + "  " + this.value.substring(end);
      this.selectionStart = this.selectionEnd = start + 2;
    }
  });
}


// ═══════════════════════════════════════
// INIT
// ═══════════════════════════════════════
(function init() {
  // Load user preferences from localStorage
  const savedMode = localStorage.getItem("cd_mode");
  if (savedMode && ["urdu", "mixed", "english"].includes(savedMode)) {
    currentMode = savedMode;
    const modeBtn = document.querySelector(
      `.mode-btn[data-mode="${savedMode}"]`,
    );
    if (modeBtn) {
      document
        .querySelectorAll(".mode-btn")
        .forEach((b) => b.classList.remove("active"));
      modeBtn.classList.add("active");
    }
  }

  // Load theme preference
  const savedTheme = localStorage.getItem("cd_theme") || "dark";
  currentTheme = savedTheme;
  document.documentElement.setAttribute("data-theme", savedTheme);
  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    themeBtn.textContent = savedTheme === "dark" ? "🌙" : "☀️";
    if (savedTheme === "light") themeBtn.classList.add("active");
  }

  const savedLang = localStorage.getItem("cd_lang");
  if (savedLang && LANG_TAGS[savedLang]) {
    currentLang = savedLang;
    document.getElementById("lang-picker").value = savedLang;
    updateLang();
  }

  initExampleChips();
  initModeButtons();
  renderHistory();
  renderPatterns();

  // Initialize pattern date filter
  const _patternDateFilter = document.getElementById("pattern-date-filter");
  if (_patternDateFilter) _patternDateFilter.addEventListener("change", filterPatternsByDate);

  // Show modal if no key saved for ANY provider
  const hasAnyKey = ["groq", "gemini", "openrouter"].some((p) =>
    localStorage.getItem(PROVIDERS[p].storageKey),
  );
  if (!hasAnyKey) setTimeout(openModal, 800);

  // New feature inits
  initStreak();
  loadUsageCounter();
  initEditorCounter();
  initHistorySwipe();
  showConceptOfDay();
// Init auth UI
  updateAuthUI();
  if (authToken) loadQuotaFromBackend();
  // Register service worker for PWA
  // if ("serviceWorker" in navigator) {
  //   navigator.serviceWorker
  //     .register("sw.js")
  //     .then((registration) => console.log("SW registered"))
  //     .catch((error) => console.log("SW registration failed"));
  // }
})();

const _clearCodeBtn = document.querySelector("#clear-code-btn");
if (_clearCodeBtn) _clearCodeBtn.addEventListener("click", clearBoard);
function clearBoard() {
  if (confirm("Are you sure you want to clear the code and start fresh?")) {
    document.getElementById("code-input").value = "";
    showToast("success", "Board cleared! Ab naya code paste karo.");
  }
}
