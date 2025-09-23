/* script.js
   Usage: include this file (defer) in index.html, ipos_recent.html, ipos_upcoming.html
   It:
   - fetches data from the Apps Script endpoint
   - populates limited tables on index.html
   - populates full tables on ipos_recent.html and ipos_upcoming.html
   - "View More" buttons navigate to the full pages
   - includes retries, timeouts, HTML-escape, and basic error UI
*/

(() => {
  // ===== CONFIG =====
  const API_URL = "https://script.google.com/macros/s/AKfycbxaiHFAvUOfC5gnP49B0yDLXjD-FE-En-guZUFW8b7n4QptLPRKKiJ_u9l2QSKA1l1D/exec";
  const DEFAULT_TIMEOUT = 12000; // ms
  const RETRIES = 2;
  const SHORT_LIMIT = 6; // how many items to show on index (per list)
  // ==================

  // util: safe text (escape)
  function escapeHtml(s) {
    if (s === null || s === undefined) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // util: fetch with timeout + retries
  async function fetchJsonWithRetry(url, retries = RETRIES, timeout = DEFAULT_TIMEOUT) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        const res = await fetch(url, {
          method: "GET",
          signal: controller.signal,
          // Do not send credentials
          headers: {
            "Accept": "application/json"
          }
        });
        clearTimeout(id);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch (e) {
          // In case API returns plain text or trailing chars, try to recover
          return JSON.parse(text.trim());
        }
      } catch (err) {
        if (attempt === retries) throw err;
        // small backoff
        await new Promise(r => setTimeout(r, 800 * (attempt + 1)));
      }
    }
  }

  // UI helpers
  function setTableLoading(tableSelector, message = "Loading...") {
    const t = document.querySelector(tableSelector);
    if (!t) return;
    const tbody = t.querySelector("tbody");
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="${t.querySelectorAll('thead th').length}" style="text-align:center;padding:18px;">${escapeHtml(message)}</td></tr>`;
  }

  function setTableError(tableSelector, message = "Unable to load data") {
    setTableLoading(tableSelector, message);
  }

  // Renderers
  function renderUpcomingShort(list, limit = SHORT_LIMIT) {
    const t = document.querySelector("#upcomingTable tbody");
    if (!t) return;
    t.innerHTML = "";
    const items = Array.isArray(list) ? list.slice(0, limit) : [];
    if (items.length === 0) {
      t.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:18px;">No upcoming IPOs</td></tr>`;
      return;
    }
    items.forEach(it => {
      const name = escapeHtml(it.name || "");
      const open = escapeHtml(it.open || it.listingDate || "");
      const close = escapeHtml(it.close || "");
      const band = escapeHtml(it.priceBand || it.subsTimes || it.mcap || "");
      t.insertAdjacentHTML("beforeend",
        `<tr>
          <td>${name}</td>
          <td>${open}</td>
          <td>${close}</td>
          <td>${band}</td>
        </tr>`);
    });
  }

  function renderRecentShort(list, limit = SHORT_LIMIT) {
    const t = document.querySelector("#recentTable tbody");
    if (!t) return;
    t.innerHTML = "";
    const items = Array.isArray(list) ? list.slice(0, limit) : [];
    if (items.length === 0) {
      t.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:18px;">No recent IPOs</td></tr>`;
      return;
    }
    items.forEach(it => {
      const name = escapeHtml(it.name || "");
      const date = escapeHtml(it.listingDate || it.date || "");
      const ipoPrice = escapeHtml(it.ipoPrice || it.price || it.ipoprice || "");
      const current = escapeHtml(it.currentPrice || it.current || "");
      const change = escapeHtml(it.change || it["% change"] || "");
      t.insertAdjacentHTML("beforeend",
        `<tr>
          <td>${name}</td>
          <td>${date}</td>
          <td>${ipoPrice}</td>
          <td>${current}</td>
          <td>${change}</td>
        </tr>`);
    });
  }

  function renderUpcomingFull(list) {
    const t = document.querySelector("#upcomingTableFull tbody");
    if (!t) return;
    t.innerHTML = "";
    const items = Array.isArray(list) ? list : [];
    if (items.length === 0) {
      t.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:18px;">No upcoming IPOs</td></tr>`;
      return;
    }
    items.forEach(it => {
      const name = escapeHtml(it.name || "");
      const open = escapeHtml(it.open || it.subscriptionPeriod || it.listingDate || "");
      const close = escapeHtml(it.close || "");
      const band = escapeHtml(it.priceBand || it.subsTimes || it.mcap || "");
      t.insertAdjacentHTML("beforeend",
        `<tr>
          <td>${name}</td>
          <td>${open}</td>
          <td>${close}</td>
          <td>${band}</td>
        </tr>`);
    });
  }

  function renderRecentFull(list) {
    const t = document.querySelector("#recentTableFull tbody");
    if (!t) return;
    t.innerHTML = "";
    const items = Array.isArray(list) ? list : [];
    if (items.length === 0) {
      t.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:18px;">No recent IPOs</td></tr>`;
      return;
    }
    items.forEach(it => {
      const name = escapeHtml(it.name || "");
      const date = escapeHtml(it.listingDate || it.date || "");
      const ipoPrice = escapeHtml(it.ipoPrice || it.price || "");
      const current = escapeHtml(it.currentPrice || it.current || "");
      const change = escapeHtml(it.change || it["% change"] || "");
      t.insertAdjacentHTML("beforeend",
        `<tr>
          <td>${name}</td>
          <td>${date}</td>
          <td>${ipoPrice}</td>
          <td>${current}</td>
          <td>${change}</td>
        </tr>`);
    });
  }

  // Page detection & mount
  async function mount() {
    // Add click handlers for "View More" buttons (if present)
    const btnMoreU = document.getElementById("viewMoreUpcoming");
    if (btnMoreU) {
      btnMoreU.addEventListener("click", () => {
        location.href = "ipos_upcoming.html";
      });
    }
    const btnMoreR = document.getElementById("viewMoreRecent");
    if (btnMoreR) {
      btnMoreR.addEventListener("click", () => {
        location.href = "ipos_recent.html";
      });
    }

    // Determine whether we're on index.html (has #upcoming or #recent tables)
    const hasIndexShort = !!document.querySelector("#upcomingTable") || !!document.querySelector("#recentTable");
    const hasUpcomingFull = !!document.querySelector("#upcomingTableFull");
    const hasRecentFull = !!document.querySelector("#recentTableFull");

    // Show loading placeholders
    if (hasIndexShort) {
      setTableLoading("#upcomingTable");
      setTableLoading("#recentTable");
    }
    if (hasUpcomingFull) setTableLoading("#upcomingTableFull");
    if (hasRecentFull) setTableLoading("#recentTableFull");

    // fetch once
    try {
      const data = await fetchJsonWithRetry(API_URL, RETRIES, DEFAULT_TIMEOUT);
      // expected shape: { news, picks, movers, ipos_recent, ipos_upcoming }
      const upcoming = data.ipos_upcoming || data.upcoming || [];
      const recent = data.ipos_recent || data.recent || [];

      if (hasIndexShort) {
        try {
          renderUpcomingShort(upcoming);
          renderRecentShort(recent);
        } catch (e) {
          setTableError("#upcomingTable", "Render error");
          setTableError("#recentTable", "Render error");
          console.error(e);
        }
      }

      if (hasUpcomingFull) {
        try {
          renderUpcomingFull(upcoming);
        } catch (e) {
          setTableError("#upcomingTableFull", "Render error");
          console.error(e);
        }
      }

      if (hasRecentFull) {
        try {
          renderRecentFull(recent);
        } catch (e) {
          setTableError("#recentTableFull", "Render error");
          console.error(e);
        }
      }
    } catch (err) {
      console.error("Failed to load API:", err);
      if (hasIndexShort) {
        setTableError("#upcomingTable", "Failed to load data");
        setTableError("#recentTable", "Failed to load data");
      }
      if (hasUpcomingFull) setTableError("#upcomingTableFull", "Failed to load data");
      if (hasRecentFull) setTableError("#recentTableFull", "Failed to load data");
    }
  }

  // run when DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
