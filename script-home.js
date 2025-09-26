document.addEventListener("DOMContentLoaded", async () => {
  const API_URL = "https://script.google.com/macros/s/AKfycby-VuqKc03bVz8OKCscnLZYsXX0RXcISFqVdXlp5BE7s4sXXIb9kw6bA1JuHFyT6u9R/exec";

  // Helper: Date format DD-MM-YYYY
  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr; // fallback
    return d.toLocaleDateString("en-GB");
  }

  try {
    // Fetch all data once
    const response = await fetch(API_URL);
    const data = await response.json();
    console.log("Home API Response: ", data);

    // ===== NEWS TICKER =====
    const tickerText = document.getElementById("tickerText");
    if (tickerText && data.news) {
      tickerText.innerHTML = data.news
        .map((item) => `📰 ${item.Title}`)
        .join(" • ");
      tickerText.style.animation = "tickerNews 75s linear infinite";
    }

    // ===== MOVERS TICKER =====
    const moversTicker = document.getElementById("moversTicker");
    if (moversTicker && data.movers) {
      moversTicker.innerHTML = data.movers
        .map((m) => {
          const change = parseFloat(m["Change%"]);
          let color =
            change > 0
              ? "text-green-400"
              : change < 0
              ? "text-red-400"
              : "text-white";
          const sign = change > 0 ? "+" : "";
          return `<span class="${color}">${m.Name} ₹${m.CMP} (${sign}${change}%)</span>`;
        })
        .join(" • ");
      moversTicker.style.animation = "tickerMovers 80s linear infinite";
    }

    // ===== NEWS SECTION (cards) =====
    const newsList = document.getElementById("newsList");
    if (newsList && data.news) {
      newsList.innerHTML = data.news
        .slice(0, 6)
        .map(
          (n) => `
          <div class="p-3 border rounded bg-gray-800 hover:bg-gray-700 transition">
            <a href="${n.Link}" target="_blank" class="font-semibold hover:underline block">
              📰 ${n.Title}
            </a>
            <small class="text-gray-400">${n.Published}</small>
          </div>`
        )
        .join("");
    }

    // ===== UPCOMING IPOs =====
    const upcomingTable = document.getElementById("ipoUpcoming");
    if (upcomingTable && data.ipos_upcoming) {
      upcomingTable.innerHTML = data.ipos_upcoming
        .slice(0, 5)
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
        .slice(0, 5)
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

    // ===== TOP MOVERS (cards) =====
    const moversContainer = document.getElementById("moversList");
    if (moversContainer && data.movers) {
      moversContainer.innerHTML = data.movers
        .slice(0, 6)
        .map((m) => {
          const change = parseFloat(m["Change%"]);
          let bg =
            change > 0
              ? "bg-green-600"
              : change < 0
              ? "bg-red-600"
              : "bg-gray-600";
          const sign = change > 0 ? "+" : "";
          return `
          <div class="p-2 rounded ${bg}">
            ${m.Name} ₹${m.CMP} (${sign}${change}%)
          </div>`;
        })
        .join("");
    }

    // ===== STOCK PICKS =====
    const picksContainer = document.getElementById("picksList");
    if (picksContainer && data.picks) {
      picksContainer.innerHTML = data.picks
        .slice(0, 6)
        .map(
          (p) => `
        <div class="p-3 border rounded bg-gray-800 hover:bg-gray-700 transition">
          <a href="${p.Link}" target="_blank" class="font-semibold hover:underline block">
            🎯 ${p.Stock}
          </a>
          <small class="text-gray-400">${p.Reason}</small>
        </div>
      `
        )
        .join("");
    }
  } catch (err) {
    console.error("Error loading home data", err);
  }
});