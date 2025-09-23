// API endpoint
const API_URL =
  "https://script.google.com/macros/s/AKfycbxaiHFAvUOfC5gnP49B0yDLXjD-FE-En-guZUFW8b7n4QptLPRKKiJ_u9l2QSKA1l1D/exec";

// Data fetch
async function fetchData() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    renderData(data);
  } catch (err) {
    console.error("API fetch failed", err);
  }
}

// Render all sections
function renderData(data) {
  // ✅ NEWS
  const newsList = document.getElementById("newsList");
  newsList.innerHTML = "";
  (data.news || []).slice(0, 6).forEach((n) => {
    newsList.innerHTML += `
      <a href="${n.Link}" target="_blank" class="searchable p-3 border rounded hover:bg-gray-100 dark:hover:bg-gray-700">
        <strong>${n.Title}</strong>
        <div class="text-xs text-gray-500">${n.Published}</div>
      </a>`;
  });

  // ✅ Bulletin (slow)
  const ticker = document.getElementById("tickerText");
  ticker.innerHTML = (data.news || [])
    .map((n) => `<span class="mx-6">🔹 ${n.Title}</span>`)
    .join("");

  // Slow animation (60s instead of 40s)
  ticker.style.animation = "ticker 60s linear infinite";

  // ✅ PICKS
  const picksList = document.getElementById("picksList");
  picksList.innerHTML = "";
  (data.picks || []).slice(0, 6).forEach((p) => {
    picksList.innerHTML += `
      <a href="${p.Link}" target="_blank" class="searchable p-3 border rounded hover:bg-gray-100 dark:hover:bg-gray-700">
        <strong>${p.Stock}</strong>
        <div class="text-xs text-gray-500">${p.Reason}</div>
      </a>`;
  });

// Movers Section
async function loadMovers() {
  try {
    const response = await fetch(APP_SCRIPT_URL + "?sheet=GainersLosers");
    const data = await response.json();

    // Movers Cards (Homepage)
    const moversList = document.getElementById("moversList");
    moversList.innerHTML = "";
    data.slice(0, 8).forEach((row, index) => {
      moversList.innerHTML += `
        <div class="bg-green-600 text-white p-3 rounded shadow">
          <h3 class="font-bold text-lg">${row.Name}</h3>
          <p class="text-sm">CMP: ₹${row.CMP}</p>
          <p class="text-sm">P/E: ${row["P/E"]}</p>
          <p class="text-sm">MCap: ₹${row.MCap} Cr</p>
        </div>
      `;
    });

    // Movers Table (movers.html)
    const moversTable = document.getElementById("moversTable");
    if (moversTable) {
      moversTable.innerHTML = "";
      data.forEach((row, i) => {
        moversTable.innerHTML += `
          <tr>
            <td class="border px-2 py-1">${i + 1}</td>
            <td class="border px-2 py-1">${row.Name}</td>
            <td class="border px-2 py-1">₹${row.CMP}</td>
            <td class="border px-2 py-1">${row["P/E"]}</td>
            <td class="border px-2 py-1">₹${row.MCap} Cr</td>
          </tr>
        `;
      });
    }
  } catch (error) {
    console.error("Error loading movers:", error);
  }
}

  // ✅ IPO UPCOMING
  const ipoUpcoming = document.getElementById("ipoUpcoming");
  ipoUpcoming.innerHTML = "";
  (data.ipos_upcoming || []).slice(0, 6).forEach((ipo) => {
    ipoUpcoming.innerHTML += `
      <tr class="searchable">
        <td class="border px-2 py-1">${ipo.Name}</td>
        <td class="border px-2 py-1">${ipo["Open Date"] || ""}</td>
        <td class="border px-2 py-1">${ipo["Close Date"] || ""}</td>
        <td class="border px-2 py-1">${ipo["Price Band"] || ""}</td>
      </tr>`;
  });

  // ✅ IPO RECENT
  const ipoRecent = document.getElementById("ipoRecent");
  ipoRecent.innerHTML = "";
  (data.ipos_recent || []).slice(0, 6).forEach((ipo) => {
    ipoRecent.innerHTML += `
      <tr class="searchable">
        <td class="border px-2 py-1">${ipo.Name}</td>
        <td class="border px-2 py-1">${ipo["Listing Date"]}</td>
        <td class="border px-2 py-1">${ipo["MCap (Cr)"] || ""}</td>
        <td class="border px-2 py-1">${ipo["IPO Price"] || ""}</td>
        <td class="border px-2 py-1">${ipo["% Change"] || ""}</td>
      </tr>`;
  });
}

// ✅ Search filter
function searchContent() {
  const q = document.getElementById("searchBox").value.toLowerCase();
  document.querySelectorAll(".searchable").forEach((el) => {
    el.style.display = el.innerText.toLowerCase().includes(q) ? "" : "none";
  });
}

// Init
fetchData();
