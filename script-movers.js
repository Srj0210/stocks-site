async function loadMoversPage(){
  showLoader("moversList");
  try{
    const res=await fetch(API_URL);
    const data=await res.json();
    const moversList=document.getElementById("moversList");
    if(moversList){
      moversList.innerHTML="";
      (data.movers||[]).forEach(m=>{
        const change=parseFloat(m["Change%"]||0);
        const cls=change>=0?"bg-green-900":"bg-red-900";
        moversList.innerHTML+=`
          <div class="p-2 rounded ${cls} searchable">
            <strong>${m.Name}</strong> ₹${m.CMP} (${change}%)
          </div>`;
      });
    }
  }catch(err){console.error("❌ Movers load error:",err);}
}
window.onload=loadMoversPage;