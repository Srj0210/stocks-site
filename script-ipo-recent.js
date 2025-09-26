async function loadRecentIPOPage(){
  showLoader("ipoRecent");
  try{
    const res=await fetch(API_URL);
    const data=await res.json();
    const table=document.getElementById("ipoRecent");
    if(table){
      table.innerHTML="";
      (data.ipos_recent||[]).forEach(i=>{
        table.innerHTML+=`
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
  }catch(err){console.error("❌ Recent IPO load error:",err);}
}
window.onload=loadRecentIPOPage;