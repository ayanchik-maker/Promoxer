/* Atmos screens — one component per <sc-if> block in the design source.
   Each receives the computed value bag `v` (see renderVals in app.jsx). */

// ─────────────────────────────────────────────────────────────
// Shared bits
// ─────────────────────────────────────────────────────────────

function SensorIcon({ shape, color }) {
  switch (shape) {
    case 'circle': // house
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M3 11.5L12 4L21 11.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 10V20H19V10" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 20V14H14V20" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'diamond': // fridge
      return (
        <svg width="16" height="18" viewBox="0 0 20 24" fill="none">
          <rect x="3" y="2" width="14" height="20" rx="2" stroke={color} strokeWidth="1.8" />
          <line x1="3" y1="10" x2="17" y2="10" stroke={color} strokeWidth="1.8" />
          <line x1="6.5" y1="5" x2="6.5" y2="7" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <line x1="6.5" y1="13" x2="6.5" y2="15" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'triangle': // plant
      return (
        <svg width="17" height="18" viewBox="0 0 22 24" fill="none">
          <path d="M11 22C11 22 4 16.5 4 10.5C4 6.5 7.5 3 11 2C11 6 13 8 13 8" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11 22C11 22 18 16.5 18 10.5C18 8.6 17.2 6.9 16 5.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="11" y1="13" x2="11" y2="22" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'square': // bed
      return (
        <svg width="19" height="16" viewBox="0 0 24 20" fill="none">
          <path d="M2 18V11C2 9.3 3.3 8 5 8H19C20.7 8 22 9.3 22 11V18" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 15H22" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M4 8V5C4 3.9 4.9 3 6 3H10C11.1 3 12 3.9 12 5V8" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default: // generic sensor
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" fill={color} />
          <path d="M6 12C6 8.7 8.7 6 12 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M18 12C18 15.3 15.3 18 12 18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M3 12C3 7 7 3 12 3" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
          <path d="M21 12C21 17 17 21 12 21" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
        </svg>
      );
  }
}

function Chevron({ color }) {
  return (
    <svg width="7" height="12" viewBox="0 0 7 12" style={{ flexShrink: 0 }}>
      <path d="M1 1L6 6L1 11" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BackChevron({ color }) {
  return (
    <svg width="9" height="16" viewBox="0 0 9 16">
      <path d="M8 1L1 8L8 15" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Min / avg / max footer shared by the history and detail charts.
function StatsRow({ v, sensor }) {
  const cell = (label, value) => (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '10.5px', color: v.subtle, fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 16, fontWeight: 600, marginTop: 2 }}>{value}{v.unitLabel}</div>
    </div>
  );
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 14, paddingTop: 14, borderTop: `1px solid ${v.borderCol}` }}>
      {cell(v.t.min, sensor.min)}
      {cell(v.t.avg, sensor.avg)}
      {cell(v.t.max, sensor.max)}
    </div>
  );
}

function TrendChart({ sensor }) {
  return (
    <svg width="100%" height="180" viewBox="0 0 328 180" preserveAspectRatio="none">
      <polygon points={sensor.areaPoints} fill={sensor.tempColor} opacity="0.08" style={{ animation: 'fadeSlideUp 0.5s ease both' }} />
      <polyline points={sensor.linePoints} pathLength="1" fill="none" stroke={sensor.tempColor} strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: 1, animation: 'dash 1.3s ease-out both' }} />
    </svg>
  );
}

const scrollArea = { flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' };

// ─────────────────────────────────────────────────────────────
// Welcome / login
// ─────────────────────────────────────────────────────────────

function LoginScreen({ v }) {
  const inputStyle = {
    width: '100%', boxSizing: 'border-box', padding: '13px 14px', borderRadius: 12,
    border: `1px solid ${v.borderCol}`, fontSize: '14.5px', background: v.cardBg, color: v.ink,
  };
  return (
    <div style={{ ...scrollArea, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 22 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.03em', animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }}>{v.t.welcomeTitle}</div>
        <div style={{ fontSize: '13.5px', color: v.subtle, marginTop: 6 }}>{v.t.welcomeSubtitle}</div>
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="press-97" onClick={v.loginWithGoogle} style={{
          width: '100%', boxSizing: 'border-box', background: '#fff', border: `1px solid ${v.borderCol}`,
          borderRadius: 14, padding: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 10, fontSize: '14.5px', fontWeight: 600, color: v.ink, cursor: 'pointer', transition: 'transform 0.15s',
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62z" />
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 0 0 9 18z" />
            <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.96H.98A9 9 0 0 0 0 9c0 1.45.35 2.83.98 4.04l2.97-2.33z" />
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .98 4.96l2.97 2.34C4.66 5.17 6.65 3.58 9 3.58z" />
          </svg>
          {v.t.continueGoogle}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '2px 0' }}>
          <div style={{ flex: 1, height: 1, background: v.borderCol }} />
          <div style={{ fontSize: '11.5px', color: v.subtle, fontWeight: 600 }}>{v.t.or}</div>
          <div style={{ flex: 1, height: 1, background: v.borderCol }} />
        </div>

        <div style={{ display: 'flex', background: v.borderCol, borderRadius: 10, padding: 2 }}>
          <div onClick={v.setModeEmail} style={{ flex: 1, textAlign: 'center', padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: v.emailModeBg, color: v.emailModeColor }}>{v.t.email}</div>
          <div onClick={v.setModePhone} style={{ flex: 1, textAlign: 'center', padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: v.phoneModeBg, color: v.phoneModeColor }}>{v.t.phone}</div>
        </div>

        {v.isEmailMode
          ? <input type="email" placeholder={v.t.emailPlaceholder} value={v.emailValue} onChange={v.setEmailValue} style={inputStyle} />
          : <input type="tel" placeholder={v.t.phonePlaceholder} value={v.phoneValue} onChange={v.setPhoneValue} style={inputStyle} />}

        <div className="press-97" onClick={v.continueWithCredential} style={{
          width: '100%', boxSizing: 'border-box', background: v.accent, color: '#fff', textAlign: 'center',
          padding: 13, borderRadius: 14, fontSize: '14.5px', fontWeight: 600, cursor: 'pointer', transition: 'transform 0.15s',
        }}>{v.t.continueBtn}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────────────────────

function DashboardScreen({ v }) {
  return (
    <React.Fragment>
      <div style={{ padding: '8px 20px 4px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', animation: 'fadeSlideUp 0.35s ease both' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: v.subtle, letterSpacing: '0.02em' }}>{v.t.goodMorning}</div>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 2 }}>{v.t.appName}</div>
        </div>
        <div className="press-90" onClick={v.goSettingsFromAvatar} style={{
          width: 36, height: 36, borderRadius: '50%', background: v.cardBg, border: `1px solid ${v.borderCol}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.15s',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: v.accent }} />
        </div>
      </div>

      <div style={{ padding: '14px 20px 6px', display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, background: v.cardBg, border: `1px solid ${v.borderCol}`, borderRadius: 16, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontSize: 11, color: v.subtle, fontWeight: 600, letterSpacing: '0.03em' }}>{v.t.devicesOnline}</div>
          <div style={{ fontSize: 20, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
            {v.onlineCount}<span style={{ fontSize: 13, color: v.subtle, fontWeight: 500 }}> / {v.totalCount}</span>
          </div>
        </div>
        <div onClick={v.openAlerts} style={{ flex: 1, background: v.cardBg, border: `1px solid ${v.borderCol}`, borderRadius: 16, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 2, cursor: 'pointer' }}>
          <div style={{ fontSize: 11, color: v.subtle, fontWeight: 600, letterSpacing: '0.03em' }}>{v.t.alerts}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: v.alertCountColor, fontVariantNumeric: 'tabular-nums' }}>{v.alertCount}</div>
        </div>
      </div>

      <div style={{ ...scrollArea, padding: '10px 20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {v.sensors.map(s => (
          <div key={s.id} className="press-97" onClick={s.onOpen} style={{
            background: v.cardBg, border: `1px solid ${v.borderCol}`, borderRadius: 20, padding: 16,
            display: 'flex', flexDirection: 'column', gap: 12, cursor: 'pointer',
            animation: 'fadeSlideUp 0.45s ease both', animationDelay: s.entryDelay, transition: 'transform 0.15s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: s.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: s.dotPulse }}>
                  <SensorIcon shape={s.shape} color={s.tempColor} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{s.name}</div>
                  <div style={{ fontSize: '11.5px', color: v.subtle, display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
                    <span>{s.statusLabel}</span><span>·</span><span>{s.updatedLabel}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {s.online ? (
                  <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
                    <path d="M1 4.5C4.5 1 10.5 1 14 4.5" stroke={s.wifiColor} strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M3.5 7C5.8 4.8 9.2 4.8 11.5 7" stroke={s.wifiColor} strokeWidth="1.6" strokeLinecap="round" />
                    <circle cx="7.5" cy="10" r="1.3" fill={s.wifiColor} />
                  </svg>
                ) : (
                  <span style={{ fontSize: 11, color: v.dangerColor, fontWeight: 600 }}>{v.t.offline}</span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                <span style={{ fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace", fontSize: 32, fontWeight: 600, letterSpacing: '-0.01em', color: s.tempColor }}>{s.tempDisplay}</span>
                <span style={{ fontSize: 16, color: v.subtle, fontWeight: 500 }}>{v.unitLabel}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, paddingBottom: 3 }}>
                <span style={{ fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace", fontSize: 17, fontWeight: 600, color: v.humidityColor }}>{s.humidityDisplay}</span>
                <span style={{ fontSize: '12.5px', color: v.subtle }}>% RH</span>
              </div>
              <div style={{ flex: 1 }} />
              {s.hasWarning && (
                <div style={{ fontSize: '10.5px', fontWeight: 700, color: v.warningColor, background: v.warningBg, padding: '3px 8px', borderRadius: 20, letterSpacing: '0.02em', animation: 'pulseGlow 1.6s ease-in-out infinite' }}>{v.t.aboveLimit}</div>
              )}
            </div>

            <div style={{ height: 44, width: '100%' }}>
              <svg width="100%" height="44" viewBox="0 0 300 44" preserveAspectRatio="none">
                <polyline points={s.sparklinePoints} pathLength="1" fill="none" stroke={s.tempColor} strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: 1, animation: 'dash 1.1s ease-out both' }} />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}

// ─────────────────────────────────────────────────────────────
// Rooms / device list
// ─────────────────────────────────────────────────────────────

function RoomsScreen({ v }) {
  return (
    <React.Fragment>
      <div style={{ padding: '14px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: 'fadeSlideUp 0.35s ease both' }}>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }}>{v.t.rooms}</div>
        <div className="press-90" onClick={v.startPairing} style={{ width: 34, height: 34, borderRadius: '50%', background: v.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.15s' }}>
          <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 1V15M1 8H15" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </div>
      </div>
      <div style={{ ...scrollArea, padding: '6px 20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {v.sensors.map(s => (
          <div key={s.id} className="press-97" onClick={s.onOpen} style={{
            background: v.cardBg, border: `1px solid ${v.borderCol}`, borderRadius: 16, padding: '12px 14px',
            display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'transform 0.15s',
          }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: s.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: s.dotPulse }}>
              <SensorIcon shape={s.shape} color={s.wifiColor} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{s.name}</div>
              <div style={{ fontSize: '11.5px', color: v.subtle, marginTop: 1 }}>{s.statusLabel}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace", fontSize: 16, fontWeight: 600, color: s.tempColor }}>{s.tempDisplay}{v.unitLabel}</div>
              <div style={{ fontSize: 11, color: v.subtle }}>{s.humidityDisplay}% RH</div>
            </div>
            <Chevron color={v.subtle} />
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}

// ─────────────────────────────────────────────────────────────
// History
// ─────────────────────────────────────────────────────────────

function HistoryScreen({ v }) {
  return (
    <React.Fragment>
      <div style={{ padding: '14px 20px 8px', animation: 'fadeSlideUp 0.35s ease both' }}>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 }}>{v.t.history}</div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
          {v.sensors.map(s => (
            <div key={s.id} onClick={s.onSelectHistory} style={{
              padding: '7px 13px', borderRadius: 20, fontSize: '12.5px', fontWeight: 600, whiteSpace: 'nowrap',
              cursor: 'pointer', background: s.chipBg, color: s.chipColor, border: `1px solid ${s.chipBorder}`,
            }}>{s.name}</div>
          ))}
        </div>
      </div>
      <div style={{ ...scrollArea, padding: '6px 20px 24px' }}>
        <div style={{ background: v.cardBg, border: `1px solid ${v.borderCol}`, borderRadius: 20, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{v.historySensor.name}</div>
            <div style={{ fontSize: '11.5px', color: v.subtle }}>{v.t.last24h}</div>
          </div>
          <TrendChart sensor={v.historySensor} />
          <StatsRow v={v} sensor={v.historySensor} />
        </div>
      </div>
    </React.Fragment>
  );
}

// ─────────────────────────────────────────────────────────────
// Settings
// ─────────────────────────────────────────────────────────────

function SettingsScreen({ v }) {
  const rowBase = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' };
  const divided = { ...rowBase, borderBottom: `1px solid ${v.borderCol}` };
  const seg = (label, bg, color) => (
    <div style={{ padding: '5px 12px', borderRadius: 8, fontSize: '12.5px', fontWeight: 600, background: bg, color }}>{label}</div>
  );
  return (
    <React.Fragment>
      <div style={{ padding: '14px 20px 8px', animation: 'fadeSlideUp 0.35s ease both' }}>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }}>{v.t.settings}</div>
      </div>
      <div style={{ ...scrollArea, padding: '6px 20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ background: v.cardBg, border: `1px solid ${v.borderCol}`, borderRadius: 16, padding: '4px 14px' }}>
          <div style={divided}>
            <div style={{ fontSize: '14.5px', fontWeight: 500 }}>{v.t.temperatureUnit}</div>
            <div onClick={v.toggleUnit} style={{ display: 'flex', background: v.borderCol, borderRadius: 10, padding: 2, cursor: 'pointer' }}>
              {seg('°C', v.unitCBg, v.unitCColor)}
              {seg('°F', v.unitFBg, v.unitFColor)}
            </div>
          </div>
          <div style={divided}>
            <div style={{ fontSize: '14.5px', fontWeight: 500 }}>{v.t.notifications}</div>
            <div onClick={v.toggleNotifications} style={{ width: 44, height: 26, borderRadius: 14, background: v.notifTrackColor, position: 'relative', cursor: 'pointer', transition: 'background 0.15s' }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: v.notifKnobLeft, boxShadow: '0 1px 2px rgba(0,0,0,0.25)', transition: 'left 0.15s' }} />
            </div>
          </div>
          <div style={{ ...divided, cursor: 'pointer' }} onClick={v.openAlerts}>
            <div style={{ fontSize: '14.5px', fontWeight: 500 }}>{v.t.alertsThresholds}</div>
            <Chevron color={v.subtle} />
          </div>
          <div style={rowBase}>
            <div style={{ fontSize: '14.5px', fontWeight: 500 }}>{v.t.language}</div>
            <div onClick={v.toggleLanguage} style={{ display: 'flex', background: v.borderCol, borderRadius: 10, padding: 2, cursor: 'pointer' }}>
              {seg('EN', v.langENBg, v.langENColor)}
              {seg('RU', v.langRUBg, v.langRUColor)}
            </div>
          </div>
        </div>

        <div style={{ background: v.cardBg, border: `1px solid ${v.borderCol}`, borderRadius: 16, padding: '4px 14px' }}>
          <div style={divided}>
            <div style={{ fontSize: '14.5px', fontWeight: 500 }}>{v.t.wifiNetwork}</div>
            <div style={{ fontSize: '13.5px', color: v.subtle }}>HomeNet-5G</div>
          </div>
          <div style={rowBase}>
            <div style={{ fontSize: '14.5px', fontWeight: 500 }}>{v.t.appVersion}</div>
            <div style={{ fontSize: '13.5px', color: v.subtle }}>1.4.2</div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

// ─────────────────────────────────────────────────────────────
// Sensor detail
// ─────────────────────────────────────────────────────────────

function DetailScreen({ v }) {
  const d = v.detailSensor;
  const metaRow = (label, value) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ fontSize: '13.5px', color: v.subtle }}>{label}</div>
      <div style={{ fontSize: '13.5px', fontWeight: 600 }}>{value}</div>
    </div>
  );
  return (
    <React.Fragment>
      <div style={{ padding: '14px 20px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: 'fadeSlideUp 0.35s ease both' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={v.back}>
          <BackChevron color={v.ink} />
          <div style={{ fontSize: 17, fontWeight: 600 }}>{d.name}</div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: v.accent, cursor: 'pointer' }} onClick={v.openAlerts}>{v.t.thresholds}</div>
      </div>

      <div style={{ ...scrollArea, padding: '14px 20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: v.cardBg, border: `1px solid ${v.borderCol}`, borderRadius: 20, padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 12, color: v.subtle, fontWeight: 600 }}>{d.statusLabel} · {d.updatedLabel}</div>
            {d.hasWarning && (
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: v.warningColor, background: v.warningBg, padding: '3px 8px', borderRadius: 20 }}>{v.t.aboveLimit}</div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace", fontSize: 48, fontWeight: 600, letterSpacing: '-0.02em', color: d.tempColor }}>{d.tempDisplay}</span>
              <span style={{ fontSize: 20, color: v.subtle, fontWeight: 500 }}>{v.unitLabel}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, paddingBottom: 5 }}>
              <span style={{ fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace", fontSize: 20, fontWeight: 600, color: v.humidityColor }}>{d.humidityDisplay}</span>
              <span style={{ fontSize: 13, color: v.subtle }}>% RH</span>
            </div>
          </div>
        </div>

        <div style={{ background: v.cardBg, border: `1px solid ${v.borderCol}`, borderRadius: 20, padding: 18 }}>
          <div style={{ fontSize: '12.5px', fontWeight: 600, color: v.subtle, marginBottom: 12 }}>{v.t.tempLast24h}</div>
          <TrendChart sensor={d} />
          <StatsRow v={v} sensor={d} />
        </div>

        <div style={{ background: v.cardBg, border: `1px solid ${v.borderCol}`, borderRadius: 20, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {metaRow(v.t.wifiSignal, d.signalLabel)}
          {metaRow(v.t.battery, d.battery + '%')}
          {metaRow(v.t.firmware, 'v2.1.0')}
        </div>

        <div className="press-97" onClick={d.onToggleActivation} style={{
          background: d.activationBg, color: d.activationColor, textAlign: 'center', padding: 14,
          borderRadius: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer',
          border: `1px solid ${d.activationBorder}`, transition: 'transform 0.15s',
        }}>{d.activationLabel}</div>
      </div>
    </React.Fragment>
  );
}

// ─────────────────────────────────────────────────────────────
// Alerts & thresholds
// ─────────────────────────────────────────────────────────────

function AlertsScreen({ v }) {
  return (
    <React.Fragment>
      <div onClick={v.backFromAlerts} style={{ padding: '14px 20px 4px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', animation: 'fadeSlideUp 0.35s ease both' }}>
        <BackChevron color={v.ink} />
        <div style={{ fontSize: 17, fontWeight: 600 }}>{v.t.alertsThresholds}</div>
      </div>
      <div style={{ ...scrollArea, padding: '14px 20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {v.sensors.map(s => (
          <div key={s.id} style={{ background: v.cardBg, border: `1px solid ${v.borderCol}`, borderRadius: 18, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: '14.5px', fontWeight: 600 }}>{s.name}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: v.subtle }}>
                <span>{v.t.tempMax}</span>
                <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 600, color: v.ink }}>{s.thresholdTempDisplay}{v.unitLabel}</span>
              </div>
              <input type="range" min="0" max="40" step="1" value={s.thresholdTempRaw} onChange={s.onTempThreshold} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: v.subtle }}>
                <span>{v.t.humidityMax}</span>
                <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 600, color: v.ink }}>{s.thresholdHum}%</span>
              </div>
              <input type="range" min="0" max="100" step="1" value={s.thresholdHum} onChange={s.onHumThreshold} />
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}

// ─────────────────────────────────────────────────────────────
// Pairing flow
// ─────────────────────────────────────────────────────────────

function PairingScreen({ v }) {
  const spinner = (
    <div style={{ width: 72, height: 72, borderRadius: '50%', border: `3px solid ${v.borderCol}`, borderTopColor: v.accent, animation: 'spin 0.9s linear infinite' }} />
  );
  const centered = { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 20 };
  const inputStyle = {
    width: '100%', boxSizing: 'border-box', padding: '13px 14px', borderRadius: 12,
    border: `1px solid ${v.borderCol}`, fontSize: '14.5px', background: v.cardBg, color: v.ink,
  };

  return (
    <React.Fragment>
      <div style={{ padding: '14px 20px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 17, fontWeight: 600 }}>{v.t.addDevice}</div>
        <div onClick={v.cancelPairing} style={{ fontSize: '13.5px', fontWeight: 600, color: v.subtle, cursor: 'pointer' }}>{v.t.cancel}</div>
      </div>

      {v.isPairScanning && (
        <div style={centered}>
          {spinner}
          <div style={{ fontSize: 15, fontWeight: 600 }}>{v.t.scanning}</div>
          <div style={{ fontSize: '12.5px', color: v.subtle, textAlign: 'center', maxWidth: 220 }}>{v.t.makeSure}</div>
        </div>
      )}

      {v.isPairNetworks && (
        <React.Fragment>
          <div style={{ padding: '8px 20px', fontSize: 13, color: v.subtle }}>{v.t.selectWifi}</div>
          <div style={{ ...scrollArea, padding: '6px 20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {v.networks.map(n => (
              <div key={n.ssid} className="press-97" onClick={n.onSelect} style={{
                background: v.cardBg, border: `1px solid ${v.borderCol}`, borderRadius: 14, padding: '14px 16px',
                display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'transform 0.15s',
              }}>
                <svg width="18" height="14" viewBox="0 0 18 14">
                  <path d="M1 5.5C5.5 1 12.5 1 17 5.5" stroke={v.accent} strokeWidth="1.8" fill="none" strokeLinecap="round" />
                  <path d="M4 8.5C6.8 6 11.2 6 14 8.5" stroke={v.accent} strokeWidth="1.8" fill="none" strokeLinecap="round" />
                  <circle cx="9" cy="12" r="1.5" fill={v.accent} />
                </svg>
                <div style={{ flex: 1, fontSize: '14.5px', fontWeight: 500 }}>{n.ssid}</div>
                <Chevron color={v.subtle} />
              </div>
            ))}
          </div>
        </React.Fragment>
      )}

      {v.isPairPassword && (
        <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{v.pairingNetwork}</div>
          <input type="password" placeholder={v.t.wifiPassword} value={v.pairingPassword} onChange={v.setPairingPassword} style={inputStyle} />
          <div style={{ flex: 1 }} />
          <div className="press-97" onClick={v.connect} style={{
            background: v.connectEnabledBg, color: '#fff', textAlign: 'center', padding: 14,
            borderRadius: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'transform 0.15s',
          }}>{v.t.connectBtn}</div>
        </div>
      )}

      {v.isPairConnecting && (
        <div style={centered}>
          {spinner}
          <div style={{ fontSize: 15, fontWeight: 600 }}>{v.t.connectingTo} {v.pairingNetwork}…</div>
        </div>
      )}

      {v.isPairSuccess && (
        <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', minHeight: 0 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: v.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 20, animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }}>
            <svg width="26" height="20" viewBox="0 0 26 20">
              <path d="M1 10L9 18L25 1" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round"
                pathLength="1" style={{ strokeDasharray: 1, animation: 'dash 0.5s 0.15s ease-out both' }} />
            </svg>
          </div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>{v.t.deviceConnected}</div>
          <input type="text" placeholder={v.t.nameSensor} value={v.newDeviceName} onChange={v.setNewDeviceName} style={{ ...inputStyle, textAlign: 'center' }} />
          <div style={{ flex: 1 }} />
          <div className="press-97" onClick={v.finishPairing} style={{
            width: '100%', boxSizing: 'border-box', background: v.accent, color: '#fff', textAlign: 'center',
            padding: 14, borderRadius: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'transform 0.15s',
          }}>{v.t.done}</div>
        </div>
      )}
    </React.Fragment>
  );
}

// ─────────────────────────────────────────────────────────────
// Empty state
// ─────────────────────────────────────────────────────────────

function ActivateScreen({ v }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 20 }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: v.cardBg, border: `1px solid ${v.borderCol}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M3 11.5L12 4L21 11.5" stroke={v.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 10V20H19V10" stroke={v.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 19, fontWeight: 700 }}>{v.t.noDevicesYet}</div>
        <div style={{ fontSize: 13, color: v.subtle, marginTop: 4, maxWidth: 240 }}>{v.t.activateConnectDesc}</div>
      </div>
      <div className="press-97" onClick={v.startPairing} style={{
        background: v.accent, color: '#fff', padding: '14px 24px', borderRadius: 14,
        fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'transform 0.15s',
      }}>{v.t.activateConnectBtn}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab bar
// ─────────────────────────────────────────────────────────────

function TabBar({ v }) {
  const tab = (color, onClick, label, glyph) => (
    <div className="press-88" onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
      color, cursor: 'pointer', transition: 'transform 0.15s',
    }}>
      {glyph}
      <span style={{ fontSize: 10, fontWeight: 600 }}>{label}</span>
    </div>
  );
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      padding: '10px 12px calc(var(--safe-bottom, 0px) + 8px)',
      borderTop: `1px solid ${v.borderCol}`, background: v.tabBg,
    }}>
      {tab(v.tabDashboardColor, v.goDashboard, v.t.dashboardTab,
        <div style={{ width: 22, height: 22, borderRadius: 6, background: v.tabDashboardColor }} />)}
      {tab(v.tabRoomsColor, v.goRooms, v.t.roomsTab,
        <svg width="20" height="20" viewBox="0 0 20 20"><path d="M10 2 L18 10 L18 18 H2 V10 Z" fill="none" stroke={v.tabRoomsColor} strokeWidth="1.6" /></svg>)}
      {tab(v.tabHistoryColor, v.goHistory, v.t.historyTab,
        <svg width="20" height="20" viewBox="0 0 20 20">
          <path d="M10 1 A9 9 0 1 1 9.9 1" fill="none" stroke={v.tabHistoryColor} strokeWidth="1.6" />
          <path d="M10 5 V10 L13 12.5" stroke={v.tabHistoryColor} strokeWidth="1.6" strokeLinecap="round" fill="none" />
        </svg>)}
      {tab(v.tabSettingsColor, v.goSettings, v.t.settingsTab,
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
          <path d="M12 8.5A3.5 3.5 0 1 0 12 15.5A3.5 3.5 0 1 0 12 8.5Z" stroke={v.tabSettingsColor} strokeWidth="1.7" />
          <path d="M12 2V4.5M12 19.5V22M4.9 4.9L6.7 6.7M17.3 17.3L19.1 19.1M2 12H4.5M19.5 12H22M4.9 19.1L6.7 17.3M17.3 6.7L19.1 4.9" stroke={v.tabSettingsColor} strokeWidth="1.7" strokeLinecap="round" />
        </svg>)}
    </div>
  );
}
