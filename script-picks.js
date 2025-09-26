// ===== script-picks.js =====
async function loadPicksPage() {
  showLoader("picksList", "⏳ Loading picks...");
  try {
    const data = await fetchAPI();
    const items = data.picks || [];
    const list = document.getElementById("picksList");
    if (!list) return;
    list.innerHTML = "";
    items.forEach(p => {
      const div = document.createElement("div");
      div.className = "searchable p-3 border rounded bg-gray-800";
      div.innerHTML = `<a href="${p.Link||'#'}" target="_blank" class="font-medium text-white">${p.Stock||p.Title||p.Name||''}</a>
                       <div class="text-xs text-gray-400 mt-1">${p.Reason||p["ET Recommend"]||''}</div>`;
      list.appendChild(div);
    });
  } catch (e) {
    if (document.getElementById("picksList")) document.getElementById("picksList").innerHTML = `<p class="text-red-400">Failed to load picks.</p>`;
  }
}

window.addEventListener("load", loadPicksPage);