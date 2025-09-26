document.addEventListener("DOMContentLoaded", async () => {
  showLoader("ipoRecent");

  try {
    const res = await fetch(`${API_URL}?sheet=IPOs_Recent`);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      document.getElementById("ipoRecent").innerHTML =
        `<tr><td colspan="6" class="text-center text-gray-400">No data</td></tr>`;
      return;
    }

    let rows = data.map(row => `
      <tr>
        <td class="border px-2 py-1">${row["Name"] || "-"}</td>
        <td class="border px-2 py-1">${row["Issue Type"] || "-"}</td>
        <td class="border px-2 py-1">${row["Price Band"] || "-"}</td>
        <td class="border px-2 py-1">${row["Open Date"] || "-"}</td>
        <td class="border px-2 py-1">${row["Close Date"] || "-"}</td>
        <td class="border px-2 py-1">${row["Issue Size"] || "-"}</td>
      </tr>
    `).join("");

    document.getElementById("ipoRecent").innerHTML = rows;

  } catch (err) {
    console.error(err);
    document.getElementById("ipoRecent").innerHTML =
      `<tr><td colspan="6" class="text-center text-red-500">Failed to load data</td></tr>`;
  }
});