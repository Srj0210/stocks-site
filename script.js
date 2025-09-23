// ============ CONFIG ============
const API_URL = "https://script.google.com/macros/s/AKfycbxaiHFAvUOfC5gnP49B0yDLXjD-FE-En-guZUFW8b7n4QptLPRKKiJ_u9l2QSKA1l1D/exec";

// ============ FETCH HELPERS ============
async function fetchData() {
  try {
    const res = await fetch(API_URL);
    return await res.json();
  } catch (e) {
    console.error("❌ API fetch error:", e);
    return {};
  }
}

// ============ RENDER FUNCTIONS ============
function renderNews(news) {
  const container = document.getElementById("newsList");
  const ticker = document.getElementById("tickerText");
  if (!container) return;

  container.innerHTML = "";
  news.slice(0, 6).forEach(n => {
    const div = document.createElement("div");
    div.className = "p-3 border rounded bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600";
    div.innerHTML = `<a href="${n.Link}" target="_blank" rel="noopener noreferrer" class="font-semibold">${n.Title}</a>
                     <p class="text-xs text-gray-500 mt-1">${n.Published}</p>`;
    container.appendChild(div);
  });

  if (ticker) {
    ticker.innerHTML = news.slice(0, 10).map(n => n.Title).join(" 🔸 ");
  }
}

function renderPicks(picks) {
  const container = document.getElementById("picksList");
  if (!container) return;

  container.innerHTML = "";
  picks.slice(0, 6).forEach(p => {
    const div = document.createElement("div");
    div.className = "p-3 border rounded bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600";
    div.innerHTML = `<p class="font-semibold">${p.Stock}</p>
                     <p class="text-xs text-gray-500">${p.Reason}</p>`;
    container.appendChild(div);
  });
}

function renderMovers(movers) {
  const container = document.getElementById("moversList");
  if (!container) return;

  container.innerHTML = "";
  movers.slice(0, 6).forEach(m => {
    const div = document.createElement("div");
    div.className = "p-3 border rounded bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600";
    div.innerHTML = `<p class="font-semibold">${m.Name}</p>
                     <p class="text-xs">CMP: ₹${m.CMP} | P/E: ${m["P/E"]} | MCap: ${m.MCap}</p>`;
    container.appendChild(div);
  });
}

function renderIpoRecent(recent) {
  const tbody = document.getElementById("ipoRecent");
  if (!tbody) return;

  tbody.innerHTML = "";
  recent.slice(0, 6).forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="border px-2 py-1">${r.Name}</td>
      <td class="border px-2 py-1">${r["Listing Date"]}</td>
      <td class="border px-2 py-1">${r["MCap (Cr)"] || ""}</td>
      <td class="border px-2 py-1">${r["IPO Price"] || ""}</td>
      <td class="border px-2 py-1">${r["% Change"] || ""}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderIpoUpcoming(upcoming) {
  const tbody = document.getElementById("ipoUpcoming");
  if (!tbody) return;

  tbody.innerHTML = "";
  upcoming.slice(0, 6).forEach(u => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="border px-2 py-1">${u.Name}</td>
      <td class="border px-2 py-1">${u["Open Date"] || ""}</td>
      <td class="border px-2 py-1">${u["Close Date"] || ""}</td>
      <td class="border px-2 py-1">${u["Price Band"] || ""}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ============ SEARCH ============
function searchContent() {
  const query = document.getElementById("searchBox").value.toLowerCase();
  const sections = document.querySelectorAll("section");
  sections.forEach(sec => {
    if (sec.innerText.toLowerCase().includes(query)) {
      sec.style.display = "";
    } else {
      sec.style.display = query ? "none" : "";
    }
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
