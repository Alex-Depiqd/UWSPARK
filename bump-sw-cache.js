// bump-sw-cache.js
const fs = require('fs');
const path = require('path');

const swPath = path.join(__dirname, 'sw.js');
const hash = Date.now(); // You can use a git hash or any unique string

let swContent = fs.readFileSync(swPath, 'utf8');
swContent = swContent.replace(
  /CACHE_NAME = \"spark-cache-.*?\";/,
  `CACHE_NAME = "spark-cache-${hash}";`
);
fs.writeFileSync(swPath, swContent);

console.log(`Updated sw.js cache name to spark-cache-${hash}`); 