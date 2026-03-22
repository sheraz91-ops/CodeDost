// ═══════════════════════════════════════
// STATE
// ═══════════════════════════════════════
let currentMode = 'urdu';   // urdu | mixed | english
let currentLang = 'python';
let sessionHistory = JSON.parse(localStorage.getItem('cd_history') || '[]');
let mistakePatterns = JSON.parse(localStorage.getItem('cd_patterns') || '{}');

const LANG_TAGS = {
  python: 'script.py',
  javascript: 'app.js',
  java: 'Main.java',
  cpp: 'main.cpp',
  html: 'index.html',
  sql: 'query.sql'
};

// ═══════════════════════════════════════
// SYSTEM PROMPT — THE HEART OF CODEDOST
// ═══════════════════════════════════════
function buildSystemPrompt() {
  const modeInstructions = {
    urdu: `You MUST respond primarily in Roman Urdu (Urdu written in English letters) mixed with essential English technical terms. This is how Pakistani CS students naturally talk: "Yaar, is error ka matlab hai ke..." or "Dekho, tum ne yahan variable declare nahi kiya..." Keep Urdu dominant (70%) with English technical words (30%).`,
    mixed: `Respond in a 50/50 mix of Roman Urdu and English. Switch naturally between both as Pakistani developers do in real life.`,
    english: `Respond entirely in clear, simple English. Friendly and encouraging tone, like a senior developer helping a junior.`
  };

  return `You are CodeDost, a warm, encouraging AI coding tutor for Pakistani university students. You explain code errors in a friendly, big-brother/dost style — never condescending.

LANGUAGE INSTRUCTION: ${modeInstructions[currentMode]}

CRITICAL: You MUST respond with ONLY a valid JSON object. No text before or after. No markdown code fences. No explanation outside the JSON. Just the raw JSON object.

JSON FORMAT (fill every field):
{
  "error_type": "Short name of the error (e.g. SyntaxError, TypeError, LogicError, UndefinedVariable, IndexError, NullReference, AsyncError, ImportError)",
  "severity": "beginner OR intermediate OR advanced",
  "plain_explanation": "2-3 sentences explaining WHY this error happened in ${currentMode === 'english' ? 'simple English' : 'Roman Urdu mixed with English technical terms'}. Start with 'Yaar' or 'Dekho' or 'Bhai' for urdu/mixed mode. Make it conversational.",
  "desi_analogy": "A relatable Pakistani everyday analogy that explains the concept. Use rickshaw, chai, biryani, dukaan, gate, number plate, register, queue, ghar, darwaza etc. Format: '${currentMode !== 'english' ? 'Samjho aise: [analogy in Roman Urdu]' : 'Think of it like: [analogy]'}'",
  "fixed_code": "The complete corrected code. Keep same structure, just fix the bug(s). No markdown backticks.",
  "fix_bullets": [
    "First change kya kiya aur kyun (in ${currentMode === 'english' ? 'English' : 'Roman Urdu'})",
    "Second change if any",
    "Third change if any"
  ],
  "concept_to_study": "The one CS concept this error reveals a gap in (e.g. 'Variable Scope', 'Data Types', 'Array Indexing', 'Async/Await', 'OOP Inheritance', 'Error Handling')",
  "concept_why": "${currentMode !== 'english' ? 'Is concept ko samjhoge toh aisi galtiyan nahi hongi' : 'Understanding this will prevent similar bugs'}",
  "concept_search": "Exact YouTube/Google search query to learn this concept (e.g. 'Python list indexing tutorial for beginners')",
  "mistake_category": "ONE of these exact strings: syntax_error, logic_error, type_error, null_reference, scope_error, async_error, import_error, index_error, other"
}

IMPORTANT RULES:
1. ALWAYS produce valid JSON — no trailing commas, no unescaped quotes in strings
2. fixed_code must be complete and runnable — not just the changed lines
3. desi_analogy must be genuinely relatable to a Pakistani student's daily life
4. Be encouraging — add a small motivational note in plain_explanation like "(Ye common mistake hai, ghhabrao mat!)"
5. fix_bullets should have 2-4 items minimum`;
}

// ═══════════════════════════════════════
// EXAMPLE SNIPPETS
// ═══════════════════════════════════════
const EXAMPLES = {
  syntax: {
    lang: 'python',
    code: `def calculate_total(items):
    total = 0
    for item in items
        total += item['price']
    return total

result = calculate_total([{'price': 100}, {'price': 250}])
print(result)`,
    error: `SyntaxError: expected ':' (line 3)`
  },
  typeerror: {
    lang: 'python',
    code: `def get_username(user):
    name = user['name']
    upper_name = name.upper()
    return "Hello " + upper_name + " your age is " + user['age']

print(get_username({'name': 'Ali', 'age': 21}))`,
    error: `TypeError: can only concatenate str (not "int") to str`
  },
  index: {
    lang: 'python',
    code: `students = ['Ahmed', 'Sara', 'Bilal', 'Fatima']

for i in range(len(students) + 1):
    print(f"Student {i+1}: {students[i]}")`,
    error: `IndexError: list index out of range`
  },
  undefined: {
    lang: 'javascript',
    code: `function calculateDiscount(price) {
    let discountRate = 0.1;

    if (price > 1000) {
        let discountRate = 0.2;
    }

    return price - (price * discountRate);
}

console.log(calculateDiscount(1500));`,
    error: `Expected: 300 discount, Got: 150 discount (wrong result)`
  },
  async: {
    lang: 'javascript',
    code: `function getUserData(userId) {
    const response = fetch(\`https://api.example.com/users/\${userId}\`);
    const data = response.json();
    return data.name;
}

const name = getUserData(123);
console.log("User:", name);`,
    error: `TypeError: response.json is not a function (data shows [object Promise])`
  },
  null: {
    lang: 'python',
    code: `def find_student(students, name):
    for student in students:
        if student['name'] == name:
            return student
    # Function ends without returning anything

class_list = [{'name': 'Ahmed', 'grade': 'A'}, {'name': 'Sara', 'grade': 'B'}]
result = find_student(class_list, 'Usman')
print(result['grade'])`,
    error: `TypeError: 'NoneType' object is not subscriptable`
  }
};

function loadExample(key) {
  const ex = EXAMPLES[key];
  if (!ex) return;
  document.getElementById('code-input').value = ex.code;
  document.getElementById('error-input').value = ex.error;
  const picker = document.getElementById('lang-picker');
  picker.value = ex.lang;
  updateLang();
  showToast('success', `Example loaded: ${key}`);
}

// Attach click listeners for example chips (decoupled from HTML inline handlers)
function initExampleChips() {
  document.querySelectorAll('.example-chip').forEach(button => {
    button.addEventListener('click', () => {
      loadExample(button.dataset.example);
    });
  });
}

// ═══════════════════════════════════════
// PROVIDER CONFIG
// ═══════════════════════════════════════
let currentProvider = localStorage.getItem('cd_provider') || 'groq';

const PROVIDERS = {
  groq: {
    url:   'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.3-70b-versatile',
    header: key => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` }),
    keyPrefix: 'gsk_',
    storageKey: 'cd_api_key_groq',
    label: 'Groq'
  },
  gemini: {
    url:   null,   // handled separately via gemini REST
    model: 'gemini-1.5-flash',
    header: key => ({ 'Content-Type': 'application/json' }),
    keyPrefix: 'AIza',
    storageKey: 'cd_api_key_gemini',
    label: 'Gemini'
  },
  openrouter: {
    url:   'https://openrouter.ai/api/v1/chat/completions',
    model: 'meta-llama/llama-3.1-8b-instruct:free',
    header: key => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
      'HTTP-Referer': 'https://codedost.app',
      'X-Title': 'CodeDost'
    }),
    keyPrefix: 'sk-or-',
    storageKey: 'cd_api_key_openrouter',
    label: 'OpenRouter'
  }
};

function getActiveKey() {
  return localStorage.getItem(PROVIDERS[currentProvider].storageKey) || '';
}

// Utility: parse JSON robustly even with markdown/fence noise
function safeJSONParse(text) {
  if (!text || typeof text !== 'string') return null;
  const cleaned = text
    .replace(/^\s*```json\s*/i, '')
    .replace(/^\s*```\s*/i, '')
    .replace(/```\s*$/i, '')
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
      console.error('safeJSONParse failed', innerErr);
      return null;
    }
  }
}

function validateResult(r) {
  if (!r || typeof r !== 'object') return false;
  const required = ['error_type','severity','plain_explanation','desi_analogy','fixed_code','fix_bullets','concept_to_study','concept_why','concept_search','mistake_category'];
  const hasAll = required.every(k => Object.prototype.hasOwnProperty.call(r, k));
  if (!hasAll) return false;
  if (!Array.isArray(r.fix_bullets) || r.fix_bullets.length < 2) return false;
  const severityValues = ['beginner','intermediate','advanced'];
  if (!severityValues.includes(String(r.severity))) return false;
  return true;
}

// ═══════════════════════════════════════
// MAIN ANALYZE FUNCTION
// ═══════════════════════════════════════
async function analyzeCode() {
  const code = document.getElementById('code-input').value.trim();
  const errorMsg = document.getElementById('error-input').value.trim();

  if (!code) { showToast('error', 'Pehle code paste karo yaar!'); return; }

  const apiKey = getActiveKey();
  if (!apiKey) {
    showToast('error', 'API key daalo pehle — upar wali button se');
    openModal(); return;
  }

  const btn = document.getElementById('submit-btn');
  btn.classList.add('loading'); btn.disabled = true;

  try {
    // Set up timeout controller (30 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const userMessage = `Language: ${currentLang.toUpperCase()}\n\nCode:\n${code}\n\n${errorMsg ? `Error Message: ${errorMsg}` : '(No error message — analyze the code for bugs)'}`;
    let rawContent = '';

    if (currentProvider === 'gemini') {
      // Gemini REST API (different format)
      const gemUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const gemBody = {
        contents: [{
          parts: [{ text: buildSystemPrompt() + '\n\nUser request:\n' + userMessage }]
        }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 1800 }
      };
      const res = await fetch(gemUrl, { 
        method:'POST', 
        headers:{'Content-Type':'application/json'}, 
        body: JSON.stringify(gemBody),
        signal: controller.signal
      });
      if (!res.ok) { const e = await res.json().catch(()=>({})); throw new Error(e?.error?.message || `Gemini Error ${res.status}`); }
      const d = await res.json();
      rawContent = d.candidates?.[0]?.content?.parts?.[0]?.text || '';

    } else {
      // OpenAI-compatible (Groq + OpenRouter)
      const p = PROVIDERS[currentProvider];
      const res = await fetch(p.url, {
        method: 'POST',
        headers: p.header(apiKey),
        body: JSON.stringify({
          model: p.model,
          max_tokens: 1800,
          temperature: 0.4,
          messages: [
            { role: 'system', content: buildSystemPrompt() },
            { role: 'user',   content: userMessage }
          ]
        }),
        signal: controller.signal
      });
      if (!res.ok) { const e = await res.json().catch(()=>({})); throw new Error(e?.error?.message || `API Error ${res.status}`); }
      const d = await res.json();
      rawContent = d.choices?.[0]?.message?.content?.trim() || '';
    }

    // Clear timeout on success
    clearTimeout(timeoutId);

    // Parse JSON — strip any accidental markdown fences
    const result = safeJSONParse(rawContent);
    if (!result || !validateResult(result)) {
      throw new Error('Invalid or malformed JSON response from model');
    }

    renderOutput(result, code, errorMsg);
    saveToHistory(result, code, errorMsg);
    updatePatterns(result.mistake_category, errorMsg, code);
    showToast('success', `Explanation ready! (via ${PROVIDERS[currentProvider].label})`);

  } catch(err) {
    console.error('CodeDost error:', err);
    let msg = 'Kuch error ho gaya. Dobara try karo.';
    if (err.name === 'AbortError') msg = 'Request timeout — 30 seconds se zyada laga. Dobara try karo.';
    else if (err.message.includes('API key') || err.message.includes('401')) msg = 'API key galat hai. Check karo.';
    else if (err.message.includes('quota') || err.message.includes('429')) msg = 'Rate limit — thodi der baad try karo.';
    else if (err.message.includes('JSON')) msg = 'Response parse nahi hua. Dobara try karo.';
    else if (err.message.includes('fetch')) msg = 'Internet connection check karo.';
    showToast('error', msg);
  } finally {
    btn.classList.remove('loading'); btn.disabled = false;
  }
}

// ═══════════════════════════════════════
// RENDER OUTPUT
// ═══════════════════════════════════════
function renderOutput(r, originalCode, errorMsg) {
  // Show output panel
  document.getElementById('output-empty').style.display = 'none';
  const content = document.getElementById('output-content');
  content.classList.add('visible');

  // Store original code for diff
  window.originalCode = originalCode;

  // Error type + severity
  document.getElementById('out-error-type').textContent = r.error_type || 'Unknown Error';
  const sevEl = document.getElementById('out-severity');
  sevEl.textContent = r.severity ? capitalize(r.severity) : 'Unknown';
  sevEl.className = 'severity-badge sev-' + (r.severity || 'beginner');

  // Explanation
  document.getElementById('out-explanation').textContent = r.plain_explanation || '—';

  // Analogy
  document.getElementById('out-analogy').innerHTML = r.desi_analogy
    ? `<strong>🫖 Desi Analogy:</strong> ${r.desi_analogy}`
    : '—';

  // Fixed code with syntax highlighting
  const langClass = {
    python: 'language-python', javascript: 'language-javascript',
    java: 'language-java', cpp: 'language-cpp',
    html: 'language-html', sql: 'language-sql'
  }[currentLang] || 'language-python';

  const codeEl = document.getElementById('out-fixed-code');
  codeEl.className = langClass;
  codeEl.textContent = r.fixed_code || '# No fix generated';
  document.getElementById('out-fix-lang').textContent = LANG_TAGS[currentLang] || 'fixed_code.py';
  Prism.highlightElement(codeEl);

  // Reset diff view
  document.getElementById('code-diff-view').style.display = 'none';
  document.getElementById('out-fixed-code').parentElement.style.display = 'block';
  document.getElementById('diff-toggle-btn').textContent = 'Show Diff';

  // Fix bullets
  const fixList = document.getElementById('out-fix-list');
  fixList.innerHTML = '';
  if (r.fix_bullets && Array.isArray(r.fix_bullets)) {
    r.fix_bullets.forEach(bullet => {
      const li = document.createElement('li');
      li.textContent = bullet;
      fixList.appendChild(li);
    });
  }

  // Concept card
  document.getElementById('out-concept-name').textContent = r.concept_to_study || 'General Debugging';
  document.getElementById('out-concept-why').textContent = r.concept_why || '';
  const conceptLink = document.getElementById('out-concept-link');
  const searchQuery = r.concept_search || r.concept_to_study || 'programming debugging tutorial';
  conceptLink.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
  conceptLink.textContent = `"${searchQuery}" ↗`;

  // Scroll output into view on mobile
  if (window.innerWidth < 900) {
    document.getElementById('panel-right').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ═══════════════════════════════════════
// HISTORY
// ═══════════════════════════════════════
function saveToHistory(result, code, errorMsg) {
  const entry = {
    id: Date.now(),
    time: new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' }),
    errorType: result.error_type,
    errorMsg: errorMsg || result.error_type,
    lang: currentLang,
    code: code,
    result: result
  };
  sessionHistory.unshift(entry);
  if (sessionHistory.length > 20) sessionHistory.pop();
  localStorage.setItem('cd_history', JSON.stringify(sessionHistory));
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById('history-list');
  const empty = document.getElementById('history-empty');
  const clearBtn = document.getElementById('clear-history-btn');
  if (clearBtn) {
    clearBtn.onclick = () => {
      if (confirm('History clear karna hai?')) {
        sessionHistory = [];
        localStorage.removeItem('cd_history');
        renderHistory();
        renderPatterns();
        showToast('success', 'History cleared');
      }
    };
  }
  if (sessionHistory.length === 0) {
    empty.classList.remove('hidden');
    list.classList.add('hidden');
    return;
  }

  empty.classList.add('hidden');
  list.classList.remove('hidden');
  list.innerHTML = '';

  sessionHistory.forEach(entry => {
    const div = document.createElement('div');
    div.className = 'history-item';
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
  document.getElementById('code-input').value = entry.code;
  document.getElementById('error-input').value = entry.errorMsg || '';
  const picker = document.getElementById('lang-picker');
  picker.value = entry.lang;
  currentLang = entry.lang;
  updateLang();
  renderOutput(entry.result, entry.code, entry.errorMsg);
  showToast('success', 'History se load kiya');
}

// ═══════════════════════════════════════
// MISTAKE PATTERNS
// ═══════════════════════════════════════
const PATTERN_LABELS = {
  syntax_error: 'Syntax Errors',
  logic_error: 'Logic Errors',
  type_error: 'Type Errors',
  null_reference: 'Null Reference',
  scope_error: 'Scope Errors',
  async_error: 'Async Bugs',
  import_error: 'Import Errors',
  index_error: 'Index Errors',
  other: 'Other Bugs'
};

function updatePatterns(category, errorMsg, codeSnippet) {
  if (!category) return;

  // Update old pattern counts for backward compatibility
  mistakePatterns[category] = (mistakePatterns[category] || 0) + 1;
  localStorage.setItem('cd_patterns', JSON.stringify(mistakePatterns));

  // Create detailed pattern entry
  const patterns = JSON.parse(localStorage.getItem('codedost-patterns') || '[]');
  const now = new Date().toISOString();

  // Extract meaningful pattern from error message
  const pattern = errorMsg.length > 100 ? errorMsg.substring(0, 100) + '...' : errorMsg;

  // Check if similar pattern already exists
  const existingPattern = patterns.find(p =>
    p.language === currentLang &&
    p.errorType === category &&
    p.pattern === pattern
  );

  if (existingPattern) {
    existingPattern.frequency += 1;
    existingPattern.lastSeen = now;
  } else {
    patterns.push({
      date: now.split('T')[0],
      language: currentLang,
      errorType: category,
      pattern: pattern,
      frequency: 1,
      lastSeen: now,
      codeSnippet: codeSnippet ? codeSnippet.substring(0, 200) : ''
    });
  }

  localStorage.setItem('codedost-patterns', JSON.stringify(patterns));
  renderPatterns();
}

function renderPatterns(patterns = null) {
  const grid = document.getElementById('pattern-grid');
  const noPatterns = document.getElementById('no-patterns');

  if (!patterns) {
    // Use old pattern system for backward compatibility
    const total = Object.values(mistakePatterns).reduce((a, b) => a + b, 0);
    if (total === 0) {
      noPatterns.classList.remove('hidden');
      grid.classList.add('hidden');
      return;
    }

    noPatterns.classList.add('hidden');
    grid.classList.remove('hidden');
    grid.innerHTML = '';

    const sorted = Object.entries(mistakePatterns).sort((a, b) => b[1] - a[1]);
    const maxVal = sorted[0][1];

    sorted.forEach(([cat, count]) => {
      const pct = Math.round((count / maxVal) * 100);
      const card = document.createElement('div');
      card.className = 'pattern-card';
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
    grid.classList.add('hidden');
    noPatterns.classList.remove('hidden');
    return;
  }

  grid.classList.remove('hidden');
  noPatterns.classList.add('hidden');

  grid.innerHTML = patterns.map(pattern => `
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
  `).join('');
}

// ═══════════════════════════════════════
// PATTERN ANALYTICS FUNCTIONS
// ═══════════════════════════════════════
function filterPatternsByDate() {
  const dateFilter = document.getElementById('pattern-date-filter').value;
  const patterns = JSON.parse(localStorage.getItem('codedost-patterns') || '[]');
  const filtered = dateFilter ? patterns.filter(p => p.date.startsWith(dateFilter)) : patterns;
  renderPatterns(filtered);
}

function clearDateFilter() {
  document.getElementById('pattern-date-filter').value = '';
  filterPatternsByDate();
}

function exportPatterns() {
  const patterns = JSON.parse(localStorage.getItem('codedost-patterns') || '[]');
  if (patterns.length === 0) {
    alert('No patterns to export!');
    return;
  }

  const csv = [
    ['Date', 'Language', 'Error Type', 'Pattern', 'Frequency', 'Last Seen'],
    ...patterns.map(p => [
      p.date,
      p.language,
      p.errorType,
      p.pattern,
      p.frequency,
      p.lastSeen
    ])
  ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `codedost-patterns-${new Date().toISOString().split('T')[0]}.csv`;
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
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/"
    });
    return pyodide;
  } catch (error) {
    console.error('Failed to load Pyodide:', error);
    throw new Error('Code execution not available - Pyodide failed to load');
  }
}

async function runCodeSandbox() {
  const code = document.getElementById('out-fixed-code').textContent.trim();
  if (!code) {
    showToast('error', 'Pehele code analyze karo!');
    return;
  }

  const executionCard = document.getElementById('card-execution');
  const loadingDiv = document.getElementById('execution-loading');
  const resultDiv = document.getElementById('execution-result');
  const runBtn = document.getElementById('run-code-btn');

  // Show execution card and loading state
  executionCard.style.display = 'block';
  loadingDiv.style.display = 'block';
  resultDiv.style.display = 'none';
  runBtn.disabled = true;
  runBtn.textContent = 'Running...';

  try {
    // Initialize Pyodide if not already done
    if (!pyodide) {
      await initPyodide();
    }

    // Execute code and capture output
    pyodide.runPython(`
import sys
from io import StringIO
import traceback

# Capture output
output_buffer = []
original_stdout = sys.stdout

class CaptureOutput:
    def write(self, text):
        output_buffer.append(text)
    def flush(self):
        pass

sys.stdout = CaptureOutput()
sys.stderr = CaptureOutput()

try:
    # Execute user code
    exec('''${code.replace(/`/g, '\\`').replace(/\$/g, '\\$')}''')
except Exception as e:
    import traceback
    traceback.print_exc()

# Restore stdout
sys.stdout = original_stdout
sys.stderr = original_stdout
    `);

    // Retrieve captured output safely via Python join (best reliability)
    let finalOutput = '';

    try {
      finalOutput = pyodide.runPython('"".join(output_buffer)');
      if (finalOutput === null || finalOutput === undefined) {
        finalOutput = '';
      }
    } catch (innerErr) {
      console.warn('Falling back to pyodide list conversion', innerErr);
      try {
        const outputBuf = pyodide.runPython('output_buffer');
        if (outputBuf && typeof outputBuf.toJs === 'function') {
          const arr = outputBuf.toJs({ depth: 1 });
          finalOutput = Array.isArray(arr) ? arr.join('') : '';
        } else if (Array.isArray(outputBuf)) {
          finalOutput = outputBuf.join('');
        }
      } catch {
        finalOutput = '';
      }
    }

    if (!finalOutput) {
      finalOutput = 'Code executed successfully (no output)';
    }

    loadingDiv.style.display = 'none';
    resultDiv.style.display = 'block';
    resultDiv.textContent = finalOutput;

    showToast('success', 'Code executed successfully!');

  } catch (error) {
    console.error('Execution error:', error);
    loadingDiv.style.display = 'none';
    resultDiv.style.display = 'block';
    resultDiv.textContent = `Execution Error: ${error.message}`;
    showToast('error', 'Code execution failed');
  } finally {
    runBtn.disabled = false;
    runBtn.textContent = '▶ Run Code';
  }
}
function setMode(mode, el) {
  currentMode = mode;
  localStorage.setItem('cd_mode', mode);
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
}

// ── FONT SIZE SLIDER ─────────────────────────
function setFontSize(px) {
  const min = 12;
  const max = 26;
  const clamped = Math.min(max, Math.max(min, px));
  document.documentElement.style.fontSize = `${clamped}px`;
  document.getElementById('font-size-range').value = clamped;
  document.getElementById('font-size-display').textContent = `${clamped}px`;
  localStorage.setItem('cd_font_size', clamped);
}

function adjustFontSize(delta) {
  const current = Number(document.getElementById('font-size-range').value) || 18;
  setFontSize(current + delta);
}

function initFontSize() {
  const saved = Number(localStorage.getItem('cd_font_size')) || 18;
  setFontSize(saved);
  document.getElementById('font-size-range').addEventListener('input', e => {
    setFontSize(Number(e.target.value));
  });
}

// ═══════════════════════════════════════
// THEME CUSTOMIZATION
// ═══════════════════════════════════════
let currentTheme = 'dark';

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('cd_theme', currentTheme);

  const themeBtn = document.getElementById('theme-toggle');
  themeBtn.textContent = currentTheme === 'dark' ? '🌙 Dark' : '☀️ Light';
  themeBtn.classList.toggle('active', currentTheme === 'light');

  showToast('success', `Switched to ${currentTheme} theme`);
}

function initModeButtons() {
  document.querySelectorAll('.mode-btn').forEach(button => {
    button.addEventListener('click', () => {
      setMode(button.dataset.mode, button);
      showToast('success', `Mode switched to ${button.textContent}`);
    });
  });
}

function updateLang() {
  currentLang = document.getElementById('lang-picker').value;
  localStorage.setItem('cd_lang', currentLang);
  document.getElementById('lang-tag').textContent = LANG_TAGS[currentLang] || 'code.txt';
  const codeEl = document.getElementById('out-fixed-code');
  if (codeEl) {
    document.getElementById('out-fix-lang').textContent = LANG_TAGS[currentLang] || 'fixed_code';
  }
}

function switchTab(tabId, el) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('tab-' + tabId).classList.add('active');
}

async function copyCode() {
  const code = document.getElementById('out-fixed-code').textContent;
  try {
    await navigator.clipboard.writeText(code);
    const btn = document.getElementById('copy-btn');
    btn.textContent = 'Copied ✓';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
  } catch { showToast('error', 'Copy nahi hua — manually select karo'); }
}

function downloadCode() {
  const code = document.getElementById('out-fixed-code').textContent;
  const lang = currentLang;
  const extension = { python: 'py', javascript: 'js', java: 'java', cpp: 'cpp', html: 'html', sql: 'sql' }[lang] || 'txt';
  const filename = `fixed_code.${extension}`;
  const blob = new Blob([code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('success', `Downloaded: ${filename}`);
}

function toggleDiffView() {
  const diffView = document.getElementById('code-diff-view');
  const codeView = document.getElementById('out-fixed-code').parentElement;
  const toggleBtn = document.getElementById('diff-toggle-btn');

  if (diffView.style.display === 'none') {
    // Show diff
    renderDiff();
    diffView.style.display = 'block';
    codeView.style.display = 'none';
    toggleBtn.textContent = 'Hide Diff';
  } else {
    // Hide diff
    diffView.style.display = 'none';
    codeView.style.display = 'block';
    toggleBtn.textContent = 'Show Diff';
  }
}

function renderDiff() {
  const originalCode = window.originalCode || '';
  const fixedCode = document.getElementById('out-fixed-code').textContent || '';

  if (!originalCode || !fixedCode) {
    document.getElementById('code-diff-view').innerHTML = '<div style="padding:16px;color:var(--text-muted);">No diff available</div>';
    return;
  }

  // Create diff using jsdiff
  const diff = Diff.diffLines(originalCode, fixedCode);
  let diffHtml = '';

  diff.forEach(part => {
    const className = part.added ? 'diff-added' : part.removed ? 'diff-removed' : 'diff-unchanged';
    const prefix = part.added ? '+' : part.removed ? '-' : ' ';
    const lines = part.value.split('\n');

    lines.forEach((line, index) => {
      if (line === '' && index === lines.length - 1) return; // Skip empty last line
      diffHtml += `<div class="diff-line ${className}"><span class="diff-prefix">${prefix}</span><span class="diff-content">${escapeHtml(line)}</span></div>`;
    });
  });

  document.getElementById('code-diff-view').innerHTML = `<pre class="diff-container">${diffHtml}</pre>`;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showToast(type, msg) {
  const toast = document.getElementById('toast');
  const dot = toast.querySelector('.toast-dot');
  document.getElementById('toast-msg').textContent = msg;
  toast.className = 'toast toast-' + type;
  dot.style.background = type === 'success' ? 'var(--green)' : 'var(--red)';
  void toast.offsetWidth;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

// ── MODAL ──────────────────────────────
function openModal() {
  document.getElementById('modal-overlay').classList.add('open');
  // Load saved keys into inputs
  ['groq','gemini','openrouter'].forEach(p => {
    const saved = localStorage.getItem(PROVIDERS[p].storageKey) || '';
    const el = document.getElementById('key-' + p);
    if (el && saved) el.value = saved;
  });
  // Restore active tab
  setProvider(currentProvider, false);
  setTimeout(() => {
    const el = document.getElementById('key-' + currentProvider);
    if (el) el.focus();
  }, 100);
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('modal-overlay'))
    document.getElementById('modal-overlay').classList.remove('open');
}

function setProvider(p, focus = true) {
  currentProvider = p;
  localStorage.setItem('cd_provider', p);
  // Update tabs
  ['groq','gemini','openrouter'].forEach(id => {
    document.getElementById('ptab-' + id)?.classList.remove('active-tab');
    document.getElementById('provider-' + id).style.display = 'none';
  });
  document.getElementById('ptab-' + p)?.classList.add('active-tab');
  document.getElementById('provider-' + p).style.display = 'block';
  if (focus) setTimeout(() => document.getElementById('key-' + p)?.focus(), 50);
}

function saveApiKey() {
  const key = document.getElementById('key-' + currentProvider)?.value.trim();
  if (!key) { showToast('error', 'Key paste karo pehle'); return; }

  const prefix = PROVIDERS[currentProvider].keyPrefix;
  if (!key.startsWith(prefix)) {
    showToast('error', `${PROVIDERS[currentProvider].label} key "${prefix}" se shuru honi chahiye`);
    return;
  }

  localStorage.setItem(PROVIDERS[currentProvider].storageKey, key);
  document.getElementById('modal-overlay').classList.remove('open');
  showToast('success', `${PROVIDERS[currentProvider].label} key save! Ab analyze kar sakte ho.`);
}

// ── KEYBOARD SHORTCUTS ─────────────────
document.addEventListener('keydown', e => {
  // Ctrl+Enter = Submit
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    analyzeCode();
  }
  // Escape = close modal
  if (e.key === 'Escape') {
    document.getElementById('modal-overlay').classList.remove('open');
  }
});

// Tab key in code editor inserts spaces
document.getElementById('code-input').addEventListener('keydown', function(e) {
  if (e.key === 'Tab') {
    e.preventDefault();
    const start = this.selectionStart;
    const end = this.selectionEnd;
    this.value = this.value.substring(0, start) + '  ' + this.value.substring(end);
    this.selectionStart = this.selectionEnd = start + 2;
  }
});

// ═══════════════════════════════════════
// INIT
// ═══════════════════════════════════════
(function init() {
  // Load user preferences from localStorage
  const savedMode = localStorage.getItem('cd_mode');
  if (savedMode && ['urdu', 'mixed', 'english'].includes(savedMode)) {
    currentMode = savedMode;
    const modeBtn = document.querySelector(`.mode-btn[data-mode="${savedMode}"]`);
    if (modeBtn) {
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      modeBtn.classList.add('active');
    }
  }

  // Load theme preference
  const savedTheme = localStorage.getItem('cd_theme') || 'dark';
  currentTheme = savedTheme;
  document.documentElement.setAttribute('data-theme', savedTheme);
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.textContent = savedTheme === 'dark' ? '🌙 Dark' : '☀️ Light';
    if (savedTheme === 'light') themeBtn.classList.add('active');
  }

  const savedLang = localStorage.getItem('cd_lang');
  if (savedLang && LANG_TAGS[savedLang]) {
    currentLang = savedLang;
    document.getElementById('lang-picker').value = savedLang;
    updateLang();
  }

  initExampleChips();
  initModeButtons();
  renderHistory();
  renderPatterns();
  initFontSize();

  // Initialize pattern date filter
  document.getElementById('pattern-date-filter').addEventListener('change', filterPatternsByDate);

  // Show modal if no key saved for ANY provider
  const hasAnyKey = ['groq','gemini','openrouter'].some(p => localStorage.getItem(PROVIDERS[p].storageKey));
  if (!hasAnyKey) setTimeout(openModal, 800);
})();