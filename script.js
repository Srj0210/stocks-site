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

// ================= MOVERS =================
function loadMovers(data) {
  const moversList = document.getElementById("moversList");
  moversList.innerHTML = "";
  (data.movers || []).slice(0, 10).forEach(m => {
    let isGainer = m.Type && m.Type.toLowerCase().includes("gainer");
    let arrow = isGainer ? "🟢 ▲" : "🔴 ▼";
    let cls = isGainer ? "bg-green-50 dark:bg-green-900" : "bg-red-50 dark:bg-red-900";
    moversList.innerHTML += `<div class="searchable p-3 border rounded ${cls}">
      <strong>${m.Name}</strong> <span class="text-sm">${arrow} ${m.CMP}</span>
      <div class="text-xs mt-1">${m.Type} | Change: ${m.Change}</div>
    </div>`;
  });
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
