/* Promoxer — reusable presentational components (JSX, compiled in-browser).
   Hooks are destructured once here and shared across the later scripts. */
const { useState, useEffect, useMemo, useRef } = React;

const DATA = window.PROMOXER_DATA;
const RECO = window.PROMOXER_RECO;
const I18N = window.PROMOXER_I18N;

function Icon({ name, size = 20, className = "" }) {
  const common = {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round",
    className: "svg-icon " + className, "aria-hidden": "true"
  };
  const icons = {
    back: <><path d="M15 18l-6-6 6-6"/><path d="M9 12h10"/></>,
    check: <path d="M5 12.5l4.2 4.2L19 7"/>,
    celebrate: <><path d="M4 20l5-14 9 9-14 5z"/><path d="M13 5l1-2M18 8l3-1M16 3l1-1M20 12l2 1"/></>,
    trending: <><path d="M13.5 3.5c.7 3-1.3 4.5-3 6.2-1.8 1.8-2.6 3.8-1.4 6.1"/><path d="M15.8 9.2c2.5 2 3.1 5.4 1.3 8-2.1 3-6.5 3.5-9.2 1-2.9-2.8-1.9-7 .5-9.4"/></>,
    arrow: <><path d="M5 12h14"/><path d="M14 7l5 5-5 5"/></>,
    groups: <><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3.5 19c.5-3.4 2.3-5 5.5-5s5 1.6 5.5 5M15 14.5c3.2-.5 5.1 1 5.5 4.5"/></>,
    user: <><circle cx="12" cy="8" r="3.5"/><path d="M5.5 20c.5-4 2.7-6 6.5-6s6 2 6.5 6"/></>,
    feed: <><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8 9h8M8 13h5"/></>,
    reset: <><path d="M5 8V4l-3 3 3 3V8a8 8 0 1 1-1 7"/><path d="M12 8v5l3 2"/></>,
    identity: <><rect x="4" y="6" width="16" height="13" rx="3"/><circle cx="9" cy="12" r="2"/><path d="M6.5 16c.5-1.5 1.3-2.2 2.5-2.2s2 .7 2.5 2.2M14 10h3M14 14h3"/><path d="M8 6V4h8v2"/></>,
    scan: <><path d="M8 3H4v4M16 3h4v4M8 21H4v-4M16 21h4v-4"/><path d="M8 12h8M10 9v6M14 9v6"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="M16.2 16.2L21 21"/></>,
    close: <><path d="M6 6l12 12M18 6L6 18"/></>,
    share: <><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.3 10.8l7.4-4.5M8.3 13.2l7.4 4.5"/></>,
    spark: <><path d="M12 2l1.5 5.2L19 9l-5.5 1.8L12 16l-1.5-5.2L5 9l5.5-1.8L12 2z"/><path d="M19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15z"/></>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/></>,
    shield: <><path d="M12 3l7 3v5c0 4.5-3 8.4-7 10-4-1.6-7-5.5-7-10V6l7-3z"/><path d="M9 12l2 2 4-4"/></>,
    wallet: <><path d="M3 7a2 2 0 0 1 2-2h13v3"/><path d="M3 7v10a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1H5a2 2 0 0 1-2-2z"/><circle cx="16.5" cy="14.5" r="1" fill="currentColor"/></>,
    bank: <><path d="M3 9l9-5 9 5"/><path d="M4 9h16M5 9v8M9.5 9v8M14.5 9v8M19 9v8M3 17h18M2 20h20"/></>,
    cardpay: <><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18M6.5 15h4"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5h.01"/></>,
    timer: <><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.6 2M9 2.5h6"/></>,
    phone: <><rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M10 5h4M11 18.5h2"/></>,
    shoe: <><path d="M4 15c3.5-.2 5-2.2 6-6l3 3c1.5 1.5 3.5 2.3 6 2.5 1.4.2 1.8 3.5-.2 4H6c-2.2 0-3.2-1.2-2-3.5z"/><path d="M10 12l2 2M13 13l1.5 1.5"/></>,
    home: <><path d="M3 11l9-7 9 7"/><path d="M5.5 9.5V20h13V9.5M9.5 20v-6h5v6"/></>,
    beauty: <><path d="M9 3h6v4l2 3v10H7V10l2-3V3z"/><path d="M9 7h6M9 13h6"/></>,
    ball: <><circle cx="12" cy="12" r="9"/><path d="M8 4.2c3 3.2 5 8 5 16M4 9c5 .2 10 2 15.5 6M5.5 17c3-3.5 7.5-6.5 13-8"/></>,
    controller: <><path d="M8 8h8c3 0 5 3 5 7 0 3-1 5-3 5-1.5 0-2.4-1.5-3.5-3h-5C8.4 18.5 7.5 20 6 20c-2 0-3-2-3-5 0-4 2-7 5-7z"/><path d="M7 12v4M5 14h4M16.5 12.5h.01M18.5 15h.01"/></>,
    toy: <><circle cx="12" cy="12" r="7"/><circle cx="7" cy="6" r="3"/><circle cx="17" cy="6" r="3"/><circle cx="9.5" cy="11" r=".6" fill="currentColor"/><circle cx="14.5" cy="11" r=".6" fill="currentColor"/><path d="M9 15c2 1.3 4 1.3 6 0"/></>,
    car: <><path d="M4 16v-5l2-5h12l2 5v5"/><path d="M3 12h18M7 16h10"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></>,
    headphones: <><path d="M4 13v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="12" width="4" height="7" rx="2"/><rect x="17" y="12" width="4" height="7" rx="2"/></>,
    charger: <><path d="M9 2v6M15 2v6"/><path d="M7 8h10v4a5 5 0 0 1-5 5 5 5 0 0 1-5-5V8zM12 17v5"/></>,
    watch: <><rect x="7" y="6" width="10" height="12" rx="3"/><path d="M9 6l1-4h4l1 4M9 18l1 4h4l1-4M10 10h4v4h-4z"/></>,
    projector: <><rect x="3" y="7" width="18" height="11" rx="2"/><circle cx="15.5" cy="12.5" r="3"/><path d="M6 10h3M7 18v3M17 18v3"/></>,
    hoodie: <><path d="M8 5c1-3 7-3 8 0l4 3-3 4v9H7v-9L4 8l4-3z"/><path d="M9 5c0 3 6 3 6 0M9 14h6"/></>,
    bag: <><path d="M5 8h14l1 13H4L5 8z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
    vacuum: <><circle cx="12" cy="13" r="8"/><path d="M8 13h8M12 9v8M10 3h4"/></>,
    pan: <><circle cx="9" cy="13" r="6"/><path d="M14 10l7-5M15.5 12l6-5"/></>,
    air: <><path d="M3 8h11c3 0 3-4 0-4-1.5 0-2.3.7-2.5 1.5M3 12h16c3 0 3 4 0 4-1.5 0-2.3-.7-2.5-1.5M3 16h8"/></>,
    bottle: <><path d="M9 3h6v4l2 3v11H7V10l2-3V3z"/><path d="M9 7h6M8 13h8"/></>,
    dryer: <><path d="M4 8h10c3 0 5 2 5 5H4V8z"/><path d="M9 13l2 8h4l-1-8M19 10h2M19 7l2-1M19 16l2 1"/></>,
    dumbbell: <><path d="M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12"/></>,
    keyboard: <><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M6 10h1M10 10h1M14 10h1M18 10h.1M6 14h2M10 14h8"/></>,
  };
  return <svg {...common}>{icons[name] || icons.feed}</svg>;
}

// Format a number as localized tenge, e.g. 15990 -> "₸15,990"
function fmt(n) {
  return DATA.CURRENCY.symbol + Math.round(n).toLocaleString("en-US");
}
function savingsPct(retail, group) {
  return Math.round(((retail - group) / retail) * 100);
}
// Localize a recommendation-reason key produced by recommend.js.
function reasonText(t, key, profile) {
  if (key === "reasonTrending") return t(key, { city: t("city_" + ((profile && profile.city) || "Almaty")) });
  return t(key);
}

// Centered phone shell with a status bar.
function PhoneFrame({ children }) {
  return (
    <div className="phone">
      {children}
    </div>
  );
}

// Top app bar with optional back button.
function AppBar({ title, onBack, right }) {
  return (
    <div className="appbar">
      {onBack && <button className="back" onClick={onBack} aria-label="Back"><Icon name="back" size={18} /></button>}
      <h2 className="title" style={{ flex: 1 }}>{title}</h2>
      {right}
    </div>
  );
}

// Animated progress bar toward the minimum batch.
function ProgressBar({ current, min }) {
  const pct = Math.min(100, Math.round((current / min) * 100));
  const done = current >= min;
  return (
    <div className={"progress" + (done ? " done" : "")}>
      <span style={{ width: pct + "%" }} />
    </div>
  );
}

// SIM/eSIM verified badge — the identity layer made visible.
function SimBadge({ id, t }) {
  return (
    <span className="sim-badge">
      <span className="dot" />
      {t("simBadge")}{id ? " · " + id : ""}
    </span>
  );
}

// EN / RU language switch — the localization concept made tangible.
function LangSwitch({ lang, onLang, compact }) {
  return (
    <div className={"langswitch" + (compact ? " compact" : "")} role="group" aria-label="Language">
      {I18N.LANGS.map((l) => (
        <button key={l} className={lang === l ? "active" : ""} onClick={() => onLang(l)}>
          {l === "en" ? "EN" : "РУ"}
        </button>
      ))}
    </div>
  );
}

// Retail vs group price with savings pill.
function PriceBenefit({ product, t }) {
  const pct = savingsPct(product.retailPrice, product.groupPrice);
  return (
    <div className="row spread">
      <div className="row gap8">
        <span className="strike">{fmt(product.retailPrice)}</span>
        <span className="price group">{fmt(product.groupPrice)}</span>
      </div>
      <span className="save-pill">{t("savePct", { p: pct })}</span>
    </div>
  );
}

// A single product row in the feed.
function ProductCard({ entry, joined, onOpen, t, profile, payLabel }) {
  const product = entry.product || entry;
  const mkt = DATA.MARKETPLACES[product.marketplace];
  const topReason = entry.reasons && entry.reasons[0];
  const done = product.currentParticipants >= product.minParticipants;
  return (
    <div className="card product" onClick={() => onOpen(product.id)}>
      <div className="thumb"><Icon name={product.image} size={46} /></div>
      <div className="info">
        <div className="row spread">
          <span className="mkt" style={{ background: mkt.color }}>{mkt.name}</span>
          {joined && <span className="reason icon-label"><Icon name="check" size={11} /> {t("joinedTag")}</span>}
        </div>
        <div className="pname mt8">{product.title}</div>
        {topReason && <div className="mt8"><span className="reason">{reasonText(t, topReason, profile)}</span></div>}
        <div style={{ flex: 1 }} />
        <PriceBenefit product={product} t={t} />
        <div className="mt8">
          <ProgressBar current={product.currentParticipants} min={product.minParticipants} />
          <div className="muted mt8">
            {t("joinedOf", { c: product.currentParticipants, m: product.minParticipants })} ·{" "}
            {done ? t("unlockShort") : t.c("more", product.minParticipants - product.currentParticipants)}
          </div>
          {payLabel && <div className="pay-line"><Icon name="shield" size={11} /> {payLabel}</div>}
        </div>
      </div>
    </div>
  );
}

function OpportunityCard({ product, onOpen, t }) {
  if (!product) return null;
  const remaining = Math.max(0, product.minParticipants - product.currentParticipants);
  return (
    <button className="opportunity" onClick={() => onOpen(product.id)}>
      <span className="opportunity-icon"><Icon name="spark" size={20} /></span>
      <span className="opportunity-copy">
        <span className="opportunity-kicker">{t("oppKicker")}</span>
        <strong>{product.title}</strong>
        <span>{remaining === 0 ? t("oppUnlocked") : t.c("oppLeft", remaining)} · {t("oppSave", { amt: fmt(product.retailPrice - product.groupPrice) })}</span>
      </span>
      <Icon name="arrow" size={18} />
    </button>
  );
}

// Bottom tab navigation.
function BottomNav({ tab, onTab, groupCount, t }) {
  const items = [
    { id: "feed", icon: "feed", label: t("navFeed") },
    { id: "groups", icon: "groups", label: t("myGroups") },
    { id: "profile", icon: "user", label: t("profileTitle") },
  ];
  return (
    <nav className="bottomnav">
      {items.map((x) => (
        <button key={x.id} className={"tab" + (tab === x.id ? " active" : "")} onClick={() => onTab(x.id)}>
          <span className="ic"><Icon name={x.icon} size={17} /></span>
          {x.label}
          {x.id === "groups" && groupCount > 0 && <span className="badge-count">{groupCount}</span>}
        </button>
      ))}
    </nav>
  );
}

// Transient toast message.
function Toast({ text }) {
  if (!text) return null;
  return <div className="toast">{text}</div>;
}

// Bottom sheet with backdrop — used for payment and "how it works".
function Sheet({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grip" />
        {children}
      </div>
    </div>
  );
}

// Lightweight celebratory confetti burst (pure CSS animation).
function Confetti({ burst }) {
  if (!burst) return null;
  const colors = ["#c5a46d", "#177245", "#0066cc", "#c7372f", "#171715"];
  const pieces = Array.from({ length: 26 }, (_, i) => ({
    left: (i * 37) % 100,
    delay: (i % 7) * 0.09,
    duration: 1.3 + ((i * 13) % 10) / 14,
    color: colors[i % colors.length],
    rotate: (i * 47) % 360,
  }));
  return (
    <div className="confetti" key={burst} aria-hidden="true">
      {pieces.map((c, i) => (
        <span
          key={i}
          style={{
            left: c.left + "%",
            background: c.color,
            animationDelay: c.delay + "s",
            animationDuration: c.duration + "s",
            transform: `rotate(${c.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}
