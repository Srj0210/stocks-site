// =====================================================
// SRJahir Tech Stocks — search.js
// 200+ NSE/BSE Large & Mid Cap Stocks
// =====================================================
(function(){

const STOCKS = [
  // ===== INDICES =====
  { s:'BSE:SENSEX',       n:'Sensex',                    t:['sensex','bse'] },
  { s:'NSE:NIFTY',        n:'Nifty 50',                  t:['nifty50','nse'] },
  { s:'NSE:BANKNIFTY',    n:'Bank Nifty',                t:['banknifty'] },

  // ===== IT / TECHNOLOGY =====
  { s:'BSE:TCS',          n:'TCS',                       t:['tata consultancy'] },
  { s:'BSE:INFY',         n:'Infosys',                   t:['infosys'] },
  { s:'BSE:WIPRO',        n:'Wipro',                     t:['wipro'] },
  { s:'BSE:HCLTECH',      n:'HCL Technologies',          t:['hcl tech'] },
  { s:'BSE:TECHM',        n:'Tech Mahindra',             t:['techmahindra'] },
  { s:'BSE:LTIM',         n:'LTIMindtree',               t:['ltimindtree','mindtree'] },
  { s:'BSE:MPHASIS',      n:'Mphasis',                   t:['mphasis'] },
  { s:'BSE:COFORGE',      n:'Coforge',                   t:['coforge','niit'] },
  { s:'BSE:PERSISTENT',   n:'Persistent Systems',        t:['persistent'] },
  { s:'BSE:OFSS',         n:'Oracle Financial (OFSS)',   t:['oracle financial'] },
  { s:'BSE:KPITTECH',     n:'KPIT Technologies',         t:['kpit'] },
  { s:'BSE:TATAELXSI',    n:'Tata Elxsi',               t:['tata elxsi'] },
  { s:'BSE:HEXAWARE',     n:'Hexaware Technologies',     t:['hexaware'] },
  { s:'BSE:ZENSARTECH',   n:'Zensar Technologies',       t:['zensar'] },
  { s:'BSE:CYIENT',       n:'Cyient',                    t:['cyient'] },
  { s:'BSE:MASTEK',       n:'Mastek',                    t:['mastek'] },

  // ===== BANKING =====
  { s:'BSE:HDFCBANK',     n:'HDFC Bank',                 t:['hdfc','hdfcbank'] },
  { s:'BSE:ICICIBANK',    n:'ICICI Bank',                t:['icici'] },
  { s:'BSE:SBIN',         n:'SBI',                       t:['state bank','sbi'] },
  { s:'BSE:KOTAKBANK',    n:'Kotak Mahindra Bank',       t:['kotak'] },
  { s:'BSE:AXISBANK',     n:'Axis Bank',                 t:['axis'] },
  { s:'BSE:INDUSINDBK',   n:'IndusInd Bank',             t:['indusind'] },
  { s:'BSE:PNB',          n:'Punjab National Bank',      t:['pnb','punjab national'] },
  { s:'BSE:BANKBARODA',   n:'Bank of Baroda',            t:['bob','bank of baroda'] },
  { s:'BSE:CANBK',        n:'Canara Bank',               t:['canara'] },
  { s:'BSE:UNIONBANK',    n:'Union Bank of India',       t:['union bank'] },
  { s:'BSE:IDFCFIRSTB',   n:'IDFC First Bank',           t:['idfc'] },
  { s:'BSE:FEDERALBNK',   n:'Federal Bank',              t:['federal bank'] },
  { s:'BSE:BANDHANBNK',   n:'Bandhan Bank',              t:['bandhan'] },
  { s:'BSE:RBLBANK',      n:'RBL Bank',                  t:['rbl'] },
  { s:'BSE:YESBANK',      n:'Yes Bank',                  t:['yes bank'] },

  // ===== NBFC / FINANCE =====
  { s:'BSE:BAJFINANCE',   n:'Bajaj Finance',             t:['bajaj finance'] },
  { s:'BSE:BAJAJFINSV',   n:'Bajaj Finserv',             t:['bajaj finserv'] },
  { s:'BSE:CHOLAFIN',     n:'Cholamandalam Finance',     t:['chola','cholamandalam'] },
  { s:'BSE:MUTHOOTFIN',   n:'Muthoot Finance',           t:['muthoot'] },
  { s:'BSE:MANAPPURAM',   n:'Manappuram Finance',        t:['manappuram'] },
  { s:'BSE:SHRIRAMFIN',   n:'Shriram Finance',           t:['shriram'] },
  { s:'BSE:M&MFIN',       n:'M&M Financial Services',   t:['mahindra finance'] },
  { s:'BSE:LIChousing',   n:'LIC Housing Finance',       t:['lic housing'] },
  { s:'BSE:POONAWALLA',   n:'Poonawalla Fincorp',        t:['poonawalla'] },

  // ===== RELIANCE / CONGLOMERATE =====
  { s:'BSE:RELIANCE',     n:'Reliance Industries',       t:['reliance','ril','jio'] },
  { s:'BSE:LT',           n:'Larsen & Toubro',           t:['larsen','l&t','lt'] },
  { s:'BSE:ADANIENT',     n:'Adani Enterprises',         t:['adani enterprises'] },

  // ===== AUTO =====
  { s:'BSE:MARUTI',       n:'Maruti Suzuki',             t:['maruti','suzuki'] },
  { s:'BSE:TATAMOTORS',   n:'Tata Motors',               t:['tata motors'] },
  { s:'BSE:M&M',          n:'Mahindra & Mahindra',       t:['mahindra','m&m'] },
  { s:'BSE:EICHERMOT',    n:'Eicher Motors',             t:['eicher','royal enfield'] },
  { s:'BSE:BAJAJ-AUTO',   n:'Bajaj Auto',                t:['bajaj auto'] },
  { s:'BSE:HEROMOTOCO',   n:'Hero MotoCorp',             t:['hero motocorp'] },
  { s:'BSE:TVSMOTOR',     n:'TVS Motor',                 t:['tvs motor'] },
  { s:'BSE:ASHOKLEY',     n:'Ashok Leyland',             t:['ashok leyland'] },
  { s:'BSE:BHARATFORG',   n:'Bharat Forge',              t:['bharat forge'] },
  { s:'BSE:MOTHERSON',    n:'Samvardhana Motherson',     t:['motherson'] },
  { s:'BSE:BALKRISIND',   n:'Balkrishna Industries',     t:['balkrishna','bkt'] },
  { s:'BSE:APOLLOTYRE',   n:'Apollo Tyres',              t:['apollo tyres'] },
  { s:'BSE:MRF',          n:'MRF',                       t:['mrf'] },
  { s:'BSE:CEATLTD',      n:'CEAT',                      t:['ceat'] },

  // ===== PHARMA =====
  { s:'BSE:SUNPHARMA',    n:'Sun Pharma',                t:['sun pharma'] },
  { s:'BSE:DRREDDY',      n:"Dr Reddy's",                t:['drreddy','dr reddy'] },
  { s:'BSE:CIPLA',        n:'Cipla',                     t:['cipla'] },
  { s:'BSE:DIVISLAB',     n:"Divi's Laboratories",       t:['divis','divi'] },
  { s:'BSE:BIOCON',       n:'Biocon',                    t:['biocon'] },
  { s:'BSE:AUROPHARMA',   n:'Aurobindo Pharma',          t:['aurobindo'] },
  { s:'BSE:LUPIN',        n:'Lupin',                     t:['lupin'] },
  { s:'BSE:TORNTPHARM',   n:'Torrent Pharma',            t:['torrent pharma'] },
  { s:'BSE:ALKEM',        n:'Alkem Laboratories',        t:['alkem'] },
  { s:'BSE:MANKIND',      n:'Mankind Pharma',            t:['mankind'] },
  { s:'BSE:IPCALAB',      n:'IPCA Laboratories',         t:['ipca'] },
  { s:'BSE:GLAND',        n:'Gland Pharma',              t:['gland pharma'] },
  { s:'BSE:LAURUSLABS',   n:'Laurus Labs',               t:['laurus'] },
  { s:'BSE:GRANULES',     n:'Granules India',            t:['granules'] },
  { s:'BSE:AJANTPHARM',   n:'Ajanta Pharma',             t:['ajanta'] },

  // ===== FMCG =====
  { s:'BSE:HINDUNILVR',   n:'HUL (Hindustan Unilever)',  t:['hul','hindustan unilever'] },
  { s:'BSE:ITC',          n:'ITC',                       t:['itc'] },
  { s:'BSE:NESTLEIND',    n:'Nestle India',              t:['nestle'] },
  { s:'BSE:BRITANNIA',    n:'Britannia Industries',      t:['britannia'] },
  { s:'BSE:DABUR',        n:'Dabur India',               t:['dabur'] },
  { s:'BSE:MARICO',       n:'Marico',                    t:['marico'] },
  { s:'BSE:GODREJCP',     n:'Godrej Consumer Products',  t:['godrej consumer'] },
  { s:'BSE:EMAMILTD',     n:'Emami',                     t:['emami'] },
  { s:'BSE:COLPAL',       n:'Colgate-Palmolive',         t:['colgate'] },
  { s:'BSE:JYOTHYLAB',    n:'Jyothy Labs',               t:['jyothy'] },
  { s:'BSE:TATACONSUM',   n:'Tata Consumer Products',    t:['tata consumer','tata tea'] },
  { s:'BSE:VBL',          n:'Varun Beverages',           t:['varun beverages','pepsi'] },
  { s:'BSE:ZOMATO',       n:'Zomato',                    t:['zomato'] },

  // ===== ENERGY / OIL =====
  { s:'BSE:ONGC',         n:'ONGC',                      t:['ongc'] },
  { s:'BSE:BPCL',         n:'BPCL',                      t:['bpcl','bharat petroleum'] },
  { s:'BSE:IOC',          n:'Indian Oil',                t:['ioc','indian oil'] },
  { s:'BSE:HPCL',         n:'HPCL',                      t:['hpcl'] },
  { s:'BSE:GAIL',         n:'GAIL India',                t:['gail'] },
  { s:'BSE:PETRONET',     n:'Petronet LNG',              t:['petronet'] },
  { s:'BSE:IGL',          n:'Indraprastha Gas (IGL)',    t:['igl','indraprastha gas'] },
  { s:'BSE:MGL',          n:'Mahanagar Gas (MGL)',       t:['mgl','mahanagar gas'] },
  { s:'BSE:ATGL',         n:'Adani Total Gas',           t:['adani gas','atgl'] },
  { s:'BSE:GSPL',         n:'Gujarat State Petronet',    t:['gspl'] },

  // ===== POWER =====
  { s:'BSE:NTPC',         n:'NTPC',                      t:['ntpc'] },
  { s:'BSE:POWERGRID',    n:'Power Grid',                t:['powergrid'] },
  { s:'BSE:ADANIGREEN',   n:'Adani Green Energy',        t:['adani green'] },
  { s:'BSE:TATAPOWER',    n:'Tata Power',                t:['tata power'] },
  { s:'BSE:CESC',         n:'CESC',                      t:['cesc'] },
  { s:'BSE:JSW ENERGY',   n:'JSW Energy',                t:['jsw energy'] },
  { s:'BSE:TORNTPOWER',   n:'Torrent Power',             t:['torrent power'] },
  { s:'BSE:ADANIPOWER',   n:'Adani Power',               t:['adani power'] },

  // ===== METALS & MINING =====
  { s:'BSE:TATASTEEL',    n:'Tata Steel',                t:['tata steel'] },
  { s:'BSE:JSWSTEEL',     n:'JSW Steel',                 t:['jsw steel'] },
  { s:'BSE:HINDALCO',     n:'Hindalco Industries',       t:['hindalco'] },
  { s:'BSE:VEDL',         n:'Vedanta',                   t:['vedanta'] },
  { s:'BSE:SAIL',         n:'SAIL',                      t:['sail','steel authority'] },
  { s:'BSE:NMDC',         n:'NMDC',                      t:['nmdc'] },
  { s:'BSE:COALINDIA',    n:'Coal India',                t:['coal india'] },
  { s:'BSE:NATIONALUM',   n:'National Aluminium',        t:['nalco','national aluminium'] },
  { s:'BSE:HINDCOPPER',   n:'Hindustan Copper',          t:['hindustan copper'] },
  { s:'BSE:APL APOLLO',   n:'APL Apollo Tubes',          t:['apl apollo'] },

  // ===== CEMENT =====
  { s:'BSE:ULTRACEMCO',   n:'UltraTech Cement',          t:['ultratech'] },
  { s:'BSE:AMBUJACEM',    n:'Ambuja Cements',            t:['ambuja'] },
  { s:'BSE:ACC',          n:'ACC',                       t:['acc cement'] },
  { s:'BSE:SHREECEM',     n:'Shree Cement',              t:['shree cement'] },
  { s:'BSE:DALMIACEM',    n:'Dalmia Bharat',             t:['dalmia'] },
  { s:'BSE:JKCEMENT',     n:'JK Cement',                 t:['jk cement'] },
  { s:'BSE:RAMCOCEM',     n:'Ramco Cements',             t:['ramco'] },
  { s:'BSE:HEIDELBERG',   n:'Heidelberg Cement',         t:['heidelberg'] },

  // ===== REAL ESTATE =====
  { s:'BSE:DLF',          n:'DLF',                       t:['dlf'] },
  { s:'BSE:GODREJPROP',   n:'Godrej Properties',         t:['godrej properties'] },
  { s:'BSE:PRESTIGE',     n:'Prestige Estates',          t:['prestige'] },
  { s:'BSE:BRIGADE',      n:'Brigade Enterprises',       t:['brigade'] },
  { s:'BSE:LODHA',        n:'Macrotech (Lodha)',         t:['lodha','macrotech'] },
  { s:'BSE:SOBHA',        n:'Sobha',                     t:['sobha'] },
  { s:'BSE:PHOENIXLTD',   n:'Phoenix Mills',             t:['phoenix mills'] },
  { s:'BSE:OBEROI REALTY',n:'Oberoi Realty',             t:['oberoi'] },

  // ===== INFRASTRUCTURE =====
  { s:'BSE:ADANIPORTS',   n:'Adani Ports',               t:['adani ports'] },
  { s:'BSE:IRFC',         n:'IRFC',                      t:['irfc'] },
  { s:'BSE:IRB',          n:'IRB Infrastructure',        t:['irb infra'] },
  { s:'BSE:KNR CONST',    n:'KNR Constructions',         t:['knr'] },
  { s:'BSE:SIEMENS',      n:'Siemens India',             t:['siemens'] },
  { s:'BSE:ABB',          n:'ABB India',                 t:['abb'] },
  { s:'BSE:HAVELLS',      n:'Havells India',             t:['havells'] },
  { s:'BSE:POLYCAB',      n:'Polycab India',             t:['polycab'] },
  { s:'BSE:KEI',          n:'KEI Industries',            t:['kei'] },
  { s:'BSE:CUMMINS',      n:'Cummins India',             t:['cummins'] },
  { s:'BSE:BEL',          n:'Bharat Electronics (BEL)', t:['bel','bharat electronics'] },
  { s:'BSE:HAL',          n:'HAL',                       t:['hal','hindustan aeronautics'] },
  { s:'BSE:DELHIVERY',    n:'Delhivery',                 t:['delhivery'] },

  // ===== TELECOM =====
  { s:'BSE:BHARTIARTL',   n:'Bharti Airtel',             t:['airtel','bharti'] },
  { s:'BSE:IDEA',         n:'Vodafone Idea (Vi)',        t:['vodafone','idea','vi'] },
  { s:'BSE:TTML',         n:'Tata Teleservices',         t:['tata teleservices'] },
  { s:'BSE:INDUSTOWER',   n:'Indus Towers',              t:['indus towers'] },
  { s:'BSE:HFCL',         n:'HFCL',                      t:['hfcl'] },

  // ===== INSURANCE =====
  { s:'BSE:SBILIFE',      n:'SBI Life Insurance',        t:['sbi life'] },
  { s:'BSE:HDFCLIFE',     n:'HDFC Life Insurance',       t:['hdfc life'] },
  { s:'BSE:ICICIPRULI',   n:'ICICI Prudential Life',     t:['icici pru','icici prudential'] },
  { s:'BSE:ICICIGI',      n:'ICICI Lombard',             t:['icici lombard'] },
  { s:'BSE:NIACL',        n:'New India Assurance',       t:['new india assurance'] },
  { s:'BSE:GICRE',        n:'GIC Re',                    t:['gic re'] },
  { s:'BSE:LICI',         n:'LIC of India',              t:['lic'] },
  { s:'BSE:STARHEALTH',   n:'Star Health Insurance',     t:['star health'] },

  // ===== CONSUMER DURABLES =====
  { s:'BSE:TITAN',        n:'Titan Company',             t:['titan','tanishq'] },
  { s:'BSE:ASIANPAINT',   n:'Asian Paints',              t:['asian paints'] },
  { s:'BSE:BERGEPAINT',   n:'Berger Paints',             t:['berger'] },
  { s:'BSE:KANSAINER',    n:'Kansai Nerolac Paints',     t:['nerolac','kansai'] },
  { s:'BSE:VGUARD',       n:'V-Guard Industries',        t:['vguard','v-guard'] },
  { s:'BSE:VOLTAS',       n:'Voltas',                    t:['voltas'] },
  { s:'BSE:BLUEDART',     n:'Blue Dart Express',         t:['blue dart'] },
  { s:'BSE:KAJARIACER',   n:'Kajaria Ceramics',          t:['kajaria'] },
  { s:'BSE:CROMPTON',     n:'Crompton Greaves Consumer', t:['crompton'] },
  { s:'BSE:WHIRLPOOL',    n:'Whirlpool India',           t:['whirlpool'] },
  { s:'BSE:BLUESTAR',     n:'Blue Star',                 t:['blue star','bluestar'] },

  // ===== NEW AGE / TECH =====
  { s:'BSE:ZOMATO',       n:'Zomato',                    t:['zomato','food delivery'] },
  { s:'BSE:NYKAA',        n:'Nykaa (FSN E-Commerce)',   t:['nykaa','fsnl'] },
  { s:'BSE:PAYTM',        n:'Paytm (One97 Comm.)',      t:['paytm','one97'] },
  { s:'BSE:POLICYBZR',    n:'PolicyBazaar (PB Fintech)',t:['policybazaar','pb fintech'] },
  { s:'BSE:DELHIVERY',    n:'Delhivery',                 t:['delhivery'] },
  { s:'BSE:CARTRADE',     n:'CarTrade Tech',             t:['cartrade'] },
  { s:'BSE:EASEMYTRIP',   n:'EaseMyTrip',               t:['easemytrip'] },

  // ===== GLOBAL =====
  { s:'NASDAQ:AAPL',      n:'Apple',                     t:['apple','aapl'] },
  { s:'NASDAQ:MSFT',      n:'Microsoft',                 t:['microsoft','msft'] },
  { s:'NASDAQ:GOOGL',     n:'Google / Alphabet',         t:['google','alphabet'] },
  { s:'NASDAQ:AMZN',      n:'Amazon',                    t:['amazon','amzn'] },
  { s:'NASDAQ:TSLA',      n:'Tesla',                     t:['tesla'] },
  { s:'NASDAQ:NVDA',      n:'NVIDIA',                    t:['nvidia'] },
  { s:'NASDAQ:META',      n:'Meta (Facebook)',           t:['meta','facebook'] },
  { s:'SP:SPX',           n:'S&P 500',                   t:['sp500','s&p'] },

  // ===== COMMODITIES =====
  { s:'TVC:GOLD',         n:'Gold',                      t:['gold','sona'] },
  { s:'TVC:SILVER',       n:'Silver',                    t:['silver','chandi'] },
  { s:'TVC:USOIL',        n:'Crude Oil (WTI)',           t:['crude oil','wti'] },
  { s:'FX:USDINR',        n:'USD/INR',                   t:['dollar','usd inr','doller'] },
  { s:'CRYPTO:BTCUSD',    n:'Bitcoin',                   t:['bitcoin','btc'] },
  { s:'CRYPTO:ETHUSD',    n:'Ethereum',                  t:['ethereum','eth'] },
];

// ===== SEARCH ENGINE =====
const inputEl = document.getElementById('stockSearchInput');
const sugEl   = document.getElementById('suggestions');
const chartEl = document.getElementById('stockChart');
if (!inputEl || !sugEl || !chartEl) return;

function search(q) {
  if (!q || q.length < 1) return STOCKS.slice(0, 6);
  q = q.toLowerCase().trim();
  const exact = [], startsWith = [], includes = [];
  STOCKS.forEach(s => {
    const n = s.n.toLowerCase();
    const sym = s.s.toLowerCase();
    const tagMatch = s.t && s.t.some(t => t.includes(q));
    if (n === q || sym.includes(':' + q.toUpperCase())) exact.push(s);
    else if (n.startsWith(q) || sym.includes(q)) startsWith.push(s);
    else if (n.includes(q) || tagMatch) includes.push(s);
  });
  return [...exact, ...startsWith, ...includes].slice(0, 10);
}

function showDropdown(list) {
  sugEl.innerHTML = '';
  if (!list.length) { sugEl.style.display = 'none'; return; }
  sugEl.style.display = 'block';
  list.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span style="font-weight:600;color:var(--text-primary)">${item.n}</span>
      <span style="color:var(--text-muted);font-size:0.72rem;margin-left:8px;font-family:var(--font-mono)">${item.s}</span>`;
    li.onclick = () => { inputEl.value = item.n; sugEl.style.display = 'none'; loadChart(item); };
    sugEl.appendChild(li);
  });
}

function loadChart(item) {
  chartEl.innerHTML = '<div class="loading-text">⏳ Loading chart...</div>';
  chartEl.style.minHeight = '450px';

  function tryTV(n) {
    if (window.TradingView && window.TradingView.widget) {
      chartEl.innerHTML = '';
      const id = 'tv_' + Date.now();
      const div = document.createElement('div');
      div.id = id;
      div.style.cssText = 'width:100%;height:450px';
      chartEl.appendChild(div);
      new TradingView.widget({
        container_id: id, symbol: item.s,
        interval: 'D', timezone: 'Asia/Kolkata',
        theme: 'dark', style: '1', locale: 'en',
        allow_symbol_change: true, autosize: true,
        backgroundColor: 'rgba(13,14,26,1)',
        gridColor: 'rgba(240,165,0,0.05)',
      });
    } else if (n > 0) {
      setTimeout(() => tryTV(n - 1), 500);
    } else {
      chartEl.innerHTML = `
        <div style="text-align:center;padding:2rem;color:var(--text-muted)">
          <div style="font-size:2rem;margin-bottom:8px">📊</div>
          <div style="margin-bottom:12px">Chart load nahi hua</div>
          <a href="https://www.tradingview.com/chart/?symbol=${encodeURIComponent(item.s)}"
             target="_blank" rel="noopener noreferrer"
             style="color:var(--gold);border:1px solid rgba(240,165,0,0.3);padding:8px 18px;border-radius:8px;text-decoration:none;font-size:0.85rem">
            TradingView pe dekho →
          </a>
        </div>`;
    }
  }
  tryTV(12);
}

// Input events
let timer;
inputEl.addEventListener('input', () => {
  clearTimeout(timer);
  timer = setTimeout(() => showDropdown(search(inputEl.value)), 150);
});
inputEl.addEventListener('focus', () => { if (!inputEl.value) showDropdown(search('')); });
inputEl.addEventListener('keydown', e => {
  const items = sugEl.querySelectorAll('li');
  const active = sugEl.querySelector('li.kbd-active');
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    const next = active ? (active.nextElementSibling || items[0]) : items[0];
    active && active.classList.remove('kbd-active');
    next && next.classList.add('kbd-active');
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    const prev = active ? (active.previousElementSibling || items[items.length-1]) : items[items.length-1];
    active && active.classList.remove('kbd-active');
    prev && prev.classList.add('kbd-active');
  } else if (e.key === 'Enter') {
    if (active) { active.click(); }
    else { const m = search(inputEl.value); if (m.length) { inputEl.value = m[0].n; sugEl.style.display='none'; loadChart(m[0]); } }
  } else if (e.key === 'Escape') { sugEl.style.display = 'none'; }
});
document.addEventListener('click', e => {
  if (!inputEl.contains(e.target) && !sugEl.contains(e.target)) sugEl.style.display = 'none';
});

// Auto-search from nav search (?q=RELIANCE)
const urlQ = new URLSearchParams(window.location.search).get('q');
if (urlQ) {
  inputEl.value = urlQ;
  const results = search(urlQ);
  if (results.length) {
    loadChart(results[0]);
    inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

})();
