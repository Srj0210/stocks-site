// ===== API URL =====
const API_URL = "https://script.google.com/macros/s/AKfycby-VuqKc03bVz8OKCscnLZYsXX0RXcISFqVdXlp5BE7s4sXXIb9kw6bA1JuHFyT6u9R/exec";

// ===== Google Analytics =====
(function addAnalytics() {
  const GA_ID = "G-FJGKC63PF4"; // apna GA ID yaha daalna
  if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
    const gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(gaScript);

    gaScript.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag(){ dataLayer.push(arguments); }
      gtag("js", new Date());
      gtag("config", GA_ID);
      console.log("✅ Google Analytics Loaded");
    };
  }
})();