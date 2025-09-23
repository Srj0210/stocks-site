const url = "https://script.google.com/macros/s/AKfycbyShXMyUufctA4ByFSNRKO4b5mMwTO6-C0eeiIqQM-hSSDgGGqw1qa_brHGdMq4pLhm/exec";

// ===== Movers Bulletin =====
function renderMoversTicker(movers) {
  const ticker = document.getElementById("moversTicker");
  if (!ticker) return;

  // Ensure Type is set (fallback: based on Change sign)
  movers.forEach(m => {
    if (!m.Type) {
      let changeVal = parseFloat((m.Change || "0").toString().replace("%", ""));
      if (!isNaN(changeVal)) {
        m.Type = changeVal >= 0 ? "Gainer" : "Loser";
      }
    }
  });

  // Top 5 gainers & 5 losers
  const gainers = movers.filter(m => m.Type && m.Type.toLowerCase().includes("gainer")).slice(0, 5);
  const losers = movers.filter(m => m.Type && m.Type.toLowerCase().includes("loser")).slice(0, 5);

  // Agar data hi nahi mila
  if (gainers.length === 0 && losers.length === 0) {
    ticker.innerHTML = "<span class='text-gray-400'>No movers data available</span>";
    return;
  }

  // Format with arrows
  const gainerText = gainers.map(g =>
    `<span class="text-green-600 dark:text-green-400 font-semibold">
      ${g.Name} ₹${g.CMP} ⬆ ${g.Change || '0'}%
    </span>`
  ).join(" | ");

  const loserText = losers.map(l =>
    `<span class="text-red-600 dark:text-red-400 font-semibold">
      ${l.Name} ₹${l.CMP} ⬇ ${l.Change || '0'}%
    </span>`
  ).join(" | ");

  // Show both if available
  if (gainerText && loserText) {
    ticker.innerHTML = gainerText + " || " + loserText;
  } else {
    ticker.innerHTML = gainerText || loserText;
  }
}

// ===== MAIN LOAD FUNCTION =====
async function loadData() {
  try {
    const res = await fetch(url);
    const data = await res.json();

    // ===== News Ticker =====
    const ticker = document.getElementById("tickerText");
    ticker.innerHTML = data.news.slice(0, 6).map(n => n.Title).join(" | ");

    // ===== News Section =====
    const newsList = document.getElementById("newsList");
    newsList.innerHTML = "";
    (data.news.slice(0, 6)).forEach(n => {
      newsList.innerHTML += `
        <div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-700">
          <a href="${n.Link || '#'}" target="_blank" class="font-medium">${n.Title}</a>
          <div class="text-xs text-gray-500 mt-1">${n.Published || ''}</div>
        </div>`;
    });

    // ===== IPOs (Upcoming) =====
    const ipoUpcoming = document.getElementById("ipoUpcoming");
    ipoUpcoming.innerHTML = "";
    (data.ipos_upcoming || []).slice(0, 10).forEach(i => {
      ipoUpcoming.innerHTML += `<tr class="searchable">
        <td class="border px-2 py-1">${i.Name || ''}</td>
        <td class="border px-2 py-1">${i["Open Date"] || ''}</td>
        <td class="border px-2 py-1">${i["Close Date"] || ''}</td>
        <td class="border px-2 py-1">${i["Price Band"] || ''}</td>
      </tr>`;
    });

    // ===== IPOs (Recent) =====
    const ipoRecent = document.getElementById("ipoRecent");
    ipoRecent.innerHTML = "";
    (data.ipos_recent || []).slice(0, 10).forEach(i => {
      ipoRecent.innerHTML += `<tr class="searchable">
        <td class="border px-2 py-1">${i.Name || ''}</td>
        <td class="border px-2 py-1">${i["Listing Date"] || ''}</td>
        <td class="border px-2 py-1">${i["MCap (Cr)"] || ''}</td>
        <td class="border px-2 py-1">${i["IPO Price"] || ''}</td>
        <td class="border px-2 py-1">${i["% Change"] || ''}</td>
      </tr>`;
    });

    // ===== Movers (Cards + Ticker) =====
    const moversList = document.getElementById("moversList");
    moversList.innerHTML = "";
    (data.movers.slice(0, 10)).forEach(m => {
      const cls = (m.Type && m.Type.toLowerCase().includes('gainer'))
        ? 'bg-green-50 dark:bg-green-900'
        : 'bg-red-50 dark:bg-red-900';
      moversList.innerHTML += `
        <div class="searchable p-3 border rounded ${cls}">
          <strong>${m.Name}</strong> 
          <span class="text-sm">₹${m.CMP} (${m.Change || ''}%)</span>
          <div class="text-xs mt-1">${m.Type || ''}</div>
        </div>`;
    });

    // ✅ Movers Bulletin
    renderMoversTicker(data.movers);

    // ===== Picks =====
    const picksList = document.getElementById("picksList");
    picksList.innerHTML = "";
    (data.picks.slice(0, 4)).forEach(p => {
      picksList.innerHTML += `<div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-700">
        <strong>${p.Stock}</strong>
        <div class="text-xs mt-1">${p.Reason || ''}</div>
      </div>`;
    });

  } catch (err) {
    console.error("❌ Error loading data:", err);
  }
}

// ===== SEARCH =====
function searchContent(){ 
  let input = document.getElementById("searchBox").value.toLowerCase(); 
  document.querySelectorAll(".searchable").forEach(el=>{
    el.style.display = el.innerText.toLowerCase().includes(input) ? "" : "none"; 
  }); 
}

window.onload = loadData;
