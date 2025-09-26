// ===== API URL =====
const url = "https://script.google.com/macros/s/AKfycbyShXMyUufctA4ByFSNRKO4b5mMwTO6-C0eeiIqQM-hSSDgGGqw1qa_brHGdMq4pLhm/exec";

// ===== News Ticker =====
function renderNewsTicker(news) {
  const ticker = document.getElementById("tickerText");
  if (!ticker) return;
  ticker.innerHTML = (news || []).map(n => n.Title).join(" | ");
}

// ===== Load Home Data =====
async function loadHome() {
  try {
    const res = await fetch(url);
    const data = await res.json();

    // News (only 6)
    const newsList = document.getElementById("newsList");
    if (newsList) {
      newsList.innerHTML = "";
      (data.news || []).slice(0, 6).forEach(n => {
        newsList.innerHTML += `
          <div class="searchable p-3 border rounded bg-gray-800">
            <a href="${n.Link}" target="_blank" class="font-medium">${n.Title}</a>
            <div class="text-xs text-gray-400 mt-1">${n.Published || ""}</div>
          </div>`;
      });
    }

    // News Ticker
    renderNewsTicker(data.news);

    // Movers (10)
    const moversList = document.getElementById("moversList");
    if (moversList) {
      moversList.innerHTML = "";
      (data.movers || []).slice(0, 10).forEach(m => {
        const change = parseFloat(m.Change || 0);
        const cls = change >= 0 ? "bg-green-900" : "bg-red-900";
        moversList.innerHTML += `
          <div class="p-2 rounded ${cls}">
            <strong>${m.Name}</strong> ₹${m.CMP} (${change}%)
          </div>`;
      });
    }

  } catch (err) {
    console.error("❌ Home load error:", err);
  }
}

window.onload = loadHome;
