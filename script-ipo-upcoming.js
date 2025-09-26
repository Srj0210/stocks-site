// ===== script-ipo-upcoming.js =====
async function loadUpcomingIPOs() {
  const tbody = document.getElementById("upcomingIPOs");
  showLoader("upcomingWrapper", "⏳ Loading upcoming IPOs...");
  try {
    const data = await fetchAPI();
    const rows = data.ipos_upcoming || [];
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
    if (document.getElementById("upcomingWrapper")) document.getElementById("upcomingWrapper").innerHTML = `<p class="text-red-400">Failed to load upcoming IPOs.</p>`;
  }
}

window.addEventListener("load", loadUpcomingIPOs);