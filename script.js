const url = "https://script.google.com/macros/s/AKfycbyShXMyUufctA4ByFSNRKO4b5mMwTO6-C0eeiIqQM-hSSDgGGqw1qa_brHGdMq4pLhm/exec";

// ================= NEWS =================
function loadNews(data) {
  const ticker = document.getElementById("tickerText");
  ticker.innerHTML = (data.news || []).slice(-6).map(n => n.Title).join(" | ");

  const newsList = document.getElementById("newsList");
  newsList.innerHTML = "";
  (data.news || []).slice(0, 6).forEach(n => {
    newsList.innerHTML += `<div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-700">
      <a href="${n.Link}" target="_blank" class="font-medium">${n.Title}</a>
      <div class="text-xs text-gray-500 mt-1">${n.Published || ""}</div>
    </div>`;
  });
}

// ================= BULLETIN =================
function loadBulletin(data) {
  let movers = data.movers || [];
  let gainers = movers.filter(m => m.Type.toLowerCase().includes("gainer")).slice(0, 5);
  let losers = movers.filter(m => m.Type.toLowerCase().includes("loser")).slice(0, 5);

  let items = [];
  gainers.forEach(g => { items.push(`🟢 ▲ ${g.Name} ₹${g.CMP} (+${g.Change})`); });
  losers.forEach(l => { items.push(`🔴 ▼ ${l.Name} ₹${l.CMP} (${l.Change})`); });

  document.getElementById("bulletinTicker").innerHTML = items.join(" | ");
}

// ================= MOVERS (Top Gainers / Losers) =================
async function loadMovers() {
  try {
    const res = await fetch(API_URL + "?type=movers"); // AppScript URL + movers param
    const data = await res.json();

    // Homepage cards
    const list = document.getElementById("moversList");
    if (list) {
      list.innerHTML = "";
      data.slice(0, 10).forEach(row => {
        const name = row["Name"] || "N/A";
        const cmp = row["CMP"] || "-";
        const pe = row["P/E"] || "-";
        const mcap = row["MCap"] || "-";
        const change = parseFloat(row["Change"] || "0");

        let arrow = "";
        let cardColor = "";
        if (change > 0) {
          arrow = `<span class="text-green-400 font-bold">↑ ${change}%</span>`;
          cardColor = "bg-green-700";
        } else if (change < 0) {
          arrow = `<span class="text-red-400 font-bold">↓ ${change}%</span>`;
          cardColor = "bg-red-700";
        } else {
          arrow = `<span class="text-gray-400 font-bold">0%</span>`;
          cardColor = "bg-gray-600";
        }

        const card = `
          <div class="p-3 rounded shadow ${cardColor} text-white">
            <h3 class="font-semibold">${name}</h3>
            <p class="text-sm">CMP: ₹${cmp}</p>
            <p class="text-sm">P/E: ${pe}</p>
            <p class="text-sm">MCap: ${mcap}</p>
            <p class="mt-1">${arrow}</p>
          </div>
        `;
        list.innerHTML += card;
      });
    }

    // Movers.html table
    const moversTable = document.getElementById("moversTable");
    if (moversTable) {
      moversTable.innerHTML = "";
      data.forEach((row, i) => {
        const name = row["Name"] || "N/A";
        const cmp = row["CMP"] || "-";
        const pe = row["P/E"] || "-";
        const mcap = row["MCap"] || "-";
        const change = parseFloat(row["Change"] || "0");

        let arrow = "";
        let colorClass = "";
        if (change > 0) {
          arrow = `<span class="text-green-500 font-bold">↑ ${change}%</span>`;
          colorClass = "bg-green-50 dark:bg-green-900";
        } else if (change < 0) {
          arrow = `<span class="text-red-500 font-bold">↓ ${change}%</span>`;
          colorClass = "bg-red-50 dark:bg-red-900";
        } else {
          arrow = `<span class="text-gray-500 font-bold">0%</span>`;
          colorClass = "bg-gray-50 dark:bg-gray-800";
        }

        moversTable.innerHTML += `
          <tr class="${colorClass}">
            <td class="border px-2 py-1">${i + 1}</td>
            <td class="border px-2 py-1">${name}</td>
            <td class="border px-2 py-1">₹${cmp}</td>
            <td class="border px-2 py-1">${pe}</td>
            <td class="border px-2 py-1">${mcap}</td>
            <td class="border px-2 py-1">${arrow}</td>
          </tr>
        `;
      });
    }

  } catch (err) {
    console.error("Movers load error:", err);
    const list = document.getElementById("moversList");
    if (list) list.innerHTML = "<p class='text-red-500'>Failed to load movers.</p>";
  }
}

// ================= IPOs =================
function loadIPOs(data) {
  const ipoUpcoming = document.getElementById("ipoUpcoming");
  ipoUpcoming.innerHTML = "";
  (data.ipos_upcoming || []).slice(0, 10).forEach(i => {
    ipoUpcoming.innerHTML += `<tr class="searchable">
      <td class="border px-2 py-1">${i.Name}</td>
      <td class="border px-2 py-1">${i["Open Date"]}</td>
      <td class="border px-2 py-1">${i["Close Date"]}</td>
      <td class="border px-2 py-1">${i["Price Band"]}</td>
    </tr>`;
  });

  const ipoRecent = document.getElementById("ipoRecent");
  ipoRecent.innerHTML = "";
  (data.ipos_recent || []).slice(0, 10).forEach(i => {
    ipoRecent.innerHTML += `<tr class="searchable">
      <td class="border px-2 py-1">${i.Name}</td>
      <td class="border px-2 py-1">${i["Listing Date"]}</td>
      <td class="border px-2 py-1">${i["MCap (Cr)"]}</td>
      <td class="border px-2 py-1">${i["IPO Price"]}</td>
      <td class="border px-2 py-1">${i["% Change"]}</td>
    </tr>`;
  });
}

// ================= PICKS =================
function loadPicks(data) {
  const picksList = document.getElementById("picksList");
  picksList.innerHTML = "";
  (data.picks || []).slice(0, 4).forEach(p => {
    picksList.innerHTML += `<div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-700">
      <strong>${p.Stock}</strong>
      <div class="text-xs mt-1">${p.Reason}</div>
    </div>`;
  });
}

// ================= LOAD ALL =================
async function loadData() {
  try {
    const res = await fetch(url);
    const data = await res.json();
    loadNews(data);
    loadIPOs(data);
    loadMovers(data);
    loadPicks(data);
    loadBulletin(data);
  } catch (err) {
    console.error(err);
  }
}

// ================= SEARCH =================
function searchContent(){ 
  let input=document.getElementById("searchBox").value.toLowerCase(); 
  document.querySelectorAll(".searchable").forEach(el=>{
    el.style.display = el.innerText.toLowerCase().includes(input) ? "" : "none"; 
  }); 
}

window.onload = loadData;
