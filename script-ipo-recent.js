<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Recent IPOs - srjahir.in</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 text-white">

  <div class="p-4">
    <a href="index.html" class="text-blue-400">← Back</a>
    <h1 class="text-2xl font-bold mb-4">Recent IPOs</h1>
    <input id="searchBox" type="text" placeholder="Search IPOs..." class="w-full p-2 mb-4 text-black rounded">

    <table class="w-full border text-sm">
      <thead class="bg-gray-700">
        <tr>
          <th class="border px-2 py-1">Name</th>
          <th class="border px-2 py-1">Issue Type</th>
          <th class="border px-2 py-1">Price Band</th>
          <th class="border px-2 py-1">Open Date</th>
          <th class="border px-2 py-1">Close Date</th>
          <th class="border px-2 py-1">Issue Size</th>
        </tr>
      </thead>
      <tbody id="ipoRecentList">
        <tr><td colspan="6" class="text-center p-4">⏳ Data is loading...</td></tr>
      </tbody>
    </table>
    <div id="pagination" class="flex justify-center mt-4"></div>

    <p class="text-xs text-gray-400 mt-10 text-center">
      Disclaimer: This website and its data are for educational purposes only. All rights reserved by respective owners.
    </p>
  </div>

  <script src="common.js"></script>
  <script src="script-ipos_recent.js"></script>
</body>
</html>