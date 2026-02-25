const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = 3000;
const FILE = path.join(__dirname, 'presentation.html');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  fs.createReadStream(FILE).pipe(res);
});

server.listen(PORT, () => {
  console.log('\n🚀  Presentation server running!');
  console.log(`    Open: http://localhost:${PORT}\n`);
  console.log('    Keyboard shortcuts:');
  console.log('      → / Space   Next slide');
  console.log('      ←           Previous slide');
  console.log('      F           Fullscreen');
  console.log('      S           Speaker notes');
  console.log('      O           Slide overview');
  console.log('      Esc         Exit fullscreen\n');
  console.log('    Press Ctrl+C to stop the server.\n');
});
