<script>
// ===== API URL =====
const url = "https://script.google.com/macros/s/AKfycby-VuqKc03bVz8OKCscnLZYsXX0RXcISFqVdXlp5BE7s4sXXIb9kw6bA1JuHFyT6u9R/exec";

// ===== Pagination Utility =====
function paginate(data, pageSize, page, renderFn, containerId, paginationId) {
  const container = document.getElementById(containerId);
  const pagination = document.getElementById(paginationId);
  if (!container) return;

  // Clear old
  container.innerHTML = "";

  // Current page data
  const start = (page - 1) * pageSize;
  const items = data.slice(start, start + pageSize);

  // Render items
  items.forEach(renderFn);

  // Pagination controls
  if (pagination) {
    pagination.innerHTML = "";
    const totalPages = Math.ceil(data.length / pageSize);
    for (let i = 1; i <= totalPages; i++) {
      pagination.innerHTML += `
        <button onclick="paginate(window._data, ${pageSize}, ${i}, ${renderFn.name}, '${containerId}', '${paginationId}')"
          class="px-3 py-1 mx-1 rounded 
          ${i === page ? 'bg-blue-600 text-white dark:bg-gray-700' : 'bg-gray-200 dark:bg-gray-600 dark:text-white'}">
          ${i}
        </button>`;
    }
  }
}

// ===== Render Functions =====

// News
function renderNewsItem(n) {
  const container = document.getElementById("newsList");
  container.innerHTML += `
    <div class="searchable p-3 border rounded bg-white dark:bg-gray-800 dark:text-gray-200">
      <a href="${n.Link}" target="_blank" class="font-medium">${n.Title}</a>
      <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">${n.Published || ""}</div>
    </div>`;
}

// IPO (Upcoming / Recent)
function renderIPO(i) {
  const container = window._ipoTarget;
  container.innerHTML += `
    <tr class="border-b bg-white dark:bg-gray-800 dark:text-gray-200">
      <td class="border px-2 py-1">${i.Name}</td>
      <td class="border px-2 py-1">${i.Type}</td>
      <td class="border px-2 py-1">${i.Price}</td>
      <td class="border px-2 py-1">${i.Open}</td>
      <td class="border px-2 py-1">${i.Close}</td>
      <td class="border px-2 py-1">${i.Size}</td>
    </tr>`;
}

// Movers
function renderMover(m) {
  const container = document.getElementById("moversList");
  const change = Number(m.Change?.toString().replace("%","").trim()) || 0;
  const cls = change >= 0 ? "bg-green-900" : "bg-red-900";
  container.innerHTML += `
    <tr class="border-b ${cls} text-white">
      <td class="border px-2 py-1">${m.Name}</td>
      <td class="border px-2 py-1">₹${m.CMP}</td>
      <td class="border px-2 py-1">${m.Volume}</td>
      <td class="border px-2 py-1">${m.Value}</td>
      <td class="border px-2 py-1">${change}%</td>
    </tr>`;
}

// Picks
function renderPick(p) {
  const container = document.getElementById("picksList");
  container.innerHTML += `
    <div class="searchable p-3 border rounded bg-white dark:bg-gray-800 dark:text-gray-200">
      <a href="${p.Link}" target="_blank" class="font-medium">${p.Title}</a>
      <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">${p.Source || ""}</div>
    </div>`;
}

// ===== Load Functions =====

// News
async function loadNews() {
  const res = await fetch(url);
  const data = await res.json();
  window._data = data.news || [];
  paginate(window._data, 10, 1, renderNewsItem, "newsList", "newsPagination");
}

// IPO
async function loadIPO(type) {
  const res = await fetch(url);
  const data = await res.json();
  window._ipoTarget = document.getElementById(type === "upcoming" ? "ipoUpcoming" : "ipoRecent");
  window._data = type === "upcoming" ? (data.ipoUpcoming || []) : (data.ipoRecent || []);
  paginate(window._data, 10, 1, renderIPO, type === "upcoming" ? "ipoUpcoming" : "ipoRecent", "ipoPagination");
}

// Movers
async function loadMovers() {
  const res = await fetch(url);
  const data = await res.json();
  window._data = data.movers || [];
  paginate(window._data, 10, 1, renderMover, "moversList", "moversPagination");
}

// Picks
async function loadPicks() {
  const res = await fetch(url);
  const data = await res.json();
  window._data = data.picks || [];
  paginate(window._data, 10, 1, renderPick, "picksList", "picksPagination");
}
</script>