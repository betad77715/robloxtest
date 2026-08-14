/* ============================================================
   SUBVERSE — Catalogue de démonstration
   Tous les prix/chiffres sont fictifs (site concept, aucun achat réel).
   ============================================================ */

/* ---- Helpers ---- */
const P = (id, name, price, per, best, features, meta = {}) =>
  ({ id, name, price, per, best: best ?? '', features, ...meta });
const S = (id, cat, name, glyph, colors, tagline, f) => ({
  id, cat, name, glyph, colors, tagline,
  room: f.room || '', validation: f.validation || 'email',
  fx: f.fx || '', platforms: f.platforms || [],
  pseudo: f.pseudo || 'Pseudo ou référence du compte',
  operator: !!f.operator, phone: f.phone ?? true,
  devices: f.devices || 'PC · Mobile · TV',
  family: !!f.family, renewal: f.renewal || 'renouvellement automatique',
  perk: f.perk || '', plans: f.plans
});

/* ---- Univers / catégories ---- */
const CATEGORIES = [
  {
    id: 'gaming', name: 'Gaming', icon: 'cube',
    colors: ['#3f8cff', '#7b61ff'], img: 'assets/img/cat-gaming.jpg', fx: 'crystals',
    title: "L'arène des monnaies virtuelles",
    desc: 'Robux, V-Bucks, Minecoins, points et passes de combat. Douze univers, un seul comptoir.'
  },
  {
    id: 'social', name: 'Social', icon: 'bubble',
    colors: ['#ffd400', '#7b61ff'], img: 'assets/img/cat-social.jpg', fx: 'bubbles',
    title: 'Le lounge des communautés',
    desc: 'Badges, boosts et profils personnalisés. Les abonnements qui rendent tes groupes plus forts.'
  },
  {
    id: 'streaming', name: 'Streaming', icon: 'screen',
    colors: ['#e50914', '#3f8cff'], img: 'assets/img/cat-streaming.jpg', fx: 'cinema',
    title: 'Neuf salles de cinéma privées',
    desc: 'Cinéma rouge, galaxie bleue, salle animée ou stade : chaque plateforme a sa salle.'
  },
  {
    id: 'musique', name: 'Musique & audio', icon: 'vinyl',
    colors: ['#1db954', '#a349a4'], img: 'assets/img/cat-musique.jpg', fx: 'vinyl',
    title: 'Le salon d’écoute infini',
    desc: 'Vinyles qui tournent, waveforms réactives et bibliothèques illimitées.'
  },
  {
    id: 'creation', name: 'Création & outils', icon: 'layers',
    colors: ['#00c4cc', '#ff3366'], img: 'assets/img/cat-creation.jpg', fx: 'layers',
    title: 'Le studio des créateurs',
    desc: 'Chaque sélection s’empile comme un calque ; le récapitulatif se lit comme une timeline.'
  },
  {
    id: 'ia', name: 'Intelligence artificielle', icon: 'orb',
    colors: ['#74b9ff', '#b388ff'], img: 'assets/img/cat-ia.jpg', fx: 'spectral',
    title: 'Le laboratoire spectral',
    desc: 'Texte, image, vidéo, voix : compare les modèles comme des prismes de lumière.'
  },
  {
    id: 'cloud', name: 'Cloud & productivité', icon: 'cloud',
    colors: ['#4f9cf9', '#9bd1ff'], img: 'assets/img/cat-cloud.jpg', fx: 'cloud',
    title: 'Le nuage qui range tout',
    desc: 'Une jauge se remplit, les fichiers s’organisent. Stockage, suites et outils d’équipe.'
  }
];

/* ---- Services ---- */
const SERVICES = [
  /* ================= GAMING ================= */
  S('roblox', 'gaming', 'Roblox', 'RB', ['#3f8cff', '#8fd0ff'],
    'Robux, Premium et cristaux pixelisés. PC, mobile ou Xbox.', {
    validation: 'code', fx: 'rain', room: "Univers bleu électrique, carte Robux 3D et pluie de cubes.",
    platforms: ['PC', 'Mobile', 'Xbox'], pseudo: 'Pseudo Roblox', family: true,
    devices: 'PC · Mobile · Xbox · VR', perk: 'Carte Robux animée en 3D',
    plans: [
      P('r400', '400 Robux', 4.99, 'pack', '400', ['Crédit instantané', 'Tous supports'], { credits: '400 Robux' }),
      P('r800', '800 Robux', 9.99, 'pack', 'best', ['Valable PC, mobile, Xbox', 'Crédit instantané'], { credits: '800 Robux' }),
      P('r1700', '1 700 Robux', 19.99, 'pack', '', ['Bonus de prix', 'Crédit instantané'], { credits: '1 700 Robux' }),
      P('prem1', 'Premium 450', 4.99, 'mois', '', ['450 Robux / mois', 'Échanges entre joueurs', 'Badge Premium']),
      P('prem2', 'Premium 1000', 9.99, 'mois', 'famille', ['1 000 Robux / mois', 'Avantages Premium'], {}),
      P('prem3', 'Premium 2200', 19.99, 'mois', '', ['2 200 Robux / mois', 'Accès items exclusifs'])
    ]
  }),
  S('fortnite', 'gaming', 'Fortnite', 'FN', ['#a55cff', '#3fd6ff'],
    'V-Bucks, Fortnite Crew et tempête numérique.', {
    validation: 'qr', fx: 'vortex', room: "Portail animé, cartes hologrammes, violet & cyan.",
    platforms: ['PC', 'PlayStation', 'Xbox', 'Switch', 'Mobile'], pseudo: 'Nom Epic Games', family: true,
    devices: 'PC · PS · Xbox · Switch · Mobile', perk: 'Portail animé dans le hero',
    plans: [
      P('vb1000', '1 000 V-Bucks', 7.99, 'pack', '', ['Crédit instantané'], { credits: '1 000 V-Bucks' }),
      P('vb2800', '2 800 V-Bucks', 19.99, 'pack', 'best', ['Le plus choisi', 'Crédit instantané'], { credits: '2 800 V-Bucks' }),
      P('vb5000', '5 000 V-Bucks', 31.99, 'pack', '', ['Bonus tempête'], { credits: '5 000 V-Bucks' }),
      P('vb13500', '13 500 V-Bucks', 79.99, 'pack', '', ['Pack légendaire'], { credits: '13 500 V-Bucks' }),
      P('crew', 'Fortnite Crew', 9.99, 'mois', 'crew', ['Passe de combat inclus', '1 000 V-Bucks / mois', 'Pack Crew exclusif'])
    ]
  }),
  S('minecraft', 'gaming', 'Minecraft', 'MC', ['#62b746', '#2d8659'],
    'Minecoins et Realms — un monde voxel qui se construit au scroll.', {
    validation: 'bibliotheque', fx: 'voxel', room: 'Univers cubique premium, blocs qui s’assemblent.',
    platforms: ['PC', 'Console', 'Mobile'], pseudo: 'Gamertag Minecraft', family: true,
    devices: 'PC · Console · Mobile', perk: 'Monde voxel animé au scroll',
    plans: [
      P('mc1020', '1 020 Minecoins', 5.99, 'pack', '', ['Marketplace & skins'], { credits: '1 020 Minecoins' }),
      P('mc1720', '1 720 Minecoins', 9.99, 'pack', 'best', ['Skins, mondes, textures'], { credits: '1 720 Minecoins' }),
      P('mc3500', '3 500 Minecoins', 19.99, 'pack', '', ['Le coffre du bâtisseur'], { credits: '3 500 Minecoins' }),
      P('realm1', 'Realms — Solo', 3.99, 'mois', '', ['Serveur privé', '1 joueur invité']),
      P('realm10', 'Realms — Groupe', 7.99, 'mois', 'famille', ['Serveur privé', '10 joueurs invités', 'Sauvegardes cloud'])
    ]
  }),
  S('valorant', 'gaming', 'Valorant', 'VL', ['#ff4655', '#111111'],
    'Valorant Points et passes — interface tactique rouge et noire.', {
    validation: 'sms', fx: 'tactic', room: 'Transitions rapides façon interface tactique.',
    platforms: ['PC', 'Console'], pseudo: 'Riot ID', operator: true,
    devices: 'PC · Console', perk: 'Scan tactique au survol',
    plans: [
      P('vp475', '475 VP', 4.99, 'pack', '', ['Crédit instantané'], { credits: '475 VP' }),
      P('vp950', '950 VP', 9.99, 'pack', 'best', ['Le standard des duellistes'], { credits: '950 VP' }),
      P('vp2050', '2 050 VP', 19.99, 'pack', '', ['Bonus inclus'], { credits: '2 050 VP' }),
      P('vp3650', '3 650 VP', 34.99, 'pack', '', ['Arsenal complet'], { credits: '3 650 VP' }),
      P('vpass', 'Act Battle Pass', 9.99, 'pack', '', ['3 actes de contenu', 'Skins & sprays'])
    ]
  }),
  S('league-of-legends', 'gaming', 'League of Legends', 'LL', ['#c8a24b', '#0a1428'],
    'Riot Points et pass événement — or, bleu nuit et magie.', {
    validation: 'code', fx: 'magic', room: 'Cercle énergétique autour du pack actif.',
    platforms: ['PC'], pseudo: 'Riot ID (LoL)', operator: true,
    devices: 'PC', perk: 'Cercle énergétique doré',
    plans: [
      P('rp650', '650 RP', 5.99, 'pack', '', ['Crédit instantané'], { credits: '650 RP' }),
      P('rp1380', '1 380 RP', 11.99, 'pack', 'best', ['Le choix des invocateurs'], { credits: '1 380 RP' }),
      P('rp2800', '2 800 RP', 24.99, 'pack', '', ['Bonus arcanique'], { credits: '2 800 RP' }),
      P('epass', 'Pass événement', 13.99, 'pack', '', ['Jetons & missions', 'Skin prestige possible'])
    ]
  }),
  S('call-of-duty', 'gaming', 'Call of Duty', 'CD', ['#ff8c2b', '#1c1c1c'],
    'COD Points et Battle Pass — quartier général sombre et orange.', {
    validation: 'sms', fx: 'radar', room: 'Radar et scan discret au survol.',
    platforms: ['PC', 'PlayStation', 'Xbox'], pseudo: 'Activision ID', operator: true,
    devices: 'PC · PS · Xbox', perk: 'Radar discret au survol',
    plans: [
      P('cp500', '500 CP', 4.99, 'pack', '', ['Crédit instantané'], { credits: '500 COD Points' }),
      P('cp1100', '1 100 CP', 9.99, 'pack', 'best', ['Le standard des opérateurs'], { credits: '1 100 CP' }),
      P('cp2400', '2 400 CP', 19.99, 'pack', '', ['Bonus de largage'], { credits: '2 400 CP' }),
      P('bp', 'Battle Pass', 9.99, 'pack', '', ['100 niveaux', 'Plans d’arme & skins'])
    ]
  }),
  S('ea-sports-fc', 'gaming', 'EA SPORTS FC', 'FC', ['#16e06c', '#0a0f0a'],
    'FC Points et abonnement gaming — vert terrain et noir.', {
    validation: 'qr', fx: 'pitch', room: 'Lignes tactiques animées comme sur un tableau de coach.',
    platforms: ['PC', 'PlayStation', 'Xbox', 'Switch'], pseudo: 'Compte EA',
    devices: 'PC · PS · Xbox · Switch', perk: 'Lignes tactiques animées',
    plans: [
      P('fp500', '500 FC Points', 4.99, 'pack', '', ['Ultimate Team ready'], { credits: '500 FC Points' }),
      P('fp1050', '1 050 FC Points', 9.99, 'pack', 'best', ['Le choix des coachs'], { credits: '1 050 FC Points' }),
      P('fp2800', '2 800 FC Points', 24.99, 'pack', '', ['Bonus vestiaire'], { credits: '2 800 FC Points' }),
      P('fcsub', 'EA Play associé', 3.99, 'mois', '', ['Essais anticipés', 'Récompenses mensuelles'])
    ]
  }),
  S('apex-legends', 'gaming', 'Apex Legends', 'AX', ['#ff7a1a', '#d43a2f'],
    'Apex Coins et passes — cartes inclinées pleine vitesse.', {
    validation: 'sms', fx: 'speed', room: 'Vitesse et profondeur, inclinaison façon dropship.',
    platforms: ['PC', 'PlayStation', 'Xbox', 'Switch'], pseudo: 'Pseudo EA / Apex', operator: true,
    devices: 'PC · PS · Xbox · Switch', perk: 'Cartes inclinées 3D',
    plans: [
      P('ac1000', '1 000 Apex Coins', 9.99, 'pack', 'best', ['Crédit instantané'], { credits: '1 000 Apex Coins' }),
      P('ac2150', '2 150 Apex Coins', 19.99, 'pack', '', ['Bonus incliné'], { credits: '2 150 Apex Coins' }),
      P('ac4350', '4 350 Apex Coins', 39.99, 'pack', '', ['Le pack des prédateurs'], { credits: '4 350 Apex Coins' }),
      P('apass', 'Battle Pass', 9.50, 'pack', '', ['Récompenses de saison'])
    ]
  }),
  S('genshin-impact', 'gaming', 'Genshin Impact', 'GS', ['#7fd4ff', '#c9a1ff'],
    'Cristaux primaires et bénédiction mensuelle, entre ciel et artefacts.', {
    validation: 'bibliotheque', fx: 'sky', room: 'Ciel, particules et artefacts flottants.',
    platforms: ['PC', 'Mobile', 'PlayStation'], pseudo: 'UID HoYoverse', family: false,
    devices: 'PC · Mobile · PS', perk: 'Artefacts flottants',
    plans: [
      P('gc60', '60 Cristaux', 0.99, 'pack', '', ['Crédit instantané'], { credits: '60 cristaux' }),
      P('gc980', '980 Cristaux', 14.99, 'pack', 'best', ['Bonus première recharge'], { credits: '980 cristaux' }),
      P('gc3280', '3 280 Cristaux', 49.99, 'pack', '', ['Pour les pity runs'], { credits: '3 280 cristaux' }),
      P('welkin', 'Bénédiction de la Lune', 4.99, 'mois', 'best', ['90 cristaux / jour', '30 jours'])
    ]
  }),
  S('playstation-plus', 'gaming', 'PlayStation Plus', 'P+', ['#2f6fed', '#0a1f4d'],
    'Essential, Extra ou Premium — bleu profond et verre lumineux.', {
    validation: 'email', fx: 'glass', room: 'Design bleu profond, panneaux de verre lumineux.',
    platforms: ['PS5', 'PS4'], pseudo: 'ID en ligne PSN', family: false,
    devices: 'PS5 · PS4', perk: 'Verre lumineux',
    plans: [
      P('ess1', 'Essential — 1 mois', 8.99, 'mois', '', ['Jeux du mois', 'Multijoueur en ligne']),
      P('ext1', 'Extra — 3 mois', 35.99, 'trimestre', 'best', ['Catalogue de jeux', 'Cloud saves']),
      P('prem12', 'Premium — 12 mois', 119.99, 'an', 'annuel', ['Catalogue classique', 'Essais de jeux', 'Streaming cloud'])
    ]
  }),
  S('xbox-game-pass', 'gaming', 'Xbox Game Pass', 'XG', ['#52d32f', '#0b3d0b'],
    'Core, Standard ou Ultimate — tunnel vert laser.', {
    validation: 'email', fx: 'tunnel', room: 'Tunnel lumineux vert dans le hero.',
    platforms: ['Xbox', 'PC', 'Cloud'], pseudo: 'Gamertag Xbox', family: false,
    devices: 'Xbox · PC · Cloud', perk: 'Tunnel laser dans le hero',
    plans: [
      P('core', 'Game Pass Core', 6.99, 'mois', '', ['Multijoueur console', 'Catalogue restreint']),
      P('std', 'Game Pass Standard', 12.99, 'mois', '', ['Catalogue console', 'Sans day one']),
      P('ult', 'Game Pass Ultimate', 14.99, 'mois', 'best', ['Console + PC + Cloud', 'Nouveautés day one', 'EA Play inclus'])
    ]
  }),
  S('nintendo-switch-online', 'gaming', 'Nintendo Switch Online', 'NS', ['#e60012', '#ffffff'],
    'Individuel ou famille — rouge, blanc et très ludique.', {
    validation: 'lien', fx: 'play', room: 'Univers rouge et blanc, rebonds et bulles joyeuses.',
    platforms: ['Switch', 'Switch 2'], pseudo: 'Pseudo Nintendo Switch', family: true,
    devices: 'Switch', perk: 'Rebonds ludiques',
    plans: [
      P('ni1', 'Individuel — 1 mois', 3.99, 'mois', '', ['Jeu en ligne', 'Sauvegardes cloud']),
      P('ni12', 'Individuel — 12 mois', 19.99, 'an', 'best', ['Jeu en ligne', 'Catalogue rétro']),
      P('nf12', 'Famille — 12 mois', 34.99, 'an', 'famille', ['Jusqu’à 8 comptes', 'Catalogue rétro'], { seats: 8 })
    ]
  }),

  /* ================= SOCIAL ================= */
  S('snapchat-plus', 'social', 'Snapchat+', 'S+', ['#ffd400', '#111111'],
    'Badges, thèmes et stories boostées — jaune pop et verre fumé.', {
    validation: 'lien', fx: 'bubbles', room: 'Bulles et cartes flottantes jaune soleil.',
    platforms: ['iOS', 'Android'], pseudo: 'Nom d’utilisateur Snapchat',
    devices: 'iOS · Android', perk: 'Bulles flottantes',
    plans: [
      P('s1', 'Snapchat+ — 1 mois', 3.99, 'mois', '', ['Badge exclusif', 'Thèmes de profil', 'Story boost']),
      P('s12', 'Snapchat+ — 12 mois', 29.99, 'an', 'best', ['2 mois offerts', 'Tous les avantages +'])
    ]
  }),
  S('discord-nitro', 'social', 'Discord Nitro', 'DN', ['#5865f2', '#9b59f5'],
    'Boosts, profils et cadeaux — portails communautaires violets.', {
    validation: 'bibliotheque', fx: 'bubbles', room: 'Animation de boost à la sélection, portails indigo.',
    platforms: ['PC', 'Mobile', 'Web'], pseudo: 'Pseudo Discord', family: false,
    devices: 'PC · Mobile · Web', perk: 'Animation de boost',
    plans: [
      P('nb', 'Nitro Basic', 2.99, 'mois', '', ['Emojis partout', 'Badge de profil']),
      P('nf', 'Nitro complet', 9.99, 'mois', 'best', ['2 boosts serveur', 'Uploads 500 Mo', 'HD streaming']),
      P('nf12', 'Nitro — 12 mois', 99.99, 'an', '', ['2 mois offerts', '2 boosts serveur']),
      P('gift1', 'Cadeau — 1 mois', 9.99, 'cadeau', '', ['À offrir', 'Carte animée'], { gift: true })
    ]
  }),
  S('telegram-premium', 'social', 'Telegram Premium', 'TG', ['#2aabee', '#b2e2ff'],
    'Uploads XL et réactions infinies — bleu ciel et verre liquide.', {
    validation: 'lien', fx: 'plane', room: 'Avion en papier animé dans le hero.',
    platforms: ['iOS', 'Android', 'Desktop'], pseudo: 'Pseudo Telegram (@)',
    devices: 'Toutes plateformes', perk: 'Avion en papier animé',
    plans: [
      P('tg1', 'Premium — 1 mois', 4.99, 'mois', '', ['Uploads 4 Go', 'Vitesses illimitées', 'Stickers premium']),
      P('tg12', 'Premium — 12 mois', 34.99, 'an', 'best', ['Jusqu’à -40%', 'Tous les avantages'])
    ]
  }),
  S('twitch', 'social', 'Twitch', 'TW', ['#9146ff', '#1f0f30'],
    'Subs créateur Tier 1-2-3 et Turbo — scène live violette.', {
    validation: 'bibliotheque', fx: 'stage', room: 'Scène live, projecteurs et chat animé.',
    platforms: ['PC', 'Mobile', 'TV'], pseudo: 'Pseudo Twitch', family: false,
    devices: 'PC · Mobile · TV', perk: 'Scène live',
    plans: [
      P('t1', 'Sub créateur — Tier 1', 3.99, 'mois', '', ['Emotes de la chaîne', 'Badge sub']),
      P('t2', 'Sub créateur — Tier 2', 7.99, 'mois', '', ['Emotes étendues', 'Badge amélioré']),
      P('t3', 'Sub créateur — Tier 3', 19.99, 'mois', '', ['Soutien maximal', 'Badge rare']),
      P('turbo', 'Twitch Turbo', 8.99, 'mois', 'best', ['Sans pub (partenaires)', 'Badge Turbo', 'Stockage VOD étendu'])
    ]
  }),
  S('youtube-premium', 'social', 'YouTube Premium', 'YT', ['#ff0033', '#111111'],
    'Individuel, étudiant ou famille — salle cinéma rouge et noire.', {
    validation: 'lien', fx: 'cinema', room: 'Univers cinéma rouge, rideau et projections.',
    platforms: ['iOS', 'Android', 'Web', 'TV'], pseudo: 'Compte Google', family: true,
    devices: 'Toutes plateformes', perk: 'Rideau de cinéma',
    plans: [
      P('ypi', 'Individuel', 12.99, 'mois', '', ['Sans publicité', 'YouTube Music inclus', 'Hors ligne']),
      P('ype', 'Étudiant', 7.99, 'mois', '', ['Vérification étudiante', 'Sans publicité']),
      P('ypf', 'Famille', 23.99, 'mois', 'famille', ['Jusqu’à 5 membres', 'Sans publicité partout'], { seats: 5 })
    ]
  }),

  /* ================= STREAMING ================= */
  S('netflix', 'streaming', 'Netflix', 'NF', ['#e50914', '#141414'],
    'La salle rouge originale — Standard, pub ou Premium.', {
    validation: 'email', fx: 'cinema', room: 'Cinéma rouge intense.',
    platforms: ['TV', 'Mobile', 'Web'], pseudo: 'Adresse email du compte', family: true,
    devices: 'TV · Mobile · Web', perk: 'Salle rouge',
    plans: [
      P('npub', 'Standard avec pub', 5.99, 'mois', '', ['Full HD', '2 écrans'], { screens: 2 }),
      P('nstd', 'Standard', 13.49, 'mois', 'best', ['Full HD', '2 écrans', 'Sans pub'], { screens: 2, quality: 'Full HD' }),
      P('nprm', 'Premium', 19.99, 'mois', 'famille', ['4K + HDR', '4 écrans', 'Audio spatial'], { screens: 4, quality: '4K HDR' })
    ]
  }),
  S('disney-plus', 'streaming', 'Disney+', 'D+', ['#0e2a5b', '#4fa3ff'],
    'La galaxie bleue — Pixar, Marvel, Star Wars & Nat Geo.', {
    validation: 'email', fx: 'vortex', room: 'Galaxie bleue profonde.',
    platforms: ['TV', 'Mobile', 'Web'], pseudo: 'Adresse email du compte', family: true,
    devices: 'TV · Mobile · Web', perk: 'Galaxie bleue',
    plans: [
      P('dpub', 'Standard avec pub', 5.99, 'mois', '', ['Full HD', '2 écrans'], { screens: 2 }),
      P('dstd', 'Standard', 8.99, 'mois', 'best', ['Full HD', '2 écrans', 'Sans pub'], { screens: 2 }),
      P('dprm', 'Premium', 11.99, 'mois', 'famille', ['4K HDR', '4 écrans'], { screens: 4, quality: '4K HDR' })
    ]
  }),
  S('prime-video', 'streaming', 'Prime Video', 'PV', ['#00a8e1', '#00131f'],
    'La salle électrique — films, séries et sport.', {
    validation: 'qr', fx: 'cinema', room: 'Projecteur bleu électrique.',
    platforms: ['TV', 'Mobile', 'Web'], pseudo: 'Compte Amazon', family: true,
    devices: 'TV · Mobile · Web', perk: 'Salle électrique',
    plans: [
      P('pvm', 'Prime Video', 6.99, 'mois', 'best', ['3 écrans', 'Certaines exclus en 4K'], { screens: 3 }),
      P('pvfull', 'Amazon Prime complet', 6.99, 'mois', '', ['Livraison rapide', 'Prime Video + Music'])
    ]
  }),
  S('max', 'streaming', 'Max', 'MX', ['#002be7', '#7fd0ff'],
    'HBO & Warner dans un hall bleu nuit.', {
    validation: 'email', fx: 'vortex', room: 'Hall bleu nuit, projecteurs géométriques.',
    platforms: ['TV', 'Mobile', 'Web'], pseudo: 'Adresse email du compte', family: false,
    devices: 'TV · Mobile · Web', perk: 'Hall bleu nuit',
    plans: [
      P('mxpub', 'Basic avec pub', 5.99, 'mois', '', ['Full HD', '2 écrans'], { screens: 2 }),
      P('mxstd', 'Standard', 9.99, 'mois', 'best', ['Full HD', '30 téléchargements'], { screens: 2 }),
      P('mxprm', 'Premium', 13.99, 'mois', '', ['4K HDR', '4 écrans'], { screens: 4, quality: '4K HDR' })
    ]
  }),
  S('apple-tv-plus', 'streaming', 'Apple TV+', 'A+', ['#9bd1ff', '#0b1c2c'],
    'Séries originales dans un cube de verre glacial.', {
    validation: 'email', fx: 'glass', room: 'Cube de verre et lumière froide.',
    platforms: ['TV', 'iOS', 'Web'], pseudo: 'Identifiant Apple', family: true,
    devices: 'TV · iOS · Web', perk: 'Verre glacial',
    plans: [
      P('atv', 'Apple TV+', 9.99, 'mois', 'best', ['4K HDR Dolby', 'Partage familial (6)'], { screens: 6, quality: '4K Dolby' })
    ]
  }),
  S('paramount-plus', 'streaming', 'Paramount+', 'PM', ['#0064ff', '#0a1440'],
    'Montagne de films et séries, ciel héroïque.', {
    validation: 'email', fx: 'sky', room: 'Ciel de montagne, étoiles et nuages.',
    platforms: ['TV', 'Mobile', 'Web'], pseudo: 'Adresse email du compte', family: false,
    devices: 'TV · Mobile · Web', perk: 'Ciel héroïque',
    plans: [
      P('pm', 'Paramount+ — 1 mois', 7.99, 'mois', 'best', ['3 écrans', 'Films & séries Paramount'], { screens: 3 }),
      P('pm12', 'Paramount+ — 12 mois', 79.90, 'an', '', ['2 mois offerts'])
    ]
  }),
  S('crunchyroll', 'streaming', 'Crunchyroll', 'CR', ['#f47521', '#2b1200'],
    'La salle animée colorée — Fan et Mega Fan.', {
    validation: 'bibliotheque', fx: 'stage', room: 'Salle anime colorée, néons orange.',
    platforms: ['TV', 'Mobile', 'Web'], pseudo: 'Pseudo Crunchyroll', family: false,
    devices: 'TV · Mobile · Web', perk: 'Salle anime',
    plans: [
      P('fan', 'Fan', 5.99, 'mois', '', ['Sans pub', 'Simulcast Japon'], { screens: 1 }),
      P('mega', 'Mega Fan', 7.99, 'mois', 'best', ['4 écrans', 'Hors ligne', 'Sans pub'], { screens: 4, quality: 'Full HD' })
    ]
  }),
  S('dazn', 'streaming', 'DAZN', 'DZ', ['#0c6bff', '#0b0b0b'],
    'Le stade numérique — sport en direct et billet électronique.', {
    validation: 'ticket', fx: 'pitch', room: 'Stade immense, billet numérique à la validation.',
    platforms: ['TV', 'Mobile', 'Web'], pseudo: 'Adresse email du compte', family: false,
    devices: 'TV · Mobile · Web', perk: 'Billet numérique',
    plans: [
      P('dzm', 'DAZN — 1 mois', 19.99, 'mois', 'best', ['Sport en direct', '2 appareils'], { screens: 2 }),
      P('dz12', 'DAZN — 12 mois', 179.99, 'an', '', ['Économise 25%'])
    ]
  }),
  S('mubi', 'streaming', 'MUBI', 'MU', ['#ffffff', '#101010'],
    'La projection indépendante — un film choisi par jour.', {
    validation: 'lien', fx: 'glass', room: 'Projection indépendante, grain et lumière douce.',
    platforms: ['Web', 'Mobile', 'TV'], pseudo: 'Adresse email du compte', family: false,
    devices: 'Web · Mobile · TV', perk: 'Projection indé',
    plans: [
      P('mu1', 'MUBI — 1 mois', 11.99, 'mois', 'best', ['Curation quotidienne', 'Hors ligne'], { screens: 2 }),
      P('mu12', 'MUBI — 12 mois', 95.88, 'an', '', ['7.99 €/mois équivalent'])
    ]
  }),

  /* ================= MUSIQUE ================= */
  S('spotify-premium', 'musique', 'Spotify Premium', 'SP', ['#1db954', '#0d2818'],
    'Vinyle vert perpétuel — Individuel, Duo, Famille, Étudiant.', {
    validation: 'bibliotheque', fx: 'vinyl', room: 'Vinyle qui tourne et waveform réactive.',
    platforms: ['Mobile', 'Desktop', 'Web'], pseudo: 'Pseudo ou email Spotify', family: true,
    devices: 'Tous appareils', perk: 'Vinyle animé',
    plans: [
      P('spi', 'Individuel', 11.12, 'mois', 'best', ['Sans pub', 'Hors ligne', 'Qualité maximale']),
      P('spd', 'Duo', 14.99, 'mois', 'duo', ['2 comptes Premium', 'Playlist Duo'], { seats: 2 }),
      P('spf', 'Famille', 17.86, 'mois', 'famille', ['6 comptes Premium', 'Spotify Kids'], { seats: 6 }),
      P('spe', 'Étudiant', 5.64, 'mois', '', ['Vérification étudiante', '-50%'])
    ]
  }),
  S('apple-music', 'musique', 'Apple Music', 'AM', ['#fa2d48', '#2b0d12'],
    'Lossless et spatial dans un studio rouge sombre.', {
    validation: 'email', fx: 'vinyl', room: 'Studio rouge, pochettes flottantes.',
    platforms: ['iOS', 'Android', 'Web'], pseudo: 'Identifiant Apple', family: true,
    devices: 'Tous appareils', perk: 'Pochettes flottantes',
    plans: [
      P('ami', 'Individuel', 11.99, 'mois', 'best', ['Audio Lossless', 'Spatial Audio']),
      P('amf', 'Famille', 17.99, 'mois', 'famille', ['6 comptes', 'Partage familial'], { seats: 6 }),
      P('ame', 'Étudiant', 6.99, 'mois', '', ['Tarif vérifié'])
    ]
  }),
  S('deezer', 'musique', 'Deezer', 'DZ', ['#a238ff', '#ff0092'],
    'Flow infini et néons violets.', {
    validation: 'bibliotheque', fx: 'vinyl', room: 'Néons violets, waveform qui pulse.',
    platforms: ['Mobile', 'Desktop', 'Web'], pseudo: 'Email du compte Deezer', family: true,
    devices: 'Tous appareils', perk: 'Waveform réactive',
    plans: [
      P('dzi', 'Premium', 11.99, 'mois', 'best', ['Sans pub', 'Hors ligne']),
      P('dzf', 'Famille', 19.99, 'mois', 'famille', ['6 profils'], { seats: 6 }),
      P('dzd', 'Duo', 15.99, 'mois', 'duo', ['2 comptes'], { seats: 2 })
    ]
  }),
  S('youtube-music', 'musique', 'YouTube Music', 'YM', ['#ff0033', '#1a0005'],
    'Clips et titres non-stop, rideau rouge.', {
    validation: 'bibliotheque', fx: 'vinyl', room: 'Rideau rouge, lumière de scène.',
    platforms: ['Mobile', 'Web'], pseudo: 'Compte Google', family: true,
    devices: 'Mobile · Web', perk: 'Lumière de scène',
    plans: [
      P('ymi', 'Individuel', 10.99, 'mois', 'best', ['Sans pub', 'Hors ligne', 'Arrière-plan']),
      P('ymf', 'Famille', 16.99, 'mois', 'famille', ['5 membres'], { seats: 5 })
    ]
  }),
  S('tidal', 'musique', 'Tidal', 'TD', ['#00ffff', '#001a1a'],
    'HiFi & Master dans une salle d’écoute abyssale.', {
    validation: 'email', fx: 'vinyl', room: 'Salle d’écoute abyssale, cyan profond.',
    platforms: ['Mobile', 'Desktop', 'Web'], pseudo: 'Email du compte Tidal', family: true,
    devices: 'Tous appareils', perk: 'Qualité HiFi',
    plans: [
      P('tdi', 'HiFi', 10.99, 'mois', 'best', ['FLAC 16-bit', 'Sans pub']),
      P('tdf', 'HiFi Famille', 16.99, 'mois', 'famille', ['5 comptes'], { seats: 5 })
    ]
  }),
  S('soundcloud-go', 'musique', 'SoundCloud Go+', 'SC', ['#ff5500', '#330f00'],
    'La scène indé orange — Go+ et catalogue complet.', {
    validation: 'bibliotheque', fx: 'stage', room: 'Scène indé orange, fumée et néons.',
    platforms: ['Mobile', 'Web'], pseudo: 'Pseudo SoundCloud', family: false,
    devices: 'Mobile · Web', perk: 'Scène indé',
    plans: [
      P('scg', 'Go+', 9.99, 'mois', 'best', ['Catalogue complet', 'Hors ligne', 'Sans pub']),
      P('scga', 'Go+ — 12 mois', 99.99, 'an', '', ['2 mois offerts'])
    ]
  }),
  S('audible', 'musique', 'Audible', 'AU', ['#f8991c', '#1a1200'],
    'Livres audio et podcasts — la bibliothèque murmure.', {
    validation: 'bibliotheque', fx: 'glass', room: 'Bibliothèque tamisée, lampes orange.',
    platforms: ['Mobile', 'Web'], pseudo: 'Compte Amazon', family: false,
    devices: 'Mobile · Web', perk: 'Bibliothèque audio',
    plans: [
      P('au1', 'Audible — 1 crédit/mois', 9.99, 'mois', 'best', ['1 livre audio / mois', 'Podcasts illimités']),
      P('au12', 'Audible — 12 crédits/an', 89.99, 'an', '', ['-25% par crédit'])
    ]
  }),

  /* ================= CRÉATION ================= */
  S('adobe-cc', 'creation', 'Adobe Creative Cloud', 'AD', ['#fa0f00', '#000b1f'],
    'Le studio complet — photo, vidéo, design.', {
    validation: 'lien', fx: 'layers', room: 'Un panneau de layers qui s’empile à la sélection.',
    platforms: ['Windows', 'macOS'], pseudo: 'Adobe ID (email)', family: false,
    devices: 'PC · Mac', perk: 'Sélection = calque ajouté',
    plans: [
      P('photo', 'Photographie (20 Go)', 11.99, 'mois', '', ['Photoshop + Lightroom', '20 Go cloud'], { pack: 'photo' }),
      P('single', 'App unique', 23.99, 'mois', '', ['1 app au choix', '100 Go cloud'], { pack: 'design' }),
      P('toutes', 'Toutes les apps', 59.99, 'mois', 'best', ['20+ applications', '100 Go cloud', 'Firefly inclus'], { pack: 'complet' })
    ]
  }),
  S('canva-pro', 'creation', 'Canva Pro', 'CV', ['#00c4cc', '#7d4dff'],
    'Designs illimités et kit de marque.', {
    validation: 'email', fx: 'layers', room: 'Timeline colorée, calques qui glissent.',
    platforms: ['Web', 'Mobile'], pseudo: 'Email du compte Canva', family: false,
    devices: 'Web · Mobile', perk: 'Kit de marque',
    plans: [
      P('cvpm', 'Pro — 1 mois', 12.99, 'mois', '', ['Premium assets', 'Fond transparent', '100 Go']),
      P('cvpa', 'Pro — 12 mois', 119.99, 'an', 'best', ['3 mois offerts', 'Kit de marque illimité'])
    ]
  }),
  S('capcut-pro', 'creation', 'CapCut Pro', 'CC', ['#00f0ff', '#0d0d0d'],
    'Montage mobile boosté aux effets IA.', {
    validation: 'lien', fx: 'layers', room: 'Keyframes et timeline fluorescente.',
    platforms: ['Mobile', 'Desktop', 'Web'], pseudo: 'Compte CapCut',
    devices: 'Mobile · Desktop · Web', perk: 'Timeline fluorescente',
    plans: [
      P('ccm', 'Pro — 1 mois', 9.99, 'mois', 'best', ['Effets IA', 'Export sans filigrane', 'Cloud']),
      P('cca', 'Pro — 12 mois', 89.99, 'an', '', ['2 mois offerts'])
    ]
  }),
  S('figma', 'creation', 'Figma Professional', 'FG', ['#a259ff', '#ff7262'],
    'Design d’équipe en temps réel.', {
    validation: 'email', fx: 'layers', room: 'Curseurs multicolores sur un canvas infini.',
    platforms: ['Web', 'Desktop'], pseudo: 'Email du compte Figma', family: false,
    devices: 'Web · Desktop', perk: 'Collaboration temps réel',
    plans: [
      P('fgp', 'Professional', 12.00, 'mois', 'best', ['Projets illimités', 'Dev Mode', 'Bibliothèques d’équipe'], { seats: 1 }),
      P('fgo', 'Organization', 45.00, 'mois', 'pro', ['SSO', 'Analytique', 'Par membre'], { seats: 10 })
    ]
  }),
  S('envato-elements', 'creation', 'Envato Elements', 'EV', ['#82b541', '#0d2b16'],
    'La forêt d’assets illimités.', {
    validation: 'lien', fx: 'layers', room: 'Feuilles et mockups en apesanteur.',
    platforms: ['Web'], pseudo: 'Email du compte Envato',
    devices: 'Web', perk: 'Téléchargements illimités',
    plans: [
      P('evm', 'Illimité — 1 mois', 16.50, 'mois', '', ['Assets illimités', 'Licence commerciale']),
      P('eva', 'Illimité — 12 mois', 198.00, 'an', 'best', ['16.50 €/mois tout compris'])
    ]
  }),
  S('motion-array', 'creation', 'Motion Array', 'MA', ['#0070ff', '#001433'],
    'Templates vidéo, presets et banco de rushs.', {
    validation: 'lien', fx: 'layers', room: 'Thumbnails vidéo qui défilent.',
    platforms: ['Web'], pseudo: 'Email du compte Motion Array',
    devices: 'Web', perk: 'Templates illimités',
    plans: [
      P('mam', 'Pro — 1 mois', 29.99, 'mois', '', ['Templates & presets', 'Musique & SFX']),
      P('maa', 'Pro — 12 mois', 249.99, 'an', 'best', ['-30% à l’année'])
    ]
  }),
  S('artlist', 'creation', 'Artlist', 'AR', ['#ffe600', '#141400'],
    'Musique et SFX sous licence créatrice.', {
    validation: 'lien', fx: 'vinyl', room: 'Ondes jaunes sur fond carbone.',
    platforms: ['Web'], pseudo: 'Email du compte Artlist',
    devices: 'Web', perk: 'Licences créateurs',
    plans: [
      P('arm', 'Musique & SFX', 9.99, 'mois', '', ['Licence sociale']),
      P('armax', 'Max', 19.99, 'mois', 'best', ['Toutes licences', 'Client & commercial', 'Téléchargements illimités'])
    ]
  }),
  S('epidemic-sound', 'creation', 'Epidemic Sound', 'EP', ['#ff7a59', '#1a0d2b'],
    'La discothèque des vidéastes.', {
    validation: 'lien', fx: 'vinyl', room: 'Headphones suspens, halo corail.',
    platforms: ['Web'], pseudo: 'Email du compte Epidemic',
    devices: 'Web', perk: 'Stems inclus',
    plans: [
      P('epp', 'Personnel', 9.99, 'mois', 'best', ['1 chaîne par plateforme', 'Stems'], {}),
      P('epc', 'Commercial', 24.99, 'mois', 'pro', ['Projets clients', 'Monétisation OK'])
    ]
  }),

  /* ================= IA ================= */
  S('chatgpt-plus', 'ia', 'ChatGPT Plus', 'GP', ['#10a37f', '#0b1f19'],
    'Le modèle phare, fenêtres de contexte XXL.', {
    validation: 'attente', fx: 'spectral', room: 'Chrome, orbites et lumière spectrale.',
    platforms: ['Web', 'Mobile'], pseudo: 'Email du compte OpenAI',
    devices: 'Web · Mobile', perk: 'Files prioritaires',
    plans: [
      P('gptp', 'Plus', 20.00, 'mois', 'best', ['Modèles avancés', 'Génération d’images', 'Analyse de fichiers'], { quota: 'usage étendu' }),
      P('gptt', 'Team', 25.00, 'mois', 'pro', ['Espace partagé', 'Par membre'], { seats: 2 })
    ]
  }),
  S('claude-pro', 'ia', 'Claude Pro', 'CL', ['#d97757', '#1f120d'],
    'Raisonnement long, écriture soignée.', {
    validation: 'attente', fx: 'spectral', room: 'Verre ambré et particules douces.',
    platforms: ['Web', 'Mobile'], pseudo: 'Email du compte Anthropic',
    devices: 'Web · Mobile', perk: 'Contexte étendu',
    plans: [
      P('clp', 'Pro', 20.00, 'mois', 'best', ['5× plus d’usage', 'Projets', 'Accès anticipé']),
      P('clm', 'Max', 100.00, 'mois', '', ['20× d’usage', 'Priorité maximale'])
    ]
  }),
  S('gemini-advanced', 'ia', 'Gemini Advanced', 'GE', ['#1c72ff', '#7f5bff'],
    'L’IA multimodale de Google, intégrée partout.', {
    validation: 'email', fx: 'spectral', room: 'Prisme bleu-violet, constellation de données.',
    platforms: ['Web', 'Mobile'], pseudo: 'Compte Google',
    devices: 'Web · Mobile', perk: '2 To Google One inclus',
    plans: [
      P('gea', 'Google One AI Premium', 21.99, 'mois', 'best', ['Gemini Advanced', '2 To stockage', 'IA dans Gmail/Docs'])
    ]
  }),
  S('perplexity-pro', 'ia', 'Perplexity Pro', 'PX', ['#20b8cd', '#06232b'],
    'Recherche augmentée, sources citées.', {
    validation: 'email', fx: 'spectral', room: 'Grille technologique cyan, faisceaux de recherche.',
    platforms: ['Web', 'Mobile'], pseudo: 'Email du compte Perplexity',
    devices: 'Web · Mobile', perk: '300 recherches Pro/jour',
    plans: [
      P('pxp', 'Pro', 20.00, 'mois', 'best', ['Recherches illimitées', 'Choix du modèle', 'Upload de fichiers'])
    ]
  }),
  S('midjourney', 'ia', 'Midjourney', 'MJ', ['#ffffff', '#111118'],
    'Images oniriques générées dans le néant.', {
    validation: 'attente', fx: 'spectral', room: 'Néant blanc, halos spectraux.',
    platforms: ['Web', 'Discord'], pseudo: 'Pseudo Discord / compte web',
    devices: 'Web · Discord', perk: 'Heures de GPU rapide',
    plans: [
      P('mj1', 'Basic', 10.00, 'mois', '', ['~200 images/mois', '3.3h GPU rapide'], { quota: '3.3 h GPU' }),
      P('mj2', 'Standard', 30.00, 'mois', 'best', ['15h GPU rapide', 'Mode relax illimité'], { quota: '15 h GPU' }),
      P('mj3', 'Pro', 60.00, 'mois', '', ['30h GPU', 'Mode furtif'], { quota: '30 h GPU' })
    ]
  }),
  S('runway', 'ia', 'Runway', 'RW', ['#d0ff4b', '#0d1200'],
    'Vidéo générative et outils de post-prod IA.', {
    validation: 'attente', fx: 'spectral', room: 'Ruban de film liquide vert-acide.',
    platforms: ['Web'], pseudo: 'Email du compte Runway',
    devices: 'Web', perk: 'Crédits de génération',
    plans: [
      P('rw1', 'Standard', 12.00, 'mois', 'best', ['625 crédits/mois', 'Gen-3 & Gen-4'], { quota: '625 crédits' }),
      P('rw2', 'Pro', 28.00, 'mois', '', ['2 250 crédits/mois', 'Voix et lèvre sync'], { quota: '2 250 crédits' })
    ]
  }),
  S('elevenlabs', 'ia', 'ElevenLabs', 'EL', ['#8f7bff', '#0b0020'],
    'Voix de synthèse ultra-réalistes.', {
    validation: 'attente', fx: 'spectral', room: 'Ondes vocales violettes en lévitation.',
    platforms: ['Web'], pseudo: 'Email du compte ElevenLabs',
    devices: 'Web', perk: 'Clonage de voix',
    plans: [
      P('el1', 'Starter', 5.00, 'mois', '', ['30 000 caractères', 'Voix instantanées'], { quota: '30k caractères' }),
      P('el2', 'Creator', 22.00, 'mois', 'best', ['100 000 caractères', 'Clonage pro'], { quota: '100k caractères' }),
      P('el3', 'Pro', 99.00, 'mois', '', ['500 000 caractères', 'Audio 192 kbps'], { quota: '500k caractères' })
    ]
  }),

  /* ================= CLOUD ================= */
  S('microsoft-365', 'cloud', 'Microsoft 365', 'M3', ['#d83b01', '#00188f'],
    'Office, 1 To de cloud et Copilot en option.', {
    validation: 'email', fx: 'cloud', room: 'Jauge de stockage qui se remplit.',
    platforms: ['Windows', 'macOS', 'Mobile'], pseudo: 'Compte Microsoft', family: true,
    devices: 'PC · Mac · Mobile', perk: '1 To OneDrive',
    plans: [
      P('mse', 'Basic (100 Go)', 2.00, 'mois', '', ['100 Go cloud', 'Office web'], { storage: '100 Go' }),
      P('msp', 'Personnel (1 To)', 10.00, 'mois', 'best', ['1 To cloud', 'Office complet', 'Multidesktop'], { storage: '1 To' }),
      P('msf', 'Famille (6 To)', 13.00, 'mois', 'famille', ['6 utilisateurs', '1 To par personne'], { seats: 6, storage: '6 To' })
    ]
  }),
  S('google-one', 'cloud', 'Google One', 'G1', ['#4285f4', '#ea4335'],
    'Le nuage arc-en-bleu, jusqu’à 2 To.', {
    validation: 'email', fx: 'cloud', room: 'Fichiers qui s’organisent dans un nuage 3D.',
    platforms: ['Android', 'iOS', 'Web'], pseudo: 'Compte Google', family: true,
    devices: 'Tous appareils', perk: 'Partage familial',
    plans: [
      P('g100', '100 Go', 1.99, 'mois', '', ['Photos, Drive, Gmail'], { storage: '100 Go' }),
      P('g200', '200 Go', 2.99, 'mois', 'best', ['Partage famille (5)'], { storage: '200 Go', seats: 5 }),
      P('g2t', '2 To', 9.99, 'mois', '', ['VPN inclus', 'Partage famille'], { storage: '2 To', seats: 5 })
    ]
  }),
  S('icloud-plus', 'cloud', 'iCloud+', 'IC', ['#3693f3', '#0b1b2b'],
    'Le coffre argenté de l’écosystème Apple.', {
    validation: 'email', fx: 'cloud', room: 'Verre dépoli et halos bleus.',
    platforms: ['iOS', 'macOS', 'Web'], pseudo: 'Identifiant Apple', family: true,
    devices: 'iPhone · Mac', perk: 'Relais privé',
    plans: [
      P('ic50', '50 Go', 0.99, 'mois', '', ['Sauvegarde iPhone'], { storage: '50 Go' }),
      P('ic200', '200 Go', 2.99, 'mois', 'best', ['Partage famille', 'Relais privé'], { storage: '200 Go', seats: 5 }),
      P('ic2t', '2 To', 9.99, 'mois', '', ['HomeKit illimité'], { storage: '2 To', seats: 5 })
    ]
  }),
  S('dropbox', 'cloud', 'Dropbox', 'DB', ['#0061ff', '#0b1658'],
    'La boîte bleue qui synchronise tout.', {
    validation: 'email', fx: 'cloud', room: 'Boîtes bleues en orbite.',
    platforms: ['Windows', 'macOS', 'Mobile'], pseudo: 'Email du compte Dropbox', family: true,
    devices: 'PC · Mac · Mobile', perk: 'Synchronisation intelligente',
    plans: [
      P('dbp', 'Plus (2 To)', 9.99, 'mois', 'best', ['2 To', 'Transferts 2 Go'], { storage: '2 To' }),
      P('dbpro', 'Professional (3 To)', 16.58, 'mois', 'pro', ['3 To', 'Signature en ligne'], { storage: '3 To' }),
      P('dbf', 'Famille (2 To partagés)', 16.99, 'mois', 'famille', ['6 utilisateurs'], { seats: 6, storage: '2 To' })
    ]
  }),
  S('notion', 'cloud', 'Notion', 'NO', ['#ffffff', '#191919'],
    'Le wiki-bureau minimal, blanc cassé.', {
    validation: 'email', fx: 'cloud', room: 'Blocs blancs qui flottent.',
    platforms: ['Web', 'Desktop', 'Mobile'], pseudo: 'Email du compte Notion', family: false,
    devices: 'Tous appareils', perk: 'IA intégrée en option',
    plans: [
      P('nop', 'Plus', 9.50, 'mois', 'best', ['Historique 30 jours', 'Fichiers illimités'], { seats: 1 }),
      P('nob', 'Business', 19.00, 'mois', 'pro', ['Analytics', 'SSO SAML', 'Par membre'], { seats: 10 })
    ]
  }),
  S('github-copilot', 'cloud', 'GitHub Copilot', 'GH', ['#6e40c9', '#0d1117'],
    'Le copilote de code, violet électron.', {
    validation: 'bibliotheque', fx: 'cloud', room: 'Lignes de code qui s’écrivent seules.',
    platforms: ['VS Code', 'JetBrains'], pseudo: 'Pseudo GitHub', family: false,
    devices: 'IDE', perk: 'Complétions IA',
    plans: [
      P('ghi', 'Pro', 10.00, 'mois', 'best', ['Complétion illimitée', 'Chat intégré'], {}),
      P('ghb', 'Business', 19.00, 'mois', 'pro', ['Par membre', 'Politiques d’équipe'], { seats: 5 })
    ]
  }),
  S('jetbrains', 'cloud', 'JetBrains All Products', 'JB', ['#fe2857', '#ff7d1a'],
    'Toutes les IDE dans un cockpit orange.', {
    validation: 'email', fx: 'cloud', room: 'Cockpit d’outils orange incandescent.',
    platforms: ['Windows', 'macOS', 'Linux'], pseudo: 'Email du compte JetBrains', family: false,
    devices: 'PC · Mac · Linux', perk: '16+ IDE incluses',
    plans: [
      P('jbi', 'All Products Pack', 16.90, 'mois', 'best', ['Toutes les IDE', 'Outils de team']),
      P('jborg', 'Organization', 49.90, 'mois', 'pro', ['Par membre', 'Licences flottantes'], { seats: 5 })
    ]
  }),
  S('slack', 'cloud', 'Slack Pro', 'SL', ['#611f69', '#4a154b'],
    'Le QG des conversations, aubergine électrique.', {
    validation: 'email', fx: 'cloud', room: 'Bulles de chat qui rebondissent.',
    platforms: ['Web', 'Desktop', 'Mobile'], pseudo: 'Workspace Slack', family: false,
    devices: 'Tous appareils', perk: 'Huddles illimités',
    plans: [
      P('slp', 'Pro', 7.25, 'mois', 'best', ['Historique illimité', 'Apps illimitées', 'Par membre'], { seats: 5 }),
      P('slb', 'Business+', 12.50, 'mois', 'pro', ['SSO', 'Rétention avancée', 'Par membre'], { seats: 10 })
    ]
  }),
  S('zoom', 'cloud', 'Zoom Pro', 'ZM', ['#2d8cff', '#0b1e3f'],
    'Réunions sans limite de temps, halo bleu.', {
    validation: 'email', fx: 'cloud', room: 'Fenêtres de visio en mosaïque.',
    platforms: ['Web', 'Desktop', 'Mobile'], pseudo: 'Email du compte Zoom', family: false,
    devices: 'Tous appareils', perk: 'Réunions illimitées',
    plans: [
      P('zmp', 'Pro', 13.99, 'mois', 'best', ['Réunions illimitées', '100 participants', 'Cloud 5 Go'], {}),
      P('zmb', 'Business', 19.99, 'mois', 'pro', ['300 participants', 'Marque personnalisée'], { seats: 10 })
    ]
  })
];

/* ---- Fonctionnels transverses ---- */
const BUNDLE_PRESETS = [
  { name: 'Pack Gamer Social', items: [['xbox-game-pass', 'ult'], ['discord-nitro', 'nf'], ['spotify-premium', 'spi'], ['snapchat-plus', 's1']] },
  { name: 'Pack Cinéma Maison', items: [['netflix', 'nprm'], ['disney-plus', 'dprm'], ['spotify-premium', 'spf']] },
  { name: 'Pack Créateur', items: [['adobe-cc', 'toutes'], ['canva-pro', 'cvpa'], ['epidemic-sound', 'epp'], ['capcut-pro', 'ccm']] },
  { name: 'Pack IA Complète', items: [['chatgpt-plus', 'gptp'], ['claude-pro', 'clp'], ['midjourney', 'mj2'], ['elevenlabs', 'el2']] },
  { name: 'Pack Productivité', items: [['notion', 'nop'], ['google-one', 'g200'], ['slack', 'slp'], ['zoom', 'zmp']] }
];

const QUESTIONS = [
  {
    q: 'Tu joues sur quoi, d’abord ?',
    key: 'gaming',
    opts: [
      { t: 'PC', pick: [['valorant', 'vp950'], ['league-of-legends', 'rp1380']] },
      { t: 'Console', pick: [['xbox-game-pass', 'ult'], ['playstation-plus', 'ext1']] },
      { t: 'Mobile', pick: [['roblox', 'r800'], ['genshin-impact', 'welkin']] },
      { t: 'Je ne joue pas', pick: [] }
    ]
  },
  {
    q: 'Tu regardes surtout quoi ?',
    key: 'watch',
    opts: [
      { t: 'Films & séries', pick: [['netflix', 'nprm'], ['disney-plus', 'dprm']] },
      { t: 'Animés', pick: [['crunchyroll', 'mega']] },
      { t: 'Sport', pick: [['dazn', 'dzm']] },
      { t: 'Cinéma indé', pick: [['mubi', 'mu1'], ['apple-tv-plus', 'atv']] }
    ]
  },
  {
    q: 'Tu écoutes combien d’heures de musique par jour ?',
    key: 'music',
    opts: [
      { t: 'Moins d’1 h', pick: [] },
      { t: '1 à 3 h', pick: [['spotify-premium', 'spi']] },
      { t: 'Plus de 3 h', pick: [['spotify-premium', 'spi'], ['audible', 'au1']] },
      { t: 'Je suis DJ', pick: [['tidal', 'tdi'], ['soundcloud-go', 'scg']] }
    ]
  },
  {
    q: 'Tu crées du contenu ?',
    key: 'create',
    opts: [
      { t: 'Oui, vidéo', pick: [['capcut-pro', 'ccm'], ['epidemic-sound', 'epp']] },
      { t: 'Oui, design', pick: [['canva-pro', 'cvpa'], ['figma', 'fgp']] },
      { t: 'Avec de l’IA', pick: [['chatgpt-plus', 'gptp'], ['midjourney', 'mj2']] },
      { t: 'Non', pick: [] }
    ]
  },
  {
    q: 'Quel budget mensuel ?',
    key: 'budget',
    opts: [
      { t: '< 10 €', max: 10, pick: [] },
      { t: '10 – 25 €', max: 25, pick: [] },
      { t: '25 – 50 €', max: 50, pick: [] },
      { t: 'No limit', max: 999, pick: [] }
    ]
  }
];

const VALIDATION_LABELS = {
  sms: 'Validation SMS', email: 'Confirmation email', qr: 'QR code',
  ticket: 'Billet numérique', lien: "Lien d'activation", code: 'Code promotionnel',
  bibliotheque: 'Ajout à la bibliothèque', attente: 'Statut en attente'
};

/* Export global (navigateur + serveur) */
var SUBVERSE_DATA = { categories: CATEGORIES, services: SERVICES, presets: BUNDLE_PRESETS, quiz: QUESTIONS, validationLabels: VALIDATION_LABELS };
if (typeof module !== 'undefined') module.exports = SUBVERSE_DATA;
