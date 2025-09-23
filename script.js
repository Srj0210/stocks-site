// ================== CONFIG ==================
const url = "https://script.google.com/macros/s/AKfycbxaiHFAvUOfC5gnP49B0yDLXjD-FE-En-guZUFW8b7n4QptLPRKKiJ_u9l2QSKA1l1D/exec";

// Simple text sanitizer (XSS se bachav)
function sanitizeText(text) {
  return text ? text.replace(/[&<>"']/g, m => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]
  )) : "";
}

// ================== THEME TOGGLE ==================
function toggleTheme() {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
    localStorage.theme = "light";
  } else {
    document.documentElement.classList.add("dark");
    localStorage.theme = "dark";
  }
}

// ================== GLOBAL STATE ==================
let allNews = [];
let currentPage = 1;
const itemsPerPage = 10;

// ================== NEWS ==================
function renderNews() {
  const newsContainer = document.getElementById("newsContainer");
  if (!newsContainer) return;

  newsContainer.innerHTML = "";
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = allNews.slice(start, end);

  pageItems.forEach(n => {
    newsContainer.innerHTML += `
      <div class="p-4 border rounded bg-gray-50 dark:bg-gray-700">
        <a href="${sanitizeText(n.Link)}" target="_blank" class="font-medium">${sanitizeText(n.Title)}</a>
        <div class="text-xs text-gray-500 mt-1">${sanitizeText(n.Published || "")}</div>
      </div>`;
  });

  const pageNumber = document.getElementById("pageNumber");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (pageNumber) pageNumber.textContent = `Page ${currentPage}`;
  if (prevBtn) prevBtn.disabled = currentPage === 1;
  if (nextBtn) nextBtn.disabled = end >= allNews.length;
}

function nextPage() {
  if (currentPage * itemsPerPage < allNews.length) {
    currentPage++;
    renderNews();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderNews();
  }
}

// ================== IPOs ==================
function renderIPOs(data) {
  // Upcoming IPOs
  const ipoUpcoming = document.getElementById("ipoUpcoming");
  if (ipoUpcoming && data.ipos_upcoming) {
    ipoUpcoming.innerHTML = "";
    data.ipos_upcoming.slice(0, 10).forEach(i => {
      ipoUpcoming.innerHTML += `
        <tr>
          <td class="border px-2 py-1">${sanitizeText(i.Name || "")}</td>
          <td class="border px-2 py-1">${sanitizeText(i["Open Date"] || "")}</td>
          <td class="border px-2 py-1">${sanitizeText(i["Close Date"] || "")}</td>
          <td class="border px-2 py-1">${sanitizeText(i["Price Band"] || "")}</td>
        </tr>`;
    });
  }

  // Recent IPOs
  const ipoRecent = document.getElementById("ipoRecent");
  if (ipoRecent && data.ipos_recent) {
    ipoRecent.innerHTML = "";
    data.ipos_recent.slice(0, 10).forEach(i => {
      ipoRecent.innerHTML += `
        <tr>
          <td class="border px-2 py-1">${sanitizeText(i.Name || "")}</td>
          <td class="border px-2 py-1">${sanitizeText(i["Listing Date"] || "")}</td>
          <td class="border px-2 py-1">${sanitizeText(i.Price || "")}</td>
        </tr>`;
    });
  }
}

// ================== MOVERS ==================
function renderMovers(data) {
  const moversList = document.getElementById("moversList");
  if (!moversList || !data.movers) return;

  moversList.innerHTML = "";
  data.movers.slice(0, 10).forEach(m => {
    moversList.innerHTML += `
      <div class="p-3 border rounded bg-gray-50 dark:bg-gray-700">
        <strong>${sanitizeText(m.Name || "")}</strong>
        <div class="text-xs mt-1">CMP: ${sanitizeText(m.CMP || "")} • MCap: ${sanitizeText(m.MCap || "")}</div>
      </div>`;
  });
}

// ================== PICKS ==================
function renderPicks(data) {
  const picksList = document.getElementById("picksList");
  if (!picksList || !data.picks) return;

  picksList.innerHTML = "";
  data.picks.slice(0, 6).forEach(p => {
    picksList.innerHTML += `
      <div class="p-3 border rounded bg-gray-50 dark:bg-gray-700">
        <strong>${sanitizeText(p.Stock || "")}</strong>
        <div class="text-xs mt-1">${sanitizeText(p.Reason || "")}</div>
        <a href="${sanitizeText(p.Link)}" target="_blank" class="text-blue-500 text-xs">Read More</a>
      </div>`;
  });
}

// ================== LOAD DATA ==================
async function loadData() {
  try {
    const res = await fetch(url);
    const data = await res.json();

    // Save full news for pagination
    allNews = data.news || [];
    renderNews();

    // IPOs
    renderIPOs(data);

    // Movers
    renderMovers(data);

    // Picks
    renderPicks(data);

    // Ticker update
    const ticker = document.getElementById("tickerText");
    if (ticker && data.news) {
      ticker.innerHTML = data.news.slice(0, 5).map(n => sanitizeText(n.Title)).join(" | ");
    }

  } catch (err) {
    console.error("❌ Error loading data:", err);
  }
}

window.onload = loadData;
