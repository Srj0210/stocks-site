// =======================================================
//               SRJahir Tech - COMMON.JS (STABLE)
//   SAFE FETCH + ANALYTICS + SEARCH + PAGINATION (Option A)
//   IPOs & Movers are IGNORED here → handled by bundle.js
// =======================================================

// ====== API URL ======
const API_URL =
  "https://script.google.com/macros/s/AKfycby-VuqKc03bVz8OKCscnLZYsXX0RXcISFqVdXlp5BE7s4sXXIb9kw6bA1JuHFyT6u9R/exec";


// =======================================================
// ========== GOOGLE ANALYTICS AUTO-INJECT ===============
// =======================================================

(function addAnalytics() {
  const GA_ID = "G-FJGKC63PF4";

  if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
    const ga = document.createElement("script");
    ga.async = true;
    ga.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(ga);

    ga.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      window.gtag = gtag;

      gtag("js", new Date());
      gtag("config", GA_ID);
    };
  }
})();


// =======================================================
// ================= SAFE FETCH FUNCTION =================
// =======================================================

async function safeFetch(url) {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      console.error("❌ HTTP ERROR:", res.status);
      return {};
    }

    return await res.json();
  } catch (err) {
    console.error("❌ Fetch Error:", err);
    return {};
  }
}


// =======================================================
// =================== DATA FETCH LOGIC ==================
// =======================================================
// Option A → Common.js will IGNORE IPO + MOVERS completely.

async function fetchData(type) {

  if (
    type === "movers" ||
    type === "ipos_recent" ||
    type === "ipos_upcoming"
  ) {
    console.warn(`⚠️ Ignored fetchData("${type}") in common.js (Option A mode)`);
    return [];
  }

  try {
    const data = await safeFetch(API_URL);
    return data[type] || [];
  } catch (e) {
    console.error(`❌ Error fetching ${type}:`, e);
    return [];
  }
}

async function fetchAllData() {
  try {
    return await safeFetch(API_URL) || {};
  } catch (e) {
    console.error("❌ Error fetching all data:", e);
    return {};
  }
}


// =======================================================
// ===================== PAGINATION ======================
// =======================================================

function paginate(containerId, data, renderItem, itemsPerPage = 10) {
  let currentPage = 1;
  const container = document.getElementById(containerId);
  if (!container) return;

  let pagination = document.createElement("div");
  pagination.className = "flex justify-center mt-4 space-x-2";

  function renderPage(page) {
    currentPage = page;

    container.innerHTML = data
      .slice((page - 1) * itemsPerPage, page * itemsPerPage)
      .map(renderItem)
      .join("");

    pagination.innerHTML = "";
    const totalPages = Math.ceil(data.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className =
        `px-3 py-1 rounded ${i === currentPage ? "bg-blue-600 text-white" : "bg-gray-300"}`;
      btn.addEventListener("click", () => renderPage(i));
      pagination.appendChild(btn);
    }
  }

  // ✅ FIX: tbody-safe pagination placement
  if (container.tagName === "TBODY") {
    container.parentElement.after(pagination);
  } else {
    container.after(pagination);
  }

  renderPage(1);
}


// =======================================================
// ======================= UTILS =========================
// =======================================================

function escapeHTML(str = "") {
  return str.replace(/[&<>"']/g, (m) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[m];
  });
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return isNaN(d) ? escapeHTML(dateStr) : d.toLocaleDateString("en-GB");
}

function searchContent() {
  let input = document.getElementById("searchBox")?.value.toLowerCase();
  document.querySelectorAll(".searchable").forEach((el) => {
    el.style.display =
      el.innerText.toLowerCase().includes(input) ? "" : "none";
  });
}


// =======================================================
// ===================== LOADER (FIXED) ==================
// =======================================================

function showLoader(elId, msg = "⏳ Loading...") {
  const el = document.getElementById(elId);
  if (!el) return;

  // ✅ FIX: TBODY-safe loader
  if (el.tagName === "TBODY") {
    el.innerHTML =
      `<tr><td colspan="10" class="p-4 text-center text-gray-400">${escapeHTML(msg)}</td></tr>`;
  } else {
    el.innerHTML =
      `<p class="text-center text-gray-400">${escapeHTML(msg)}</p>`;
  }
}


// =======================================================
// ================= ANALYTICS EVENTS ====================
// =======================================================

document.addEventListener("click", (e) => {
  const g = window.gtag;
  if (!g) return;

  if (e.target.closest(".news-item")) {
    g("event", "news_click");
  }
  if (e.target.closest(".ipo-row")) {
    g("event", "ipo_open");
  }
  if (e.target.closest(".mover-card")) {
    g("event", "mover_click");
  }
  if (e.target.closest(".pick-card")) {
    g("event", "pick_click");
  }
});
