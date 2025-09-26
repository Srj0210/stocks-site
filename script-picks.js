document.addEventListener("DOMContentLoaded", async () => {
  showLoader("picksList");
  let picks = await fetchData("Picks");
  document.getElementById("picksList").innerHTML = picks.map(p=>`
    <a href="${p.Link}" target="_blank" class="searchable block p-3 border-b border-gray-600 hover:bg-gray-700">
      <h3 class="font-semibold">${p.Stock}</h3>
      <p class="text-sm text-gray-400">${p.Reason}</p>
    </a>`).join("");
});