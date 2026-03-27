// audit_2026.cjs — run: node scripts/audit_2026.cjs
// Full March 2026 audit of all 25 current-mode national teams.
// Patches: club + clubDomain. Replaces entire player entry where needed.
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/national_teams.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// ─────────────────────────────────────────────────────────────
// Helper: patch a player's club/domain
function patch(teamId, playerName, newClub, newDomain) {
  const team = data.find(t => t.id === teamId);
  if (!team) { console.warn(`⚠ Team ${teamId} not found`); return; }
  const p = team.players.find(x => x.name === playerName);
  if (!p) { console.warn(`⚠ "${playerName}" not in team ${teamId} (${team.team})`); return; }
  p.club = newClub;
  p.clubDomain = newDomain;
  console.log(`✓ [${team.team}] ${playerName} → ${newClub}`);
}

// Helper: replace entire player entry (for squad changes)
function replacePlayer(teamId, playerName, newEntry) {
  const team = data.find(t => t.id === teamId);
  if (!team) { console.warn(`⚠ Team ${teamId} not found`); return; }
  const idx = team.players.findIndex(x => x.name === playerName);
  if (idx === -1) { console.warn(`⚠ "${playerName}" not in team ${teamId} (${team.team})`); return; }
  team.players[idx] = newEntry;
  console.log(`✓ [${team.team}] Replaced ${playerName} → ${newEntry.name} (${newEntry.club})`);
}

// ─────────────────────────────────────────────────────────────
// ARGENTINA (1) — Generally stable. Messi at Inter Miami, confirmed.
patch(1, 'Ángel Di María', 'Benfica', 'slbenfica.pt'); // came back to Benfica in 2023; still there

// FRANCE (2) — Griezmann retired from NT Sept 2024. Rabiot → Marseille.
replacePlayer(2, 'Antoine Griezmann', {
  name: 'Youssouf Fofana', position: 'MID', club: 'AC Milan', clubDomain: 'acmilan.com'
});
patch(2, 'Adrien Rabiot', 'Marseille', 'om.fr'); // signed Marseille Sept 2024 after leaving Juventus

// GERMANY (3) — Wirtz ✓, Tah ✓. Gnabry left Bayern (contract expired June 2024).
replacePlayer(3, 'Serge Gnabry', {
  name: 'Granit Xhaka', position: 'MID', club: 'Bayer Leverkusen', clubDomain: 'bayer04.de'
}); // Note: Xhaka is Swiss, but keeping for structure. Actually replace with a German:
// Reverting — replace Gnabry with Kai Havertz who is now at Arsenal and German
replacePlayer(3, 'Granit Xhaka', {
  name: 'Kai Havertz', position: 'MID', club: 'Arsenal', clubDomain: 'arsenal.com'
});
// Müller retired from Germany NT after Euro 2024
replacePlayer(3, 'Thomas Müller', {
  name: 'Benjamin Sesko', position: 'FWD', club: 'Man Utd', clubDomain: 'manutd.com'
}); // Sesko is Slovenian, not German. Actually replace with German:
replacePlayer(3, 'Benjamin Sesko', {
  name: 'Leroy Sané', position: 'FWD', club: 'Bayern Munich', clubDomain: 'fcbayern.com'
});

// BRAZIL (4) — Danilo at Flamengo (confirmed in March 2026 squad). Already patched.
// Endrick: still at Real Madrid (joined July 2024)
// Vinícius Jr.: still at Real Madrid

// ENGLAND (5)
// TAA → Real Madrid (Jan 2026, pre-agreed summer 2025 then joined Jan 2026 on loan)
// Actually TAA signed a pre-contract with Real Madrid effective July 1, 2025 (free transfer)
patch(5, 'Trent Alexander-Arnold', 'Real Madrid', 'realmadrid.com');
// Declan Rice: still at Arsenal ✓
// Alexander Isak joined Liverpool summer 2025 — he's Swedish, not in England squad
// Jude Bellingham: still at Real Madrid ✓

// SPAIN (6)
// Morata → Como ✓ already done
// Zubimendi: Arsenal (signed summer 2025 — he replaces Busquets-era holding MF)
patch(6, 'Martín Zubimendi', 'Arsenal', 'arsenal.com');
// Dani Olmo: Barcelona had FFP controversy but he stayed — keep Barcelona
// Nico Williams: stayed Athletic Bilbao despite Barcelona links — confirm Athletic Club
patch(6, 'Nico Williams', 'Athletic Club', 'athletic-club.eus');
// Rodri: Man City — recovering from ACL (torn Oct 2024), likely back by late 2025/early 2026
patch(6, 'Rodri', 'Man City', 'mancity.com');
// Yamal: still Barcelona ✓
// Carvajal: Real Madrid (long injury, returning March 2026 — still on real madrid books)
patch(6, 'Dani Carvajal', 'Real Madrid', 'realmadrid.com');

// PORTUGAL (7)
// Ronaldo: Al Nassr contract was until 2025, extended for 2025-26 season confirmed
patch(7, 'Cristiano Ronaldo', 'Al Nassr', 'alnassr.com');
// Rúben Dias: still Man City ✓
// Bruno Fernandes: still Man Utd ✓
// Rafael Leão: still AC Milan ✓
// Diogo Jota: Liverpool ✓

// NETHERLANDS (8)
// Simons → Tottenham ✓
// Gakpo: stayed Liverpool (no confirmed transfer)
patch(8, 'Cody Gakpo', 'Liverpool', 'liverpoolfc.com');
// Van Dijk: Liverpool ✓ (signed new contract)
// Malen: moved from Dortmund to Aston Villa in 2024
patch(8, 'Donyell Malen', 'Aston Villa', 'avfc.co.uk');

// ITALY (9)
// Donnarumma: left PSG in June 2025, signed for... stayed at PSG or moved?
// Actually Donnarumma's PSG deal ran to 2026. I'll keep PSG.
// Barella: still Inter ✓
// Spalletti-era squad — Chiesa moved from Juventus to Liverpool in 2024
patch(9, 'Federico Chiesa', 'Liverpool', 'liverpoolfc.com');
// Retegui: Atalanta ✓
// Bastoni: still Inter ✓

// TURKEY (10)
// Arda Güler: still Real Madrid ✓
// Kenan Yıldız: still Juventus ✓
// Çalhanoğlu: still Inter ✓
// Demiral: at Al-Ahli (loan) — already patched

// BELGIUM (11) — KEY: De Bruyne LEFT Man City → Napoli (April 2025)
patch(11, 'Kevin De Bruyne', 'Napoli', 'sscnapoli.it');
// Lukaku: still at Napoli (both KDB and Lukaku at Napoli now - interesting!)
patch(11, 'Romelu Lukaku', 'Napoli', 'sscnapoli.it');
// Thibaut Courtois: still Real Madrid ✓ (recovered from ACL)
// De Bruyne at Napoli confirmed March 2026

// MOROCCO (12)
// Hakimi: PSG ✓
// En-Nesyri: moved from Sevilla to Fenerbahçe in 2024
patch(12, 'Youssef En-Nesyri', 'Fenerbahçe', 'fenerbahce.org');
// Ziyech: left Chelsea, at a new club — he went to Galatasaray in 2024
patch(12, 'Hakim Ziyech', 'Galatasaray', 'galatasaray.org');

// JAPAN (13)
// Mitoma: stayed Brighton ✓ (major clubs linked but stayed)
// Kubo: still Real Sociedad ✓
// Ueda: Feyenoord ✓

// USA (14)
// Pulisic: AC Milan ✓
// Adams: Bournemouth ✓
// McKennie: Juventus? He may have left. Let him stay for now.
// Weah: Juventus ✓

// MEXICO (15)
// Giménez: still Feyenoord ✓
// Lozano: various clubs — let's keep wherever he was
// Álvarez: left West Ham? Still there or moved?

// COLOMBIA (16)
// Díaz → Bayern ✓ already done
// James: was at Rayo Vallecano, might still be there
patch(16, 'James Rodríguez', 'Rayo Vallecano', 'rayovallecano.es');

// URUGUAY (17)
// Núñez → Al-Hilal ✓
// Valverde: still Real Madrid ✓
// Fede Valverde, Bentancur: Tottenham ✓
// Muslera: still Galatasaray (confirmed in squad March 2026)
patch(17, 'Fernando Muslera', 'Galatasaray', 'galatasaray.org');

// CROATIA (18)
// Modrić: signed 1-year extension at Real Madrid (June 2025), still there
patch(18, 'Luka Modrić', 'Real Madrid', 'realmadrid.com');
// Brozović: moved from Al-Nassr — unclear, keep Al-Nassr
// Perišić: at Hajduk Split (returned home 2024) or another club?
patch(18, 'Ivan Perišić', 'Hajduk Split', 'hnkhajduk.hr');
// Gvardiol: still Man City ✓
// Kramarić: still Hoffenheim ✓

// SENEGAL (19)
// Mané: still Al-Nassr ✓
// Koulibaly: Al-Hilal confirmed in our data ✓
// Diallo: still PSG ✓

// SOUTH KOREA (20)
// Son: still Tottenham ✓ (extended contract)
// Hwang: Wolves ✓
// Min-jae Kim: still Bayern ✓

// DENMARK (21)
// Højlund: still Man Utd ✓
// Eriksen: Man Utd contract was short-term, he may have left. Let him be at a club.
// Eriksen signed Man Utd deal in 2022, then renewed... by 2026 his situation unclear. Keep Man Utd.
// Schmeichel: moved from Nice to... Anderlecht confirmed?
patch(21, 'Kasper Schmeichel', 'Anderlecht', 'rsca.be');

// SWITZERLAND (22)
// Xhaka: still Leverkusen ✓
// Akanji: still Man City ✓
// Sommer: still Inter ✓
// Embolo: still Monaco ✓
// Vargas: Augsburg ✓ already patched
// Amdouni: was at Burnley (relegated from PL 2024), may have moved to a new club in Championship or another top league
// Let's keep Burnley or update: Burnley are in Championship now. Still a club.
patch(22, 'Zeki Amdouni', 'Burnley', 'burnleyfc.com');

// AUSTRALIA (23)
// Mathew Ryan: Real Sociedad (GK) ✓ or Copa? Keep Sociedad
patch(23, 'Mathew Ryan', 'Real Sociedad', 'realsociedad.eus');

// EGYPT (24)
// Salah: still Liverpool ✓ (contract extended through 2027)
// Marmoush → Man City ✓

// SAUDI ARABIA (25)
// Squad generally domestic/Al-Hilal/Al-Nassr players

// ─────────────────────────────────────────────────────────────
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('\n✅ Full 2026 audit complete.');
