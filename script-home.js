document.addEventListener("DOMContentLoaded", async () => {
  // API_URL common.js se aayega
  console.log("✅ script-home.js loaded, using API:", API_URL);

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
    console.log("Home API Response:", data);

    // ===== NEWS TICKER =====
    const newsTicker = document.getElementById("tickerText");
    if (newsTicker && data.news) {
      newsTicker.innerHTML = data.news
        .map((item) => `📰 ${item.Title}`)
        .join(" • ");
    }

    // ===== MOVERS TICKER =====
    const moversTicker = document.getElementById("moversTicker");
    if (moversTicker && data.movers) {
      moversTicker.innerHTML = data.movers
        .map((m) => {
          let change = parseFloat(m["Change%"]);
          let color =
            change > 0
              ? "text-green-400"
              : change < 0
              ? "text-red-400"
              : "text-white";
          return `<span class="${color}">${m.Name} ₹${m.CMP} (${change}%)</span>`;
        })
        .join(" • ");
    }

    // ===== NEWS SECTION =====
    const newsList = document.getElementById("newsList");
    if (newsList && data.news) {
      newsList.innerHTML = data.news
        .slice(0, 6)
        .map(
          (n) => `
        <div class="p-2 border rounded">
          <a href="${n.Link}" target="_blank" class="font-semibold hover:underline">
            ${n.Title}
          </a>
          <p class="text-xs text-gray-400">${n.Published}</p>
        </div>`
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
        </tr>`
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
        </tr>`
        )
        .join("");
    }

    // ===== TOP MOVERS (cards home page) =====
    const moversContainer = document.getElementById("moversList");
    if (moversContainer && data.movers) {
      moversContainer.innerHTML = data.movers
        .slice(0, 6)
        .map((m) => {
          let change = parseFloat(m["Change%"]);
          let bg =
            change > 0
              ? "bg-green-600"
              : change < 0
              ? "bg-red-600"
              : "bg-gray-600";
          return `
          <div class="p-2 rounded text-white ${bg}">
            ${m.Name} ₹${m.CMP} (${change}%)
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
          <a href="${p.Link}" target="_blank" class="font-semibold hover:underline">
            ${p.Stock}
          </a>
          <p class="text-xs text-gray-400">${p.Reason}</p>
        </div>`
        )
        .join("");
    }
  } catch (err) {
    console.error("Error loading home data", err);
  }
});