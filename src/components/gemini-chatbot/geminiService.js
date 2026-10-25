import { SYNCSKILLS_SYSTEM_PROMPT, FALLBACK_RESPONSES } from './chatbotKnowledge';

const GEMINI_STORAGE_KEY = 'syncskills_gemini_api_key';

export function getStoredGeminiKey() {
  if (typeof window === 'undefined') return '';
  return (
    localStorage.getItem(GEMINI_STORAGE_KEY) ||
    import.meta.env.VITE_GEMINI_API_KEY ||
    ''
  );
}

export function saveStoredGeminiKey(key) {
  if (typeof window === 'undefined') return;
  if (!key) {
    localStorage.removeItem(GEMINI_STORAGE_KEY);
  } else {
    localStorage.setItem(GEMINI_STORAGE_KEY, key.trim());
  }
}

/**
 * Sends a conversation to the Google Gemini API (gemini-1.5-flash)
 * Handles mathematics, general knowledge, code generation, and platform questions.
 */
export async function sendChatMessageToGemini(history, userMessage) {
  const apiKey = getStoredGeminiKey();

  if (!apiKey) {
    // Return intelligent multi-domain solver response
    return getLocalKnowledgeOrMathResponse(userMessage);
  }

  // Format contents for Google Gemini API
  const contents = [
    {
      role: 'user',
      parts: [{ text: `SYSTEM INSTRUCTIONS:\n${SYNCSKILLS_SYSTEM_PROMPT}` }]
    },
    {
      role: 'model',
      parts: [{ text: "Understood! I am the SyncSkills Gemini AI Copilot. I can solve mathematical equations, write code, explain concepts, answer any general question, and guide users on SyncSkills.AI." }]
    }
  ];

  // Add previous conversational turns (up to last 6 messages)
  const recentHistory = history.slice(-6);
  recentHistory.forEach((turn) => {
    contents.push({
      role: turn.sender === 'user' ? 'user' : 'model',
      parts: [{ text: turn.text }]
    });
  });

  // Add the current user query
  contents.push({
    role: 'user',
    parts: [{ text: userMessage }]
  });

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn('Gemini API returned status:', response.status, errorData);
      
      if (response.status === 400 || response.status === 403) {
        return `⚠️ **Gemini API Key Notice (${response.status}):** The current API key was not accepted by Google.\n\n*Intelligent Offline Response:*\n\n${getLocalKnowledgeOrMathResponse(userMessage)}`;
      }
      return getLocalKnowledgeOrMathResponse(userMessage);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const textPart = candidate?.content?.parts?.[0]?.text;

    if (textPart) {
      return textPart;
    }

    return getLocalKnowledgeOrMathResponse(userMessage);
  } catch (err) {
    console.error('Failed to communicate with Gemini API:', err);
    return getLocalKnowledgeOrMathResponse(userMessage);
  }
}

/**
 * Intelligent Multi-Domain Solver when running without an active Gemini API key.
 * Can solve arithmetic, algebra equations, programming questions, and platform queries.
 */
function getLocalKnowledgeOrMathResponse(query) {
  const trimmed = query.trim();
  const lower = trimmed.toLowerCase();

  // 1. Math Equation Solver: Linear equation solver e.g., "4x + 12 = 36", "2x - 5 = 15"
  const linearMatch = trimmed.match(/^(\d+)?x\s*([+-])\s*(\d+)\s*=\s*(\d+)$/i);
  if (linearMatch) {
    const a = linearMatch[1] ? parseFloat(linearMatch[1]) : 1;
    const op = linearMatch[2];
    const b = parseFloat(linearMatch[3]);
    const c = parseFloat(linearMatch[4]);
    
    // a*x + b = c  => a*x = c - b
    // a*x - b = c  => a*x = c + b
    const rhs = op === '+' ? c - b : c + b;
    const xVal = rhs / a;

    return `**Step-by-Step Mathematical Solution:**\n\nGiven equation:\n\`${trimmed}\`\n\n1. Isolate the variable term by moving the constant:\n   \`${a}x = ${c} ${op === '+' ? '-' : '+'} ${b}\`\n   \`${a}x = ${rhs}\`\n\n2. Divide both sides by the coefficient \`${a}\`:\n   \`x = ${rhs} / ${a}\`\n\n**Result:**\n\`x = ${xVal}\``;
  }

  // 2. Arithmetic evaluator e.g., "what is 25 * 4", "150 / 3", "2^8"
  const arithmeticExpr = trimmed.replace(/^(what is|calculate|evaluate|solve)\s+/i, '').replace(/x/g, '*').replace(/\^/g, '**');
  if (/^[\d\s+\-*/().%*]+$/.test(arithmeticExpr) && /[+\-*/%]/.test(arithmeticExpr)) {
    try {
      // Safe arithmetic evaluation
      const sanitized = arithmeticExpr.replace(/[^-()\d/*+.]/g, '');
      const calcResult = Function(`'use strict'; return (${sanitized})`)();
      if (typeof calcResult === 'number' && !isNaN(calcResult)) {
        return `**Mathematical Calculation:**\n\n\`${trimmed}\`\n\n**Result:** \`${calcResult}\``;
      }
    } catch {
      // ignore
    }
  }

  // 3. Common Quick Math / Science Formulas
  if (lower.includes('pythagoras') || lower.includes('pythagorean')) {
    return `**Pythagorean Theorem:**\n\n\`a² + b² = c²\`\n\nWhere:\n- \`a\` and \`b\` are the lengths of the legs of a right triangle.\n- \`c\` is the length of the hypotenuse.\n\n*Example:* If a = 3 and b = 4, then \`c = √(3² + 4²) = √(9 + 16) = √25 = 5\`.`;
  }

  if (lower.includes('quadratic formula') || lower.includes('quadratic equation')) {
    return `**The Quadratic Formula:**\n\nFor any equation in the form \`ax² + bx + c = 0\`:\n\n\`x = (-b ± √(b² - 4ac)) / (2a)\`\n\n- Discriminant \`Δ = b² - 4ac\`\n- If \`Δ > 0\`: 2 real distinct solutions.\n- If \`Δ = 0\`: 1 repeated real solution.\n- If \`Δ < 0\`: 2 complex conjugate solutions.`;
  }

  // 4. Programming & Algorithms Queries
  if (lower.includes('quicksort') || lower.includes('quick sort')) {
    return `**QuickSort Implementation in Python:**\n\n\`\`\`python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

# Example usage:
sample = [38, 27, 43, 3, 9, 82, 10]
print("Sorted:", quicksort(sample))
# Output: [3, 9, 10, 27, 38, 43, 82]
\`\`\`\n\n**Time Complexity:** \`O(n log n)\` average case, \`O(n²)\` worst case.`;
  }

  if (lower.includes('binary search')) {
    return `**Binary Search Implementation (Python):**\n\n\`\`\`python
def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
\`\`\`\n\n**Time Complexity:** \`O(log n)\`. The input array must be sorted.`;
  }

  // 5. SyncSkills Domain Knowledge
  for (const item of FALLBACK_RESPONSES) {
    const match = item.keywords.some((kw) => lower.includes(kw));
    if (match) {
      return item.response;
    }
  }

  // 6. General Fallback
  return `I am your **SyncSkills Gemini Copilot**!\n\nI can solve **mathematical equations**, write & debug **code**, explain **science & logic**, and guide your **team formation** on SyncSkills.AI.\n\n💡 *Tip: Click the ⚙️ Settings gear at the top to connect your Google Gemini API key for unlimited live AI answers!*`;
}
