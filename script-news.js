document.addEventListener("DOMContentLoaded", async () => {
  showLoader("newsList");
  let news = await fetchData("News");
  document.getElementById("newsList").innerHTML = news.map(n=>`
    <a href="${n.Link}" target="_blank" class="searchable block p-3 border-b border-gray-600 hover:bg-gray-700">
      <h3 class="font-semibold">${n.Title}</h3>
      <p class="text-sm text-gray-400">${n.Published}</p>
    </a>`).join("");
});