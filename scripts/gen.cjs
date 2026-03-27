const fs = require('fs'), path = require('path');
const B = 'https://en.wikipedia.org/wiki/Special:FilePath/';
const P = (n, pos, c, l) => ({ name: n, position: pos, club: c, clubLogo: B + l });
const T = (id, team, yr, mode, tourn, flag, pl, opts) => ({ id, team, year: yr, mode, tournament: tourn, flag, players: pl, options: opts });
// Logo shortcuts
const L = {
    rm: 'Real_Madrid_CF.svg', bar: 'FC_Barcelona_(crest).svg', liv: 'Liverpool_FC.svg', ars: 'Arsenal_FC.svg',
    che: 'Chelsea_FC.svg', mci: 'Manchester_City_FC_badge.svg', mun: 'Manchester_United_FC_crest.svg',
    bay: 'FC_Bayern_M%C3%BCnchen_logo_(2017).svg', psg: 'Paris_Saint-Germain_F.C..svg',
    int: 'FC_Internazionale_Milano_2021.svg', acm: 'Logo_of_AC_Milan.svg', juv17: 'Juventus_FC_2017_logo.svg',
    juv04: 'Juventus_FC_logo_(2004).svg', atm: 'Atletico_Madrid_2017_logo.svg',
    gal: 'Galatasaray_Sports_Club_Logo.svg', fen: 'Fenerbah%C3%A7e_SK_logo.svg',
    bes: 'Be%C5%9Fikta%C5%9F_JK_Logo.svg', avl: 'Aston_Villa_FC_crest_(2016).svg',
    tot: 'Tottenham_Hotspur.svg', nap: 'SSC_Napoli.svg', rom17: 'AS_Roma_logo_(2017).svg',
    rom00: 'AS_Roma_logo_(2000-2013).svg', ajax: 'AFC_Ajax.svg', fey: 'Feyenoord_logo.svg',
    por: 'FC_Porto.svg', ben: 'SL_Benfica_logo.svg', spo: 'Sporting_Clube_de_Portugal_(Logo).svg',
    lev: 'Bayer_04_Leverkusen_logo.svg', bvb: 'Borussia_Dortmund_logo.svg',
    oml: 'Olympique_Lyonnais_logo.svg', omm: 'Olympique_de_Marseille_logo.svg',
    mon: 'AS_Monaco_FC.svg', bri: 'Brighton_%26_Hove_Albion_logo.svg',
    whu: 'West_Ham_United_FC_logo.svg', new: 'Newcastle_United_Logo.svg',
    pal: 'Sociedade_Esportiva_Palmeiras_logo.svg', aln: 'Al-Nassr_FC_logo.svg',
    vil: 'Villarreal_CF_logo.svg', val: 'Valenciacf.svg', ata: 'Atalanta_BC.svg',
    evi: 'Everton_FC_logo.svg', cry: 'Crystal_Palace_FC_logo.svg', ful: 'Fulham_FC.svg',
    lei: 'Leicester_City_crest.svg', wol: 'VfL_Wolfsburg_Logo.svg',
    stu: 'VfB_Stuttgart_1893_Logo.svg', ren: 'Stade_Rennais_FC.svg',
    rbl: 'RB_Leipzig_2014_logo.svg', sev: 'Sevilla_FC_logo.svg',
};

const teams = [
    // ═══ CURRENT 2026 (25 teams) ═══
    T(1, "Argentina", 2026, "current", "World Cup 2026 Qualifiers", "🇦🇷", [
        P("Emiliano Martínez", "GK", "Aston Villa", L.avl), P("Nicolás Tagliafico", "DEF", "Lyon", L.oml), P("Lisandro Martínez", "DEF", "Man Utd", L.mun), P("Cristian Romero", "DEF", "Tottenham", L.tot), P("Nahuel Molina", "DEF", "Atlético Madrid", L.atm), P("Alexis Mac Allister", "MID", "Liverpool", L.liv), P("Enzo Fernández", "MID", "Chelsea", L.che), P("Rodrigo De Paul", "MID", "Atlético Madrid", L.atm), P("Lautaro Martínez", "FWD", "Inter Milan", L.int), P("Julián Álvarez", "FWD", "Atlético Madrid", L.atm), P("Lionel Messi", "FWD", "Inter Miami", "Inter_Miami_CF_logo.svg")
    ], ["Argentina", "Uruguay", "Brazil", "Colombia", "Chile"]),

    T(2, "France", 2026, "current", "World Cup 2026 Qualifiers", "🇫🇷", [
        P("Mike Maignan", "GK", "AC Milan", L.acm), P("Theo Hernández", "DEF", "AC Milan", L.acm), P("Dayot Upamecano", "DEF", "Bayern Munich", L.bay), P("William Saliba", "DEF", "Arsenal", L.ars), P("Jules Koundé", "DEF", "Barcelona", L.bar), P("Eduardo Camavinga", "MID", "Real Madrid", L.rm), P("Aurélien Tchouaméni", "MID", "Real Madrid", L.rm), P("Antoine Griezmann", "MID", "Atlético Madrid", L.atm), P("Ousmane Dembélé", "FWD", "PSG", L.psg), P("Kylian Mbappé", "FWD", "Real Madrid", L.rm), P("Marcus Thuram", "FWD", "Inter Milan", L.int)
    ], ["France", "Belgium", "Netherlands", "Portugal", "Germany"]),

    T(3, "Turkey", 2026, "current", "World Cup 2026 Qualifiers", "🇹🇷", [
        P("Altay Bayındır", "GK", "Man Utd", L.mun), P("Ferdi Kadıoğlu", "DEF", "Brighton", L.bri), P("Merih Demiral", "DEF", "Al-Ahli", "Al-Ahli_Saudi_FC_logo.svg"), P("Samet Akaydin", "DEF", "Fenerbahçe", L.fen), P("Zeki Çelik", "DEF", "Roma", L.rom17), P("İsmail Yüksek", "MID", "Fenerbahçe", L.fen), P("Hakan Çalhanoğlu", "MID", "Inter Milan", L.int), P("Kaan Ayhan", "MID", "Galatasaray", L.gal), P("Barış Alper Yılmaz", "FWD", "Galatasaray", L.gal), P("Kenan Yıldız", "FWD", "Juventus", L.juv17), P("Arda Güler", "FWD", "Real Madrid", L.rm)
    ], ["Turkey", "Greece", "Croatia", "Czech Republic", "Austria"]),

    T(4, "Germany", 2026, "current", "World Cup 2026 Qualifiers", "🇩🇪", [
        P("Marc-André ter Stegen", "GK", "Barcelona", L.bar), P("Maximilian Mittelstädt", "DEF", "Stuttgart", L.stu), P("Antonio Rüdiger", "DEF", "Real Madrid", L.rm), P("Jonathan Tah", "DEF", "Barcelona", L.bar), P("Joshua Kimmich", "DEF", "Bayern Munich", L.bay), P("Florian Wirtz", "MID", "Bayer Leverkusen", L.lev), P("Jamal Musiala", "MID", "Bayern Munich", L.bay), P("Robert Andrich", "MID", "Bayer Leverkusen", L.lev), P("Leroy Sané", "FWD", "Bayern Munich", L.bay), P("Kai Havertz", "FWD", "Arsenal", L.ars), P("Serge Gnabry", "FWD", "Bayern Munich", L.bay)
    ], ["Germany", "Austria", "Netherlands", "Switzerland", "Denmark"]),

    T(5, "Brazil", 2026, "current", "World Cup 2026 Qualifiers", "🇧🇷", [
        P("Alisson", "GK", "Liverpool", L.liv), P("Wendell", "DEF", "Porto", L.por), P("Éder Militão", "DEF", "Real Madrid", L.rm), P("Marquinhos", "DEF", "PSG", L.psg), P("Danilo", "DEF", "Juventus", L.juv17), P("Lucas Paquetá", "MID", "West Ham", L.whu), P("Bruno Guimarães", "MID", "Newcastle", L.new), P("Vinícius Jr.", "MID", "Real Madrid", L.rm), P("Raphinha", "FWD", "Barcelona", L.bar), P("Endrick", "FWD", "Real Madrid", L.rm), P("Rodrygo", "FWD", "Real Madrid", L.rm)
    ], ["Brazil", "Argentina", "Colombia", "Ecuador", "Uruguay"]),

    T(6, "England", 2026, "current", "World Cup 2026 Qualifiers", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", [
        P("Jordan Pickford", "GK", "Everton", L.evi), P("Luke Shaw", "DEF", "Man Utd", L.mun), P("Marc Guéhi", "DEF", "Crystal Palace", L.cry), P("John Stones", "DEF", "Man City", L.mci), P("Trent Alexander-Arnold", "DEF", "Real Madrid", L.rm), P("Phil Foden", "MID", "Man City", L.mci), P("Declan Rice", "MID", "Arsenal", L.ars), P("Jude Bellingham", "MID", "Real Madrid", L.rm), P("Cole Palmer", "FWD", "Chelsea", L.che), P("Harry Kane", "FWD", "Bayern Munich", L.bay), P("Bukayo Saka", "FWD", "Arsenal", L.ars)
    ], ["England", "France", "Scotland", "Wales", "Ireland"]),

    T(7, "Spain", 2026, "current", "World Cup 2026 Qualifiers", "🇪🇸", [
        P("Unai Simón", "GK", "Athletic Bilbao", "Athletic_Club_logo.svg"), P("Marc Cucurella", "DEF", "Chelsea", L.che), P("Pau Cubarsí", "DEF", "Barcelona", L.bar), P("Robin Le Normand", "DEF", "Atlético Madrid", L.atm), P("Dani Carvajal", "DEF", "Real Madrid", L.rm), P("Pedri", "MID", "Barcelona", L.bar), P("Rodri", "MID", "Man City", L.mci), P("Dani Olmo", "MID", "Barcelona", L.bar), P("Nico Williams", "FWD", "Athletic Bilbao", "Athletic_Club_logo.svg"), P("Álvaro Morata", "FWD", "AC Milan", L.acm), P("Lamine Yamal", "FWD", "Barcelona", L.bar)
    ], ["Spain", "Portugal", "Italy", "France", "Argentina"]),

    T(8, "Portugal", 2026, "current", "World Cup 2026 Qualifiers", "🇵🇹", [
        P("Diogo Costa", "GK", "Porto", L.por), P("Nuno Mendes", "DEF", "PSG", L.psg), P("António Silva", "DEF", "Benfica", L.ben), P("Rúben Dias", "DEF", "Man City", L.mci), P("Diogo Dalot", "DEF", "Man Utd", L.mun), P("Vitinha", "MID", "PSG", L.psg), P("Bruno Fernandes", "MID", "Man Utd", L.mun), P("Bernardo Silva", "MID", "Man City", L.mci), P("Rafael Leão", "FWD", "AC Milan", L.acm), P("Cristiano Ronaldo", "FWD", "Al Nassr", L.aln), P("Diogo Jota", "FWD", "Liverpool", L.liv)
    ], ["Portugal", "Spain", "Brazil", "France", "Uruguay"]),

    T(9, "Netherlands", 2026, "current", "World Cup 2026 Qualifiers", "🇳🇱", [
        P("Bart Verbruggen", "GK", "Brighton", L.bri), P("Nathan Aké", "DEF", "Man City", L.mci), P("Virgil van Dijk", "DEF", "Liverpool", L.liv), P("Matthijs de Ligt", "DEF", "Man Utd", L.mun), P("Denzel Dumfries", "DEF", "Inter Milan", L.int), P("Frenkie de Jong", "MID", "Barcelona", L.bar), P("Ryan Gravenberch", "MID", "Liverpool", L.liv), P("Xavi Simons", "MID", "RB Leipzig", L.rbl), P("Cody Gakpo", "FWD", "Liverpool", L.liv), P("Brian Brobbey", "FWD", "Ajax", L.ajax), P("Donyell Malen", "FWD", "Aston Villa", L.avl)
    ], ["Netherlands", "Belgium", "Germany", "Denmark", "Sweden"]),

    T(10, "Italy", 2026, "current", "World Cup 2026 Qualifiers", "🇮🇹", [
        P("Gianluigi Donnarumma", "GK", "PSG", L.psg), P("Federico Dimarco", "DEF", "Inter Milan", L.int), P("Alessandro Bastoni", "DEF", "Inter Milan", L.int), P("Riccardo Calafiori", "DEF", "Arsenal", L.ars), P("Giovanni Di Lorenzo", "DEF", "Napoli", L.nap), P("Lorenzo Pellegrini", "MID", "Roma", L.rom17), P("Nicolò Barella", "MID", "Inter Milan", L.int), P("Jorginho", "MID", "Arsenal", L.ars), P("Federico Chiesa", "FWD", "Liverpool", L.liv), P("Gianluca Scamacca", "FWD", "Atalanta", L.ata), P("Mateo Retegui", "FWD", "Atalanta", L.ata)
    ], ["Italy", "Spain", "Portugal", "Argentina", "France"]),

    T(11, "Belgium", 2026, "current", "World Cup 2026 Qualifiers", "🇧🇪", [
        P("Thibaut Courtois", "GK", "Real Madrid", L.rm), P("Arthur Theate", "DEF", "Rennes", L.ren), P("Wout Faes", "DEF", "Leicester", L.lei), P("Zeno Debast", "DEF", "Sporting CP", L.spo), P("Timothy Castagne", "DEF", "Fulham", L.ful), P("Amadou Onana", "MID", "Aston Villa", L.avl), P("Kevin De Bruyne", "MID", "Man City", L.mci), P("Youri Tielemans", "MID", "Aston Villa", L.avl), P("Jérémy Doku", "FWD", "Man City", L.mci), P("Romelu Lukaku", "FWD", "Napoli", L.nap), P("Leandro Trossard", "FWD", "Arsenal", L.ars)
    ], ["Belgium", "Netherlands", "France", "Denmark", "Switzerland"]),

    T(12, "Croatia", 2026, "current", "World Cup 2026 Qualifiers", "🇭🇷", [
        P("Dominik Livaković", "GK", "Fenerbahçe", L.fen), P("Borna Sosa", "DEF", "Ajax", L.ajax), P("Joško Gvardiol", "DEF", "Man City", L.mci), P("Duje Ćaleta-Car", "DEF", "Lyon", L.oml), P("Josip Stanišić", "DEF", "Bayer Leverkusen", L.lev), P("Luka Modrić", "MID", "Real Madrid", L.rm), P("Mateo Kovačić", "MID", "Man City", L.mci), P("Lovro Majer", "MID", "Wolfsburg", L.wol), P("Andrej Kramarić", "FWD", "Hoffenheim", "TSG_1899_Hoffenheim_logo.svg"), P("Bruno Petković", "FWD", "Dinamo Zagreb", "GNK_Dinamo_Zagreb_logo.svg"), P("Luka Sučić", "FWD", "Real Sociedad", "Real_Sociedad_logo.svg")
    ], ["Croatia", "Serbia", "Bosnia", "Slovenia", "Austria"]),

    T(13, "Uruguay", 2026, "current", "World Cup 2026 Qualifiers", "🇺🇾", [
        P("Sergio Rochet", "GK", "Internacional", "Sport_Club_Internacional_logo.svg"), P("Mathías Olivera", "DEF", "Napoli", L.nap), P("José María Giménez", "DEF", "Atlético Madrid", L.atm), P("Ronald Araújo", "DEF", "Barcelona", L.bar), P("Nahitan Nández", "DEF", "Al Ain", "Al_Ain_FC_logo.svg"), P("Nicolás De La Cruz", "MID", "Flamengo", "Flamengo_braz_logo.svg"), P("Federico Valverde", "MID", "Real Madrid", L.rm), P("Manuel Ugarte", "MID", "Man Utd", L.mun), P("Facundo Pellistri", "FWD", "Panathinaikos", "Panathinaikos_FC_logo.svg"), P("Darwin Núñez", "FWD", "Liverpool", L.liv), P("Maximiliano Araújo", "FWD", "Sporting CP", L.spo)
    ], ["Uruguay", "Argentina", "Chile", "Paraguay", "Colombia"]),

    T(14, "Colombia", 2026, "current", "World Cup 2026 Qualifiers", "🇨🇴", [
        P("Camilo Vargas", "GK", "Atlas", "Atlas_FC_logo.svg"), P("Johan Mojica", "DEF", "Mallorca", "RCD_Mallorca_logo.svg"), P("Davinson Sánchez", "DEF", "Galatasaray", L.gal), P("Yerry Mina", "DEF", "Cagliari", "Cagliari_Calcio_1920.svg"), P("Daniel Muñoz", "DEF", "Crystal Palace", L.cry), P("Jhon Arias", "MID", "Fluminense", "Fluminense_fc_logo.svg"), P("Richard Ríos", "MID", "Palmeiras", L.pal), P("James Rodríguez", "MID", "León", "Club_Le%C3%B3n_logo.svg"), P("Luis Díaz", "FWD", "Liverpool", L.liv), P("Jhon Córdoba", "FWD", "Krasnodar", "FC_Krasnodar_logo.svg"), P("Rafael Santos Borré", "FWD", "Internacional", "Sport_Club_Internacional_logo.svg")
    ], ["Colombia", "Ecuador", "Venezuela", "Peru", "Brazil"]),

    T(15, "Mexico", 2026, "current", "World Cup 2026 (Host)", "🇲🇽", [
        P("Guillermo Ochoa", "GK", "Salernitana", "US_Salernitana_1919.svg"), P("Jesús Gallardo", "DEF", "Toluca", "Deportivo_Toluca_FC_logo.svg"), P("César Montes", "DEF", "Almería", "UD_Almer%C3%ADa_logo.svg"), P("Johan Vásquez", "DEF", "Genoa", "Genoa_CFC_crest.svg"), P("Jorge Sánchez", "DEF", "Porto", L.por), P("Edson Álvarez", "MID", "West Ham", L.whu), P("Carlos Rodríguez", "MID", "Cruz Azul", "Cruz_Azul_logo.svg"), P("Luis Chávez", "MID", "Pachuca", "CF_Pachuca_logo.svg"), P("Hirving Lozano", "FWD", "PSV", "PSV_Eindhoven.svg"), P("Raúl Jiménez", "FWD", "Fulham", L.ful), P("Santiago Giménez", "FWD", "Feyenoord", L.fey)
    ], ["Mexico", "USA", "Costa Rica", "Colombia", "Honduras"]),

    T(16, "USA", 2026, "current", "World Cup 2026 (Host)", "🇺🇸", [
        P("Matt Turner", "GK", "Nottingham Forest", "Nottingham_Forest_F.C._logo.svg"), P("Antonee Robinson", "DEF", "Fulham", L.ful), P("Chris Richards", "DEF", "Crystal Palace", L.cry), P("Tim Ream", "DEF", "Fulham", L.ful), P("Sergiño Dest", "DEF", "PSV", "PSV_Eindhoven.svg"), P("Tyler Adams", "MID", "Bournemouth", "AFC_Bournemouth_(2013).svg"), P("Weston McKennie", "MID", "Juventus", L.juv17), P("Gio Reyna", "MID", "Borussia Dortmund", L.bvb), P("Christian Pulisic", "FWD", "AC Milan", L.acm), P("Folarin Balogun", "FWD", "Monaco", L.mon), P("Timothy Weah", "FWD", "Juventus", L.juv17)
    ], ["USA", "Mexico", "Canada", "Costa Rica", "Jamaica"]),

    T(17, "Japan", 2026, "current", "World Cup 2026 Qualifiers", "🇯🇵", [
        P("Shūichi Gonda", "GK", "Shimizu S-Pulse", "Shimizu_S-Pulse_logo.svg"), P("Yuto Nagatomo", "DEF", "FC Tokyo", "FC_Tokyo_logo.svg"), P("Ko Itakura", "DEF", "Borussia Mönchengladbach", "Borussia_M%C3%B6nchengladbach_logo.svg"), P("Takehiro Tomiyasu", "DEF", "Arsenal", L.ars), P("Hiroki Sakai", "DEF", "Urawa Reds", "Urawa_Red_Diamonds_logo.svg"), P("Wataru Endo", "MID", "Liverpool", L.liv), P("Daichi Kamada", "MID", "Crystal Palace", L.cry), P("Kaoru Mitoma", "MID", "Brighton", L.bri), P("Takefusa Kubo", "FWD", "Real Sociedad", "Real_Sociedad_logo.svg"), P("Kyogo Furuhashi", "FWD", "Celtic", "Celtic_FC.svg"), P("Ritsu Doan", "FWD", "Freiburg", "SC_Freiburg_logo.svg")
    ], ["Japan", "South Korea", "Australia", "Iran", "Saudi Arabia"]),

    T(18, "Morocco", 2026, "current", "World Cup 2026 Qualifiers", "🇲🇦", [
        P("Yassine Bounou", "GK", "Al-Hilal", "Al-Hilal_SFC.svg"), P("Nayef Aguerd", "DEF", "Sevilla", L.sev), P("Romain Saïss", "DEF", "Beşiktaş", L.bes), P("Achraf Dari", "DEF", "Brest", "Stade_Brestois_29_logo.svg"), P("Achraf Hakimi", "DEF", "PSG", L.psg), P("Sofyan Amrabat", "MID", "Fenerbahçe", L.fen), P("Azzedine Ounahi", "MID", "Marseille", L.omm), P("Hakim Ziyech", "MID", "Galatasaray", L.gal), P("Sofiane Boufal", "FWD", "Al-Rayyan", "Al-Rayyan_SC_logo.svg"), P("Youssef En-Nesyri", "FWD", "Fenerbahçe", L.fen), P("Abdessamad Ezzalzouli", "FWD", "Real Betis", "Real_Betis_logo.svg")
    ], ["Morocco", "Algeria", "Tunisia", "Senegal", "Egypt"]),

    T(19, "Switzerland", 2026, "current", "World Cup 2026 Qualifiers", "🇨🇭", [
        P("Yann Sommer", "GK", "Inter Milan", L.int), P("Ricardo Rodríguez", "DEF", "Torino", "Torino_FC_Logo.svg"), P("Manuel Akanji", "DEF", "Man City", L.mci), P("Nico Elvedi", "DEF", "Borussia Mönchengladbach", "Borussia_M%C3%B6nchengladbach_logo.svg"), P("Silvan Widmer", "DEF", "Mainz", "1._FSV_Mainz_05_Logo.svg"), P("Granit Xhaka", "MID", "Bayer Leverkusen", L.lev), P("Denis Zakaria", "MID", "Monaco", L.mon), P("Xherdan Shaqiri", "MID", "Basel", "FC_Basel_logo.svg"), P("Dan Ndoye", "FWD", "Bologna", "Bologna_FC_1909_logo.svg"), P("Breel Embolo", "FWD", "Monaco", L.mon), P("Noah Okafor", "FWD", "AC Milan", L.acm)
    ], ["Switzerland", "Austria", "Germany", "Denmark", "Sweden"]),

    T(20, "Denmark", 2026, "current", "World Cup 2026 Qualifiers", "🇩🇰", [
        P("Kasper Schmeichel", "GK", "Celtic", "Celtic_FC.svg"), P("Joakim Mæhle", "DEF", "Wolfsburg", L.wol), P("Andreas Christensen", "DEF", "Barcelona", L.bar), P("Simon Kjær", "DEF", "AC Milan", L.acm), P("Rasmus Kristensen", "DEF", "Roma", L.rom17), P("Pierre-Emile Højbjerg", "MID", "Marseille", L.omm), P("Christian Eriksen", "MID", "Man Utd", L.mun), P("Morten Hjulmand", "MID", "Sporting CP", L.spo), P("Mikkel Damsgaard", "FWD", "Brentford", "Brentford_FC_crest.svg"), P("Jonas Wind", "FWD", "Wolfsburg", L.wol), P("Rasmus Højlund", "FWD", "Man Utd", L.mun)
    ], ["Denmark", "Sweden", "Norway", "Finland", "Netherlands"]),

    T(21, "South Korea", 2026, "current", "World Cup 2026 Qualifiers", "🇰🇷", [
        P("Kim Seung-gyu", "GK", "Al-Shabab", "Al-Shabab_FC_(Riyadh)_logo.svg"), P("Kim Jin-su", "DEF", "Jeonbuk", "Jeonbuk_Hyundai_Motors_FC.svg"), P("Kim Min-jae", "DEF", "Bayern Munich", L.bay), P("Kwon Kyung-won", "DEF", "Gamba Osaka", "Gamba_Osaka_logo.svg"), P("Lee Ki-je", "DEF", "Ulsan", "Ulsan_Hyundai_FC.svg"), P("Hwang In-beom", "MID", "Feyenoord", L.fey), P("Lee Kang-in", "MID", "PSG", L.psg), P("Jung Woo-young", "MID", "Al-Sadd", "Al_Sadd_SC_logo.svg"), P("Son Heung-min", "FWD", "Tottenham", L.tot), P("Hwang Hee-chan", "FWD", "Wolverhampton", "Wolverhampton_Wanderers.svg"), P("Cho Gue-sung", "FWD", "Midtjylland", "FC_Midtjylland_logo.svg")
    ], ["South Korea", "Japan", "Australia", "Iran", "Saudi Arabia"]),

    T(22, "Senegal", 2026, "current", "World Cup 2026 Qualifiers", "🇸🇳", [
        P("Édouard Mendy", "GK", "Al-Ahli", "Al-Ahli_Saudi_FC_logo.svg"), P("Abdou Diallo", "DEF", "Lyon", L.oml), P("Kalidou Koulibaly", "DEF", "Al-Hilal", "Al-Hilal_SFC.svg"), P("Abdoulaye Seck", "DEF", "Metz", "FC_Metz_logo.svg"), P("Ismaïla Sarr", "DEF", "Palace", L.cry), P("Nampalys Mendy", "MID", "Leicester", L.lei), P("Idrissa Gueye", "MID", "Everton", L.evi), P("Pape Matar Sarr", "MID", "Tottenham", L.tot), P("Sadio Mané", "FWD", "Al-Nassr", L.aln), P("Ismaïla Sarr", "FWD", "Crystal Palace", L.cry), P("Nicolas Jackson", "FWD", "Chelsea", L.che)
    ], ["Senegal", "Morocco", "Nigeria", "Cameroon", "Ghana"]),

    T(23, "Nigeria", 2026, "current", "World Cup 2026 Qualifiers", "🇳🇬", [
        P("Francis Uzoho", "GK", "Almería", "UD_Almer%C3%ADa_logo.svg"), P("Ola Aina", "DEF", "Nottingham Forest", "Nottingham_Forest_F.C._logo.svg"), P("William Troost-Ekong", "DEF", "Al-Kholood", "Al-Kholood_FC_logo.svg"), P("Calvin Bassey", "DEF", "Fulham", L.ful), P("Bright Osayi-Samuel", "DEF", "Fenerbahçe", L.fen), P("Wilfred Ndidi", "MID", "Leicester", L.lei), P("Alex Iwobi", "MID", "Fulham", L.ful), P("Joe Aribo", "MID", "Southampton", "FC_Southampton.svg"), P("Samuel Chukwueze", "FWD", "AC Milan", L.acm), P("Victor Osimhen", "FWD", "Galatasaray", L.gal), P("Ademola Lookman", "FWD", "Atalanta", L.ata)
    ], ["Nigeria", "Cameroon", "Ghana", "Senegal", "Egypt"]),

    T(24, "Austria", 2026, "current", "World Cup 2026 Qualifiers", "🇦🇹", [
        P("Patrick Pentz", "GK", "Braga", "SC_Braga_logo.svg"), P("Phillipp Mwene", "DEF", "Mainz", "1._FSV_Mainz_05_Logo.svg"), P("Maximilian Wöber", "DEF", "Leeds", "Leeds_United_F.C._logo.svg"), P("Kevin Danso", "DEF", "Lens", "RC_Lens_logo.svg"), P("Stefan Posch", "DEF", "Bologna", "Bologna_FC_1909_logo.svg"), P("Konrad Laimer", "MID", "Bayern Munich", L.bay), P("Florian Grillitsch", "MID", "Hoffenheim", "TSG_1899_Hoffenheim_logo.svg"), P("Marcel Sabitzer", "MID", "Borussia Dortmund", L.bvb), P("Michael Gregoritsch", "FWD", "Freiburg", "SC_Freiburg_logo.svg"), P("Marko Arnautović", "FWD", "Inter Milan", L.int), P("Christoph Baumgartner", "FWD", "RB Leipzig", L.rbl)
    ], ["Austria", "Switzerland", "Germany", "Czech Republic", "Hungary"]),

    T(25, "Canada", 2026, "current", "World Cup 2026 (Host)", "🇨🇦", [
        P("Milan Borjan", "GK", "Red Star", "Red_Star_Belgrade_crest.svg"), P("Sam Adekugbe", "DEF", "Hatayspor", "Hatayspor.svg"), P("Kamal Miller", "DEF", "Portland Timbers", "Portland_Timbers_logo.svg"), P("Moise Bombito", "DEF", "Nice", "OGC_Nice_logo.svg"), P("Alistair Johnston", "DEF", "Celtic", "Celtic_FC.svg"), P("Stephen Eustáquio", "MID", "Porto", L.por), P("Ismael Koné", "MID", "Marseille", L.omm), P("Tajon Buchanan", "MID", "Inter Milan", L.int), P("Alphonso Davies", "FWD", "Bayern Munich", L.bay), P("Jonathan David", "FWD", "Lille", "LOSC_Lille_logo.svg"), P("Cyle Larin", "FWD", "Mallorca", "RCD_Mallorca_logo.svg")
    ], ["Canada", "USA", "Mexico", "Jamaica", "Honduras"]),

    // ═══ ICONIC (25 teams) ═══
    T(26, "Turkey", 2002, "iconic", "World Cup 2002", "🇹🇷", [
        P("Rüştü Reçber", "GK", "Fenerbahçe", L.fen), P("Hakan Ünsal", "DEF", "Galatasaray", L.gal), P("Alpay Özalan", "DEF", "Aston Villa", L.avl), P("Bülent Korkmaz", "DEF", "Galatasaray", L.gal), P("Fatih Akyel", "DEF", "Fenerbahçe", L.fen), P("Emre Belözoğlu", "MID", "Inter Milan", L.int), P("Tugay Kerimoğlu", "MID", "Blackburn", "Blackburn_Rovers.svg"), P("Yıldıray Baştürk", "MID", "Bayer Leverkusen", L.lev), P("Hasan Şaş", "FWD", "Galatasaray", L.gal), P("Hakan Şükür", "FWD", "Parma", "Parma_Calcio_1913.svg"), P("İlhan Mansız", "FWD", "Beşiktaş", L.bes)
    ], ["Turkey", "South Korea", "Japan", "Senegal", "USA"]),

    T(27, "Brazil", 1998, "iconic", "World Cup 1998", "🇧🇷", [
        P("Taffarel", "GK", "Galatasaray", L.gal), P("Roberto Carlos", "DEF", "Real Madrid", L.rm), P("Junior Baiano", "DEF", "Perugia", "AC_Perugia_Calcio_logo.svg"), P("Aldair", "DEF", "Roma", L.rom00), P("Cafu", "DEF", "Roma", L.rom00), P("Rivaldo", "MID", "Barcelona", L.bar), P("Dunga", "MID", "Jubilo Iwata", "Jubilo_Iwata_logo.svg"), P("César Sampaio", "MID", "Yokohama Flügels", "Yokohama_Fl%C3%BCgels.svg"), P("Leonardo", "FWD", "AC Milan", L.acm), P("Ronaldo", "FWD", "Inter Milan", L.int), P("Bebeto", "FWD", "Botafogo", "Botafogo_de_Futebol_e_Regatas_logo.svg")
    ], ["Brazil", "France", "Netherlands", "Italy", "Croatia"]),

    T(28, "Spain", 2010, "iconic", "World Cup 2010", "🇪🇸", [
        P("Iker Casillas", "GK", "Real Madrid", L.rm), P("Joan Capdevila", "DEF", "Villarreal", L.vil), P("Carles Puyol", "DEF", "Barcelona", L.bar), P("Gerard Piqué", "DEF", "Barcelona", L.bar), P("Sergio Ramos", "DEF", "Real Madrid", L.rm), P("Andrés Iniesta", "MID", "Barcelona", L.bar), P("Sergio Busquets", "MID", "Barcelona", L.bar), P("Xavi", "MID", "Barcelona", L.bar), P("Pedro", "FWD", "Barcelona", L.bar), P("David Villa", "FWD", "Valencia", L.val), P("Fernando Torres", "FWD", "Liverpool", L.liv)
    ], ["Spain", "Netherlands", "Germany", "Uruguay", "Argentina"]),

    T(29, "Italy", 2006, "iconic", "World Cup 2006", "🇮🇹", [
        P("Gianluigi Buffon", "GK", "Juventus", L.juv04), P("Fabio Grosso", "DEF", "Palermo", "US_Citt%C3%A0_di_Palermo_Logo.svg"), P("Marco Materazzi", "DEF", "Inter Milan", L.int), P("Fabio Cannavaro", "DEF", "Real Madrid", L.rm), P("Gianluca Zambrotta", "DEF", "Juventus", L.juv04), P("Andrea Pirlo", "MID", "AC Milan", L.acm), P("Gennaro Gattuso", "MID", "AC Milan", L.acm), P("Simone Perrotta", "MID", "Roma", L.rom00), P("Francesco Totti", "FWD", "Roma", L.rom00), P("Luca Toni", "FWD", "Fiorentina", "ACF_Fiorentina_2002_logo.svg"), P("Alessandro Del Piero", "FWD", "Juventus", L.juv04)
    ], ["Italy", "France", "Germany", "Portugal", "Brazil"]),

    T(30, "France", 1998, "iconic", "World Cup 1998", "🇫🇷", [
        P("Fabien Barthez", "GK", "Monaco", L.mon), P("Bixente Lizarazu", "DEF", "Bayern Munich", L.bay), P("Marcel Desailly", "DEF", "AC Milan", L.acm), P("Laurent Blanc", "DEF", "Marseille", L.omm), P("Lilian Thuram", "DEF", "Parma", "Parma_Calcio_1913.svg"), P("Didier Deschamps", "MID", "Juventus", L.juv04), P("Emmanuel Petit", "MID", "Arsenal", L.ars), P("Zinedine Zidane", "MID", "Juventus", L.juv04), P("Youri Djorkaeff", "FWD", "Inter Milan", L.int), P("Stéphane Guivarc'h", "FWD", "Auxerre", "AJ_Auxerre_Logo.svg"), P("Thierry Henry", "FWD", "Monaco", L.mon)
    ], ["France", "Brazil", "Italy", "Croatia", "Netherlands"]),

    T(31, "Brazil", 2002, "iconic", "World Cup 2002", "🇧🇷", [
        P("Marcos", "GK", "Palmeiras", L.pal), P("Roberto Carlos (02)", "DEF", "Real Madrid", L.rm), P("Edmílson", "DEF", "Lyon", L.oml), P("Lúcio", "DEF", "Bayer Leverkusen", L.lev), P("Cafu (02)", "DEF", "Roma", L.rom00), P("Gilberto Silva", "MID", "Atlético Mineiro", "Atletico_mineiro_galo.svg"), P("Rivaldo (02)", "MID", "Barcelona", L.bar), P("Ronaldinho", "MID", "PSG", L.psg), P("Ronaldo (02)", "FWD", "Inter Milan", L.int), P("Kléberson", "FWD", "Athletico Paranaense", "Club_Athletico_Paranaense_logo.svg"), P("Denílson", "FWD", "Real Betis", "Real_Betis_logo.svg")
    ], ["Brazil", "Germany", "Turkey", "South Korea", "Spain"]),

    T(32, "Germany", 2014, "iconic", "World Cup 2014", "🇩🇪", [
        P("Manuel Neuer", "GK", "Bayern Munich", L.bay), P("Benedikt Höwedes", "DEF", "Schalke 04", "FC_Schalke_04_Logo.svg"), P("Jérôme Boateng", "DEF", "Bayern Munich", L.bay), P("Mats Hummels", "DEF", "Borussia Dortmund", L.bvb), P("Philipp Lahm", "DEF", "Bayern Munich", L.bay), P("Bastian Schweinsteiger", "MID", "Bayern Munich", L.bay), P("Toni Kroos", "MID", "Bayern Munich", L.bay), P("Sami Khedira", "MID", "Real Madrid", L.rm), P("Thomas Müller", "FWD", "Bayern Munich", L.bay), P("Miroslav Klose", "FWD", "Lazio", "SS_Lazio.svg"), P("Mario Götze", "FWD", "Bayern Munich", L.bay)
    ], ["Germany", "Argentina", "Netherlands", "Brazil", "France"]),

    T(33, "Croatia", 2018, "iconic", "World Cup 2018", "🇭🇷", [
        P("Danijel Subašić", "GK", "Monaco", L.mon), P("Ivan Strinić", "DEF", "Sampdoria", "UC_Sampdoria_logo.svg"), P("Dejan Lovren", "DEF", "Liverpool", L.liv), P("Domagoj Vida", "DEF", "Beşiktaş", L.bes), P("Šime Vrsaljko", "DEF", "Atlético Madrid", L.atm), P("Marcelo Brozović", "MID", "Inter Milan", L.int), P("Luka Modrić (18)", "MID", "Real Madrid", L.rm), P("Ivan Rakitić", "MID", "Barcelona", L.bar), P("Ivan Perišić", "FWD", "Inter Milan", L.int), P("Mario Mandžukić", "FWD", "Juventus", L.juv17), P("Ante Rebić", "FWD", "Eintracht Frankfurt", "Eintracht_Frankfurt_Logo.svg")
    ], ["Croatia", "France", "Belgium", "England", "Russia"]),

    T(34, "Netherlands", 2010, "iconic", "World Cup 2010", "🇳🇱", [
        P("Maarten Stekelenburg", "GK", "Ajax", L.ajax), P("Giovanni van Bronckhorst", "DEF", "Feyenoord", L.fey), P("Joris Mathijsen", "DEF", "Hamburg", "Hamburger_SV_logo.svg"), P("John Heitinga", "DEF", "Everton", L.evi), P("Gregory van der Wiel", "DEF", "Ajax", L.ajax), P("Nigel de Jong", "MID", "Man City", L.mci), P("Mark van Bommel", "MID", "Bayern Munich", L.bay), P("Wesley Sneijder", "MID", "Inter Milan", L.int), P("Dirk Kuyt", "FWD", "Liverpool", L.liv), P("Robin van Persie", "FWD", "Arsenal", L.ars), P("Arjen Robben", "FWD", "Bayern Munich", L.bay)
    ], ["Netherlands", "Spain", "Germany", "Uruguay", "Brazil"]),

    T(35, "Portugal", 2016, "iconic", "Euro 2016", "🇵🇹", [
        P("Rui Patrício", "GK", "Sporting CP", L.spo), P("Raphaël Guerreiro", "DEF", "Lorient", "FC_Lorient_logo.svg"), P("José Fonte", "DEF", "Southampton", "FC_Southampton.svg"), P("Pepe", "DEF", "Real Madrid", L.rm), P("Cédric Soares", "DEF", "Southampton", "FC_Southampton.svg"), P("João Mário", "MID", "Sporting CP", L.spo), P("William Carvalho", "MID", "Sporting CP", L.spo), P("Adrien Silva", "MID", "Sporting CP", L.spo), P("Nani", "FWD", "Fenerbahçe", L.fen), P("Cristiano Ronaldo (16)", "FWD", "Real Madrid", L.rm), P("Éder", "FWD", "Lille", "LOSC_Lille_logo.svg")
    ], ["Portugal", "France", "Wales", "Germany", "Belgium"]),

    T(36, "France", 2018, "iconic", "World Cup 2018", "🇫🇷", [
        P("Hugo Lloris", "GK", "Tottenham", L.tot), P("Lucas Hernández", "DEF", "Atlético Madrid", L.atm), P("Samuel Umtiti", "DEF", "Barcelona", L.bar), P("Raphaël Varane", "DEF", "Real Madrid", L.rm), P("Benjamin Pavard", "DEF", "Stuttgart", L.stu), P("Blaise Matuidi", "MID", "Juventus", L.juv17), P("N'Golo Kanté", "MID", "Chelsea", L.che), P("Paul Pogba", "MID", "Man Utd", L.mun), P("Antoine Griezmann (18)", "FWD", "Atlético Madrid", L.atm), P("Olivier Giroud", "FWD", "Chelsea", L.che), P("Kylian Mbappé (18)", "FWD", "PSG", L.psg)
    ], ["France", "Croatia", "Belgium", "Brazil", "England"]),

    T(37, "Argentina", 2022, "iconic", "World Cup 2022", "🇦🇷", [
        P("Emiliano Martínez (22)", "GK", "Aston Villa", L.avl), P("Nicolás Tagliafico (22)", "DEF", "Lyon", L.oml), P("Nicolás Otamendi", "DEF", "Benfica", L.ben), P("Cristian Romero (22)", "DEF", "Tottenham", L.tot), P("Nahuel Molina (22)", "DEF", "Atlético Madrid", L.atm), P("Enzo Fernández (22)", "MID", "Benfica", L.ben), P("Rodrigo De Paul (22)", "MID", "Atlético Madrid", L.atm), P("Alexis Mac Allister (22)", "MID", "Brighton", L.bri), P("Ángel Di María", "FWD", "Juventus", L.juv17), P("Lionel Messi (22)", "FWD", "PSG", L.psg), P("Julián Álvarez (22)", "FWD", "Man City", L.mci)
    ], ["Argentina", "France", "Croatia", "Morocco", "Brazil"]),

    T(38, "Netherlands", 1974, "iconic", "World Cup 1974", "🇳🇱", [
        P("Jan Jongbloed", "GK", "FC Amsterdam", "FC_Amsterdam.svg"), P("Ruud Krol", "DEF", "Ajax", L.ajax), P("Wim Rijsbergen", "DEF", "Feyenoord", L.fey), P("Barry Hulshoff", "DEF", "Ajax", L.ajax), P("Wim Suurbier", "DEF", "Ajax", L.ajax), P("Wim Jansen", "MID", "Feyenoord", L.fey), P("Johan Neeskens", "MID", "Ajax", L.ajax), P("Willem van Hanegem", "MID", "Feyenoord", L.fey), P("Rob Rensenbrink", "FWD", "Anderlecht", "RSC_Anderlecht_logo.svg"), P("Johan Cruyff", "FWD", "Barcelona", L.bar), P("Johnny Rep", "FWD", "Ajax", L.ajax)
    ], ["Netherlands", "Germany", "Brazil", "Poland", "Sweden"]),

    T(39, "Brazil", 1970, "iconic", "World Cup 1970", "🇧🇷", [
        P("Félix", "GK", "Fluminense", "Fluminense_fc_logo.svg"), P("Everaldo", "DEF", "Grêmio", "Gremio_logo.svg"), P("Brito", "DEF", "Flamengo", "Flamengo_braz_logo.svg"), P("Wilson Piazza", "DEF", "Cruzeiro", "Cruzeiro_Esporte_Clube_(logo).svg"), P("Carlos Alberto", "DEF", "Santos", "Santos_Logo.svg"), P("Clodoaldo", "MID", "Santos", "Santos_Logo.svg"), P("Gérson", "MID", "São Paulo", "Sao_Paulo_FC.svg"), P("Rivelino", "MID", "Corinthians", "Sport_Club_Corinthians_Paulista_crest.svg"), P("Jairzinho", "FWD", "Botafogo", "Botafogo_de_Futebol_e_Regatas_logo.svg"), P("Tostão", "FWD", "Cruzeiro", "Cruzeiro_Esporte_Clube_(logo).svg"), P("Pelé", "FWD", "Santos", "Santos_Logo.svg")
    ], ["Brazil", "Italy", "Germany", "Uruguay", "England"]),

    T(40, "Argentina", 1986, "iconic", "World Cup 1986", "🇦🇷", [
        P("Nery Pumpido", "GK", "River Plate", "River_Plate_logo.svg"), P("José Luis Brown", "DEF", "Estudiantes", "Estudiantes_de_La_Plata_logo.svg"), P("Oscar Ruggeri", "DEF", "River Plate", "River_Plate_logo.svg"), P("José Cuciuffo", "DEF", "Vélez Sársfield", "Velez_Sarsfield_logo.svg"), P("Julio Olarticoechea", "DEF", "Racing Club", "Racing_Club_logo.svg"), P("Héctor Enrique", "MID", "River Plate", "River_Plate_logo.svg"), P("Sergio Batista", "MID", "Argentinos Juniors", "Argentinos_Juniors_logo.svg"), P("Jorge Burruchaga", "MID", "Nantes", "FC_Nantes_logo.svg"), P("Diego Maradona", "FWD", "Napoli", L.nap), P("Jorge Valdano", "FWD", "Real Madrid", L.rm), P("Pedro Pasculli", "FWD", "Lecce", "US_Lecce_logo.svg")
    ], ["Argentina", "Germany", "France", "Brazil", "England"]),

    T(41, "France", 2006, "iconic", "World Cup 2006", "🇫🇷", [
        P("Fabien Barthez (06)", "GK", "Marseille", L.omm), P("Éric Abidal", "DEF", "Lyon", L.oml), P("Lilian Thuram (06)", "DEF", "Juventus", L.juv04), P("William Gallas", "DEF", "Chelsea", L.che), P("Willy Sagnol", "DEF", "Bayern Munich", L.bay), P("Claude Makélélé", "MID", "Chelsea", L.che), P("Patrick Vieira", "MID", "Juventus", L.juv04), P("Zinedine Zidane (06)", "MID", "Real Madrid", L.rm), P("Franck Ribéry", "FWD", "Marseille", L.omm), P("Thierry Henry (06)", "FWD", "Arsenal", L.ars), P("Florent Malouda", "FWD", "Lyon", L.oml)
    ], ["France", "Italy", "Portugal", "Brazil", "Germany"]),

    T(42, "Brazil", 1994, "iconic", "World Cup 1994", "🇧🇷", [
        P("Taffarel (94)", "GK", "Reggiana", "AC_Reggiana_1919.svg"), P("Branco", "DEF", "Fluminense", "Fluminense_fc_logo.svg"), P("Aldair (94)", "DEF", "Roma", L.rom00), P("Márcio Santos", "DEF", "Bordeaux", "Girondins_de_Bordeaux_logo.svg"), P("Jorginho", "DEF", "Bayern Munich", L.bay), P("Mauro Silva", "MID", "Deportivo La Coruña", "RC_Deportivo_La_Coru%C3%B1a_logo.svg"), P("Mazinho", "MID", "Palmeiras", L.pal), P("Zinho", "MID", "Palmeiras", L.pal), P("Romário", "FWD", "Barcelona", L.bar), P("Bebeto (94)", "FWD", "Deportivo La Coruña", "RC_Deportivo_La_Coru%C3%B1a_logo.svg"), P("Cafu (94)", "FWD", "São Paulo", "Sao_Paulo_FC.svg")
    ], ["Brazil", "Italy", "Sweden", "Bulgaria", "Netherlands"]),

    T(43, "England", 2006, "iconic", "World Cup 2006", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", [
        P("Paul Robinson", "GK", "Tottenham", L.tot), P("Ashley Cole", "DEF", "Arsenal", L.ars), P("John Terry", "DEF", "Chelsea", L.che), P("Rio Ferdinand", "DEF", "Man Utd", L.mun), P("Gary Neville", "DEF", "Man Utd", L.mun), P("Steven Gerrard", "MID", "Liverpool", L.liv), P("Frank Lampard", "MID", "Chelsea", L.che), P("David Beckham", "MID", "Real Madrid", L.rm), P("Joe Cole", "FWD", "Chelsea", L.che), P("Wayne Rooney", "FWD", "Man Utd", L.mun), P("Michael Owen", "FWD", "Newcastle", L.new)
    ], ["England", "Germany", "Brazil", "Portugal", "Argentina"]),

    T(44, "Italy", 1982, "iconic", "World Cup 1982", "🇮🇹", [
        P("Dino Zoff", "GK", "Juventus", L.juv04), P("Antonio Cabrini", "DEF", "Juventus", L.juv04), P("Gaetano Scirea", "DEF", "Juventus", L.juv04), P("Claudio Gentile", "DEF", "Juventus", L.juv04), P("Giuseppe Bergomi", "DEF", "Inter Milan", L.int), P("Marco Tardelli", "MID", "Juventus", L.juv04), P("Giancarlo Antognoni", "MID", "Fiorentina", "ACF_Fiorentina_2002_logo.svg"), P("Bruno Conti", "MID", "Roma", L.rom00), P("Paolo Rossi", "FWD", "Juventus", L.juv04), P("Francesco Graziani", "FWD", "Fiorentina", "ACF_Fiorentina_2002_logo.svg"), P("Alessandro Altobelli", "FWD", "Inter Milan", L.int)
    ], ["Italy", "Germany", "Brazil", "Poland", "France"]),

    T(45, "West Germany", 1990, "iconic", "World Cup 1990", "🇩🇪", [
        P("Bodo Illgner", "GK", "Köln", "1._FC_K%C3%B6ln_Logo.svg"), P("Andreas Brehme", "DEF", "Inter Milan", L.int), P("Jürgen Kohler", "DEF", "Bayern Munich", L.bay), P("Klaus Augenthaler", "DEF", "Bayern Munich", L.bay), P("Thomas Berthold", "DEF", "Roma", L.rom00), P("Lothar Matthäus", "MID", "Inter Milan", L.int), P("Thomas Häßler", "MID", "Köln", "1._FC_K%C3%B6ln_Logo.svg"), P("Pierre Littbarski", "MID", "Köln", "1._FC_K%C3%B6ln_Logo.svg"), P("Rudi Völler", "FWD", "Roma", L.rom00), P("Jürgen Klinsmann", "FWD", "Inter Milan", L.int), P("Karl-Heinz Rummenigge", "FWD", "Servette", "Servette_FC.svg")
    ], ["Germany", "Argentina", "Italy", "England", "Cameroon"]),

    T(46, "Denmark", 1992, "iconic", "Euro 1992", "🇩🇰", [
        P("Peter Schmeichel", "GK", "Man Utd", L.mun), P("John Sivebæk", "DEF", "Mónaco", L.mon), P("Lars Olsen", "DEF", "Trabzonspor", "Trabzonspor_logo.svg"), P("Kent Nielsen", "DEF", "Aarhus", "Aarhus_GF_logo.svg"), P("Henrik Andersen", "DEF", "Köln", "1._FC_K%C3%B6ln_Logo.svg"), P("Kim Vilfort", "MID", "Brøndby", "Brondby_IF_logo.svg"), P("John Jensen", "MID", "Brøndby", "Brondby_IF_logo.svg"), P("Brian Laudrup", "MID", "Fiorentina", "ACF_Fiorentina_2002_logo.svg"), P("Flemming Povlsen", "FWD", "Borussia Dortmund", L.bvb), P("Michael Laudrup", "FWD", "Barcelona", L.bar), P("Brian Steen Nielsen", "FWD", "Odense", "Odense_Boldklub.svg")
    ], ["Denmark", "Germany", "Netherlands", "Sweden", "France"]),

    T(47, "South Korea", 2002, "iconic", "World Cup 2002", "🇰🇷", [
        P("Lee Woon-jae", "GK", "Suwon Bluewings", "Suwon_Samsung_Bluewings.svg"), P("Choi Jin-cheul", "DEF", "Jeonbuk", "Jeonbuk_Hyundai_Motors_FC.svg"), P("Hong Myung-bo", "DEF", "Pohang Steelers", "Pohang_Steelers.svg"), P("Kim Tae-young", "DEF", "Seongnam Ilhwa", "Seongnam_FC.svg"), P("Song Chong-gug", "DEF", "Feyenoord", L.fey), P("Yoo Sang-chul", "MID", "Yokohama F. Marinos", "Yokohama_F._Marinos_logo.svg"), P("Park Ji-sung", "MID", "PSV", "PSV_Eindhoven.svg"), P("Lee Young-pyo", "MID", "PSV", "PSV_Eindhoven.svg"), P("Ahn Jung-hwan", "FWD", "Perugia", "AC_Perugia_Calcio_logo.svg"), P("Seol Ki-hyeon", "FWD", "Anderlecht", "RSC_Anderlecht_logo.svg"), P("Cha Du-ri", "FWD", "Bayer Leverkusen", L.lev)
    ], ["South Korea", "Turkey", "Germany", "Spain", "USA"]),

    T(48, "Greece", 2004, "iconic", "Euro 2004", "🇬🇷", [
        P("Antonios Nikopolidis", "GK", "Olympiacos", "Olympiacos_FC_logo.svg"), P("Takis Fyssas", "DEF", "Benfica", L.ben), P("Traianos Dellas", "DEF", "Roma", L.rom00), P("Michalis Kapsis", "DEF", "Bordeaux", "Girondins_de_Bordeaux_logo.svg"), P("Giourkas Seitaridis", "DEF", "Panathinaikos", "Panathinaikos_FC_logo.svg"), P("Theodoros Zagorakis", "MID", "AEK Athens", "AEK_Athens_FC_logo.svg"), P("Kostas Katsouranis", "MID", "AEK Athens", "AEK_Athens_FC_logo.svg"), P("Angelos Basinas", "MID", "Panathinaikos", "Panathinaikos_FC_logo.svg"), P("Angelos Charisteas", "FWD", "Werder Bremen", "SV_Werder_Bremen_logo.svg"), P("Zisis Vryzas", "FWD", "Fiorentina", "ACF_Fiorentina_2002_logo.svg"), P("Stylianos Giannakopoulos", "FWD", "Bolton", "Bolton_Wanderers_FC_logo.svg")
    ], ["Greece", "Portugal", "Czech Republic", "Netherlands", "France"]),

    T(49, "Japan", 2002, "iconic", "World Cup 2002", "🇯🇵", [
        P("Seigō Narazaki", "GK", "Nagoya Grampus", "Nagoya_Grampus_logo.svg"), P("Naoki Matsuda", "DEF", "Yokohama F. Marinos", "Yokohama_F._Marinos_logo.svg"), P("Tsuneyasu Miyamoto", "DEF", "Gamba Osaka", "Gamba_Osaka_logo.svg"), P("Koji Nakata", "DEF", "Marseille", L.omm), P("Alex Santos", "DEF", "Shimizu S-Pulse", "Shimizu_S-Pulse_logo.svg"), P("Tomokazu Myojin", "MID", "Gamba Osaka", "Gamba_Osaka_logo.svg"), P("Junichi Inamoto", "MID", "Arsenal", L.ars), P("Hidetoshi Nakata", "MID", "Parma", "Parma_Calcio_1913.svg"), P("Akinori Nishizawa", "FWD", "Cerezo Osaka", "Cerezo_Osaka_logo.svg"), P("Takayuki Suzuki", "FWD", "Kashima Antlers", "Kashima_Antlers_logo.svg"), P("Atsushi Yanagisawa", "FWD", "Jubilo Iwata", "Jubilo_Iwata_logo.svg")
    ], ["Japan", "South Korea", "Turkey", "Senegal", "USA"]),

    T(50, "Cameroon", 1990, "iconic", "World Cup 1990", "🇨🇲", [
        P("Thomas N'Kono", "GK", "Espanyol", "RCD_Espanyol_logo.svg"), P("Benjamin Massing", "DEF", "Créteil", "US_Creteil-Lusitanos_logo.svg"), P("Victor N'Dip", "DEF", "Tonnerre Yaoundé", "TonnereYaounde.svg"), P("Emmanuel Kundé", "DEF", "Canon Yaoundé", "Canon_Yaounde_logo.svg"), P("Jules Onana", "DEF", "Racing Lens", "RC_Lens_logo.svg"), P("Louis-Paul Mfédé", "MID", "Tonnerre Yaoundé", "TonnereYaounde.svg"), P("Émile Mbuh Gemuh", "MID", "Racing Lens", "RC_Lens_logo.svg"), P("Cyrille Makanaky", "MID", "Toulouse", "Toulouse_FC.svg"), P("Roger Milla", "FWD", "Tonnerre Yaoundé", "TonnereYaounde.svg"), P("François Omam-Biyik", "FWD", "Rennes", L.ren), P("Eugène Ekéké", "FWD", "Valenciennes", "US_Valenciennes_FC.svg")
    ], ["Cameroon", "Argentina", "Colombia", "Romania", "England"]),
];

const out = path.join(__dirname, '..', 'src', 'data', 'national_teams.json');
fs.writeFileSync(out, JSON.stringify(teams, null, 2), 'utf-8');
console.log(`Wrote ${teams.length} teams to ${out}`);
