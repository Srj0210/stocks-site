document.addEventListener("DOMContentLoaded", async () => {
  showLoader("newsList");

  const news = await fetchData("news");
  console.log("News Data:", news);

  if (!news.length) {
    document.getElementById("newsList").innerHTML =
      "<p class='text-center text-red-500'>❌ No news found</p>";
    return;
  }

  paginate(
    "newsList",
    news,
    n => `
      <div class="searchable p-3 border rounded bg-gray-50 dark:bg-gray-700">
        <a href="${n.Link}" target="_blank" class="font-medium">${n.Title}</a>
        <div class="text-xs text-gray-500 mt-1">${n.Published}</div>
      </div>`
  );
});