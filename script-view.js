// ===== API URL =====
const url = "https://script.google.com/macros/s/AKfycbyShXMyUufctA4ByFSNRKO4b5mMwTO6-C0eeiIqQM-hSSDgGGqw1qa_brHGdMq4pLhm/exec";

// ===== Pagination Config =====
const ITEMS_PER_PAGE = 10;

// ===== Generic Pagination Renderer =====
function renderPagination(containerId, totalItems, currentPage, onPageChange) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  if (totalPages <= 1) {
    container.innerHTML = "";
    return;
  }

  let buttons = "";
  for (let i = 1; i <= totalPages; i++) {
    buttons += `<button onclick="(${onPageChange})(${i})"
      class="mx-1 px-3 py-1 rounded ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-700'}">
      ${i}
    </button>`;
  }

  container.innerHTML = `<div class="flex flex-wrap">${buttons}</div>`;
}

// ===== Search =====
function searchContent() {
  let input = document.getElementById("searchBox").value.toLowerCase();
  document.querySelectorAll(".searchable").forEach(el => {
    el.style.display = el.innerText.toLowerCase().includes(input) ? "" : "none";
  });
}

// ===== Format Date =====
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr; // fallback
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

// ===== Main Loader =====
async function loadData() {
  try {
    // Show initial loading message
    document.querySelectorAll("#newsList, #picksList, #moversList, #ipoRecent, #ipoUpcoming")
      .forEach(el => { if (el) el.innerHTML = "⏳ Please wait, data will load in ~10 seconds..."; });

    const res = await fetch(url);
    const data = await res.json();

    // NEWS
    if (document.getElementById("newsList")) {
      let currentPage = 1;
      function renderNews(page = 1) {
        currentPage = page;
        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const items = data.news.slice(start, end);

        const newsList = document.getElementById("newsList");
        newsList.innerHTML = items.map(n => `
          <div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-800">
            <a href="${n.Link || '#'}" target="_blank" class="font-medium">${n.Title}</a>
            <div class="text-xs text-gray-400 mt-1">${n.Published || ""}</div>
          </div>`).join("");

        renderPagination("newsPagination", data.news.length, currentPage, "renderNews");
      }
      window.renderNews = renderNews;
      renderNews();
    }

    // PICKS
    if (document.getElementById("picksList")) {
      let currentPage = 1;
      function renderPicks(page = 1) {
        currentPage = page;
        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const items = data.picks.slice(start, end);

        const picksList = document.getElementById("picksList");
        picksList.innerHTML = items.map(p => `
          <div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-800">
            <strong>${p.Stock}</strong>
            <div class="text-xs mt-1">${p.Reason || ""}</div>
          </div>`).join("");

        renderPagination("picksPagination", data.picks.length, currentPage, "renderPicks");
      }
      window.renderPicks = renderPicks;
      renderPicks();
    }

    // MOVERS
    if (document.getElementById("moversList")) {
      let currentPage = 1;
      function renderMovers(page = 1) {
        currentPage = page;
        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const items = data.movers.slice(start, end);

        const moversList = document.getElementById("moversList");
        moversList.innerHTML = items.map(m => {
          const change = m["Change%"] ? parseFloat(m["Change%"]) : 0;
          const cls = change >= 0
            ? "bg-green-50 dark:bg-green-900"
            : "bg-red-50 dark:bg-red-900";
          return `<tr class="searchable ${cls}">
            <td class="border px-2 py-1">${m["S.No"] || ""}</td>
            <td class="border px-2 py-1">${m.Name || ""}</td>
            <td class="border px-2 py-1">₹${m.CMP || ""}</td>
            <td class="border px-2 py-1">${m["P/E"] || ""}</td>
            <td class="border px-2 py-1">${m.MCap || ""}</td>
            <td class="border px-2 py-1">${m["Change%"] || ""}</td>
          </tr>`;
        }).join("");

        renderPagination("moversPagination", data.movers.length, currentPage, "renderMovers");
      }
      window.renderMovers = renderMovers;
      renderMovers();
    }

    // RECENT IPOs
    if (document.getElementById("ipoRecent")) {
      let currentPage = 1;
      function renderIpoRecent(page = 1) {
        currentPage = page;
        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const items = data.ipos_recent.slice(start, end);

        const ipoRecent = document.getElementById("ipoRecent");
        ipoRecent.innerHTML = items.map(i => `
          <tr class="searchable">
            <td class="border px-2 py-1">${i.Name || ""}</td>
            <td class="border px-2 py-1">${i["Issue Type"] || ""}</td>
            <td class="border px-2 py-1">${i["Price Band"] || ""}</td>
            <td class="border px-2 py-1">${formatDate(i["Open Date"])}</td>
            <td class="border px-2 py-1">${formatDate(i["Close Date"])}</td>
            <td class="border px-2 py-1">${i["Issue Size"] || ""}</td>
          </tr>`).join("");

        renderPagination("ipoRecentPagination", data.ipos_recent.length, currentPage, "renderIpoRecent");
      }
      window.renderIpoRecent = renderIpoRecent;
      renderIpoRecent();
    }

    // UPCOMING IPOs
    if (document.getElementById("ipoUpcoming")) {
      let currentPage = 1;
      function renderIpoUpcoming(page = 1) {
        currentPage = page;
        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const items = data.ipos_upcoming.slice(start, end);

        const ipoUpcoming = document.getElementById("ipoUpcoming");
        ipoUpcoming.innerHTML = items.map(i => `
          <tr class="searchable">
            <td class="border px-2 py-1">${i.Name || ""}</td>
            <td class="border px-2 py-1">${i["Issue Type"] || ""}</td>
            <td class="border px-2 py-1">${i["Price Band"] || ""}</td>
            <td class="border px-2 py-1">${formatDate(i["Open Date"])}</td>
            <td class="border px-2 py-1">${formatDate(i["Close Date"])}</td>
            <td class="border px-2 py-1">${i["Issue Size"] || ""}</td>
          </tr>`).join("");

        renderPagination("ipoUpcomingPagination", data.ipos_upcoming.length, currentPage, "renderIpoUpcoming");
      }
      window.renderIpoUpcoming = renderIpoUpcoming;
      renderIpoUpcoming();
    }

  } catch (err) {
    console.error("❌ Error loading data:", err);
  }
}

window.onload = loadData;
