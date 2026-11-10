import { StreamGame, DayJob, HardwareItem, TeamMember, SponsorContract, BillItem, MovieItem, StreamerDuelOpponent } from '../types/game';

export const STREAM_TAG_PRESETS = [
  { tag: '#СпокойныйСтрим', desc: 'Уютный вайб, -50% к росту токсичности в чате' },
  { tag: '#Чилл', desc: 'Приятная музыка, чаще приходят добрые донаты' },
  { tag: '#ПотныйГейминг', desc: '+25% к хайпу и зрителям, адреналин в катках' },
  { tag: '#ХоррорНочь', desc: 'Зрители обожают стримерские крики, частые рейды' },
  { tag: '#БезМата', desc: '+30% к бонусам от спонсоров' },
  { tag: '#Киберспорт', desc: 'Про-гейминг, уважение комьюнити' },
  { tag: '#Киномарафон', desc: 'Идеально для совместного просмотра фильмов' },
  { tag: '#Шоу', desc: 'Интерактив и сумасшедший хайп' }
];

export const MOVIE_CATALOG: MovieItem[] = [
  {
    id: 'movie_interstellar',
    title: 'Интерстеллар (Interstellar)',
    genreName: 'Фантастика / Драма',
    durationMinutes: 169,
    baseHype: 85,
    synopsis: 'Через кротовую нору к спасению человечества под музыку Ханса Циммера.',
    posterEmoji: '🚀',
    quote: 'Не уходи смиренно в сумрак вечной тьмы...',
    unlocked: true,
    price: 0
  },
  {
    id: 'movie_shrek2',
    title: 'Шрек 2 (Shrek 2)',
    genreName: 'Комедия / Мемы',
    durationMinutes: 93,
    baseHype: 95,
    synopsis: 'Золотая классика мировых мемов. Сцена штурма замка под «I Need a Hero» взрывает чат!',
    posterEmoji: '🧅',
    quote: 'Мы уже приехали? А сейчас? А сейчас?!',
    unlocked: true,
    price: 0
  },
  {
    id: 'movie_fight_club',
    title: 'Бойцовский Клуб (Fight Club)',
    genreName: 'Культовый Триллер',
    durationMinutes: 139,
    baseHype: 90,
    synopsis: 'Первое правило бойцовского клуба: никому не рассказывать о бойцовском клубе.',
    posterEmoji: '🧼',
    quote: 'Лишь утратив все до конца, мы обретаем свободу.',
    unlocked: true,
    price: 0
  },
  {
    id: 'movie_home_alone',
    title: 'Один Дома: Новогодний Марафон',
    genreName: 'Ностальгия / Семейный',
    durationMinutes: 103,
    baseHype: 88,
    synopsis: 'Кевин против мокрых бандитов. Ностальгия, пицца и миллион добрых донатов.',
    posterEmoji: '🎄',
    quote: 'Оставьте сдачу себе, паршивые животные!',
    unlocked: true,
    price: 0
  },
  {
    id: 'movie_scream',
    title: 'Крик: Ночной Хоррор',
    genreName: 'Слэшер / Хоррор',
    durationMinutes: 111,
    baseHype: 92,
    synopsis: 'Какой твой любимый ужастик? Телефонные звонки Призрачного Лица и крики стримера!',
    posterEmoji: '😱',
    quote: 'Какой твой любимый ужастик?..',
    unlocked: true,
    price: 0
  },
  {
    id: 'movie_fast_furious',
    title: 'Форсаж: Семья Превыше Всего',
    genreName: 'Экшен / Гонки',
    durationMinutes: 106,
    baseHype: 99,
    synopsis: 'Доминик Торетто, закись азота и главное правило жизни — нет ничего важнее семьи!',
    posterEmoji: '🏎️',
    quote: 'Мне плевать на деньги. Главное — это семья.',
    unlocked: true,
    price: 0
  }
];

export const FAMOUS_STREAMERS: StreamerDuelOpponent[] = [
  {
    id: 'buster',
    name: 'Слава Бустер',
    channel: 'twitch.tv/Buster',
    avatar: '🔥',
    followersCount: '3.9M',
    reactionSpeedMs: 520,
    dialogueChallenge: '«Чего сидишь, малой? Давай 1 на 1 AWP! Если проиграешь — отдаешь сабки моему чату!»',
    dialogueWin: '«НЕЕЕТ! КАК ТАК-ТО?! Ладно, харош, забирай сабки, чат рейдим его!»',
    dialogueLose: '«АХАХАХАХ ИЗИ ДЛЯ СЛАВЫ БУСТЕРА! Сабочки летят ко мне в карман, тренируйся!»',
    suggestedSubs: [10, 25, 50, 100]
  },
  {
    id: 'aslan_shukasha',
    name: 'Аслан Шукаша',
    channel: 'twitch.tv/Shukasha',
    avatar: '🦁',
    followersCount: '2.4M',
    reactionSpeedMs: 560,
    dialogueChallenge: '«Салам алейкум! Шукаша на связи, братва! Залетаем на забив на сабки, покажи свой уровень!»',
    dialogueWin: '«Вааай, красавчик! Честно победил, уважение от Шукаши! Забирай сабочки, заслужил!»',
    dialogueLose: '«Ха-ха, брат, Шукаша не проигрывает! Сабки улетают ко мне, тренируй пальчики!»',
    suggestedSubs: [10, 25, 50]
  },
  {
    id: 'drake',
    name: 'Дрейк (Drake)',
    channel: 'twitch.tv/Drakewow',
    avatar: '👑',
    followersCount: '1.8M',
    reactionSpeedMs: 480,
    dialogueChallenge: '«Забиваемся прямо сейчас! Кто быстрее нажмет — забирает банк сабок!»',
    dialogueWin: '«Чел просто киборг! Какая реакция! Заслуженно забираешь сабки, респект!»',
    dialogueLose: '«Победа за мной! Мой чат празднует, спасибо за подарочные подписки!»',
    suggestedSubs: [25, 50, 100, 250]
  },
  {
    id: 'evelone',
    name: 'Вадим Эвелон (Evelone192)',
    channel: 'twitch.tv/Evelone192',
    avatar: '💎',
    followersCount: '2.8M',
    reactionSpeedMs: 500,
    dialogueChallenge: '«Мафия в деле! Чат требует дуэль. Ставлю сабки, готов рискнуть?»',
    dialogueWin: '«Ого, вот это ты нажал! Выплачиваю сабки в прямом эфире, чат похлопайте ему!»',
    dialogueLose: '«Слишком медленно для мафии! Сабки остаются на моем стриме, удачи в следующий раз!»',
    suggestedSubs: [25, 50, 100]
  },
  {
    id: 'bratishkin',
    name: 'Вова Братишкин',
    channel: 'twitch.tv/Bratishkinoff',
    avatar: '⚡',
    followersCount: '3.1M',
    reactionSpeedMs: 510,
    dialogueChallenge: '«Шеф на проводе! Ты кому вызов бросил, новичок? Забиваемся на сабки или испугался?»',
    dialogueWin: '«Да ну нафиг, лакер! Ладно, признаю поражение, сабки твои, заслужил!»',
    dialogueLose: '«Ха-ха, классика! Шеф никогда не проигрывает! Сабки улетают 89-му скваду!»',
    suggestedSubs: [10, 50, 100]
  }
];

export const INITIAL_GAMES: StreamGame[] = [
  {
    id: 'just_chatting',
    title: 'Just Chatting (Общение с чатом)',
    genre: 'just_chatting',
    icon: 'MessageSquareText',
    minPcTier: 0,
    baseViewers: 8,
    hypeMultiplier: 1.0,
    description: 'Разговоры по душам, просмотр мемов и ответы на донаты. Доступно на любом ПК.',
    unlocked: true,
    price: 0,
    coverColor: 'from-amber-600 to-orange-500'
  },
  {
    id: 'movie_stream',
    title: '🎬 Кинорулетка (Просмотр Фильма)',
    genre: 'movie',
    icon: 'Film',
    minPcTier: 0,
    baseViewers: 45,
    hypeMultiplier: 1.6,
    description: 'Смотрим культовое кино вместе с чатом! Попкорн, реакции на смешные и грустные моменты.',
    unlocked: true,
    price: 0,
    coverColor: 'from-amber-500 via-rose-600 to-indigo-700'
  },
  {
    id: 'craftmine',
    title: 'CraftMine 3D',
    genre: 'sandbox',
    icon: 'Boxes',
    minPcTier: 0,
    baseViewers: 15,
    hypeMultiplier: 1.2,
    description: 'Кубическая песочница: копай шахты, строй стримерский замок и бей криперов.',
    unlocked: true,
    price: 0,
    coverColor: 'from-emerald-600 to-green-500'
  },
  {
    id: 'stardew_valley',
    title: 'Уютная Долина (Cozy Farm)',
    genre: 'sandbox',
    icon: 'Sparkles',
    minPcTier: 0,
    baseViewers: 24,
    hypeMultiplier: 1.3,
    description: 'Ламповая пиксельная ферма, рыбалка и выращивание тыкв под релакс-музыку. Комьюнити в восторге!',
    unlocked: false,
    price: 800,
    coverColor: 'from-lime-600 to-amber-500'
  },
  {
    id: 'counter_frag',
    title: 'Counter-Frag 2',
    genre: 'shooter',
    icon: 'Crosshair',
    minPcTier: 1,
    baseViewers: 35,
    hypeMultiplier: 1.5,
    description: 'Тактический шутер 5x5: клатчи, хедшоты и море эмоций зрителей!',
    unlocked: false,
    price: 1500,
    coverColor: 'from-blue-600 to-cyan-500'
  },
  {
    id: 'dota_legends',
    title: 'Dota of Legends',
    genre: 'moba',
    icon: 'Swords',
    minPcTier: 1,
    baseViewers: 50,
    hypeMultiplier: 1.7,
    description: 'Хардкорная MOBA: сложные тимфайты, комбо скиллов и горящий чат.',
    unlocked: false,
    price: 2500,
    coverColor: 'from-red-600 to-rose-500'
  },
  {
    id: 'tanks_blitz',
    title: 'World of Armor: Танковый Прорыв',
    genre: 'shooter',
    icon: 'Shield',
    minPcTier: 1,
    baseViewers: 65,
    hypeMultiplier: 1.8,
    description: 'Легендарный танковый экшен: выцеливай лючки, танцуй ромбом и бери медали в прямом эфире!',
    unlocked: false,
    price: 3200,
    coverColor: 'from-amber-700 via-stone-700 to-orange-600'
  },
  {
    id: 'phobia_night',
    title: 'Phobia: Ночной Кошмар',
    genre: 'horror',
    icon: 'Ghost',
    minPcTier: 2,
    baseViewers: 90,
    hypeMultiplier: 2.1,
    description: 'Пугающий кооперативный хоррор. Зрители обожают стримерские крики!',
    unlocked: false,
    price: 4200,
    coverColor: 'from-purple-900 to-indigo-900'
  },
  {
    id: 'rust_raid',
    title: 'Rust Survive: Ночной Рейд Базы',
    genre: 'sandbox',
    icon: 'Flame',
    minPcTier: 2,
    baseViewers: 125,
    hypeMultiplier: 2.3,
    description: 'Хардкорное PvP выживание: взрывай чужие бункеры ракетами, защищай лут и уворачивайся от турелей!',
    unlocked: false,
    price: 5500,
    coverColor: 'from-orange-800 to-red-800'
  },
  {
    id: 'cyber_racer',
    title: 'CyberRacer 2077',
    genre: 'racer',
    icon: 'Flame',
    minPcTier: 3,
    baseViewers: 160,
    hypeMultiplier: 2.6,
    description: 'Графический шедевр нового поколения: рейтрейсинг, бешеные скорости и хайп!',
    unlocked: false,
    price: 6900,
    coverColor: 'from-yellow-500 via-pink-600 to-purple-600'
  },
  {
    id: 'apex_legends',
    title: 'Apex Titans: Королевская Битва',
    genre: 'shooter',
    icon: 'Zap',
    minPcTier: 3,
    baseViewers: 220,
    hypeMultiplier: 2.9,
    description: 'Сверхскоростной Battle Royale: подкаты, прыжки на тросах, клатчи 1 в 3 в финальном круге!',
    unlocked: false,
    price: 8500,
    coverColor: 'from-cyan-600 via-teal-600 to-emerald-600'
  },
  {
    id: 'elden_ring',
    title: 'Elden Lords: Тьма Древнего Древа',
    genre: 'horror',
    icon: 'Crown',
    minPcTier: 4,
    baseViewers: 360,
    hypeMultiplier: 3.5,
    description: 'Бескомпромиссный соулслайк шедевр: тайминги перекатов, эпичные боссы и невероятный ажиотаж в чате!',
    unlocked: false,
    price: 12000,
    coverColor: 'from-amber-600 via-yellow-700 to-stone-900'
  },
  {
    id: 'gta_six',
    title: 'Grand Theft Auto VI: Закаты Вайс-Сити',
    genre: 'racer',
    icon: 'Radio',
    minPcTier: 5,
    baseViewers: 650,
    hypeMultiplier: 4.8,
    description: 'Главная игра десятилетия! Погони с 5 звёздами розыска, фотореалистичная физика и рекордный онлайн на трансляции!',
    unlocked: false,
    price: 18000,
    coverColor: 'from-fuchsia-600 via-pink-600 to-violet-600'
  }
];

export const INITIAL_JOBS: DayJob[] = [
  {
    id: 'courier',
    title: 'Курьер DeliFast',
    company: 'DeliFast Express',
    hours: 4,
    salary: 1800,
    energyCost: 30,
    hungerCost: 20,
    moodCost: 10,
    minFollowersRequired: 0,
    description: 'Доставка заказов пешком и на самокате. Быстрые деньги, но устают ноги.',
    tier: 1
  },
  {
    id: 'call_center',
    title: 'Оператор техподдержки',
    company: 'Telecom Support 24/7',
    hours: 6,
    salary: 3400,
    energyCost: 35,
    hungerCost: 15,
    moodCost: 25,
    minFollowersRequired: 0,
    description: 'Ответы на звонки недовольных клиентов. Деньги стабильные, но портится настроение.',
    tier: 2
  },
  {
    id: 'content_writer',
    title: 'Junior Контент-менеджер',
    company: 'Pixel Media Agency',
    hours: 6,
    salary: 5200,
    energyCost: 40,
    hungerCost: 20,
    moodCost: 15,
    minFollowersRequired: 300,
    description: 'Ведение пабликов и написание игровых постов. Требуется опыт в соцсетях.',
    tier: 3
  },
  {
    id: 'game_tester',
    title: 'Тестировщик инди-игр',
    company: 'IndieForge Studio',
    hours: 7,
    salary: 7500,
    energyCost: 45,
    hungerCost: 20,
    moodCost: 10,
    minFollowersRequired: 1000,
    description: 'Ловля багов в новых играх. Отличная зарплата, прокачивает игровое понимание.',
    tier: 4
  },
  {
    id: 'stream_consultant',
    title: 'Консультант стриминговых агентств',
    company: 'CyberStar Media',
    hours: 6,
    salary: 15000,
    energyCost: 40,
    hungerCost: 15,
    moodCost: 5,
    minFollowersRequired: 2500,
    description: 'Аналитика трендов и консультация молодых талантов. Солидный оклад!',
    tier: 5
  },
  {
    id: 'esports_coach',
    title: 'Главный тренер киберспортивной академии',
    company: 'Virtus Titans Gaming',
    hours: 7,
    salary: 28000,
    energyCost: 45,
    hungerCost: 20,
    moodCost: 5,
    minFollowersRequired: 6000,
    description: 'Разбор тактик, тренировка про-составов. Высочайший авторитет и гонорары.',
    tier: 6
  },
  {
    id: 'producer',
    title: 'Креативный продюсер топ-шоу',
    company: 'StreamPrime Entertainment',
    hours: 8,
    salary: 55000,
    energyCost: 50,
    hungerCost: 20,
    moodCost: 5,
    minFollowersRequired: 15000,
    description: 'Руководство миллионными медийными проектами. Огромные доходы!',
    tier: 7
  }
];

export const HARDWARE_CATALOG: HardwareItem[] = [
  // PCs
  {
    id: 'pc_0',
    category: 'pc',
    name: 'Старый ноутбук бабушки',
    tier: 0,
    price: 0,
    qualityBonus: 0,
    stabilityBonus: 10,
    description: 'Встроенное видеоядро, греется как утюг. Тянет только простые игры.',
    iconName: 'Laptop'
  },
  {
    id: 'pc_1',
    category: 'pc',
    name: 'Бюджетный ПК (Core i3 + GTX 1660)',
    tier: 1,
    price: 28000,
    qualityBonus: 20,
    stabilityBonus: 35,
    description: 'Тянет Counter-Frag и Dota в стабильных 60 кадров. Зрители довольны!',
    iconName: 'Monitor'
  },
  {
    id: 'pc_2',
    category: 'pc',
    name: 'Геймерский монстр (Ryzen 7 + RTX 4070)',
    tier: 2,
    price: 85000,
    qualityBonus: 50,
    stabilityBonus: 70,
    description: 'Тянет тяжелые хорроры и AAA-игры в 1440p без единого лага.',
    iconName: 'Cpu'
  },
  {
    id: 'pc_3',
    category: 'pc',
    name: 'Ультимативная станция (RTX 5090 Dual Rig)',
    tier: 3,
    price: 210000,
    qualityBonus: 100,
    stabilityBonus: 100,
    description: 'Два ПК: один для игры, второй для захвата 4K 120 FPS. Топ Твича!',
    iconName: 'Server'
  },
  {
    id: 'pc_4',
    category: 'pc',
    name: 'Кастомная водянка Liquid Dual RTX 5090',
    tier: 4,
    price: 420000,
    qualityBonus: 160,
    stabilityBonus: 150,
    description: 'Медные трубки, кастомный водоблок, 128 ГБ DDR5 и 4K 144 FPS без малейшей просадки. Мечта топ-стримеров!',
    iconName: 'Cpu'
  },
  {
    id: 'pc_5',
    category: 'pc',
    name: 'Квантовая Станция AI Studio Cloud Titan',
    tier: 5,
    price: 850000,
    qualityBonus: 260,
    stabilityBonus: 200,
    description: 'Серверный монстр с ИИ-рендерингом кадров. Тянет GTA 6 на ультрах в 8K 240 FPS и собирает миллионы зрителей!',
    iconName: 'Server'
  },

  // Microphones
  {
    id: 'mic_0',
    category: 'mic',
    name: 'Микрофон в наушниках-капельках',
    tier: 0,
    price: 0,
    qualityBonus: 0,
    stabilityBonus: 0,
    description: 'Шипит, хрипит и ловит дыхание. Чат часто пишет "КУПИ МИКРОФОН".',
    iconName: 'MicOff'
  },
  {
    id: 'mic_1',
    category: 'mic',
    name: 'USB микрофон Fifine K669',
    tier: 1,
    price: 3500,
    qualityBonus: 15,
    stabilityBonus: 20,
    description: 'Чистый голос без сильного эха. Зрителям приятно слушать голос.',
    iconName: 'Mic'
  },
  {
    id: 'mic_2',
    category: 'mic',
    name: 'Rode PodMic + Аудиоинтерфейс',
    tier: 2,
    price: 19000,
    qualityBonus: 35,
    stabilityBonus: 40,
    description: 'Бархатный радиовещательный тембр с шумоподавлением.',
    iconName: 'Radio'
  },
  {
    id: 'mic_3',
    category: 'mic',
    name: 'Легендарный Shure SM7B + Cloudlifter',
    tier: 3,
    price: 54000,
    qualityBonus: 60,
    stabilityBonus: 60,
    description: 'Золотой стандарт топовых стримеров мира. Идеальный студийный звук.',
    iconName: 'Mic2'
  },
  {
    id: 'mic_4',
    category: 'mic',
    name: 'Neumann U87 Ai + Ламповый Avalon VT-737sp',
    tier: 4,
    price: 180000,
    qualityBonus: 95,
    stabilityBonus: 85,
    description: 'Золотой стандарт легендарных студий. Голос звучит бархатно и глубоко, слышен каждый эмоциональный полутон.',
    iconName: 'Mic2'
  },
  {
    id: 'mic_5',
    category: 'mic',
    name: 'Золотой Микрофон Шейха с Квантовым Шумодавом AI Pro',
    tier: 5,
    price: 490000,
    qualityBonus: 160,
    stabilityBonus: 130,
    description: 'Инкрустированный корпус, нейросетевая изоляция голоса: никакой шум соседей или перфоратора не просочится в эфир!',
    iconName: 'Radio'
  },

  // Webcams
  {
    id: 'cam_0',
    category: 'camera',
    name: 'Встроенная вебкамера 480p',
    tier: 0,
    price: 0,
    qualityBonus: 0,
    stabilityBonus: 0,
    description: 'Мыльная картинка и артефакты в темноте.',
    iconName: 'CameraOff'
  },
  {
    id: 'cam_1',
    category: 'camera',
    name: 'Logitech C920 HD Pro (1080p)',
    tier: 1,
    price: 7500,
    qualityBonus: 15,
    stabilityBonus: 20,
    description: 'Четкое лицо, автофокус. Классика любого начинающего стримера.',
    iconName: 'Camera'
  },
  {
    id: 'cam_2',
    category: 'camera',
    name: 'Elgato Facecam Pro (4K 60fps)',
    tier: 2,
    price: 32000,
    qualityBonus: 40,
    stabilityBonus: 40,
    description: 'Сверхчеткая картинка с настраиваемой оптикой и нулевой задержкой.',
    iconName: 'Video'
  },
  {
    id: 'cam_3',
    category: 'camera',
    name: 'Sony A7 IV Mirrorless + Объектив 1.4',
    tier: 3,
    price: 145000,
    qualityBonus: 75,
    stabilityBonus: 60,
    description: 'Кинематографичное боке (размытие фона). Выглядит как телевидение будущего.',
    iconName: 'Tv'
  },
  {
    id: 'cam_4',
    category: 'camera',
    name: 'Голливудская Кинокамера RED V-Raptor 8K',
    tier: 4,
    price: 360000,
    qualityBonus: 120,
    stabilityBonus: 95,
    description: 'Съемка в 8K RAW с киношным цветом. Лицо и эмоции стримера выглядят кинематографичнее блокбастеров!',
    iconName: 'Video'
  },
  {
    id: 'cam_5',
    category: 'camera',
    name: 'Голографическая 3D-Матрица Присутствия HoloStream',
    tier: 5,
    price: 680000,
    qualityBonus: 190,
    stabilityBonus: 140,
    description: 'Транслирует объемную 3D-голограмму стримера прямо в мониторы зрителей. Технология 2030 года!',
    iconName: 'Tv'
  },

  // Lighting
  {
    id: 'light_0',
    category: 'light',
    name: 'Желтая настольная лампа',
    tier: 0,
    price: 0,
    qualityBonus: 0,
    stabilityBonus: 0,
    description: 'Ослепляет один глаз, лицо в жестких тенях.',
    iconName: 'SunMedium'
  },
  {
    id: 'light_1',
    category: 'light',
    name: 'Кольцевая LED лампа 26см',
    tier: 1,
    price: 2200,
    qualityBonus: 10,
    stabilityBonus: 10,
    description: 'Равномерный свет в лицо с красивыми кругами в зрачках.',
    iconName: 'Circle'
  },
  {
    id: 'light_2',
    category: 'light',
    name: 'Студийный свет Key Light + RGB ленты',
    tier: 2,
    price: 18000,
    qualityBonus: 30,
    stabilityBonus: 30,
    description: 'Управляемый софтбокс и неоновый фон позади стримера.',
    iconName: 'Sparkles'
  },
  {
    id: 'light_3',
    category: 'light',
    name: 'Профессиональный студийный сетап Nanlite RGB',
    tier: 3,
    price: 65000,
    qualityBonus: 55,
    stabilityBonus: 50,
    description: 'Голливудская трехточечная подсветка с динамическими RGB эффектами.',
    iconName: 'Zap'
  },
  {
    id: 'light_4',
    category: 'light',
    name: 'Световой Комплекс Aputure с Реакцией на Донаты',
    tier: 4,
    price: 130000,
    qualityBonus: 90,
    stabilityBonus: 80,
    description: 'Интеллектуальная система: вспыхивает золотом при донатах, нагнетает багровый полумрак в хоррорах!',
    iconName: 'Sparkles'
  },
  {
    id: 'light_5',
    category: 'light',
    name: 'Киберпанк Неоновый Купол с Лазерами и Дымом',
    tier: 5,
    price: 290000,
    qualityBonus: 145,
    stabilityBonus: 110,
    description: 'Концертное лазерное шоу в комнате. Стримы попадают в рекомендации и тренды по всему миру!',
    iconName: 'Zap'
  },

  // Chairs & Comfort (Кресла)
  {
    id: 'chair_0',
    category: 'chair',
    name: 'Кухонная табуретка',
    tier: 0,
    price: 0,
    qualityBonus: 0,
    stabilityBonus: 0,
    description: 'Спина начинает ныть уже через 20 минут стрима.',
    iconName: 'Square'
  },
  {
    id: 'chair_1',
    category: 'chair',
    name: 'Офисное кресло с подлокотниками',
    tier: 1,
    price: 6000,
    qualityBonus: 10,
    stabilityBonus: 20,
    description: 'Мягкое сиденье, стримить можно заметно дольше без усталости.',
    iconName: 'Armchair'
  },
  {
    id: 'chair_2',
    category: 'chair',
    name: 'Геймерское кресло Secretlab Titan',
    tier: 2,
    price: 48000,
    qualityBonus: 25,
    stabilityBonus: 40,
    description: 'Ортопедическая поддержка, подушка под шею, стильный вид в кадре.',
    iconName: 'Crown'
  },
  {
    id: 'chair_3',
    category: 'chair',
    name: 'Herman Miller x Logitech Embody',
    tier: 3,
    price: 160000,
    qualityBonus: 50,
    stabilityBonus: 60,
    description: 'Максимальный комфорт. Энергия во время стримов тратится на 50% медленнее!',
    iconName: 'ShieldCheck'
  },
  {
    id: 'chair_4',
    category: 'chair',
    name: 'Zero-Gravity Капсула Predator Thronos Cave',
    tier: 4,
    price: 380000,
    qualityBonus: 90,
    stabilityBonus: 95,
    description: 'Моторизованный наклон до 140°, встроенный виброотклик на выстрелы, подогрев поясницы и массаж во время стрима!',
    iconName: 'Crown'
  },
  {
    id: 'chair_5',
    category: 'chair',
    name: 'Императорский Трон Невесомости "Cyber-King Gold"',
    tier: 5,
    price: 750000,
    qualityBonus: 150,
    stabilityBonus: 140,
    description: 'Абсолютная невесомость с парением в воздухе. Спина никогда не устает, а энергия во время трансляций почти не тратится!',
    iconName: 'ShieldCheck'
  },

  // Internet ISP
  {
    id: 'internet_0',
    category: 'internet',
    name: 'ADSL провайдер "МедведьТелеком"',
    tier: 0,
    price: 0,
    qualityBonus: 0,
    stabilityBonus: 10,
    description: '10 Мбит/с. Кадры дропаются в самый ответственный момент.',
    iconName: 'WifiOff'
  },
  {
    id: 'internet_1',
    category: 'internet',
    name: 'Оптоволокно 100 Мбит/с',
    tier: 1,
    price: 1500, // setup price
    qualityBonus: 15,
    stabilityBonus: 30,
    description: 'Стабильный битрейт 6000 Кбит/с без потерь пакетов.',
    iconName: 'Wifi'
  },
  {
    id: 'internet_2',
    category: 'internet',
    name: 'Стримерский тариф 500 Мбит/с',
    tier: 2,
    price: 4500,
    qualityBonus: 30,
    stabilityBonus: 60,
    description: 'Пинг 5 мс до игровых серверов, нулевые потери кадров.',
    iconName: 'Gauge'
  },
  {
    id: 'internet_3',
    category: 'internet',
    name: 'Выделенная гигабитная линия 1 Gbps',
    tier: 3,
    price: 12000,
    qualityBonus: 50,
    stabilityBonus: 95,
    description: 'Прямой пиринг с серверами Twitch и YouTube. Вещание без компромиссов.',
    iconName: 'Globe'
  },
  {
    id: 'internet_4',
    category: 'internet',
    name: 'Оптоволокно 10 Гбит/с + Starlink v3 Резерв',
    tier: 4,
    price: 110000,
    qualityBonus: 75,
    stabilityBonus: 110,
    description: 'Два независимых канала связи. Стрим продолжит вещать даже в случае глобального апокалипсиса!',
    iconName: 'Wifi'
  },
  {
    id: 'internet_5',
    category: 'internet',
    name: 'Прямой Оптоволоконный Линк к Датацентру Твича (0.05 ms)',
    tier: 5,
    price: 240000,
    qualityBonus: 130,
    stabilityBonus: 170,
    description: 'Нулевая задержка, исходный несжатый поток 4K/8K, выделенный приоритетный сервер вещания!',
    iconName: 'Zap'
  }
];

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'bot_automod',
    role: 'mod_bot',
    name: 'Бот "AutoMod-3000"',
    avatar: '🤖',
    salaryDaily: 250,
    hired: false,
    effectDescription: 'Автоматически банит до 40% спама и ссылок в чате.',
    autoBanChance: 0.4,
    passiveViewsDaily: 0,
    retentionBonus: 5,
    sponsorBoost: 0,
    level: 1
  },
  {
    id: 'mod_pashka',
    role: 'moderator',
    name: 'Павел "Pashka_Ban"',
    avatar: '🛡️',
    salaryDaily: 800,
    hired: false,
    effectDescription: 'Живой модератор! Банит 70% токсиков и хейтеров, защищает чат.',
    autoBanChance: 0.7,
    passiveViewsDaily: 0,
    retentionBonus: 15,
    sponsorBoost: 0,
    level: 1
  },
  {
    id: 'mod_alisa',
    role: 'moderator',
    name: 'Алиса "IronKira"',
    avatar: '👩‍💻',
    salaryDaily: 1800,
    hired: false,
    effectDescription: 'Старший модератор. Банит 92% нарушителей и отражает рейды хейтеров.',
    autoBanChance: 0.92,
    passiveViewsDaily: 0,
    retentionBonus: 25,
    sponsorBoost: 5,
    level: 1
  },
  {
    id: 'editor_timur',
    role: 'editor',
    name: 'Тимур "QuickCut"',
    avatar: '🎬',
    salaryDaily: 2400,
    hired: false,
    effectDescription: 'Монтирует хайлайты стримов в Shorts и YouTube. Дает +50-250 новых фолловеров ежедневно!',
    autoBanChance: 0,
    passiveViewsDaily: 150,
    retentionBonus: 20,
    sponsorBoost: 10,
    level: 1
  },
  {
    id: 'designer_artyom',
    role: 'designer',
    name: 'Артём "NeonGlow"',
    avatar: '🎨',
    salaryDaily: 1500,
    hired: false,
    effectDescription: 'Профессиональный оверлей, фирменные алерты донатов и смайлики (+35% донатов).',
    autoBanChance: 0,
    passiveViewsDaily: 50,
    retentionBonus: 35,
    sponsorBoost: 15,
    level: 1
  },
  {
    id: 'manager_viktoria',
    role: 'manager',
    name: 'Виктория "PR Queen"',
    avatar: '💼',
    salaryDaily: 3500,
    hired: false,
    effectDescription: 'Ищет жирные рекламные контракты и договаривается о коллабах с топ-стримерами (+100% доход с брендов).',
    autoBanChance: 0,
    passiveViewsDaily: 200,
    retentionBonus: 15,
    sponsorBoost: 100,
    level: 1
  }
];

export const INITIAL_SPONSORS: SponsorContract[] = [
  {
    id: 'sp_energy',
    brand: 'CyberBull Energy',
    logo: '⚡',
    tagline: 'Зарядись на 10 часов каток!',
    rewardMoney: 4500,
    minutesRequired: 10,
    minutesStreamed: 0,
    minFollowers: 200,
    completed: false,
    active: false
  },
  {
    id: 'sp_vpn',
    brand: 'ShadowGuard VPN',
    logo: '🛡️',
    tagline: 'Пинг ниже, защита от DDoS выше.',
    rewardMoney: 9500,
    minutesRequired: 15,
    minutesStreamed: 0,
    minFollowers: 800,
    completed: false,
    active: false
  },
  {
    id: 'sp_hardware',
    brand: 'ApexGear Gaming',
    logo: '🎧',
    tagline: 'Девайсы настоящих чемпионов киберспорта.',
    rewardMoney: 22000,
    minutesRequired: 20,
    minutesStreamed: 0,
    minFollowers: 2500,
    completed: false,
    active: false
  },
  {
    id: 'sp_crypto',
    brand: 'MoonCoin Exchange',
    logo: '🚀',
    tagline: 'Торгуй скинами и токенами без комиссии.',
    rewardMoney: 55000,
    minutesRequired: 25,
    minutesStreamed: 0,
    minFollowers: 8000,
    completed: false,
    active: false
  }
];

export const INITIAL_BILLS: BillItem[] = [
  {
    id: 'bill_rent',
    name: 'Аренда 1-комн. квартиры',
    amount: 14000,
    category: 'rent',
    dueDay: 4,
    isPaid: false,
    penaltyActive: false
  },
  {
    id: 'bill_internet',
    name: 'Счет за скоростной интернет',
    amount: 1200,
    category: 'internet',
    dueDay: 3,
    isPaid: false,
    penaltyActive: false
  },
  {
    id: 'bill_electricity',
    name: 'Электричество (ПК мотает счетчик!)',
    amount: 1800,
    category: 'electricity',
    dueDay: 5,
    isPaid: false,
    penaltyActive: false
  },
  {
    id: 'bill_subscriptions',
    name: 'Музыка без АП и стрим-сервисы',
    amount: 650,
    category: 'subscriptions',
    dueDay: 7,
    isPaid: false,
    penaltyActive: false
  }
];

// Rich pools of chat comments for realistic streaming atmosphere
export const CHAT_POOLS = {
  friendly: [
    'Стрим огонь, всем привет из Казани!',
    'ЛУЧШИЙ СТРИМЕР НА ПЛАТФОРМЕ ❤️',
    'Погнали, я за чипсами сбегал!',
    'Подрубил, кайф! Ждал весь день!',
    'Красивый мув, харош!',
    'хахаха ор выше гор 🤣',
    'Какая сенса у мышки?',
    'Стример, попей водички, лицо уставшее',
    'Топовый контент, ставлю лайк!',
    'Ура, любимая игра на стриме!',
    'Тащи этот раунд, мы верим!',
    'Чат, кто тоже с чаем сидит? + в чат',
    'Ахаха вот это тайминг был!',
    'Стример красавчик, жги!',
    'ПОГЧАМП PogChamp 🔥🔥🔥',
    'РЕЙД 500 ЧЕЛОВЕК! ВСЕМ КУ! 🚀',
    'Чат, спамим сердечки стримеру! 💖💖💖',
    'Вот это реакция мангуста, красава!',
    'В соляного раунд взял, гений игры!',
    'Врубай фонк на фон, ща разнос будет 🔊',
    'Стример, ты мой краш! Смотрю на парах в универе)',
    'Опа, онлайн растет! Скоро в трендах будем!',
    'Вруби вебку побольше, хотим видеть эмоции!',
    'Стример, забей на хейтеров, ты легенда!',
    'Ахахаха чат, вы видели этот прострел?! 🎯',
    'База выдана, стример дело говорит 🗿',
    'Топ музыка играет, дай плейлист в описании!',
    'У меня бутерброд упал от твоего крика ахаха 🥪'
  ],
  toxic: [
    'Боже, удали игру, у меня дед лучше стреляет',
    'Сливной бот, как ты вообще в это играешь?',
    'СКУЧНО! Иди на завод работай, стримы не твое',
    'Кринж контент, кринж стример 🤮',
    'Дно лоускильное, отписываюсь!',
    'Ха-ха, опять слился как нуб, позор',
    'Чел, ты реально не понимаешь как играть?',
    'Ужасный стрим, микрофон фонит, игра лагает',
    'Выключи стрим не позорься',
    'Ты никогда не станешь популярным, забей',
    'Худший аим в истории этой игры лол',
    'Стример с завода сбежал и думает что он про-геймер 😂',
    'АХАХА 0/10 статистика, удали ПК в окно!',
    'Кто тебе вообще донатит? Сам себе с твинка кидаешь небось 🤡',
    'Кринжатина максимальная, уши вянут',
    'Стример, иди уроки учи, завтра в школу к первому уроку!',
    'Чат, давайте дружно дизлайк за такую игру 👎',
    'Голос как из бочки, купи нормальный микрофон бомж',
    'Ты хоть раз выигрывал без читов?',
    'Уснул на стриме, худший контент 2026 года 💤'
  ],
  spam: [
    '🔥 ХОЧЕШЬ БЕСПЛАТНЫЕ СКИНЫ? ЗАХОДИ НА SKINS-FREE.XYZ',
    'Раздача iPhone 16 в моем профиле! Жми ссылку в описании!',
    'Заработок от 50 000 руб в день без опыта! Пиши в тг @bablo_scam',
    'Купи накрутку зрителей от 99 руб! Быстро и надежно!',
    'Подпишись на мой канал взаимно плиз, я начинающий!',
    'ВНИМАНИЕ! БЕСПЛАТНЫЙ ДОСТУП В ЗАКРЫТЫЙ VIP КЛУБ!',
    'ААААААААААААААААААААААААААААААААААААА',
    '🎁 ПОЛУЧИ 1000 БЕСПЛАТНЫХ КРУТОК ПО ПРОМОКОДУ: LOX2026',
    'Переходите все на стрим к @SuperPro, там раздают деньги!',
    'КУПЛЮ ТВОЙ АККАУНТ ДОРОГО! ПИШИ В ЛС СРОЧНО!'
  ],
  spoilers: [
    'СПОЙЛЕР: босс появится справа из засады, не иди туда',
    'В конце игры главный герой предатель, инфа сотка!',
    'Там секретный сундук за картиной, возьми ключ под ковром',
    'Не стреляй в него, это сюжетный NPC!',
    'Я уже прошел эту игру, дальше будет скукота',
    'Не качай этот скилл, его в новом патче понерфили в ноль!',
    'СПОЙЛЕР: в следующей комнате ловушка с шипами на полу!'
  ],
  donations: [
    { name: 'Щедрый_Олег', amount: 500, text: 'На новый микрофон! Спасибо за крутое настроение после тяжелого рабочего дня!' },
    { name: 'DotaKing2008', amount: 150, text: 'Сделай клатч или побреешься налысо в прямом эфире!' },
    { name: 'Анонимный_Меценат', amount: 2000, text: 'Купи нормальной еды и отдохни, береги здоровье, стример!' },
    { name: 'CyberKotik', amount: 250, text: 'Привет из Питера! Закажи пиццу на стрим)' },
    { name: 'KekMaster', amount: 100, text: 'Держи сотку на энергетик, давай еще катку!' },
    { name: 'Elena_V', amount: 1000, text: 'Любимый стрим, смотрю уже 3 месяца каждый вечер ❤️' },
    { name: 'Гроза_Рандома', amount: 300, text: 'Забань того токсика снизу, бесит уже!' },
    { name: 'Mr_Beast_Fan', amount: 5000, text: 'Держи на топовую видеокарту! Ты заслужил!' },
    { name: 'Бабушка_Геймера', amount: 777, text: 'Внучек, надень шапку и покушай пирожков! Удачи на стриме!' },
    { name: 'Top1_Sniper', amount: 1500, text: 'Держи на сбор! За такой хедшот грех не задонатить!' },
    { name: 'Shukasha_Fan', amount: 450, text: 'Шукаша на связи! Жги стример, забирай сабки!' },
    { name: 'Crypto_Whale', amount: 10000, text: '🚀 БИТКОИН ТУ ДЕ МУН! Забирай на апгрейд всей студии!' },
    { name: 'Паша_Сварщик', amount: 350, text: 'Смена закончилась, сижу под твой стрим отдыхаю. Красава!' },
    { name: 'NeonSamurai', amount: 600, text: 'На новый стул и спину, не сутулься за компом!' },
    { name: 'Студент_на_диете', amount: 50, text: 'Отдал последние деньги с проездного, стрим того стоит!' },
    { name: 'Мама_Стримера', amount: 1200, text: 'Сынок, горжусь тобой! Не забудь вынести мусор после трансляции!' },
    { name: 'Артем_VIP', amount: 3000, text: 'Забей на хейтеров в чате, ты лучший контентмейкер года!' },
    { name: 'Шаурма_Мастер', amount: 400, text: 'Лови на двойную шаурму с чесночным соусом! Приятного аппетита!' },
    { name: 'Капитан_Очевидность', amount: 200, text: 'Если ты закроешь стрим, стрим закроется. Держи на сбор!' },
    { name: 'Vika_Stream', amount: 850, text: 'Очень уютный стрим! Привет от всего чата 🌸' },
    { name: 'Шейх_из_Дубая', amount: 15000, text: '👑 ВПЕРЁД В ТОП ТВИТЧА! ДАРЮ НА НОВЫЙ ПК МАКСИМАЛЬНОЙ КОМПЛЕКТАЦИИ!' },
    { name: 'Oldfag_2015', amount: 500, text: 'Помню тебя когда было 3 зрителя! Как же ты вырос, легенда!' },
    { name: 'Turbo_Sanya', amount: 250, text: 'Давай хайпа навали! Чат, спамим огоньки 🔥🔥🔥' },
    { name: 'CyberVampire', amount: 999, text: 'Ночной донат для лучшего полуночного стримера!' },
    { name: 'Пельменный_Барон', amount: 333, text: 'Магическая сумма на удачу в катках!' }
  ]
};
