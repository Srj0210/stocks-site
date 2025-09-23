// ============= CONFIG =============
const API_URL = "https://script.google.com/macros/s/AKfycbwWuKCYHmv4CVs_NKKYmJhzCpwHEGQolrvIIM0z6s9p1UZZX21Dq7mvHFP_cEEwVsLG/exec";

// ============= SEARCH FUNCTION =============
function searchContent() {
  const input = document.getElementById("searchBox").value.toLowerCase();
  const sections = ["newsList", "ipoUpcoming", "ipoRecent", "moversList", "picksList"];

  sections.forEach(sectionId => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    const items = section.getElementsByTagName("div");

    for (let i = 0; i < items.length; i++) {
      const text = items[i].innerText.toLowerCase();
      items[i].style.display = text.includes(input) ? "" : "none";
    }
  });
}

// ============= LOAD NEWS =============
async function loadNews() {
  try {
    const res = await fetch(API_URL);
    const json = await res.json();
    const data = json.news || [];
    const newsList = document.getElementById("newsList");
    const ticker = document.getElementById("tickerText");

    newsList.innerHTML = "";
    if (!data.length) {
      newsList.innerHTML = "<p>No news available.</p>";
      return;
    }

    data.slice(0, 6).forEach(item => {
      const div = document.createElement("div");
      div.className = "p-3 border rounded bg-gray-100 dark:bg-gray-700 hover:scale-105 transition-transform";
      div.innerHTML = `
        <a href="${item.Link}" target="_blank" class="font-semibold hover:underline">${item.Title}</a>
        <p class="text-xs mt-1">${item.Published}</p>
      `;
      newsList.appendChild(div);
    });

    // Ticker (sab news concatenate karke)
    ticker.innerText = data.map(n => n.Title).join(" ⚡ ");
  } catch (e) {
    console.error("News load error:", e);
  }
}

// ============= LOAD PICKS =============
async function loadPicks() {
  try {
    const res = await fetch(API_URL);
    const json = await res.json();
    const data = json.picks || [];
    const picksList = document.getElementById("picksList");

    picksList.innerHTML = "";
    if (!data.length) {
      picksList.innerHTML = "<p>No picks available.</p>";
      return;
    }

    data.slice(0, 6).forEach(item => {
      const div = document.createElement("div");
      div.className = "p-3 border rounded bg-gray-100 dark:bg-gray-700 hover:scale-105 transition-transform";
      div.innerHTML = `
        <a href="${item.Link}" target="_blank" class="font-semibold hover:underline">${item.Stock}</a>
        <p class="text-xs mt-1">${item.Reason}</p>
      `;
      picksList.appendChild(div);
    });
  } catch (e) {
    console.error("Picks load error:", e);
  }
}

// ============= LOAD MOVERS =============
async function loadMovers() {
  try {
    const res = await fetch(API_URL);
    const json = await res.json();
    const data = json.movers || json.GainersLosers || [];
    const moversList = document.getElementById("moversList");

    moversList.innerHTML = "";
    if (!data.length) {
      moversList.innerHTML = "<p>Failed to load movers.</p>";
      return;
    }

    data.slice(0, 10).forEach(row => {
      let changeVal = parseFloat(row["%Change"] || row.change || "0");
      let isGainer = changeVal >= 0;

      const card = document.createElement("div");
      card.className = `p-3 rounded shadow hover:scale-105 transition-transform ${
        isGainer ? "bg-green-600 text-white" : "bg-red-600 text-white"
      }`;

      card.innerHTML = `
        <strong>${row.Name || "N/A"}</strong><br>
        CMP: ${row.CMP || "-"} | P/E: ${row["P/E"] || "-"} | MCap: ${row.MCap || "-"}<br>
        Change: ${row["%Change"] || "-"}%
      `;

      moversList.appendChild(card);
    });
  } catch (e) {
    console.error("Movers load error:", e);
    document.getElementById("moversList").innerHTML = "<p>Failed to load movers.</p>";
  }
}

// ============= LOAD RECENT IPOs =============
async function loadRecentIPOs() {
  try {
    const res = await fetch(API_URL);
    const json = await res.json();
    const data = json.ipos_recent || [];
    const tbody = document.getElementById("ipoRecent");

    tbody.innerHTML = "";
    if (!data.length) {
      tbody.innerHTML = "<tr><td colspan='5'>No recent IPOs.</td></tr>";
      return;
    }

    data.slice(0, 5).forEach(item => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="border px-2 py-1">${item.Name}</td>
        <td class="border px-2 py-1">${item["Listing Date"]}</td>
        <td class="border px-2 py-1">${item["MCap"] || "-"}</td>
        <td class="border px-2 py-1">${item.Price || "-"}</td>
        <td class="border px-2 py-1">${item["% Change"] || "-"}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    console.error("Recent IPO load error:", e);
  }
}

// ============= LOAD UPCOMING IPOs =============
async function loadUpcomingIPOs() {
  try {
    const res = await fetch(API_URL);
    const json = await res.json();
    const data = json.ipos_upcoming || [];
    const tbody = document.getElementById("ipoUpcoming");

    tbody.innerHTML = "";
    if (!data.length) {
      tbody.innerHTML = "<tr><td colspan='4'>No upcoming IPOs.</td></tr>";
      return;
    }

    data.slice(0, 5).forEach(item => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="border px-2 py-1">${item.Name}</td>
        <td class="border px-2 py-1">${item["Open Date"]}</td>
        <td class="border px-2 py-1">${item["Close Date"]}</td>
        <td class="border px-2 py-1">${item["Price Band"]}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    console.error("Upcoming IPO load error:", e);
  }
}

// ============= INIT =============
document.addEventListener("DOMContentLoaded", () => {
  loadNews();
  loadPicks();
  loadMovers();
  loadRecentIPOs();
  loadUpcomingIPOs();
});
