document.addEventListener("DOMContentLoaded", async () => {
  try {
    // ========== NEWS ==========
    const resNews = await fetch(API_URL + "?type=news");
    const dataNews = await resNews.json();
    console.log("News API Response:", dataNews);
    const newsArray = Array.isArray(dataNews.news) ? dataNews.news : [];
    document.getElementById("newsList").innerHTML = newsArray.slice(0, 6).map(n => `
      <div class="p-3 border rounded bg-gray-100 dark:bg-gray-700">
        <a href="${n.Link}" target="_blank" class="font-semibold hover:underline">${n.Title}</a>
        <p class="text-xs text-gray-500">${n.Published}</p>
      </div>
    `).join("") || "<p>No news available</p>";

    // ========== IPO UPCOMING ==========
    const resUpcoming = await fetch(API_URL + "?type=ipos_upcoming");
    const dataUpcoming = await resUpcoming.json();
    console.log("Upcoming IPOs API Response:", dataUpcoming);
    const upcomingArray = Array.isArray(dataUpcoming.ipos) ? dataUpcoming.ipos : [];
    document.getElementById("ipoUpcoming").innerHTML = upcomingArray.slice(0, 5).map(i => `
      <tr>
        <td class="border px-2 py-1">${i.Name}</td>
        <td class="border px-2 py-1">${i["Issue Type"]}</td>
        <td class="border px-2 py-1">${i["Price Band"]}</td>
        <td class="border px-2 py-1">${i["Open Date"]}</td>
        <td class="border px-2 py-1">${i["Close Date"]}</td>
        <td class="border px-2 py-1">${i["Issue Size"]}</td>
      </tr>
    `).join("") || "<tr><td colspan='6'>No data</td></tr>";

    // ========== IPO RECENT ==========
    const resRecent = await fetch(API_URL + "?type=ipos_recent");
    const dataRecent = await resRecent.json();
    console.log("Recent IPOs API Response:", dataRecent);
    const recentArray = Array.isArray(dataRecent.ipos) ? dataRecent.ipos : [];
    document.getElementById("ipoRecent").innerHTML = recentArray.slice(0, 5).map(i => `
      <tr>
        <td class="border px-2 py-1">${i.Name}</td>
        <td class="border px-2 py-1">${i["Issue Type"]}</td>
        <td class="border px-2 py-1">${i["Price Band"]}</td>
        <td class="border px-2 py-1">${i["Open Date"]}</td>
        <td class="border px-2 py-1">${i["Close Date"]}</td>
        <td class="border px-2 py-1">${i["Issue Size"]}</td>
      </tr>
    `).join("") || "<tr><td colspan='6'>No data</td></tr>";

    // ========== MOVERS ==========
    const resMovers = await fetch(API_URL + "?type=movers");
    const dataMovers = await resMovers.json();
    console.log("Movers API Response:", dataMovers);
    const moversArray = Array.isArray(dataMovers.movers) ? dataMovers.movers : [];
    document.getElementById("moversList").innerHTML = moversArray.slice(0, 6).map(m => `
      <div class="p-3 rounded text-white ${parseFloat(m["Change%"]) > 0 ? "bg-green-600" : (parseFloat(m["Change%"]) < 0 ? "bg-red-600" : "bg-gray-500")}">
        ${m.Name} ₹${m.CMP} (${m["Change%"]}%)
      </div>
    `).join("") || "<p>No movers available</p>";

    // ========== PICKS ==========
    const resPicks = await fetch(API_URL + "?type=picks");
    const dataPicks = await resPicks.json();
    console.log("Picks API Response:", dataPicks);
    const picksArray = Array.isArray(dataPicks.picks) ? dataPicks.picks : [];
    document.getElementById("picksList").innerHTML = picksArray.slice(0, 6).map(p => `
      <div class="p-3 border rounded bg-gray-100 dark:bg-gray-700">
        <a href="${p.Link}" target="_blank" class="font-semibold hover:underline">${p.Stock}</a>
        <p class="text-xs text-gray-500">${p.Reason}</p>
      </div>
    `).join("") || "<p>No picks available</p>";

  } catch (err) {
    console.error("❌ Error in Home Script:", err);
  }
});