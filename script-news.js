async function loadNewsPage(){
  showLoader("newsList");
  try{
    const res=await fetch(API_URL);
    const data=await res.json();
    const newsList=document.getElementById("newsList");
    if(newsList){
      newsList.innerHTML="";
      (data.news||[]).forEach(n=>{
        newsList.innerHTML+=`
          <div class="searchable p-3 border rounded bg-gray-800">
            <a href="${n.Link}" target="_blank" class="font-medium">${n.Title}</a>
            <div class="text-xs text-gray-400 mt-1">${n.Published||""}</div>
          </div>`;
      });
    }
  }catch(err){console.error("❌ News load error:",err);}
}
window.onload=loadNewsPage;