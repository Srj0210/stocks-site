// =====================================================
// SRJahir Tech Stocks — shared.js
// Nav injection + Yahoo Finance indices + utilities
// =====================================================

// ===== INJECT NAV =====
function injectNav(activePage) {
  const nav = document.createElement('nav');
  nav.className = 'site-nav';
  nav.innerHTML = `
    <div class="nav-inner">
      <a href="index.html" class="nav-brand">
        <img src="assets/images/favicon-bull.png" alt="Stocks SRJahir" />
        <span class="nav-brand-text">SRJahir <span>Stocks</span></span>
      </a>
      <ul class="nav-links">
        <li><a href="index.html" ${activePage==='home'?'class="active"':''}>Home</a></li>
        <li><a href="news.html" ${activePage==='news'?'class="active"':''}>News</a></li>
        <li><a href="ipos_upcoming.html" ${activePage==='ipos'?'class="active"':''}>IPOs</a></li>
        <li><a href="movers.html" ${activePage==='movers'?'class="active"':''}>Movers</a></li>
        <li><a href="picks.html" ${activePage==='picks'?'class="active"':''}>Picks</a></li>
        <li><a href="portfolio.html" ${activePage==='portfolio'?'class="active"':''}>Portfolio</a></li>
        <li><a href="fno.html" ${activePage==='fno'?'class="active"':''}>F&amp;O</a></li>
        <li><a href="calculator.html" ${activePage==='calc'?'class="active"':''}>Calculator</a></li>
        <li><a href="sectors.html" ${activePage==='sectors'?'class="active"':''}>Sectors</a></li>
        <li><a href="articles.html" ${activePage==='articles'?'class="active"':''}>Learn</a></li>
      </ul>
      <div class="nav-right">
        <input class="nav-search" type="text" placeholder="🔍 Search stocks..." id="navSearch" onkeydown="if(event.key==='Enter'){window.location='index.html?q='+encodeURIComponent(this.value)}" />
        
        <button class="hamburger" onclick="toggleMobileNav()">☰</button>
      </div>
    </div>
    <div id="mobileNav" style="display:none; padding: 0.5rem 1.5rem 1rem; border-top:1px solid var(--border);">
      <a href="index.html" style="display:block;padding:10px 0;color:var(--text-secondary);text-decoration:none;border-bottom:1px solid var(--border)">Home</a>
      <a href="news.html" style="display:block;padding:10px 0;color:var(--text-secondary);text-decoration:none;border-bottom:1px solid var(--border)">News</a>
      <a href="ipos_upcoming.html" style="display:block;padding:10px 0;color:var(--text-secondary);text-decoration:none;border-bottom:1px solid var(--border)">IPOs</a>
      <a href="movers.html" style="display:block;padding:10px 0;color:var(--text-secondary);text-decoration:none;border-bottom:1px solid var(--border)">Movers</a>
      <a href="picks.html" style="display:block;padding:10px 0;color:var(--text-secondary);text-decoration:none;border-bottom:1px solid var(--border)">Picks</a>
      <a href="portfolio.html" style="display:block;padding:10px 0;color:var(--text-secondary);text-decoration:none;border-bottom:1px solid var(--border)">Portfolio</a>
      <a href="fno.html" style="display:block;padding:10px 0;color:var(--text-secondary);text-decoration:none;border-bottom:1px solid var(--border)">F&amp;O</a>
      <a href="calculator.html" style="display:block;padding:10px 0;color:var(--text-secondary);text-decoration:none;border-bottom:1px solid var(--border)">Calculator</a>
      <a href="sectors.html" style="display:block;padding:10px 0;color:var(--text-secondary);text-decoration:none;border-bottom:1px solid var(--border)">Sectors</a>
      <a href="articles.html" style="display:block;padding:10px 0;color:var(--text-secondary);text-decoration:none;border-bottom:1px solid var(--border)">Learn</a>
      <a href="about.html" style="display:block;padding:10px 0;color:var(--text-secondary);text-decoration:none;border-bottom:1px solid var(--border)">About</a>
      <a href="privacy.html" style="display:block;padding:10px 0;color:var(--text-secondary);text-decoration:none">Privacy</a>
    </div>
  `;
  document.body.insertBefore(nav, document.body.firstChild);
}

function toggleMobileNav() {
  const mn = document.getElementById('mobileNav');
  if (mn) mn.style.display = mn.style.display === 'none' ? 'block' : 'none';
}

// ===== INJECT FOOTER =====
function injectFooter() {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="footer-inner">
      <a href="https://srjahir.in" target="_blank" rel="noopener noreferrer" class="footer-brand">
        <img src="assets/images/logo.png" alt="SRJahir Tech" />
        <span class="footer-brand-name">SRJahir<span>Tech</span></span>
      </a>
      <div class="footer-links">
        <a href="index.html">Live Market</a>
        <a href="news.html">Market News</a>
        <a href="ipos_upcoming.html">Upcoming IPOs</a>
        <a href="ipos_recent.html">Recent IPOs</a>
        <a href="movers.html">Top Gainers Losers</a>
        <a href="picks.html">Stock Picks</a>
        <a href="calculator.html">SIP Calculator</a>
        <a href="fno.html">F&amp;O Expiry</a>
        <a href="sectors.html">Sector Analysis</a>
        <a href="portfolio.html">Portfolio Tracker</a>
        <a href="articles.html">Learn Stock Market</a>
      </div>
      <div class="footer-links" style="margin-top:0.5rem">
        <a href="about.html">About</a>
        <a href="contact.html">Contact</a>
        <a href="privacy.html">Privacy Policy</a>
        <a href="terms.html">Terms</a>
        <a href="disclaimer.html">Disclaimer</a>
        <a href="https://srjahir.in" target="_blank" rel="noopener noreferrer">SRJahir Tech</a>
      </div>
      <div style="font-size:0.78rem;color:var(--text-muted);margin:0.8rem auto;line-height:1.6;max-width:700px;text-align:center">
        <strong style="color:var(--text-secondary)">stocks.srjahir.in</strong> — Live Nifty 50, Sensex, Bank Nifty indices. 
        Top gainers and losers today on NSE BSE. Upcoming IPO calendar 2026. 
        Free SIP calculator. F&amp;O expiry dates. Indian stock market sector analysis.
      </div>
      <div class="footer-copy" style="text-align:center">© 2026 SRJahir Tech — stocks.srjahir.in</div>
      <p class="footer-disclaimer" style="text-align:center">
        Data is for educational and informational purposes only. Market data from third-party sources.
        Not financial advice. Accuracy not guaranteed.
        <a href="mailto:surajmaitra1996@gmail.com" style="color:var(--gold)">surajmaitra1996@gmail.com</a>
      </p>
    </div>
  `;
  document.body.appendChild(footer);
}

// ===== THEME (dark only) =====
function applyTheme() {
  // Clear any old light-mode setting
  localStorage.removeItem('srj-theme');
  document.documentElement.classList.remove('light-mode');
}

function toggleTheme() {
  // Dark mode only - no toggle
  console.log('Dark mode only');
}

// ===== MARKET STATUS =====
function getMarketStatus() {
  const now = new Date();
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const day = ist.getDay();
  const h = ist.getHours(), m = ist.getMinutes();
  const mins = h * 60 + m;
  if (day === 0 || day === 6) return 'closed';
  return (mins >= 555 && mins <= 930) ? 'open' : 'closed';
}

// ===== LIVE INDICES via TradingView Single Quote =====
// Works always: market open, closed, mobile, desktop - no proxy needed
// ===== INDICES via Google Sheets GOOGLEFINANCE =====
const INDEX_CHART_MAP = {
  'NIFTY 50':'BSE:RELIANCE','SENSEX':'BSE:SENSEX',
  'BANK NIFTY':'BSE:HDFCBANK','NIFTY IT':'BSE:TCS',
  'NIFTY AUTO':'BSE:MARUTI','NIFTY PHARMA':'BSE:SUNPHARMA',
};
const DEFAULT_INDICES = ['NIFTY 50','SENSEX','BANK NIFTY','NIFTY IT','NIFTY AUTO','NIFTY PHARMA'];

function loadIndicesCards(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem';

  DEFAULT_INDICES.forEach(name => {
    const card = document.createElement('div');
    card.className = 'index-card';
    card.id = 'idx_' + name.replace(/\s/g,'_');
    card.style.cursor = 'pointer';
    card.onclick = () => openIndexChart(name, INDEX_CHART_MAP[name] || 'BSE:SENSEX');
    card.innerHTML = `
      <div class="index-name">${name} <span style="font-size:0.65rem;color:var(--gold)">▶ Chart</span></div>
      <div class="skeleton" style="height:1.8rem;width:70%;border-radius:6px;margin:8px 0"></div>
      <div class="skeleton" style="height:0.9rem;width:50%;border-radius:4px"></div>`;
    container.appendChild(card);
  });

  // Fetch from Google Sheets backend (includes indices from GOOGLEFINANCE)
  fetch(API_URL)
    .then(r => r.json())
    .then(data => {
      const indices = data.indices || [];
      if (!indices.length) { showNACards(); return; }
      indices.forEach(idx => {
        const card = document.getElementById('idx_' + (idx.name||'').replace(/\s/g,'_'));
        if (!card) return;
        const price = parseFloat(idx.price);
        const pct = parseFloat(idx.changePct) || 0;
        const dir = pct >= 0 ? 'up' : 'down';
        const sign = pct >= 0 ? '+' : '';
        if (!price) {
          card.innerHTML = `<div class="index-name">${idx.name}</div>
            <div class="index-value" style="color:var(--text-muted)">N/A</div>`;
          return;
        }
        card.className = `index-card ${dir}`;
        card.innerHTML = `
          <div class="index-name">${idx.name} <span style="font-size:0.65rem;color:var(--gold)">▶ Chart</span></div>
          <div class="index-value">${price.toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
          <div class="index-change ${dir}">${sign}${pct.toFixed(2)}%</div>
          <div class="index-time">Google Finance</div>`;
      });
    })
    .catch(showNACards);

  function showNACards() {
    DEFAULT_INDICES.forEach(name => {
      const card = document.getElementById('idx_' + name.replace(/\s/g,'_'));
      if (card) card.innerHTML = `
        <div class="index-name">${name}</div>
        <div class="index-value" style="color:var(--text-muted)">N/A</div>
        <div style="font-size:0.7rem;color:var(--gold)">▶ Click for chart</div>`;
    });
  }
}


// ===== INDEX CHART MODAL =====
function openIndexChart(name, symbol) {
  // Remove existing modal
  const existing = document.getElementById('idx-chart-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'idx-chart-modal';
  modal.style.cssText = `
    position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;
    background:rgba(0,0,0,0.85);display:flex;align-items:center;
    justify-content:center;padding:1rem;backdrop-filter:blur(4px);
  `;
  modal.innerHTML = `
    <div style="background:var(--bg-secondary);border:1px solid var(--border);border-radius:16px;
      width:100%;max-width:1000px;max-height:90vh;overflow:hidden;display:flex;flex-direction:column">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;
        border-bottom:1px solid var(--border)">
        <div style="font-weight:700;font-size:1rem;color:var(--text-primary)">${name} — Live Chart</div>
        <div style="font-size:0.72rem;color:var(--text-muted);margin-top:2px" id="chart-subtitle-label"></div>
        <button onclick="document.getElementById('idx-chart-modal').remove()"
          style="background:var(--bg-card);border:1px solid var(--border);color:var(--text-primary);
          width:34px;height:34px;border-radius:8px;cursor:pointer;font-size:1.1rem;
          display:flex;align-items:center;justify-content:center">✕</button>
      </div>
      <div id="idx-chart-container" style="flex:1;height:500px;min-height:400px"></div>
    </div>`;

  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });

  // Load TradingView widget
  // Show subtitle info
  const proxyLabels = {
    'BSE:HDFCBANK': 'Top holding: HDFC Bank',
    'BSE:TCS':      'Top holding: TCS',
    'BSE:MARUTI':   'Top holding: Maruti Suzuki',
    'BSE:SUNPHARMA':'Top holding: Sun Pharma',
  };
  const subtitleEl = document.getElementById('chart-subtitle-label');
  if (subtitleEl) subtitleEl.textContent = proxyLabels[symbol] || '';

  setTimeout(() => {
    if (window.TradingView) {
      const id = 'idx-tv-' + Date.now();
      document.getElementById('idx-chart-container').id = id;
      new TradingView.widget({
        container_id: id,
        symbol: symbol,
        interval: 'D',
        timezone: 'Asia/Kolkata',
        theme: 'dark',
        style: '1',
        locale: 'en',
        allow_symbol_change: false,
        autosize: true,
        hide_top_toolbar: false,
        backgroundColor: 'rgba(13,14,26,1)',
      });
    } else {
      document.getElementById('idx-chart-container').innerHTML =
        '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted)">TradingView loading...</div>';
    }
  }, 200);
}
