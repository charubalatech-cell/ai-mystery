const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\Bharathi Prem\\.gemini\\antigravity-ide\\brain\\2f6003c5-90ce-4770-9c86-35a7d039e139';
const destDir = path.join(__dirname, 'client', 'public', 'images');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = [
  { src: 'detective_desk_hero_1792952865107.jpg', dest: 'hero-desk.jpg' },
  { src: 'theme_crime_1792952886727.jpg', dest: 'theme-crime.jpg' },
  { src: 'theme_missing_1792952907561.jpg', dest: 'theme-missing.jpg' },
  { src: 'theme_theft_1792952940875.jpg', dest: 'theme-theft.jpg' },
  { src: 'theme_corporate_1792952977749.jpg', dest: 'theme-corporate.jpg' },
  { src: 'theme_fantasy_1792953016656.jpg', dest: 'theme-fantasy.jpg' },
];

for (const f of files) {
  const s = path.join(srcDir, f.src);
  const d = path.join(destDir, f.dest);
  if (fs.existsSync(s)) {
    fs.copyFileSync(s, d);
    console.log(`Copied ${f.src} -> ${f.dest}`);
  } else {
    console.warn(`Source not found: ${s}`);
  }
}
console.log('Assets successfully copied!');
