document.addEventListener("DOMContentLoaded", async () => {
  console.log("Home JS Loaded ✅");

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
    const newsTicker = document.getElementById("tickerText");
    if (newsTicker && Array.isArray(data.news)) {
      newsTicker.innerHTML = data.news
        .map((item) => `📰 ${item.Title}`)
        .join(" | ");
      // speed control
      newsTicker.style.animationDuration = "75s";
    }

    // ===== MOVERS TICKER =====
    const moversTicker = document.getElementById("moversTicker");
    if (moversTicker && Array.isArray(data.movers)) {
      moversTicker.innerHTML = data.movers
        .map((m) => {
          let change = parseFloat(m["Change%"] || m.Change || 0);
          let color =
            change > 0
              ? "text-green-400"
              : change < 0
              ? "text-red-400"
              : "text-white";
          return `<span class="${color}">${m.Name} ₹${m.CMP} (${change}%)</span>`;
        })
        .join(" | ");
      moversTicker.style.animationDuration = "80s";
    }

    // ===== NEWS SECTION (6 only) =====
    const newsList = document.getElementById("newsList");
    if (newsList && Array.isArray(data.news)) {
      newsList.innerHTML = "";
      data.news.slice(0, 6).forEach((n) => {
        newsList.innerHTML += `
          <div class="searchable p-3 border rounded bg-gray-800">
            <a href="${n.Link}" target="_blank" class="font-medium">${n.Title}</a>
            <div class="text-xs text-gray-400 mt-1">${n.Published || ""}</div>
          </div>`;
      });
    }

    // ===== UPCOMING IPOs =====
    const upcomingTable = document.getElementById("ipoUpcoming");
    if (upcomingTable && Array.isArray(data.ipos_upcoming)) {
      upcomingTable.innerHTML = data.ipos_upcoming
        .slice(0, 10)
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
    if (recentTable && Array.isArray(data.ipos_recent)) {
      recentTable.innerHTML = data.ipos_recent
        .slice(0, 10)
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

    // ===== TOP MOVERS (cards) =====
    const moversContainer = document.getElementById("moversList");
    if (moversContainer && Array.isArray(data.movers)) {
      moversContainer.innerHTML = data.movers
        .slice(0, 6)
        .map((m) => {
          let change = parseFloat(m["Change%"] || m.Change || 0);
          let bg =
            change > 0
              ? "bg-green-600"
              : change < 0
              ? "bg-red-600"
              : "bg-gray-600";
          return `
          <div class="p-2 rounded ${bg}">
            ${m.Name} ₹${m.CMP} (${change}%)
          </div>`;
        })
        .join("");
    }

    // ===== STOCK PICKS =====
    const picksContainer = document.getElementById("picksList");
    if (picksContainer && Array.isArray(data.picks)) {
      picksContainer.innerHTML = data.picks
        .slice(0, 4)
        .map(
          (p) => `
        <div class="p-2 border rounded bg-gray-800">
          <p>${p.Stock}</p>
          <small>${p.Reason}</small>
        </div>`
        )
        .join("");
    }
  } catch (err) {
    console.error("Error loading home data", err);
  }
});