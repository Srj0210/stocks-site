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

// ====== Render Functions ======
function renderNews(news) {
  paginate("newsContainer", news, n => `
    <div class="searchable p-3 border rounded bg-gray-800 hover:bg-gray-700">
      <a href="${n.Link}" target="_blank" class="font-semibold hover:underline">${n.Title}</a>
      <p class="text-xs text-gray-400 mt-1">${n.Published || ""}</p>
    </div>
  `, 10);
}

function renderPicks(picks) {
  paginate("picksContainer", picks, p => `
    <div class="searchable p-3 border rounded bg-gray-800 hover:bg-gray-700">
      <a href="${p.Link}" target="_blank" class="font-semibold hover:underline">${p.Stock}</a>
      <p class="text-xs text-gray-400 mt-1">${p.Reason || ""}</p>
    </div>
  `, 10);
}

function renderMovers(movers) {
  paginate("moversContainer", movers, m => {
    const change = parseFloat(m["Change%"] || 0);
    const color = change > 0 ? "bg-green-600" : change < 0 ? "bg-red-600" : "bg-gray-600";
    return `<div class="searchable p-3 rounded text-white ${color}">
      ${m.Name} ₹${m.CMP} (${change}%)
    </div>`;
  }, 20);
}

function renderIPOs(ipos, containerId) {
  paginate(containerId, ipos, ipo => `
    <tr class="searchable border-b border-gray-700">
      <td class="p-2">${ipo.Name}</td>
      <td class="p-2">${ipo["Issue Type"] || ""}</td>
      <td class="p-2">${ipo["Price Band"] || ""}</td>
      <td class="p-2">${formatDate(ipo["Open Date"])}</td>
      <td class="p-2">${formatDate(ipo["Close Date"])}</td>
      <td class="p-2">${ipo["Issue Size"] || ""}</td>
    </tr>
  `, 10);
}