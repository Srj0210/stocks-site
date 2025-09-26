// script-home.js

document.addEventListener("DOMContentLoaded", async () => {
  // Common.js se API_URL aata hai

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString("en-GB");
  }

  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    console.log("Home API Response: ", data);

    // ===== NEWS TICKER =====
    const newsTicker = document.getElementById("news-ticker");
    if (newsTicker && data.news) {
      newsTicker.innerHTML = `
        <div class="ticker-wrapper">
          <div class="ticker" style="animation: tickerNews 75s linear infinite;">
            ${data.news
              .map((item) => `<span class="ticker-item">📰 ${item.Title}</span>`)
              .join("")}
          </div>
        </div>
      `;
    }

    // ===== MOVERS TICKER =====
    const moversTicker = document.getElementById("movers-ticker");
    if (moversTicker && data.movers) {
      moversTicker.innerHTML = `
        <div class="ticker-wrapper">
          <div class="ticker" style="animation: tickerMovers 80s linear infinite;">
            ${data.movers
              .map((m) => {
                let change = parseFloat(String(m["Change%"]).replace("%", "").trim() || 0);
                let color =
                  change > 0
                    ? "text-green-400"
                    : change < 0
                    ? "text-red-400"
                    : "text-white";
                return `<span class="ticker-item ${color}">${m.Name} ₹${m.CMP} (${m["Change%"]})</span>`;
              })
              .join("")}
          </div>
        </div>
      `;
    }

    // ===== NEWS SECTION =====
    const newsList = document.getElementById("newsList");
    if (newsList && data.news) {
      newsList.innerHTML = data.news
        .slice(0, 6)
        .map(
          (item) => `
        <div class="p-2 border rounded">
          <a href="${item.Link}" target="_blank" class="font-semibold hover:underline">${item.Title}</a>
          <p class="text-xs text-gray-400">${item.Published || ""}</p>
        </div>
      `
        )
        .join("");
    }

    // ===== UPCOMING IPOs =====
    const upcomingTable = document.getElementById("ipoUpcoming");
    if (upcomingTable && data.ipos_upcoming) {
      upcomingTable.innerHTML = data.ipos_upcoming
        .map(
          (ipo) => `
        <tr>
          <td>${ipo.Name}</td>
          <td>${ipo["Issue Type"]}</td>
          <td>${ipo["Price Band"]}</td>
          <td>${formatDate(ipo["Open Date"])}</td>
          <td>${formatDate(ipo["Close Date"])}</td>
          <td>${ipo["Issue Size"]}</td>
        </tr>
      `
        )
        .join("");
    }

    // ===== RECENT IPOs =====
    const recentTable = document.getElementById("ipoRecent");
    if (recentTable && data.ipos_recent) {
      recentTable.innerHTML = data.ipos_recent
        .map(
          (ipo) => `
        <tr>
          <td>${ipo.Name}</td>
          <td>${ipo["Issue Type"]}</td>
          <td>${ipo["Price Band"]}</td>
          <td>${formatDate(ipo["Open Date"])}</td>
          <td>${formatDate(ipo["Close Date"])}</td>
          <td>${ipo["Issue Size"]}</td>
        </tr>
      `
        )
        .join("");
    }

    // ===== TOP MOVERS (cards home page) =====
    const moversContainer = document.getElementById("moversList");
    if (moversContainer && data.movers) {
      moversContainer.innerHTML = data.movers
        .slice(0, 6)
        .map((m) => {
          let change = parseFloat(String(m["Change%"]).replace("%", "").trim() || 0);
          let bg =
            change > 0
              ? "bg-green-600"
              : change < 0
              ? "bg-red-600"
              : "bg-gray-600";
          return `
          <div class="p-2 rounded ${bg}">
            ${m.Name} ₹${m.CMP} (${m["Change%"]})
          </div>`;
        })
        .join("");
    }

    // ===== STOCK PICKS =====
    const picksContainer = document.getElementById("picksList");
    if (picksContainer && data.picks) {
      picksContainer.innerHTML = data.picks
        .map(
          (p) => `
        <div class="p-2 border rounded">
          <a href="${p.Link}" target="_blank" class="font-semibold hover:underline">${p.Stock}</a>
          <small class="block text-gray-400">${p.Reason}</small>
        </div>
      `
        )
        .join("");
    }
  } catch (err) {
    console.error("Error loading home data", err);
  }
});