const url = "https://script.google.com/macros/s/AKfycbxaiHFAvUOfC5gnP49B0yDLXjD-FE-En-guZUFW8b7n4QptLPRKKiJ_u9l2QSKA1l1D/exec";

function sanitizeText(text) {
  return text ? text.replace(/<[^>]*>?/gm, '') : "";
}

async function loadData() {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Bad response: " + res.status);
    const data = await res.json();

    // 🔥 News ticker
    const ticker = document.getElementById("tickerText");
    ticker.innerHTML = (data.news || []).slice(0, 6).map(n => sanitizeText(n.Title)).join(" | ");

    // News
    const newsList = document.getElementById("newsList");
    newsList.innerHTML = "";
    (data.news || []).slice(0, 6).forEach(n => {
      newsList.innerHTML += `<div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-700">
        <a href="${sanitizeText(n.Link)}" target="_blank" class="font-medium">${sanitizeText(n.Title)}</a>
        <div class="text-xs text-gray-500 mt-1">${sanitizeText(n.Published || "")}</div>
      </div>`;
    });

    // IPOs (Upcoming)
    const ipoUpcoming = document.getElementById("ipoUpcoming");
    ipoUpcoming.innerHTML = "";
    (data.ipos_upcoming || []).slice(0, 10).forEach(i => {
      ipoUpcoming.innerHTML += `<tr class="searchable">
        <td class="border px-2 py-1">${sanitizeText(i.Name)}</td>
        <td class="border px-2 py-1">${sanitizeText(i.Open || "")}</td>
        <td class="border px-2 py-1">${sanitizeText(i.Close || "")}</td>
        <td class="border px-2 py-1">${sanitizeText(i["Price Band"] || "")}</td>
      </tr>`;
    });

    // IPOs (Recent)
    const ipoRecent = document.getElementById("ipoRecent");
    ipoRecent.innerHTML = "";
    (data.ipos_recent || []).slice(0, 10).forEach(i => {
      ipoRecent.innerHTML += `<tr class="searchable">
        <td class="border px-2 py-1">${sanitizeText(i.Name)}</td>
        <td class="border px-2 py-1">${sanitizeText(i["Listing Date"])}</td>
        <td class="border px-2 py-1">${sanitizeText(i.MCap || "")}</td>
        <td class="border px-2 py-1">${sanitizeText(i["IPO Price"] || "")}</td>
        <td class="border px-2 py-1">${sanitizeText(i["% Change"] || "")}</td>
      </tr>`;
    });

    // Movers
    const moversList = document.getElementById("moversList");
    moversList.innerHTML = "";
    (data.movers || []).slice(0, 10).forEach(m => {
      const cls = (m.Type && m.Type.toLowerCase().includes('gainer')) ? 'bg-green-50 dark:bg-green-900' : 'bg-red-50 dark:bg-red-900';
      moversList.innerHTML += `<div class="searchable p-3 border rounded ${cls}">
        <strong>${sanitizeText(m.Name)}</strong> <span class="text-sm">(${sanitizeText(m.Change || "")})</span>
        <div class="text-xs mt-1">${sanitizeText(m.Type || "")}</div>
      </div>`;
    });

    // Picks
    const picksList = document.getElementById("picksList");
    picksList.innerHTML = "";
    (data.picks || []).slice(0, 4).forEach(p => {
      picksList.innerHTML += `<div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-700">
        <strong>${sanitizeText(p.Stock)}</strong>
        <div class="text-xs mt-1">${sanitizeText(p.Reason)} • ${sanitizeText(p.Link || "")}</div>
      </div>`;
    });

  } catch (err) {
    console.error("Security Blocked:", err);
  }
}

function searchContent() {
  let input = document.getElementById("searchBox").value.toLowerCase();
  document.querySelectorAll(".searchable").forEach(el => {
    el.style.display = el.innerText.toLowerCase().includes(input) ? "" : "none";
  });
}

function toggleTheme() {
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark'); 
    localStorage.theme = 'light';
  } else {
    document.documentElement.classList.add('dark'); 
    localStorage.theme = 'dark';
  }
}

window.onload = loadData;
