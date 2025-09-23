const url = "https://script.google.com/macros/s/AKfycbyShXMyUufctA4ByFSNRKO4b5mMwTO6-C0eeiIqQM-hSSDgGGqw1qa_brHGdMq4pLhm/exec";

// ===== Movers Bulletin =====
function renderMoversTicker(movers) {
  const ticker = document.getElementById("moversTicker");
  if (!ticker) return;

  // Sare movers CMP + Change dikhana
  const text = movers.map(m => {
    const change = m.Change ? parseFloat(m.Change) : 0;
    const arrow = change >= 0 ? "⬆" : "⬇";
    const cls = change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
    return `<span class="${cls} font-semibold">${m.Name} ₹${m.CMP} ${arrow} ${m.Change || ''}%</span>`;
  }).join(" | ");

  ticker.innerHTML = text;
}

// ===== MAIN LOAD FUNCTION =====
async function loadData() {
  try {
    const res = await fetch(url);
    const data = await res.json();

    // ===== News Ticker =====
    const ticker = document.getElementById("tickerText");
    if (ticker) {
      ticker.innerHTML = data.news.slice(0, 6).map(n => n.Title).join(" | ");
    }

    // ===== News Section =====
    const newsList = document.getElementById("newsList");
    if (newsList) {
      newsList.innerHTML = "";
      (data.news.slice(0, 6)).forEach(n => {
        newsList.innerHTML += `
          <div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-700">
            <a href="${n.Link || '#'}" target="_blank" class="font-medium">${n.Title}</a>
            <div class="text-xs text-gray-500 mt-1">${n.Published || ''}</div>
          </div>`;
      });
    }

<!-- IPOs -->
<section id="ipos" class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
  <h2 class="text-xl font-bold mb-3">📊 Upcoming IPOs</h2>
  <div class="overflow-x-auto mb-6">
    <table class="w-full border border-gray-300 dark:border-gray-600 text-sm">
      <thead class="bg-gray-200 dark:bg-gray-700">
        <tr>
          <th class="border px-2 py-1">Name</th>
          <th class="border px-2 py-1">Issue Type</th>
          <th class="border px-2 py-1">Price Band</th>
          <th class="border px-2 py-1">Open Date</th>
          <th class="border px-2 py-1">Close Date</th>
          <th class="border px-2 py-1">Issue Size</th>
        </tr>
      </thead>
      <tbody id="ipoUpcoming"></tbody>
    </table>
  </div>
  <div class="text-right mb-6">
    <a href="ipos_upcoming.html" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800">View More Upcoming IPOs →</a>
  </div>

  <h2 class="text-xl font-bold mb-3">📈 Recent IPOs</h2>
  <div class="overflow-x-auto">
    <table class="w-full border border-gray-300 dark:border-gray-600 text-sm">
      <thead class="bg-gray-200 dark:bg-gray-700">
        <tr>
          <th class="border px-2 py-1">Name</th>
          <th class="border px-2 py-1">Issue Type</th>
          <th class="border px-2 py-1">Price Band</th>
          <th class="border px-2 py-1">Open Date</th>
          <th class="border px-2 py-1">Close Date</th>
          <th class="border px-2 py-1">Issue Size</th>
        </tr>
      </thead>
      <tbody id="ipoRecent"></tbody>
    </table>
  </div>
  <div class="text-right mt-3">
    <a href="ipos_recent.html" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800">View More Recent IPOs →</a>
  </div>
</section>
    
    // ✅ Movers Bulletin
    renderMoversTicker(data.movers);

    // ===== Picks =====
    const picksList = document.getElementById("picksList");
    if (picksList) {
      picksList.innerHTML = "";
      (data.picks.slice(0, 4)).forEach(p => {
        picksList.innerHTML += `<div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-700">
          <strong>${p.Stock}</strong>
          <div class="text-xs mt-1">${p.Reason || ''}</div>
        </div>`;
      });
    }

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
