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

// ===== News Ticker =====
function renderNewsTicker(news) {
  const ticker = document.getElementById("tickerText");
  if (!ticker) return;
  ticker.innerHTML = (news || []).map(n => n.Title).join(" | ");
}

// ===== Movers Ticker =====
function renderMoversTicker(movers) {
  const ticker = document.getElementById("moversTicker");
  if (!ticker) return;

  const text = movers.map(m => {
    const change = parseFloat(m.Change || 0);
    const arrow = change >= 0 ? "⬆" : "⬇";
    const cls = change >= 0 ? "text-green-400" : "text-red-400";
    return `<span class="${cls} font-semibold">${m.Name} ₹${m.CMP} ${arrow} ${m.Change || "0"}%</span>`;
  }).join(" | ");

  ticker.innerHTML = text;
}

// ===== Load Home Data =====
async function loadHome() {
  try {
    const res = await fetch(url);
    const data = await res.json();

    // === News (6 only) ===
    const newsList = document.getElementById("newsList");
    if (newsList) {
      newsList.innerHTML = "";
      (data.news || []).slice(0, 6).forEach(n => {
        newsList.innerHTML += `
          <div class="searchable p-3 border rounded bg-gray-800">
            <a href="${n.Link}" target="_blank" class="font-medium">${n.Title}</a>
            <div class="text-xs text-gray-400 mt-1">${n.Published || ""}</div>
          </div>`;
      });
    }

    // === News Ticker ===
    renderNewsTicker(data.news);

    // === IPOs Upcoming (5 only) ===
    const ipoUpcoming = document.getElementById("ipoUpcoming");
    if (ipoUpcoming) {
      ipoUpcoming.innerHTML = "";
      (data.ipos_upcoming || []).slice(0, 5).forEach(i => {
        ipoUpcoming.innerHTML += `<tr>
          <td class="border px-2 py-1">${i.Name || ""}</td>
          <td class="border px-2 py-1">${i["Issue Type"] || ""}</td>
          <td class="border px-2 py-1">${i["Price Band"] || ""}</td>
          <td class="border px-2 py-1">${formatDate(i["Open Date"])}</td>
          <td class="border px-2 py-1">${formatDate(i["Close Date"])}</td>
          <td class="border px-2 py-1">${i["Issue Size"] || ""}</td>
        </tr>`;
      });
    }

    // === IPOs Recent (5 only) ===
    const ipoRecent = document.getElementById("ipoRecent");
    if (ipoRecent) {
      ipoRecent.innerHTML = "";
      (data.ipos_recent || []).slice(0, 5).forEach(i => {
        ipoRecent.innerHTML += `<tr>
          <td class="border px-2 py-1">${i.Name || ""}</td>
          <td class="border px-2 py-1">${i["Issue Type"] || ""}</td>
          <td class="border px-2 py-1">${i["Price Band"] || ""}</td>
          <td class="border px-2 py-1">${formatDate(i["Open Date"])}</td>
          <td class="border px-2 py-1">${formatDate(i["Close Date"])}</td>
          <td class="border px-2 py-1">${i["Issue Size"] || ""}</td>
        </tr>`;
      });
    }

    // === Movers (10 only) ===
    const moversList = document.getElementById("moversList");
    if (moversList) {
      moversList.innerHTML = "";
      (data.movers || []).slice(0, 10).forEach(m => {
        const change = parseFloat(m.Change || 0);
        const cls = change >= 0
          ? "bg-green-900 text-white"
          : "bg-red-900 text-white";
        moversList.innerHTML += `
          <div class="p-2 rounded ${cls}">
            <strong>${m.Name}</strong> ₹${m.CMP} (${change}%)
          </div>`;
      });
    }

    // === Movers Ticker ===
    renderMoversTicker(data.movers);

    // === Picks (4 only) ===
    const picksList = document.getElementById("picksList");
    if (picksList) {
      picksList.innerHTML = "";
      (data.picks || []).slice(0, 4).forEach(p => {
        picksList.innerHTML += `
          <div class="p-3 border rounded bg-gray-800">
            <strong>${p.Stock}</strong>
            <div class="text-xs mt-1 text-gray-400">${p.Reason || ""}</div>
          </div>`;
      });
    }

  } catch (err) {
    console.error("❌ Home load error:", err);
  }
}

// ===== SEARCH =====
function searchContent(){ 
  let input = document.getElementById("searchBox").value.toLowerCase(); 
  document.querySelectorAll(".searchable").forEach(el=>{
    el.style.display = el.innerText.toLowerCase().includes(input) ? "" : "none"; 
  }); 
}

// ===== INIT =====
window.onload = loadHome;
