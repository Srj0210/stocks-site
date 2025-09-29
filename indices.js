// indices.js

document.addEventListener("DOMContentLoaded", () => {
  // Sample demo chart - NIFTY
  const niftyCtx = document.getElementById("niftyChart").getContext("2d");
  new Chart(niftyCtx, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      datasets: [{
        label: "Nifty 50",
        data: [20000, 20100, 19950, 20200, 20300],
        borderColor: "blue",
        backgroundColor: "rgba(0,0,255,0.2)",
        fill: true,
        tension: 0.4
      }]
    }
  });

  // Sample demo chart - DOW JONES
  const dowCtx = document.getElementById("dowChart").getContext("2d");
  new Chart(dowCtx, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      datasets: [{
        label: "Dow Jones",
        data: [34000, 34200, 34100, 34350, 34400],
        borderColor: "green",
        backgroundColor: "rgba(0,255,0,0.2)",
        fill: true,
        tension: 0.4
      }]
    }
  });
});