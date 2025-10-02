// ===== script-view.js (Secure) =====
// If you have a page that opens a single news/pick item (via query param ?type=news&index=2)

function escapeHTML(str) {
  if (!str) return "";
  return str.replace(/[&<>'"]/g, tag => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;"
  }[tag]));
}

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

function getQueryParams() {
  const q = {};
  location.search.substring(1).split("&").forEach(kv => {
    if (!kv) return;
    const [k,v] = kv.split("=");
    q[decodeURIComponent(k)] = decodeURIComponent(v||"");
  });
  return q;
}

async function loadView() {
  const q = getQueryParams();
  const type = q.type || "news";
  const index = Number(q.i || q.index || 0);

  showLoader("viewContent", "⏳ Loading...");
  try {
    const data = await fetchAPI(); // assuming fetchAPI() is defined in common.js
    const arr = data[type] || [];
    const item = arr[index];

    if (!item) {
      document.getElementById("viewContent").innerHTML = "<p class='text-gray-400'>Item not found</p>";
      return;
    }

    // secure rendering
    let html = `<h2 class="text-xl font-bold mb-2">${escapeHTML(item.Title || item.Stock || item.Name || "")}</h2>`;

    if (item.Published) {
      html += `<div class="text-xs text-gray-400 mb-3">${escapeHTML(formatDate(item.Published))}</div>`;
    }

    if (item.Link) {
      html += `<div class="mb-4">
        <a href="${sanitizeURL(item.Link)}" target="_blank" rel="noopener noreferrer" class="text-blue-400">Open source</a>
      </div>`;
    }

    html += `<pre class="whitespace-pre-wrap text-sm text-gray-200">${escapeHTML(JSON.stringify(item, null, 2))}</pre>`;

    document.getElementById("viewContent").innerHTML = html;

  } catch (e) {
    console.error("❌ View Load Error:", e);
    document.getElementById("viewContent").innerHTML = `<p class="text-red-400">Failed to load content.</p>`;
  }
}

if (document.getElementById("viewContent")) {
  window.addEventListener("load", loadView);
}