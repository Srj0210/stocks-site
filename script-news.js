// ===== script-news.js =====
// For news.html (All News page) - pagination + search

const NEWS_PAGE_SIZE = 12;
let NEWS_CURRENT_PAGE = 1;
let NEWS_DATA = [];

async function loadNewsPage() {
  showLoader("newsContainer", "⏳ Loading news...");
  try {
    const data = await fetchAPI();
    NEWS_DATA = data.news || [];
    renderNewsList();
  } catch (e) {
    document.getElementById("newsContainer").innerHTML = `<p class="text-red-400">Failed to load news.</p>`;
  }
}

function renderNewsList() {
  const container = document.getElementById("newsContainer");
  if (!container) return;
  container.innerHTML = "";

  const pageItems = paginate(NEWS_DATA, NEWS_PAGE_SIZE, NEWS_CURRENT_PAGE);
  pageItems.forEach(n => {
    const div = document.createElement("div");
    div.className = "searchable p-4 mb-3 border rounded bg-gray-800";
    div.innerHTML = `<a href="${n.Link||'#'}" target="_blank" class="font-medium text-white">${n.Title||''}</a>
                     <div class="text-xs text-gray-400 mt-1">${formatDate(n.Published||n.PublishedDate||'')}</div>`;
    container.appendChild(div);
  });

  renderPaginationControls("newsPager", NEWS_DATA.length, NEWS_PAGE_SIZE, (p) => { NEWS_CURRENT_PAGE = p; renderNewsList(); });
}

// pager helper
function renderPaginationControls(containerId, totalItems, pageSize, onPage) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  container.innerHTML = "";
  for (let i=1;i<=totalPages;i++) {
    const btn = document.createElement("button");
    btn.className = `mx-1 px-3 py-1 rounded ${i===NEWS_CURRENT_PAGE ? 'bg-blue-600 text-white' : 'bg-gray-300'}`;
    btn.innerText = i;
    btn.addEventListener("click", () => onPage(i));
    container.appendChild(btn);
  }
}

window.addEventListener("load", loadNewsPage);