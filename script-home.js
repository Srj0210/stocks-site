document.addEventListener("DOMContentLoaded", async () => {
  // Helper: Date format DD-MM-YYYY
  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr; 
    return d.toLocaleDateString("en-GB");
  }

  try {
    const response = await fetch(API_URL); // 👈 common.js se aa raha
    const data = await response.json();
    console.log("Home API Response: ", data);

    // ===== NEWS TICKER =====
    const newsTicker = document.getElementById("tickerText");
    if (newsTicker && data.news) {
      newsTicker.innerHTML = data.news.map(n => `📰 ${n.Title}`).join(" | ");
    }

    // ===== MOVERS TICKER =====
    const moversTicker = document.getElementById("moversTicker");
    if (moversTicker && data.movers) {
      moversTicker.innerHTML = data.movers
        .map(m => {
          let color = m.Change > 0 ? "text-green-400" : m.Change < 0 ? "text-red-400" : "text-white";
          return `<span class="${color}">${m.Name} ₹${m.CMP} (${m.Change}%)</span>`;
        })
        .join(" | ");
    }

    // ===== UPCOMING IPOs =====
    const upcomingTable = document.getElementById("ipoUpcoming");
    if (upcomingTable && data.ipos_upcoming) {
      upcomingTable.innerHTML = data.ipos_upcoming.map(ipo => `
        <tr>
          <td>${ipo.Name}</td>
          <td>${ipo["Issue Type"]}</td>
          <td>${ipo["Price Band"]}</td>
          <td>${formatDate(ipo["Open Date"])}</td>
          <td>${formatDate(ipo["Close Date"])}</td>
          <td>${ipo["Issue Size"]}</td>
        </tr>
      `).join("");
    }

    // ===== RECENT IPOs =====
    const recentTable = document.getElementById("ipoRecent");
    if (recentTable && data.ipos_recent) {
      recentTable.innerHTML = data.ipos_recent.map(ipo => `
        <tr>
          <td>${ipo.Name}</td>
          <td>${ipo["Issue Type"]}</td>
          <td>${ipo["Price Band"]}</td>
          <td>${formatDate(ipo["Open Date"])}</td>
          <td>${formatDate(ipo["Close Date"])}</td>
          <td>${ipo["Issue Size"]}</td>
        </tr>
      `).join("");
    }

    // ===== MOVERS CARDS =====
    const moversContainer = document.getElementById("moversList");
    if (moversContainer && data.movers) {
      moversContainer.innerHTML = data.movers.slice(0, 6).map(m => {
        let bg = m.Change > 0 ? "bg-green-600" : m.Change < 0 ? "bg-red-600" : "bg-gray-600";
        return `<div class="p-2 rounded ${bg}">${m.Name} ₹${m.CMP} (${m.Change}%)</div>`;
      }).join("");
    }

    // ===== PICKS =====
    const picksContainer = document.getElementById("picksList");
    if (picksContainer && data.picks) {
      picksContainer.innerHTML = data.picks.map(p => `
        <div class="p-2 border rounded">
          <p>${p.Stock}</p>
          <small>${p.Reason}</small>
        </div>
      `).join("");
    }

  } catch (err) {
    console.error("❌ Error loading home data", err);
  }
});