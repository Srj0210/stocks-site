document.addEventListener("DOMContentLoaded", async () => {
  // News
  showLoader("newsList");
  let news = await fetchData("News");
  document.getElementById("newsList").innerHTML = news.slice(0,6).map(n=>`
    <a href="${n.Link}" target="_blank" class="searchable block p-3 rounded bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-600">
      <h3 class="font-semibold">${n.Title}</h3>
      <p class="text-sm text-gray-500">${n.Published}</p>
    </a>`).join("");

  // Upcoming IPOs
  showLoader("ipoUpcoming");
  let iposUpcoming = await fetchData("IPOs_Upcoming");
  document.getElementById("ipoUpcoming").innerHTML = iposUpcoming.slice(0,5).map(i=>`
    <tr class="searchable">
      <td class="border px-2 py-1">${i.Name}</td>
      <td class="border px-2 py-1">${i["Issue Type"]}</td>
      <td class="border px-2 py-1">${i["Price Band"]}</td>
      <td class="border px-2 py-1">${i["Open Date"]}</td>
      <td class="border px-2 py-1">${i["Close Date"]}</td>
      <td class="border px-2 py-1">${i["Issue Size"]}</td>
    </tr>`).join("");

  // Recent IPOs
  showLoader("ipoRecent");
  let iposRecent = await fetchData("IPOs_Recent");
  document.getElementById("ipoRecent").innerHTML = iposRecent.slice(0,5).map(i=>`
    <tr class="searchable">
      <td class="border px-2 py-1">${i.Name}</td>
      <td class="border px-2 py-1">${i["Issue Type"]}</td>
      <td class="border px-2 py-1">${i["Price Band"]}</td>
      <td class="border px-2 py-1">${i["Open Date"]}</td>
      <td class="border px-2 py-1">${i["Close Date"]}</td>
      <td class="border px-2 py-1">${i["Issue Size"]}</td>
    </tr>`).join("");

  // Movers
  showLoader("moversList");
  let movers = await fetchData("GainersLosers");
  document.getElementById("moversList").innerHTML = movers.slice(0,6).map(m=>{
    let change = parseFloat(m["Change%"]);
    let color = change > 0 ? "bg-green-500" : (change < 0 ? "bg-red-500" : "bg-gray-400");
    return `<div class="searchable p-3 rounded text-white ${color}">
      ${m.Name} ₹${m.CMP} (${m["Change%"]}%)
    </div>`;
  }).join("");

  // Picks
  showLoader("picksList");
  let picks = await fetchData("Picks");
  document.getElementById("picksList").innerHTML = picks.slice(0,6).map(p=>`
    <a href="${p.Link}" target="_blank" class="searchable block p-3 rounded bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-600">
      <h3 class="font-semibold">${p.Stock}</h3>
      <p class="text-sm text-gray-500">${p.Reason}</p>
    </a>`).join("");
});