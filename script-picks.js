document.addEventListener("DOMContentLoaded", async () => {
  showLoader("picksList");
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const picks = data.picks || [];
    document.getElementById("picksList").innerHTML =
      picks.map(p=>`
        <div class="searchable p-2 border-b">
          <a href="${p.Link}" target="_blank" class="font-semibold">${p.Stock}</a>
          <p class="text-xs text-gray-400">${p.Reason}</p>
        </div>
      `).join("");
  } catch (err) {
    console.error(err);
  }
});