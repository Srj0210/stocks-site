document.addEventListener("DOMContentLoaded", async () => {
  showLoader("moversList");
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const movers = data.movers || [];
    document.getElementById("moversList").innerHTML =
      movers.map(m=>{
        let color = "bg-gray-200 dark:bg-gray-700";
        if (parseFloat(m["Change%"]) > 0) color = "bg-green-500 text-white";
        if (parseFloat(m["Change%"]) < 0) color = "bg-red-500 text-white";
        return `<div class="searchable ${color} p-2 m-1 rounded">${m.Name} ₹${m.CMP} (${m["Change%"]}%)</div>`;
      }).join("");
  } catch (err) {
    console.error(err);
  }
});