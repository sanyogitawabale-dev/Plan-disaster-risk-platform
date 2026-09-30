const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

const htmlPath = 'file:///e:/Disasator/Plan-disaster-risk-platform/public/presentation.html';
const pdfDest = 'e:/Disasator/Plan-disaster-risk-platform/GeoShield_India_Presentation_Deck.pdf';
const publicPdf = 'e:/Disasator/Plan-disaster-risk-platform/public/GeoShield_India_Presentation_Deck.pdf';

console.log(`Using browser: ${browserPath}`);
console.log('Generating PDF with native fonts and high-contrast typography...');

execSync(`"${browserPath}" --headless --disable-gpu --no-pdf-header-footer --run-all-compositor-stages-before-draw --print-to-pdf="${pdfDest}" "${htmlPath}"`, { stdio: 'inherit' });

fs.copyFileSync(pdfDest, publicPdf);
const distPdf = 'e:/Disasator/Plan-disaster-risk-platform/dist/GeoShield_India_Presentation_Deck.pdf';
if (fs.existsSync('e:/Disasator/Plan-disaster-risk-platform/dist')) {
  fs.copyFileSync(pdfDest, distPdf);
}

const stats = fs.statSync(pdfDest);
const mb = (stats.size / (1024 * 1024)).toFixed(2);
const decimalMb = (stats.size / 1000000).toFixed(2);
console.log(`Generated PDF successfully! Size: ${mb} MiB / ${decimalMb} MB (${stats.size} bytes)`);

if (stats.size <= 5.0 * 1024 * 1024) {
  console.log('SUCCESS: PDF is under 5.0 MB target!');
} else {
  console.log('NOTICE: PDF is above 5.0 MB target.');
}
