const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlPath = 'file:///e:/Disasator/Plan-disaster-risk-platform/public/presentation.html';
const pdfDest = 'e:/Disasator/Plan-disaster-risk-platform/GeoShield_India_Presentation_Deck.pdf';
const publicPdf = 'e:/Disasator/Plan-disaster-risk-platform/public/GeoShield_India_Presentation_Deck.pdf';

console.log('Generating PDF with headless Edge...');
execSync(`"${edgePath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfDest}" "${htmlPath}"`, { stdio: 'inherit' });

fs.copyFileSync(pdfDest, publicPdf);

const stats = fs.statSync(pdfDest);
const mb = (stats.size / (1024 * 1024)).toFixed(2);
console.log(`Generated PDF successfully! Size: ${mb} MB (${stats.size} bytes)`);

if (stats.size <= 4.8 * 1024 * 1024) {
  console.log('SUCCESS: PDF is under 4.8 MB target!');
} else {
  console.log('NOTICE: PDF is still above 4.8 MB target. Needs further optimization.');
}
