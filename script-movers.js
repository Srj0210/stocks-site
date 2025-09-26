document.addEventListener("DOMContentLoaded", async () => {
  showLoader("moversList");
  let movers = await fetchData("GainersLosers");
  document.getElementById("moversList").innerHTML = movers.map(m=>{
    let change = parseFloat(m["Change%"]);
    let color = change > 0 ? "text-green-500" : (change < 0 ? "text-red-500" : "text-gray-400");
    return `<div class="searchable p-2 border-b border-gray-600">
      ${m.Name} ₹${m.CMP} | P/E: ${m["P/E"]} | MCap: ${m.MCap} | 
      <span class="${color}">${m["Change%"]}%</span>
    </div>`;
  }).join("");
});