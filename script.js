const API_URL = "https://script.google.com/macros/s/AKfycbxaiHFAvUOfC5gnP49B0yDLXjD-FE-En-guZUFW8b7n4QptLPRKKiJ_u9l2QSKA1l1D/exec";

// Safe value getter (handles case-sensitive headers)
function getVal(row, ...keys) {
  for (let k of keys) {
    if (row[k] !== undefined && row[k] !== "") return row[k];
  }
  return "";
}

// ================= NEWS =================
function loadNews() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const newsList = document.getElementById("newsList");
      if (!newsList) return;
      newsList.innerHTML = "";

      data.news.forEach(n => {
        const title = getVal(n, "Title", "title");
        const link = getVal(n, "Link", "link", "#");
        const published = getVal(n, "Published", "published");

        newsList.innerHTML += `
          <div class="p-3 border rounded bg-gray-50 dark:bg-gray-700">
            <a href="${link}" target="_blank" class="font-medium">${title}</a>
            <div class="text-xs text-gray-500 mt-1">${published}</div>
          </div>
        `;
      });
    })
    .catch(err => console.error("News error:", err));
}

// ================= PICKS =================
function loadPicks() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const picksList = document.getElementById("picksList");
      if (!picksList) return;
      picksList.innerHTML = "";

      data.picks.forEach(p => {
        const stock = getVal(p, "Stock", "stock");
        const reason = getVal(p, "Reason", "reason");
        const link = getVal(p, "Link", "link", "#");

        picksList.innerHTML += `
          <div class="p-3 border rounded bg-gray-50 dark:bg-gray-700">
            <a href="${link}" target="_blank" class="font-medium">${stock}</a>
            <div class="text-xs text-gray-500 mt-1">${reason}</div>
          </div>
        `;
      });
    })
    .catch(err => console.error("Picks error:", err));
}

// ================= MOVERS =================
function loadMovers() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const table = document.getElementById("moversTable");
      if (!table) return;

      const tbody = table.querySelector("tbody");
      tbody.innerHTML = "";

      data.movers.forEach(m => {
        const sno = getVal(m, "S.No", "S_No", "sno");
        const name = getVal(m, "Name", "name");
        const cmp = getVal(m, "CMP", "cmp");
        const pe = getVal(m, "P/E", "PE", "pe");
        const mcap = getVal(m, "MCap", "mcap");

        tbody.innerHTML += `
          <tr>
            <td>${sno}</td>
            <td>${name}</td>
            <td>${cmp}</td>
            <td>${pe}</td>
            <td>${mcap}</td>
          </tr>
        `;
      });
    })
    .catch(err => console.error("Movers error:", err));
}

// ================= RECENT IPOs =================
function loadRecentIPOs() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const table = document.getElementById("recentIposTable");
      if (!table) return;

      const tbody = table.querySelector("tbody");
      tbody.innerHTML = "";

      data.ipos_recent.forEach(i => {
        const name = getVal(i, "Name", "name");
        const listingDate = getVal(i, "Listing Date", "listingDate");
        const ipoPrice = getVal(i, "IPO Price", "ipoPrice");
        const currentPrice = getVal(i, "Current Price", "currentPrice");
        const change = getVal(i, "% Change", "Change", "change");

        tbody.innerHTML += `
          <tr>
            <td>${name}</td>
            <td>${listingDate}</td>
            <td>${ipoPrice}</td>
            <td>${currentPrice}</td>
            <td>${change}</td>
          </tr>
        `;
      });
    })
    .catch(err => console.error("Recent IPOs error:", err));
}

// ================= UPCOMING IPOs =================
function loadUpcomingIPOs() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const table = document.getElementById("upcomingIposTable");
      if (!table) return;

      const tbody = table.querySelector("tbody");
      tbody.innerHTML = "";

      data.ipos_upcoming.forEach(i => {
        const name = getVal(i, "Name", "name");
        const openDate = getVal(i, "Open Date", "open");
        const closeDate = getVal(i, "Close Date", "close");
        const priceBand = getVal(i, "Price Band", "priceBand");

        tbody.innerHTML += `
          <tr>
            <td>${name}</td>
            <td>${openDate}</td>
            <td>${closeDate}</td>
            <td>${priceBand}</td>
          </tr>
        `;
      });
    })
    .catch(err => console.error("Upcoming IPOs error:", err));
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  loadNews();
  loadPicks();
  loadMovers();
  loadRecentIPOs();
  loadUpcomingIPOs();
});
