// ===== bundle.js =====

// Detect current page & load data
document.addEventListener("DOMContentLoaded", async () => {
  const path = window.location.pathname;

  // 🔹 NEWS PAGE
  if (path.includes("news")) {
    showLoader("newsContainer");
    const news = await fetchData("news");
    renderNews(news);
  }

  // 🔹 PICKS PAGE
  else if (path.includes("picks")) {
    showLoader("picksContainer");
    const picks = await fetchData("picks");
    renderPicks(picks);
  }

  // 🔹 MOVERS PAGE
  else if (path.includes("movers")) {
    showLoader("moversContainer");
    const movers = await fetchData("movers");
    renderMovers(movers);
  }

  // 🔹 RECENT IPO PAGE
  else if (path.includes("ipos_recent")) {
    showLoader("iposRecentContainer");
    const iposRecent = await fetchData("ipos_recent");
    renderIPOs(iposRecent, "iposRecentContainer");
  }

  // 🔹 UPCOMING IPO PAGE
  else if (path.includes("ipos_upcoming")) {
    showLoader("iposUpcomingContainer");
    const iposUpcoming = await fetchData("ipos_upcoming");
    renderIPOs(iposUpcoming, "iposUpcomingContainer");
  }
});

// ================== RENDER FUNCTIONS ==================
function renderNews(news) {
  paginate(
    "newsContainer",
    news,
    (n) => `
    <div class="searchable p-3 border rounded bg-gray-800 hover:bg-gray-700">
      <a href="${n.Link}" target="_blank" class="font-semibold hover:underline">${n.Title}</a>
      <p class="text-xs text-gray-400 mt-1">${n.Published || ""}</p>
    </div>
  `,
    10
  );
}

function renderPicks(picks) {
  paginate(
    "picksContainer",
    picks,
    (p) => `
    <div class="searchable p-3 border rounded bg-gray-800 hover:bg-gray-700">
      <a href="${p.Link}" target="_blank" class="font-semibold hover:underline">${p.Stock}</a>
      <p class="text-xs text-gray-400 mt-1">${p.Reason || ""}</p>
    </div>
  `,
    10
  );
}

function renderMovers(movers) {
  paginate(
    "moversContainer",
    movers,
    (m) => {
      const change = parseFloat(m["Change%"] || 0);
      const color =
        change > 0
          ? "bg-green-600"
          : change < 0
          ? "bg-red-600"
          : "bg-gray-600";
      return `<div class="searchable p-3 rounded text-white ${color}">
        ${m.Name} ₹${m.CMP} (${change}%)
      </div>`;
    },
    20
  );
}

function renderIPOs(ipos, containerId) {
  paginate(
    containerId,
    ipos,
    (ipo) => `
    <tr class="searchable border-b border-gray-700">
      <td class="p-2">${ipo.Name}</td>
      <td class="p-2">${ipo["Issue Type"] || ""}</td>
      <td class="p-2">${ipo["Price Band"] || ""}</td>
      <td class="p-2">${formatDate(ipo["Open Date"])}</td>
      <td class="p-2">${formatDate(ipo["Close Date"])}</td>
      <td class="p-2">${ipo["Issue Size"] || ""}</td>
    </tr>
  `,
    10
  );
}

// ================== SINGLE ITEM VIEW (script-view.js merged) ==================
function getQueryParams() {
  const q = {};
  location.search
    .substring(1)
    .split("&")
    .forEach((kv) => {
      if (!kv) return;
      const [k, v] = kv.split("=");
      q[decodeURIComponent(k)] = decodeURIComponent(v || "");
    });
  return q;
}

async function loadView() {
  const q = getQueryParams();
  const type = q.type || "news";
  const index = Number(q.i || q.index || 0);

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
    let html = `<h2 class="text-xl font-bold mb-2">${
      item.Title || item.Stock || item.Name || ""
    }</h2>`;

    if (item.Published) {
      html += `<div class="text-xs text-gray-400 mb-3">${formatDate(
        item.Published
      )}</div>`;
    }

    if (item.Link) {
      html += `<div class="mb-4">
        <a href="${item.Link}" target="_blank" rel="noopener noreferrer" class="text-blue-400">Open source</a>
      </div>`;
    }

    html += `<pre class="whitespace-pre-wrap text-sm text-gray-200">${JSON.stringify(
      item,
      null,
      2
    )}</pre>`;

    document.getElementById("viewContent").innerHTML = html;
  } catch (e) {
    console.error("❌ View page error:", e);
    document.getElementById("viewContent").innerHTML =
      `<p class="text-red-400">Failed to load content.</p>`;
  }
}

// Run view loader only if viewContent exists
if (document.getElementById("viewContent")) {
  window.addEventListener("load", loadView);
}