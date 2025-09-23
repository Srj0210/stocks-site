const API_URL = "https://script.google.com/macros/s/AKfycbxaiHFAvUOfC5gnP49B0yDLXjD-FE-En-guZUFW8b7n4QptLPRKKiJ_u9l2QSKA1l1D/exec";

// Helper: fetch JSON
async function fetchData() {
  try {
    const res = await fetch(API_URL);
    return await res.json();
  } catch (err) {
    console.error("API fetch error:", err);
    return {};
  }
}

// News
async function loadNews() {
  const data = (await fetchData()).news || [];
  const tbody = document.querySelector("#news-table tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  data.forEach(n => {
    tbody.innerHTML += `<tr>
      <td>${n.Title}</td>
      <td><a href="${n.Link}" target="_blank">Read</a></td>
      <td>${n.Published}</td>
    </tr>`;
  });
}

// Picks
async function loadPicks() {
  const data = (await fetchData()).picks || [];
  const tbody = document.querySelector("#picks-table tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  data.forEach(p => {
    tbody.innerHTML += `<tr>
      <td>${p.Stock}</td>
      <td>${p.Reason}</td>
      <td><a href="${p.Link}" target="_blank">View</a></td>
    </tr>`;
  });
}

// Movers
async function loadMovers() {
  const data = (await fetchData()).movers || [];
  const tbody = document.querySelector("#movers-table tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  data.forEach(m => {
    tbody.innerHTML += `<tr>
      <td>${m["S.No"]}</td>
      <td>${m.Name}</td>
      <td>${m.CMP}</td>
      <td>${m["P/E"]}</td>
      <td>${m.MCap}</td>
    </tr>`;
  });
}

// Recent IPOs
async function loadRecentIPOs() {
  const data = (await fetchData()).ipos_recent || [];
  const tbody = document.querySelector("#recent-ipo-table tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  data.forEach(i => {
    tbody.innerHTML += `<tr>
      <td>${i.Name}</td>
      <td>${i["Listing Date"]}</td>
      <td>${i["IPO Price"] || ""}</td>
      <td>${i["Current Price"] || ""}</td>
      <td>${i.Change || ""}</td>
    </tr>`;
  });
}

// Upcoming IPOs
async function loadUpcomingIPOs() {
  const data = (await fetchData()).ipos_upcoming || [];
  const tbody = document.querySelector("#upcoming-ipo-table tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  data.forEach(i => {
    tbody.innerHTML += `<tr>
      <td>${i.Name}</td>
      <td>${i["Open Date"]}</td>
      <td>${i["Close Date"]}</td>
      <td>${i["Price Band"]}</td>
    </tr>`;
  });
}

// Detect page and run
window.onload = () => {
  loadNews();
  loadPicks();
  loadMovers();
  loadRecentIPOs();
  loadUpcomingIPOs();
};
