// ====== CONFIG ======
const API_URL = "https://script.google.com/macros/s/AKfycbxaiHFAvUOfC5gnP49B0yDLXjD-FE-En-guZUFW8b7n4QptLPRKKiJ_u9l2QSKA1l1D/exec";

// ====== HELPERS ======
async function fetchData() {
  try {
    const res = await fetch(API_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("API error: " + res.status);
    return await res.json();
  } catch (err) {
    console.error("❌ Fetch failed:", err);
    return {};
  }
}

function createRow(values) {
  const tr = document.createElement("tr");
  values.forEach(v => {
    const td = document.createElement("td");
    td.textContent = v || "-";
    tr.appendChild(td);
  });
  return tr;
}

// ====== RENDER NEWS ======
function renderNews(data, limit = 5) {
  const container = document.getElementById("news-list");
  if (!container) return;

  container.innerHTML = "";
  data.slice(0, limit).forEach(item => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.textContent = item.Title;
    a.href = item.Link;
    a.target = "_blank";
    li.appendChild(a);
    container.appendChild(li);
  });
}

// ====== RENDER PICKS ======
function renderPicks(data, limit = 5) {
  const container = document.getElementById("picks-list");
  if (!container) return;

  container.innerHTML = "";
  data.slice(0, limit).forEach(item => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.textContent = `${item.Stock} - ${item.Reason}`;
    a.href = item.Link;
    a.target = "_blank";
    li.appendChild(a);
    container.appendChild(li);
  });
}

// ====== RENDER MOVERS ======
function renderMovers(data, limit = 5) {
  const tbody = document.querySelector("#movers-table tbody");
  if (!tbody) return;

  tbody.innerHTML = "";
  data.slice(0, limit).forEach(row => {
    tbody.appendChild(createRow([row["S.No"], row.Name, row.CMP, row["P/E"], row.MCap]));
  });
}

// ====== RENDER RECENT IPOs ======
function renderRecentIPOs(data, limit = 5) {
  const tbody = document.querySelector("#recent-ipo-table tbody");
  if (!tbody) return;

  tbody.innerHTML = "";
  data.slice(0, limit).forEach(item => {
    tbody.appendChild(
      createRow([item.Name, item["Listing Date"], item["IPO Price"], item["Current Price"], item.Change])
    );
  });
}

// ====== RENDER UPCOMING IPOs ======
function renderUpcomingIPOs(data, limit = 5) {
  const tbody = document.querySelector("#upcoming-ipo-table tbody");
  if (!tbody) return;

  tbody.innerHTML = "";
  data.slice(0, limit).forEach(item => {
    tbody.appendChild(
      createRow([item.Name, item["Open Date"], item["Close Date"], item["Price Band"]])
    );
  });
}

// ====== INIT ======
document.addEventListener("DOMContentLoaded", async () => {
  const data = await fetchData();

  if (data.news) renderNews(data.news);
  if (data.picks) renderPicks(data.picks);
  if (data.movers) renderMovers(data.movers);
  if (data.ipos_recent) renderRecentIPOs(data.ipos_recent);
  if (data.ipos_upcoming) renderUpcomingIPOs(data.ipos_upcoming);
