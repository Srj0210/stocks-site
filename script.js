// ===== GOOGLE ANALYTICS AUTO-INJECT =====
(function addAnalytics() {
  const GA_ID = "G-FJGKC63PF4"; 
  if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
    const gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(gaScript);

    gaScript.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag(){ dataLayer.push(arguments); }
      gtag("js", new Date());
      gtag("config", GA_ID);
      console.log("✅ Google Analytics Loaded");
    };
  }
})();

// ===== API URL =====
const url = "https://script.google.com/macros/s/AKfycbyShXMyUufctA4ByFSNRKO4b5mMwTO6-C0eeiIqQM-hSSDgGGqw1qa_brHGdMq4pLhm/exec";

// ===== Date Formatter =====
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

// ===== Show loading =====
function showLoading(id, msg = "⏳ Please wait, loading data (10s)...") {
  const el = document.getElementById(id);
  if (el) el.innerHTML = `<div class="text-center text-yellow-600 dark:text-yellow-400 py-4">${msg}</div>`;
}

// ===== Render News =====
function renderNews(allNews, full = false) {
  const newsList = document.getElementById("newsList");
  if (!newsList) return;

  newsList.innerHTML = "";
  const newsToShow = full ? allNews : allNews.slice(0, 6);

  newsToShow.forEach(n => {
    newsList.innerHTML += `
      <div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-700">
        <a href="${n.Link || "#"}" target="_blank" class="font-medium">${n.Title}</a>
        <div class="text-xs text-gray-500 mt-1">${n.Published || ""}</div>
      </div>`;
  });
}

// ===== Render IPOs =====
function renderIPOs(list, id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = "";
  list.forEach(i => {
    el.innerHTML += `<tr class="searchable">
      <td class="border px-2 py-1">${i.Name || ""}</td>
      <td class="border px-2 py-1">${i["Issue Type"] || ""}</td>
      <td class="border px-2 py-1">${i["Price Band"] || ""}</td>
      <td class="border px-2 py-1">${formatDate(i["Open Date"])}</td>
      <td class="border px-2 py-1">${formatDate(i["Close Date"])}</td>
      <td class="border px-2 py-1">${i["Issue Size"] || ""}</td>
    </tr>`;
  });
}

// ===== Render Movers =====
function renderMovers(movers, full = false) {
  const moversList = document.getElementById("moversList");
  if (!moversList) return;
  moversList.innerHTML = "";
  const data = full ? movers : movers.slice(0, 10);

  data.forEach(m => {
    const change = m.Change ? parseFloat(m.Change) : 0;
    const cls = change >= 0
      ? "bg-green-50 dark:bg-green-900"
      : "bg-red-50 dark:bg-red-900";
    moversList.innerHTML += `
      <div class="searchable p-3 border rounded ${cls}">
        <strong>${m.Name}</strong> 
        <span class="text-sm">₹${m.CMP} (${m.Change || ""}%)</span>
      </div>`;
  });
}

// ===== Movers Ticker =====
function renderMoversTicker(movers) {
  const ticker = document.getElementById("moversTicker");
  if (!ticker) return;
  const text = movers.map(m => {
    const change = m.Change ? parseFloat(m.Change) : 0;
    const arrow = change >= 0 ? "⬆" : "⬇";
    const cls = change >= 0 ? "text-green-400" : "text-red-400";
    return `<span class="${cls} font-semibold">${m.Name} ₹${m.CMP} ${arrow} ${m.Change || ""}%</span>`;
  }).join(" | ");
  ticker.innerHTML = text;
}

// ===== Render Picks =====
function renderPicks(picks, full = false) {
  const picksList = document.getElementById("picksList");
  if (!picksList) return;
  picksList.innerHTML = "";
  const data = full ? picks : picks.slice(0, 4);
  data.forEach(p => {
    picksList.innerHTML += `<div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-700">
      <strong>${p.Stock}</strong>
      <div class="text-xs mt-1">${p.Reason || ""}</div>
    </div>`;
  });
}

// ===== MAIN LOAD FUNCTION =====
async function loadData(fullPage = false) {
  try {
    showLoading("newsList");
    showLoading("ipoUpcoming");
    showLoading("ipoRecent");
    showLoading("moversList");
    showLoading("picksList");

    const res = await fetch(url);
    const data = await res.json();

    // News
    renderNews(data.news || [], fullPage);

    // IPOs
    renderIPOs(data.ipos_upcoming || [], "ipoUpcoming");
    renderIPOs(data.ipos_recent || [], "ipoRecent");

    // Movers
    renderMovers(data.movers || [], fullPage);
    renderMoversTicker(data.movers || []);

    // Picks
    renderPicks(data.picks || [], fullPage);

    // News ticker
    const ticker = document.getElementById("tickerText");
    if (ticker) {
      ticker.innerHTML = (data.news || []).map(n => n.Title).join(" | ");
    }

  } catch (err) {
    console.error("❌ Error loading data:", err);
  }
}

// ===== SEARCH =====
function searchContent(){ 
  let input = document.getElementById("searchBox")?.value.toLowerCase(); 
  document.querySelectorAll(".searchable").forEach(el=>{
    el.style.display = el.innerText.toLowerCase().includes(input) ? "" : "none"; 
  }); 
}

window.onload = () => {
  const fullPage = window.location.pathname.includes("news.html") ||
                   window.location.pathname.includes("ipos_upcoming.html") ||
                   window.location.pathname.includes("ipos_recent.html") ||
                   window.location.pathname.includes("movers.html") ||
                   window.location.pathname.includes("picks.html");
  loadData(fullPage);
};
