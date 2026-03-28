import { useState, useEffect, useRef, memo } from 'react';

// Strip position annotations and trailing years from player names
function cleanPlayerName(n) {
  return n.replace(/\s*\(.*?\)\s*$/, '').replace(/\s+\d{2,4}$/, '');
}

// Split "Kevin De Bruyne" → { first: "Kevin De", last: "Bruyne" }
function splitName(fullName) {
  const name = cleanPlayerName(fullName).trim();
  const idx  = name.lastIndexOf(' ');
  if (idx === -1) return { first: '', last: name };
  return { first: name.slice(0, idx), last: name.slice(idx + 1) };
}
import { useWikiImage, clubWikiTitles } from '../hooks/useWikiImage';
import { ClubShield } from './Placeholders';

/* ──────────────────────────────────────────────────────────────
   LOGO SYSTEM — Two-stage waterfall
   1. Wikipedia Special:FilePath (full-colour SVG/PNG, no API key)
   2. unavatar.io/duckduckgo (favicon scraping, backup)
   3. Coloured abbreviation circle (final fallback — no smiley faces)
   ────────────────────────────────────────────────────────────── */

// Wikipedia Special:FilePath redirects are permanent, CORS-open, and return
// the actual SVG/PNG file. Only major clubs that are confirmed in the dataset.
const WP = 'https://en.wikipedia.org/wiki/Special:FilePath/';
const WC = 'https://commons.wikimedia.org/wiki/Special:FilePath/';

const LOGO_MAP = {
  // ── English ────────────────────────────────────────────────────
  'manutd.com':               WP + 'Manchester_United_FC_crest.svg',
  'liverpoolfc.com':          WP + 'Liverpool_FC.svg',
  'arsenal.com':              WP + 'Arsenal_FC.svg',
  'chelseafc.com':            WP + 'Chelsea_FC.svg',
  'mancity.com':              WP + 'Manchester_City_FC_badge.svg',
  'tottenhamhotspur.com':     WP + 'Tottenham_Hotspur.svg',
  'avfc.co.uk':               WP + 'Aston_Villa_FC_new_crest.svg',
  'evertonfc.com':            WP + 'Everton_FC_logo.svg',
  'newcastleunited.com':      WP + 'Newcastle_United_Logo.svg',
  'brightonandhovealbion.com':WP + 'Brighton_%26_Hove_Albion_logo.svg',
  'westhamunited.co.uk':      WP + 'West_Ham_United_FC_logo.svg',
  'nottinghamforest.co.uk':   WP + 'Nottingham_Forest_F.C._logo.svg',
  'rovers.co.uk':             WP + 'Blackburn_Rovers.svg',
  'burnleyfc.com':            WP + 'Burnley_FC_Logo.svg',
  'heartsfc.co.uk':           WP + 'Heart_of_Midlothian_FC_logo.svg',
  'hibernianfc.co.uk':        WP + 'Hibernian_FC_logo.svg',
  'southamptonfc.com':        WP + 'FC_Southampton.svg',
  'mfc.co.uk':                WP + 'Middlesbrough_FC_crest.svg',
  'bcfc.com':                 WP + 'Birmingham_City_FC_logo.svg',
  'crystalpalace.co.uk':      WP + 'Crystal_Palace_FC_logo_(2022).svg',
  'afcbournemouth.com':       WP + 'AFC_Bournemouth_%282013%29.svg',
  'brentfordfc.com':          WP + 'Brentford_FC_crest.svg',
  'fulhamfc.com':             WP + 'Fulham_FC_%28shield%29.svg',
  'lcfc.com':                 WP + 'Leicester_City_crest.svg',
  'qpr.co.uk':              WP + 'Queens_Park_Rangers_crest.svg',
  'watfordfc.com':          WP + 'Watford.svg',
  'wolves.co.uk':             WP + 'Wolverhampton_Wanderers.svg',
  'dundeeunitedfc.co.uk':     WP + 'Dundee_United_FC_crest.svg',
  'fcstpauli.com':            WP + 'FC_St._Pauli_logo_(2018).svg',

  // ── Spanish ───────────────────────────────────────────────────
  'realmadrid.com':           WP + 'Real_Madrid_CF.svg',
  'fcbarcelona.com':          WP + 'FC_Barcelona_(crest).svg',
  'atleticodemadrid.com':     WP + 'Atletico_Madrid_logo.svg',
  'sevillafc.com':            WP + 'Sevilla_FC_logo.svg',
  'valenciacf.com':           WP + 'Valenciacf.svg',
  'villarealcf.es':           WP + 'Villarreal_CF_logo-en.svg',
  'athletic-club.eus':        WP + 'Club_Athletic_Bilbao_logo.svg',   // Athletic Club / Athletic Bilbao
  'realsociedad.eus':         WP + 'Real_Sociedad_logo.svg',
  'rayovallecano.es':         WP + 'Rayo_Vallecano_logo.svg',
  'rcdeportivo.es':           WP + 'RC_Deportivo_La_Coru%C3%B1a_logo.svg',
  'rcdespanyol.com':          WP + 'Rcd_espanyol_logo.svg',
  'gironafc.cat':             WP + 'Girona_FC_Logo.svg',
  'realbetisbalompie.es':   WP + 'Real_betis_logo.svg',
  'levante-ud.es':          WP + 'Levante_Uni%C3%B3n_Deportiva%2C_S.A.D._logo.svg',
  'osasuna.es':               WP + 'CA_Osasuna_2024_crest.svg',
  'realvalladolid.es':        WP + 'Real_Valladolid.svg',

  // ── German ────────────────────────────────────────────────────
  'fcbayern.com':             WP + 'FC_Bayern_M%C3%BCnchen_logo_(2017).svg',
  'bvb.de':                   WP + 'Borussia_Dortmund_logo.svg',
  'bayer04.de':               WP + 'Bayer_04_Leverkusen_logo.svg',
  'schalke04.de':             WP + 'FC_Schalke_04_Logo.svg',
  'vfb.de':                   WP + 'VfB_Stuttgart_1893_Logo.svg',
  'werder.de':                WP + 'SV-Werder-Bremen-Logo.svg',
  'fc.de':                    WP + 'Emblem_1.FC_K%C3%B6ln.svg',
  'fc-koeln.de':              WP + 'Emblem_1.FC_K%C3%B6ln.svg',
  'fcaugsburg.de':            WP + 'FC_Augsburg_logo.svg',
  'eintracht.de':             WP + 'Eintracht_Frankfurt_crest.svg',
  'eintracht-frankfurt.de':   WP + 'Eintracht_Frankfurt_Logo.svg',
  'hsv.de':                   WP + 'Hamburger_SV_logo.svg',
  'borussia.de':              WP + 'Borussia_M%C3%B6nchengladbach_logo.svg',
  'mainz05.de':               WP + '1._FSV_Mainz_05_logo.svg',
  'rbleipzig.com':            WP + 'RB_Leipzig_2014_logo.svg',
  'tsg-hoffenheim.de':        WP + 'TSG_1899_Hoffenheim_logo.svg',
  'union-berlin.de':          WP + '1._FC_Union_Berlin_Logo.svg',
  'vfl-wolfsburg.de':         WP + 'VfL_Wolfsburg_Logo.svg',
  'fck.de':                   WP + 'Logo_1_FC_Kaiserslautern.svg',
  'fcn.de':                   WP + '1._FC_N%C3%BCrnberg_logo.svg',

  // ── Italian ───────────────────────────────────────────────────
  'inter.it':                 WP + 'FC_Internazionale_Milano_2021.svg',
  'acmilan.com':              WP + 'Logo_of_AC_Milan.svg',
  'juventus.com':             WP + 'Juventus_FC_2017_icon_(black%2Bwhite).svg',
  'asroma.it':                WP + 'AS_Roma_logo_(2013).svg',
  'sscnapoli.it':             WP + 'SSC_Napoli.svg',
  'sslazio.it':               WP + 'SS_Lazio_Badge.svg',
  'acffiorentina.it':         WP + 'ACF_Fiorentina_logo.svg',
  'atalantabc.it':            WP + 'Logo_Atalanta_Bergamo.svg',
  'sampdoria.it':             WP + 'U.C._Sampdoria_logo.svg',
  'parmafc.it':               WP + 'Logo_of_Parma_Calcio_1913.svg',
  'como.it':                  WP + 'Logo_Como_1907.png',
  'acperugia.it':             WP + 'AC_Perugia_Calcio_logo.svg',
  'genoacfc.it':              WP + 'Genoa_CFC_crest.svg',
  'palermocalcio.it':         WP + 'Palermo_FC.svg',
  'cagliaricalcio.net':       WP + 'Cagliari_Calcio_1920.svg',
  'acpisa.com':               WP + 'AC_Pisa_1909_logo.svg',
  'torinofc.it':              WP + 'Torino_FC_Logo.svg',

  // ── French ────────────────────────────────────────────────────
  'psg.fr':                   WP + 'Paris_Saint-Germain_F.C..svg',
  'om.fr':                    WP + 'Olympique_de_Marseille_logo.svg',
  'asmonaco.com':             WP + 'AS_Monaco_FC.svg',
  'rc-lens.fr':               WP + 'RC_Lens_logo.svg',
  'staderennais.com':         WP + 'Stade_Rennais_FC_logo.svg',
  'aja.fr':                   WP + 'AJ_Auxerre_Logo.svg',
  'girondins.com':            WP + 'FC_Girondins_de_Bordeaux_2021.svg',
  'tfc.info':                 WP + 'Toulouse_FC.svg',
  'sco-angers.fr':            WP + 'SCO_Angers_logo.svg',
  'fclbl.com':                WP + 'FC_Lorient_logo.svg',
  'fcnantes.com':             WP + 'FC_Nantes_logo.svg',
  'ol.fr':                    WP + 'Olympique_Lyonnais_%28logo%29.svg',
  'losc.fr':                WP + 'LOSC_Lille_logo.svg',
  'rcdmallorca.es':           WP + 'Rcd_mallorca.svg',
  'americadecali.co':         WP + 'Escudo_de_Am%C3%A9rica_de_Cali.svg',
  'atlnacional.com.co':       WP + 'Escudo_de_Atl%C3%A9tico_Nacional.svg',
  'orlandopiratesfc.com':     WP + 'Orlando_Pirates_FC_logo.svg',
  'kaizerchiefs.com':         WP + 'Kaizer_Chiefs_logo.svg',
  'fcbasel.ch':               WP + 'FC_Basel_logo.svg',
  'fcb.ch':                   WP + 'FC_Basel_logo.svg',
  'alshabab.sa':              WP + 'Al-Shabab_FC_(Riyadh)_logo.svg',
  'samsunspor.org.tr':        WP + 'Samsunspor_logo.svg',
  'realoviedo.es':            WP + 'Real_Oviedo_logo.svg',
  'udalmeriasad.com':         WP + 'UD_Almer%C3%ADa_logo.svg',
  'clubnecaxa.mx':            WP + 'Club_Necaxa_logo.svg',
  'sundownsfc.com':           WP + 'Mamelodi_Sundowns_logo.svg',
  'asse.fr':                  WP + 'Logo_AS_Saint-%C3%89tienne.svg',
  'asnl.net':                 WP + 'AS_Nancy-Lorraine_logo.svg',
  'realzaragoza.com':         WP + 'Real_Zaragoza_logo.svg',
  'ga-eagles.nl':             WP + 'Go_Ahead_Eagles_logo.svg',
  'willem-ii.nl':             WP + 'Willem_II_logo.svg',
  'herthabsc.com':            WP + 'Hertha_BSC_Logo_2012.svg',
  'alanyaspor.org.tr':        WP + 'Alanyaspor_logo.svg',
  'adodenhaag.nl':            WP + 'ADO_Den_Haag_logo.svg',
  'cssa.fr':                  WP + 'CS_Sedan_Ardennes_logo.svg',
  'est.org.tn':               WP + 'EST_New_Logo_2012.png',
  'stade-tunisien.tn':        WP + 'Enstadetunisien.png',
  'gaziantepfk.org':          WP + 'Gaziantepspor_kulubu.svg',
  'fcsochaux.fr':             WP + 'Logo_FC_Sochaux-Montbéliard_%28avant_2004%29.svg',

  // ── Portuguese ───────────────────────────────────────────────
  'fcporto.pt':               WP + 'FC_Porto.svg',
  'slbenfica.pt':             WP + 'Benficalogo.svg',
  'sporting.pt':              WP + 'Sporting_CP_%E2%80%93_Logo.png',

  // ── Dutch ─────────────────────────────────────────────────────
  'ajax.nl':                  WP + 'Ajax_Amsterdam.svg',
  'psv.nl':                   WP + 'PSV_Eindhoven.svg',
  'feyenoord.nl':             WP + 'Feyenoord_logo.svg',
  'az.nl':                    WP + 'AZ_Alkmaar.svg',

  // ── Belgian ───────────────────────────────────────────────────
  'rsca.be':                  WP + 'RSC_Anderlecht_Logo.svg',
  'clubbrugge.be':            WP + 'Club_Brugge_KV_logo.svg',
  'lierse.com':               WP + 'Lierse_SK_logo.svg',

  // ── Turkish ───────────────────────────────────────────────────
  'galatasaray.org':          WP + 'Galatasaray_Sports_Club_Logo.png',
  'fenerbahce.org':           WP + 'Fenerbah%C3%A7e_SK_logo.svg',
  'besiktas.com.tr':          WP + 'Besiktas_JK_%28v2%29.svg',
  'trabzonspor.org.tr':       WP + 'Trabzonspor_logo.svg',

  // ── Scottish ─────────────────────────────────────────────────
  'rangers.co.uk':            WP + 'Rangers_FC.svg',
  'celticfc.net':             WP + 'Celtic_FC.svg',

  // ── Croatian ─────────────────────────────────────────────────
  'gnkdinamo.hr':             WP + 'GNK_Dinamo_Zagreb.svg',
  'hnkhajduk.hr':             WP + 'Hajduk_Split.svg',

  // ── Scandinavian ─────────────────────────────────────────────
  'brondby.com':              WP + 'Br%C3%B8ndby_IF_Logo.svg',
  'fcm.dk':                   WP + 'FC_Midtjylland_logo.svg',

  // ── Greek ─────────────────────────────────────────────────────
  'paofc.gr':                 WP + 'Panathinaikos_FC_logo.svg',
  'pao.gr':                 WP + 'Panathinaikos_FC_logo.svg',
  'aek.gr':                   WP + 'AEK_Athens_FC_logo.svg',
  'olympiakos.org':           WP + 'Olympiacos_FC_logo.svg',

  // ── Saudi / Middle East ───────────────────────────────────────
  'alnassr.com':              WP + 'Nassr_FC_Logo.svg',
  'alhilal.com':              WP + 'Al-Hilal_FC.svg',
  'alahli.com':               WP + 'Al_Ahli_Saudi_FC_Logo.png',
  'alettifaq.com':            WP + 'Al-Ettifaq.svg',
  'alfateh.com':              WP + 'Al-Fateh_SC_Logo.svg',
  'alittihadclub.com':        WP + 'Al-Ittihad_Club_(Jeddah)_logo.svg',
  'al-ittihad.com.sa':        WP + 'Al-Ittihad_Club_(Jeddah)_logo.svg',
  'alqadsiah.com':            WP + 'Al-Qadsiah_FC_logo.svg',

  // ── Brazilian ─────────────────────────────────────────────
  'flamengo.com.br':          WP + 'Flamengo_braz_logo.svg',
  'palmeiras.com.br':         WP + 'Palmeiras_logo.svg',
  'corinthians.com.br':       WP + 'Sport_Club_Corinthians_Paulista_crest.svg',
  'saopaulofc.net':           WP + 'Sao_Paulo_FC_logo.svg',
  'atletico.com.br':          WP + 'Atletico_Mineiro_escudo.svg',

  // ── Mexican ──────────────────────────────────────────────────
  'clubamerica.com.mx':       WP + 'Club_Am%C3%A9rica_logo.svg',
  'cruzazulfc.com.mx':        WP + 'Cruz_Azul_Logo.svg',
  'tuzos.com.mx':             WP + 'CF_Pachuca.svg',
  'pachuca.com.mx':           WP + 'CF_Pachuca.svg',
  'rayados.com':              WP + 'C.F._Monterrey_logo.svg',
  'atlasfc.com.mx':           WP + 'F%C3%BAtbol_Club_Atlas.svg',
  'chivasdecorazon.com.mx':   WP + 'Club_Deportivo_Guadalajara_logo.svg',
  'pumas.mx':                 WP + 'Logo_Pumas.svg',
  'tigres.com.mx':            WP + 'Tigres_UANL_logo.svg',
  'clubsantos.mx':            WP + 'Club_Santos_Laguna_logo.svg',
  'clubleon.mx':              WP + 'Club_Leon_logo.svg',
  'tolucafc.com':             WP + 'Deportivo_Toluca_FC_logo.svg',
  'clubpuebla.com':           WP + 'Club_Puebla_Logo.svg',
  'dorogifc.hu':              'https://images.seeklogo.com/logo-png/41/1/dorogi-banyasz-sk-mid-1950s-logo-png_seeklogo-411602.png',
  'fcrouen.fr':               WP + 'Football_Club_de_Rouen_1899.svg',

  // ── MLS ───────────────────────────────────────────────────────
  'intermiamicf.com':         WP + 'Inter_Miami_CF_logo.svg',
  'newyorkredbulls.com':      WP + 'New_York_Red_Bulls_logo.svg',
  'houstondynamofc.com':      WP + 'Houston_Dynamo_FC_logo_(2020).svg',
  'columbuscrew.com':         WP + 'Columbus_Crew_SC_logo.svg',
  'fcdallas.com':             WP + 'FC_Dallas_logo.svg',
  'lafc.com':                 WP + 'LAFC_logo.svg',
  'lagalaxy.com':             WP + 'LA_Galaxy_logo.svg',
  'whitecapsfc.com':          WP + 'Vancouver_Whitecaps_FC_logo.svg',
  'torontofc.ca':             WP + 'Toronto_FC_logo.svg',
  'cfmontreal.com':           WP + 'CF_Montr%C3%A9al_logo.svg',
  'nashvillesc.com':          WP + 'Nashville_SC_logo.svg',
  'dcunited.com':             WP + 'D.C._United_logo_(2016).svg',
  'coloradorapids.com':       WP + 'Colorado_Rapids_logo.svg',
  'mnufc.com':                WP + 'Minnesota_United_FC_logo.svg',
  'sandiegofc.com':           WP + 'San_Diego_FC_crest.svg',
  'realsaltlake.com':         WP + 'Real_Salt_Lake_logo.svg',
  'revolutionsoccer.net':     WP + 'New_England_Revolution_logo.svg',
  'sportingkc.com':           WP + 'Sporting_Kansas_City_logo.svg',
  'portlandtimbers.com':      WP + 'Portland_Timbers_logo.svg',
  'soundersfc.com':           WP + 'Seattle_Sounders_FC_logo.svg',

  // ── Japanese ────────────────────────────────────────────────
  'frontale.co.jp':           WP + 'Kawasaki_Frontale.svg',
  'vissel-kobe.co.jp':        WP + 'Vissel_Kobe_logo.svg',
  'kyotosanga.co.jp':         WP + 'Kyoto_Sanga_FC_logo.svg',
  'fagiano.com':              WP + 'Fagiano_Okayama_FC_Logo.svg',

  // ── Korean ────────────────────────────────────────────────────
  'jeonbukhyundai.com':       WP + 'Jeonbuk_Hyundai_Motors_FC.svg',
  'uhfc.co.kr':               WP + 'Ulsan_HD_FC.svg',
  'steelers.co.kr':           WP + 'Pohang_Steelers_emblem.svg',
  'bluewings.kr':             WP + 'Suwon_Samsung_Bluewings_logo.svg',
  'iparkfc.co.kr':            WP + 'Busan_IPark_FC_logo.svg',
  'seongnamfc.com':           WP + 'Seongnam_FC_Logo.svg',
  'fcseoul.com':              WP + 'FC_Seoul.svg',

  // ── Argentine ─────────────────────────────────────────────────
  'rizesporkulubu.com.tr':    WP + '%C3%87aykur_Rizespor_logo.svg',
  'futurefc.com':             WP + 'Modern_Future_FC_logo.svg',
  'scfreiburg.com':           WP + 'SC_Freiburg_logo.svg',
  'herthabsc.de':             WP + 'Hertha_BSC_Logo_2012.svg',
  'clubolimpia.com.py':       WP + 'Club_Olimpia_logo.svg',
  'clubdeportivotenerife.es': WP + 'CD_Tenerife_logo.png',
  'fc-zenit.ru':              WP + 'FC_Zenit_Saint_Petersburg_logo.svg',
  'fcdm.ru':                  WP + 'FC_Dynamo_Moscow_logo.svg',
  'rubin-kazan.ru':           WP + 'FC_Rubin_Kazan_logo.svg',
  'cafc.co.uk':               WP + 'Charlton_Athletic_FC_logo.svg',
  'cardiffcityfc.co.uk':      WP + 'Cardiff_City_FC_logo.svg',
  'levski.bg':                WP + 'PFC_Levski_Sofia_logo.svg',
  'mff.se':                   WP + 'Malm%C3%B6_FF_logo.svg',
  'fckrasnodar.ru':           WP + 'FC_Krasnodar_logo.svg',
  'legia.com':                WP + 'Legia_Warszawa_logo.svg',
  'skrapid.at':               WP + 'Logo_SK_Rapid_Wien.svg',
  'fk-austria.at':            WP + 'Logo_FK_Austria_Wien.svg',
  'sksturm.at':               WP + 'SK_Sturm_Graz_logo.svg',
  'empolifc.com':             WP + 'Empoli_F.C._logo.svg',
  'al-saddclub.com':          WP + 'Al-Sadd_SC_logo.svg',
  'fcdinamo.ro':              WP + 'FC_Dinamo_1948_Bucure%C3%B8ti.svg',
  'sporting.be':              WP + 'KSC_Lokeren_Oost-Vlaanderen.svg',
  'rbk.no':                   WP + 'Rosenborg_BK_logo.svg',
  'vasco.com.br':             WP + 'CRVascoDaGama.svg',
  'bjk.com.tr':               WP + 'Be%C5%9Fikta%C5%9F_JK_Logo.svg',
  'fcdynamo.com':             WP + 'FC_Dynamo_Kyiv_logo.svg',
  'hannover96.de':            WP + 'Hannover_96_logo.svg',
  'sc-heerenveen.nl':         WP + 'SC_Heerenveen_logo.svg',
  'redbullsalzburg.at':       WP + 'FC_Red_Bull_Salzburg_logo.svg',
  'elchecf.es':               WP + 'Elche_CF_logo.svg',
  'rsl.com':                  WP + 'Real_Salt_Lake_logo.svg',
  'bwfc.co.uk':               WP + 'Bolton_Wanderers_FC_logo.svg',
  'fcmetz.com':               WP + 'FC_Metz_2021_Logo.svg',
  'timbers.com':              WP + 'Portland_Timbers_logo.svg',
  'fcsg.ch':                  WP + 'FC_St._Gallen_logo.svg',
  'malagacf.com':             WP + 'M%C3%A1laga_CF_logo.svg',
  'fctwente.nl':              WP + 'FC_Twente_logo.svg',
  'royalantwerpfc.be':        WP + 'Royal_Antwerp_FC_logo.svg',
  'boavistafc.pt':            WP + 'Boavista_F.C._logo.svg',
  'sc-bastia.corsica':        WP + 'SC_Bastia_logo.svg',
  'ac-ajaccio.corsica':       WP + 'AC_Ajaccio_logo.svg',
  'f-marinos.com':            WP + 'Yokohama_F._Marinos_logo_2024.svg',
  'sscalciobari.it':          WP + 'SSC_Bari_logo.svg',
  'rizespor.org.tr':          WP + 'Çaykur_Rizespor_logo.svg',
  'recreativohuelva.com':     WP + 'Real_Club_Recreativo_de_Huelva_logo.svg',
  'millonarios.com.co':       WP + 'Millonarios_FC_logo.svg',
  'wisla.krakow.pl':          WP + 'Wis%C5%82a_Krak%C3%B3w_logo.svg',
  'wrexhamafc.co.uk':         WP + 'Wrexham_AFC_logo.svg',
  'lutontown.co.uk':          WP + 'Luton_Town_logo.svg',
  'sydneyfc.com':             WP + 'Sydney_FC_logo.svg',
  'ccfc.co.uk':               WP + 'Coventry_City_FC_logo.svg',
  'partizan.rs':              WP + 'FK_Partizan_logo.svg',
  'fcdinamo.ge':              WP + 'FC_Dinamo_Tbilisi_logo.svg',
  'etoile-du-sahel.com':      WP + 'Logo_Etoile_Sportive_du_Sahel.svg',
  'torpedo.ru':               WP + 'FC_Torpedo_Moscow_Logo.svg',
  'fksarajevo.ba':            WP + 'FK_Sarajevo_Logo.svg',
  'fkvojvodina.rs':           WP + 'FK_Vojvodina_logo.svg',
  'crvenazvezdafk.com':       WP + 'Red_Star_Belgrade_logo.svg',
  'fkzeljeznicar.ba':         WP + 'FK_%C5%BDeljezni%C4%8Dar_logo.svg',
  'millwallfc.co.uk':         WP + 'Millwall_FC_logo.svg',
  'canaries.co.uk':           WP + 'Norwich_City.svg',
  'santafe.co':               WP + 'Independiente_Santa_Fe_logo.svg',
  'deportivocali.com.co':     WP + 'Escudo_Deportivo_Cali.svg',
  'fc-hansa.de':              WP + 'F.C._Hansa_Rostock_logo.svg',
  'mhaifafc.com':             WP + 'Maccabi_Haifa_FC_logo.svg',
  'alainclub.ae':             WP + 'Al_Ain_FC_logo.svg',
  'gamba-osaka.net':          WP + 'Gamba_Osaka_logo.svg',
  'fctokyo.co.jp':            WP + 'FC_Tokyo_logo.svg',
  'aabsport.dk':              WP + 'AaB_logo.svg',
  'fclorient.bzh':            WP + 'FC_Lorient_logo.svg',
  'lask.at':                  WP + 'LASK_Linz_logo.svg',
  'wydad.com':                WP + 'Wydad_AC_logo.svg',
  'vvv-venlo.nl':             WP + 'VVV-Venlo_logo.svg',
  'fcspartaktrnava.com':      WP + 'FC_Spartak_Trnava_logo.svg',
  'arisfc.com.gr':            WP + 'Aris_Thessaloniki_F.C._logo.svg',
  'clubguarani.com.py':       WP + 'C_Guarani.svg',
  'nec-nijmegen.nl':          WP + 'N.E.C._Nijmegen_logo.svg',
  'realmurcia.es':            WP + 'Real_Murcia_CF.svg',
  'cariverplate.com.ar':      WP + 'River_Plate_crest.svg',
  'bocajuniors.com.ar':       WP + 'Boca_Juniors_logo.svg',
  'clubaindependiente.com.ar':WP + 'Club_Atl%C3%A9tico_Independiente_logo.svg',
  'velez.com.ar':             WP + 'V%C3%A9lez_Sarsfield_crest.svg',
  'argentinosjuniors.com.ar': WP + 'Asociaci%C3%B3n_Atl%C3%A9tica_Argentinos_Juniors_logo.svg',
  'estudiantes.com.ar':       WP + 'Estudiantes_de_la_Plata_crest_(2025).svg',
  'casla.com.ar':             WP + 'San_Lorenzo_de_Almagro_crest.svg',
  'racingclub.com.ar':        WP + 'Racing_Club_(logo).svg',
  'rosariocentral.com':       WP + 'Club_Atl%C3%A9tico_Rosario_Central_logo.svg',
  'newellsoldboys.com.ar':    WP + 'Newell%27s_Old_Boys_logo.svg',
  'cdeportivoespanol.com.ar': WP + 'Deportivo_Espa%C3%B1ol_logo.png', // PNG fallback
  'clubatleticocerro.com':    WP + 'Club_Atl%C3%A9tico_Cerro_logo.svg',
  'centralespanol.com.uy':    WP + 'Central_Espa%C3%B1ol_crest.png',

  // ── English / UK (Iconic) ─────────────────────────────────────
  'leedsunited.com':          WP + 'Leeds_United_F.C._logo.svg',
  'whufc.com':                WP + 'West_Ham_United_FC_logo.svg',
  'wba.co.uk':                WP + 'West_Bromwich_Albion_F.C._logo.svg',
  'blackpoolfc.co.uk':        WP + 'Blackpool_FC_logo.svg',
  'dcfc.co.uk':               WP + 'Derby_County_FC_logo.svg',
  'wiganathletic.com':        WP + 'Wigan_Athletic_FC_logo.svg',
  'middlesbroughfc.com':      WP + 'Middlesbrough_FC_logo.svg',
  'boltonwanderersfc.co.uk':  WP + 'Bolton_Wanderers_FC_logo.svg',
  'charltonathletic.com':     WP + 'Charlton_Athletic_FC_logo.svg',

  // ── Brazilian (Iconic) ──────────────────────────────────────────
  'santosfc.com.br':          WP + 'Santos_FC_logo.svg',
  'cruzeiro.com.br':          WP + 'Cruzeiro_Esporte_Clube_logo.svg',
  'fluminense.com.br':        WP + 'Fluminense_FC_logo.svg',
  'botafogo.com.br':          WP + 'Botafogo_de_Futebol_e_Regatas_logo.svg',
  'gremio.net':               WP + 'Gremio_logo.svg',
  'internacional.com.br':     WP + 'Sport_Club_Internacional_logo.svg',

  // ── Uruguayan / Chilean / South American ─────────────────────────
  'penarol.org':              WP + 'Pe%C3%B1arol_logo.svg',
  'nacional.uy':              WP + 'Club_Nacional_de_Football_logo.svg',
  'udechile.cl':              WP + 'Club_Universidad_de_Chile_logo.svg',
  'colocolo.cl':              WP + 'Colo-Colo_logo.svg',
  'uc.cl':                    WP + 'Club_Universidad_Cat%C3%B3lica_logo.svg',

  // ── Czech / Eastern Europe ──────────────────────────────────────
  'sparta.cz':                WP + 'AC-Sparta-LOGO2021.svg',
  'slavia.cz':                WP + 'SK_Slavia_Praha_full_logo.svg',
  'fcb.cz':                   WP + 'FC_Ban%C3%ADk_Ostrava_logo.svg',

  // ── Misc Iconic / Missing ─────────────────────────────────────
  'clubatleticajunior.com':   WP + 'Junior_de_Barranquilla_logo.svg',
  'zamorafc.com':             WP + 'Zamora_FC_logo.svg',
  'fénix.com.uy':             WP + 'Centro_Atl%C3%A9tico_F%C3%A9nix_logo.svg',
  'adelaideunited.com.au':    WP + 'Adelaide_United_FC_logo.svg',
  'fcamsterdam.nl':           WP + 'FC_Amsterdam_logo.png', // Extinct club
  'honvedfc.hu':              WP + 'Budapest_Honv%C3%A9d_FC_logo.svg',
  'mtkbudapest.hu':           WP + 'MTK_Budapest_logo.svg',
  'ujpestfc.hu':              WP + 'Ujpest_FC_logo.svg',
  'fradi.hu':                 WP + 'Ferencv%C3%A1rosi_TC_logo.svg',
  'alahlysc.com':             WP + 'Al_Ahly_SC_logo.svg',
  'zamalek.com':              WP + 'Zamalek_SC_logo.svg',

  // ── CONCACAF ───────────────────────────────────────────────
  'saprissa.com':             WP + 'Deportivo_Saprissa_logo.svg',
  'ldu.com.ec':               WP + 'LDU_Quito_logo.svg',
  'clubolimpia.com':          WP + 'Club_Olimpia_logo.svg',
  'motagua.com':              WP + 'F.C._Motagua_logo.svg',
  'platensefc.com':           WP + 'Platense_FC_logo.svg',
  'comunicacionesfc.com':     WP + 'Comunicaciones_FC_logo.svg',
  'municipal.com.gt':         WP + 'C.S.D._Municipal_Logo.svg',
  'taurofc.com':              WP + 'Tauro_FC_Logo.svg',
  'sanfranciscofc.com':       WP + 'San_Francisco_FC_logo.svg',

  // ── Caribbean (Trinidad & Tobago / etc) ────────────────────────
  'jablotehfc.com':           WP + 'San_Juan_Jabloteh_logo.png',
  'wconnectionfc.com':        WP + 'W_Connection_FC_logo.png',
  'joepublicfc.com':          WP + 'Joe_Public_FC_logo.png',
  'defenseforcefc.com':       WP + 'Defence_Force_FC_logo.svg',
  'northeaststars.com':       WP + 'North_East_Stars_FC_logo.png',

  // ── African (More) ────────────────────────────────────────────
  'ismailyclub.org':          WP + 'Ismaily_SC_logo.svg',
  'pyramidsfc.com':           WP + 'Pyramids_FC_logo.svg',
  'masress.com':              WP + 'Al_Masry_SC_logo.svg',
  'unionracing.com':          WP + 'USM_Alger_logo.svg',
  'eskahdid.com':             WP + 'ES_S%C3%A9tif_logo.svg',

  // ── Honduras / Misc ──────────────────────────────────────────
  'cdmarathon.com':           WP + 'C.D._Marath%C3%B3n_logo.svg',
  'realdeportivoespana.com':  WP + 'Real_C.D._Espa%C3%B1a_logo.svg',

  // ── Belgian / Dutch ──────────────────────────────────────────
  'standard.be':              WP + 'Standard_de_Li%C3%A8ge_logo.svg',
  'cambuur.nl':               WP + 'SC_Cambuur_logo.svg',
  'kaagent.be':               WP + 'KAA_Gent_logo.svg',
  'krcgenk.be':               WP + 'KRC_Genk_logo.svg',

  // ── Portuguese ────────────────────────────────────────────────
  'fcpf.pt':                  WP + 'F.C._Pa%C3%A7os_de_Ferreira_logo.svg',
  'moreirensefc.pt':          WP + 'Moreirense_FC_logo.svg',

  // ── Spanish (Misc Iconic) ─────────────────────────────────────
  'realracingclub.es':        WP + 'Real_Racing_Club_de_Santander_logo.svg',
  'mallorca.es':              WP + 'Rcd_mallorca.svg',

  // ── English (More Iconic) ─────────────────────────────────────
  'readingfc.co.uk':          WP + 'Reading_FC.svg',
  'leytonorient.com':         WP + 'Leyton_Orient_FC_logo.svg',

  // ── Haitian (1974 Iconic) ─────────────────────────────────────
  'victory-sc.ht':            WP + 'Victory_Sporttif_Club.png',
  'violette-ac.ht':           WP + 'Violette_Athletic_Club_logo.png',
  'aigle-noir.ht':            WP + 'Aigle_Noir_AC.png',
  'don-bosco-haitien.ht':     WP + 'Don_Bosco_FC.png',
  'racing-club-haitien.ht':   WP + 'Racing_Club_Ha%C3%AFtien_logo.png',
  'archibald-sc.ht':          WP + 'Haiti_national_football_team_logo.png', // Fallback to NT logo
  'va-fc.com':                WP + 'Valenciennes_FC_Logo.svg',
  'cdplazaamador.com':        WP + 'CD_Plaza_Amador_logo.svg',
  'arabeunido.com':           WP + 'CD_%C3%81rabe_Unido_logo.svg',
  'swanseacity.com':          WP + 'Swansea_City_AFC_logo.svg',
  'fcmulhouse.net':           WP + 'Logo_FC_Mulhouse_2020.svg',

  // ── Corrected / Added ──────────────────────────────────────
  'pfc-cska.com':             WP + 'CSKA_Moscow_logo.svg',
  'pfc-zenit.ru':             WP + 'FC_Zenit_1925_logo.svg',
  'spartak.com':              WP + 'FC_Spartak_Moscow_logo.svg',

  // ── Auto-discovered (203 missing clubs) ────────────────────
  'flyeralarmadmira.at':      WP + 'Admira_Wacker.svg',
  'shababahli.ae':            WP + 'Al_Ahli_Dubai.svg',
  'alahlyegypt.com':          WP + 'Al_Ahly.svg',
  'alahli.sa':                WP + 'Al-Ahli.svg',
  'al-arabi.com':             WP + 'Al-Arabi.svg',
  'ettifaq.com':              WP + 'Al-Ettifaq.svg',
  'alhilal.sa':               WP + 'Al-Hilal.svg',
  'alittihad.sa':             WP + 'Al-Ittihad.svg',
  'alnassr.sa':               WP + 'Al-Nassr.svg',
  'altaee.sa':                WP + "Al-Ta'ee.svg",
  'lda.cr':                   WP + 'Alajuelense.svg',
  'clubalianzalima.com.pe':   WP + 'Alianza_Lima.svg',
  'arka.gdynia.pl':           WP + 'Arka_Gdynia.svg',
  'asmarsa.com':              WP + 'AS_Marsa.svg',
  'asec.ci':                  WP + 'ASEC_Mimosas.svg',
  'atalanta.it':              WP + 'Atalanta.svg',
  'atlantefc.mx':             WP + 'Atlante.svg',
  'atleticobucaramanga.com.co': WP + 'Atletico_Bucaramanga.svg',
  'aucas.ec':                 WP + 'Aucas.svg',
  'august8th.kp':             WP + 'August_8th.svg',
  'fedefutguate.gt':          WP + 'Aurora_FC.svg',
  'baltimoreblast.com':       WP + 'Baltimore_Blast.svg',
  'barcelonasc.com.ec':       WP + 'Barcelona_SC.svg',
  'bloemfonteincelticfc.co.za': WP + 'Bloemfontein_Celtic.svg',
  'glimt.no':                 WP + 'Bod%2FGlimt.svg',
  'clubbolivar.com':          WP + 'Bolivar.svg',
  'bolognafc.it':             WP + 'Bologna.svg',
  'scbraga.pt':               WP + 'Braga.svg',
  'cab-officiel.com':         WP + 'CA_Bizertin.svg',
  'cagliaricalcio.com':       WP + 'Cagliari.svg',
  'ascannes.fr':              WP + 'Cannes.svg',
  'canon-yaounde.com':        WP + 'Canon_Yaounde.svg',
  'capetownspurs.co.za':      WP + 'Cape_Town_Spurs.svg',
  'rcfc.be':                  WP + 'Cappellen.svg',
  'cartagines.cr':            WP + 'Cartagines.svg',
  'rccelta.es':               WP + 'Celta_Vigo.svg',
  'celticfc.com':             WP + 'Celtic.svg',
  'clubcerro.com':            WP + 'Cerro_Porteno.svg',
  'calciocesena.com':         WP + 'Cesena.svg',
  'chacaritajuniors.com.ar':  WP + 'Chacarita_Juniors.svg',
  'berrichonne.com':          WP + 'Chateauroux.svg',
  'cschenois.ch':             WP + 'Chenois.svg',
  'chesterfc.com':            WP + 'Chester_City.svg',
  'chicagofirefc.com':        WP + 'Chicago_Fire.svg',
  'mlssoccer.com':            WP + 'Chivas_USA.svg',
  'fepafut.com':              WP + 'Chorrillo.svg',
  'clubafricain.com':         WP + 'Club_Africain.svg',
  'ftf.org.tn':               WP + 'CO_Transports.svg',
  'fck.dk':                   WP + 'Copenhagen.svg',
  'cpfc.co.uk':               WP + 'Crystal_Palace.svg',
  'css.org.tn':               WP + 'CS_Sfaxien.svg',
  'dalianpro.com':            WP + 'Dalian_Shide.svg',
  'defensorsporting.com.uy':  WP + 'Defensor_Sporting.svg',
  'clubmunicipal.pe':         WP + 'Deportivo_Municipal.svg',
  'dinamo-minsk.by':          WP + 'Dinamo_Minsk.svg',
  'egaleo-fc.gr':             WP + 'Egaleo.svg',
  'eintracht-trier.com':      WP + 'Eintracht_Trier.svg',
  'elnacional.ec':            WP + 'El_Nacional.svg',
  'enppiclub.org':            WP + 'ENPPI.svg',
  'envigadofc.co':            WP + 'Envigado.svg',
  'estudiantesdelaplata.com': WP + 'Estudiantes.svg',
  'etgfc.com':                WP + 'Evian.svg',
  'unioneuropeaextremadura.com': WP + 'Extremadura.svg',
  'falkirkfc.co.uk':          WP + 'Falkirk.svg',
  'fcliege.be':               WP + 'FC_Liege.svg',
  '425sports.kp':             WP + 'February_8th.svg',
  'cafenix.com.uy':           WP + 'Fenix.svg',
  'ferrocarriloeste.org.ar':  WP + 'Ferro_Carril_Oeste.svg',
  'uefigueres.cat':           WP + 'Figueres.svg',
  'acffiorentina.com':        WP + 'Fiorentina.svg',
  'fredrikstadfk.no':         WP + 'Fredrikstad.svg',
  'freestatestars.co.za':     WP + 'Free_State_Stars.svg',
  'gfca-foot.com':            WP + 'Gazelec_Ajaccio.svg',
  'beerschot.be':             WP + 'Germinal_Beerschot.svg',
  'getafecf.com':             WP + 'Getafe.svg',
  'gillinghamfootballclub.com': WP + 'Gillingham.svg',
  'glentoran.com':            WP + 'Glentoran.svg',
  'goldenarrowsfc.com':       WP + 'Golden_Arrows.svg',
  'gornikzabrze.pl':          WP + 'Gornik_Zabrze.svg',
  'greenbuffaloesfc.com':     WP + 'Green_Buffaloes.svg',
  'hajduk.hr':                WP + 'Hajduk_Split.svg',
  'hammarbyfotboll.se':       WP + 'Hammarby_IF.svg',
  'hvfc.net':                 WP + 'Harbour_View.svg',
  'henanfc.com':              WP + 'Henan_Jianye.svg',
  'herculesdealicantecf.net': WP + 'Hercules.svg',
  'herediano.com':            WP + 'Herediano.svg',
  'ifkgoteborg.se':           WP + 'IFK_Goteborg.svg',
  'dimoficial.com':           WP + 'Independiente_Medellin.svg',
  'ictfc.com':                WP + 'Inverness_CT.svg',
  'ismailyclub.com':          WP + 'Ismaily.svg',
  'fcistres.fr':              WP + 'Istres.svg',
  'chiapasfc.com':            WP + 'Jaguares_de_Chiapas.svg',
  'jomocosmos.co.za':         WP + 'Jomo_Cosmos.svg',
  'jsk.dz':                   WP + 'JS_Kabylie.svg',
  'jsstpierroise.re':         WP + 'JS_Saint-Pierroise.svg',
  'juanaurich.net':           WP + 'Juan_Aurich.svg',
  'jubilo-iwata.co.jp':       WP + 'Jubilo_Iwata.svg',
  'thenff.com':               WP + 'Julius_Berger.svg',
  'juniorsj.com':             WP + 'Junior.svg',
  'ksc.de':                   WP + 'Karlsruher_SC.svg',
  'kayserispor.org.tr':       WP + 'Kayserispor.svg',
  'kigwancha-sports.kp':      WP + 'Kigwancha.svg',
  'kocaelispor.com.tr':       WP + 'Kocaelispor.svg',
  'konyaspor.org.tr':         WP + 'Konyaspor.svg',
  'kvk.be':                   WP + 'Kortrijk.svg',
  'fckrasnodar.jp':           WP + 'Krasnodar.svg',
  'fckuban.com':              WP + 'Kuban_Krasnodar.svg',
  'fccf.ch':                  WP + 'La_Chaux-de-Fonds.svg',
  'larochevf.com':            WP + 'La_Roche_VF.svg',
  'hac-foot.com':             WP + 'Le_Havre.svg',
  'rclens.fr':                WP + 'Lens_logo.svg',
  'fedefutbol.com':           WP + 'Liberia_Mia_logo.svg',
  'clublibertad.com.py':      WP + 'Libertad_logo.svg',
  'lkslodz.pl':               WP + 'KS_odz_logo.svg',
  'fclm.ru':                  WP + 'Lokomotiv_Moscow_logo.svg',
  'fclugano.com':             WP + 'Lugano_logo.svg',
  'maccabi-tlv.co.il':        WP + 'Maccabi_Tel_Aviv_logo.svg',
  'deportivomaldonado.com':   WP + 'Maldonado_logo.svg',
  'faf.dz':                   WP + 'MC_Oran_logo.svg',
  'sitiofuente.mx':           WP + 'Monarcas_Morelia_logo.svg',
  'mhscfoot.com':             WP + 'Montpellier_logo.svg',
  'moranbong.kp':             WP + 'Moranbong_logo.svg',
  'rojos.com':                WP + 'Municipal_logo.svg',
  'xamax.ch':                 WP + 'Neuchatel_Xamax_logo.svg',
  'nufc.co.uk':               WP + 'Newcastle_United_logo.svg',
  'ogcnice.com':              WP + 'Nice_logo.svg',
  'nimes-olympique.com':      WP + 'Nmes_logo.svg',
  'ntfc.co.uk':               WP + 'Northampton_Town.svg',
  'ob.dk':                    WP + 'OB_logo.svg',
  'oficretefc.com':           WP + 'OFI_Crete_logo.svg',
  'ofkbeograd.co.rs':         WP + 'OFK_Beograd_logo.svg',
  'olympiacos.org':           WP + 'Olympiacos_logo.svg',
  'kvo.be':                   WP + 'Oostende_logo.svg',
  'oufc.co.uk':               WP + 'Oxford_United_logo.svg',
  'fcppereira.pt':            WP + 'Pacos_de_Ferreira_logo.svg',
  'palermofc.com':            WP + 'Palermo_logo.svg',
  'paokfc.gr':                WP + 'PAOK_logo.svg',
  'parmacalcio1913.com':      WP + 'Parma_logo.svg',
  'municipalpz.net':          WP + 'Perez_Zeledon_logo.svg',
  'petrojetclub.com':         WP + 'Petrojet_logo.svg',
  'pisasportingclub.it':      WP + 'Pisa_logo.svg',
  'riverhounds.com':          WP + 'Pittsburgh_Riverhounds_logo.svg',
  'port-vale.co.uk':          WP + 'Port_Vale_logo.svg',
  'portsmouthfc.co.uk':       WP + 'Portsmouth_logo.svg',
  'quimper-kerfeunteun-fc.fr': WP + 'Quimper_logo.svg',
  'racingclubdefrance.com':   WP + 'Racing_Paris.svg',
  'raja-casablanca.com':      WP + 'Raja_Casablanca_logo.svg',
  'rajacasablanca.com':       WP + 'Raja_Casablanca_logo.svg',
  'real-espana.com':          WP + 'Real_Espana_logo.svg',
  'cariverplate.uy':          WP + 'River_Plate_(U)_logo.svg',
  'rodajckerkrade.nl':        WP + 'Roda_JC_logo.svg',
  'asroma.com':               WP + 'Roma_logo.svg',
  'fc-saarbruecken.de':       WP + 'Saarbrucken_logo.svg',
  'sjearthquakes.com':        WP + 'San_Jose_Earthquakes_logo.svg',
  'ttproleague.com':          WP + 'San_Juan_Jabloteh_logo.svg',
  'sanlorenzo.com.ar':        WP + 'San_Lorenzo_logo.svg',
  'santiagowanderers.cl':     WP + 'Santiago_Wanderers_logo.svg',
  'santosfc.co.za':           WP + 'Santos_Cape_Town_logo.svg',
  'frmf.ma':                  WP + 'SCCM_Mohammedia_logo.svg',
  'jff.live':                 WP + 'Sebba_United_logo.svg',
  'rfc-seraing.be':           WP + 'Seraing_logo.svg',
  'sevillafc.es':             WP + 'Sevilla_B_logo.svg',
  'shakhtar.com':             WP + 'Shakhtar_Donetsk_logo.svg',
  'swfc.co.uk':               WP + 'Sheffield_Wednesday_logo.svg',
  's-pulse.co.jp':            WP + 'Shimizu_S-Pulse_logo.svg',
  'fc-sion.ch':               WP + 'Sion_logo.svg',
  'skarostov.ru':             WP + 'SKA_Rostov-on-Don_logo.svg',
  'clubsportingcristal.pe':   WP + 'Sporting_Cristal_logo.svg',
  'perthstjohnstonefc.co.uk': WP + 'St_Johnstone_logo.svg',
  'stade-lavallois.com':      WP + 'Stade_Lavallois_logo.svg',
  'rcstrasbourgalsace.fr':    WP + 'Strasbourg_logo.svg',
  'safc.com':                 WP + 'Sunderland_logo.svg',
  'sunshinestarsfc.com':      WP + 'Sunshine_Stars_logo.svg',
  'supersportunited.co.za':   WP + 'SuperSport_United_logo.svg',
  'canadasoccer.com':         WP + 'Tacoma_Stars_logo.svg',
  'ussoccer.com':             WP + 'Tampa_Bay_Rowdies_logo.svg',
  'cafetalerosdetapachula.com.mx': WP + 'Tapachula_logo.svg',
  'club-thestrongest.com':    WP + 'The_Strongest_logo.svg',
  'tianjinfc.com':            WP + 'Tianjin_Quanjian_logo.svg',
  'xolos.com.mx':             WP + 'Tijuana_logo.svg',
  'tonnerrekalara.com':       WP + 'Tonnerre_Yaounde_logo.svg',
  'torosneza.com.mx':         WP + 'Toros_Neza_logo.svg',
  'sctoulon.fr':              WP + 'Toulon_logo.svg',
  'toulousefc.com':           WP + 'Toulouse_logo.svg',
  'tpmazembe.com':            WP + 'TP_Mazembe.svg',
  'kfcturnhout.be':           WP + 'Turnhout_logo.svg',
  'udinese.it':               WP + 'Udinese_logo.svg',
  'unah.edu.hn':              WP + 'Universidad_logo.svg',
  'cruzados.cl':              WP + 'Universidad_Catolica_logo.svg',
  'usmp.edu.pe':              WP + 'Universidad_San_Martin_logo.svg',
  'universitario.pe':         WP + 'Universitario_logo.svg',
  'fc-ural.ru':               WP + 'Ural_Sverdlovsk_logo.svg',
  'vicenzacalcio.com':        WP + 'Vicenza_logo.svg',
  'clubdeportivovictoria.com': WP + 'Victoria_logo.svg',
  'villarrealcf.es':          WP + 'Villarreal_logo.svg',
  'vfc.pt':                   WP + 'Vitoria_de_Setubal_logo.svg',
  'mwfc.com.uy':              WP + 'Wanderers_logo.svg',
  'warriwolves.com':          WP + 'Warri_Wolves_logo.svg',
  'widzew.com':               WP + 'Widzew_odz_logo.svg',
  'afcwimbledon.co.uk':       WP + 'Wimbledon_logo.svg',
  'xerezdfc.com':             WP + 'Xerez_logo.svg',
  'bscyb.ch':                 WP + 'Young_Boys_logo.svg',
  'zamalek.sc':               WP + 'Zamalek.svg',
};


/* ──────────────────────────────────────────────────────────────
   ClubLogo — sequential waterfall (no race condition)

   Sources tried in order:
     [0] LOGO_MAP  — direct Wikipedia SVG/PNG (instant)
     [1] wikiUrl   — Wikipedia REST API PNG thumbnail (fallback)
   Final fallback: ClubShield abbreviation

   srcIdx tracks which source we're currently on.
   If a source fails → increment srcIdx → try next.
   wikiUrl may arrive late; because sources[] is recomputed on
   every render, srcIdx=1 will automatically pick it up.
   ────────────────────────────────────────────────────────────── */
function ClubLogo({ player }) {
  const domain    = player.clubDomain || null;
  const wikiTitle = clubWikiTitles[player.club] || null;
  const { url: wikiUrl } = useWikiImage(wikiTitle);

  const logoMapUrl = domain ? (LOGO_MAP[domain] || null) : null;

  const [srcIdx,   setSrcIdx]   = useState(0);
  const [imgReady, setImgReady] = useState(false);

  // Ordered source list — recomputed each render so late-arriving wikiUrl is picked up
  const sources = [];
  if (logoMapUrl) sources.push(logoMapUrl);
  if (wikiUrl && wikiUrl !== logoMapUrl) sources.push(wikiUrl);
  if (domain) {
    // 3. unavatar.io — handles any valid club domain automatically
    sources.push(`https://unavatar.io/duckduckgo/${domain}?fallback=false`);
  }

  const currentSrc = sources[srcIdx] ?? null;

  const handleLoad  = () => setImgReady(true);
  const handleError = () => {
    console.error(`Logo Fail: ${player.club} | Domain: ${player.clubDomain} | Source #${srcIdx}: ${currentSrc}`);
    if (srcIdx < sources.length - 1) {
      setSrcIdx(s => s + 1);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Strict Verification Fallback: Show red if all sources failed */}
      {srcIdx > 1 && !imgReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-600/90 text-[8px] font-black text-white p-0.5 text-center leading-[9px] uppercase">
          LOGO<br/>MISSING
        </div>
      )}
      
      {/* Visual background for during loading */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${imgReady ? 'opacity-0' : 'opacity-100'}`}>
        <ClubShield clubName={player.club} />
      </div>
      
      {currentSrc && (
        <img
          key={currentSrc}
          src={currentSrc}
          alt={player.club}
          className={`absolute inset-0 w-full h-full object-contain drop-shadow-md transition-opacity duration-300 ${imgReady ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
}

/* ── Pitch themes ─────────────────────────────────────────────── */
const PITCH_THEMES = {
  modern: {
    bg: 'linear-gradient(to bottom, #1a8a3a, #20a045, #17803a)',
    lineColor: 'rgba(255,255,255,0.35)',
    lineColorSecondary: 'rgba(255,255,255,0.25)',
    lineColorTertiary: 'rgba(255,255,255,0.18)',
    stripeOpacity: 0.06,
    stripeColor: 'rgba(255,255,255,1)',
    overlayBg: null,
  },
  vintage: {
    bg: '#5c5236',
    lineColor: 'rgba(255,255,255,0.35)',
    lineColorSecondary: 'rgba(255,255,255,0.25)',
    lineColorTertiary: 'rgba(255,255,255,0.18)',
    stripeOpacity: 0.03,
    stripeColor: '#000000',
    overlayBg: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(40,20,0,0.7) 100%)',
  },
};

export { ClubLogo }

/* ── PlayerNode — uses ClubLogo 4-stage waterfall ── */
const PlayerNode = memo(function PlayerNode({ player, delay, revealNames }) {
  return (
    <div
      className="flex flex-col items-center gap-0.5 animate-bounce-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg
          flex items-center justify-center border-2 p-1
          bg-white border-white/50
          hover:scale-110 transition-transform duration-200 cursor-pointer
          ring-1 ring-black/20 overflow-hidden"
      >
        <ClubLogo player={player} />
      </div>
      {/* Club name — always visible */}
      <span className="text-[8px] text-white/50 text-center max-w-[68px] truncate leading-none">
        {player.club}
      </span>
      {/* Player name — only after answer/timeout */}
      {revealNames && (() => {
        const { first, last } = splitName(player.name);
        return (
          <div className="flex flex-col items-center leading-snug animate-fade-in-up">
            {first && (
              <span className="text-[7px] text-white/55 font-normal text-center max-w-[72px] truncate">
                {first}
              </span>
            )}
            <span className="text-[9px] sm:text-[10px] text-white font-bold text-center max-w-[72px] truncate drop-shadow-sm">
              {last}
            </span>
          </div>
        );
      })()}
    </div>
  );
});

/* ── FormationRow ── */
const FormationRow = memo(function FormationRow({ players, rowDelay, revealNames }) {
  return (
    <div className="flex justify-center items-center gap-2 sm:gap-5">
      {players.map((player, i) => (
        <PlayerNode
          key={`${player.name}|${player.club}`}
          player={player}
          delay={rowDelay + i * 80}
          revealNames={revealNames}
        />
      ))}
    </div>
  );
});

/* ── FootballPitch ── */
const FootballPitch = memo(function FootballPitch({ team, revealNames }) {
  if (!team) return null;

  const { players } = team;
  const gk  = players.filter(p => p.position === 'GK');
  const def = players.filter(p => p.position === 'DEF');
  const mid = players.filter(p => p.position === 'MID');
  const fwd = players.filter(p => p.position === 'FWD');

  const pitchMode = team.mode === 'iconic' ? 'vintage' : 'modern';
  const theme = PITCH_THEMES[pitchMode] || PITCH_THEMES.modern;

  return (
    <div className="relative w-full max-w-md mx-auto aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
      <div className="absolute inset-0" style={{ background: theme.bg }} />
      {theme.overlayBg && (
        <div className="absolute inset-0 pointer-events-none" style={{ background: theme.overlayBg }} />
      )}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 400" fill="none">
        <rect x="10" y="10" width="280" height="380" rx="4" stroke={theme.lineColor} strokeWidth="2" fill="none" />
        <line x1="10" y1="200" x2="290" y2="200" stroke={theme.lineColor} strokeWidth="1.5" />
        <circle cx="150" cy="200" r="40" stroke={theme.lineColor} strokeWidth="1.5" fill="none" />
        <circle cx="150" cy="200" r="3" fill={theme.lineColor} />
        <rect x="70" y="10" width="160" height="60" rx="2" stroke={theme.lineColorSecondary} strokeWidth="1.2" fill="none" />
        <rect x="100" y="10" width="100" height="25" rx="2" stroke={theme.lineColorTertiary} strokeWidth="1" fill="none" />
        <path d="M 110 70 Q 150 90 190 70" stroke={theme.lineColorTertiary} strokeWidth="1" fill="none" />
        <rect x="70" y="330" width="160" height="60" rx="2" stroke={theme.lineColorSecondary} strokeWidth="1.2" fill="none" />
        <rect x="100" y="365" width="100" height="25" rx="2" stroke={theme.lineColorTertiary} strokeWidth="1" fill="none" />
        <path d="M 110 330 Q 150 310 190 330" stroke={theme.lineColorTertiary} strokeWidth="1" fill="none" />
      </svg>
      <div className="absolute inset-0" style={{
        opacity: theme.stripeOpacity,
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 24px, ${theme.stripeColor} 24px, ${theme.stripeColor} 48px)`,
      }} />
      {pitchMode === 'vintage' && (
        <div className="absolute inset-0 pointer-events-none pitch-retro-grain" />
      )}
      <div className="relative z-10 h-full flex flex-col justify-between py-4 px-2">
        <FormationRow players={fwd} rowDelay={0}   revealNames={revealNames} />
        <FormationRow players={mid} rowDelay={250} revealNames={revealNames} />
        <FormationRow players={def} rowDelay={500} revealNames={revealNames} />
        <FormationRow players={gk}  rowDelay={750} revealNames={revealNames} />
      </div>
    </div>
  );
});

export default FootballPitch;
