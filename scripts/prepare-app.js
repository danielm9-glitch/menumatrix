const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
for (const file of ['index.html', 'app.js', 'styles.css', 'training.js', 'training.css']) {
  fs.copyFileSync(path.join(root, file), path.join(root, 'web-release', file));
}
console.log('Web and native app sources synchronized.');
