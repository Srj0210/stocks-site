// ===== News Ticker =====
function renderNewsTicker(news) {
  const ticker = document.getElementById("tickerText");
  if (!ticker) return;
  ticker.innerHTML = (news || []).map(n => n.Title).join(" | ");
}

// ===== Movers Ticker =====
function renderMoversTicker(movers) {
  const ticker = document.getElementById("moversTicker");
  if (!ticker) return;
  ticker.innerHTML = (movers || []).map(m => {
    const change = parseFloat(m["Change%"] || 0);
    const arrow = change >= 0 ? "⬆" : "⬇";
    const cls = change >= 0 ? "text-green-400" : "text-red-400";
    return `<span class="${cls} font-semibold">${m.Name} ₹${m.CMP} ${arrow} ${change}%</span>`;
  }).join(" | ");
}

// ===== Load Home =====
async function loadHome(){
  try{
    const res = await fetch(API_URL);
    const data = await res.json();

    // News (6 only)
    const newsList=document.getElementById("newsList");
    if(newsList){
      newsList.innerHTML="";
      (data.news||[]).slice(0,6).forEach(n=>{
        newsList.innerHTML+=`
          <div class="searchable p-3 border rounded bg-gray-800">
            <a href="${n.Link}" target="_blank" class="font-medium">${n.Title}</a>
            <div class="text-xs text-gray-400 mt-1">${n.Published||""}</div>
          </div>`;
      });
    }
    renderNewsTicker(data.news);

    // IPOs
    const ipoUpcoming=document.getElementById("ipoUpcoming");
    if(ipoUpcoming){
      ipoUpcoming.innerHTML="";
      (data.ipos_upcoming||[]).slice(0,10).forEach(i=>{
        ipoUpcoming.innerHTML+=`
          <tr class="searchable">
            <td class="border px-2 py-1">${i.Name||""}</td>
            <td class="border px-2 py-1">${i["Issue Type"]||""}</td>
            <td class="border px-2 py-1">${i["Price Band"]||""}</td>
            <td class="border px-2 py-1">${i["Open Date"]||""}</td>
            <td class="border px-2 py-1">${i["Close Date"]||""}</td>
            <td class="border px-2 py-1">${i["Issue Size"]||""}</td>
          </tr>`;
      });
    }

    const ipoRecent=document.getElementById("ipoRecent");
    if(ipoRecent){
      ipoRecent.innerHTML="";
      (data.ipos_recent||[]).slice(0,10).forEach(i=>{
        ipoRecent.innerHTML+=`
          <tr class="searchable">
            <td class="border px-2 py-1">${i.Name||""}</td>
            <td class="border px-2 py-1">${i["Issue Type"]||""}</td>
            <td class="border px-2 py-1">${i["Price Band"]||""}</td>
            <td class="border px-2 py-1">${i["Open Date"]||""}</td>
            <td class="border px-2 py-1">${i["Close Date"]||""}</td>
            <td class="border px-2 py-1">${i["Issue Size"]||""}</td>
          </tr>`;
      });
    }

    // Movers
    const moversList=document.getElementById("moversList");
    if(moversList){
      moversList.innerHTML="";
      (data.movers||[]).slice(0,10).forEach(m=>{
        const change=parseFloat(m["Change%"]||0);
        const cls=change>=0?"bg-green-900":"bg-red-900";
        moversList.innerHTML+=`
          <div class="p-2 rounded ${cls}">
            <strong>${m.Name}</strong> ₹${m.CMP} (${change}%)
          </div>`;
      });
    }
    renderMoversTicker(data.movers);

    // Picks
    const picksList=document.getElementById("picksList");
    if(picksList){
      picksList.innerHTML="";
      (data.picks||[]).slice(0,4).forEach(p=>{
        picksList.innerHTML+=`
          <div class="searchable p-3 border rounded bg-gray-800">
            <strong>${p.Stock}</strong>
            <div class="text-xs mt-1 text-gray-400">${p.Reason||""}</div>
          </div>`;
      });
    }

  }catch(err){console.error("❌ Home load error:",err);}
}
window.onload=loadHome;