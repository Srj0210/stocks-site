// ===== GOOGLE ANALYTICS AUTO-INJECT =====
(function addAnalytics() {
  const GA_ID = "G-FJGKC63PF4"; // apna GA ID yaha daalna
  if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
    const gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(gaScript);

    gaScript.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag(){ dataLayer.push(arguments); }
      gtag("js", new Date());
      gtag("config", GA_ID);
      console.log("✅ Google Analytics Loaded");
    };
  }
})();

// ===== API URL =====
const url = "https://script.google.com/macros/s/AKfycby-VuqKc03bVz8OKCscnLZYsXX0RXcISFqVdXlp5BE7s4sXXIb9kw6bA1JuHFyT6u9R/exec";

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

// ===== Loader Helper =====
function showLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.classList.remove("hidden");
}
function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.classList.add("hidden");
}

// ===== Pagination Helper =====
function paginate(data, renderFn, containerId, pageSize = 20) {
  let currentPage = 1;
  const totalPages = Math.ceil(data.length / pageSize);

  function renderPage(page) {
    currentPage = page;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    renderFn(data.slice(start, end));
    renderPagination();
  }

  function renderPagination() {
    const pagination = document.getElementById("pagination");
    if (!pagination) return;
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      pagination.innerHTML += `<button onclick="__gotoPage('${containerId}', ${i})" 
        class="px-3 py-1 rounded ${i === currentPage ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"}">${i}</button>`;
    }
  }

  window.__gotoPage = (id, page) => {
    if (id === containerId) renderPage(page);
  };

  renderPage(1);
}

// ===== Movers Bulletin =====
function renderMoversTicker(movers) {
  const ticker = document.getElementById("moversTicker");
  if (!ticker) return;

  const text = movers.map(m => {
    const change = m["Change%"] ? parseFloat(m["Change%"]) : 0;
    const arrow = change >= 0 ? "⬆" : "⬇";
    const cls = change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
    return `<span class="${cls} font-semibold">${m.Name} ₹${m.CMP} ${arrow} ${m["Change%"] || ""}%</span>`;
  }).join(" | ");

  ticker.innerHTML = text;
}

// ===== IPO RENDER (home + view more) =====
function renderFullIPOs(data) {
  // UPCOMING
  const ipoUpcoming = document.getElementById("ipoUpcoming");
  if (ipoUpcoming) {
    const render = (rows) => {
      ipoUpcoming.innerHTML = rows.map(i => `
        <tr class="searchable">
          <td class="border px-2 py-1">${i.Name || ""}</td>
          <td class="border px-2 py-1">${i["Issue Type"] || ""}</td>
          <td class="border px-2 py-1">${i["Price Band"] || ""}</td>
          <td class="border px-2 py-1">${formatDate(i["Open Date"])}</td>
          <td class="border px-2 py-1">${formatDate(i["Close Date"])}</td>
          <td class="border px-2 py-1">${i["Issue Size"] || ""}</td>
        </tr>`).join("");
    };
    paginate(data.ipos_upcoming || [], render, "ipoUpcoming", 20);
    document.getElementById("ipoTable")?.classList.remove("hidden");
  }

  // RECENT
  const ipoRecent = document.getElementById("ipoRecent");
  if (ipoRecent) {
    const render = (rows) => {
      ipoRecent.innerHTML = rows.map(i => `
        <tr class="searchable">
          <td class="border px-2 py-1">${i.Name || ""}</td>
          <td class="border px-2 py-1">${i["Issue Type"] || ""}</td>
          <td class="border px-2 py-1">${i["Price Band"] || ""}</td>
          <td class="border px-2 py-1">${formatDate(i["Open Date"])}</td>
          <td class="border px-2 py-1">${formatDate(i["Close Date"])}</td>
          <td class="border px-2 py-1">${i["Issue Size"] || ""}</td>
        </tr>`).join("");
    };
    paginate(data.ipos_recent || [], render, "ipoRecent", 20);
    document.getElementById("ipoTable")?.classList.remove("hidden");
  }
}

// ===== MAIN LOAD FUNCTION =====
async function loadData() {
  try {
    showLoader();
    const res = await fetch(url);
    const data = await res.json();
    hideLoader();

    // IPOs
    renderFullIPOs(data);

    // ===== News Ticker (all news scroll) =====
    const ticker = document.getElementById("tickerText");
    if (ticker) {
      ticker.innerHTML = (data.news || []).map(n => n.Title).join(" | ");
    }

    // ===== News Section (only 6 on home) =====
    const newsList = document.getElementById("newsList");
    if (newsList) {
      const render = (rows) => {
        newsList.innerHTML = rows.map(n => `
          <div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-700">
            <a href="${n.Link || "#"}" target="_blank" class="font-medium">${n.Title}</a>
            <div class="text-xs text-gray-500 mt-1">${n.Published || ""}</div>
          </div>`).join("");
      };
      if (document.title.includes("All News")) {
        paginate(data.news || [], render, "newsList", 20);
        newsList.classList.remove("hidden");
      } else {
        render((data.news || []).slice(0, 6));
      }
    }

    // ===== Movers =====
    const moversList = document.getElementById("moversList");
    if (moversList) {
      const render = (rows) => {
        moversList.innerHTML = rows.map(m => {
          const change = m["Change%"] ? parseFloat(m["Change%"]) : 0;
          const cls = change >= 0 ? "bg-green-50 dark:bg-green-900" : "bg-red-50 dark:bg-red-900";
          return `<div class="searchable p-3 border rounded ${cls}">
              <strong>${m.Name}</strong> 
              <span class="text-sm">₹${m.CMP} (${m["Change%"] || ""}%)</span>
            </div>`;
        }).join("");
      };
      if (document.title.includes("Top Movers")) {
        paginate(data.movers || [], render, "moversAll", 20);
        document.getElementById("moversTable")?.classList.remove("hidden");
      } else {
        render((data.movers || []).slice(0, 10));
      }
    }

    // ✅ Movers Bulletin
    renderMoversTicker(data.movers);

    // ===== Picks =====
    const picksList = document.getElementById("picksList");
    if (picksList) {
      const render = (rows) => {
        picksList.innerHTML = rows.map(p => `
          <div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-700">
            <strong>${p.Stock}</strong>
            <div class="text-xs mt-1">${p.Reason || ""}</div>
          </div>`).join("");
      };
      if (document.title.includes("Stock Picks")) {
        paginate(data.picks || [], render, "picksAll", 20);
        document.getElementById("picksAll")?.classList.remove("hidden");
      } else {
        render((data.picks || []).slice(0, 4));
      }
    }

  } catch (err) {
    console.error("❌ Error loading data:", err);
  }
}

// ===== SEARCH =====
function searchContent(){ 
  let input = document.getElementById("searchBox")?.value.toLowerCase(); 
  document.querySelectorAll(".searchable").forEach(el=>{
    el.style.display = el.innerText.toLowerCase().includes(input) ? "" : "none"; 
  }); 
}

window.onload = loadData;
