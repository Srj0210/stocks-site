// ====== API URL ======
const url = "https://script.google.com/macros/s/AKfycby-VuqKc03bVz8OKCscnLZYsXX0RXcISFqVdXlp5BE7s4sXXIb9kw6bA1JuHFyT6u9R/exec";

// ====== Helpers ======
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

function searchContent() {
  let input = document.getElementById("searchBox").value.toLowerCase();
  document.querySelectorAll(".searchable").forEach(el => {
    el.style.display = el.innerText.toLowerCase().includes(input) ? "" : "none";
  });
}

// ====== Pagination ======
function paginate(data, renderFn, containerId, paginationId, rowsPerPage = 10) {
  const container = document.getElementById(containerId);
  const pagination = document.getElementById(paginationId);
  if (!container || !pagination) return;

  let currentPage = 1;
  const totalPages = Math.ceil(data.length / rowsPerPage);

  function displayPage(page) {
    container.innerHTML = "";
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    data.slice(start, end).forEach(renderFn);
    renderPagination(page);
  }

  function renderPagination(page) {
    pagination.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.innerText = i;
      btn.className = `mx-1 px-3 py-1 rounded ${i === page ? "bg-blue-600 text-white" : "bg-gray-600 text-gray-200"}`;
      btn.onclick = () => displayPage(i);
      pagination.appendChild(btn);
    }
  }

  displayPage(currentPage);
}

// ====== Main Loader ======
async function loadViewData() {
  try {
    const res = await fetch(url);
    const data = await res.json();

    // === NEWS ===
    if (document.getElementById("newsList")) {
      paginate(
        data.news || [],
        (n) => {
          document.getElementById("newsList").innerHTML += `
            <div class="searchable p-3 border rounded bg-gray-800">
              <a href="${n.Link || "#"}" target="_blank" class="font-medium">${n.Title}</a>
              <div class="text-xs text-gray-400 mt-1">${n.Published || ""}</div>
            </div>`;
        },
        "newsList",
        "newsPagination"
      );
    }

    // === MOVERS ===
    if (document.getElementById("moversList")) {
      paginate(
        data.movers || [],
        (m) => {
          const change = parseFloat(m.Change) || 0;
          const cls = change >= 0 ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200";
          document.getElementById("moversList").innerHTML += `
            <div class="searchable p-3 border rounded ${cls}">
              <strong>${m.Name}</strong><br>
              <span class="text-sm">₹${m.CMP} (${m.Change || "0"}%)</span>
            </div>`;
        },
        "moversList",
        "moversPagination"
      );
    }

    // === PICKS ===
    if (document.getElementById("picksList")) {
      paginate(
        data.picks || [],
        (p) => {
          document.getElementById("picksList").innerHTML += `
            <div class="searchable p-3 border rounded bg-gray-800">
              <strong>${p.Stock}</strong>
              <div class="text-xs mt-1">${p.Reason || ""}</div>
            </div>`;
        },
        "picksList",
        "picksPagination"
      );
    }

    // === RECENT IPOs ===
    if (document.getElementById("ipos_recent")) {
      paginate(
        data.ipos_recent || [],
        (i) => {
          document.getElementById("ipos_recent").innerHTML += `
            <tr class="searchable">
              <td class="border px-2 py-1">${i.Name || ""}</td>
              <td class="border px-2 py-1">${i["Issue Type"] || ""}</td>
              <td class="border px-2 py-1">${i["Price Band"] || ""}</td>
              <td class="border px-2 py-1">${formatDate(i["Open Date"])}</td>
              <td class="border px-2 py-1">${formatDate(i["Close Date"])}</td>
              <td class="border px-2 py-1">${i["Issue Size"] || ""}</td>
            </tr>`;
        },
        "ipos_recent",
        "ipos_recentPagination"
      );
    }

    // === UPCOMING IPOs ===
    if (document.getElementById("ipos_upcoming")) {
      paginate(
        data.ipos_upcoming || [],
        (i) => {
          document.getElementById("ipos_upcoming").innerHTML += `
            <tr class="searchable">
              <td class="border px-2 py-1">${i.Name || ""}</td>
              <td class="border px-2 py-1">${i["Issue Type"] || ""}</td>
              <td class="border px-2 py-1">${i["Price Band"] || ""}</td>
              <td class="border px-2 py-1">${formatDate(i["Open Date"])}</td>
              <td class="border px-2 py-1">${formatDate(i["Close Date"])}</td>
              <td class="border px-2 py-1">${i["Issue Size"] || ""}</td>
            </tr>`;
        },
        "ipos_upcoming",
        "ipos_upcomingPagination"
      );
    }

  } catch (err) {
    console.error("❌ Error loading view data:", err);
  }
}

window.onload = loadViewData;
