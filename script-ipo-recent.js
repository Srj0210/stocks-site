document.addEventListener("DOMContentLoaded", async () => {
  showLoader("ipoRecent");

  const ipos = await fetchData("ipos_recent");
  console.log("Recent IPOs:", ipos);

  if (!ipos.length) {
    document.getElementById("ipoRecent").innerHTML =
      "<tr><td colspan='6' class='text-center text-red-500'>❌ No recent IPOs found</td></tr>";
    return;
  }

  paginate(
    "ipoRecent",
    ipos,
    i => `
      <tr class="searchable">
        <td class="border px-2 py-1">${i.Name}</td>
        <td class="border px-2 py-1">${i["Issue Type"]}</td>
        <td class="border px-2 py-1">${i["Price Band"]}</td>
        <td class="border px-2 py-1">${formatDate(i["Open Date"])}</td>
        <td class="border px-2 py-1">${formatDate(i["Close Date"])}</td>
        <td class="border px-2 py-1">${i["Issue Size"]}</td>
      </tr>`
  );
});