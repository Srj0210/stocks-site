// ===== API URL =====
const url = "https://script.google.com/macros/s/AKfycbyShXMyUufctA4ByFSNRKO4b5mMwTO6-C0eeiIqQM-hSSDgGGqw1qa_brHGdMq4pLhm/exec";

// ===== Date Formatter =====
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr; // fallback
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

// ===== Movers Bulletin =====
function renderMoversTicker(movers) {
  const ticker = document.getElementById("moversTicker");
  if (!ticker) return;

  const text = movers.map(m => {
    const changeVal = m["Change%"] ? parseFloat(m["Change%"]) : 0;
    const arrow = changeVal >= 0 ? "⬆" : "⬇";
    const cls = changeVal >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
    return `<span class="${cls} font-semibold">${m.Name} ₹${m.CMP} ${arrow} ${m["Change%"] || "0"}%</span>`;
  }).join(" | ");

  ticker.innerHTML = text;
}

// ===== IPO RENDER =====
function renderIPOs(sectionId, data) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.innerHTML = "";
    (data || []).forEach(i => {
      section.innerHTML += `<tr class="searchable">
        <td class="border px-2 py-1">${i.Name || ""}</td>
        <td class="border px-2 py-1">${i["Issue Type"] || ""}</td>
        <td class="border px-2 py-1">${i["Price Band"] || ""}</td>
        <td class="border px-2 py-1">${formatDate(i["Open Date"])}</td>
        <td class="border px-2 py-1">${formatDate(i["Close Date"])}</td>
        <td class="border px-2 py-1">${i["Issue Size"] || ""}</td>
      </tr>`;
    });
  }
}

// ===== LOAD FUNCTION =====
async function loadData() {
  try {
    const res = await fetch(url);
    const data = await res.json();

    // === News (home shows only 6, but View More will call full list) ===
    const newsList = document.getElementById("newsList");
    if (newsList) {
      newsList.innerHTML = "";
      (data.news || []).forEach(n => {
        newsList.innerHTML += `
          <div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-700">
            <a href="${n.Link || "#"}" target="_blank" class="font-medium">${n.Title}</a>
            <div class="text-xs text-gray-500 mt-1">${n.Published || ""}</div>
          </div>`;
      });
    }

    // === IPOs ===
    renderIPOs("ipoUpcoming", data.ipos_upcoming);
    renderIPOs("ipoRecent", data.ipos_recent);

    // === Movers ===
    const moversList = document.getElementById("moversList");
    if (moversList) {
      moversList.innerHTML = "";
      (data.movers || []).forEach(m => {
        const changeVal = m["Change%"] ? parseFloat(m["Change%"]) : 0;
        const cls = changeVal >= 0
          ? "bg-green-50 dark:bg-green-900"
          : "bg-red-50 dark:bg-red-900";
        moversList.innerHTML += `
          <div class="searchable p-3 border rounded ${cls}">
            <strong>${m.Name}</strong> 
            <span class="text-sm">₹${m.CMP} (${m["Change%"] || "0"}%)</span>
          </div>`;
      });
    }
    renderMoversTicker(data.movers);

    // === Picks ===
    const picksList = document.getElementById("picksList");
    if (picksList) {
      picksList.innerHTML = "";
      (data.picks || []).forEach(p => {
        picksList.innerHTML += `<div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-700">
          <strong>${p.Stock}</strong>
          <div class="text-xs mt-1">${p.Reason || ""}</div>
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

window.onload = () => {
  setTimeout(() => {
    loadData();
  }, 10000); // wait 10s before loading
};
