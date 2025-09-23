const url = "https://script.google.com/macros/s/AKfycbxaiHFAvUOfC5gnP49B0yDLXjD-FE-En-guZUFW8b7n4QptLPRKKiJ_u9l2QSKA1l1D/exec";

async function loadData() {
  try {
    const res = await fetch(url);
    const data = await res.json();

    // === Ticker ===
    const ticker = document.getElementById("tickerText");
    if (ticker) {
      ticker.innerHTML = data.news.map(n => n.Title).join(" | ");
    }

    // === News (6 on homepage) ===
    const newsList = document.getElementById("newsList");
    if (newsList) {
      newsList.innerHTML = data.news.slice(0, 6).map(n => `
        <div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-700">
          <a href="${n.Link}" target="_blank" class="font-medium">${n.Title}</a>
          <div class="text-xs text-gray-500 mt-1">${n.Published || ""}</div>
        </div>
      `).join("");
    }

    // === IPO Upcoming ===
    const ipoUpcoming = document.getElementById("ipoUpcoming");
    if (ipoUpcoming) {
      ipoUpcoming.innerHTML = data.ipos_upcoming.slice(0, 10).map(i => `
        <tr>
          <td class="border px-2 py-1">${i.Name || ""}</td>
          <td class="border px-2 py-1">${i["Open Date"] || ""}</td>
          <td class="border px-2 py-1">${i["Close Date"] || ""}</td>
          <td class="border px-2 py-1">${i["Price Band"] || ""}</td>
        </tr>
      `).join("");
    }

    // === IPO Recent ===
    const ipoRecent = document.getElementById("ipoRecent");
    if (ipoRecent) {
      ipoRecent.innerHTML = data.ipos_recent.slice(0, 10).map(i => `
        <tr>
          <td class="border px-2 py-1">${i.Name || ""}</td>
          <td class="border px-2 py-1">${i["Listing Date"] || ""}</td>
          <td class="border px-2 py-1">${i["MCap (Cr)"] || ""}</td>
          <td class="border px-2 py-1">${i["IPO Price"] || ""}</td>
          <td class="border px-2 py-1">${i["% Change"] || ""}</td>
        </tr>
      `).join("");
    }

// Movers Cards (Index Page)
async function loadMoversCards() {
  try {
    let res = await fetch(apiUrl + "?sheet=Movers");
    let data = await res.json();

    let container = document.getElementById("moversList");
    container.innerHTML = "";

    // Sirf Top 10 entries dikhana
    data.slice(0, 10).forEach((row) => {
      let card = document.createElement("div");
      card.className = "p-3 bg-green-700 text-white rounded shadow";

      card.innerHTML = `
        <h3 class="font-bold">${row.Name || "N/A"}</h3>
        <p>CMP: ${row.CMP || "-"} | P/E: ${row["P/E"] || "-"} | MCap: ${row.MCap || "-"}</p>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading movers cards:", err);
    document.getElementById("moversList").innerText = "Failed to load movers.";
  }
}

loadMoversCards();

    // === Picks (4 on homepage) ===
    const picksList = document.getElementById("picksList");
    if (picksList) {
      picksList.innerHTML = data.picks.slice(0, 4).map(p => `
        <div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-700">
          <strong>${p.Stock}</strong>
          <div class="text-xs mt-1">${p.Reason || ""}</div>
        </div>
      `).join("");
    }

  } catch (err) {
    console.error("Error loading data:", err);
  }
}

// === Search ===
function searchContent(){ 
  let input=document.getElementById("searchBox").value.toLowerCase(); 
  document.querySelectorAll(".searchable").forEach(el=>{
    el.style.display = el.innerText.toLowerCase().includes(input) ? "" : "none"; 
  }); 
}

window.onload = loadData;
