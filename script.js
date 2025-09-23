// ============ CONFIG ============
const API_URL = "https://script.google.com/macros/s/AKfycbxaiHFAvUOfC5gnP49B0yDLXjD-FE-En-guZUFW8b7n4QptLPRKKiJ_u9l2QSKA1l1D/exec";

// ============ FETCH ============
async function fetchData() {
  try {
    const res = await fetch(API_URL);
    return await res.json();
  } catch (e) {
    console.error("❌ API fetch error:", e);
    return {};
  }
}

// ============ RENDER ============

// News
function renderNews(news) {
  const container = document.getElementById("newsList");
  const ticker = document.getElementById("tickerText");
  if (!container) return;

  container.innerHTML = "";
  (news || []).slice(0, 6).forEach(n => {
    container.innerHTML += `
      <div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-700">
        <a href="${n.Link}" target="_blank" rel="noopener noreferrer" class="font-medium">${n.Title}</a>
        <div class="text-xs text-gray-500 mt-1">${n.Published || ""}</div>
      </div>`;
  });

  if (ticker) {
    ticker.innerHTML = (news || []).slice(0, 10).map(n => n.Title).join(" 🔸 ");
  }
}

// Picks
function renderPicks(picks) {
  const container = document.getElementById("picksList");
  if (!container) return;

  container.innerHTML = "";
  (picks || []).slice(0, 6).forEach(p => {
    container.innerHTML += `
      <div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-700">
        <strong>${p.Stock}</strong>
        <div class="text-xs mt-1">${p.Reason || ""}</div>
      </div>`;
  });
}

// Movers
function renderMovers(movers) {
  const container = document.getElementById("moversList");
  if (!container) return;

  container.innerHTML = "";
  (movers || []).slice(0, 6).forEach(m => {
    container.innerHTML += `
      <div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-700">
        <strong>${m.Name}</strong>
        <div class="text-xs mt-1">CMP: ₹${m.CMP || ""} | P/E: ${m["P/E"] || ""} | MCap: ${m.MCap || ""}</div>
      </div>`;
  });
}

// IPO Recent
function renderIpoRecent(recent) {
  const tbody = document.getElementById("ipoRecent");
  if (!tbody) return;

  tbody.innerHTML = "";
  (recent || []).slice(0, 6).forEach(r => {
    tbody.innerHTML += `
      <tr class="searchable">
        <td class="border px-2 py-1">${r.Name}</td>
        <td class="border px-2 py-1">${r["Listing Date"] || ""}</td>
        <td class="border px-2 py-1">${r["MCap (Cr)"] || ""}</td>
        <td class="border px-2 py-1">${r["IPO Price"] || ""}</td>
        <td class="border px-2 py-1">${r["% Change"] || ""}</td>
      </tr>`;
  });
}

// IPO Upcoming
function renderIpoUpcoming(upcoming) {
  const tbody = document.getElementById("ipoUpcoming");
  if (!tbody) return;

  tbody.innerHTML = "";
  (upcoming || []).slice(0, 6).forEach(u => {
    tbody.innerHTML += `
      <tr class="searchable">
        <td class="border px-2 py-1">${u.Name}</td>
        <td class="border px-2 py-1">${u["Open Date"] || ""}</td>
        <td class="border px-2 py-1">${u["Close Date"] || ""}</td>
        <td class="border px-2 py-1">${u["Price Band"] || ""}</td>
      </tr>`;
  });
}

// ============ SEARCH ============
function searchContent() {
  const query = document.getElementById("searchBox").value.toLowerCase();
  document.querySelectorAll(".searchable").forEach(el => {
    el.style.display = el.innerText.toLowerCase().includes(query) ? "" : "none";
  });
}

// ============ INIT ============
document.addEventListener("DOMContentLoaded", async () => {
  const data = await fetchData();
  if (!data) return;

  renderNews(data.news || []);
  renderPicks(data.picks || []);
  renderMovers(data.movers || []);
  renderIpoRecent(data.ipos_recent || []);
  renderIpoUpcoming(data.ipos_upcoming || []);
});
