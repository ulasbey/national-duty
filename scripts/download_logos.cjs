/**
 * download_logos.cjs
 *
 * LOGO_MAP'teki her Wikipedia URL'sini gerçek dosyaya indirip
 * public/logos/{domain}.svg (veya .png) olarak kaydeder.
 *
 * Çalıştırma: node scripts/download_logos.cjs
 */

const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');

// ── 1. LOGO_MAP'i FootballPitch.jsx'ten parse et ───────────────────────────
const jsxPath = path.join(__dirname, '..', 'src', 'components', 'FootballPitch.jsx');
const jsx     = fs.readFileSync(jsxPath, 'utf8');

// WP sabiti
const wpMatch = jsx.match(/const WP\s*=\s*['"](.+?)['"]/);
const WP      = wpMatch ? wpMatch[1] : 'https://en.wikipedia.org/wiki/Special:FilePath/';

// Tüm domain → url satırlarını çek
const logoMap = {};
const lineRe  = /^\s*'([^']+)':\s*(?:WP \+ '([^']+)'|'(https?[^']+)')/gm;
let m;
while ((m = lineRe.exec(jsx)) !== null) {
  const domain   = m[1];
  const fileName = m[2]; // WP + 'filename' şeklindeyse
  const fullUrl  = m[3]; // düz URL ise
  if (fileName) logoMap[domain] = WP + fileName;
  else if (fullUrl) logoMap[domain] = fullUrl;
}

const totalDomains = Object.keys(logoMap).length;
console.log(`LOGO_MAP'te ${totalDomains} domain bulundu.\n`);

// ── 2. public/logos/ klasörünü oluştur ─────────────────────────────────────
const outDir = path.join(__dirname, '..', 'public', 'logos');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// ── 3. Sonuç dosyaları ─────────────────────────────────────────────────────
const successFile = path.join(__dirname, 'logos_ok.txt');
const failFile    = path.join(__dirname, 'logos_fail.txt');
fs.writeFileSync(successFile, '');
fs.writeFileSync(failFile,    '');

// ── 4. HTTP follow-redirect indirici ───────────────────────────────────────
function downloadUrl(url, maxRedirects = 10) {
  return new Promise((resolve, reject) => {
    const attempt = (u, remaining) => {
      if (remaining <= 0) return reject(new Error('Too many redirects: ' + url));
      const lib = u.startsWith('https') ? https : http;
      const req = lib.get(u, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NationalDutyLogoBot/1.0)' },
        timeout: 15000
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const next = res.headers.location.startsWith('http')
            ? res.headers.location
            : new URL(res.headers.location, u).href;
          res.resume();
          return attempt(next, remaining - 1);
        }
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`HTTP ${res.statusCode} for ${u}`));
        }
        const contentType = res.headers['content-type'] || '';
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => resolve({ buffer: Buffer.concat(chunks), contentType, finalUrl: u }));
        res.on('error', reject);
      });
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('Timeout: ' + u)); });
    };
    attempt(url, maxRedirects);
  });
}

// Content-type → dosya uzantısı
function getExt(contentType, finalUrl) {
  if (contentType.includes('svg'))  return 'svg';
  if (contentType.includes('png'))  return 'png';
  if (contentType.includes('jpeg') || contentType.includes('jpg')) return 'jpg';
  if (contentType.includes('webp')) return 'webp';
  // URL'den tahmin et
  const u = finalUrl.toLowerCase();
  if (u.includes('.svg')) return 'svg';
  if (u.includes('.png')) return 'png';
  if (u.includes('.jpg') || u.includes('.jpeg')) return 'jpg';
  return 'svg'; // varsayılan
}

// ── 5. Sıralı indirme (Wikipedia rate limit aşmamak için) ─────────────────
const CONCURRENCY = 5; // paralel istek sayısı
const domains     = Object.keys(logoMap);
const results     = { ok: 0, fail: 0 };
const domainExtMap = {}; // domain → 'svg'|'png' (FootballPitch.jsx güncellemesi için)

async function downloadBatch(batch) {
  return Promise.allSettled(
    batch.map(async (domain) => {
      const url = logoMap[domain];
      try {
        const { buffer, contentType, finalUrl } = await downloadUrl(url);
        const ext      = getExt(contentType, finalUrl);
        const filename = domain.replace(/[^a-z0-9._-]/gi, '_') + '.' + ext;
        const filePath = path.join(outDir, filename);
        fs.writeFileSync(filePath, buffer);
        domainExtMap[domain] = ext;
        results.ok++;
        fs.appendFileSync(successFile, `${domain} → ${filename}\n`);
        return { domain, ok: true, filename };
      } catch (err) {
        results.fail++;
        fs.appendFileSync(failFile, `${domain} | ${url} | ${err.message}\n`);
        return { domain, ok: false, err: err.message };
      }
    })
  );
}

async function main() {
  console.log('İndirme başlıyor...\n');
  let done = 0;

  for (let i = 0; i < domains.length; i += CONCURRENCY) {
    const batch   = domains.slice(i, i + CONCURRENCY);
    const settled = await downloadBatch(batch);

    settled.forEach(r => {
      const v = r.value || {};
      done++;
      const icon = v.ok ? '✓' : '✗';
      const info = v.ok ? v.filename : v.err;
      process.stdout.write(`[${done}/${totalDomains}] ${icon} ${v.domain || '?'} — ${info}\n`);
    });

    // Wikipedia'ya saygı için kısa bekleme
    if (i + CONCURRENCY < domains.length) {
      await new Promise(r => setTimeout(r, 150));
    }
  }

  console.log(`\n─────────────────────────────────────`);
  console.log(`✓ Başarılı : ${results.ok}`);
  console.log(`✗ Başarısız: ${results.fail}`);
  console.log(`─────────────────────────────────────`);
  console.log(`Başarılı logolar : scripts/logos_ok.txt`);
  if (results.fail > 0)
    console.log(`Başarısız logolar: scripts/logos_fail.txt`);

  // domainExtMap'i JSON olarak kaydet (sonraki adım için)
  fs.writeFileSync(
    path.join(__dirname, 'domain_ext_map.json'),
    JSON.stringify(domainExtMap, null, 2)
  );
  console.log(`\nExt map kaydedildi: scripts/domain_ext_map.json`);
  console.log(`\nSONRAKİ ADIM: node scripts/update_logo_paths.cjs`);
}

main().catch(console.error);
