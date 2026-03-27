const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/national_teams.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Extract unique clubs
const clubs = new Map();
data.forEach(t => {
  t.players.forEach(p => {
    if (!clubs.has(p.club)) {
      clubs.set(p.club, {
        name: p.club,
        domain: p.clubDomain,
        team: t.team,
        year: t.year
      });
    }
  });
});

console.log(`Total unique clubs: ${clubs.size}`);

// Get clubs NOT in LOGO_MAP
// I'll need to read FootballPitch.jsx to get the LOGO_MAP
const pitchPath = path.join(__dirname, '../src/components/FootballPitch.jsx');
const pitchContent = fs.readFileSync(pitchPath, 'utf8');

// Robustly extract keys from LOGO_MAP
// This regex looks for 'domain': ... and stops at the next comma or closing brace
const logoMapMatches = pitchContent.match(/'(.*?[^\\])':\s*([^,}\n]+)/g) || [];
const logoMapKeys = new Set();
logoMapMatches.forEach(m => {
  const match = m.match(/'(.*?[^\\])':/);
  if (match) {
    logoMapKeys.add(match[1].replace(/\\'/g, "'"));
  }
});

// Get wiki titles from hook
const hookPath = path.join(__dirname, '../src/hooks/useWikiImage.js');
const hookContent = fs.readFileSync(hookPath, 'utf8');
// Match 'Club Name': 'Wiki Title'
const wikiMatches = hookContent.match(/'(.*?[^\\])':\s*'(.*?[^\\])'/g) || [];
const wikiKeys = new Set();
wikiMatches.forEach(m => {
  const match = m.match(/'(.*?[^\\])':/);
  if (match) {
    wikiKeys.add(match[1].replace(/\\'/g, "'"));
  }
});

const missing = [];
const partiallyMissing = []; // Has wiki title but no direct SVG map

clubs.forEach((info, name) => {
  const hasMap = logoMapKeys.has(info.domain);
  const hasWiki = wikiKeys.has(name);

  if (!hasMap && !hasWiki) {
    missing.push(info);
  } else if (!hasMap) {
    partiallyMissing.push(info);
  }
});

console.log(`Clubs with direct SVG/PNG map: ${logoMapKeys.size}`);
console.log(`Clubs with Wiki API mapping: ${wikiKeys.size}`);
console.log(`---`);
console.log(`Totally Missing (No map, No Wiki): ${missing.length}`);
console.log(`Partially Missing (No SVG map, but has Wiki): ${partiallyMissing.length}`);

// Write full list to file
const outputPath = path.join(__dirname, '../missing_logos.txt');
const outputContent = missing.map(m => `${m.name} | ${m.domain} | (Source: ${m.team} ${m.year})`).sort().join('\n');
fs.writeFileSync(outputPath, outputContent);

console.log(`\nFull list written to: ${outputPath}`);

if (missing.length > 0) {
    console.log('\nSample Totally Missing (first 10):');
    console.log(missing.slice(0, 10).map(m => `${m.name} (${m.domain})`).join('\n'));
} else {
    console.log('\n✅ 100% Logo Coverage Achieved! (0 missing)');
}
