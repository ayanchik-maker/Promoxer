/* Atmos — application state, derived values and routing.
   `renderVals()` is a direct port of the design source's method of the same
   name: it turns raw state into the flat bag of values the screens consume. */

class AtmosApp extends React.Component {
  state = {
    screen: 'login',
    loggedIn: false,
    sensorOnlineOverrides: {},
    loginMode: 'email',
    emailValue: '',
    phoneValue: '',
    language: 'en',
    selectedSensorId: 'living',
    detailFrom: 'dashboard',
    alertsFrom: 'dashboard',
    historySensorId: 'living',
    unit: 'C',
    notificationsOn: true,
    customSensors: [],
    pairingFrom: 'rooms',
    pairingStep: 'scanning',
    pairingNetwork: null,
    pairingPassword: '',
    newDeviceName: '',
    thresholds: { ...DEFAULT_THRESHOLDS },
  };

  timers = [];

  componentWillUnmount() { this.timers.forEach(clearTimeout); }

  // Runs `fn` after `ms`, but only while the pairing flow is still on screen.
  laterWhilePairing(fn, ms) {
    this.timers.push(setTimeout(() => {
      if (this.state.screen === 'pairing') fn();
    }, ms));
  }

  login = () => this.setState({ loggedIn: true, screen: 'dashboard' });
  setModeEmail = () => this.setState({ loginMode: 'email' });
  setModePhone = () => this.setState({ loginMode: 'phone' });
  setEmailValue = (e) => this.setState({ emailValue: e.target.value });
  setPhoneValue = (e) => this.setState({ phoneValue: e.target.value });
  toggleLanguage = () => this.setState(s => ({ language: s.language === 'en' ? 'ru' : 'en' }));
  toggleActivation = (id, current) => this.setState(s => ({ sensorOnlineOverrides: { ...s.sensorOnlineOverrides, [id]: !current } }));

  goDashboard = () => this.setState({ screen: 'dashboard' });
  goRooms = () => this.setState({ screen: 'rooms' });
  goHistory = () => this.setState({ screen: 'history' });
  goSettings = () => this.setState({ screen: 'settings' });
  openDetail = (id) => this.setState(s => ({ selectedSensorId: id, detailFrom: s.screen, screen: 'detail' }));
  back = () => this.setState(s => ({ screen: s.detailFrom || 'dashboard' }));
  openAlerts = () => this.setState(s => ({ alertsFrom: s.screen, screen: 'alerts' }));
  backFromAlerts = () => this.setState(s => ({ screen: s.alertsFrom || 'settings' }));

  toggleUnit = () => this.setState(s => ({ unit: s.unit === 'C' ? 'F' : 'C' }));
  toggleNotifications = () => this.setState(s => ({ notificationsOn: !s.notificationsOn }));
  setThreshold = (id, field, value) => this.setState(s => ({
    thresholds: { ...s.thresholds, [id]: { ...s.thresholds[id], [field]: value } },
  }));

  startPairing = () => {
    this.setState(s => ({ pairingFrom: s.screen, screen: 'pairing', pairingStep: 'scanning' }));
    this.laterWhilePairing(() => this.setState({ pairingStep: 'networks' }), 1400);
  };
  selectNetwork = (ssid) => this.setState({ pairingNetwork: ssid, pairingStep: 'password', pairingPassword: '' });
  setPairingPassword = (e) => this.setState({ pairingPassword: e.target.value });
  connect = () => {
    this.setState({ pairingStep: 'connecting' });
    this.laterWhilePairing(() => this.setState({ pairingStep: 'success', newDeviceName: 'New Sensor' }), 1600);
  };
  setNewDeviceName = (e) => this.setState({ newDeviceName: e.target.value });
  cancelPairing = () => this.setState(s => ({ screen: s.pairingFrom || 'rooms' }));
  finishPairing = () => {
    const id = 'sensor-' + Date.now();
    this.setState(s => ({
      customSensors: [...s.customSensors, {
        id, name: s.newDeviceName || 'New Sensor', iconBg: 'oklch(94% 0.02 30)',
        tempBase: 21, humBase: 45, online: true, seed: Math.floor(Math.random() * 1000),
        signalLabel: 'Good', battery: 100, shape: 'generic',
      }],
      thresholds: { ...s.thresholds, [id]: { tempMax: 28, humMax: 70 } },
      screen: s.pairingFrom || 'rooms',
    }));
  };

  renderVals() {
    const s = this.state;
    const { accent, warningColor, dangerColor, humidityColor, warningBg, subtle,
      borderCol, cardBg, ink, bg, tabBg, mutedTemp } = THEME;
    const unit = s.unit;
    const unitLabel = unit === 'F' ? '°F' : '°C';
    const t = STRINGS[s.language] || STRINGS.en;

    const all = [...BASE_SENSORS, ...s.customSensors];

    const sensors = all.map((raw, i) => {
      const online = s.sensorOnlineOverrides[raw.id] !== undefined ? s.sensorOnlineOverrides[raw.id] : raw.online;
      const r = { ...raw, online };
      const tempSeriesC = makeSeries(r.tempBase, 1.2, 24, r.seed);
      const tempSeries = tempSeriesC.map(v => convertC(v, unit));
      const temp = tempSeries[tempSeries.length - 1];
      const humC = r.humBase + (seededRandom(r.seed + 1)() - 0.5) * 4;
      const threshold = s.thresholds[r.id] || { tempMax: 28, humMax: 70 };
      const thresholdTempDisplayVal = convertC(threshold.tempMax, unit);
      const hasWarning = r.online && temp > thresholdTempDisplayVal;
      const isHistorySelected = s.historySensorId === r.id;

      return {
        id: r.id,
        name: r.name,
        iconBg: r.iconBg,
        online: r.online,
        offline: !r.online,
        statusLabel: r.online ? t.online : t.disconnected,
        updatedLabel: r.online ? t.now : t.hoursAgo,
        wifiColor: r.online ? accent : dangerColor,
        tempDisplay: temp.toFixed(1),
        tempColor: r.online ? (hasWarning ? warningColor : accent) : mutedTemp,
        humidityDisplay: Math.round(humC),
        hasWarning,
        sparklinePoints: toPolyline(tempSeries, 300, 44, 4),
        linePoints: toPolyline(tempSeries, 328, 180, 14),
        areaPoints: toArea(tempSeries, 328, 180, 14),
        min: Math.min(...tempSeries).toFixed(1),
        max: Math.max(...tempSeries).toFixed(1),
        avg: (tempSeries.reduce((a, b) => a + b, 0) / tempSeries.length).toFixed(1),
        signalLabel: r.signalLabel,
        battery: r.battery,
        shape: r.shape,
        activationLabel: r.online ? t.deactivateSensor : t.activateSensor,
        activationBg: r.online ? cardBg : accent,
        activationColor: r.online ? dangerColor : '#fff',
        activationBorder: r.online ? dangerColor : accent,
        onToggleActivation: () => this.toggleActivation(r.id, r.online),
        thresholdTempDisplay: thresholdTempDisplayVal.toFixed(0),
        thresholdTempRaw: threshold.tempMax,
        thresholdHum: threshold.humMax,
        onOpen: () => this.openDetail(r.id),
        onSelectHistory: () => this.setState({ historySensorId: r.id }),
        onTempThreshold: (e) => this.setThreshold(r.id, 'tempMax', Number(e.target.value)),
        onHumThreshold: (e) => this.setThreshold(r.id, 'humMax', Number(e.target.value)),
        entryDelay: `${i * 60}ms`,
        dotPulse: r.online ? 'pulseGlow 2s ease-in-out infinite' : 'none',
        chipBg: isHistorySelected ? accent : cardBg,
        chipColor: isHistorySelected ? '#fff' : ink,
        chipBorder: isHistorySelected ? accent : borderCol,
      };
    });

    const onlineCount = sensors.filter(x => x.online).length;
    const alertCount = sensors.filter(x => x.hasWarning).length;
    const detailSensor = sensors.find(x => x.id === s.selectedSensorId) || sensors[0];
    const historySensor = sensors.find(x => x.id === s.historySensorId) || sensors[0];

    const screen = s.screen;
    // With no sensors paired, the browsing tabs give way to the empty state.
    const isEmpty = sensors.length === 0 && ['dashboard', 'rooms', 'history'].includes(screen);

    return {
      t, language: s.language, toggleLanguage: this.toggleLanguage,
      langENBg: s.language === 'en' ? '#fff' : 'transparent', langENColor: s.language === 'en' ? ink : subtle,
      langRUBg: s.language === 'ru' ? '#fff' : 'transparent', langRUColor: s.language === 'ru' ? ink : subtle,
      bg, cardBg, borderCol, ink, subtle, tabBg,
      accent, humidityColor, warningColor, dangerColor, warningBg, unitLabel,
      sensors, onlineCount, totalCount: sensors.length, alertCount,
      alertCountColor: alertCount > 0 ? warningColor : ink,
      detailSensor, historySensor,

      isDashboard: screen === 'dashboard' && !isEmpty,
      isRooms: screen === 'rooms' && !isEmpty,
      isHistory: screen === 'history' && !isEmpty,
      isSettings: screen === 'settings',
      isDetail: screen === 'detail',
      isAlerts: screen === 'alerts',
      isPairing: screen === 'pairing',
      isLogin: screen === 'login',
      isActivate: isEmpty,
      showTabs: ['dashboard', 'rooms', 'history', 'settings'].includes(screen),

      loginWithGoogle: this.login, continueWithCredential: this.login,
      isEmailMode: s.loginMode === 'email', isPhoneMode: s.loginMode === 'phone',
      emailModeBg: s.loginMode === 'email' ? '#fff' : 'transparent', emailModeColor: s.loginMode === 'email' ? ink : subtle,
      phoneModeBg: s.loginMode === 'phone' ? '#fff' : 'transparent', phoneModeColor: s.loginMode === 'phone' ? ink : subtle,
      setModeEmail: this.setModeEmail, setModePhone: this.setModePhone,
      emailValue: s.emailValue, phoneValue: s.phoneValue,
      setEmailValue: this.setEmailValue, setPhoneValue: this.setPhoneValue,

      tabDashboardColor: screen === 'dashboard' ? accent : subtle,
      tabRoomsColor: screen === 'rooms' ? accent : subtle,
      tabHistoryColor: screen === 'history' ? accent : subtle,
      tabSettingsColor: screen === 'settings' ? accent : subtle,
      goDashboard: this.goDashboard, goRooms: this.goRooms, goHistory: this.goHistory,
      goSettings: this.goSettings, goSettingsFromAvatar: this.goSettings,
      openAlerts: this.openAlerts, back: this.back, backFromAlerts: this.backFromAlerts,

      unitCBg: unit === 'C' ? '#fff' : 'transparent', unitCColor: unit === 'C' ? ink : subtle,
      unitFBg: unit === 'F' ? '#fff' : 'transparent', unitFColor: unit === 'F' ? ink : subtle,
      toggleUnit: this.toggleUnit,
      notifTrackColor: s.notificationsOn ? accent : borderCol,
      notifKnobLeft: s.notificationsOn ? '20px' : '2px',
      toggleNotifications: this.toggleNotifications,

      isPairScanning: s.pairingStep === 'scanning', isPairNetworks: s.pairingStep === 'networks',
      isPairPassword: s.pairingStep === 'password', isPairConnecting: s.pairingStep === 'connecting',
      isPairSuccess: s.pairingStep === 'success',
      networks: NETWORKS.map(n => ({ ssid: n.ssid, onSelect: () => this.selectNetwork(n.ssid) })),
      pairingNetwork: s.pairingNetwork, pairingPassword: s.pairingPassword, newDeviceName: s.newDeviceName,
      connectEnabledBg: accent,
      startPairing: this.startPairing, cancelPairing: this.cancelPairing, connect: this.connect,
      finishPairing: this.finishPairing, setPairingPassword: this.setPairingPassword,
      setNewDeviceName: this.setNewDeviceName,
    };
  }

  render() {
    const v = this.renderVals();
    return (
      <IOSDevice>
        <div style={{
          height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0,
          paddingTop: 'var(--safe-top, 0px)', background: v.bg,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
          color: v.ink,
        }}>
          {v.isLogin && <LoginScreen v={v} />}
          {v.isDashboard && <DashboardScreen v={v} />}
          {v.isRooms && <RoomsScreen v={v} />}
          {v.isHistory && <HistoryScreen v={v} />}
          {v.isSettings && <SettingsScreen v={v} />}
          {v.isDetail && <DetailScreen v={v} />}
          {v.isAlerts && <AlertsScreen v={v} />}
          {v.isPairing && <PairingScreen v={v} />}
          {v.isActivate && <ActivateScreen v={v} />}
          {v.showTabs && <TabBar v={v} />}
        </div>
      </IOSDevice>
    );
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(<AtmosApp />);
