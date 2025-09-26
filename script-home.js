// ===== script-home.js =====
// Include after common.js on index.html

async function loadHome() {
  showLoader("newsList");
  showLoader("picksList");
  showLoader("moversList");
  showLoader("ipoUpcoming");
  showLoader("ipoRecent");

  try {
    const data = await fetchAPI();

    // --- NEWS (6) ---
    const newsList = document.getElementById("newsList");
    if (newsList) {
      newsList.innerHTML = "";
      (data.news || []).slice(0, 6).forEach(n => {
        const title = n.Title || n.Title || "";
        const link = n.Link || "#";
        const published = formatDate(n.Published || n["Published"] || n.PublishedDate || "");
        const card = document.createElement("div");
        card.className = "searchable p-3 border rounded bg-gray-800";
        card.innerHTML = `
          <a href="${link}" target="_blank" class="font-medium text-white">${title}</a>
          <div class="text-xs text-gray-400 mt-1">${published}</div>
        `;
        newsList.appendChild(card);
      });
    }

    // --- PICKS (4) ---
    const picksList = document.getElementById("picksList");
    if (picksList) {
      picksList.innerHTML = "";
      (data.picks || []).slice(0, 4).forEach(p => {
        const stock = p.Stock || p.Title || p.Name || "";
        const reason = p.Reason || p["ET Recommend"] || "ET Recommend";
        const link = p.Link || "#";
        const card = document.createElement("div");
        card.className = "searchable p-3 border rounded bg-gray-800";
        card.innerHTML = `<a href="${link}" class="font-medium text-white" target="_blank">${stock}</a>
                          <div class="text-xs text-gray-400 mt-1">${reason}</div>`;
        picksList.appendChild(card);
      });
    }

    // --- MOVERS (top 10) ---
    const moversList = document.getElementById("moversList");
    if (moversList) {
      moversList.innerHTML = "";
      (data.movers || []).slice(0, 10).forEach(m => {
        const changeRaw = m["Change%"] ?? m["Change"] ?? "0";
        const change = Number(String(changeRaw).replace("%","")) || 0;
        const cls = change >= 0 ? "bg-green-900" : "bg-red-900";
        const div = document.createElement("div");
        div.className = `p-2 rounded ${cls} searchable`;
        div.innerHTML = `<strong class="text-white">${m.Name}</strong> <span class="text-white">₹${m.CMP} (${change}%)</span>`;
        moversList.appendChild(div);
      });
    }

    // --- IPOS (recent 5 + upcoming 5) ---
    const recentEl = document.getElementById("recentIPOs");
    if (recentEl) {
      recentEl.innerHTML = "";
      (data.ipos_recent || []).slice(0,5).forEach(r => {
        const tr = document.createElement("tr");
        tr.className = "searchable";
        tr.innerHTML = `<td>${r.Name||""}</td><td>${r["Issue Type"]||""}</td><td>${r["Price Band"]||""}</td>
                        <td>${formatDate(r["Open Date"])}</td><td>${formatDate(r["Close Date"])}</td><td>${r["Issue Size"]||""}</td>`;
        recentEl.appendChild(tr);
      });
    }

    const upcomingEl = document.getElementById("upcomingIPOs");
    if (upcomingEl) {
      upcomingEl.innerHTML = "";
      (data.ipos_upcoming || []).slice(0,5).forEach(r => {
        const tr = document.createElement("tr");
        tr.className = "searchable";
        tr.innerHTML = `<td>${r.Name||""}</td><td>${r["Issue Type"]||""}</td><td>${r["Price Band"]||""}</td>
                        <td>${formatDate(r["Open Date"])}</td><td>${formatDate(r["Close Date"])}</td><td>${r["Issue Size"]||""}</td>`;
        upcomingEl.appendChild(tr);
      });
    }

    // --- TICKERS ---
    renderTicker(data.news, data.movers);

  } catch (e) {
    console.error("Home load failed:", e);
    const newsList = document.getElementById("newsList");
    if (newsList) newsList.innerHTML = `<p class="text-red-400">Failed to load news.</p>`;
  }
}

function renderTicker(news, movers) {
  const ticker = document.getElementById("tickerText");
  const moversTicker = document.getElementById("moversTicker");
  if (ticker) {
    const headlines = (news || []).map(n => n.Title || n.Title || "").slice(0, 20);
    ticker.innerText = headlines.join("  |  ") || "Loading latest news...";
  }
  if (moversTicker) {
    const mv = (movers || []).map(m => `${m.Name} ₹${m.CMP} (${m["Change%"] || m.Change || 0}%)`);
    moversTicker.innerText = mv.join("  |  ") || "Loading movers...";
  }
}

window.addEventListener("load", loadHome);