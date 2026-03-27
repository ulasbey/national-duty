const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/national_teams.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const DOMAIN_FIXES = {
  // Haiti 1947
  'Victory SC': 'victory-sc.ht',
  'Violette AC': 'violette-ac.ht',
  'Aigle Noir': 'aigle-noir.ht',
  'Racing Club Haïtien': 'racing-club-haitien.ht',
  'Don Bosco': 'don-bosco-haitien.ht',
  'Archibald SC': 'archibald-sc.ht',
  
  // Panama
  'Plaza Amador': 'cdplazaamador.com',
  'Rio Abajo': 'rioabajofc.com',
  'Chorrillo FC': 'chorrillofc.com',
  'Arabe Unido': 'arabeunido.com',
  
  // Mexican Alignment
  'Club América': 'clubamerica.com.mx',
  'Cruz Cruz Azul': 'cruzazulfc.com.mx',
  'Cruz Azul': 'cruzazulfc.com.mx',
  'Pachuca': 'pachuca.com.mx',
  'Tigres UANL': 'tigres.com.mx',
  'Guadalajara': 'chivasdecorazon.com.mx',
  'Chivas': 'chivasdecorazon.com.mx',
  'Pumas UNAM': 'pumas.mx',
  'Santos Laguna': 'clubsantos.mx',
  'Monterrey': 'rayados.com',
  'Toluca': 'tolucafc.com',
  
  // MLS Alignment
  'Houston Dynamo': 'houstondynamofc.com',
  'Columbus Crew': 'columbuscrew.com',
  'FC Dallas': 'fcdallas.com',
  'New York Red Bulls': 'newyorkredbulls.com',
  'Toronto FC': 'torontofc.ca',
  'Whitecaps': 'whitecapsfc.com',
  'Vancouver Whitecaps': 'whitecapsfc.com',
  'Montreal Impact': 'cfmontreal.com',
  'CF Montréal': 'cfmontreal.com',
  'Lille': 'losc.fr',
  'Benfica': 'slbenfica.pt',
  'Parma': 'parmafc.it',
  'IFK Göteborg': 'ifkgoteborg.se',
  'Sheffield Wednesday': 'swfc.co.uk',
  'Tijuana': 'xolos.com.mx',
  'Portland Timbers': 'timbers.com',
  'Seattle Sounders': 'soundersfc.com',
  'Wolfsburg': 'vfl-wolfsburg.de',
};

data.forEach(t => {
  t.players.forEach(p => {
    if (DOMAIN_FIXES[p.club]) {
      p.clubDomain = DOMAIN_FIXES[p.club];
    }
    // Also fix any generic domains to specific ones if likely
    if (p.clubDomain === 'fhf.ht') {
      p.clubDomain = `${p.club.toLowerCase().replace(/\s+/g, '-')}.ht`;
    }
  });
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('Update complete.');
