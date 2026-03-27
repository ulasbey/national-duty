// run: node scripts/morata_patch.cjs
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../src/data/national_teams.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const patches = [
  // Morata is on loan at Como from AC Milan (March 2026)
  [6, 'Álvaro Morata', 'Como', 'como.it'],
];

let count = 0;
for (const [id, name, club, domain] of patches) {
  const team = data.find(t => t.id === id);
  if (!team) { console.warn('Team', id, 'not found'); continue; }
  const player = team.players.find(p => p.name === name);
  if (!player) { console.warn(name, 'not found in', team.team); continue; }
  player.club = club;
  player.clubDomain = domain;
  console.log('OK', team.team, '-', name, '->', club);
  count++;
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('Done:', count, 'patches');
