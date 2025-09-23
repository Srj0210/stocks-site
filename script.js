// ===== GOOGLE ANALYTICS AUTO-INJECT =====
(function addAnalytics() {
  const GA_ID = "G-FJGKC63PF4"; // apna GA ID yaha daalna
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
  if (isNaN(d.getTime())) return dateStr; // fallback
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

// ===== Movers Bulletin =====
function renderMoversTicker(movers) {
  const ticker = document.getElementById("moversTicker");
  if (!ticker) return;

  const text = movers.map(m => {
    const change = m.Change ? parseFloat(m.Change) : 0;
    const arrow = change >= 0 ? "⬆" : "⬇";
    const cls = change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
    return `<span class="${cls} font-semibold">${m.Name} ₹${m.CMP} ${arrow} ${m.Change || ""}%</span>`;
  }).join(" | ");

  ticker.innerHTML = text;
}

// ===== IPO RENDER (for home + view more) =====
function renderFullIPOs(data) {
  // UPCOMING
  const ipoUpcoming = document.getElementById("ipoUpcoming");
  if (ipoUpcoming) {
    ipoUpcoming.innerHTML = "";
    (data.ipos_upcoming || []).slice(0, 10).forEach(i => {
      ipoUpcoming.innerHTML += `<tr class="searchable">
        <td class="border px-2 py-1">${i.Name || ""}</td>
        <td class="border px-2 py-1">${i["Issue Type"] || ""}</td>
        <td class="border px-2 py-1">${i["Price Band"] || ""}</td>
        <td class="border px-2 py-1">${formatDate(i["Open Date"])}</td>
        <td class="border px-2 py-1">${formatDate(i["Close Date"])}</td>
        <td class="border px-2 py-1">${i["Issue Size"] || ""}</td>
      </tr>`;
    });
  }

  // RECENT
  const ipoRecent = document.getElementById("ipoRecent");
  if (ipoRecent) {
    ipoRecent.innerHTML = "";
    (data.ipos_recent || []).slice(0, 10).forEach(i => {
      ipoRecent.innerHTML += `<tr class="searchable">
        <td class="border px-2 py-1">${i.Name || ""}</td>
        <td class="border px-2 py-1">${i["Issue Type"] || ""}</td>
        <td class="border px-2 py-1">${i["Price Band"] || ""}</td>
        <td class="border px-2 py-1">${formatDate(i["Open Date"])}</td>
        <td class="border px-2 py-1">${formatDate(i["Close Date"])}</td>
        <td class="border px-2 py-1">${i["Issue Size"] || ""}</td>
      </tr>`;
    });
  }
}

// ===== MAIN LOAD FUNCTION =====
async function loadData() {
  try {
    const res = await fetch(url);
    const data = await res.json();

    // IPOs render
    renderFullIPOs(data);

    // ===== News Ticker (all news scroll) =====
    const ticker = document.getElementById("tickerText");
    if (ticker) {
      ticker.innerHTML = (data.news || []).map(n => n.Title).join(" | ");
    }

    // ===== News Section (only 6 on home) =====
    const newsList = document.getElementById("newsList");
    if (newsList) {
      newsList.innerHTML = "";
      (data.news || []).slice(0, 6).forEach(n => {
        newsList.innerHTML += `
          <div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-700">
            <a href="${n.Link || "#"}" target="_blank" class="font-medium">${n.Title}</a>
            <div class="text-xs text-gray-500 mt-1">${n.Published || ""}</div>
          </div>`;
      });
    }

    // ===== Movers (Cards + Ticker) =====
    const moversList = document.getElementById("moversList");
    if (moversList) {
      moversList.innerHTML = "";
      (data.movers || []).slice(0, 10).forEach(m => {
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

    // ✅ Movers Bulletin
    renderMoversTicker(data.movers);

    // ===== Picks =====
    const picksList = document.getElementById("picksList");
    if (picksList) {
      picksList.innerHTML = "";
      (data.picks || []).slice(0, 4).forEach(p => {
        picksList.innerHTML += `<div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-700">
          <strong>${p.Stock}</strong>
          <div class="text-xs mt-1">${p.Reason || ""}</div>
        </div>`;
      });
    }

  } catch (err) {
    console.error("❌ Error loading data:", err);
  }
}

// ===== SEARCH =====
function searchContent(){ 
  let input = document.getElementById("searchBox").value.toLowerCase(); 
  document.querySelectorAll(".searchable").forEach(el=>{
    el.style.display = el.innerText.toLowerCase().includes(input) ? "" : "none"; 
  }); 
}

window.onload = loadData;
