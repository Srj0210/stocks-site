document.addEventListener("DOMContentLoaded", async () => {
  showLoader("ipoRecentList");
  try {
    const data = await fetchData();
    paginate("ipoRecentList", data.ipos_recent || [],
      ipo => `<tr class="searchable">
                <td>${ipo.Name}</td>
                <td>${ipo["Issue Type"]}</td>
                <td>${ipo["Price Band"]}</td>
                <td>${ipo["Open Date"]}</td>
                <td>${ipo["Close Date"]}</td>
                <td>${ipo["Issue Size"]}</td>
              </tr>`,
      10
    );
  } catch {
    document.getElementById("ipoRecentList").innerHTML =
      `<p class="text-red-500">❌ Error loading IPOs</p>`;
  }
});