// check_names.cjs
const d = require('../src/data/national_teams.json');
[1,2,3,6].forEach(id => {
  const t = d.find(t => t.id === id);
  console.log(`\n[${id}] ${t.team}:`, t.players.map(p => p.name).join(', '));
});
