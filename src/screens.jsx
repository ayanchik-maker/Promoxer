/* Promoxer — screen components. Each receives the shared `store` from App.
   All copy goes through store.t (i18n EN/RU). */

// 1) Onboarding + SIM/eSIM verification --------------------------------------
function SimScreen({ store }) {
  const { t } = store;
  const [scanning, setScanning] = useState(false);
  const verify = () => {
    setScanning(true);
    setTimeout(() => store.verifySim(), 1600);
  };
  return (
    <div className="screen">
      <div className="pad center" style={{ paddingTop: 28 }}>
        <div className="row spread">
          <span style={{ width: 64 }} />
          <div className="logo" style={{ fontSize: 30 }}>Promoxer</div>
          <LangSwitch lang={store.lang} onLang={store.setLang} compact />
        </div>
        <p className="sub mt8">{t("tagline")}<br />{t("tagline2")}</p>

        <div style={{ marginTop: 64 }}>
          <div className={"sim-hero" + (scanning ? " scanning" : "")}>
            <Icon name={scanning ? "scan" : "identity"} size={42} />
          </div>
          <h2 className="title mt24">{scanning ? t("simVerifying") : t("secureSignin")}</h2>
          <p className="sub mt8" style={{ maxWidth: 280, margin: "8px auto 0" }}>
            {scanning ? t("simBodyScan") : t("simBodyIdle")}
          </p>
        </div>

        <div style={{ marginTop: 64 }}>
          <button className="btn" onClick={verify} disabled={scanning}>
            {scanning ? t("simWait") : t("simVerifyBtn")}
          </button>
          <div className="mt16"><SimBadge t={t} /></div>
          <p className="muted mt16" style={{ fontSize: 11.5 }}>
            {t("simConceptNote")}
          </p>
        </div>
      </div>
    </div>
  );
}

// 2) Registration & profile --------------------------------------------------
function RegisterScreen({ store }) {
  const { t } = store;
  const p = store.profile;
  const [name, setName] = useState(p.name || "");
  const [age, setAge] = useState(p.age || 25);
  const [gender, setGender] = useState(p.gender || "Female");
  const [city, setCity] = useState(p.city || DATA.CITIES[0]);
  const [budget, setBudget] = useState(p.budget || 30000);

  const submit = () => {
    if (!name.trim()) return;
    store.saveProfile({ name: name.trim(), age, gender, city, budget });
    store.go("interests");
  };
  const genders = [
    { id: "Female", label: t("genderFemale") },
    { id: "Male", label: t("genderMale") },
    { id: "Other", label: t("genderOther") },
  ];

  return (
    <div className="screen">
      <AppBar title={t("createProfile")} />
      <div className="pad">
        <div className="mb"><SimBadge id={store.profile.simId} t={t} /></div>
        <p className="sub mt8" style={{ marginBottom: 18 }}>
          {t("profileIntro")}
        </p>

        <div className="field">
          <label className="label">{t("fullName")}</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("namePlaceholder")} />
        </div>

        <div className="row gap12">
          <div className="field" style={{ flex: 1 }}>
            <label className="label">{t("age")}</label>
            <input className="input" type="number" min="14" max="90" value={age} onChange={(e) => setAge(+e.target.value)} />
          </div>
          <div className="field" style={{ flex: 2 }}>
            <label className="label">{t("city")}</label>
            <select className="select" value={city} onChange={(e) => setCity(e.target.value)}>
              {DATA.CITIES.map((c) => <option key={c} value={c}>{t("city_" + c)}</option>)}
            </select>
          </div>
        </div>

        <div className="field">
          <label className="label">{t("gender")}</label>
          <div className="segment">
            {genders.map((g) => (
              <div key={g.id} className={"seg" + (gender === g.id ? " active" : "")} onClick={() => setGender(g.id)}>{g.label}</div>
            ))}
          </div>
        </div>

        <div className="field">
          <label className="label">{t("budgetLabel")} · <b>{fmt(budget)}</b></label>
          <input className="range" type="range" min="5000" max="100000" step="5000" value={budget} onChange={(e) => setBudget(+e.target.value)} />
          <div className="row spread muted"><span>₸5,000</span><span>₸100,000</span></div>
        </div>

        <button className="btn mt16" onClick={submit} disabled={!name.trim()}>{t("continueBtn")}</button>
      </div>
    </div>
  );
}

// 3) Interests & categories --------------------------------------------------
function InterestsScreen({ store }) {
  const { t } = store;
  const [sel, setSel] = useState(store.profile.interests || []);
  const toggle = (id) => setSel((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const submit = () => { store.saveProfile({ interests: sel }); store.go("main"); };
  return (
    <div className="screen">
      <AppBar title={t("interestsTitle")} onBack={() => store.go("register")} />
      <div className="pad">
        <p className="sub" style={{ marginBottom: 18 }}>
          {t("interestsIntro")}
        </p>
        <div className="chips">
          {DATA.CATEGORIES.map((c) => (
            <div key={c.id} className={"chip" + (sel.includes(c.id) ? " active" : "")} onClick={() => toggle(c.id)}>
              <span className="ic"><Icon name={c.icon} size={15} /></span>{t("cat_" + c.id)}
            </div>
          ))}
        </div>
        <button className="btn mt24" onClick={submit} disabled={sel.length === 0}>
          {sel.length === 0 ? t("pickAtLeastOne") : t("showDeals", { n: sel.length })}
        </button>
      </div>
    </div>
  );
}

// 4) Home feed ---------------------------------------------------------------
function FeedScreen({ store }) {
  const { t } = store;
  const [cat, setCat] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recommended");
  const feed = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const list = RECO.recommendFeed(store.products, store.profile, cat)
      .filter((entry) => {
        if (!normalized) return true;
        const product = entry.product;
        const marketplace = DATA.MARKETPLACES[product.marketplace].name;
        return `${product.title} ${marketplace} ${(product.tags || []).join(" ")}`.toLowerCase().includes(normalized);
      });
    if (sort === "unlock") {
      return [...list].sort((a, b) =>
        (b.product.currentParticipants / b.product.minParticipants) -
        (a.product.currentParticipants / a.product.minParticipants)
      );
    }
    if (sort === "savings") {
      return [...list].sort((a, b) =>
        (b.product.retailPrice - b.product.groupPrice) -
        (a.product.retailPrice - a.product.groupPrice)
      );
    }
    return list;
  }, [store.products, store.profile, cat, query, sort]);
  const opportunity = useMemo(() => {
    const active = store.products.filter((p) => !store.joined.includes(p.id));
    return [...active].sort((a, b) => {
      const aRemaining = Math.max(0, a.minParticipants - a.currentParticipants);
      const bRemaining = Math.max(0, b.minParticipants - b.currentParticipants);
      return aRemaining - bRemaining || (b.retailPrice - b.groupPrice) - (a.retailPrice - a.groupPrice);
    })[0];
  }, [store.products, store.joined]);
  const cats = [{ id: "all", icon: "feed" }, ...DATA.CATEGORIES];
  return (
    <div className="screen">
      <div className="pad" style={{ paddingBottom: 4 }}>
        <div className="row spread">
          <div>
            <div className="eyebrow">{t("city_" + store.profile.city)} · {DATA.CURRENCY.code}</div>
            <h1 className="title">{t("hi", { name: store.profile.name.split(" ")[0] })}</h1>
          </div>
          <span className="header-mark">P</span>
        </div>
        <p className="sub mt8">{t("feedSub")}</p>
        <div className="searchbox mt16">
          <Icon name="search" size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
          />
          {query && <button onClick={() => setQuery("")} aria-label="Clear search"><Icon name="close" size={15} /></button>}
        </div>
      </div>

      <div className="catbar">
        {cats.map((c) => (
          <div key={c.id} className={"chip" + (cat === c.id ? " active" : "")} onClick={() => setCat(c.id)}>
            <span className="ic"><Icon name={c.icon} size={14} /></span>{c.id === "all" ? t("catAll") : t("cat_" + c.id)}
          </div>
        ))}
      </div>

      <div className="pad" style={{ paddingTop: 4 }}>
        {!query && cat === "all" && <OpportunityCard product={opportunity} onOpen={store.openDetail} t={t} />}
        <div className="feed-toolbar">
          <span>{t.c("deal", feed.length)}</span>
          <label>
            <span className="sr-only">Sort deals</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="recommended">{t("sortRecommended")}</option>
              <option value="unlock">{t("sortUnlock")}</option>
              <option value="savings">{t("sortSavings")}</option>
            </select>
          </label>
        </div>
        {feed.length === 0 && (
          <div className="empty">
            <div className="ic"><Icon name="search" size={38} /></div>
            <p>{t("noMatching")}</p>
            <button className="text-action" onClick={() => { setQuery(""); setCat("all"); }}>{t("clearFilters")}</button>
          </div>
        )}
        {feed.map((entry) => (
          <ProductCard
            key={entry.product.id}
            entry={entry}
            joined={store.joined.includes(entry.product.id)}
            onOpen={store.openDetail}
            t={t}
            profile={store.profile}
          />
        ))}
      </div>
    </div>
  );
}

// Payment bottom sheet — local rails concept, authorized via SIM/eSIM --------
function PaymentSheet({ store, product, open, onClose }) {
  const { t } = store;
  const [method, setMethod] = useState(DATA.PAYMENT_METHODS[0].id);
  const [authorizing, setAuthorizing] = useState(false);
  const confirm = () => {
    setAuthorizing(true);
    setTimeout(() => {
      setAuthorizing(false);
      store.joinGroup(product.id, method);
      onClose();
    }, 1100);
  };
  return (
    <Sheet open={open} onClose={authorizing ? () => {} : onClose}>
      <h2 className="title" style={{ fontSize: 21 }}>{t("payTitle")}</h2>
      <p className="sub mt8">{t("payIntro")}</p>
      <div className="paylist mt16">
        {DATA.PAYMENT_METHODS.map((m) => (
          <button
            key={m.id}
            className={"payrow" + (method === m.id ? " active" : "")}
            onClick={() => setMethod(m.id)}
            disabled={authorizing}
          >
            <span className="payrow-icon"><Icon name={m.icon} size={19} /></span>
            <span className="payrow-copy">
              <strong>{m.label}</strong>
              <span>{t(m.descKey)}</span>
            </span>
            <span className={"payrow-radio" + (method === m.id ? " on" : "")} />
          </button>
        ))}
      </div>
      <div className="row spread mt16" style={{ padding: "0 2px" }}>
        <span className="muted">{product.title}</span>
        <b>{fmt(product.groupPrice)}</b>
      </div>
      <button className="btn mt16" onClick={confirm} disabled={authorizing}>
        <Icon name="shield" size={17} />
        {authorizing ? t("payAuthorizing") : t("payConfirm")}
      </button>
      <p className="muted center mt8" style={{ fontSize: 10.5 }}>{t("chargeNote")}</p>
    </Sheet>
  );
}

// 5 + 6) Product detail & group join ----------------------------------------
function DetailScreen({ store }) {
  const { t } = store;
  const [payOpen, setPayOpen] = useState(false);
  const product = store.products.find((x) => x.id === store.detailId);
  if (!product) return null;
  const mkt = DATA.MARKETPLACES[product.marketplace];
  const joined = store.joined.includes(product.id);
  const unlocked = product.currentParticipants >= product.minParticipants;
  const remaining = Math.max(0, product.minParticipants - product.currentParticipants);
  const reasons = RECO.scoreProduct(product, store.profile).reasons;
  const usd = Math.round(product.retailPrice / DATA.FX.rate);
  const shareProduct = async () => {
    const text = t("shareMsg", { title: product.title, amt: fmt(product.retailPrice - product.groupPrice) });
    try {
      if (navigator.share) {
        await navigator.share({ title: product.title, text, url: window.location.href });
        store.flash(t("shareDone"));
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${text} ${window.location.href}`);
        store.flash(t("shareCopied"));
      } else {
        store.flash(t("shareFallback"));
      }
    } catch (error) {
      if (error && error.name !== "AbortError") store.flash(t("shareFail"));
    }
  };

  return (
    <div className="screen">
      <AppBar
        title=""
        onBack={store.closeDetail}
        right={<button className="back" onClick={shareProduct} aria-label="Share deal"><Icon name="share" size={17} /></button>}
      />
      <div className="pad" style={{ paddingTop: 0 }}>
        <div className="card center" style={{ padding: 28 }}>
          <div className="detail-product-icon"><Icon name={product.image} size={92} /></div>
        </div>

        <div className="row mt16 gap8">
          <span className="mkt" style={{ background: mkt.color }}>{mkt.name}</span>
          {(product.tags || []).includes("trending") && <span className="reason icon-label"><Icon name="trending" size={11} /> {t("trending")}</span>}
        </div>
        <h2 className="title mt8">{product.title}</h2>

        {unlocked && (
          <div className="unlocked-banner mt16"><Icon name="celebrate" size={19} /> {t("unlockedBanner")}</div>
        )}

        {/* Individual vs collective pricing, with visible localization */}
        <div className="card mt16" style={{ padding: 16 }}>
          <div className="row spread">
            <div>
              <div className="muted">{t("individualPrice")}</div>
              <div className="price">{fmt(product.retailPrice)}</div>
            </div>
            <Icon name="arrow" size={20} />
            <div style={{ textAlign: "right" }}>
              <div className="muted">{t("groupPrice")}</div>
              <div className="price group">{fmt(product.groupPrice)}</div>
            </div>
          </div>
          <div className="divider" />
          <div className="row spread">
            <span className="save-pill">{t("savePct", { p: savingsPct(product.retailPrice, product.groupPrice) })}</span>
            <b style={{ color: "var(--green)" }}>{t("youSave", { amt: fmt(product.retailPrice - product.groupPrice) })}</b>
          </div>
          <div className="fx-note">
            <Icon name="globe" size={13} />
            <span>
              {t("sourcePrice", { usd: usd.toLocaleString("en-US"), mkt: mkt.name })} · {t("fxNote", { rate: DATA.FX.rate })}
            </span>
          </div>
        </div>

        {/* Group progress */}
        <div className="card mt16" style={{ padding: 16 }}>
          <div className="row spread" style={{ marginBottom: 10 }}>
            <b>{t("groupPurchase")}</b>
            <span className="muted">{t("joinedOf", { c: product.currentParticipants, m: product.minParticipants })}</span>
          </div>
          <ProgressBar current={product.currentParticipants} min={product.minParticipants} />
          <div className="muted mt8">
            {unlocked ? t("unlockedLong") : t.c("needs", remaining, { m: product.minParticipants })}
          </div>
          <div className="ends-note"><Icon name="timer" size={12} /> {t("endsIn", { h: product.endsInHours })}</div>
        </div>

        {/* Why recommended */}
        {reasons.length > 0 && (
          <div className="mt16">
            <div className="label">{t("whyTitle")}</div>
            <div className="chips">{reasons.map((r, i) => <span key={i} className="reason">{reasonText(t, r, store.profile)}</span>)}</div>
          </div>
        )}

        <div className="mt24">
          {joined ? (
            <button className="btn success" disabled><Icon name="check" size={18} /> {t("inGroup")}</button>
          ) : (
            <button className="btn" onClick={() => setPayOpen(true)}>
              {t("joinBtn", { amt: fmt(product.groupPrice) })}
            </button>
          )}
          <p className="muted center mt8" style={{ fontSize: 11.5 }}>
            {t("chargeNote")}
          </p>
        </div>
      </div>
      <PaymentSheet store={store} product={product} open={payOpen} onClose={() => setPayOpen(false)} />
    </div>
  );
}

// My Groups -----------------------------------------------------------------
function GroupsScreen({ store }) {
  const { t } = store;
  const items = store.products.filter((x) => store.joined.includes(x.id));
  const totalSaved = items.reduce((s, x) => s + (x.retailPrice - x.groupPrice), 0);
  const methodLabel = (id) => {
    const m = DATA.PAYMENT_METHODS.find((x) => x.id === id);
    return m ? m.label : null;
  };
  return (
    <div className="screen">
      <div className="pad">
        <h1 className="title">{t("myGroups")}</h1>
        {items.length === 0 ? (
          <div className="empty"><div className="ic"><Icon name="groups" size={40} /></div><p>{t("emptyGroups")}<br />{t("emptyGroupsHint")}</p></div>
        ) : (
          <>
            <div className="card row mt16" style={{ padding: 4 }}>
              <div className="stat"><div className="n">{items.length}</div><div className="l">{t("groupsJoined")}</div></div>
              <div className="stat"><div className="n" style={{ color: "var(--green)" }}>{fmt(totalSaved)}</div><div className="l">{t("totalSavings")}</div></div>
            </div>
            <div className="mt16">
              {items.map((product) => {
                const m = methodLabel(store.payments[product.id]);
                return (
                  <ProductCard
                    key={product.id}
                    entry={product}
                    joined
                    onOpen={store.openDetail}
                    t={t}
                    profile={store.profile}
                    payLabel={m ? t("payReservedVia", { method: m }) : null}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// How-it-works sheet — product mechanics + SIM/eSIM strategic vision ---------
function HowItWorksSheet({ store, open, onClose }) {
  const { t } = store;
  const steps = [
    { icon: "identity", titleKey: "how1t", bodyKey: "how1b" },
    { icon: "globe", titleKey: "how2t", bodyKey: "how2b" },
    { icon: "groups", titleKey: "how3t", bodyKey: "how3b" },
    { icon: "celebrate", titleKey: "how4t", bodyKey: "how4b" },
  ];
  return (
    <Sheet open={open} onClose={onClose}>
      <h2 className="title" style={{ fontSize: 21 }}>{t("howTitle")}</h2>
      <div className="howlist mt16">
        {steps.map((s, i) => (
          <div className="howstep" key={s.titleKey}>
            <span className="howstep-icon"><Icon name={s.icon} size={18} /></span>
            <div>
              <b>{i + 1}. {t(s.titleKey)}</b>
              <p className="sub">{t(s.bodyKey)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="vision mt16">
        <div className="eyebrow">{t("visionTitle")}</div>
        <p className="sub">{t("visionBody")}</p>
      </div>
      <button className="btn mt16" onClick={onClose}>{t("gotIt")}</button>
    </Sheet>
  );
}

// Profile -------------------------------------------------------------------
function ProfileScreen({ store }) {
  const { t } = store;
  const [howOpen, setHowOpen] = useState(false);
  const p = store.profile;
  const interestLabels = DATA.CATEGORIES.filter((c) => (p.interests || []).includes(c.id));
  return (
    <div className="screen">
      <div className="pad">
        <div className="row spread">
          <h1 className="title">{t("profileTitle")}</h1>
          <LangSwitch lang={store.lang} onLang={store.setLang} compact />
        </div>
        <div className="card mt16" style={{ padding: 18 }}>
          <div className="row gap12">
            <div className="sim-hero profile-avatar"><Icon name="user" size={25} /></div>
            <div>
              <b style={{ fontSize: 17 }}>{p.name}</b>
              <div className="muted">{p.age} · {t("gender" + p.gender)} · {t("city_" + p.city)}</div>
            </div>
          </div>
          <div className="mt16"><SimBadge id={p.simId} t={t} /></div>
          <p className="muted mt8" style={{ fontSize: 12 }}>{t("secureLinked")}</p>
        </div>

        <div className="card row mt16" style={{ padding: 4 }}>
          <div className="stat"><div className="n">{fmt(p.budget)}</div><div className="l">{t("budgetPerItem")}</div></div>
          <div className="stat"><div className="n">{store.joined.length}</div><div className="l">{t("groupsJoined")}</div></div>
        </div>

        <div className="mt16">
          <div className="label">{t("yourInterests")}</div>
          <div className="chips">
            {interestLabels.map((c) => <span key={c.id} className="chip active"><span className="ic"><Icon name={c.icon} size={14} /></span>{t("cat_" + c.id)}</span>)}
          </div>
        </div>

        <div className="mt24 stack">
          <button className="btn secondary" onClick={() => setHowOpen(true)}><Icon name="info" size={16} /> {t("howItWorks")}</button>
          <button className="btn secondary" onClick={() => store.go("interests")}>{t("editInterests")}</button>
          <button className="btn ghost" onClick={store.resetDemo}><Icon name="reset" size={17} /> {t("resetDemo")}</button>
        </div>
      </div>
      <HowItWorksSheet store={store} open={howOpen} onClose={() => setHowOpen(false)} />
    </div>
  );
}
