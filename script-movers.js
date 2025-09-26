document.addEventListener("DOMContentLoaded", async () => {
  showLoader("moversList");

  const movers = await fetchData("movers");
  console.log("Movers:", movers);

  if (!movers.length) {
    document.getElementById("moversList").innerHTML =
      "<p class='text-center text-red-500'>❌ No movers found</p>";
    return;
  }

  paginate(
    "moversList",
    movers,
    m => {
      const change = parseFloat(m["Change%"] || 0);
      const cls = change > 0
        ? "bg-green-50 dark:bg-green-900"
        : change < 0
        ? "bg-red-50 dark:bg-red-900"
        : "bg-gray-200 dark:bg-gray-700";

      return `
        <div class="searchable p-3 border rounded ${cls}">
          <strong>${m.Name}</strong>
          <span class="text-sm">₹${m.CMP} (${change}%)</span>
        </div>`;
    }
  );
});