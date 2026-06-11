/* Promoxer — reusable presentational components (JSX, compiled in-browser).
   Hooks are destructured once here and shared across the later scripts. */
const { useState, useEffect, useMemo, useRef } = React;

const DATA = window.PROMOXER_DATA;
const RECO = window.PROMOXER_RECO;

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

// Centered phone shell with a status bar.
function PhoneFrame({ children }) {
  return (
    <div className="phone">
      <div className="statusbar">
        <span>9:41</span>
        <span>Promoxer</span>
        <span className="device-status">5G&nbsp;&nbsp;▮</span>
      </div>
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
function SimBadge({ id }) {
  return (
    <span className="sim-badge">
      <span className="dot" />
      SIM/eSIM verified{id ? " · " + id : ""}
    </span>
  );
}

// Retail vs group price with savings pill.
function PriceBenefit({ product, effectivePrice }) {
  const pct = savingsPct(product.retailPrice, product.groupPrice);
  return (
    <div className="row spread">
      <div className="row gap8">
        <span className="strike">{fmt(product.retailPrice)}</span>
        <span className="price group">{fmt(effectivePrice != null ? effectivePrice : product.groupPrice)}</span>
      </div>
      <span className="save-pill">SAVE {pct}%</span>
    </div>
  );
}

// A single product row in the feed.
function ProductCard({ entry, joined, onOpen }) {
  const product = entry.product || entry;
  const mkt = DATA.MARKETPLACES[product.marketplace];
  const topReason = entry.reasons && entry.reasons[0];
  return (
    <div className="card product" onClick={() => onOpen(product.id)}>
      <div className="thumb"><Icon name={product.image} size={46} /></div>
      <div className="info">
        <div className="row spread">
          <span className="mkt" style={{ background: mkt.color }}>{mkt.name}</span>
          {joined && <span className="reason icon-label"><Icon name="check" size={11} /> Joined</span>}
        </div>
        <div className="pname mt8">{product.title}</div>
        {topReason && <div className="mt8"><span className="reason">{topReason}</span></div>}
        <div style={{ flex: 1 }} />
        <PriceBenefit product={product} />
        <div className="mt8">
          <ProgressBar current={product.currentParticipants} min={product.minParticipants} />
          <div className="muted mt8">
            {product.currentParticipants}/{product.minParticipants} joined ·{" "}
            {product.currentParticipants >= product.minParticipants
              ? "group price unlocked"
              : (product.minParticipants - product.currentParticipants) + " more to unlock"}
          </div>
        </div>
      </div>
    </div>
  );
}

// Bottom tab navigation.
function BottomNav({ tab, onTab, groupCount }) {
  const tabs = [
    { id: "feed", icon: "feed", label: "Feed" },
    { id: "groups", icon: "groups", label: "My Groups" },
    { id: "profile", icon: "user", label: "Profile" },
  ];
  return (
    <nav className="bottomnav">
      {tabs.map((t) => (
        <button key={t.id} className={"tab" + (tab === t.id ? " active" : "")} onClick={() => onTab(t.id)}>
          <span className="ic"><Icon name={t.icon} size={17} /></span>
          {t.label}
          {t.id === "groups" && groupCount > 0 && <span className="badge-count">{groupCount}</span>}
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
