const fs = require('fs');
const path = require('path');
const https = require('https');

const pitchPath = path.join(__dirname, '../src/components/FootballPitch.jsx');
const content = fs.readFileSync(pitchPath, 'utf8');

const WP = 'https://en.wikipedia.org/wiki/Special:FilePath/';
const logoMapMatch = content.match(/const LOGO_MAP = \{([\s\S]*?)\};/);
if (!logoMapMatch) {
    console.error('Could not find LOGO_MAP');
    process.exit(1);
}

const mapLines = logoMapMatch[1].split('\n');
const urls = [];

mapLines.forEach(line => {
    const match = line.match(/'(.*?)':\s*(WP\s*\+\s*'(.*?)'|'(.*?)')/);
    if (match) {
        const domain = match[1];
        let url = '';
        if (match[3]) url = WP + match[3];
        else if (match[4]) url = match[4];
        
        if (url) urls.push({ domain, url });
    }
});

console.log(`Found ${urls.length} URLs to verify...`);

async function checkUrl(item) {
    return new Promise((resolve) => {
        const req = https.get(item.url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        }, (res) => {
            if (res.statusCode >= 400 && res.statusCode !== 403) { // 403 often happens with direct hotlinking, but we care about 404
                resolve({ ...item, status: res.statusCode });
            } else {
                resolve(null);
            }
        });
        req.on('error', (err) => resolve({ ...item, status: 'ERROR', error: err.message }));
        req.setTimeout(5000, () => {
            req.destroy();
            resolve({ ...item, status: 'TIMEOUT' });
        });
    });
}

async function run() {
    const broken = [];
    const BATCH_SIZE = 10;
    for (let i = 0; i < urls.length; i += BATCH_SIZE) {
        const batch = urls.slice(i, i + BATCH_SIZE);
        const results = await Promise.all(batch.map(checkUrl));
        results.forEach(r => { if (r) broken.push(r); });
        console.log(`Checked ${Math.min(i + BATCH_SIZE, urls.length)}/${urls.length}... (Broken so far: ${broken.length})`);
    }

    console.log('\n--- BROKEN LOGO REPORT ---');
    if (broken.length === 0) {
        console.log('✅ All direct LOGO_MAP URLs are valid!');
    } else {
        broken.forEach(b => console.log(`${b.domain}: ${b.status} - ${b.url}`));
        fs.writeFileSync(path.join(__dirname, '../broken_logos.txt'), JSON.stringify(broken, null, 2));
    }
}

run();
