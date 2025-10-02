// ===== search.js (Secure Autocomplete with TradingView) =====
(function(){
  const allowedSymbols = [
    { symbol: "NASDAQ:AAPL", name: "Apple Inc." },
    { symbol: "NASDAQ:MSFT", name: "Microsoft Corp." },
    { symbol: "NASDAQ:GOOGL", name: "Alphabet (Google)" },
    { symbol: "NASDAQ:AMZN", name: "Amazon.com" },
    { symbol: "NASDAQ:TSLA", name: "Tesla" },
    { symbol: "NASDAQ:NVDA", name: "NVIDIA" },
    { symbol: "DJI", name: "Dow Jones" },
    { symbol: "SP:SPX", name: "S&P 500" },
    { symbol: "NASDAQ:NDX", name: "Nasdaq 100" },
    { symbol: "INDEX:DAX", name: "DAX (Germany)" },
    { symbol: "INDEX:NKY", name: "Nikkei 225 (Japan)" },
    { symbol: "HSI", name: "Hang Seng" },
    { symbol: "TVC:GOLD", name: "Gold" },
    { symbol: "TVC:USOIL", name: "Crude Oil (WTI)" },
    { symbol: "FX:USDINR", name: "USD/INR" },
    { symbol: "CRYPTO:BTCUSD", name: "Bitcoin" },
    { symbol: "CRYPTO:ETHUSD", name: "Ethereum" }
  ];

  const $ = id => document.getElementById(id);
  const inputEl = $("stockSearchInput");
  const suggestionsEl = $("suggestions");
  const chartEl = $("stockChart");

  // 🔒 Escape HTML
  function escapeHTML(str){
    return str.replace(/[&<>'"]/g, tag => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", "\"":"&quot;"
    }[tag]));
  }

  // 🔒 Ensure symbol is only from allowed list
  function sanitizeSymbol(symbol){
    return allowedSymbols.find(it => it.symbol === symbol) ? symbol : null;
  }

  function debounce(fn, wait=200){
    let t; return (...args)=>{ clearTimeout(t); t=setTimeout(()=>fn(...args), wait); };
  }

  function findMatches(q){
    if(!q) return [];
    q = q.toLowerCase();
    return allowedSymbols.filter(it =>
      it.name.toLowerCase().includes(q) || it.symbol.toLowerCase().includes(q)
    ).slice(0, 10);
  }

  function renderSuggestions(list){
    suggestionsEl.innerHTML = "";
    if(!list.length){ suggestionsEl.classList.add("hidden"); return; }
    suggestionsEl.classList.remove("hidden");
    list.forEach(it => {
      const li = document.createElement("li");
      li.className = "px-3 py-2 cursor-pointer hover:bg-blue-600 hover:text-white";
      li.innerHTML = `
        <div class="font-medium">${escapeHTML(it.name)}</div>
        <div class="text-xs text-gray-500">${escapeHTML(it.symbol)}</div>`;
      li.onclick = ()=> selectSymbol(it);
      suggestionsEl.appendChild(li);
    });
  }

  function selectSymbol(item){
    const safeSymbol = sanitizeSymbol(item.symbol);
    if (!safeSymbol) return; // 🚫 block invalid symbol

    inputEl.value = item.name + " — " + item.symbol;
    suggestionsEl.classList.add("hidden");
    chartEl.innerHTML = "";

    const id = "tv_" + Date.now();
    const div = document.createElement("div");
    div.id = id;
    div.style.width = "100%";
    div.style.height = "420px";
    chartEl.appendChild(div);

    new TradingView.widget({
      "width": "100%",
      "height": 420,
      "symbol": safeSymbol,
      "interval": "D",
      "timezone": "Asia/Kolkata",
      "theme": document.documentElement.classList.contains("dark") ? "dark" : "light",
      "style": "1",
      "locale": "en",
      "allow_symbol_change": false, // 🔒 prevent user editing
      "container_id": id
    });
  }

  inputEl.addEventListener("input", debounce((e)=>{
    const q = e.target.value.trim();
    renderSuggestions(findMatches(q));
  }, 200));

  document.addEventListener("click", (e)=>{
    if(!e.target.closest("#searchStocks")) suggestionsEl.classList.add("hidden");
  });
})();