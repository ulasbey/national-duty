/**
 * update_logo_paths.cjs
 *
 * download_logos.cjs çalıştıktan sonra çalıştır.
 * FootballPitch.jsx'teki Wikipedia URL'lerini /logos/domain.ext ile değiştirir.
 *
 * Çalıştırma: node scripts/update_logo_paths.cjs
 */

const fs   = require('fs');
const path = require('path');

const jsxPath    = path.join(__dirname, '..', 'src', 'components', 'FootballPitch.jsx');
const extMapPath = path.join(__dirname, 'domain_ext_map.json');

if (!fs.existsSync(extMapPath)) {
  console.error('domain_ext_map.json bulunamadı. Önce download_logos.cjs çalıştır!');
  process.exit(1);
}

const domainExtMap = JSON.parse(fs.readFileSync(extMapPath, 'utf8'));
let jsx = fs.readFileSync(jsxPath, 'utf8');

// WP sabitini ve mevcut kullanımlarını değiştir
// Önce "WP + 'filename'" → "/logos/domain.ext"
// Sonra "WP = ..." satırını kaldır/comment et

let replaced = 0;

// Satır bazında işle
const lines = jsx.split('\n');
const newLines = lines.map(line => {
  // const WP = ... satırını koru ama comment yap
  if (/^\s*const WP\s*=/.test(line)) {
    return line; // değiştirme
  }

  // 'domain': WP + 'filename.svg', şeklindeki satırları bul
  const m = line.match(/^(\s*)'([^']+)':\s*WP \+ '([^']+)',(.*)$/);
  if (m) {
    const [, indent, domain, , rest] = m;
    if (domainExtMap[domain]) {
      const ext      = domainExtMap[domain];
      const safeName = domain.replace(/[^a-z0-9._-]/gi, '_');
      replaced++;
      return `${indent}'${domain}': '/logos/${safeName}.${ext}',${rest}`;
    }
  }

  // 'domain': 'https://...', şeklindeki düz URL'leri bul
  const m2 = line.match(/^(\s*)'([^']+)':\s*'(https?[^']+)',(.*)$/);
  if (m2) {
    const [, indent, domain, , rest] = m2;
    if (domainExtMap[domain]) {
      const ext      = domainExtMap[domain];
      const safeName = domain.replace(/[^a-z0-9._-]/gi, '_');
      replaced++;
      return `${indent}'${domain}': '/logos/${safeName}.${ext}',${rest}`;
    }
  }

  return line;
});

jsx = newLines.join('\n');

// Artık WP sabiti kullanılmıyorsa kaldır
if (!jsx.includes('WP +')) {
  jsx = jsx.replace(/\nconst WP\s*=\s*'[^']+';?\n/, '\n');
}

fs.writeFileSync(jsxPath, jsx);

console.log(`FootballPitch.jsx güncellendi: ${replaced} URL lokal yola dönüştürüldü.`);
console.log(`WP + kullanımı kaldı mı: ${jsx.includes('WP +') ? 'EVET (bunlar indirilemeyenler)' : 'Hayır — tam'}`);
console.log('\nBuild almayı unutma: npm run build');
