# 📈 SRJahir Tech — Indian Stock Market Portal

**Live Indian stock market data, simplified.**

🔗 **[stocks.srjahir.in](https://stocks.srjahir.in)**

---

## Features

- **Live Market Indices** — Nifty 50, Sensex, Bank Nifty, Nifty IT, Auto, Pharma (GOOGLEFINANCE)
- **Top Movers** — Today's top gainers & losers with live price and change%
- **Most Active** — Highest trading volume stocks on NSE/BSE
- **IPO Calendar** — Upcoming & recently listed IPOs with price band, dates, issue size
- **Stock Picks** — Curated market recommendations from ET & expert views
- **Pre-Market Data** — Pre-open session data for Nifty 50 components
- **Market News** — Latest stock market news from Economic Times
- **SIP Calculator** — Monthly SIP returns calculator with charts
- **F&O Expiry** — Futures & Options expiry calendar
- **Sector Analysis** — Nifty sector-wise performance via TradingView
- **Portfolio Tracker** — Track your holdings (local storage)
- **Stock Chart Search** — Search any stock, view TradingView charts
- **15 Educational Articles** — Beginner guides on Nifty 50, IPOs, SIP, Demat, F&O, tax and more
- **PWA Support** — Install as app on mobile/desktop

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, JavaScript (vanilla) |
| Hosting | GitHub Pages |
| Data Backend | Google Apps Script + Google Sheets |
| Live Prices | GOOGLEFINANCE formulas (70 Nifty 50 + popular stocks) |
| Proxy API | Node.js on Render (news, IPOs, picks) |
| Charts | TradingView embeds |
| Analytics | Google Analytics (G-FJGKC63PF4) |
| Theme | Terminal Noir (dark mode) |

## Data Sources

| Data | Source |
|------|--------|
| Indices | GOOGLEFINANCE |
| Movers (Price, Change%) | GOOGLEFINANCE via StockMaster sheet |
| Most Active (Volume) | GOOGLEFINANCE |
| News | Economic Times RSS |
| IPOs | Moneycontrol embedded JSON |
| Picks | ET Recommendations + Expert Views RSS |
| Pre-Market | Moneycontrol pre-open |
| Charts | TradingView |

## Project Structure

```
stocks-site/
├── index.html              # Home — indices, news, movers, IPOs, picks
├── news.html               # All market news
├── movers.html             # Top gainers & losers
├── most-active.html        # Most active by volume
├── premarket.html          # Pre-open session data
├── picks.html              # Stock picks & recommendations
├── ipos_upcoming.html      # Upcoming IPOs
├── ipos_recent.html        # Recently listed IPOs
├── calculator.html         # SIP calculator
├── fno.html                # F&O expiry calendar
├── sectors.html            # Sector analysis
├── portfolio.html          # Portfolio tracker
├── stock.html              # Individual stock chart
├── articles.html           # Articles listing
├── articles/               # 15 educational articles
├── about.html
├── contact.html
├── privacy.html
├── terms.html
├── disclaimer.html
├── 404.html
├── assets/
│   ├── css/style.css       # Terminal Noir theme
│   ├── js/common.js        # API URL, utilities, pagination
│   ├── js/shared.js        # Nav, footer, indices, theme
│   ├── js/search.js        # Stock search with autocomplete
│   └── js/common.security.js
├── favicon/
├── sw.js                   # Service Worker
├── manifest.json           # PWA manifest
├── sitemap.xml             # 34 URLs
├── robots.txt
└── CNAME                   # stocks.srjahir.in
```

## How It Works

1. **Google Sheets** has a "StockMaster" tab with GOOGLEFINANCE formulas for 70 stocks
2. **Apps Script** reads prices/change% from StockMaster, sorts and writes to GainersLosers/MostActive sheets
3. **Apps Script** also fetches news, IPOs, picks from the proxy API (Render)
4. **Apps Script trigger** runs every 15-30 minutes to keep data fresh
5. **Frontend** calls the deployed Apps Script web app URL to get all data as JSON
6. **GitHub Pages** serves the static site at stocks.srjahir.in

## Setup

### Prerequisites
- Google account with Apps Script access
- GitHub account
- Render account (for proxy, free tier)
- GoDaddy/any DNS for custom domain

### Quick Start

1. **Google Sheet** — Create sheet with ID in Code.gs, add Indices tab with GOOGLEFINANCE
2. **Apps Script** — Paste Code.gs, run `setupStockMaster()` once, then `fetchAllData()`
3. **Deploy Apps Script** — Deploy as Web App (Anyone, Execute as Me)
4. **Update API URL** — Paste deployed URL in `assets/js/common.js`
5. **GitHub Pages** — Push code, enable Pages, set custom domain
6. **Trigger** — Set time-driven trigger for `fetchAllData` every 15 min

## Disclaimer

All information on this website is for **educational and informational purposes only**. It does not constitute financial advice. Market data is sourced from third-party providers and may be delayed up to 20 minutes. Always do your own research and consult a registered financial advisor before investing.

## Author

**Suraj Ahir** — [SRJahir Tech](https://srjahir.in)

📧 surajmaitra1996@gmail.com

---

© 2026 SRJahir Tech — [stocks.srjahir.in](https://stocks.srjahir.in)
