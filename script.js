// script.js -- place in root (same folder as index.html)

/*
  Script to fetch data from Google Apps Script / API and populate the page.
  - Safe DOM updates (no direct innerHTML for user content)
  - AbortController with timeout
  - Retries for network resilience
  - Simple search/filtering
*/

const API_URL = 'https://script.google.com/macros/s/AKfycbxaiHFAvUOfC5gnP49B0yDLXjD-FE-En-guZUFW8b7n4QptLPRKKiJ_u9l2QSKA1l1D/exec'; // <-- keep your Apps Script URL here

// Utility: fetch with timeout + retries
async function fetchWithTimeout(url, options = {}, timeout = 10000, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      // Try parse JSON safely
      try { return JSON.parse(text); } catch (e) { throw new Error('Invalid JSON from API'); }
    } catch (err) {
      clearTimeout(id);
      console.warn(`fetch attempt ${attempt+1} failed:`, err.message);
      if (attempt === retries) throw err;
      // small delay before retry
      await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
    }
  }
}

// Safe create anchor (validate URL starts with http)
function safeAnchor(url, label, blank = true) {
  const a = document.createElement('a');
  a.textContent = label;
  try {
    if (typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'))) {
      a.href = url;
      if (blank) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
    } else {
      a.href = '#';
      a.addEventListener('click', e => e.preventDefault());
    }
  } catch (e) {
    a.href = '#';
  }
  a.className = 'text-blue-600 hover:underline';
  return a;
}

// Format date to "dd MMM yyyy" if parseable, else return original
function formatDateString(dateText) {
  if (!dateText) return '';
  if (typeof dateText !== 'string') return String(dateText);
  const t = dateText.trim().toLowerCase();
  if (t === 'yesterday') {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  // try parse ISO or other formats
  const parsed = Date.parse(dateText
