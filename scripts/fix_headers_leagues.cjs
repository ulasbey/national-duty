const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/national_teams.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const CONFED_MAP = {
  // UEFA
  'Albania': 'UEFA', 'Austria': 'UEFA', 'Belgium': 'UEFA', 'Bulgaria': 'UEFA', 'Croatia': 'UEFA',
  'Czech Republic': 'UEFA', 'Denmark': 'UEFA', 'England': 'UEFA', 'Finland': 'UEFA', 'France': 'UEFA',
  'Germany': 'UEFA', 'Greece': 'UEFA', 'Hungary': 'UEFA', 'Iceland': 'UEFA', 'Ireland': 'UEFA',
  'Italy': 'UEFA', 'Netherlands': 'UEFA', 'Norway': 'UEFA', 'Poland': 'UEFA', 'Portugal': 'UEFA',
  'Romania': 'UEFA', 'Russia': 'UEFA', 'Scotland': 'UEFA', 'Serbia': 'UEFA', 'Slovakia': 'UEFA',
  'Slovenia': 'UEFA', 'Spain': 'UEFA', 'Sweden': 'UEFA', 'Switzerland': 'UEFA', 'Turkey': 'UEFA',
  'Ukraine': 'UEFA', 'Wales': 'UEFA', 'West Germany': 'UEFA', 'Soviet Union': 'UEFA', 'Yugoslavia': 'UEFA',
  'North Macedonia': 'UEFA',

  // CONMEBOL
  'Argentina': 'CONMEBOL', 'Bolivia': 'CONMEBOL', 'Brazil': 'CONMEBOL', 'Chile': 'CONMEBOL',
  'Colombia': 'CONMEBOL', 'Ecuador': 'CONMEBOL', 'Paraguay': 'CONMEBOL', 'Peru': 'CONMEBOL',
  'Uruguay': 'CONMEBOL', 'Venezuela': 'CONMEBOL',

  // CAF
  'Algeria': 'CAF', 'Burkina Faso': 'CAF', 'Cameroon': 'CAF', 'Egypt': 'CAF', 'Ghana': 'CAF',
  'Ivory Coast': 'CAF', "Côte d'Ivoire": 'CAF', 'Mali': 'CAF', 'Morocco': 'CAF', 'Nigeria': 'CAF',
  'Senegal': 'CAF', 'South Africa': 'CAF', 'Tunisia': 'CAF', 'Zambia': 'CAF',

  // CONCACAF
  'Canada': 'CONCACAF', 'Costa Rica': 'CONCACAF', 'Guatemala': 'CONCACAF', 'Haiti': 'CONCACAF',
  'Honduras': 'CONCACAF', 'Jamaica': 'CONCACAF', 'Mexico': 'CONCACAF', 'Panama': 'CONCACAF',
  'Trinidad and Tobago': 'CONCACAF', 'USA': 'CONCACAF', 'United States': 'CONCACAF',

  // AFC
  'Australia': 'AFC', 'China': 'AFC', 'Iran': 'AFC', 'Japan': 'AFC', 'Qatar': 'AFC',
  'Saudi Arabia': 'AFC', 'South Korea': 'AFC', 'Uzbekistan': 'AFC', 'North Korea': 'AFC',
};

let headerFixes = 0;
let leagueFixes = 0;

data.forEach(t => {
  // 1. Fix Tournament Header
  const oldTournament = t.tournament || '';
  if (oldTournament.toLowerCase() === 'euro') {
    t.tournament = `UEFA Euro ${t.year}`;
    headerFixes++;
  } else if (oldTournament.toLowerCase() === 'worldcup') {
    t.tournament = `FIFA World Cup ${t.year}`;
    headerFixes++;
  } else if (oldTournament.toLowerCase() === 'conmebol') {
    t.tournament = `Copa América ${t.year}`;
    headerFixes++;
  } else if (oldTournament.toLowerCase() === 'afcon') {
    t.tournament = `AFCON ${t.year}`;
    headerFixes++;
  } else if (oldTournament.toLowerCase() === 'concacaf') {
    t.tournament = `Gold Cup ${t.year}`;
    headerFixes++;
  }

  // 2. Fix League (Confederation)
  const expectedLeague = CONFED_MAP[t.team];
  if (expectedLeague && t.league !== expectedLeague) {
    t.league = expectedLeague;
    leagueFixes++;
  }
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log(`✅ Tournament Header Fixes: ${headerFixes}`);
console.log(`✅ League/Confederation Fixes: ${leagueFixes}`);
