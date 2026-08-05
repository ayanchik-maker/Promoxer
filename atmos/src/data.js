/* Atmos — mock data, series maths and the EN/RU dictionary.
   Ported verbatim from the Claude Design source (Dashboard.dc.html). */

// Deterministic PRNG so every reload draws the same sensor history.
function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

function makeSeries(base, amp, count, seed) {
  const rnd = seededRandom(seed);
  const pts = [];
  let v = base;
  for (let i = 0; i < count; i++) { v += (rnd() - 0.5) * amp; pts.push(v); }
  return pts;
}

function toPolyline(values, w, h, pad) {
  const min = Math.min(...values), max = Math.max(...values);
  const range = max - min || 1, n = values.length;
  return values.map((v, i) => {
    const x = (i / (n - 1)) * w;
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
}

function toArea(values, w, h, pad) {
  return toPolyline(values, w, h, pad) + ` ${w},${h} 0,${h}`;
}

function convertC(c, unit) { return unit === 'F' ? c * 9 / 5 + 32 : c; }

const THEME = {
  bg: 'oklch(97.5% 0.003 265)',
  cardBg: 'oklch(99.3% 0.002 265)',
  tabBg: 'oklch(99% 0.002 265)',
  borderCol: 'oklch(91% 0.005 265)',
  ink: 'oklch(22% 0.01 265)',
  subtle: 'oklch(55% 0.01 265)',
  accent: 'oklch(58% 0.16 265)',
  humidityColor: 'oklch(60% 0.11 215)',
  warningColor: 'oklch(55% 0.17 55)',
  warningBg: 'oklch(95% 0.05 55)',
  dangerColor: 'oklch(55% 0.19 25)',
  mutedTemp: 'oklch(70% 0.01 265)',
};

const BASE_SENSORS = [
  { id: 'living', name: 'Living Room', iconBg: 'oklch(94% 0.02 265)', tempBase: 21.5, humBase: 44, online: true, seed: 11, signalLabel: 'Strong', battery: 88, shape: 'circle' },
  { id: 'fridge', name: 'Fridge', iconBg: 'oklch(94% 0.03 215)', tempBase: 3.8, humBase: 62, online: true, seed: 22, signalLabel: 'Good', battery: 64, shape: 'diamond' },
  { id: 'greenhouse', name: 'Greenhouse', iconBg: 'oklch(94% 0.03 145)', tempBase: 26.2, humBase: 68, online: true, seed: 33, signalLabel: 'Good', battery: 72, shape: 'triangle' },
  { id: 'bedroom', name: 'Bedroom', iconBg: 'oklch(94% 0.02 300)', tempBase: 22.1, humBase: 40, online: false, seed: 44, signalLabel: 'Weak', battery: 31, shape: 'square' },
];

const DEFAULT_THRESHOLDS = {
  living: { tempMax: 26, humMax: 60 },
  fridge: { tempMax: 6, humMax: 80 },
  greenhouse: { tempMax: 30, humMax: 85 },
  bedroom: { tempMax: 25, humMax: 55 },
};

const NETWORKS = [{ ssid: 'HomeNet-5G' }, { ssid: 'HomeNet-2.4G' }, { ssid: 'Neighbor_WiFi' }];

const STRINGS = {
  en: {
    goodMorning: 'GOOD MORNING', appName: 'Sensors', devicesOnline: 'DEVICES ONLINE', alerts: 'ALERTS',
    offline: 'OFFLINE', aboveLimit: 'ABOVE LIMIT', rooms: 'Rooms', history: 'History', last24h: 'Last 24h',
    min: 'MIN', avg: 'AVG', max: 'MAX', settings: 'Settings', temperatureUnit: 'Temperature Unit',
    notifications: 'Notifications', alertsThresholds: 'Alerts & Thresholds', wifiNetwork: 'Wi-Fi Network',
    appVersion: 'App Version', language: 'Language', thresholds: 'Thresholds', tempMax: 'Temp max',
    humidityMax: 'Humidity max', addDevice: 'Add Device', cancel: 'Cancel', scanning: 'Scanning for devices…',
    makeSure: 'Make sure your sensor is powered on and in pairing mode.',
    selectWifi: 'Select the Wi-Fi network for your new sensor', wifiPassword: 'Wi-Fi password',
    connectBtn: 'Connect', connectingTo: 'Connecting to', deviceConnected: 'Device Connected',
    nameSensor: 'Name this sensor', done: 'Done', noDevicesYet: 'No devices yet',
    activateConnectDesc: 'Activate and connect your first sensor to start monitoring.',
    activateConnectBtn: 'Activate & Connect Sensor', dashboardTab: 'Dashboard', roomsTab: 'Rooms',
    historyTab: 'History', settingsTab: 'Settings', welcomeTitle: 'Welcome to Atmos',
    welcomeSubtitle: 'Monitor temperature & humidity anywhere', continueGoogle: 'Continue with Google',
    or: 'OR', email: 'Email', phone: 'Phone', emailPlaceholder: 'Email address',
    phonePlaceholder: 'Phone number', continueBtn: 'Continue', wifiSignal: 'Wi-Fi Signal',
    battery: 'Battery', firmware: 'Firmware', tempLast24h: 'TEMPERATURE · LAST 24H',
    online: 'Online', disconnected: 'Disconnected', now: 'now', hoursAgo: '2h ago',
    activateSensor: 'Activate Sensor', deactivateSensor: 'Deactivate Sensor',
  },
  ru: {
    goodMorning: 'ДОБРОЕ УТРО', appName: 'Датчики', devicesOnline: 'УСТРОЙСТВА В СЕТИ', alerts: 'ОПОВЕЩЕНИЯ',
    offline: 'НЕ В СЕТИ', aboveLimit: 'ПРЕВЫШЕН ЛИМИТ', rooms: 'Комнаты', history: 'История', last24h: 'За 24 часа',
    min: 'МИН', avg: 'СРЕДН', max: 'МАКС', settings: 'Настройки', temperatureUnit: 'Единица температуры',
    notifications: 'Уведомления', alertsThresholds: 'Оповещения и пороги', wifiNetwork: 'Сеть Wi-Fi',
    appVersion: 'Версия приложения', language: 'Язык', thresholds: 'Пороги', tempMax: 'Макс. темп.',
    humidityMax: 'Макс. влажность', addDevice: 'Добавить устройство', cancel: 'Отмена', scanning: 'Поиск устройств…',
    makeSure: 'Убедитесь, что датчик включён и находится в режиме сопряжения.',
    selectWifi: 'Выберите сеть Wi-Fi для нового датчика', wifiPassword: 'Пароль Wi-Fi',
    connectBtn: 'Подключить', connectingTo: 'Подключение к', deviceConnected: 'Устройство подключено',
    nameSensor: 'Название датчика', done: 'Готово', noDevicesYet: 'Пока нет устройств',
    activateConnectDesc: 'Активируйте и подключите первый датчик, чтобы начать мониторинг.',
    activateConnectBtn: 'Активировать и подключить датчик', dashboardTab: 'Главная', roomsTab: 'Комнаты',
    historyTab: 'История', settingsTab: 'Настройки', welcomeTitle: 'Добро пожаловать в Atmos',
    welcomeSubtitle: 'Следите за температурой и влажностью где угодно', continueGoogle: 'Продолжить с Google',
    or: 'ИЛИ', email: 'Эл. почта', phone: 'Телефон', emailPlaceholder: 'Адрес эл. почты',
    phonePlaceholder: 'Номер телефона', continueBtn: 'Продолжить', wifiSignal: 'Сигнал Wi-Fi',
    battery: 'Батарея', firmware: 'Прошивка', tempLast24h: 'ТЕМПЕРАТУРА · ЗА 24 ЧАСА',
    online: 'В сети', disconnected: 'Отключено', now: 'сейчас', hoursAgo: '2 ч назад',
    activateSensor: 'Активировать датчик', deactivateSensor: 'Деактивировать датчик',
  },
};
