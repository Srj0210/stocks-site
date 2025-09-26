document.addEventListener("DOMContentLoaded", async () => {
  showLoader("ipoRecent");
  let ipos = await fetchData("IPOs_Recent");
  document.getElementById("ipoRecent").innerHTML = ipos.map(i=>`
    <tr class="searchable">
      <td class="border px-2 py-1">${i.Name}</td>
      <td class="border px-2 py-1">${i["Issue Type"]}</td>
      <td class="border px-2 py-1">${i["Price Band"]}</td>
      <td class="border px-2 py-1">${i["Open Date"]}</td>
      <td class="border px-2 py-1">${i["Close Date"]}</td>
      <td class="border px-2 py-1">${i["Issue Size"]}</td>
    </tr>`).join("");
});