import fs from 'fs';
import path from 'path';

const fileContent = fs.readFileSync('template design eccomerce/src/app/App.tsx', 'utf8');
const lines = fileContent.split('\n');

console.log('Total lines:', lines.length);

// Let's search for keywords and print matching lines
const keywords = ['discover', 'explore', 'promo', 'carousel', 'slider', 'comprar', 'guia', 'novedades', 'banner', 'anuncio', 'aviso', 'destacado', 'hero'];

keywords.forEach(word => {
  const matches = [];
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes(word)) {
      matches.push({ lineNum: idx + 1, content: line.trim().slice(0, 100) });
    }
  });
  console.log(`Keyword "${word}": ${matches.length} matches. First few:`);
  matches.slice(0, 5).forEach(m => console.log(`  Line ${m.lineNum}: ${m.content}`));
});
