document.addEventListener("DOMContentLoaded", async () => {
  const API_URL = "https://script.google.com/macros/s/AKfycby-VuqKc03bVz8OKCscnLZYsXX0RXcISFqVdXlp5BE7s4sXXIb9kw6bA1JuHFyT6u9R/exec";

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
    const newsTicker = document.getElementById("tickerText");
    if (newsTicker && data.news) {
      newsTicker.innerHTML = data.news.map(
        (item) => `📰 ${item.Title}`
      ).join(" | ");
    }

    // ===== MOVERS TICKER =====
    const moversTicker = document.getElementById("moversTicker");
    if (moversTicker && data.movers) {
      moversTicker.innerHTML = data.movers.map((m) => {
        let change = parseFloat(m.Change);
        if (isNaN(change)) change = 0;
        let color =
          change > 0 ? "text-green-400" :
          change < 0 ? "text-red-400" : "text-white";
        return `<span class="${color}">${m.Name} ₹${m.CMP} (${change}%)</span>`;
      }).join(" | ");
    }

    // ===== NEWS SECTION (6 only) =====
    const newsList = document.getElementById("newsList");
    if (newsList && data.news) {
      newsList.innerHTML = "";
      data.news.slice(0, 6).forEach((n) => {
        newsList.innerHTML += `
          <div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-700">
            <a href="${n.Link}" target="_blank" class="font-medium">${n.Title}</a>
            <div class="text-xs text-gray-500 mt-1">${n.Published || ""}</div>
          </div>`;
      });
    }

    // ===== UPCOMING IPOs =====
    const ipoUpcoming = document.getElementById("ipoUpcoming");
    if (ipoUpcoming && data.ipos_upcoming) {
      ipoUpcoming.innerHTML = data.ipos_upcoming.map((ipo) => `
        <tr>
          <td>${ipo.Name}</td>
          <td>${ipo["Issue Type"]}</td>
          <td>${ipo["Price Band"]}</td>
          <td>${formatDate(ipo["Open Date"])}</td>
          <td>${formatDate(ipo["Close Date"])}</td>
          <td>${ipo["Issue Size"]}</td>
        </tr>`).join("");
    }

    // ===== RECENT IPOs =====
    const ipoRecent = document.getElementById("ipoRecent");
    if (ipoRecent && data.ipos_recent) {
      ipoRecent.innerHTML = data.ipos_recent.map((ipo) => `
        <tr>
          <td>${ipo.Name}</td>
          <td>${ipo["Issue Type"]}</td>
          <td>${ipo["Price Band"]}</td>
          <td>${formatDate(ipo["Open Date"])}</td>
          <td>${formatDate(ipo["Close Date"])}</td>
          <td>${ipo["Issue Size"]}</td>
        </tr>`).join("");
    }

    // ===== MOVERS (home cards) =====
    const moversList = document.getElementById("moversList");
    if (moversList && data.movers) {
      moversList.innerHTML = data.movers.slice(0, 10).map((m) => {
        let change = parseFloat(m.Change);
        if (isNaN(change)) change = 0;
        let bg =
          change > 0 ? "bg-green-50 dark:bg-green-900" :
          change < 0 ? "bg-red-50 dark:bg-red-900" :
          "bg-gray-200 dark:bg-gray-700";
        return `
          <div class="p-3 border rounded ${bg}">
            <strong>${m.Name}</strong>
            <span class="text-sm">₹${m.CMP} (${change}%)</span>
          </div>`;
      }).join("");
    }

    // ===== PICKS =====
    const picksList = document.getElementById("picksList");
    if (picksList && data.picks) {
      picksList.innerHTML = data.picks.map((p) => `
        <div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-700">
          <strong>${p.Stock}</strong>
          <div class="text-xs mt-1">${p.Reason || ""}</div>
        </div>`).join("");
    }

  } catch (err) {
    console.error("Error loading home data", err);
  }
});