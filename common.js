// =======================================================
// SRJahir Tech - common.js (FINAL STABLE)
// Utilities + Analytics + Pagination + Loader ONLY
// =======================================================

// ====== API URL (used by bundle.js) ======
const API_URL =
  "https://script.google.com/macros/s/AKfycby-VuqKc03bVz8OKCscnLZYsXX0RXcISFqVdXlp5BE7s4sXXIb9kw6bA1JuHFyT6u9R/exec";

// =======================================================
// GOOGLE ANALYTICS
// =======================================================
(function addAnalytics() {
  const GA_ID = "G-FJGKC63PF4";
  if (window.gtag) return;

  const ga = document.createElement("script");
  ga.async = true;
  ga.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(ga);

  ga.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", GA_ID);
  };
})();

// =======================================================
// UTILS
// =======================================================
function escapeHTML(str = "") {
  return String(str).replace(/[&<>"']/g, m => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;"
  }[m]));
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return isNaN(d) ? escapeHTML(dateStr) : d.toLocaleDateString("en-GB");
}

function searchContent() {
  const input = document.getElementById("searchBox")?.value.toLowerCase() || "";
  document.querySelectorAll(".searchable").forEach(el => {
    el.style.display = el.innerText.toLowerCase().includes(input) ? "" : "none";
  });
}

// =======================================================
// LOADER (GENERIC, SAFE)
// =======================================================
function showLoader(elId, msg = "⏳ Loading...") {
  const el = document.getElementById(elId);
  if (!el) return;

  if (el.tagName === "TBODY") {
    el.innerHTML =
      `<tr class="loader-row">
        <td colspan="10" class="p-4 text-center text-gray-400">
          ${escapeHTML(msg)}
        </td>
      </tr>`;
  } else {
    el.innerHTML =
      `<div class="loader text-center text-gray-400">
        ${escapeHTML(msg)}
      </div>`;
  }
}

function clearLoader(elId) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.innerHTML = "";
}

// =======================================================
// PAGINATION (GENERIC)
// =======================================================
function paginate(containerId, data, renderItem, itemsPerPage = 10) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let currentPage = 1;
  let pager = document.createElement("div");
  pager.className = "flex justify-center mt-4 space-x-2";

  function renderPage(page) {
    currentPage = page;

    container.innerHTML = data
      .slice((page - 1) * itemsPerPage, page * itemsPerPage)
      .map(renderItem)
      .join("");

    pager.innerHTML = "";
    const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className =
        `px-3 py-1 rounded ${
          i === currentPage ? "bg-blue-600 text-white" : "bg-gray-300"
        }`;
      btn.onclick = () => renderPage(i);
      pager.appendChild(btn);
    }
  }

  if (container.tagName === "TBODY") {
    container.parentElement.after(pager);
  } else {
    container.after(pager);
  }

  renderPage(1);
}
