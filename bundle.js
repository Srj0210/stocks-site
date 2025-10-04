// ===== bundle.js (full replacement) =====

// Ensure API_URL is defined (from your common.js)
if (typeof API_URL === "undefined") {
  console.error("bundle.js: API_URL is not defined. Make sure common.js provides it.");
}

// Utility: safe wrappers (if common.security already sets these, this just ensures they exist)
window.escapeHTML = window.escapeHTML || function (s) { return s ? String(s).replace(/[&<>'"]/g, function(t){ return ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'})[t]; }) : ""; };
window.sanitizeURL = window.sanitizeURL || function(u){ try { const p = new URL(u, location.origin); return (p.protocol === "http:" || p.protocol === "https:") ? p.href : "#"; } catch { return "#"; } };
window.safeFetch = window.safeFetch || (async function(url, options = {}) {
  try {
    const res = await fetch(url, options);
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    if (ct.includes("application/json")) return await res.json();
    if (ct.includes("text/")) return await res.text();
    // fallback: try json
    return await res.json();
  } catch (err) {
    console.error("safeFetch fallback error:", err);
    return null;
  }
});

// Fetch full API payload (used by older code expecting fetchAPI)
async function fetchAPI() {
  try {
    if (!API_URL) throw new Error("API_URL not set");
    const data = await safeFetch(API_URL);
    if (!data) throw new Error("Empty payload");
    return data;
  } catch (e) {
    console.error("fetchAPI error:", e);
    return {};
  }
}
window.fetchAPI = fetchAPI; // expose

// Helper: create "View more" links (safe)
function makeViewLink(type, index, text = "View") {
  const url = `view.html?type=${encodeURIComponent(type)}&i=${encodeURIComponent(index)}`;
  return `<a href="${escapeHTML(url)}" class="text-blue-400 hover:underline">${escapeHTML(text)}</a>`;
}

// Safe element set (text only) fallback
function setText(el, text) {
  if (!el) return;
  el.textContent = text === undefined || text === null ? "" : String(text);
}

// If paginate exists (from common.js) use it; otherwise provide a simple pager
const hasPaginate = typeof paginate === "function";
function safePaginate(containerId, data, renderItem, itemsPerPage = 10) {
  if (hasPaginate) return paginate(containerId, data, renderItem, itemsPerPage);

  // simple fallback
  const container = document.getElementById(containerId);
  if (!container) return;
  let current = 1;
  const total = Math.max(1, Math.ceil(data.length / itemsPerPage));
  function render() {
    container.innerHTML = data
      .slice((current - 1) * itemsPerPage, current * itemsPerPage)
      .map(renderItem).join("");
    // simple pager
    let pager = `<div class="flex justify-center mt-4 space-x-2">`;
    for (let i = 1; i <= total; i++) {
      pager += `<button data-page="${i}" class="px-3 py-1 rounded ${i===current ? 'bg-blue-600 text-white' : 'bg-gray-300'}">${i}</button>`;
    }
    pager += `</div>`;
    const pagerWrap = document.createElement("div");
    pagerWrap.innerHTML = pager;
    // remove old pager if present
    const existing = container.nextElementSibling;
    if (existing && existing.classList.contains("bundle-pager")) existing.remove();
    pagerWrap.classList.add("bundle-pager");
    container.after(pagerWrap);
    pagerWrap.querySelectorAll("button").forEach(b => b.addEventListener("click", (ev) => {
      current = Number(ev.target.dataset.page) || 1;
      render();
    }));
  }
  render();
}

// Render functions (use safe injection and escape)
function renderNewsList(news) {
  const renderItem = (n, idx) => {
    const title = escapeHTML(n.Title || n.title || "Untitled");
    const link = sanitizeURL(n.Link || n.link || "");
    const pub = escapeHTML(n.Published || n.published || "");
    // include a "View more" that points to view.html so view page can show full JSON if needed
    return `
      <div class="searchable p-3 border rounded bg-gray-800 hover:bg-gray-700">
        <a href="${link}" target="_blank" rel="noopener noreferrer" class="font-semibold hover:underline">${title}</a>
        <div class="text-xs text-gray-400 mt-1">${pub}</div>
        <div class="mt-2">${makeViewLink('news', idx, 'View details')}</div>
      </div>
    `;
  };
  safePaginate("newsContainer", news, (n, i) => renderItem(n, i), 10);
}

function renderPicksList(picks) {
  const renderItem = (p, idx) => {
    const stock = escapeHTML(p.Stock || p.stock || "Unknown");
    const reason = escapeHTML(p.Reason || p.reason || "");
    const link = sanitizeURL(p.Link || p.link || "");
    return `
      <div class="searchable p-3 border rounded bg-gray-800 hover:bg-gray-700">
        <a href="${link}" target="_blank" rel="noopener noreferrer" class="font-semibold hover:underline">${stock}</a>
        <p class="text-xs text-gray-400 mt-1">${reason}</p>
        <div class="mt-2">${makeViewLink('picks', idx, 'View details')}</div>
      </div>
    `;
  };
  safePaginate("picksContainer", picks, (p,i) => renderItem(p,i), 10);
}

function renderMoversList(movers) {
  const renderItem = (m, idx) => {
    const name = escapeHTML(m.Name || m.name || "");
    const cmp = escapeHTML(m.CMP || m.cmp || "");
    const changeRaw = m["Change%"] || m.Change || m.change || "0";
    const changeNum = parseFloat(String(changeRaw).replace(/[^\d\.\-]/g, "")) || 0;
    const colorClass = changeNum > 0 ? "bg-green-600" : changeNum < 0 ? "bg-red-600" : "bg-gray-600";
    return `<div class="searchable p-3 rounded text-white ${colorClass}">
      ${name} ₹${cmp} (${escapeHTML(String(changeNum))}%)
    </div>`;
  };
  safePaginate("moversContainer", movers, renderItem, 20);
}

function renderIPOsList(ipos, containerId) {
  // render rows — container is a table body
  const renderItem = (ipo) => {
    const name = escapeHTML(ipo.Name || ipo.name || "");
    const type = escapeHTML(ipo["Issue Type"] || ipo["issue type"] || "");
    const band = escapeHTML(ipo["Price Band"] || "");
    const open = escapeHTML(formatDate(ipo["Open Date"] || "")) ;
    const close = escapeHTML(formatDate(ipo["Close Date"] || ""));
    const size = escapeHTML(ipo["Issue Size"] || ipo.issueSize || "");
    return `<tr class="searchable border-b border-gray-700">
      <td class="p-2">${name}</td>
      <td class="p-2">${type}</td>
      <td class="p-2">${band}</td>
      <td class="p-2">${open}</td>
      <td class="p-2">${close}</td>
      <td class="p-2">${size}</td>
    </tr>`;
  };

  // If it's a table body containerId, we will inject rows directly (paginate will still work)
  safePaginate(containerId, ipos, renderItem, 10);
}

// View page loader (view.html expected to have #viewContent)
async function loadViewPage() {
  const q = {};
  location.search.substring(1).split("&").forEach(kv => {
    if (!kv) return;
    const [k,v] = kv.split("=");
    q[decodeURIComponent(k)] = decodeURIComponent(v||"");
  });
  const type = q.type || "news";
  const index = Number(q.i || q.index || 0);

  const viewEl = document.getElementById("viewContent");
  if (!viewEl) return;

  showLoader("viewContent", "⏳ Loading...");
  try {
    const data = await fetchAPI();
    const arr = data[type] || [];
    const item = arr[index];
    if (!item) {
      viewEl.innerHTML = `<p class="text-gray-400">Item not found</p>`;
      return;
    }

    // build safe HTML for view
    const title = escapeHTML(item.Title || item.Stock || item.Name || type);
    const published = escapeHTML(item.Published || item.published || "");
    const source = sanitizeURL(item.Link || item.link || "");

    let html = `<h2 class="text-xl font-bold mb-2">${title}</h2>`;
    if (published) html += `<div class="text-xs text-gray-400 mb-3">${published}</div>`;
    if (source && source !== "#") html += `<div class="mb-4"><a href="${escapeHTML(source)}" target="_blank" rel="noopener noreferrer" class="text-blue-400">Open source</a></div>`;

    // Pretty print JSON safely
    const pretty = escapeHTML(JSON.stringify(item, null, 2));
    html += `<pre class="whitespace-pre-wrap text-sm text-gray-200 bg-gray-900 p-3 rounded">${pretty}</pre>`;

    viewEl.innerHTML = html;
  } catch (e) {
    console.error("loadViewPage error:", e);
    viewEl.innerHTML = `<p class="text-red-400">Failed to load content.</p>`;
  }
}

// Page routing + boot
document.addEventListener("DOMContentLoaded", async () => {
  const path = window.location.pathname || "";

  // Root/home page: populate small widgets if elements exist
  if (path.endsWith("/") || path.endsWith("index.html") || path === "") {
    // try to populate tickers + brief lists (non-blocking)
    try {
      const payload = await fetchAPI();
      if (payload) {
        if (document.getElementById("tickerText") && payload.news) {
          // for ticker text just join few titles
          const t = payload.news.slice(0, 20).map(n => "📰 " + (n.Title || n.title || "")).join(" | ");
          const el = document.getElementById("tickerText");
          if (el) el.textContent = t || "No news";
        }
        if (document.getElementById("moversTicker") && payload.movers) {
          const t = payload.movers.slice(0, 20).map(m => {
            const ch = parseFloat((m["Change%"] || m.Change || m.change || "0").toString().replace(/[^\d\.\-]/g,"")) || 0;
            return `${m.Name || m.name || ""} ${m.CMP || m.cmp || ""} (${ch}%)`;
          }).join(" | ");
          const el2 = document.getElementById("moversTicker");
          if (el2) el2.textContent = t || "No movers";
        }

        // brief home lists (newsList, moversList, picksList, ipos tables)
        if (document.getElementById("newsList") && payload.news) {
          // render first 6 as cards (not paginated here)
          const parent = document.getElementById("newsList");
          parent.innerHTML = payload.news.slice(0,6).map((n, i) => `
            <div class="p-3 border rounded bg-gray-800">
              <a href="${sanitizeURL(n.Link||n.link||"#")}" target="_blank" rel="noopener noreferrer" class="font-semibold">${escapeHTML(n.Title||n.title||"")}</a>
              <div class="text-xs text-gray-400 mt-1">${escapeHTML(n.Published||n.published||"")}</div>
            </div>
          `).join("");
        }
        if (document.getElementById("moversList") && payload.movers) {
          const parent = document.getElementById("moversList");
          parent.innerHTML = payload.movers.slice(0,6).map(m => {
            const ch = parseFloat((m["Change%"]||m.Change||m.change||"0").toString().replace(/[^\d\.\-]/g,"")) || 0;
            const color = ch>0 ? "bg-green-600" : ch<0 ? "bg-red-600" : "bg-gray-600";
            return `<div class="p-2 rounded ${color} text-white">${escapeHTML(m.Name||m.name||"")} ₹${escapeHTML(m.CMP||m.cmp||"")} (${escapeHTML(String(ch))}%)</div>`;
          }).join("");
        }
        if (document.getElementById("picksList") && payload.picks) {
          const parent = document.getElementById("picksList");
          parent.innerHTML = payload.picks.slice(0,6).map(p => `
            <div class="p-2 border rounded bg-gray-800">
              <p class="font-semibold">${escapeHTML(p.Stock||"")}</p>
              <small class="text-gray-400">${escapeHTML(p.Reason||"")}</small>
            </div>
          `).join("");
        }
        if (document.getElementById("ipoUpcoming") && payload.ipos_upcoming) {
          document.getElementById("ipoUpcoming").innerHTML = payload.ipos_upcoming.slice(0,6).map(ipo => `
            <tr>
              <td class="p-2">${escapeHTML(ipo.Name||"")}</td>
              <td class="p-2">${escapeHTML(ipo["Issue Type"]||"")}</td>
              <td class="p-2">${escapeHTML(ipo["Price Band"]||"")}</td>
              <td class="p-2">${escapeHTML(formatDate(ipo["Open Date"]||""))}</td>
              <td class="p-2">${escapeHTML(formatDate(ipo["Close Date"]||""))}</td>
              <td class="p-2">${escapeHTML(ipo["Issue Size"]||"")}</td>
            </tr>
          `).join("");
        }
      }
    } catch (e) {
      console.error("Home brief load error:", e);
    }
  }

  // If view page
  if (path.includes("view.html") || path.includes("/view")) {
    await loadViewPage();
    return;
  }

  // Full pages: news.html, picks.html, movers.html, ipos pages
  if (path.includes("news.html") || path.includes("/news")) {
    showLoader("newsContainer");
    const payload = await fetchAPI();
    renderNewsList(payload.news || []);
  } else if (path.includes("picks.html") || path.includes("/picks")) {
    showLoader("picksContainer");
    const payload = await fetchAPI();
    renderPicksList(payload.picks || []);
  } else if (path.includes("movers.html") || path.includes("/movers")) {
    showLoader("moversContainer");
    const payload = await fetchAPI();
    renderMoversList(payload.movers || []);
  } else if (path.includes("ipos_recent") || path.includes("ipos_recent.html")) {
    showLoader("iposRecentContainer");
    const payload = await fetchAPI();
    renderIPOsList(payload.ipos_recent || [], "iposRecentContainer");
  } else if (path.includes("ipos_upcoming") || path.includes("ipos_upcoming.html")) {
    showLoader("iposUpcomingContainer");
    const payload = await fetchAPI();
    renderIPOsList(payload.ipos_upcoming || [], "iposUpcomingContainer");
  }

}); // DOMContentLoaded