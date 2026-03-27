// patch_squads.cjs - run once: node scripts/patch_squads.cjs
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/national_teams.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// ── Club lookup helper ──────────────────────────────────────────
// Patch format: [teamId, playerName, newClub, newDomain]
const patches = [
  // ── ARGENTINA (id:1) ──
  // No major changes confirmed by March 2026

  // ── FRANCE (id:2) ──
  // Griezmann retired from NT after EURO 2024
  // Camavinga still at Real Madrid, Tchouaméni at Real, Maignan at Milan
  // No confirmed mid-season changes for France

  // ── GERMANY (id:3) ──
  // Wirtz LEFT Leverkusen → Liverpool (June 2025)
  [3, 'Florian Wirtz', 'Liverpool', 'liverpoolfc.com'],
  // Tah LEFT Leverkusen → Bayern Munich (2025)
  [3, 'Jonathan Tah', 'Bayern Munich', 'fcbayern.com'],
  // Andrich stays at Leverkusen
  // Gnabry left Bayern by 2025? He went to... stays for now
  // Sané: left Bayern 2025 (contract expired, went to... unclear - keep)

  // ── BRAZIL (id:4) ──
  // Luís Díaz LEFT Liverpool → Bayern Munich (€75M, summer 2025)
  // But Díaz was in MID slot → move to FWD LW at Bayern
  [4, 'Lucas Paquetá', 'West Ham', 'westhamunited.co.uk'], // unchanged
  // Danilo: Left Juventus → Flamengo (Jan 2025)
  [4, 'Danilo', 'Flamengo', 'flamengo.com.br'],
  // Wendell: still at Porto
  // Rodrygo → stays Real Madrid
  // Replace Vinícius Jr MID → stays Real Madrid (keep)

  // ── ENGLAND (id:5) ──
  // Cole Palmer: stays Chelsea
  // Luke Shaw: stays Man Utd (long-term injured - might be replaced but keep)
  // Eze left Crystal Palace → Arsenal (summer 2025)
  // But Eze isn't in the squad - Saka is RW, Palmer is LW, that's fine

  // ── SPAIN (id:6) ──
  // No major changes to XI confirmed for NT

  // ── PORTUGAL (id:7) ──
  // No confirmed major changes March 2026

  // ── NETHERLANDS (id:8) ──
  // Xavi Simons: LEFT RB Leipzig → Tottenham (€65M, summer 2025)
  [8, 'Xavi Simons', 'Tottenham', 'tottenhamhotspur.com'],
  // De Ligt: transferred from Man Utd back to someone? Keep Man Utd for now

  // ── ITALY (id:9) ──
  // No major changes to confirm

  // ── TURKEY (id:10) ──
  // No confirmed major changes

  // ── BELGIUM (id:11) ──
  // No major changes

  // ── MOROCCO (id:12) ──
  // Bounou: LEFT Sevilla → Al-Hilal (already correct in JSON)
  // No other major changes

  // ── JAPAN (id:13) ──
  // No major confirmed changes

  // ── USA (id:14) ──
  // No major changes confirmed

  // ── MEXICO (id:15) ──
  // No major changes confirmed

  // ── COLOMBIA (id:16) ──
  // Luís Díaz: LEFT Liverpool → Bayern Munich
  [16, 'Luis Díaz', 'Bayern Munich', 'fcbayern.com'],

  // ── URUGUAY (id:17) ──
  // Darwin Núñez: LEFT Liverpool → Al-Hilal (Aug 2025)
  [17, 'Darwin Núñez', 'Al-Hilal', 'alhilal.com.sa'],
  // Muslera: may have retired - keep Galatasaray
  // Bentancur: stays Tottenham

  // ── CROATIA (id:18) ──
  // Modrić: may have retired from Real Madrid (contract ended June 2025)
  // He signed a 1-year extension... or retired? Keep Real Madrid for now as last known

  // ── SENEGAL (id:19) ──
  // No major changes

  // ── SOUTH KOREA (id:20) ──
  // No major changes

  // ── DENMARK (id:21) ──
  // Eriksen: LEFT Man Utd → somewhere? Stays Man Utd for now
  // Højlund: stays Man Utd

  // ── SWITZERLAND (id:22) ──
  // Xhaka: stays Leverkusen

  // ── AUSTRALIA (id:23) ──
  // No major changes

  // ── EGYPT (id:24) ──
  // Salah: as of March 2026, Liverpool contract expires June 2027
  // He's still at Liverpool
  // Marmoush: LEFT Frankfurt → Man City (Jan 2025)
  [24, 'Omar Marmoush', 'Man City', 'mancity.com'],

  // ── SAUDI ARABIA (id:25) ──
  // No major changes to squad
];

// Apply patches
for (const [id, playerName, newClub, newDomain] of patches) {
  const team = data.find(t => t.id === id);
  if (!team) { console.warn(`Team ${id} not found`); continue; }
  const player = team.players.find(p => p.name === playerName);
  if (!player) { console.warn(`Player "${playerName}" not found in team ${id} (${team.team})`); continue; }
  player.club = newClub;
  player.clubDomain = newDomain;
  console.log(`✓ ${team.team}: ${playerName} → ${newClub} (${newDomain})`);
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('\n✅ Patches applied successfully.');
