document.addEventListener("DOMContentLoaded", async () => {
  showLoader("newsList");
  try {
    const data = await fetchData();
    paginate("newsList", data.news || [],
      n => `<div class="searchable p-3 border rounded">
              <p class="font-semibold">${n.Title}</p>
              <small>${n.Published}</small>
            </div>`,
      10
    );
  } catch {
    document.getElementById("newsList").innerHTML =
      `<p class="text-red-500">❌ Error loading news</p>`;
  }
});