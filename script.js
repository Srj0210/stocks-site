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
  if (isNaN(d.getTime())) return dateStr; // fallback
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

// ===== MAIN LOAD FUNCTION =====
async function loadData() {
  try {
    document.body.insertAdjacentHTML("afterbegin", 
      `<div id="loadingMsg" class="text-center p-2 bg-yellow-200 dark:bg-yellow-600 text-black dark:text-white">
        ⏳ Please wait, loading data (10s)...
      </div>`
    );

    const res = await fetch(url);
    const data = await res.json();
    document.getElementById("loadingMsg")?.remove();

    // ===== NEWS =====
    const ticker = document.getElementById("tickerText");
    if (ticker) ticker.innerHTML = (data.news || []).map(n => n.Title).join(" | ");

    const newsList = document.getElementById("newsList");
    if (newsList) {
      newsList.innerHTML = "";
      let limit = document.title.includes("All News") ? data.news.length : 6;
      (data.news || []).slice(0, limit).forEach(n => {
        newsList.innerHTML += `
          <div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-700">
            <a href="${n.Link || "#"}" target="_blank" class="font-medium">${n.Title}</a>
            <div class="text-xs text-gray-500 mt-1">${n.Published || ""}</div>
          </div>`;
      });
    }

    // ===== IPO UPCOMING =====
    const ipoUpcoming = document.getElementById("ipoUpcoming");
    if (ipoUpcoming) {
      ipoUpcoming.innerHTML = "";
      let limit = document.title.includes("Upcoming IPOs") ? data.ipos_upcoming.length : 10;
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

    // ===== IPO RECENT =====
    const ipoRecent = document.getElementById("ipoRecent");
    if (ipoRecent) {
      ipoRecent.innerHTML = "";
      let limit = document.title.includes("Recent IPOs") ? data.ipos_recent.length : 10;
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

    // ===== MOVERS =====
    const moversList = document.getElementById("moversList");
    if (moversList) {
      moversList.innerHTML = "";
      let limit = document.title.includes("Top Movers") ? data.movers.length : 10;
      (data.movers || []).slice(0, limit).forEach(m => {
        const change = m["Change%"] ? parseFloat(m["Change%"]) : 0;
        const cls = change >= 0 ? "bg-green-50 dark:bg-green-900" : "bg-red-50 dark:bg-red-900";
        moversList.innerHTML += `
          <div class="searchable p-3 border rounded ${cls}">
            <strong>${m.Name}</strong> 
            <span class="text-sm">₹${m.CMP} (${m["Change%"] || "0"}%)</span>
          </div>`;
      });
    }

    // ===== PICKS =====
    const picksList = document.getElementById("picksList");
    if (picksList) {
      picksList.innerHTML = "";
      let limit = document.title.includes("Stock Picks") ? data.picks.length : 4;
      (data.picks || []).slice(0, limit).forEach(p => {
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
