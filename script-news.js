document.addEventListener("DOMContentLoaded", async () => {
  showLoader("newsList");
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const news = data.news || [];
    document.getElementById("newsList").innerHTML =
      news.map(n=>`
        <div class="searchable p-2 border-b">
          <a href="${n.Link}" target="_blank" class="font-semibold">${n.Title}</a>
          <p class="text-xs text-gray-400">${n.Published}</p>
        </div>
      `).join("");
  } catch (err) {
    console.error(err);
  }
});