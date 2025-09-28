// ====== API URL ======
const API_URL = "https://script.google.com/macros/s/AKfycby-VuqKc03bVz8OKCscnLZYsXX0RXcISFqVdXlp5BE7s4sXXIb9kw6bA1JuHFyT6u9R/exec";

// ====== Analytics Auto Inject ======
(function addAnalytics() {
const GA_ID = "G-FJGKC63PF4";
if (!document.querySelector(script[src*="googletagmanager.com/gtag/js"])) {
const ga = document.createElement("script");
ga.async = true;
ga.src = https://www.googletagmanager.com/gtag/js?id=${GA_ID};
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
function showLoader(elId) {
const el = document.getElementById(elId);
if (el) el.innerHTML = <p class="text-center text-gray-400">⏳ Loading...</p>;
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
if (isNaN(d)) return dateStr;
return d.toLocaleDateString("en-GB");
}

// ====== Ticker Renderer ======
function renderNewsTicker(news) {
const ticker = document.getElementById("tickerText");
if (!ticker) return;
ticker.innerHTML = (news || [])
.map(n => 📰 ${n.Title})
.join(" | ");
}

function renderMoversTicker(movers) {
const ticker = document.getElementById("moversTicker");
if (!ticker) return;
ticker.innerHTML = (movers || [])
.map(m => {
const change = parseFloat(m["Change%"] || 0);
const color = change > 0 ? "text-green-400" : change < 0 ? "text-red-400" : "text-white";
return <span class="${color} font-semibold">${m.Name} ₹${m.CMP} (${change}%)</span>;
})
.join(" | ");
}

// ====== Pagination Helper (FIXED: no loader here) ======
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
  pagination.innerHTML += `<button onclick="renderPage(${i})"  
    class="px-3 py-1 rounded ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-300'}">${i}</button>`;  
}

}

container.after(pagination);
renderPage(1);
}

// ====== Fetch Data (NEW) ======
async function fetchData(type) {
try {
const res = await fetch(API_URL);
const data = await res.json();
return data[type] || [];
} catch (e) {
console.error(❌ Error fetching ${type}:, e);
return [];
}
}

Ye code me update kar dunga toh ipos me loading chala aayega after loaded data

