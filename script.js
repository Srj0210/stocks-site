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
const url = "https://script.google.com/macros/s/AKfycby-VuqKc03bVz8OKCscnLZYsXX0RXcISFqVdXlp5BE7s4sXXIb9kw6bA1JuHFyT6u9R/exec";

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

// ===== Ticker (Movers) =====
function renderMoversTicker(movers) {
  const ticker = document.getElementById("moversTicker");
  if (!ticker) return;

  ticker.innerHTML = (movers || []).map(m => {
    const change = m["Change%"] ? parseFloat(m["Change%"]) : 0;
    const arrow = change >= 0 ? "⬆" : "⬇";
    const cls = change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
    return `<span class="${cls} font-semibold">${m.Name} ₹${m.CMP} ${arrow} ${m["Change%"]}%</span>`;
  }).join(" | ");
}

// ===== IPO Render =====
function renderFullIPOs(data) {
  const ipoUpcoming = document.getElementById("ipoUpcoming");
  if (ipoUpcoming) {
    let limit = ipoUpcoming.dataset.full === "true" ? data.ipos_upcoming.length : 10;
    ipoUpcoming.innerHTML = "";
    (data.ipos_upcoming || []).slice(0, limit).forEach(i => {
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

  const ipoRecent = document.getElementById("ipoRecent");
  if (ipoRecent) {
    let limit = ipoRecent.dataset.full === "true" ? data.ipos_recent.length : 10;
    ipoRecent.innerHTML = "";
    (data.ipos_recent || []).slice(0, limit).forEach(i => {
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
    // Loader message
    const loaderMsg = document.createElement("div");
    loaderMsg.id = "loaderMsg";
    loaderMsg.className = "bg-yellow-200 text-yellow-800 text-center py-1";
    loaderMsg.innerHTML = "⏳ Please wait, loading data (10s)...";
    document.body.prepend(loaderMsg);

    const res = await fetch(url);
    const data = await res.json();

    // Remove loader
    document.getElementById("loaderMsg")?.remove();

    // IPOs
    renderFullIPOs(data);

    // NEWS
    const newsList = document.getElementById("newsList");
    if (newsList) {
      let limit = newsList.dataset.full === "true" ? data.news.length : 6;
      newsList.innerHTML = "";
      (data.news || []).slice(0, limit).forEach(n => {
        newsList.innerHTML += `
          <div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-700">
            <a href="${n.Link || "#"}" target="_blank" class="font-medium">${n.Title}</a>
            <div class="text-xs text-gray-500 mt-1">${n.Published || ""}</div>
          </div>`;
      });
    }

    // PICKS
    const picksList = document.getElementById("picksList");
    if (picksList) {
      let limit = picksList.dataset.full === "true" ? data.picks.length : 4;
      picksList.innerHTML = "";
      (data.picks || []).slice(0, limit).forEach(p => {
        picksList.innerHTML += `<div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-700">
          <strong>${p.Stock}</strong>
          <div class="text-xs mt-1">${p.Reason || ""}</div>
        </div>`;
      });
    }

    // MOVERS
    const moversList = document.getElementById("moversList");
    if (moversList) {
      let limit = moversList.dataset.full === "true" ? data.movers.length : 10;
      moversList.innerHTML = "";
      (data.movers || []).slice(0, limit).forEach(m => {
        const change = m["Change%"] ? parseFloat(m["Change%"]) : 0;
        const cls = change >= 0
          ? "bg-green-50 dark:bg-green-900"
          : "bg-red-50 dark:bg-red-900";
        moversList.innerHTML += `
          <div class="searchable p-3 border rounded ${cls}">
            <strong>${m.Name}</strong>
            <span class="text-sm">₹${m.CMP} (${m["Change%"] || ""}%)</span>
          </div>`;
      });
    }

    // MOVERS Ticker
    renderMoversTicker(data.movers);

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

window.onload = loadData;
