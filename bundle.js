// ====== Security Helpers ======
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

// ====== Page Load Logic ======
document.addEventListener("DOMContentLoaded", async () => {
  const path = window.location.pathname;

  if (path.includes("news")) {
    showLoader("newsContainer");
    const news = await fetchData("news");
    renderNews(news);
  } 
  else if (path.includes("picks")) {
    showLoader("picksContainer");
    const picks = await fetchData("picks");
    renderPicks(picks);
  } 
  else if (path.includes("movers")) {
    showLoader("moversContainer");
    const movers = await fetchData("movers");
    renderMovers(movers);
  } 
  else if (path.includes("ipos_recent")) {
    showLoader("iposRecentContainer");
    const iposRecent = await fetchData("ipos_recent");
    renderIPOs(iposRecent, "iposRecentContainer");
  } 
  else if (path.includes("ipos_upcoming")) {
    showLoader("iposUpcomingContainer");
    const iposUpcoming = await fetchData("ipos_upcoming");
    renderIPOs(iposUpcoming, "iposUpcomingContainer");
  }
});

// ====== Render Functions ======
function renderNews(news) {
  paginate("newsContainer", news, n => `
    <div class="searchable p-3 border rounded bg-gray-800 hover:bg-gray-700">
      <a href="${sanitizeURL(n.Link)}" target="_blank" 
         class="font-semibold hover:underline">${escapeHTML(n.Title)}</a>
      <p class="text-xs text-gray-400 mt-1">${escapeHTML(n.Published || "")}</p>
    </div>
  `, 10);
}

function renderPicks(picks) {
  paginate("picksContainer", picks, p => `
    <div class="searchable p-3 border rounded bg-gray-800 hover:bg-gray-700">
      <a href="${sanitizeURL(p.Link)}" target="_blank" 
         class="font-semibold hover:underline">${escapeHTML(p.Stock)}</a>
      <p class="text-xs text-gray-400 mt-1">${escapeHTML(p.Reason || "")}</p>
    </div>
  `, 10);
}

function renderMovers(movers) {
  paginate("moversContainer", movers, m => {
    const change = parseFloat(m["Change%"] || 0);
    const color = change > 0 ? "bg-green-600" : change < 0 ? "bg-red-600" : "bg-gray-600";
    return `<div class="searchable p-3 rounded text-white ${color}">
      ${escapeHTML(m.Name)} ₹${escapeHTML(m.CMP)} (${escapeHTML(change.toString())}%)
    </div>`;
  }, 20);
}

function renderIPOs(ipos, containerId) {
  paginate(containerId, ipos, ipo => `
    <tr class="searchable border-b border-gray-700">
      <td class="p-2">${escapeHTML(ipo.Name)}</td>
      <td class="p-2">${escapeHTML(ipo["Issue Type"] || "")}</td>
      <td class="p-2">${escapeHTML(ipo["Price Band"] || "")}</td>
      <td class="p-2">${formatDate(ipo["Open Date"])}</td>
      <td class="p-2">${formatDate(ipo["Close Date"])}</td>
      <td class="p-2">${escapeHTML(ipo["Issue Size"] || "")}</td>
    </tr>
  `, 10);
}