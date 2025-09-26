async function loadPicksPage(){
  showLoader("picksList");
  try{
    const res=await fetch(API_URL);
    const data=await res.json();
    const picksList=document.getElementById("picksList");
    if(picksList){
      picksList.innerHTML="";
      (data.picks||[]).forEach(p=>{
        picksList.innerHTML+=`
          <div class="searchable p-3 border rounded bg-gray-800">
            <strong>${p.Stock}</strong>
            <div class="text-xs mt-1 text-gray-400">${p.Reason||""}</div>
          </div>`;
      });
    }
  }catch(err){console.error("❌ Picks load error:",err);}
}
window.onload=loadPicksPage;