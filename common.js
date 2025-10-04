// ====== API URL ======
const API_URL = "https://script.google.com/macros/s/AKfycby-VuqKc03bVz8OKCscnLZYsXX0RXcISFqVdXlp5BE7s4sXXIb9kw6bA1JuHFyT6u9R/exec";

// ====== Analytics Auto Inject ======
(function addAnalytics() {
  const GA_ID = "G-FJGKC63PF4";
  if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
    const ga = document.createElement("script");
    ga.async = true;
    ga.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(ga);
    ga.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag(){ dataLayer.push(arguments); }
      gtag("js", new Date());
      gtag("config", GA_ID);
    };
  }
})();

// ====== Loader ======
function showLoader(elId, msg="⏳ Loading...") {
  const el = document.getElementById(elId);
  if (el) el.innerHTML = `<p class="text-center text-gray-400">${escapeHTML(msg)}</p>`;
}

// ====== Search ======
function searchContent(){ 
  let input = document.getElementById("searchBox")?.value.toLowerCase(); 
  document.querySelectorAll(".searchable").forEach(el=>{
    el.style.display = el.innerText.toLowerCase().includes(input) ? "" : "none"; 
  }); 
}

// ====== Date Formatter ======
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return escapeHTML(dateStr);
  return d.toLocaleDateString("en-GB");
}

// ====== Fetch Data (SAFE) ======
async function fetchData(type) {
  try {
    const data = await safeFetch(API_URL);
    return data[type] || [];
  } catch (e) {
    console.error(`❌ Error fetching ${type}:`, e);
    return [];
  }
}

// ✅ ====== Fetch All Data (for bundle.js) ======
async function fetchAllData() {
  try {
    const data = await safeFetch(API_URL);
    return data || {};
  } catch (e) {
    console.error("❌ Error fetching all data:", e);
    return {};
  }
}

// ====== Pagination Helper (Fixed) ======
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

    // Reset pagination
    pagination.innerHTML = "";
    const totalPages = Math.ceil(data.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = `px-3 py-1 rounded ${i === currentPage ? "bg-blue-600 text-white" : "bg-gray-300"}`;
      btn.addEventListener("click", () => renderPage(i));
      pagination.appendChild(btn);
    }
  }

  // Insert pagination only once
  if (!container.nextSibling || container.nextSibling !== pagination) {
    container.after(pagination);
  }

  renderPage(1);
}