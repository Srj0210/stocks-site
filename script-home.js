// ===== API URL =====
const API_URL = "https://script.google.com/macros/s/AKfycby-VuqKc03bVz8OKCscnLZYsXX0RXcISFqVdXlp5BE7s4sXXIb9kw6bA1JuHFyT6u9R/exec";

// ===== Debug Log =====
console.log("🔥 script-home.js loaded...");

// ===== Loader =====
function showLoader(elId) {
  const el = document.getElementById(elId);
  if (el) {
    el.innerHTML = "<p class='text-center text-gray-400'>⏳ Loading data, please wait...</p>";
  }
}

// ===== Render News Ticker =====
function renderNewsTicker(news) {
  const ticker = document.getElementById("tickerText");
  if (!ticker) return;
  ticker.innerHTML = (news || []).map(n => n.Title).join(" | ");
}

// ===== Load Home Data =====
async function loadHome() {
  console.log("🚀 loadHome() called");

  // Loader messages
  showLoader("newsList");
  showLoader("moversList");
  showLoader("iposUpcomingList");
  showLoader("iposRecentList");
  showLoader("picksList");

  try {
    const res = await fetch(API_URL);
    console.log("🌐 Fetch status:", res.status);

    if (!res.ok) throw new Error("HTTP error " + res.status);

    const data = await res.json();
    console.log("✅ API Response:", data);

    // ===== News (limit 6) =====
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

    // ===== News Ticker =====
    renderNewsTicker(data.news);

    // ===== Movers (limit 10) =====
    const moversList = document.getElementById("moversList");
    if (moversList) {
      moversList.innerHTML = "";
      (data.movers || []).slice(0, 10).forEach(m => {
        const change = parseFloat(m["Change%"] || 0);
        const cls = change >= 0 ? "bg-green-900" : "bg-red-900";
        moversList.innerHTML += `
          <div class="p-2 rounded ${cls}">
            <strong>${m.Name}</strong> ₹${m.CMP} (${change}%)
          </div>`;
      });
    }

    // ===== Upcoming IPOs (limit 5) =====
    const iposUpcomingList = document.getElementById("iposUpcomingList");
    if (iposUpcomingList) {
      iposUpcomingList.innerHTML = "";
      (data.ipos_upcoming || []).slice(0, 5).forEach(ipo => {
        iposUpcomingList.innerHTML += `
          <tr class="searchable">
            <td>${ipo.Name}</td>
            <td>${ipo["Issue Type"]}</td>
            <td>${ipo["Price Band"]}</td>
            <td>${ipo["Open Date"]}</td>
            <td>${ipo["Close Date"]}</td>
            <td>${ipo["Issue Size"]}</td>
          </tr>`;
      });
    }

    // ===== Recent IPOs (limit 5) =====
    const iposRecentList = document.getElementById("iposRecentList");
    if (iposRecentList) {
      iposRecentList.innerHTML = "";
      (data.ipos_recent || []).slice(0, 5).forEach(ipo => {
        iposRecentList.innerHTML += `
          <tr class="searchable">
            <td>${ipo.Name}</td>
            <td>${ipo["Issue Type"]}</td>
            <td>${ipo["Price Band"]}</td>
            <td>${ipo["Open Date"]}</td>
            <td>${ipo["Close Date"]}</td>
            <td>${ipo["Issue Size"]}</td>
          </tr>`;
      });
    }

    // ===== Stock Picks (limit 6) =====
    const picksList = document.getElementById("picksList");
    if (picksList) {
      picksList.innerHTML = "";
      (data.picks || []).slice(0, 6).forEach(p => {
        picksList.innerHTML += `
          <div class="searchable p-3 border rounded bg-gray-800">
            <a href="${p.Link}" target="_blank" class="font-medium">${p.Stock}</a>
            <div class="text-xs text-gray-400 mt-1">${p.Reason || ""}</div>
          </div>`;
      });
    }

  } catch (err) {
    console.error("❌ Home load error:", err);
    alert("Failed to load data. Check console for details.");
  }
}

// ===== On Page Load =====
window.onload = loadHome;