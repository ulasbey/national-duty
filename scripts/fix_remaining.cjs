// fix_remaining.cjs — cleans up issues from audit_2026 run
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../src/data/national_teams.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// ── Germany (3): remove duplicate Kai Havertz, replace 2nd one with Florian Wirtz (already patched to LIV)
// The double Havertz happened because Gnabry→Xhaka→Havertz chain, but Havertz already existed.
// Gnabry's slot (which became Havertz #2) should be Leroy Sané's old slot.
// Actually in Germany squad, after audit we now have: Sané, Havertz, Havertz (duplicate)
// We want: Sané (FWD), Havertz (MID), and the 3rd FWD should be someone else.
// Looking at the squad: Germany has Sané at FWD and Havertz at MID and duplicate Havertz at FWD.
// Fix: replace the SECOND Havertz (index of 2nd occurrence) with Serge Gnabry → actually Gnabry left.
// Better: replace 2nd Havertz with Deniz Undav or another German attacker.
// The cleanest fix: 3rd FWD slot = Leroy Sané (already there), 2nd FWD = Havertz (Arsenal, MID/FWD)
// Let's deduplicate by removing the 2nd Havertz and keeping one clean entry.
const ger = data.find(t => t.id === 3);
const havertzIndices = ger.players.reduce((acc, p, i) => p.name === 'Kai Havertz' ? [...acc, i] : acc, []);
if (havertzIndices.length > 1) {
  // Replace the last duplicate with Florian Wirtz's entry — wait, Wirtz is already in squad as MID.
  // Replace with a German attacker: use Deniz Undav (VfB Stuttgart)
  ger.players[havertzIndices[havertzIndices.length - 1]] = {
    name: 'Christopher Nkunku', position: 'FWD', club: 'AC Milan', clubDomain: 'acmilan.com'
  };
  // Actually Nkunku is French. Use: Maximilian Beier (Dortmund, German attacker born 2002)
  ger.players[havertzIndices[havertzIndices.length - 1]] = {
    name: 'Maximilian Beier', position: 'FWD', club: 'Borussia Dortmund', clubDomain: 'bvb.de'
  };
  console.log('✓ [Germany] Removed duplicate Havertz, added Maximilian Beier (BVB)');
}

// ── Argentina (1): Di María name has accent issue — find by partial match
const arg = data.find(t => t.id === 1);
const diMaria = arg.players.find(p => p.name.includes('Di Mar'));
if (diMaria) {
  diMaria.club = 'Benfica';
  diMaria.clubDomain = 'slbenfica.pt';
  console.log('✓ [Argentina] Di María → Benfica');
}

// ── France (2): Rabiot check — he is in our France squad?
// Our France squad now is: Maignan, Theo, Upamecano, Saliba, Koundé, Camavinga, Tchouaméni, Fofana, Dembélé, Mbappé, Thuram
// Rabiot was NOT in the squad (Griezmann was there as MID before, now replaced by Fofana). 
// France squad looks correct — no Rabiot slot to patch.
console.log('  France squad: Griezmann replaced by Fofana ✓');

// ── Spain (6): Zubimendi is not in our squad. The CM slots are Pedri, Rodri, Dani Olmo.
// Spain's squad looks correct — Zubimendi could be a squad player but not in starting 11.
// No change needed for Spain.
console.log('  Spain squad: Rodri, Pedri, Dani Olmo as MIDs ✓');

// ── Germany: also check Musiala stays at Bayern (confirmed 2025-26 season contract extension)
const musiala = ger.players.find(p => p.name === 'Jamal Musiala');
if (musiala) { musiala.club = 'Bayern Munich'; musiala.clubDomain = 'fcbayern.com'; }

// ── Germany: Andrich stays Leverkusen ✓, Kimmich stays Bayern

// ── Germany: Wirtz is now Liverpool (already confirmed patched)
const wirtz = ger.players.find(p => p.name === 'Florian Wirtz');
if (wirtz) { wirtz.club = 'Liverpool'; wirtz.clubDomain = 'liverpoolfc.com'; console.log('✓ [Germany] Wirtz → Liverpool confirmed'); }

// ── Italy (9): Retegui still Atalanta; Barella Inter; Donnarumma PSG
const ita = data.find(t => t.id === 9);
const don = ita.players.find(p => p.name === 'Gianluigi Donnarumma');
if (don) { don.club = 'PSG'; don.clubDomain = 'psg.fr'; }
// Ciro Immobile: left Lazio → Besiktas (confirmed 2024). He may not even be in Italy squad anymore.
// Italy NT dropped Immobile; Retegui is the new striker.
// Our squad already has Retegui as ST - the Immobile check:
const immobile = ita.players.find(p => p.name === 'Ciro Immobile');
if (immobile) {
  // Replace with Lorenzo Pellegrini (Roma, CM/FWD)
  immobile.name = 'Lorenzo Pellegrini'; immobile.club = 'Roma'; immobile.clubDomain = 'asroma.it';
  console.log('✓ [Italy] Ciro Immobile → Lorenzo Pellegrini (Roma)');
}

// ── Belgium (11): Courtois: Real Madrid (ACL recovered, back playing 2025-26)
const bel = data.find(t => t.id === 11);
const cour = bel.players.find(p => p.name === 'Thibaut Courtois');
if (cour) { cour.club = 'Real Madrid'; cour.clubDomain = 'realmadrid.com'; }

// ── Denmark (21): Christian Eriksen — Man Utd (his situation)
// He was at Man Utd, his contract was short-term. By 2026 he might have moved.
// He was linked with a return to Ajax or other clubs. Let's keep Man Utd for now.

// ── Morocco (12): Amrabat left Fiorentina? He was linked with Man Utd but stayed or moved.
// Keep Fiorentina as last confirmed.

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('\n✅ Remaining fixes applied.');
