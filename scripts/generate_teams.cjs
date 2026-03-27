const fs = require('fs');
const path = require('path');
const W = (n, pos, club, logo) => ({ name: n, position: pos, club, clubLogo: `https://en.wikipedia.org/wiki/Special:FilePath/${logo}` });

const teams = [
    // ═══ CURRENT 2026 ═══
    {
        id: 1, team: "Argentina", year: 2026, mode: "current", tournament: "World Cup 2026 Qualifiers", flag: "🇦🇷",
        players: [
            W("Emiliano Martínez", "GK", "Aston Villa", "Aston_Villa_FC_crest_(2016).svg"),
            W("Nicolás Tagliafico", "DEF", "Lyon", "Olympique_Lyonnais_logo.svg"),
            W("Lisandro Martínez", "DEF", "Man Utd", "Manchester_United_FC_crest.svg"),
            W("Cristian Romero", "DEF", "Tottenham", "Tottenham_Hotspur.svg"),
            W("Nahuel Molina", "DEF", "Atlético Madrid", "Atletico_Madrid_2017_logo.svg"),
            W("Alexis Mac Allister", "MID", "Liverpool", "Liverpool_FC.svg"),
            W("Enzo Fernández", "MID", "Chelsea", "Chelsea_FC.svg"),
            W("Rodrigo De Paul", "MID", "Atlético Madrid", "Atletico_Madrid_2017_logo.svg"),
            W("Lautaro Martínez", "FWD", "Inter Milan", "FC_Internazionale_Milano_2021.svg"),
            W("Julián Álvarez", "FWD", "Atlético Madrid", "Atletico_Madrid_2017_logo.svg"),
            W("Lionel Messi", "FWD", "Inter Miami", "Inter_Miami_CF_logo.svg"),
        ], options: ["Argentina", "Uruguay", "Brazil", "Colombia", "Chile"]
    },

    {
        id: 2, team: "France", year: 2026, mode: "current", tournament: "World Cup 2026 Qualifiers", flag: "🇫🇷",
        players: [
            W("Mike Maignan", "GK", "AC Milan", "Logo_of_AC_Milan.svg"),
            W("Theo Hernández", "DEF", "AC Milan", "Logo_of_AC_Milan.svg"),
            W("Dayot Upamecano", "DEF", "Bayern Munich", "FC_Bayern_M%C3%BCnchen_logo_(2017).svg"),
            W("William Saliba", "DEF", "Arsenal", "Arsenal_FC.svg"),
            W("Jules Koundé", "DEF", "Barcelona", "FC_Barcelona_(crest).svg"),
            W("Eduardo Camavinga", "MID", "Real Madrid", "Real_Madrid_CF.svg"),
            W("Aurélien Tchouaméni", "MID", "Real Madrid", "Real_Madrid_CF.svg"),
            W("Antoine Griezmann", "MID", "Atlético Madrid", "Atletico_Madrid_2017_logo.svg"),
            W("Ousmane Dembélé", "FWD", "PSG", "Paris_Saint-Germain_F.C..svg"),
            W("Kylian Mbappé", "FWD", "Real Madrid", "Real_Madrid_CF.svg"),
            W("Marcus Thuram", "FWD", "Inter Milan", "FC_Internazionale_Milano_2021.svg"),
        ], options: ["France", "Belgium", "Netherlands", "Portugal", "Germany"]
    },

    {
        id: 3, team: "Turkey", year: 2026, mode: "current", tournament: "World Cup 2026 Qualifiers", flag: "🇹🇷",
        players: [
            W("Altay Bayındır", "GK", "Man Utd", "Manchester_United_FC_crest.svg"),
            W("Ferdi Kadıoğlu", "DEF", "Brighton", "Brighton_%26_Hove_Albion_logo.svg"),
            W("Merih Demiral", "DEF", "Al-Ahli", "Al-Ahli_Saudi_FC_logo.svg"),
            W("Samet Akaydin", "DEF", "Fenerbahçe", "Fenerbah%C3%A7e_SK_logo.svg"),
            W("Zeki Çelik", "DEF", "Roma", "AS_Roma_logo_(2017).svg"),
            W("İsmail Yüksek", "MID", "Fenerbahçe", "Fenerbah%C3%A7e_SK_logo.svg"),
            W("Hakan Çalhanoğlu", "MID", "Inter Milan", "FC_Internazionale_Milano_2021.svg"),
            W("Kaan Ayhan", "MID", "Galatasaray", "Galatasaray_Sports_Club_Logo.svg"),
            W("Barış Alper Yılmaz", "FWD", "Galatasaray", "Galatasaray_Sports_Club_Logo.svg"),
            W("Kenan Yıldız", "FWD", "Juventus", "Juventus_FC_2017_logo.svg"),
            W("Arda Güler", "FWD", "Real Madrid", "Real_Madrid_CF.svg"),
        ], options: ["Turkey", "Greece", "Croatia", "Czech Republic", "Austria"]
    },

    {
        id: 4, team: "Germany", year: 2026, mode: "current", tournament: "World Cup 2026 Qualifiers", flag: "🇩🇪",
        players: [
            W("Marc-André ter Stegen", "GK", "Barcelona", "FC_Barcelona_(crest).svg"),
            W("Maximilian Mittelstädt", "DEF", "Stuttgart", "VfB_Stuttgart_1893_Logo.svg"),
            W("Antonio Rüdiger", "DEF", "Real Madrid", "Real_Madrid_CF.svg"),
            W("Jonathan Tah", "DEF", "Barcelona", "FC_Barcelona_(crest).svg"),
            W("Joshua Kimmich", "DEF", "Bayern Munich", "FC_Bayern_M%C3%BCnchen_logo_(2017).svg"),
            W("Florian Wirtz", "MID", "Bayer Leverkusen", "Bayer_04_Leverkusen_logo.svg"),
            W("Jamal Musiala", "MID", "Bayern Munich", "FC_Bayern_M%C3%BCnchen_logo_(2017).svg"),
            W("Robert Andrich", "MID", "Bayer Leverkusen", "Bayer_04_Leverkusen_logo.svg"),
            W("Leroy Sané", "FWD", "Bayern Munich", "FC_Bayern_M%C3%BCnchen_logo_(2017).svg"),
            W("Kai Havertz", "FWD", "Arsenal", "Arsenal_FC.svg"),
            W("Serge Gnabry", "FWD", "Bayern Munich", "FC_Bayern_M%C3%BCnchen_logo_(2017).svg"),
        ], options: ["Germany", "Austria", "Netherlands", "Switzerland", "Denmark"]
    },

    {
        id: 5, team: "Brazil", year: 2026, mode: "current", tournament: "World Cup 2026 Qualifiers", flag: "🇧🇷",
        players: [
            W("Alisson", "GK", "Liverpool", "Liverpool_FC.svg"),
            W("Wendell", "DEF", "Porto", "FC_Porto.svg"),
            W("Éder Militão", "DEF", "Real Madrid", "Real_Madrid_CF.svg"),
            W("Marquinhos", "DEF", "PSG", "Paris_Saint-Germain_F.C..svg"),
            W("Danilo", "DEF", "Juventus", "Juventus_FC_2017_logo.svg"),
            W("Lucas Paquetá", "MID", "West Ham", "West_Ham_United_FC_logo.svg"),
            W("Bruno Guimarães", "MID", "Newcastle", "Newcastle_United_Logo.svg"),
            W("Vinícius Jr.", "MID", "Real Madrid", "Real_Madrid_CF.svg"),
            W("Raphinha", "FWD", "Barcelona", "FC_Barcelona_(crest).svg"),
            W("Endrick", "FWD", "Real Madrid", "Real_Madrid_CF.svg"),
            W("Rodrygo", "FWD", "Real Madrid", "Real_Madrid_CF.svg"),
        ], options: ["Brazil", "Argentina", "Colombia", "Ecuador", "Uruguay"]
    },

    {
        id: 6, team: "England", year: 2026, mode: "current", tournament: "World Cup 2026 Qualifiers", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        players: [
            W("Jordan Pickford", "GK", "Everton", "Everton_FC_logo.svg"),
            W("Luke Shaw", "DEF", "Man Utd", "Manchester_United_FC_crest.svg"),
            W("Marc Guéhi", "DEF", "Crystal Palace", "Crystal_Palace_FC_logo.svg"),
            W("John Stones", "DEF", "Man City", "Manchester_City_FC_badge.svg"),
            W("Trent Alexander-Arnold", "DEF", "Real Madrid", "Real_Madrid_CF.svg"),
            W("Phil Foden", "MID", "Man City", "Manchester_City_FC_badge.svg"),
            W("Declan Rice", "MID", "Arsenal", "Arsenal_FC.svg"),
            W("Jude Bellingham", "MID", "Real Madrid", "Real_Madrid_CF.svg"),
            W("Cole Palmer", "FWD", "Chelsea", "Chelsea_FC.svg"),
            W("Harry Kane", "FWD", "Bayern Munich", "FC_Bayern_M%C3%BCnchen_logo_(2017).svg"),
            W("Bukayo Saka", "FWD", "Arsenal", "Arsenal_FC.svg"),
        ], options: ["England", "France", "Scotland", "Wales", "Ireland"]
    },

    {
        id: 7, team: "Spain", year: 2026, mode: "current", tournament: "World Cup 2026 Qualifiers", flag: "🇪🇸",
        players: [
            W("Unai Simón", "GK", "Athletic Bilbao", "Athletic_Club_logo.svg"),
            W("Marc Cucurella", "DEF", "Chelsea", "Chelsea_FC.svg"),
            W("Pau Cubarsí", "DEF", "Barcelona", "FC_Barcelona_(crest).svg"),
            W("Robin Le Normand", "DEF", "Atlético Madrid", "Atletico_Madrid_2017_logo.svg"),
            W("Dani Carvajal", "DEF", "Real Madrid", "Real_Madrid_CF.svg"),
            W("Pedri", "MID", "Barcelona", "FC_Barcelona_(crest).svg"),
            W("Rodri", "MID", "Man City", "Manchester_City_FC_badge.svg"),
            W("Dani Olmo", "MID", "Barcelona", "FC_Barcelona_(crest).svg"),
            W("Nico Williams", "FWD", "Athletic Bilbao", "Athletic_Club_logo.svg"),
            W("Álvaro Morata", "FWD", "AC Milan", "Logo_of_AC_Milan.svg"),
            W("Lamine Yamal", "FWD", "Barcelona", "FC_Barcelona_(crest).svg"),
        ], options: ["Spain", "Portugal", "Italy", "France", "Argentina"]
    },

    {
        id: 8, team: "Portugal", year: 2026, mode: "current", tournament: "World Cup 2026 Qualifiers", flag: "🇵🇹",
        players: [
            W("Diogo Costa", "GK", "Porto", "FC_Porto.svg"),
            W("Nuno Mendes", "DEF", "PSG", "Paris_Saint-Germain_F.C..svg"),
            W("António Silva", "DEF", "Benfica", "SL_Benfica_logo.svg"),
            W("Rúben Dias", "DEF", "Man City", "Manchester_City_FC_badge.svg"),
            W("Diogo Dalot", "DEF", "Man Utd", "Manchester_United_FC_crest.svg"),
            W("Vitinha", "MID", "PSG", "Paris_Saint-Germain_F.C..svg"),
            W("Bruno Fernandes", "MID", "Man Utd", "Manchester_United_FC_crest.svg"),
            W("Bernardo Silva", "MID", "Man City", "Manchester_City_FC_badge.svg"),
            W("Rafael Leão", "FWD", "AC Milan", "Logo_of_AC_Milan.svg"),
            W("Cristiano Ronaldo", "FWD", "Al Nassr", "Al_Nassr_FC.svg"),
            W("Diogo Jota", "FWD", "Liverpool", "Liverpool_FC.svg"),
        ], options: ["Portugal", "Spain", "Brazil", "France", "Uruguay"]
    },

    {
        id: 9, team: "Netherlands", year: 2026, mode: "current", tournament: "World Cup 2026 Qualifiers", flag: "🇳🇱",
        players: [
            W("Bart Verbruggen", "GK", "Brighton", "Brighton_%26_Hove_Albion_logo.svg"),
            W("Nathan Aké", "DEF", "Man City", "Manchester_City_FC_badge.svg"),
            W("Virgil van Dijk", "DEF", "Liverpool", "Liverpool_FC.svg"),
            W("Matthijs de Ligt", "DEF", "Man Utd", "Manchester_United_FC_crest.svg"),
            W("Denzel Dumfries", "DEF", "Inter Milan", "FC_Internazionale_Milano_2021.svg"),
            W("Frenkie de Jong", "MID", "Barcelona", "FC_Barcelona_(crest).svg"),
            W("Ryan Gravenberch", "MID", "Liverpool", "Liverpool_FC.svg"),
            W("Xavi Simons", "MID", "RB Leipzig", "RB_Leipzig_2014_logo.svg"),
            W("Cody Gakpo", "FWD", "Liverpool", "Liverpool_FC.svg"),
            W("Brian Brobbey", "FWD", "Ajax", "AFC_Ajax.svg"),
            W("Donyell Malen", "FWD", "Aston Villa", "Aston_Villa_FC_crest_(2016).svg"),
        ], options: ["Netherlands", "Belgium", "Germany", "Denmark", "Sweden"]
    },

    {
        id: 10, team: "Italy", year: 2026, mode: "current", tournament: "World Cup 2026 Qualifiers", flag: "🇮🇹",
        players: [
            W("Gianluigi Donnarumma", "GK", "PSG", "Paris_Saint-Germain_F.C..svg"),
            W("Federico Dimarco", "DEF", "Inter Milan", "FC_Internazionale_Milano_2021.svg"),
            W("Alessandro Bastoni", "DEF", "Inter Milan", "FC_Internazionale_Milano_2021.svg"),
            W("Riccardo Calafiori", "DEF", "Arsenal", "Arsenal_FC.svg"),
            W("Giovanni Di Lorenzo", "DEF", "Napoli", "SSC_Napoli.svg"),
            W("Lorenzo Pellegrini", "MID", "Roma", "AS_Roma_logo_(2017).svg"),
            W("Nicolò Barella", "MID", "Inter Milan", "FC_Internazionale_Milano_2021.svg"),
            W("Jorginho", "MID", "Arsenal", "Arsenal_FC.svg"),
            W("Federico Chiesa", "FWD", "Liverpool", "Liverpool_FC.svg"),
            W("Gianluca Scamacca", "FWD", "Atalanta", "Atalanta_BC.svg"),
            W("Mateo Retegui", "FWD", "Atalanta", "Atalanta_BC.svg"),
        ], options: ["Italy", "Spain", "Portugal", "Argentina", "France"]
    },

    {
        id: 11, team: "Belgium", year: 2026, mode: "current", tournament: "World Cup 2026 Qualifiers", flag: "🇧🇪",
        players: [
            W("Thibaut Courtois", "GK", "Real Madrid", "Real_Madrid_CF.svg"),
            W("Arthur Theate", "DEF", "Rennes", "Stade_Rennais_FC.svg"),
            W("Wout Faes", "DEF", "Leicester", "Leicester_City_crest.svg"),
            W("Zeno Debast", "DEF", "Sporting CP", "Sporting_Clube_de_Portugal_(Logo).svg"),
            W("Timothy Castagne", "DEF", "Fulham", "Fulham_FC.svg"),
            W("Amadou Onana", "MID", "Aston Villa", "Aston_Villa_FC_crest_(2016).svg"),
            W("Kevin De Bruyne", "MID", "Man City", "Manchester_City_FC_badge.svg"),
            W("Youri Tielemans", "MID", "Aston Villa", "Aston_Villa_FC_crest_(2016).svg"),
            W("Jérémy Doku", "FWD", "Man City", "Manchester_City_FC_badge.svg"),
            W("Romelu Lukaku", "FWD", "Napoli", "SSC_Napoli.svg"),
            W("Leandro Trossard", "FWD", "Arsenal", "Arsenal_FC.svg"),
        ], options: ["Belgium", "Netherlands", "France", "Denmark", "Switzerland"]
    },

    {
        id: 12, team: "Croatia", year: 2026, mode: "current", tournament: "World Cup 2026 Qualifiers", flag: "🇭🇷",
        players: [
            W("Dominik Livaković", "GK", "Fenerbahçe", "Fenerbah%C3%A7e_SK_logo.svg"),
            W("Borna Sosa", "DEF", "Ajax", "AFC_Ajax.svg"),
            W("Joško Gvardiol", "DEF", "Man City", "Manchester_City_FC_badge.svg"),
            W("Duje Ćaleta-Car", "DEF", "Lyon", "Olympique_Lyonnais_logo.svg"),
            W("Josip Stanišić", "DEF", "Bayer Leverkusen", "Bayer_04_Leverkusen_logo.svg"),
            W("Luka Modrić", "MID", "Real Madrid", "Real_Madrid_CF.svg"),
            W("Mateo Kovačić", "MID", "Man City", "Manchester_City_FC_badge.svg"),
            W("Lovro Majer", "MID", "Wolfsburg", "VfL_Wolfsburg_Logo.svg"),
            W("Andrej Kramarić", "FWD", "Hoffenheim", "TSG_1899_Hoffenheim_logo.svg"),
            W("Bruno Petković", "FWD", "Dinamo Zagreb", "GNK_Dinamo_Zagreb_logo.svg"),
            W("Luka Sučić", "FWD", "Real Sociedad", "Real_Sociedad_logo.svg"),
        ], options: ["Croatia", "Serbia", "Bosnia", "Slovenia", "Austria"]
    },

    {
        id: 13, team: "Uruguay", year: 2026, mode: "current", tournament: "World Cup 2026 Qualifiers", flag: "🇺🇾",
        players: [
            W("Sergio Rochet", "GK", "Internacional", "Sport_Club_Internacional_logo.svg"),
            W("Mathías Olivera", "DEF", "Napoli", "SSC_Napoli.svg"),
            W("José María Giménez", "DEF", "Atlético Madrid", "Atletico_Madrid_2017_logo.svg"),
            W("Ronald Araújo", "DEF", "Barcelona", "FC_Barcelona_(crest).svg"),
            W("Nahitan Nández", "DEF", "Al Ain", "Al_Ain_FC_logo.svg"),
            W("Nicolás De La Cruz", "MID", "Flamengo", "Flamengo_braz_logo.svg"),
            W("Federico Valverde", "MID", "Real Madrid", "Real_Madrid_CF.svg"),
            W("Manuel Ugarte", "MID", "Man Utd", "Manchester_United_FC_crest.svg"),
            W("Facundo Pellistri", "FWD", "Panathinaikos", "Panathinaikos_FC_logo.svg"),
            W("Darwin Núñez", "FWD", "Liverpool", "Liverpool_FC.svg"),
            W("Maximiliano Araújo", "FWD", "Sporting CP", "Sporting_Clube_de_Portugal_(Logo).svg"),
        ], options: ["Uruguay", "Argentina", "Chile", "Paraguay", "Colombia"]
    },

    {
        id: 14, team: "Colombia", year: 2026, mode: "current", tournament: "World Cup 2026 Qualifiers", flag: "🇨🇴",
        players: [
            W("Camilo Vargas", "GK", "Atlas", "Atlas_FC_logo.svg"),
            W("Johan Mojica", "DEF", "Mallorca", "RCD_Mallorca_logo.svg"),
            W("Davinson Sánchez", "DEF", "Galatasaray", "Galatasaray_Sports_Club_Logo.svg"),
            W("Yerry Mina", "DEF", "Cagliari", "Cagliari_Calcio_1920.svg"),
            W("Daniel Muñoz", "DEF", "Crystal Palace", "Crystal_Palace_FC_logo.svg"),
            W("Jhon Arias", "MID", "Fluminense", "Fluminense_fc_logo.svg"),
            W("Richard Ríos", "MID", "Palmeiras", "Palmeiras_logo.svg"),
            W("James Rodríguez", "MID", "León", "Club_León_logo.svg"),
            W("Luis Díaz", "FWD", "Liverpool", "Liverpool_FC.svg"),
            W("Jhon Córdoba", "FWD", "Krasnodar", "FC_Krasnodar_logo.svg"),
            W("Rafael Santos Borré", "FWD", "Internacional", "Sport_Club_Internacional_logo.svg"),
        ], options: ["Colombia", "Ecuador", "Venezuela", "Peru", "Brazil"]
    },

    {
        id: 15, team: "Mexico", year: 2026, mode: "current", tournament: "World Cup 2026 (Host)", flag: "🇲🇽",
        players: [
            W("Guillermo Ochoa", "GK", "Salernitana", "US_Salernitana_1919.svg"),
            W("Jesús Gallardo", "DEF", "Toluca", "Deportivo_Toluca_FC_logo.svg"),
            W("César Montes", "DEF", "Almería", "UD_Almería_logo.svg"),
            W("Johan Vásquez", "DEF", "Genoa", "Genoa_CFC_crest.svg"),
            W("Jorge Sánchez", "DEF", "Porto", "FC_Porto.svg"),
            W("Edson Álvarez", "MID", "West Ham", "West_Ham_United_FC_logo.svg"),
            W("Carlos Rodríguez", "MID", "Cruz Azul", "Cruz_Azul_logo.svg"),
            W("Luis Chávez", "MID", "Pachuca", "CF_Pachuca_logo.svg"),
            W("Hirving Lozano", "FWD", "PSV", "PSV_Eindhoven.svg"),
            W("Raúl Jiménez", "FWD", "Fulham", "Fulham_FC.svg"),
            W("Santiago Giménez", "FWD", "Feyenoord", "Feyenoord_logo.svg"),
        ], options: ["Mexico", "USA", "Costa Rica", "Colombia", "Honduras"]
    },

    // ═══ ICONIC ═══
    {
        id: 16, team: "Turkey", year: 2002, mode: "iconic", tournament: "World Cup 2002", flag: "🇹🇷",
        players: [
            W("Rüştü Reçber", "GK", "Fenerbahçe", "Fenerbah%C3%A7e_SK_logo.svg"),
            W("Hakan Ünsal", "DEF", "Galatasaray", "Galatasaray_Sports_Club_Logo.svg"),
            W("Alpay Özalan", "DEF", "Aston Villa", "Aston_Villa_FC_crest_(2016).svg"),
            W("Bülent Korkmaz", "DEF", "Galatasaray", "Galatasaray_Sports_Club_Logo.svg"),
            W("Fatih Akyel", "DEF", "Fenerbahçe", "Fenerbah%C3%A7e_SK_logo.svg"),
            W("Emre Belözoğlu", "MID", "Inter Milan", "FC_Internazionale_Milano_2021.svg"),
            W("Tugay Kerimoğlu", "MID", "Blackburn", "Blackburn_Rovers.svg"),
            W("Yıldıray Baştürk", "MID", "Bayer Leverkusen", "Bayer_04_Leverkusen_logo.svg"),
            W("Hasan Şaş", "FWD", "Galatasaray", "Galatasaray_Sports_Club_Logo.svg"),
            W("Hakan Şükür", "FWD", "Parma", "Parma_Calcio_1913.svg"),
            W("İlhan Mansız", "FWD", "Beşiktaş", "Be%C5%9Fikta%C5%9F_JK_Logo.svg"),
        ], options: ["Turkey", "South Korea", "Japan", "Senegal", "USA"]
    },

    {
        id: 17, team: "Brazil", year: 1998, mode: "iconic", tournament: "World Cup 1998", flag: "🇧🇷",
        players: [
            W("Taffarel", "GK", "Galatasaray", "Galatasaray_Sports_Club_Logo.svg"),
            W("Roberto Carlos", "DEF", "Real Madrid", "Real_Madrid_CF.svg"),
            W("Junior Baiano", "DEF", "Perugia", "AC_Perugia_Calcio_logo.svg"),
            W("Aldair", "DEF", "Roma", "AS_Roma_logo_(2000-2013).svg"),
            W("Cafu", "DEF", "Roma", "AS_Roma_logo_(2000-2013).svg"),
            W("Rivaldo", "MID", "Barcelona", "FC_Barcelona_(crest).svg"),
            W("Dunga", "MID", "Jubilo Iwata", "Jubilo_Iwata_logo.svg"),
            W("César Sampaio", "MID", "Yokohama Flügels", "Yokohama_Fl%C3%BCgels.svg"),
            W("Leonardo", "FWD", "AC Milan", "Logo_of_AC_Milan.svg"),
            W("Ronaldo", "FWD", "Inter Milan", "FC_Internazionale_Milano_2021.svg"),
            W("Bebeto", "FWD", "Botafogo", "Botafogo_de_Futebol_e_Regatas_logo.svg"),
        ], options: ["Brazil", "France", "Netherlands", "Italy", "Croatia"]
    },

    {
        id: 18, team: "Spain", year: 2010, mode: "iconic", tournament: "World Cup 2010", flag: "🇪🇸",
        players: [
            W("Iker Casillas", "GK", "Real Madrid", "Real_Madrid_CF.svg"),
            W("Joan Capdevila", "DEF", "Villarreal", "Villarreal_CF_logo.svg"),
            W("Carles Puyol", "DEF", "Barcelona", "FC_Barcelona_(crest).svg"),
            W("Gerard Piqué", "DEF", "Barcelona", "FC_Barcelona_(crest).svg"),
            W("Sergio Ramos", "DEF", "Real Madrid", "Real_Madrid_CF.svg"),
            W("Andrés Iniesta", "MID", "Barcelona", "FC_Barcelona_(crest).svg"),
            W("Sergio Busquets", "MID", "Barcelona", "FC_Barcelona_(crest).svg"),
            W("Xavi", "MID", "Barcelona", "FC_Barcelona_(crest).svg"),
            W("Pedro", "FWD", "Barcelona", "FC_Barcelona_(crest).svg"),
            W("David Villa", "FWD", "Valencia", "Valenciacf.svg"),
            W("Fernando Torres", "FWD", "Liverpool", "Liverpool_FC.svg"),
        ], options: ["Spain", "Netherlands", "Germany", "Uruguay", "Argentina"]
    },

    {
        id: 19, team: "Italy", year: 2006, mode: "iconic", tournament: "World Cup 2006", flag: "🇮🇹",
        players: [
            W("Gianluigi Buffon", "GK", "Juventus", "Juventus_FC_logo_(2004).svg"),
            W("Fabio Grosso", "DEF", "Palermo", "US_Citt%C3%A0_di_Palermo_Logo.svg"),
            W("Marco Materazzi", "DEF", "Inter Milan", "FC_Internazionale_Milano_2021.svg"),
            W("Fabio Cannavaro", "DEF", "Real Madrid", "Real_Madrid_CF.svg"),
            W("Gianluca Zambrotta", "DEF", "Juventus", "Juventus_FC_logo_(2004).svg"),
            W("Andrea Pirlo", "MID", "AC Milan", "Logo_of_AC_Milan.svg"),
            W("Gennaro Gattuso", "MID", "AC Milan", "Logo_of_AC_Milan.svg"),
            W("Simone Perrotta", "MID", "Roma", "AS_Roma_logo_(2000-2013).svg"),
            W("Francesco Totti", "FWD", "Roma", "AS_Roma_logo_(2000-2013).svg"),
            W("Luca Toni", "FWD", "Fiorentina", "ACF_Fiorentina_2002_logo.svg"),
            W("Alessandro Del Piero", "FWD", "Juventus", "Juventus_FC_logo_(2004).svg"),
        ], options: ["Italy", "France", "Germany", "Portugal", "Brazil"]
    },

    {
        id: 20, team: "France", year: 1998, mode: "iconic", tournament: "World Cup 1998", flag: "🇫🇷",
        players: [
            W("Fabien Barthez", "GK", "Monaco", "AS_Monaco_FC.svg"),
            W("Bixente Lizarazu", "DEF", "Bayern Munich", "FC_Bayern_M%C3%BCnchen_logo_(2017).svg"),
            W("Marcel Desailly", "DEF", "AC Milan", "Logo_of_AC_Milan.svg"),
            W("Laurent Blanc", "DEF", "Marseille", "Olympique_de_Marseille_logo.svg"),
            W("Lilian Thuram", "DEF", "Parma", "Parma_Calcio_1913.svg"),
            W("Didier Deschamps", "MID", "Juventus", "Juventus_FC_logo_(2004).svg"),
            W("Emmanuel Petit", "MID", "Arsenal", "Arsenal_FC.svg"),
            W("Zinedine Zidane", "MID", "Juventus", "Juventus_FC_logo_(2004).svg"),
            W("Youri Djorkaeff", "FWD", "Inter Milan", "FC_Internazionale_Milano_2021.svg"),
            W("Stéphane Guivarc'h", "FWD", "Auxerre", "AJ_Auxerre_Logo.svg"),
            W("Thierry Henry", "FWD", "Monaco", "AS_Monaco_FC.svg"),
        ], options: ["France", "Brazil", "Italy", "Croatia", "Netherlands"]
    },

    {
        id: 21, team: "Brazil", year: 2002, mode: "iconic", tournament: "World Cup 2002", flag: "🇧🇷",
        players: [
            W("Marcos", "GK", "Palmeiras", "Palmeiras_logo.svg"),
            W("Roberto Carlos (2002)", "DEF", "Real Madrid", "Real_Madrid_CF.svg"),
            W("Edmílson", "DEF", "Lyon", "Olympique_Lyonnais_logo.svg"),
            W("Lúcio", "DEF", "Bayer Leverkusen", "Bayer_04_Leverkusen_logo.svg"),
            W("Cafu (2002)", "DEF", "Roma", "AS_Roma_logo_(2000-2013).svg"),
            W("Gilberto Silva", "MID", "Atlético Mineiro", "Atletico_mineiro_galo.svg"),
            W("Rivaldo (2002)", "MID", "Barcelona", "FC_Barcelona_(crest).svg"),
            W("Ronaldinho", "MID", "PSG", "Paris_Saint-Germain_F.C..svg"),
            W("Ronaldo (2002)", "FWD", "Inter Milan", "FC_Internazionale_Milano_2021.svg"),
            W("Kléberson", "FWD", "Athletico Paranaense", "Club_Athletico_Paranaense_logo.svg"),
            W("Denílson", "FWD", "Real Betis", "Real_Betis_logo.svg"),
        ], options: ["Brazil", "Germany", "Turkey", "South Korea", "Spain"]
    },

    {
        id: 22, team: "Germany", year: 2014, mode: "iconic", tournament: "World Cup 2014", flag: "🇩🇪",
        players: [
            W("Manuel Neuer", "GK", "Bayern Munich", "FC_Bayern_M%C3%BCnchen_logo_(2017).svg"),
            W("Benedikt Höwedes", "DEF", "Schalke 04", "FC_Schalke_04_Logo.svg"),
            W("Jérôme Boateng", "DEF", "Bayern Munich", "FC_Bayern_M%C3%BCnchen_logo_(2017).svg"),
            W("Mats Hummels", "DEF", "Borussia Dortmund", "Borussia_Dortmund_logo.svg"),
            W("Philipp Lahm", "DEF", "Bayern Munich", "FC_Bayern_M%C3%BCnchen_logo_(2017).svg"),
            W("Bastian Schweinsteiger", "MID", "Bayern Munich", "FC_Bayern_M%C3%BCnchen_logo_(2017).svg"),
            W("Toni Kroos", "MID", "Bayern Munich", "FC_Bayern_M%C3%BCnchen_logo_(2017).svg"),
            W("Sami Khedira", "MID", "Real Madrid", "Real_Madrid_CF.svg"),
            W("Thomas Müller", "FWD", "Bayern Munich", "FC_Bayern_M%C3%BCnchen_logo_(2017).svg"),
            W("Miroslav Klose", "FWD", "Lazio", "SS_Lazio.svg"),
            W("Mario Götze", "FWD", "Bayern Munich", "FC_Bayern_M%C3%BCnchen_logo_(2017).svg"),
        ], options: ["Germany", "Argentina", "Netherlands", "Brazil", "France"]
    },

    {
        id: 23, team: "Croatia", year: 2018, mode: "iconic", tournament: "World Cup 2018", flag: "🇭🇷",
        players: [
            W("Danijel Subašić", "GK", "Monaco", "AS_Monaco_FC.svg"),
            W("Ivan Strinić", "DEF", "Sampdoria", "UC_Sampdoria_logo.svg"),
            W("Dejan Lovren", "DEF", "Liverpool", "Liverpool_FC.svg"),
            W("Domagoj Vida", "DEF", "Beşiktaş", "Be%C5%9Fikta%C5%9F_JK_Logo.svg"),
            W("Šime Vrsaljko", "DEF", "Atlético Madrid", "Atletico_Madrid_2017_logo.svg"),
            W("Marcelo Brozović", "MID", "Inter Milan", "FC_Internazionale_Milano_2021.svg"),
            W("Luka Modrić (2018)", "MID", "Real Madrid", "Real_Madrid_CF.svg"),
            W("Ivan Rakitić", "MID", "Barcelona", "FC_Barcelona_(crest).svg"),
            W("Ivan Perišić", "FWD", "Inter Milan", "FC_Internazionale_Milano_2021.svg"),
            W("Mario Mandžukić", "FWD", "Juventus", "Juventus_FC_2017_logo.svg"),
            W("Ante Rebić", "FWD", "Eintracht Frankfurt", "Eintracht_Frankfurt_Logo.svg"),
        ], options: ["Croatia", "France", "Belgium", "England", "Russia"]
    },

    {
        id: 24, team: "Netherlands", year: 2010, mode: "iconic", tournament: "World Cup 2010", flag: "🇳🇱",
        players: [
            W("Maarten Stekelenburg", "GK", "Ajax", "AFC_Ajax.svg"),
            W("Giovanni van Bronckhorst", "DEF", "Feyenoord", "Feyenoord_logo.svg"),
            W("Joris Mathijsen", "DEF", "Hamburg", "Hamburger_SV_logo.svg"),
            W("John Heitinga", "DEF", "Everton", "Everton_FC_logo.svg"),
            W("Gregory van der Wiel", "DEF", "Ajax", "AFC_Ajax.svg"),
            W("Nigel de Jong", "MID", "Man City", "Manchester_City_FC_badge.svg"),
            W("Mark van Bommel", "MID", "Bayern Munich", "FC_Bayern_M%C3%BCnchen_logo_(2017).svg"),
            W("Wesley Sneijder", "MID", "Inter Milan", "FC_Internazionale_Milano_2021.svg"),
            W("Dirk Kuyt", "FWD", "Liverpool", "Liverpool_FC.svg"),
            W("Robin van Persie", "FWD", "Arsenal", "Arsenal_FC.svg"),
            W("Arjen Robben", "FWD", "Bayern Munich", "FC_Bayern_M%C3%BCnchen_logo_(2017).svg"),
        ], options: ["Netherlands", "Spain", "Germany", "Uruguay", "Brazil"]
    },

    {
        id: 25, team: "Portugal", year: 2016, mode: "iconic", tournament: "Euro 2016", flag: "🇵🇹",
        players: [
            W("Rui Patrício", "GK", "Sporting CP", "Sporting_Clube_de_Portugal_(Logo).svg"),
            W("Raphaël Guerreiro", "DEF", "Lorient", "FC_Lorient_logo.svg"),
            W("José Fonte", "DEF", "Southampton", "FC_Southampton.svg"),
            W("Pepe", "DEF", "Real Madrid", "Real_Madrid_CF.svg"),
            W("Cédric Soares", "DEF", "Southampton", "FC_Southampton.svg"),
            W("João Mário", "MID", "Sporting CP", "Sporting_Clube_de_Portugal_(Logo).svg"),
            W("William Carvalho", "MID", "Sporting CP", "Sporting_Clube_de_Portugal_(Logo).svg"),
            W("Adrien Silva", "MID", "Sporting CP", "Sporting_Clube_de_Portugal_(Logo).svg"),
            W("Nani", "FWD", "Fenerbahçe", "Fenerbah%C3%A7e_SK_logo.svg"),
            W("Cristiano Ronaldo (2016)", "FWD", "Real Madrid", "Real_Madrid_CF.svg"),
            W("Éder", "FWD", "Lille", "LOSC_Lille_logo.svg"),
        ], options: ["Portugal", "France", "Wales", "Germany", "Belgium"]
    },

    {
        id: 26, team: "France", year: 2018, mode: "iconic", tournament: "World Cup 2018", flag: "🇫🇷",
        players: [
            W("Hugo Lloris", "GK", "Tottenham", "Tottenham_Hotspur.svg"),
            W("Lucas Hernández", "DEF", "Atlético Madrid", "Atletico_Madrid_2017_logo.svg"),
            W("Samuel Umtiti", "DEF", "Barcelona", "FC_Barcelona_(crest).svg"),
            W("Raphaël Varane", "DEF", "Real Madrid", "Real_Madrid_CF.svg"),
            W("Benjamin Pavard", "DEF", "Stuttgart", "VfB_Stuttgart_1893_Logo.svg"),
            W("Blaise Matuidi", "MID", "Juventus", "Juventus_FC_2017_logo.svg"),
            W("N'Golo Kanté", "MID", "Chelsea", "Chelsea_FC.svg"),
            W("Paul Pogba", "MID", "Man Utd", "Manchester_United_FC_crest.svg"),
            W("Antoine Griezmann (2018)", "FWD", "Atlético Madrid", "Atletico_Madrid_2017_logo.svg"),
            W("Olivier Giroud", "FWD", "Chelsea", "Chelsea_FC.svg"),
            W("Kylian Mbappé (2018)", "FWD", "PSG", "Paris_Saint-Germain_F.C..svg"),
        ], options: ["France", "Croatia", "Belgium", "Brazil", "England"]
    },

    {
        id: 27, team: "Argentina", year: 2022, mode: "iconic", tournament: "World Cup 2022", flag: "🇦🇷",
        players: [
            W("Emiliano Martínez (2022)", "GK", "Aston Villa", "Aston_Villa_FC_crest_(2016).svg"),
            W("Nicolás Tagliafico (2022)", "DEF", "Lyon", "Olympique_Lyonnais_logo.svg"),
            W("Nicolás Otamendi", "DEF", "Benfica", "SL_Benfica_logo.svg"),
            W("Cristian Romero (2022)", "DEF", "Tottenham", "Tottenham_Hotspur.svg"),
            W("Nahuel Molina (2022)", "DEF", "Atlético Madrid", "Atletico_Madrid_2017_logo.svg"),
            W("Enzo Fernández (2022)", "MID", "Benfica", "SL_Benfica_logo.svg"),
            W("Rodrigo De Paul (2022)", "MID", "Atlético Madrid", "Atletico_Madrid_2017_logo.svg"),
            W("Alexis Mac Allister (2022)", "MID", "Brighton", "Brighton_%26_Hove_Albion_logo.svg"),
            W("Ángel Di María", "FWD", "Juventus", "Juventus_FC_2017_logo.svg"),
            W("Lionel Messi (2022)", "FWD", "PSG", "Paris_Saint-Germain_F.C..svg"),
            W("Julián Álvarez (2022)", "FWD", "Man City", "Manchester_City_FC_badge.svg"),
        ], options: ["Argentina", "France", "Croatia", "Morocco", "Brazil"]
    },

    {
        id: 28, team: "Netherlands", year: 1974, mode: "iconic", tournament: "World Cup 1974", flag: "🇳🇱",
        players: [
            W("Jan Jongbloed", "GK", "FC Amsterdam", "FC_Amsterdam.svg"),
            W("Ruud Krol", "DEF", "Ajax", "AFC_Ajax.svg"),
            W("Wim Rijsbergen", "DEF", "Feyenoord", "Feyenoord_logo.svg"),
            W("Barry Hulshoff", "DEF", "Ajax", "AFC_Ajax.svg"),
            W("Wim Suurbier", "DEF", "Ajax", "AFC_Ajax.svg"),
            W("Wim Jansen", "MID", "Feyenoord", "Feyenoord_logo.svg"),
            W("Johan Neeskens", "MID", "Ajax", "AFC_Ajax.svg"),
            W("Willem van Hanegem", "MID", "Feyenoord", "Feyenoord_logo.svg"),
            W("Rob Rensenbrink", "FWD", "Anderlecht", "RSC_Anderlecht_logo.svg"),
            W("Johan Cruyff", "FWD", "Barcelona", "FC_Barcelona_(crest).svg"),
            W("Johnny Rep", "FWD", "Ajax", "AFC_Ajax.svg"),
        ], options: ["Netherlands", "Germany", "Brazil", "Poland", "Sweden"]
    },

    {
        id: 29, team: "Brazil", year: 1970, mode: "iconic", tournament: "World Cup 1970", flag: "🇧🇷",
        players: [
            W("Félix", "GK", "Fluminense", "Fluminense_fc_logo.svg"),
            W("Everaldo", "DEF", "Grêmio", "Gremio_logo.svg"),
            W("Brito", "DEF", "Flamengo", "Flamengo_braz_logo.svg"),
            W("Wilson Piazza", "DEF", "Cruzeiro", "Cruzeiro_Esporte_Clube_(logo).svg"),
            W("Carlos Alberto", "DEF", "Santos", "Santos_Logo.svg"),
            W("Clodoaldo", "MID", "Santos", "Santos_Logo.svg"),
            W("Gérson", "MID", "São Paulo", "Sao_Paulo_FC.svg"),
            W("Rivelino", "MID", "Corinthians", "Sport_Club_Corinthians_Paulista_crest.svg"),
            W("Jairzinho", "FWD", "Botafogo", "Botafogo_de_Futebol_e_Regatas_logo.svg"),
            W("Tostão", "FWD", "Cruzeiro", "Cruzeiro_Esporte_Clube_(logo).svg"),
            W("Pelé", "FWD", "Santos", "Santos_Logo.svg"),
        ], options: ["Brazil", "Italy", "Germany", "Uruguay", "England"]
    },

    {
        id: 30, team: "Argentina", year: 1986, mode: "iconic", tournament: "World Cup 1986", flag: "🇦🇷",
        players: [
            W("Nery Pumpido", "GK", "River Plate", "River_Plate_logo.svg"),
            W("José Luis Brown", "DEF", "Estudiantes", "Estudiantes_de_La_Plata_logo.svg"),
            W("Oscar Ruggeri", "DEF", "River Plate", "River_Plate_logo.svg"),
            W("José Cuciuffo", "DEF", "Vélez Sársfield", "Velez_Sarsfield_logo.svg"),
            W("Julio Olarticoechea", "DEF", "Racing Club", "Racing_Club_logo.svg"),
            W("Héctor Enrique", "MID", "River Plate", "River_Plate_logo.svg"),
            W("Sergio Batista", "MID", "Argentinos Juniors", "Argentinos_Juniors_logo.svg"),
            W("Jorge Burruchaga", "MID", "Nantes", "FC_Nantes_logo.svg"),
            W("Diego Maradona", "FWD", "Napoli", "SSC_Napoli.svg"),
            W("Jorge Valdano", "FWD", "Real Madrid", "Real_Madrid_CF.svg"),
            W("Pedro Pasculli", "FWD", "Lecce", "US_Lecce_logo.svg"),
        ], options: ["Argentina", "Germany", "France", "Brazil", "England"]
    },
];

const outPath = path.join(__dirname, '..', 'src', 'data', 'national_teams.json');
fs.writeFileSync(outPath, JSON.stringify(teams, null, 2), 'utf-8');
console.log(`✅ Wrote ${teams.length} teams to ${outPath}`);
