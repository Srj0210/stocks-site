// common.js
// Central helpers, analytics, API URL, search & loader

const API_URL = "https://script.google.com/macros/s/AKfycby-VuqKc03bVz8OKCscnLZYsXX0RXcISFqVdXlp5BE7s4sXXIb9kw6bA1JuHFyT6u9R/exec";
const GA_ID = "G-FJGKC63PF4";

// ===== Google Analytics auto-inject =====
(function addAnalytics() {
  if (!GA_ID) return;
  if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
    const gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(gaScript);
    gaScript.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag(){ dataLayer.push(arguments); }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', GA_ID);
      console.log("✅ GA loaded");
    };
  }
})();

// ===== helpers =====
function formatDateToDDMMYYYY(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function safeGetChange(obj) {
  // Try to get change percent from variants
  const keys = ["Change%", "Change", "% Change", "Change (1d)", "1day"];
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null && String(obj[k]).trim() !== "") {
      // strip % if present
      return String(obj[k]).replace("%","").trim();
    }
  }
  // sometimes Change is inside "diff" or "percent"
  if (obj.diff) return String(obj.diff).replace("%","").trim();
  if (obj.percentChange) return String(obj.percentChange).replace("%","").trim();
  return "";
}

function showLoader(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `<div class="p-6 text-center text-gray-400">⏳ Loading data, please wait...</div>`;
}

function hideLoaderIfEmpty(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (el.innerHTML.trim() === "") {
    el.innerHTML = `<div class="p-6 text-center text-gray-400">No data found.</div>`;
  }
}

// search: hide/show elements with class "searchable"
function searchContent(){
  const box = document.getElementById("searchBox");
  if (!box) return;
  const input = box.value.toLowerCase();
  document.querySelectorAll(".searchable").forEach(el => {
    el.style.display = el.innerText.toLowerCase().includes(input) ? "" : "none";
  });
}

// fetch wrapper with timeout
async function fetchData(url = API_URL, timeout = 15000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const r = await fetch(url, { signal: controller.signal, cache: "no-store" });
    clearTimeout(id);
    if (!r.ok) throw new Error("Network response not ok: " + r.status);
    return await r.json();
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

// common footer (for view-more pages)
function renderFooter(containerId) {
  const c = document.getElementById(containerId);
  if(!c) return;
  c.innerHTML = `
    <div class="mt-8 text-center">
      
      <p class="text-xs text-gray-500 mt-2">Disclaimer: This website and its data are for educational purposes only. All rights reserved by respective owners.</p>
    </div>`;
}