// ===== script-movers.js =====
// For movers.html - show table with pagination and search
const MOVERS_PAGE_SIZE = 15;
let MOVERS_DATA = [];
let MOVERS_PAGE = 1;

async function loadMoversPage() {
  showLoader("moversTable", "⏳ Please wait, loading movers...");
  try {
    const data = await fetchAPI();
    MOVERS_DATA = data.movers || [];
    renderMovers();
  } catch (e) {
    const el = document.getElementById("moversTable");
    if (el) el.innerHTML = `<p class="text-red-400">Failed to load movers.</p>`;
  }
}

function renderMovers() {
  const tbody = document.getElementById("moversTable");
  if (!tbody) return;
  tbody.innerHTML = "";

  const pageItems = paginate(MOVERS_DATA, MOVERS_PAGE_SIZE, MOVERS_PAGE);
  pageItems.forEach((m, idx) => {
    const tr = document.createElement("tr");
    tr.className = "searchable";
    const change = m["Change%"] ?? m["Change"] ?? "0";
    tr.innerHTML = `<td>${( (MOVERS_PAGE-1)*MOVERS_PAGE_SIZE + idx + 1)}</td>
                    <td>${m.Name||""}</td>
                    <td>₹${m.CMP||""}</td>
                    <td>${m["P/E"]||m.PE||""}</td>
                    <td>${m.MCap||""}</td>
                    <td>${change}</td>`;
    tbody.appendChild(tr);
  });

  // pager
  renderPager("moversPager", MOVERS_DATA.length, MOVERS_PAGE_SIZE, (p) => { MOVERS_PAGE = p; renderMovers(); });
}

function renderPager(id, totalItems, pageSize, onPage) {
  const cont = document.getElementById(id);
  if (!cont) return;
  cont.innerHTML = "";
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  for (let i=1;i<=totalPages;i++){
    const b = document.createElement("button");
    b.className = `mx-1 px-3 py-1 rounded ${i===MOVERS_PAGE ? 'bg-blue-600 text-white' : 'bg-gray-300'}`;
    b.innerText = i;
    b.addEventListener("click", ()=> onPage(i));
    cont.appendChild(b);
  }
}

window.addEventListener("load", loadMoversPage);