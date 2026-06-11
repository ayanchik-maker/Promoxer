/* Promoxer — localization layer (EN / RU).
   t(key, vars) interpolates {placeholders}; tc(key, n, vars) picks plural forms:
   en → key_one / key_other; ru → key_one / key_few / key_many. */

const STRINGS = {
  en: {
    tagline: "Buy together. Pay wholesale.",
    tagline2: "Global marketplaces, localized for you.",

    // SIM / onboarding
    secureSignin: "Secure sign-in",
    simVerifying: "Verifying device…",
    simBodyIdle: "Promoxer confirms it’s really you using your SIM/eSIM identity — no passwords, tied to your device.",
    simBodyScan: "Linking your secure profile to this device’s SIM/eSIM identity.",
    simVerifyBtn: "Verify with SIM/eSIM ID",
    simWait: "Please wait…",
    simBadge: "SIM/eSIM verified",
    simConceptNote: "Concept demo — no real SIM provisioning. Represents the future secure identity layer.",

    // Register
    createProfile: "Create your profile",
    profileIntro: "Tell us a bit about you so the feed is localized and personalized.",
    fullName: "Full name",
    namePlaceholder: "e.g. Aruzhan K.",
    age: "Age",
    city: "City",
    gender: "Gender",
    genderFemale: "Female",
    genderMale: "Male",
    genderOther: "Other",
    budgetLabel: "Approximate budget per item",
    continueBtn: "Continue",

    // Interests
    interestsTitle: "What are you into?",
    interestsIntro: "Pick a few categories. We’ll rank your feed and group deals around these.",
    pickAtLeastOne: "Pick at least one",
    showDeals: "Show my deals ({n})",

    // Feed
    hi: "Hi {name}",
    feedSub: "Personalized group deals from global marketplaces.",
    searchPlaceholder: "Search products or marketplaces",
    catAll: "All",
    deal_one: "{n} deal",
    deal_other: "{n} deals",
    sortRecommended: "Recommended",
    sortUnlock: "Closest to unlock",
    sortSavings: "Biggest savings",
    noMatching: "No matching deals.",
    clearFilters: "Clear search and filters",
    oppKicker: "Closest to wholesale",
    oppUnlocked: "Price unlocked now",
    oppLeft_one: "{n} buyer left",
    oppLeft_other: "{n} buyers left",
    oppSave: "save {amt}",

    // Product card / detail
    joinedTag: "Joined",
    joinedOf: "{c}/{m} joined",
    unlockShort: "group price unlocked",
    more_one: "{n} more to unlock",
    more_other: "{n} more to unlock",
    trending: "Trending",
    individualPrice: "Individual price",
    groupPrice: "Group price",
    savePct: "SAVE {p}%",
    youSave: "You save {amt}",
    sourcePrice: "Listed at ≈ ${usd} on {mkt}",
    fxNote: "Auto-converted to ₸ at 1 USD = ₸{rate} · local payments supported",
    groupPurchase: "Group purchase",
    endsIn: "Deal window closes in ~{h} h",
    needs_one: "Needs {n} more buyer to reach the minimum batch of {m}.",
    needs_other: "Needs {n} more buyers to reach the minimum batch of {m}.",
    unlockedLong: "Minimum batch reached — order ships at wholesale price.",
    unlockedBanner: "Group price unlocked — everyone pays wholesale!",
    whyTitle: "Why this is recommended for you",
    joinBtn: "Join group purchase · pay {amt}",
    inGroup: "You’re in this group",
    chargeNote: "You’re only charged the wholesale price once the minimum batch is reached.",
    shareMsg: "Join my Promoxer group for {title} and save {amt}.",
    shareDone: "Deal shared",
    shareCopied: "Deal link copied",
    shareFallback: "Share this deal with your group",
    shareFail: "Couldn’t share this deal",

    // Payment sheet
    payTitle: "Choose payment method",
    payIntro: "Your payment is only reserved now — it’s charged when the batch completes.",
    payKaspiDesc: "Instant local payment",
    payHalykDesc: "Local bank transfer",
    payCardDesc: "International card",
    payConfirm: "Authorize with SIM/eSIM ID",
    payAuthorizing: "Authorizing via SIM/eSIM…",
    payDone: "Joined — {method} payment reserved",
    payReservedVia: "Reserved via {method}",

    // Groups
    navFeed: "Feed",
    myGroups: "My Groups",
    emptyGroups: "You haven’t joined any group buys yet.",
    emptyGroupsHint: "Open a product and tap “Join group purchase”.",
    groupsJoined: "Groups joined",
    totalSavings: "Total savings",

    // Profile
    profileTitle: "Profile",
    secureLinked: "Secure profile linked to this device via SIM/eSIM identity.",
    budgetPerItem: "Budget / item",
    yourInterests: "Your interests",
    language: "Language",
    editInterests: "Edit interests",
    resetDemo: "Reset demo data",
    howItWorks: "How Promoxer works",

    // How-it-works sheet
    howTitle: "How Promoxer works",
    how1t: "Verify once with SIM/eSIM",
    how1b: "Your profile is bound to the SIM/eSIM in your device — password-less sign-in and a trusted identity for every group deal.",
    how2t: "One localized feed",
    how2b: "Products from AliExpress, Amazon, Temu, eBay and SHEIN in one feed — your language, prices auto-converted to ₸, local payment rails.",
    how3t: "Join a group, hit the batch",
    how3b: "Each deal needs a minimum number of buyers. Your payment is only reserved until the batch completes.",
    how4t: "Everyone pays wholesale",
    how4b: "When the minimum batch is reached, the wholesale price unlocks for every participant — typically 30–40% below retail.",
    visionTitle: "Strategic vision",
    visionBody: "Level 1 (this MVP): AI-driven collective purchasing with marketplace aggregation and localization. Level 2: SIM/eSIM becomes a full telecom-grade identity layer — secure payments, device-bound accounts and a trusted commerce ecosystem.",
    gotIt: "Got it",

    // Toasts / activity
    joinToast: "You joined the group buy",
    unlockToast: "Minimum batch reached — wholesale price unlocked!",
    resetToast: "Demo reset — start a fresh walkthrough",
    liveJoin: "{name} from {city} joined “{title}”",
    yourUnlock: "Your group “{title}” just unlocked the wholesale price!",

    // Recommendation reasons
    reasonInterests: "Matches your interests",
    reasonBudget: "Within your budget",
    reasonTrending: "Trending in {city}",
    reasonAlmost: "Almost unlocked",

    // Categories
    cat_electronics: "Electronics",
    cat_fashion: "Fashion",
    cat_home: "Home & Kitchen",
    cat_beauty: "Beauty",
    cat_sports: "Sports & Outdoors",
    cat_gaming: "Gaming",
    cat_kids: "Kids & Baby",
    cat_auto: "Auto",

    // Cities
    city_Almaty: "Almaty",
    city_Astana: "Astana",
    city_Shymkent: "Shymkent",
    city_Karaganda: "Karaganda",
    city_Aktobe: "Aktobe",
    city_Taraz: "Taraz",
  },

  ru: {
    tagline: "Покупайте вместе. Платите оптом.",
    tagline2: "Глобальные маркетплейсы — локально для вас.",

    secureSignin: "Безопасный вход",
    simVerifying: "Проверяем устройство…",
    simBodyIdle: "Promoxer подтверждает, что это действительно вы, по SIM/eSIM-идентификатору — без паролей, с привязкой к устройству.",
    simBodyScan: "Привязываем защищённый профиль к SIM/eSIM этого устройства.",
    simVerifyBtn: "Войти через SIM/eSIM ID",
    simWait: "Подождите…",
    simBadge: "SIM/eSIM подтверждён",
    simConceptNote: "Концепт-демо — без реальной SIM-подложки. Показывает будущий слой безопасной идентификации.",

    createProfile: "Создайте профиль",
    profileIntro: "Расскажите немного о себе — лента станет локализованной и персональной.",
    fullName: "Имя и фамилия",
    namePlaceholder: "напр. Аружан К.",
    age: "Возраст",
    city: "Город",
    gender: "Пол",
    genderFemale: "Женский",
    genderMale: "Мужской",
    genderOther: "Другое",
    budgetLabel: "Примерный бюджет на товар",
    continueBtn: "Продолжить",

    interestsTitle: "Что вам интересно?",
    interestsIntro: "Выберите несколько категорий — мы построим вокруг них ленту и групповые скидки.",
    pickAtLeastOne: "Выберите хотя бы одну",
    showDeals: "Показать мои скидки ({n})",

    hi: "Привет, {name}",
    feedSub: "Персональные групповые скидки с глобальных маркетплейсов.",
    searchPlaceholder: "Поиск товаров и маркетплейсов",
    catAll: "Все",
    deal_one: "{n} предложение",
    deal_few: "{n} предложения",
    deal_many: "{n} предложений",
    sortRecommended: "Рекомендуемые",
    sortUnlock: "Ближе к открытию",
    sortSavings: "Максимальная выгода",
    noMatching: "Ничего не найдено.",
    clearFilters: "Сбросить поиск и фильтры",
    oppKicker: "Ближе всего к опту",
    oppUnlocked: "Цена уже открыта",
    oppLeft_one: "остался {n} участник",
    oppLeft_few: "осталось {n} участника",
    oppLeft_many: "осталось {n} участников",
    oppSave: "выгода {amt}",

    joinedTag: "Вы в группе",
    joinedOf: "{c}/{m} в группе",
    unlockShort: "оптовая цена открыта",
    more_one: "ещё {n} до открытия",
    more_few: "ещё {n} до открытия",
    more_many: "ещё {n} до открытия",
    trending: "В тренде",
    individualPrice: "Цена поодиночке",
    groupPrice: "Цена группой",
    savePct: "−{p}%",
    youSave: "Вы экономите {amt}",
    sourcePrice: "На {mkt} ≈ ${usd}",
    fxNote: "Автоконвертация в ₸ по курсу 1 USD = ₸{rate} · оплата через местные банки",
    groupPurchase: "Групповая покупка",
    endsIn: "Окно сделки закроется через ~{h} ч",
    needs_one: "Нужен ещё {n} участник до минимальной партии из {m}.",
    needs_few: "Нужно ещё {n} участника до минимальной партии из {m}.",
    needs_many: "Нужно ещё {n} участников до минимальной партии из {m}.",
    unlockedLong: "Минимальная партия собрана — заказ уходит по оптовой цене.",
    unlockedBanner: "Оптовая цена открыта — все платят по опту!",
    whyTitle: "Почему мы это рекомендуем",
    joinBtn: "Присоединиться · платите {amt}",
    inGroup: "Вы в этой группе",
    chargeNote: "Деньги списываются по оптовой цене только после набора минимальной партии.",
    shareMsg: "Вступай в мою группу Promoxer на «{title}» и сэкономь {amt}.",
    shareDone: "Скидкой поделились",
    shareCopied: "Ссылка скопирована",
    shareFallback: "Поделитесь скидкой с друзьями",
    shareFail: "Не удалось поделиться",

    payTitle: "Выберите способ оплаты",
    payIntro: "Сейчас деньги только резервируются — списание после набора партии.",
    payKaspiDesc: "Мгновенная местная оплата",
    payHalykDesc: "Перевод через местный банк",
    payCardDesc: "Международная карта",
    payConfirm: "Подтвердить через SIM/eSIM ID",
    payAuthorizing: "Авторизация через SIM/eSIM…",
    payDone: "Вы в группе — {method}: оплата зарезервирована",
    payReservedVia: "Резерв через {method}",

    navFeed: "Лента",
    myGroups: "Мои группы",
    emptyGroups: "Вы пока не вступили ни в одну группу.",
    emptyGroupsHint: "Откройте товар и нажмите «Присоединиться».",
    groupsJoined: "Групп",
    totalSavings: "Общая выгода",

    profileTitle: "Профиль",
    secureLinked: "Профиль защищён и привязан к устройству через SIM/eSIM.",
    budgetPerItem: "Бюджет / товар",
    yourInterests: "Ваши интересы",
    language: "Язык",
    editInterests: "Изменить интересы",
    resetDemo: "Сбросить демо-данные",
    howItWorks: "Как работает Promoxer",

    howTitle: "Как работает Promoxer",
    how1t: "Один вход через SIM/eSIM",
    how1b: "Профиль привязан к SIM/eSIM устройства — вход без паролей и доверенная личность в каждой групповой сделке.",
    how2t: "Одна локализованная лента",
    how2b: "Товары с AliExpress, Amazon, Temu, eBay и SHEIN в одной ленте — ваш язык, автоконвертация цен в ₸, местные способы оплаты.",
    how3t: "Вступайте в группу и собирайте партию",
    how3b: "Каждой сделке нужен минимум покупателей. Оплата резервируется и не списывается, пока партия не собрана.",
    how4t: "Все платят по опту",
    how4b: "Когда минимальная партия собрана, оптовая цена открывается для всех участников — обычно на 30–40% ниже розницы.",
    visionTitle: "Стратегическое видение",
    visionBody: "Уровень 1 (этот MVP): коллективные покупки с ИИ-рекомендациями, агрегацией маркетплейсов и локализацией. Уровень 2: SIM/eSIM становится полноценным телеком-слоем идентификации — безопасные платежи, привязка аккаунта к устройству и доверенная коммерц-экосистема.",
    gotIt: "Понятно",

    joinToast: "Вы присоединились к групповой покупке",
    unlockToast: "Партия собрана — оптовая цена открыта!",
    resetToast: "Демо сброшено — можно начинать заново",
    liveJoin: "{name} из {city}: вступил(а) в «{title}»",
    yourUnlock: "Ваша группа «{title}» открыла оптовую цену!",

    reasonInterests: "Совпадает с интересами",
    reasonBudget: "Вписывается в бюджет",
    reasonTrending: "В тренде: {city}",
    reasonAlmost: "Почти открыта",

    cat_electronics: "Электроника",
    cat_fashion: "Одежда и обувь",
    cat_home: "Дом и кухня",
    cat_beauty: "Красота",
    cat_sports: "Спорт и отдых",
    cat_gaming: "Гейминг",
    cat_kids: "Детям",
    cat_auto: "Авто",

    city_Almaty: "Алматы",
    city_Astana: "Астана",
    city_Shymkent: "Шымкент",
    city_Karaganda: "Караганда",
    city_Aktobe: "Актобе",
    city_Taraz: "Тараз",
  },
};

// Russian plural category: 1 → one, 2-4 → few, rest → many (with 11-14 exception).
function pluralForm(lang, n) {
  const abs = Math.abs(n);
  if (lang === "ru") {
    const d10 = abs % 10, d100 = abs % 100;
    if (d10 === 1 && d100 !== 11) return "one";
    if (d10 >= 2 && d10 <= 4 && (d100 < 12 || d100 > 14)) return "few";
    return "many";
  }
  return abs === 1 ? "one" : "other";
}

function interpolate(template, vars) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
}

function makeT(lang) {
  const dict = STRINGS[lang] || STRINGS.en;
  const t = (key, vars) => {
    const s = dict[key] != null ? dict[key] : STRINGS.en[key];
    return s != null ? interpolate(s, vars) : key;
  };
  // Plural-aware variant: looks up `${key}_${form}` with a fallback chain.
  t.c = (key, n, vars) => {
    const form = pluralForm(lang, n);
    const tryKeys = [key + "_" + form, key + "_many", key + "_other", key + "_one"];
    for (const k of tryKeys) {
      const s = dict[k] != null ? dict[k] : STRINGS.en[k];
      if (s != null) return interpolate(s, { n, ...(vars || {}) });
    }
    return key;
  };
  return t;
}

window.PROMOXER_I18N = { makeT, LANGS: ["en", "ru"] };
