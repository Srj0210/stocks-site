document.addEventListener("DOMContentLoaded", async () => {
  showLoader("ipoUpcoming");
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const ipos = data.ipos_upcoming || [];
    document.getElementById("ipoUpcoming").innerHTML =
      ipos.map(row=>`
        <tr>
          <td class="border px-2 py-1">${row["Name"]||"-"}</td>
          <td class="border px-2 py-1">${row["Issue Type"]||"-"}</td>
          <td class="border px-2 py-1">${row["Price Band"]||"-"}</td>
          <td class="border px-2 py-1">${row["Open Date"]||"-"}</td>
          <td class="border px-2 py-1">${row["Close Date"]||"-"}</td>
          <td class="border px-2 py-1">${row["Issue Size"]||"-"}</td>
        </tr>
      `).join("");
  } catch (err) {
    console.error(err);
  }
});