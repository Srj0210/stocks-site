// ===== bundle.js =====
// Ye file "view more" pages (news, picks, movers, IPOs) ke liye hai

// ===== Query Params Helper =====
function getQueryParams() {
  const q = {};
  location.search.substring(1).split("&").forEach(kv => {
    if (!kv) return;
    const [k, v] = kv.split("=");
    q[decodeURIComponent(k)] = decodeURIComponent(v || "");
  });
  return q;
}

// ===== All Data Fetcher =====
// common.js me ek helper bana lo safeFetch(API_URL) ke liye
async function fetchAllData() {
  try {
    return await safeFetch(API_URL);
  } catch (e) {
    console.error("❌ Error fetching all data:", e);
    return {};
  }
}

// ===== View Page Loader =====
async function loadView() {
  const q = getQueryParams();
  const type = q.type || "news"; // default news
  const index = Number(q.i || q.index || 0);

  showLoader("viewContent", "⏳ Loading...");
  try {
    const data = await fetchAllData();   // ✅ FIXED
    const arr = data[type] || [];
    const item = arr[index];

    if (!item) {
      document.getElementById("viewContent").innerHTML =
        "<p class='text-gray-400'>Item not found</p>";
      return;
    }

    // Render content
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
    document.getElementById("viewContent").innerHTML =
      `<p class="text-red-400">Failed to load content.</p>`;
  }
}

// ===== Run on Load =====
if (document.getElementById("viewContent")) {
  window.addEventListener("load", loadView);
}