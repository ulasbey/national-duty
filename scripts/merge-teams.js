/**
 * merge-teams.js
 * Kullanım: node scripts/merge-teams.js batch1.json batch2.json ...
 * veya:     node scripts/merge-teams.js batches/
 *
 * Gemini'den gelen JSON batch dosyalarını national_teams.json'a ekler.
 * Mükerrer id / (team+year) kombinasyonlarını atlar.
 */

const fs   = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../src/data/national_teams.json');

// ── Mevcut veriyi yükle ────────────────────────────────────────────────────
const existing = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const existingIds  = new Set(existing.map(t => t.id));
const existingKeys = new Set(existing.map(t => `${t.team}|${t.year}|${t.tournament || t.mode}`));
console.log(`Mevcut takım sayısı: ${existing.length}`);

// ── Batch dosyalarını topla ────────────────────────────────────────────────
let args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Kullanım: node scripts/merge-teams.js batch1.json [batch2.json ...]');
  console.error('veya bir klasör: node scripts/merge-teams.js batches/');
  process.exit(1);
}

// Eğer klasör verilmişse içindeki tüm .json dosyalarını al
if (args.length === 1 && fs.statSync(args[0]).isDirectory()) {
  const dir = args[0];
  args = fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => path.join(dir, f))
    .sort();
  console.log(`Klasörden ${args.length} dosya bulundu.`);
}

// ── Her batch'i işle ──────────────────────────────────────────────────────
let added = 0, skipped = 0, nextId = Math.max(...existing.map(t => t.id)) + 1;

args.forEach(file => {
  let batch;
  try {
    const raw = fs.readFileSync(file, 'utf8');
    batch = JSON.parse(raw);
    if (!Array.isArray(batch)) {
      // Gemini bazen { teams: [...] } formatında döndürebilir
      batch = batch.teams || batch.data || Object.values(batch)[0];
    }
  } catch (e) {
    console.error(`  ✗ ${file}: JSON parse hatası — ${e.message}`);
    return;
  }

  batch.forEach(team => {
    const key = `${team.team}|${team.year}|${team.tournament || team.mode}`;

    // Mükerrer kontrol
    if (existingKeys.has(key)) {
      console.log(`  ⊘ Atlandı (zaten var): ${team.team} ${team.year}`);
      skipped++;
      return;
    }

    // ID çakışmasını önle — otomatik yeniden numara ver
    if (!team.id || existingIds.has(team.id)) {
      team.id = nextId;
    }
    nextId = Math.max(nextId, team.id) + 1;

    // mode alanı yoksa ekle
    if (!team.mode) team.mode = 'iconic';

    existing.push(team);
    existingIds.add(team.id);
    existingKeys.add(key);
    console.log(`  ✓ Eklendi: ${team.team} ${team.year} (id: ${team.id})`);
    added++;
  });
});

// ── Kaydet ────────────────────────────────────────────────────────────────
if (added > 0) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(existing, null, 2));
  console.log(`\n✅ Tamamlandı: ${added} takım eklendi, ${skipped} atlandı.`);
  console.log(`Toplam: ${existing.length} takım`);
} else {
  console.log('\n⚠️  Eklenecek yeni takım bulunamadı.');
}
