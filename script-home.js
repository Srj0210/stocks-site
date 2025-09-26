document.addEventListener("DOMContentLoaded", async () => {
  showLoader("newsList");
  showLoader("ipoUpcoming");
  showLoader("ipoRecent");
  showLoader("moversList");
  showLoader("picksList");

  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    console.log("Home API Response:", data);

    // News
    const news = data.news || [];
    document.getElementById("newsList").innerHTML =
      news.slice(0,6).map(n=>`
        <div class="searchable p-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700">
          <a href="${n.Link}" target="_blank" class="font-semibold">${n.Title}</a>
          <p class="text-xs text-gray-400">${n.Published}</p>
        </div>
      `).join("");

    // IPO Upcoming
    const ipoU = data.ipos_upcoming || [];
    document.getElementById("ipoUpcoming").innerHTML =
      ipoU.slice(0,5).map(row=>`
        <tr>
          <td class="border px-2 py-1">${row["Name"]||"-"}</td>
          <td class="border px-2 py-1">${row["Issue Type"]||"-"}</td>
          <td class="border px-2 py-1">${row["Price Band"]||"-"}</td>
          <td class="border px-2 py-1">${row["Open Date"]||"-"}</td>
          <td class="border px-2 py-1">${row["Close Date"]||"-"}</td>
          <td class="border px-2 py-1">${row["Issue Size"]||"-"}</td>
        </tr>
      `).join("");

    // IPO Recent
    const ipoR = data.ipos_recent || [];
    document.getElementById("ipoRecent").innerHTML =
      ipoR.slice(0,5).map(row=>`
        <tr>
          <td class="border px-2 py-1">${row["Name"]||"-"}</td>
          <td class="border px-2 py-1">${row["Issue Type"]||"-"}</td>
          <td class="border px-2 py-1">${row["Price Band"]||"-"}</td>
          <td class="border px-2 py-1">${row["Open Date"]||"-"}</td>
          <td class="border px-2 py-1">${row["Close Date"]||"-"}</td>
          <td class="border px-2 py-1">${row["Issue Size"]||"-"}</td>
        </tr>
      `).join("");

    // Movers
    const movers = data.movers || [];
    document.getElementById("moversList").innerHTML =
      movers.slice(0,6).map(m=>{
        let color = "bg-gray-200 dark:bg-gray-700";
        if (parseFloat(m["Change%"]) > 0) color = "bg-green-500 text-white";
        if (parseFloat(m["Change%"]) < 0) color = "bg-red-500 text-white";
        return `
          <div class="searchable ${color} p-2 rounded">
            ${m.Name} ₹${m.CMP} (${m["Change%"]}%)
          </div>
        `;
      }).join("");

    // Picks
    const picks = data.picks || [];
    document.getElementById("picksList").innerHTML =
      picks.slice(0,6).map(p=>`
        <div class="searchable p-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700">
          <a href="${p.Link}" target="_blank" class="font-semibold">${p.Stock}</a>
          <p class="text-xs text-gray-400">${p.Reason}</p>
        </div>
      `).join("");

  } catch (err) {
    console.error("Home Load Error:", err);
  }
});