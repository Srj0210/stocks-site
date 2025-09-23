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

  // ✅ MOVERS (CMP, P/E, MCap show karna hai)
  const moversList = document.getElementById("moversList");
  moversList.innerHTML = "";
  (data.movers || []).slice(0, 10).forEach((m, idx) => {
    moversList.innerHTML += `
      <div class="searchable p-3 border rounded bg-green-50 dark:bg-green-900">
        <strong>${idx + 1}. ${m.Name || ""}</strong>
        <div class="text-sm mt-1">CMP: ₹${m.CMP || "-"}</div>
        <div class="text-sm">P/E: ${m["P/E"] || "-"}</div>
        <div class="text-sm">MCap: ${m.MCap || "-"}</div>
      </div>`;
  });

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
