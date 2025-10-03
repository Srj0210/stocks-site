// ====== common.security.js ======
// Security helpers to prevent XSS / bad URLs / unsafe fetch

// 🔹 Escape HTML (prevent XSS via innerHTML)
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

// 🔹 Sanitize URLs (prevent javascript: or data: links)
function sanitizeURL(url) {
  try {
    const parsed = new URL(url, window.location.origin);
    if (["http:", "https:"].includes(parsed.protocol)) {
      return parsed.href;
    }
    return "#"; // invalid → block
  } catch {
    return "#"; // invalid → block
  }
}

// 🔹 Safe fetch wrapper
async function safeFetch(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        "X-Content-Type-Options": "nosniff"
      }
    });

    // Only allow JSON or text
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return await response.json();
    } else if (contentType.includes("text/")) {
      return await response.text();
    } else {
      console.warn("⚠️ Blocked unsafe content-type:", contentType);
      return null;
    }
  } catch (err) {
    console.error("❌ SafeFetch Error:", err);
    return null;
  }
}

// 🔹 Safe DOM injection (allow limited HTML, strip <script>)
function safeInject(el, html) {
  if (!el) return;
  el.textContent = ""; // clear existing

  // ⚠️ Don't escape everything → only strip <script> & inline JS
  const temp = document.createElement("div");
  temp.innerHTML = html;

  // remove <script> tags
  temp.querySelectorAll("script").forEach(s => s.remove());

  // remove dangerous attributes like onclick, onerror etc.
  temp.querySelectorAll("*").forEach(node => {
    [...node.attributes].forEach(attr => {
      if (/^on/i.test(attr.name)) node.removeAttribute(attr.name);
      if (attr.value && attr.value.toLowerCase().startsWith("javascript:")) {
        node.removeAttribute(attr.name);
      }
    });
  });

  el.append(...temp.childNodes);
}

// Expose globally
window.escapeHTML = escapeHTML;
window.sanitizeURL = sanitizeURL;
window.safeFetch = safeFetch;
window.safeInject = safeInject;