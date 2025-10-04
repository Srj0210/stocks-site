// ===== script-view.js =====
// For single item view (?type=news&index=2)

function getQueryParams() {
  const q = {};
  location.search.substring(1).split("&").forEach(kv => {
    if (!kv) return;
    const [k, v] = kv.split("=");
    q[decodeURIComponent(k)] = decodeURIComponent(v || "");
  });
  return q;
}

async function loadView() {
  const q = getQueryParams();
  const type = q.type || "news";   // default news
  const index = Number(q.i || q.index || 0); // which item

  showLoader("viewContent", "⏳ Loading...");
  try {
    // ✅ FIX: use fetchData from common.js
    const arr = await fetchData(type);
    const item = arr[index];

    if (!item) {
      document.getElementById("viewContent").innerHTML =
        "<p class='text-gray-400'>Item not found</p>";
      return;
    }

    // 🔹 Render item
    let html = `<h2 class="text-xl font-bold mb-2">${item.Title || item.Stock || item.Name || ""}</h2>`;

    if (item.Published) {
      html += `<div class="text-xs text-gray-400 mb-3">${formatDate(item.Published)}</div>`;
    }

    if (item.Link) {
      html += `<div class="mb-4">
        <a href="${item.Link}" target="_blank" rel="noopener noreferrer" class="text-blue-400">Open source</a>
      </div>`;
    }

    html += `<pre class="whitespace-pre-wrap text-sm text-gray-200">${JSON.stringify(item, null, 2)}</pre>`;

    document.getElementById("viewContent").innerHTML = html;
  } catch (e) {
    console.error("❌ View page error:", e);
    document.getElementById("viewContent").innerHTML =
      `<p class="text-red-400">Failed to load content.</p>`;
  }
}

// Run only if element exists
if (document.getElementById("viewContent")) {
  window.addEventListener("load", loadView);
}