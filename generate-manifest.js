// node generate-manifest.js
// Generates games.json from ./files/**/logo.png
const fs = require('fs');
const path = require('path');

const filesDir = path.join(__dirname, 'files');
const output = path.join(__dirname, 'games.json');

const games = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      const logo = path.join(full, 'logo.png');
      const index = path.join(full, 'index.html');
      if (fs.existsSync(logo) && fs.existsSync(index)) {
        const folder = path.relative(filesDir, full);
        const title = folder
          .split('_')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        games.push({ folder, title });
      }
      walk(full);
    }
  }
}

walk(filesDir);

fs.writeFileSync(output, JSON.stringify(games, null, 2));
console.log(`Manifest written: ${games.length} games`);