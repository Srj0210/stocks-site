// ===== common.js =====
// Put this on all pages before page-specific scripts

const API_URL = "https://script.google.com/macros/s/AKfycby-VuqKc03bVz8OKCscnLZYsXX0RXcISFqVdXlp5BE7s4sXXIb9kw6bA1JuHFyT6u9R/exec";

// ===== Google Analytics (one-shot) =====
(function addAnalytics() {
  const GA_ID = "G-FJGKC63PF4";
  if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
    const gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(gaScript);
    gaScript.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag(){ dataLayer.push(arguments); }
      window.gtag = gtag;
      gtag("js", new Date());
      gtag("config", GA_ID);
    };
  }
})();

// ===== Helpers =====
function showLoader(elId, msg = "⏳ Please wait, loading data...") {
  const el = document.getElementById(elId);
  if (!el) return;
  el.innerHTML = `<p class="text-center text-gray-400">${msg}</p>`;
}

function formatDate(d) {
  if (!d) return "";
  // try ISO string or human string
  const dt = new Date(d);
  if (isNaN(dt)) return String(d);
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function paginate(arr, pageSize, pageNum) {
  const start = (pageNum - 1) * pageSize;
  return arr.slice(start, start + pageSize);
}

// generic safe fetch from API_URL
async function fetchAPI() {
  try {
    const res = await fetch(API_URL, { cache: "no-cache" });
    if (!res.ok) throw new Error("Network error " + res.status);
    const json = await res.json();
    return json;
  } catch (e) {
    console.error("API fetch failed:", e);
    throw e;
  }
}

// wire search: any input with placeholder starting with "Search" will filter elements with class 'searchable'
function wireSearchInputs() {
  document.querySelectorAll('input[placeholder^="Search"]').forEach(inp => {
    inp.addEventListener("input", () => {
      const q = inp.value.trim().toLowerCase();
      document.querySelectorAll(".searchable").forEach(el => {
        el.style.display = el.innerText.toLowerCase().includes(q) ? "" : "none";
      });
    });
  });
}

// render simple disclaimer if element with id="footer" exists
function renderDisclaimer() {
  const footer = document.getElementById("footer");
  if (!footer) return;
  footer.innerHTML = `
    <div class="text-center text-xs text-gray-400 mt-6">
      ⚠ Disclaimer: This website and its data are for educational/informational purposes only. We do not guarantee accuracy. Invest at your own risk.
    </div>
  `;
}

// call wireSearchInputs on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  wireSearchInputs();
  renderDisclaimer();
});