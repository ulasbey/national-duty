/**
 * Adds "captain" and "league" (confederation) fields to every team in national_teams.json
 */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'src', 'data', 'national_teams.json');
const teams = JSON.parse(fs.readFileSync(FILE, 'utf8'));

// Map: "id" -> { captain, league }
const hints = {
    // ─── Current 2026 ────────────────────────────────
    1: { captain: "Lionel Messi", league: "CONMEBOL" },
    2: { captain: "Kylian Mbappé", league: "UEFA" },
    3: { captain: "Hakan Çalhanoğlu", league: "UEFA" },
    4: { captain: "Joshua Kimmich", league: "UEFA" },
    5: { captain: "Marquinhos", league: "CONMEBOL" },
    6: { captain: "Harry Kane", league: "UEFA" },
    7: { captain: "Álvaro Morata", league: "UEFA" },
    8: { captain: "Cristiano Ronaldo", league: "UEFA" },
    9: { captain: "Virgil van Dijk", league: "UEFA" },
    10: { captain: "Gianluigi Donnarumma", league: "UEFA" },
    11: { captain: "Kevin De Bruyne", league: "UEFA" },
    12: { captain: "Luka Modrić", league: "UEFA" },
    13: { captain: "Federico Valverde", league: "CONMEBOL" },
    14: { captain: "James Rodríguez", league: "CONMEBOL" },
    15: { captain: "Edson Álvarez", league: "CONCACAF" },
    16: { captain: "Christian Pulisic", league: "CONCACAF" },
    17: { captain: "Wataru Endo", league: "AFC" },
    18: { captain: "Romain Saïss", league: "CAF" },
    19: { captain: "Granit Xhaka", league: "UEFA" },
    20: { captain: "Simon Kjær", league: "UEFA" },
    21: { captain: "Son Heung-min", league: "AFC" },
    22: { captain: "Kalidou Koulibaly", league: "CAF" },
    23: { captain: "William Troost-Ekong", league: "CAF" },
    24: { captain: "David Alaba", league: "UEFA" },
    25: { captain: "Alphonso Davies", league: "CONCACAF" },

    // ─── Iconic ──────────────────────────────────────
    26: { captain: "Hakan Şükür", league: "UEFA" },     // Turkey 2002
    27: { captain: "Cafu", league: "CONMEBOL" }, // Brazil 1998
    28: { captain: "Iker Casillas", league: "UEFA" },     // Spain 2010
    29: { captain: "Fabio Cannavaro", league: "UEFA" },     // Italy 2006
    30: { captain: "Didier Deschamps", league: "UEFA" },     // France 1998
    31: { captain: "Cafu", league: "CONMEBOL" }, // Brazil 2002
    32: { captain: "Philipp Lahm", league: "UEFA" },     // Germany 2014
    33: { captain: "Luka Modrić", league: "UEFA" },     // Croatia 2018
    34: { captain: "Giovanni van Bronckhorst", league: "UEFA" },  // Netherlands 2010
    35: { captain: "Cristiano Ronaldo", league: "UEFA" },     // Portugal 2016
    36: { captain: "Hugo Lloris", league: "UEFA" },     // France 2018
    37: { captain: "Lionel Messi", league: "CONMEBOL" }, // Argentina 2022
    38: { captain: "Johan Cruyff", league: "UEFA" },     // Netherlands 1974
    39: { captain: "Carlos Alberto", league: "CONMEBOL" }, // Brazil 1970
    40: { captain: "Diego Maradona", league: "CONMEBOL" }, // Argentina 1986
    41: { captain: "Zinedine Zidane", league: "UEFA" },     // France 2006
    42: { captain: "Dunga", league: "CONMEBOL" }, // Brazil 1994
    43: { captain: "David Beckham", league: "UEFA" },     // England 2006
    44: { captain: "Dino Zoff", league: "UEFA" },     // Italy 1982
    45: { captain: "Lothar Matthäus", league: "UEFA" },     // West Germany 1990
    46: { captain: "Lars Olsen", league: "UEFA" },     // Denmark 1992
    47: { captain: "Hong Myung-bo", league: "AFC" },      // South Korea 2002
    48: { captain: "Theodoros Zagorakis", league: "UEFA" },     // Greece 2004
    49: { captain: "Tsuneyasu Miyamoto", league: "AFC" },      // Japan 2002
    50: { captain: "Stephen Tataw", league: "CAF" },      // Cameroon 1990
};

let updated = 0;
for (const team of teams) {
    const h = hints[team.id];
    if (h) {
        team.captain = h.captain;
        team.league = h.league;
        updated++;
    } else {
        console.warn('No hints for team id', team.id, team.team);
    }
}

fs.writeFileSync(FILE, JSON.stringify(teams, null, 2) + '\n', 'utf8');
console.log(`Done — updated ${updated}/${teams.length} teams.`);
