document.addEventListener("DOMContentLoaded", async () => {
  showLoader("picksList");

  const picks = await fetchData("picks");
  console.log("Picks:", picks);

  if (!picks.length) {
    document.getElementById("picksList").innerHTML =
      "<p class='text-center text-red-500'>❌ No picks found</p>";
    return;
  }

  paginate(
    "picksList",
    picks,
    p => `
      <div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-700">
        <strong>${p.Stock}</strong>
        <div class="text-xs mt-1">${p.Reason}</div>
      </div>`
  );
});