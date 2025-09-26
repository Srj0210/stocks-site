// ===== script-ipo-recent.js =====
async function loadRecentIPOs() {
  const tbody = document.getElementById("recentIPOs");
  showLoader("recentWrapper", "⏳ Loading recent IPOs...");
  try {
    const data = await fetchAPI();
    const rows = data.ipos_recent || [];
    if (!tbody) return;
    tbody.innerHTML = "";
    rows.forEach(r => {
      const tr = document.createElement("tr");
      tr.className = "searchable";
      tr.innerHTML = `<td>${r.Name||""}</td><td>${r["Issue Type"]||""}</td><td>${r["Price Band"]||""}</td>
                      <td>${formatDate(r["Open Date"])}</td><td>${formatDate(r["Close Date"])}</td><td>${r["Issue Size"]||""}</td>`;
      tbody.appendChild(tr);
    });
  } catch (e) {
    if (document.getElementById("recentWrapper")) document.getElementById("recentWrapper").innerHTML = `<p class="text-red-400">Failed to load recent IPOs.</p>`;
  }
}

window.addEventListener("load", loadRecentIPOs);