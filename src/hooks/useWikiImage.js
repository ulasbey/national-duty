import { useState, useEffect, useRef } from 'react'

/**
 * In-memory cache shared across all hook instances.
 * Persists across re-renders but cleared on page refresh.
 */
export const wikiCache = {}

/**
 * Fetches a thumbnail URL from the Wikipedia REST API for a given page title.
 * Endpoint: https://en.wikipedia.org/api/rest_v1/page/summary/{title}
 * Returns the `thumbnail.source` field — a hotlink-friendly image URL.
 *
 * @param {string} wikiTitle — Wikipedia article title, e.g. "Arsenal_F.C."
 * @returns {{ url: string|null, loading: boolean, error: boolean }}
 */
export function useWikiImage(wikiTitle) {
  const [url, setUrl] = useState(wikiCache[wikiTitle]?.url ?? null)
  const [loading, setLoading] = useState(!wikiCache[wikiTitle])
  const [error, setError] = useState(wikiCache[wikiTitle]?.error ?? false)
  const abortRef = useRef(null)

  useEffect(() => {
    if (!wikiTitle) {
      setLoading(false)
      setError(true)
      return
    }

    // Already cached
    if (wikiCache[wikiTitle]) {
      setUrl(wikiCache[wikiTitle].url)
      setError(wikiCache[wikiTitle].error)
      setLoading(false)
      return
    }

    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(false)

    // Stage 1: Manual Mapping
    let finalTitle = clubWikiTitles[wikiTitle];

    // Stage 2: Smart Guessing (if no manual mapping)
    if (!finalTitle) {
      // "Bayern Munich" -> "FC_Bayern_Munich", "Saprissa" -> "Deportivo_Saprissa" etc.
      // But a safe general guess: "Club_Name_F.C."
      finalTitle = wikiTitle.replace(/\s+/g, '_');
      if (!finalTitle.endsWith('_F.C.')) {
        // Special cases for German/Spanish/French clubs often don't have F.C.
        // But for many it works. Let's try just the name first, and if that fails, the API might handle it.
      }
    }

    const encoded = encodeURIComponent(finalTitle)
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => {
        const imgUrl = data.thumbnail?.source || data.originalimage?.source || null
        wikiCache[wikiTitle] = { url: imgUrl, error: !imgUrl }
        setUrl(imgUrl)
        setError(!imgUrl)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.log(`[WikiAPI] Failed for "${wikiTitle}":`, err.message)
          wikiCache[wikiTitle] = { url: null, error: true }
          setError(true)
          setLoading(false)
        }
      })

    return () => controller.abort()
  }, [wikiTitle])

  return { url, loading, error }
}

/* ─────────────────────────────────────────────────────────────────
   Club name → Wikipedia article title mapping
   Covers all clubs that appear in national_teams.json.
   Keys match the "club" field in the JSON data exactly.
   ───────────────────────────────────────────────────────────────── */
export const clubWikiTitles = {
  // ── English clubs ─────────────────────────────────────────────
  'Man Utd':              'Manchester_United_F.C.',
  'Manchester United':    'Manchester_United_F.C.',
  'Liverpool':            'Liverpool_F.C.',
  'Arsenal':              'Arsenal_F.C.',
  'Chelsea':              'Chelsea_F.C.',
  'Man City':             'Manchester_City_F.C.',
  'Manchester City':      'Manchester_City_F.C.',
  'Tottenham':            'Tottenham_Hotspur_F.C.',
  'Tottenham Hotspur':    'Tottenham_Hotspur_F.C.',
  'Aston Villa':          'Aston_Villa_F.C.',
  'Everton':              'Everton_F.C.',
  'Newcastle':            'Newcastle_United_F.C.',
  'Newcastle United':     'Newcastle_United_F.C.',
  'Brighton':             'Brighton_%26_Hove_Albion_F.C.',
  'West Ham':             'West_Ham_United_F.C.',
  'Crystal Palace':       'Crystal_Palace_F.C.',
  'Nottm Forest':         'Nottingham_Forest_F.C.',
  'Nott. Forest':         'Nottingham_Forest_F.C.',
  'Nottingham Forest':    'Nottingham_Forest_F.C.',
  'Blackburn':            'Blackburn_Rovers_F.C.',
  'Burnley':              'Burnley_F.C.',
  'Southampton':          'Southampton_F.C.',
  'Leicester':            'Leicester_City_F.C.',
  'Leicester City':       'Leicester_City_F.C.',
  'Middlesbrough':        'Middlesbrough_F.C.',
  'Wolves':               'Wolverhampton_Wanderers_F.C.',
  'Brentford':            'Brentford_F.C.',
  'Fulham':               'Fulham_F.C.',
  'Leeds':                'Leeds_United_F.C.',
  'Sheffield United':     'Sheffield_United_F.C.',
  'QPR':                    'Queens_Park_Rangers_F.C.',
  'Watford':                'Watford_F.C.',
  'Bournemouth':            'AFC_Bournemouth',
  'Dundee United':          'Dundee_United_F.C.',
  'St. Pauli':              'FC_St._Pauli',
  'AZ Alkmaar':             'AZ_Alkmaar',

  // ── Scottish clubs ────────────────────────────────────────────
  'Rangers':              'Rangers_F.C.',
  'Celtic':               'Celtic_F.C.',
  'Hearts':               'Heart_of_Midlothian_F.C.',
  'Hibernian':            'Hibernian_F.C.',

  // ── Spanish clubs ─────────────────────────────────────────────
  'Real Madrid':          'Real_Madrid_CF',
  'Barcelona':            'FC_Barcelona',
  'Atlético Madrid':      'Atlético_Madrid',
  'Atletico Madrid':      'Atlético_Madrid',
  'Sevilla':              'Sevilla_FC',
  'Valencia':             'Valencia_CF',
  'Villarreal':           'Villarreal_CF',
  'Athletic Bilbao':      'Athletic_Club',
  'Athletic Club':        'Athletic_Club',
  'Real Sociedad':        'Real_Sociedad',
  'Rayo Vallecano':       'Rayo_Vallecano',
  'Real Betis':           'Real_Betis',
  'Levante':                'Levante_UD',
  'Girona':                 'Girona_FC',
  'Osasuna':                'CA_Osasuna',
  'Espanyol':               'RCD_Espanyol',
  'Getafe':               'Getafe_CF',
  'Celta Vigo':           'RC_Celta_de_Vigo',
  'Como':                 'Calcio_Como',

  // ── German clubs ──────────────────────────────────────────────
  'Bayern Munich':        'FC_Bayern_Munich',
  'Borussia Dortmund':    'Borussia_Dortmund',
  'Bayer Leverkusen':     'Bayer_04_Leverkusen',
  'Schalke 04':           'FC_Schalke_04',
  'Stuttgart':            'VfB_Stuttgart',
  'Werder Bremen':        'SV_Werder_Bremen',
  'Eintracht Frankfurt':  'Eintracht_Frankfurt',
  'RB Leipzig':           'RB_Leipzig',
  'Hoffenheim':           'TSG_1899_Hoffenheim',
  'Freiburg':             'Sport-Club_Freiburg',
  'Wolfsburg':            'VfL_Wolfsburg',
  'Dortmund':             'Borussia_Dortmund',

  // ── Italian clubs ─────────────────────────────────────────────
  'Inter Milan':          'Inter_Milan',
  'AC Milan':             'AC_Milan',
  'Juventus':             'Juventus_F.C.',
  'Roma':                 'A.S._Roma',
  'Napoli':               'S.S.C._Napoli',
  'Lazio':                'S.S._Lazio',
  'Fiorentina':           'ACF_Fiorentina',
  'Atalanta':             'Atalanta_BC',
  'Torino':               'Torino_F.C.',
  'Bologna':              'Bologna_FC_1909',
  'Udinese':              'Udinese_Calcio',
  'Sassuolo':             'U.S._Sassuolo_Calcio',
  'Monza':                'A.C._Monza',
  'Venezia':              'Venezia_FC',
  'Genoa':                'Genoa_CFC',

  // ── French clubs ──────────────────────────────────────────────
  'PSG':                  'Paris_Saint-Germain_F.C.',
  'Paris Saint-Germain':  'Paris_Saint-Germain_F.C.',
  'Marseille':            'Olympique_de_Marseille',
  'Monaco':               'AS_Monaco_FC',
  'Lyon':                 'Olympique_Lyonnais',
  'Lille':                'LOSC_Lille',
  'Nantes':                 'FC_Nantes',
  'Rennes':               'Stade_Rennais_F.C.',
  'Lens':                 'RC_Lens',
  'Montpellier':          'Montpellier_HSC',
  'Nice':                 'OGC_Nice',
  'Strasbourg':           'RC_Strasbourg_Alsace',

  // ── Portuguese clubs ──────────────────────────────────────────
  'Porto':                'FC_Porto',
  'Benfica':              'S.L._Benfica',
  'Sporting CP':          'Sporting_CP',
  'Braga':                'S.C._Braga',

  // ── Dutch clubs ───────────────────────────────────────────────
  'Ajax':                 'AFC_Ajax',
  'PSV':                  'PSV_Eindhoven',
  'PSV Eindhoven':        'PSV_Eindhoven',
  'Feyenoord':            'Feyenoord',

  // ── Belgian clubs ─────────────────────────────────────────────
  'Anderlecht':           'R.S.C._Anderlecht',
  'Club Brugge':          'Club_Brugge_KV',

  // ── Turkish clubs ─────────────────────────────────────────────
  'Galatasaray':          'Galatasaray_S.K._(football)',
  'Fenerbahçe':           'Fenerbahçe_S.K._(football)',
  'Beşiktaş':             'Beşiktaş_J.K.',
  'Trabzonspor':          'Trabzonspor',
  'Konyaspor':              'Konyaspor',
  'Başakşehir':           'İstanbul_Başakşehir_F.K.',

  // ── Brazilian clubs ───────────────────────────────────────────
  'Flamengo':             'Clube_de_Regatas_do_Flamengo',
  'Palmeiras':            'Sociedade_Esportiva_Palmeiras',
  'Corinthians':          'Sport_Club_Corinthians_Paulista',
  'São Paulo':            'São_Paulo_FC',
  'Fluminense':           'Fluminense_FC',
  'Grêmio':               'Grêmio_Foot-Ball_Porto_Alegrense',
  'Atlético Mineiro':     'Clube_Atlético_Mineiro',
  'Cruzeiro':             'Cruzeiro_Esporte_Clube',
  'Botafogo':             'Botafogo_de_Futebol_e_Regatas',

  // ── Argentine clubs ───────────────────────────────────────────
  'River Plate':          'Club_Atlético_River_Plate',
  'Boca Juniors':         'Boca_Juniors',
  'Independiente':        'Club_Atlético_Independiente',
  'Racing Club':          'Racing_Club_de_Avellaneda',
  'San Lorenzo':          'San_Lorenzo_de_Almagro',

  // ── Saudi clubs ───────────────────────────────────────────────
  'Al Nassr':             'Al-Nassr_FC',
  'Al-Nassr':             'Al-Nassr_FC',
  'Al-Hilal':             'Al-Hilal_FC',
  'Al-Ahli':              'Al-Ahli_Saudi_FC',
  'Al-Ittihad':           'Al-Ittihad_Club',
  'Al-Ettifaq':           'Al-Ettifaq',
  'Al-Qadsiah':           'Al-Qadsiah_FC',

  // ── MLS clubs ─────────────────────────────────────────────────
  'Inter Miami':          'Inter_Miami_CF',
  'San Diego FC':           'San_Diego_FC',
  'Minnesota United':       'Minnesota_United_FC',
  'LA Galaxy':            'LA_Galaxy',
  'LAFC':                 'Los_Angeles_FC',
  'New York Red Bulls':   'New_York_Red_Bulls',
  'Seattle Sounders':     'Seattle_Sounders_FC',
  'Toronto FC':           'Toronto_FC',

  // ── Other clubs ───────────────────────────────────────────────
  'Sporting Lisbon':      'Sporting_CP',
  'Dinamo Zagreb':        'GNK_Dinamo_Zagreb',
  'Hajduk Split':         'HNK_Hajduk_Split',
  'RB Salzburg':          'FC_Red_Bull_Salzburg',
  'Olympiacos':           'Olympiacos_F.C.',
  'Panathinaikos':        'Panathinaikos_F.C.',
  'PAOK':                 'PAOK_FC',
  'AEK Athens':           'AEK_Athens_F.C.',
  'Zenit':                'FC_Zenit_Saint_Petersburg',
  'CSKA Moscow':          'PFC_CSKA_Moscow',
  'Spartak Moscow':       'FC_Spartak_Moscow',
  'Lokomotiv Moscow':     'FC_Lokomotiv_Moscow',
  'Shakhtar Donetsk':     'FC_Shakhtar_Donetsk',
  'Copenhagen':           'F.C._Copenhagen',
  'Midtjylland':          'FC_Midtjylland',
  'Brøndby':              'Brøndby_IF',
  'Celtic FC':            'Celtic_F.C.',
  'Sunderland':           'Sunderland_A.F.C.',
  'Rosenborg':            'Rosenborg_BK',
  'Portsmouth':           'Portsmouth_F.C.',
  'FC Basel':             'FC_Basel',
  'Tianjin Quanjian':     'Tianjin_Quanjian_F.C.',
  'IFK Göteborg':         'IFK_G%C3%B6teborg',
  'Sheffield Wednesday':  'Sheffield_Wednesday_F.C.',
  '1. FC Nürnberg':       '1._FC_N%C3%BCrnberg',
  'San Jose Earthquakes': 'San_Jose_Earthquakes',
  'Raja Casablanca':      'Raja_CA',
  'ASEC Mimosas':         'ASEC_Mimosas',
  'Le Havre':             'Le_Havre_AC',
  'Levski Sofia':         'PFC_Levski_Sofia',
  'Neuchâtel Xamax':      'Neuchâtel_Xamax',
  'Bodø/Glimt':           'FK_Bodø/Glimt',
  'Hammarby IF':          'Hammarby_Fotboll',
  'Malmö FF':             'Malm%C3%B6_FF',
  'Krasnodar':            'FC_Krasnodar',
  'OB':                   'Odense_Boldklub',
  'Charlton Athletic':    'Charlton_Athletic_F.C.',
  'Cardiff City':         'Cardiff_City_F.C.',
  'Kaiserslautern':       '1._FC_Kaiserslautern',
  'Zenit Saint Petersburg': 'FC_Zenit_Saint_Petersburg',
  'Dynamo Moscow':        'FC_Dynamo_Moscow',
  'Rubin Kazan':          'FC_Rubin_Kazan',
  'Ismaily':              'Ismaily_SC',
  'Al Ahly':              'Al_Ahly_SC',
  'ENPPI':                'ENPPI_SC',
  'Al Ahli Dubai':        'Shabab_Al_Ahli_Club',
  'Tonnerre Yaoundé':     'Tonnerre_Yaoundé',
  'Canon Yaoundé':        'Canon_Yaoundé',
  'La Roche VF':          'La_Roche_VF',
  'Universidad':          'Universidad_U.N.A.H.',
  'Victoria':               'C.D._Victoria',
  'Toros Neza':           'Toros_Neza',
  'Platense':             'Platense_F.C.',
  'Maldonado':            'Deportivo_Maldonado',
  'Chacarita Juniors':    'Club_Atlético_Chacarita_Juniors',
  'Extremadura':          'CF_Extremadura',
  'Mallorca':             'RCD_Mallorca',
  'Samsunspor':           'Samsunspor',
  'América de Cali':      'América_de_Cali',
  'Atlético Nacional':    'Atlético_Nacional',
  'Junior':               'Atlético_Junior',
  'Oviedo':               'Real_Oviedo',
  'Universitario':        'Club_Universitario_de_Deportes',
  'Almería':              'UD_Almería',
  'Sporting Cristal':     'Sporting_Cristal',
  'Universidad San Martín': 'Universidad_San_Martín_de_Porres',
  'Juan Aurich':          'Juan_Aurich',
  'Xerez':                'Xerez_CD',
  'Free State Stars':     'Free_State_Stars_F.C.',
  'SuperSport United':    'SuperSport_United_F.C.',
  'TP Mazembe':           'TP_Mazembe',
  'Golden Arrows':        'Lamontville_Golden_Arrows_F.C.',
  'Green Buffaloes':      'Green_Buffaloes_F.C.',
  'Orlando Pirates':      'Orlando_Pirates_F.C.',
  'Henan Jianye':         'Henan_F.C.',
  'Dalian Shide':         'Dalian_Shide_F.C.',
  'Young Boys':           'BSC_Young_Boys',
  'Kigwancha':            'Kigwancha_Sports_Club',
  'Moranbong':            'Moranbong_Sports_Club',
  'August 8th':           'Wolmido_Sports_Club',
  'February 8th':         'April_25_Sports_Club',
  'Al-Ta\'ee':            'Al-Tai_FC',
  'Al-Shabab':            'Al-Shabab_FC_(Riyadh)',
  'Chicago Fire':         'Chicago_Fire_FC',
  'Necaxa':               'Club_Necaxa',
  'Cape Town Spurs':      'Cape_Town_Spurs_F.C.',
  'Mamelodi Sundowns':    'Mamelodi_Sundowns_F.C.',
  'Kaizer Chiefs':        'Kaizer_Chiefs_F.C.',
  'Kocaelispor':          'Kocaelispor',
  'Chênois':              'CS_Chênois',
  'Toulon':               'SC_Toulon',
  'Stade Lavallois':      'Stade_Lavallois',
  'JS Saint-Pierroise':   'JS_Saint-Pierroise',
  'Kortrijk':             'K.V._Kortrijk',
  'Eintracht Trier':      'SV_Eintracht_Trier_05',
  'FC Liège':             'R.F.C._Liège',
  'Vitória de Setúbal':   'Vitória_F.C.',
  'Lokeren':              'K.S.C._Lokeren_Oost-Vlaanderen',
  'Júbilo Iwata':         'Júbilo_Iwata',
  'US Soccer Federation': 'United_States_Soccer_Federation',
  'Saarbrücken':          '1._FC_Saarbrücken',
  'Al-Ta\'ee':            'Al-Tai_FC',
  'Rapid Wien':           'SK_Rapid_Wien',
  'Austria Wien':         'FK_Austria_Wien',
  'Sturm Graz':           'SK_Sturm_Graz',
  'Empoli':               'Empoli_F.C.',
  'Al-Sadd':              'Al-Sadd_SC',
  'Dinamo București':     'FC_Dinamo_București',
  'Municipal':            'C.S.D._Municipal',
  'Atlético Bucaramanga': 'Atlético_Bucaramanga',
  'Tapachula':            'Cafetaleros_de_Chiapas',
  'Oxford United':        'Oxford_United_F.C.',
  'Baltimore Blast':      'Baltimore_Blast',
  'St Johnstone':         'St_Johnstone_F.C.',
  'Inverness CT':         'Inverness_Caledonian_Thistle_F.C.',
  'Northampton Town':     'Northampton_Town_F.C.',
  'Chester City':         'Chester_City_F.C.',
  'Widzew Łódź':          'Widzew_Łódź',
  'Legia Warsaw':         'Legia_Warsaw',
  'ŁKS Łódź':             'ŁKS_Łódź',
  'Górnik Zabrze':        'Górnik_Zabrze',
  'Arka Gdynia':          'Arka_Gdynia',
  'River Plate (U)':      'Club_Atlético_River_Plate_(Montevideo)',
  'Defensor Sporting':    'Defensor_Sporting',
  'Vicenza':              'L.R._Vicenza',
  'Ferro Carril Oeste':   'Ferro_Carril_Oeste',
  'Minnesota Strikers':   'Minnesota_Strikers',
  'Glentoran':            'Glentoran_F.C.',
  'La Chaux-de-Fonds':    'FC_La_Chaux-de-Fonds',
  'Al-Ta\'ee':            'Al-Tai_FC',
  'Toronto Blizzard':     'Toronto_Blizzard_(1971–1984)',
  'Cleveland Force':      'Cleveland_Force_(1978–1988)',
  'Seraing':              'R.F.C._Seraing_(1904)',
  'Tacoma Stars':         'Tacoma_Stars_(1983–1992)',
  'Atlante':              'Atlante_F.C.',
  'Vasco da Gama':        'CR_Vasco_da_Gama',
  'Maccabi Tel Aviv':     'Maccabi_Tel_Aviv_F.C.',
  'Sunshine Stars':       'Sunshine_Stars_F.C.',
  'Warri Wolves':         'Warri_Wolves_F.C.',
  'Chivas USA':           'Chivas_USA',
  'Universidad Católica': 'Club_Deportivo_Universidad_Católica',
  'Santiago Wanderers':   'Santiago_Wanderers',
  'Besiktas':             'Beşiktaş_J.K.',
  'Dinamo Kiev':          'FC_Dinamo_Kyiv',
  'Dinamo Minsk':         'FC_Dinamo_Minsk',
  'Hannover 96':          'Hannover_96',
  'Tijuana':              'Club_Tijuana',
  'Karlsruher SC':        'Karlsruher_SC',
  'Cerro Porteño':        'Cerro_Porteño',
  'Kayserispor':          'Kayserispor',
  'Libertad':             'Club_Libertad',
  'Hércules':             'Hércules_CF',
  'Heerenveen':           'SC_Heerenveen',
  'Red Bull Salzburg':    'FC_Red_Bull_Salzburg',
  'Lugano':               'FC_Lugano',
  'Elche':                'Elche_CF',
  'Real Salt Lake':       'Real_Salt_Lake',
  'Bolton Wanderers':     'Bolton_Wanderers_F.C.',
  'Julius Berger':        'Julius_Berger_FC',
  'Turnhout':             'K.V._Turnhout',
  'Roda JC':              'Roda_JC_Kerkrade',
  'Alajuelense':          'Liga_Deportiva_Alajuelense',
  'Herediano':            'C.S._Herediano',
  'OFI Crete':            'OFI_Crete_F.C.',
  'Alianza Lima':         'Alianza_Lima',
  'Deportivo Municipal':  'Deportivo_Municipal',
  'Metz':                 'FC_Metz',
  'Jomo Cosmos':          'Jomo_Cosmos_F.C.',

  // ── English (full names used in JSON) ─────────────────────────
  'Blackburn Rovers':     'Blackburn_Rovers_F.C.',
  'Birmingham City':      'Birmingham_City_F.C.',
  'Wolverhampton':        'Wolverhampton_Wanderers_F.C.',

  // ── French ────────────────────────────────────────────────────
  'Stade Rennais':        'Stade_Rennais_F.C.',
  'FC Lorient':           'FC_Lorient',
  'Angers':               'SCO_Angers',
  'Bordeaux':             'FC_Girondins_de_Bordeaux',
  'Toulouse':             'Toulouse_FC',
  'Sedan':                'CS_Sedan_Ardennes',
  'RC Lens':              'RC_Lens',

  // ── German ────────────────────────────────────────────────────
  'Mainz':                'FSV_Mainz_05',
  'Köln':                 'FC_Cologne',
  'Hamburg':              'Hamburger_SV',
  "Borussia M'gladbach":  'Borussia_Mönchengladbach',
  'Augsburg':             'FC_Augsburg',

  // ── Italian ───────────────────────────────────────────────────
  'Parma':                'Parma_Calcio_1913',
  'Sampdoria':            'U.C._Sampdoria',
  'Cagliari':             'Cagliari_Calcio',
  'Palermo':              'Palermo_FC',
  'Perugia':              'A.C._Perugia_Calcio',
  'Pisa':                 'AC_Pisa_1909',

  // ── Spanish ───────────────────────────────────────────────────
  'Real Valladolid':      'Real_Valladolid_CF',
  'Deportivo':            'RC_Deportivo',

  // ── Mexican ───────────────────────────────────────────────────
  'Club América':         'Club_América',
  'Cruz Azul':            'Cruz_Azul_F.C.',
  'Pachuca':              'C.F._Pachuca',
  'Rayados':              'C.F._Monterrey',

  // ── Korean ────────────────────────────────────────────────────
  'Jeonbuk':              'Jeonbuk_Hyundai_Motors_FC',
  'Suwon Bluewings':      'Suwon_Samsung_Bluewings',
  'Pohang Steelers':      'Pohang_Steelers',
  'Seongnam':             'Seongnam_FC',
  'Busan IPark':          'Busan_IPark_FC',
  'Ulsan HD':             'Ulsan_HD_FC',
  'FC Seoul':             'FC_Seoul',

  // ── Japanese ──────────────────────────────────────────────────
  'Kawasaki Frontale':    'Kawasaki_Frontale',
  'Vissel Kobe':          'Vissel_Kobe',
  'Kyoto Sanga':          'Kyoto_Sanga_FC',
  'Fagiano Okayama':      'Fagiano_Okayama_FC',

  // ── German (additional) ───────────────────────────────────────
  'Union Berlin':         '1._FC_Union_Berlin',

  // ── Saudi (additional) ────────────────────────────────────────
  'Al-Fateh':             'Al-Fateh_SC',

  // ── African ───────────────────────────────────────────────────
  'Al-Ahly':              'Al_Ahly_SC',
  'Future FC':            'Future_FC',
  'Zamalek':              'Zamalek_SC',
  'Dorogi Bányász':       'Dorogi_FC',
  'Rouen':                'FC_Rouen',
  'Espérance de Tunis':   'Espérance_Sportive_de_Tunis',
  'Stade Tunisien':       'Stade_Tunisien',
  'Gaziantepspor':        'Gaziantepspor',
  'Sochaux':              'FC_Sochaux-Montbéliard',
  'Olimpia':              'Club_Olimpia',
  'Tenerife':             'CD_Tenerife',
  'Swansea City':         'Swansea_City_A.F.C.',
  'Jomo Cosmos':          'Jomo_Cosmos_F.C.',
  'Gazélec Ajaccio':      'Gazélec_Ajaccio',
  'Portland Timbers':     'Portland_Timbers',
  'Santos Cape Town':     'Santos_F.C._(South_Africa)',
  'Germinal Beerschot':   'Beerschot_A.C.',
  'St. Gallen':           'FC_St._Gallen',
  'Al-Arabi':             'Al-Arabi_SC_(Qatar)',
  'Barcelona SC':         'Barcelona_S.C.',
  'El Nacional':          'C.D._El_Nacional',
  'Recreativo Huelva':    'Recreativo_de_Huelva',
  'Monarcas Morelia':     'Atlético_Morelia',
  'Egaleo':               'Egaleo_F.C.',
  'Istres':               'FC_Istres',
  'Châteauroux':          'LB_Châteauroux',
  'Ajaccio':              'AC_Ajaccio',
  'Málaga':               'Málaga_CF',
  'Twente':               'FC_Twente',
  'Lierse':               'Lierse_S.K.',
  'Royal Antwerp':        'Royal_Antwerp_F.C.',
  'Petrojet':             'Petrojet_SC',
  'Evian':                'Évian_Thonon_Gaillard_F.C.',
  'Bolívar':              'Club_Bolívar',
  'The Strongest':        'Club_The_Strongest',
  'Yokohama Marinos':     'Yokohama_F._Marinos',
  'Boavista':             'Boavista_F.C.',
  'Ramonense':            'A.D._Ramonense',
  'Cartaginés':           'C.S._Cartaginés',
  'Limonense':            'A.D._Limonense',
  'Cappellen':            'R.A.P.B._Cappellen',
  'RS Kouba':             'RC_Kouba',
  'NA Hussein Dey':       'NA_Hussein_Dey',
  'MA Hussein Dey':       'NA_Hussein_Dey',
  'JE Tizi-Ouzou':        'JS_Kabylie',
  'GCR Mascara':          'GC_Mascara',
  'Çaykur Rizespor':      'Çaykur_Rizespor',
  'Bari':                 'S.S.C._Bari',
  'Real España':          'Real_C.D._España',
  'Quimper':              'Quimper_Kerfeunteun_F.C.',
  'Union Douala':         'Union_Douala',
  'Cannes':               'AS_Cannes',
  'Bastia':               'SC_Bastia',
  'Philadelphia Fever':   'Philadelphia_Fever',
  'Millonarios':          'Millonarios_F.C.',
  'Chepo':                'Chepo_F.C.',
  'Chorrillo':            'Chorrillo_F.C.',
  'Fénix':                'Centro_Atlético_Fénix',
  'Violet Kickers':       'Violet_Kickers_F.C.',
  'Olympic Gardens':      'Olympic_Gardens_F.C.',
  'Harbour View':         'Harbour_View_F.C.',
  'Sebba United':         'Montego_Bay_United_F.C.',
  'Wimbledon':            'Wimbledon_F.C.',
  'RS Settat':            'Renaissance_de_Settat',
  'Compostela':           'SD_Compostela',
  'Club Africain':        'Club_Africain',
  'Pérez Zeledón':        'Municipal_Pérez_Zeledón',
  'Liberia Mía':          'Municipal_Liberia',
  'Wisła Kraków':         'Wisła_Kraków',
  'Fredrikstad':          'Fredrikstad_FK',
  'Sion':                 'FC_Sion',
  'Admira Wacker':        'FC_Admira_Wacker_Mödling',
  'Ural Sverdlovsk':      'FC_Ural_Yekaterinburg',
  'Gillingham':           'Gillingham_F.C.',
  'Wrexham':              'Wrexham_A.F.C.',
  'San Juan Jabloteh':    'San_Juan_Jabloteh_F.C.',
  'Luton Town':           'Luton_Town_F.C.',
  'Port Vale':            'Port_Vale_F.C.',
  'Falkirk':              'Falkirk_F.C.',
  'Sydney FC':            'Sydney_FC',
  'Coventry City':        'Coventry_City_F.C.',
  'CS Sfaxien':           'CS_Sfaxien',
  'CO Transports':        'C.O.T._Tunis',
  'CA Bizertin':          'Club_Athlétique_Bizertin',
  'AS Marsa':             'AS_Marsa',
  'Étoile du Sahel':      'Étoile_Sportive_du_Sahel',
  'Dinamo Tbilisi':       'FC_Dinamo_Tbilisi',
  'Torpedo Moscow':       'FC_Torpedo_Moscow',
  'SKA Rostov-on-Don':    'FC_SKA_Rostov-on-Don',
  'Vojvodina':            'FK_Vojvodina',
  'Sarajevo':             'FK_Sarajevo',
  'Partizan':             'FK_Partizan',
  'OFK Beograd':          'OFK_Beograd',
  'Red Star Belgrade':    'Red_Star_Belgrade',
  'Željezničar':          'FK_Željezničar_Sarajevo',
  'Millwall':             'Millwall_F.C.',
  'Norwich City':         'Norwich_City_F.C.',
  'Aurora FC':            'Aurora_F.C.',
  'Universidad SC':       'Universidad_SC',
  'Paços de Ferreira':    'F.C._Paços_de_Ferreira',
  'Independiente Santa Fe': 'Independiente_Santa_Fe',
  'Deportivo Cali':       'Deportivo_Cali',
  'Sevilla B':            'Sevilla_Atlético',
  'Oostende':             'K.V._Oostende',
  'AaB':                  'Aalborg_BK',
  'Lorient':              'FC_Lorient',
  'Spartak Trnava':       'FC_Spartak_Trnava',
  'Aris':                 'Aris_Thessaloniki_F.C.',
  'Guaraní':              'Club_Guaraní',
  'NEC Nijmegen':         'NEC_Nijmegen',
  'Jaguares de Chiapas':  'Chiapas_F.C.',
  'Bloemfontein Celtic':  'Bloemfontein_Celtic_F.C.',
  'LASK Linz':            'LASK',
  'Real Murcia':          'Real_Murcia_CF',
  'Aucas':                'S.D._Aucas',
  'MAS Fez':              'Maghreb_AS',
  'SCCM Mohammédia':      'Sporting_Club_Chabab_Mohammédia',
  'Wydad Casablanca':     'Wydad_AC',
  'AS Sale':              'Association_Sportive_de_Salé',
  'Mouloudia Oujda':      'Mouloudia_Club_d\'Oujda',
  'Fort Lauderdale Strikers': 'Fort_Lauderdale_Strikers_(1977–1983)',
  'Maryland Bays':        'Maryland_Bays',
  'SF Bay Blackhawks':    'San_Francisco_Bay_Blackhawks',
  'Hansa Rostock':        'FC_Hansa_Rostock',
  'UCLA Bruins':          'UCLA_Bruins_men\'s_soccer',
  'Figueres':             'UE_Figueres',
  'Tampa Bay Rowdies':    'Tampa_Bay_Rowdies_(1975–1993)',
  'Kuban Krasnodar':      'FC_Kuban_Krasnodar',
  'Racing Paris':         'Racing_Club_de_France_Football',
  'Wanderers':            'Montevideo_Wanderers_F.C.',
  'Maccabi Haifa':        'Maccabi_Haifa_F.C.',
  'Independiente Medellín': 'Independiente_Medellín',
  'Envigado':             'Envigado_F.C.',
  'Al-Ain':               'Al-Ain_FC',
  'ES Sétif':             'ES_Sétif',
  'MC Oran':              'MC_Oran',
  'JS Kabylie':           'JS_Kabylie',
  'Nîmes':                'Nîmes_Olympique',
  'VVV-Venlo':            'VVV-Venlo',
  'FC Tokyo':             'FC_Tokyo',
  'Cesena':               'A.C._Cesena',
  'Gamba Osaka':          'Gamba_Osaka',
  'Shimizu S-Pulse':      'Shimizu_S-Pulse',
  'Pittsburgh Riverhounds': 'Pittsburgh_Riverhounds_SC',
}
