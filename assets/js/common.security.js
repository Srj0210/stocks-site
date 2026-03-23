// ====== common.security.js ======

// Escape only strings, not full HTML blocks
function escapeHTML(str) {
  if (!str) return "";
  return str.replace(/[&<>'"]/g, tag => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    "\"": "&quot;"
  }[tag]));
}

// Sanitize URLs
function sanitizeURL(url) {
  try {
    const parsed = new URL(url, window.location.origin);
    if (["http:", "https:"].includes(parsed.protocol)) {
      return parsed.href;
    }
    return "#";
  } catch {
    return "#";
  }
}

// Safe fetch
async function safeFetch(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        "X-Content-Type-Options": "nosniff"
      }
    });
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) return await response.json();
    if (contentType.includes("text/")) return await response.text();
    return null;
  } catch (err) {
    console.error("❌ SafeFetch Error:", err);
    return null;
  }
}

// ✅ Safe inject but allow HTML (only strip <script>)
function safeInject(el, html) {
  if (!el) return;
  el.textContent = "";

  const temp = document.createElement("div");
  temp.innerHTML = html;

  // remove script tags
  temp.querySelectorAll("script").forEach(s => s.remove());

  el.append(...temp.childNodes);
}

// Expose globally
window.escapeHTML = escapeHTML;
window.sanitizeURL = sanitizeURL;
window.safeFetch = safeFetch;
window.safeInject = safeInject;