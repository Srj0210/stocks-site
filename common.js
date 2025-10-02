// ====== API URL (Whitelist Endpoint) ======
const API_URL = "https://script.google.com/macros/s/AKfycby-VuqKc03bVz8OKCscnLZYsXX0RXcISFqVdXlp5BE7s4sXXIb9kw6bA1JuHFyT6u9R/exec";

// ====== Analytics Auto Inject (Safe Load) ======
(function addAnalytics() {
  const GA_ID = "G-FJGKC63PF4";
  try {
    if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
      const ga = document.createElement("script");
      ga.async = true;
      ga.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      ga.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
      document.head.appendChild(ga);

      ga.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag(){ dataLayer.push(arguments); }
        gtag("js", new Date());
        gtag("config", GA_ID, { anonymize_ip: true }); // 🔒 IP anonymization
      };
    }
  } catch (err) {
    console.error("❌ Analytics injection failed:", err);
  }
})();

// ====== Loader ======
function showLoader(elId) {
  const el = document.getElementById(elId);
  if (el) {
    el.innerHTML = `<p class="text-center text-gray-400">⏳ Loading...</p>`;
  }
}

// ====== Search (Safe) ======
function searchContent(){ 
  let input = document.getElementById("searchBox")?.value.toLowerCase().trim(); 
  document.querySelectorAll(".searchable").forEach(el=>{
    const text = el.innerText.toLowerCase();
    el.style.display = text.includes(input) ? "" : "none"; 
  }); 
}

// ====== Date Formatter ======
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return isNaN(d) ? dateStr : d.toLocaleDateString("en-GB");
}

// ====== Fetch Data (with Timeout & Validation) ======
async function fetchData(type) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // ⏳ 8s max wait

    const res = await fetch(API_URL, { signal: controller.signal, cache: "no-store" });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    // ✅ Ensure object & type exist
    return (data && typeof data === "object" && data[type]) ? data[type] : [];
  } catch (e) {
    console.error(`❌ Error fetching ${type}:`, e);
    return [];
  }
}

// ====== Pagination Helper ======
function paginate(containerId, data, renderItem, itemsPerPage = 10) {
  let currentPage = 1;
  const container = document.getElementById(containerId);
  if (!container) return;

  const pagination = document.createElement("div");
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
      const activeClass = (i === currentPage) ? 'bg-blue-600 text-white' : 'bg-gray-300';
      pagination.innerHTML += `
        <button type="button" onclick="renderPage(${i})"
          class="px-3 py-1 rounded ${activeClass}">
          ${i}
        </button>`;
    }
  }

  // Add pagination only if more than 1 page
  if (data.length > itemsPerPage) {
    container.after(pagination);
  }

  renderPage(1);
}