/**
 * Finds Wikipedia logo URLs for clubs missing from LOGO_MAP.
 * Tries multiple filename patterns for each club, verifies with HTTP.
 * Run: node scripts/find_missing_logos.js > scripts/found_logos.txt
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/national_teams.json'), 'utf8'));
const pitchContent = fs.readFileSync(path.join(__dirname, '../src/components/FootballPitch.jsx'), 'utf8');

// Extract existing LOGO_MAP keys
const logoMapMatch = pitchContent.match(/const LOGO_MAP = \{([\s\S]*?)\};/);
const logoMapKeys = new Set();
if (logoMapMatch) {
  for (const m of logoMapMatch[1].matchAll(/'([^']+)':/g)) logoMapKeys.add(m[1]);
}

// Build domain -> club name map
const domainToClub = {};
data.forEach(team => {
  team.players.forEach(p => {
    if (p.clubDomain && p.club && !logoMapKeys.has(p.clubDomain))
      domainToClub[p.clubDomain] = p.club;
  });
});

const missing = Object.entries(domainToClub).sort((a, b) => a[1].localeCompare(b[1]));

function sanitize(name) {
  return name
    .replace(/ñ/g, 'n').replace(/é/g, 'e').replace(/è/g, 'e').replace(/ê/g, 'e')
    .replace(/á/g, 'a').replace(/à/g, 'a').replace(/â/g, 'a')
    .replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u')
    .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ä/g, 'a')
    .replace(/ç/g, 'c').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ı/g, 'i')
    .replace(/ő/g, 'o').replace(/ů/g, 'u').replace(/ź/g, 'z').replace(/ł/g, 'l')
    .replace(/ż/g, 'z').replace(/ś/g, 's').replace(/ć/g, 'c')
    .replace(/[^a-zA-Z0-9\s\-_'()\/]/g, '')
    .trim();
}

function toWikiName(name) {
  return sanitize(name).replace(/\s+/g, '_');
}

function checkUrl(filename) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}`;
    const req = https.get(url, { timeout: 8000, headers: { 'User-Agent': 'LogoFinder/1.0' } }, (res) => {
      req.destroy();
      resolve(res.statusCode === 302 ? filename : null);
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

function getPatterns(club) {
  const w = toWikiName(club);
  // remove common suffixes for cleaner base
  const base = w.replace(/_FC$|_SC$|_CF$|_AC$|_FK$|_SK$/, '');
  return [
    `${w}.svg`,
    `${w}_logo.svg`,
    `${w}_crest.svg`,
    `${w}_Badge.svg`,
    `${w}_FC.svg`,
    `${base}.svg`,
    `${base}_FC.svg`,
    `${base}_logo.svg`,
    `${base}_crest.svg`,
    `${base}_FC_logo.svg`,
    `${base}_SC.svg`,
    `${base}_CF.svg`,
    // .png fallbacks
    `${w}.png`,
    `${w}_logo.png`,
    `${base}.png`,
  ];
}

async function findLogo(domain, club) {
  const patterns = getPatterns(club);
  for (const pattern of patterns) {
    const found = await checkUrl(pattern);
    if (found) return found;
    await new Promise(r => setTimeout(r, 80)); // rate limit
  }
  return null;
}

async function main() {
  const results = { found: [], notFound: [] };
  let i = 0;
  for (const [domain, club] of missing) {
    i++;
    process.stderr.write(`[${i}/${missing.length}] ${club}...\n`);
    const filename = await findLogo(domain, club);
    if (filename) {
      const url = `https://en.wikipedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}`;
      results.found.push({ domain, club, filename, url });
      console.log(`FOUND: '${domain}': '${url}',`);
    } else {
      results.notFound.push({ domain, club });
      console.log(`# NOT_FOUND: ${club} (${domain})`);
    }
  }

  process.stderr.write(`\nDone. Found: ${results.found.length}/${missing.length}\n`);
  process.stderr.write(`Not found: ${results.notFound.length}\n`);
  process.stderr.write(`Not found clubs:\n`);
  results.notFound.forEach(x => process.stderr.write(`  - ${x.club} (${x.domain})\n`));
}

main().catch(console.error);
