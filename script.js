const API_URL = "https://script.google.com/macros/s/AKfycbxaiHFAvUOfC5gnP49B0yDLXjD-FE-En-guZUFW8b7n4QptLPRKKiJ_u9l2QSKA1l1D/exec";

// Load data from backend
async function loadData() {
  try {
    const res = await fetch(API_URL, { cache: "no-store" });
    const data = await res.json();

    // 🔹 News (latest 6)
    const ticker = document.getElementById("tickerText");
    ticker.innerHTML = (data.news || []).slice(0, 6).map(n => n.Title).join(" | ");

    const newsList = document.getElementById("newsList");
    newsList.innerHTML = "";
    (data.news || []).slice(0, 6).forEach(n => {
      newsList.innerHTML += `
        <div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-700">
          <a href="${n.Link || "#"}" target="_blank" class="font-medium hover:underline">${n.Title}</a>
          <div class="text-xs text-gray-500 mt-1">${n.Published || ""}</div>
        </div>`;
    });

    // 🔹 Upcoming IPOs
    const ipoUpcoming = document.getElementById("ipoUpcoming");
    ipoUpcoming.innerHTML = "";
    (data.ipos_upcoming || []).slice(0, 10).forEach(i => {
      ipoUpcoming.innerHTML += `
        <tr class="searchable">
          <td class="border px-2 py-1">${i.Name || ""}</td>
          <td class="border px-2 py-1">${i["Open Date"] || ""}</td>
          <td class="border px-2 py-1">${i["Close Date"] || ""}</td>
          <td class="border px-2 py-1">${i["Price Band"] || ""}</td>
        </tr>`;
    });

    // 🔹 Recent IPOs
    const ipoRecent = document.getElementById("ipoRecent");
    ipoRecent.innerHTML = "";
    (data.ipos_recent || []).slice(0, 10).forEach(i => {
      ipoRecent.innerHTML += `
        <tr class="searchable">
          <td class="border px-2 py-1">${i.Name || ""}</td>
          <td class="border px-2 py-1">${i["Listing Date"] || ""}</td>
          <td class="border px-2 py-1">${i.MCap || ""}</td>
          <td class="border px-2 py-1">${i["IPO Price"] || ""}</td>
          <td class="border px-2 py-1">${i["% Change"] || ""}</td>
        </tr>`;
    });

    // 🔹 Movers
    const moversList = document.getElementById("moversList");
    moversList.innerHTML = "";
    (data.movers || []).slice(0, 10).forEach(m => {
      const cls = (m.Type && m.Type.toLowerCase().includes("gainer"))
        ? "bg-green-50 dark:bg-green-900"
        : "bg-red-50 dark:bg-red-900";
      moversList.innerHTML += `
        <div class="searchable p-3 border rounded ${cls}">
          <strong>${m.Name || ""}</strong> 
          <span class="text-sm">(${m.CMP || ""})</span>
          <div class="text-xs mt-1">${m.Type || ""}</div>
        </div>`;
    });

    // 🔹 Picks
    const picksList = document.getElementById("picksList");
    picksList.innerHTML = "";
    (data.picks || []).slice(0, 4).forEach(p => {
      picksList.innerHTML += `
        <div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-700">
          <strong>${p.Stock || ""}</strong>
          <div class="text-xs mt-1">${p.Reason || ""}</div>
          <a href="${p.Link || "#"}" target="_blank" class="text-blue-500 text-xs hover:underline">Read More</a>
        </div>`;
    });

  } catch (err) {
    console.error("❌ Error loading data:", err);
    document.getElementById("newsList").innerHTML = "<p class='text-red-500'>⚠️ Failed to load data. Try again later.</p>";
  }
}

// Search filter
function searchContent() {
  let input = document.getElementById("searchBox").value.toLowerCase();
  document.querySelectorAll(".searchable").forEach(el => {
    el.style.display = el.innerText.toLowerCase().includes(input) ? "" : "none";
  });
}

// Run on load
window.onload = loadData;
