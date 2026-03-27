// fix_domains.cjs — run: node scripts/fix_domains.cjs
// Updates clubDomain values to ones that logo.dev resolves cleanly.
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/national_teams.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// [teamId, playerName, newClub, newDomain]
// Only touching known bad/obscure domains. All others stay.
const patches = [
  // ── Saudi clubs — use parent company / main site ──────────────
  // Al-Hilal
  [17, 'Darwin Núñez',       'Al-Hilal',    'alhilal.com'],
  [19, 'Kalidou Koulibaly',  'Al-Hilal',    'alhilal.com'],
  [24, 'Amr El-Sulaya',      'Al-Hilal',    'alhilal.com'],
  [25, 'Mohammed Al-Owais',  'Al-Hilal',    'alhilal.com'],
  [25, 'Yasser Al-Shahrani', 'Al-Hilal',    'alhilal.com'],
  [25, 'Ali Al-Bulayhi',     'Al-Hilal',    'alhilal.com'],
  [25, 'Salman Al-Faraj',    'Al-Hilal',    'alhilal.com'],
  [25, 'Salem Al-Dawsari',   'Al-Hilal',    'alhilal.com'],
  [12, 'Yassine Bounou',     'Al-Hilal',    'alhilal.com'],

  // Al-Nassr
  [7,  'Cristiano Ronaldo',  'Al Nassr',    'alnassr.com'],
  [19, 'Sadio Mané',         'Al-Nassr',    'alnassr.com'],
  [18, 'Marcelo Brozović',   'Al-Nassr',    'alnassr.com'],
  [35, 'Hakan Şükür',        'Galatasaray', 'galatasaray.org'],

  // Al-Ahli — use the club foundation site
  [10, 'Merih Demiral',      'Al-Ahli',     'alahli.com'],
  [19, 'Édouard Mendy',      'Al-Ahli',     'alahli.com'],
  [25, 'Sami Al-Najei',      'Al-Ahli',     'alahli.com'],
  [25, 'Haitham Asiri',      'Al-Ahli',     'alahli.com'],

  // Al-Ittihad
  [24, 'Ahmed Hegazi',       'Al-Ittihad',  'alittihadclub.com'],
  [24, 'Tarek Hamed',        'Al-Ahly',     'alahlysc.com'],
  [24, 'Mahmoud Hamdi',      'Al-Ahly',     'alahlysc.com'],
  [24, 'Mohamed El-Shenawy', 'Al-Ahly',     'alahlysc.com'],

  // Al-Qadsiah  
  [20, 'Jung Woo-young',     'Al-Qadsiah',  'alqadsiah.com'],
  [24, 'Emam Ashour',        'Al-Qadsiah',  'alqadsiah.com'],
  [25, 'Sultan Al-Ghanam',   'Al-Qadsiah',  'alqadsiah.com'],

  // Al-Ettifaq / Al-Fateh / Zamalek — use simpler domains
  [25, 'Riyadh Sharahili',   'Al-Ettifaq',  'alettifaq.com'],
  [25, 'Firas Al-Buraikan',  'Al-Fateh',    'alfateh.com'],
  [24, 'Mohamed Abdel-Moneim','Zamalek',    'zamalek.com'],

  // ── Korean domestic clubs ─────────────────────────────────────
  [20, 'Kim Seung-gyu',      'Vissel Kobe', 'vissel-kobe.co.jp'],
  [20, 'Kim Jin-su',         'Jeonbuk',     'jeonbukhyundai.com'],
  [20, 'Kwon Kyung-won',     'Ulsan HD',    'uhfc.co.kr'],
  [20, 'Kim Moon-hwan',      'Jeonbuk',     'jeonbukhyundai.com'],
  [20, 'Cho Gue-sung',       'Midtjylland', 'fcm.dk'],

  // ── Japanese clubs ────────────────────────────────────────────
  [13, 'Shogo Taniguchi',    'Kawasaki Frontale', 'frontale.co.jp'],
  [36, 'Lee Woon-jae',       'Suwon Bluewings',   'bluewings.kr'],
  [36, 'Lee Young-pyo',      'FC Seoul',          'fcseoul.com'],
  [36, 'Kim Tae-young',      'Jeonbuk',           'jeonbukhyundai.com'],
  [36, 'Hong Myung-bo',      'Pohang Steelers',   'steelers.co.kr'],
  [36, 'Song Chong-gug',     'Suwon Bluewings',   'bluewings.kr'],
  [36, 'Kim Nam-il',         'Busan IPark',        'iparkfc.co.kr'],
  [36, 'Yoo Sang-chul',      'Ulsan HD',          'uhfc.co.kr'],
  [36, 'Park Ji-sung',       'Kyoto Sanga',       'kyotosanga.co.jp'],
  [36, 'Lee Chun-soo',       'Seongnam',          'seongnamfc.com'],
  [36, 'Choi Tae-uk',        'Suwon Bluewings',   'bluewings.kr'],
  [36, 'Ahn Jung-hwan',      'Perugia',           'acperugia.it'],

  // ── Mexican domestic clubs ────────────────────────────────────
  [15, 'Luis Malagón',       'Club América',      'clubamerica.mx'],
  [15, 'Jesús Gallardo',     'Rayados',           'rayados.com'],
  [15, 'Carlos Rodríguez',   'Cruz Azul',         'cruzazul.com.mx'],
  [15, 'Luis Chávez',        'Pachuca',           'pachuca.mx'],
  [16, 'Camilo Vargas',      'Atlas',             'atlasfc.com.mx'],
  [15, 'Henry Martín',       'Club América',      'clubamerica.mx'],

  // ── South American domestic ───────────────────────────────────
  [4,  'Danilo',             'Flamengo',          'flamengo.com.br'],
  [26, 'Gilberto Silva',     'Athletico',         'atletico.com.br'],
  [26, 'Kléberson',          'Athletico',         'atletico.com.br'],
  [26, 'Edilson',            'Corinthians',       'corinthians.com.br'],
  [40, 'Cafu',               'São Paulo',         'saopaulofc.net'],
  [40, 'Mazinho',            'Palmeiras',         'palmeiras.com.br'],
  [16, 'Richard Ríos',       'Palmeiras',         'palmeiras.com.br'],
  [17, 'Fernando Muslera',   'Galatasaray',       'galatasaray.org'],
  [17, 'Nahitan Nández',     'Cagliari',          'cagliaricalcio.net'],
  [17, 'Matías Vecino',      'Lazio',             'sslazio.it'],
  [17, 'Facundo Torres',     'Sporting CP',       'sporting.pt'],

  // ── Australian / Scottish smaller clubs ──────────────────────
  [23, 'Nathaniel Atkinson', 'Hearts',            'heartsfc.co.uk'],
  [23, 'Kye Rowles',         'Hearts',            'heartsfc.co.uk'],
  [23, 'Aziz Behich',        'Dundee United',     'dundeeunitedfc.co.uk'],
  [23, 'Aaron Mooy',         'Celtic',            'celticfc.net'],
  [23, 'Jackson Irvine',     'St. Pauli',         'fcstpauli.com'],
  [23, 'Riley McGree',       'Middlesbrough',     'mfc.co.uk'],
  [23, 'Craig Goodwin',      'Adelaide United',   'adelaideunited.com.au'],
  [23, 'Mitchell Duke',      'Fagiano Okayama',   'fagiano.com'],
  [23, 'Martin Boyle',       'Hibernian',         'hibernianfc.co.uk'],

  // ── Croatian domestic ─────────────────────────────────────────
  [18, 'Ivan Perišić',       'Hajduk Split',      'hnkhajduk.hr'],
  [18, 'Bruno Petković',     'Dinamo Zagreb',     'gnkdinamo.hr'],

  // ── Misc fixes for better logo.dev coverage ───────────────────
  [22, 'Djibril Sow',        'Sevilla',           'sevillafc.com'],
  [22, 'Zeki Amdouni',       'Burnley',           'burnleyfc.com'],
  [22, 'Ruben Vargas',       'Augsburg',          'fcaugsburg.de'],
  [21, 'Kasper Schmeichel',  'Anderlecht',        'rsca.be'],
  [11, 'Jan Vertonghen',     'Anderlecht',        'rsca.be'],
  [11, 'Hans Vanaken',       'Club Brugge',       'clubbrugge.be'],
  [49, 'Kim Vilfort',        'Brøndby',           'brondby.com'],
  [49, 'John Jensen',        'Brøndby',           'brondby.com'],
  [49, 'Lars Olsen',         'Brøndby',           'brondby.com'],
  [49, 'Flemming Christensen','Brøndby',          'brondby.com'],
  [49, 'Henrik Andersen',    'Toulouse',          'tfc.info'],
  [49, 'Henrik Larsen',      'Pisa',              'acpisa.com'],
  [48, 'Zisis Vryzas',       'Panathinaikos',     'paofc.gr'],
  [37, 'Tony Sylva',         'Monaco',            'asmonaco.com'],
  [37, 'Henri Camara',       'Sedan',             'cssa.fr'],
  [38, 'Sergio Romero',      'Sampdoria',         'sampdoria.it'],
  [34, 'Paul Gascoigne',     'Rangers',           'rangers.co.uk'],
  [34, 'Alan Shearer',       'Blackburn Rovers',  'rovers.co.uk'],
  [39, 'Bodo Illgner',       'Köln',              'fc-koeln.de'],
  [39, 'Pierre Littbarski',  'Köln',              'fc-koeln.de'],
  [40, 'Branco',             'Genoa',             'genoacfc.it'],
  [40, 'Dunga',              'Stuttgart',         'vfb.de'],
  [40, 'Mauro Silva',        'Deportivo',         'rcdeportivo.es'],
  [40, 'Bebeto',             'Deportivo',         'rcdeportivo.es'],
  [28, 'Stéphane Guivarc\'h', 'Auxerre',          'aja.fr'],
  [47, 'Ricardo',            'Sporting CP',       'sporting.pt'],
  [47, 'Jorge Andrade',      'Deportivo',         'rcdeportivo.es'],
];

let count = 0;
for (const [id, playerName, newClub, newDomain] of patches) {
  const team = data.find(t => t.id === id);
  if (!team) { console.warn(`⚠ Team ${id} not found`); continue; }
  const player = team.players.find(p => p.name === playerName);
  if (!player) { console.warn(`⚠ "${playerName}" not in team ${id} (${team.team})`); continue; }
  player.club = newClub;
  player.clubDomain = newDomain;
  count++;
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log(`✅ ${count} domain patches applied.`);
