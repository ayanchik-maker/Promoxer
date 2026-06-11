/* Promoxer — screen components. Each receives the shared `store` from App. */

// 1) Onboarding + SIM/eSIM verification --------------------------------------
function SimScreen({ store }) {
  const [scanning, setScanning] = useState(false);
  const verify = () => {
    setScanning(true);
    setTimeout(() => store.verifySim(), 1600);
  };
  return (
    <div className="screen">
      <div className="pad center" style={{ paddingTop: 40 }}>
        <div className="logo" style={{ fontSize: 30 }}>Promoxer</div>
        <p className="sub mt8">Buy together. Pay wholesale.<br />Global marketplaces, localized for you.</p>

        <div style={{ marginTop: 70 }}>
          <div className={"sim-hero" + (scanning ? " scanning" : "")}>
            <Icon name={scanning ? "scan" : "identity"} size={42} />
          </div>
          <h2 className="title mt24">{scanning ? "Verifying device…" : "Secure sign-in"}</h2>
          <p className="sub mt8" style={{ maxWidth: 280, margin: "8px auto 0" }}>
            {scanning
              ? "Linking your secure profile to this device’s SIM/eSIM identity."
              : "Promoxer confirms it’s really you using your SIM/eSIM identity — no passwords, tied to your device."}
          </p>
        </div>

        <div style={{ marginTop: 70 }}>
          <button className="btn" onClick={verify} disabled={scanning}>
            {scanning ? "Please wait…" : "Verify with SIM/eSIM ID"}
          </button>
          <div className="mt16"><SimBadge /></div>
          <p className="muted mt16" style={{ fontSize: 11.5 }}>
            Concept demo — no real SIM provisioning. Represents the future secure identity layer.
          </p>
        </div>
      </div>
    </div>
  );
}

// 2) Registration & profile --------------------------------------------------
function RegisterScreen({ store }) {
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

  return (
    <div className="screen">
      <AppBar title="Create your profile" />
      <div className="pad">
        <div className="mb"><SimBadge id={store.profile.simId} /></div>
        <p className="sub mt8" style={{ marginBottom: 18 }}>
          Tell us a bit about you so the feed is localized and personalized.
        </p>

        <div className="field">
          <label className="label">Full name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Aruzhan K." />
        </div>

        <div className="row gap12">
          <div className="field" style={{ flex: 1 }}>
            <label className="label">Age</label>
            <input className="input" type="number" min="14" max="90" value={age} onChange={(e) => setAge(+e.target.value)} />
          </div>
          <div className="field" style={{ flex: 2 }}>
            <label className="label">City</label>
            <select className="select" value={city} onChange={(e) => setCity(e.target.value)}>
              {DATA.CITIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="field">
          <label className="label">Gender</label>
          <div className="segment">
            {["Female", "Male", "Other"].map((g) => (
              <div key={g} className={"seg" + (gender === g ? " active" : "")} onClick={() => setGender(g)}>{g}</div>
            ))}
          </div>
        </div>

        <div className="field">
          <label className="label">Approximate budget per item · <b>{fmt(budget)}</b></label>
          <input className="range" type="range" min="5000" max="100000" step="5000" value={budget} onChange={(e) => setBudget(+e.target.value)} />
          <div className="row spread muted"><span>₸5,000</span><span>₸100,000</span></div>
        </div>

        <button className="btn mt16" onClick={submit} disabled={!name.trim()}>Continue</button>
      </div>
    </div>
  );
}

// 3) Interests & categories --------------------------------------------------
function InterestsScreen({ store }) {
  const [sel, setSel] = useState(store.profile.interests || []);
  const toggle = (id) => setSel((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const submit = () => { store.saveProfile({ interests: sel }); store.go("main"); };
  return (
    <div className="screen">
      <AppBar title="What are you into?" onBack={() => store.go("register")} />
      <div className="pad">
        <p className="sub" style={{ marginBottom: 18 }}>
          Pick a few categories. We’ll rank your feed and group deals around these.
        </p>
        <div className="chips">
          {DATA.CATEGORIES.map((c) => (
            <div key={c.id} className={"chip" + (sel.includes(c.id) ? " active" : "")} onClick={() => toggle(c.id)}>
              <span className="ic"><Icon name={c.icon} size={15} /></span>{c.label}
            </div>
          ))}
        </div>
        <button className="btn mt24" onClick={submit} disabled={sel.length === 0}>
          {sel.length === 0 ? "Pick at least one" : "Show my deals (" + sel.length + ")"}
        </button>
      </div>
    </div>
  );
}

// 4) Home feed ---------------------------------------------------------------
function FeedScreen({ store }) {
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
  const cats = [{ id: "all", label: "All", icon: "feed" }, ...DATA.CATEGORIES];
  return (
    <div className="screen">
      <div className="pad" style={{ paddingBottom: 4 }}>
        <div className="row spread">
          <div>
            <div className="eyebrow">{store.profile.city} · {DATA.CURRENCY.code}</div>
            <h1 className="title">Hi {store.profile.name.split(" ")[0]}</h1>
          </div>
          <span className="header-mark">P</span>
        </div>
        <p className="sub mt8">Personalized group deals from global marketplaces.</p>
        <div className="searchbox mt16">
          <Icon name="search" size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products or marketplaces"
            aria-label="Search products"
          />
          {query && <button onClick={() => setQuery("")} aria-label="Clear search"><Icon name="close" size={15} /></button>}
        </div>
      </div>

      <div className="catbar">
        {cats.map((c) => (
          <div key={c.id} className={"chip" + (cat === c.id ? " active" : "")} onClick={() => setCat(c.id)}>
            <span className="ic"><Icon name={c.icon} size={14} /></span>{c.label}
          </div>
        ))}
      </div>

      <div className="pad" style={{ paddingTop: 4 }}>
        {!query && cat === "all" && <OpportunityCard product={opportunity} onOpen={store.openDetail} />}
        <div className="feed-toolbar">
          <span>{feed.length} {feed.length === 1 ? "deal" : "deals"}</span>
          <label>
            <span className="sr-only">Sort deals</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="recommended">Recommended</option>
              <option value="unlock">Closest to unlock</option>
              <option value="savings">Biggest savings</option>
            </select>
          </label>
        </div>
        {feed.length === 0 && (
          <div className="empty">
            <div className="ic"><Icon name="search" size={38} /></div>
            <p>No matching deals.</p>
            <button className="text-action" onClick={() => { setQuery(""); setCat("all"); }}>Clear search and filters</button>
          </div>
        )}
        {feed.map((entry) => (
          <ProductCard
            key={entry.product.id}
            entry={entry}
            joined={store.joined.includes(entry.product.id)}
            onOpen={store.openDetail}
          />
        ))}
      </div>
    </div>
  );
}

// 5 + 6) Product detail & group join ----------------------------------------
function DetailScreen({ store }) {
  const product = store.products.find((x) => x.id === store.detailId);
  if (!product) return null;
  const mkt = DATA.MARKETPLACES[product.marketplace];
  const joined = store.joined.includes(product.id);
  const unlocked = product.currentParticipants >= product.minParticipants;
  const remaining = Math.max(0, product.minParticipants - product.currentParticipants);
  const reasons = RECO.scoreProduct(product, store.profile).reasons;
  const effective = unlocked ? product.groupPrice : product.retailPrice;
  const shareProduct = async () => {
    const text = `Join my Promoxer group for ${product.title} and save ${fmt(product.retailPrice - product.groupPrice)}.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.title, text, url: window.location.href });
        store.flash("Deal shared");
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${text} ${window.location.href}`);
        store.flash("Deal link copied");
      } else {
        store.flash("Share this deal with your group");
      }
    } catch (error) {
      if (error && error.name !== "AbortError") store.flash("Couldn’t share this deal");
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
          {(product.tags || []).includes("trending") && <span className="reason icon-label"><Icon name="trending" size={11} /> Trending</span>}
        </div>
        <h2 className="title mt8">{product.title}</h2>

        {unlocked && (
          <div className="unlocked-banner mt16"><Icon name="celebrate" size={19} /> Group price unlocked — everyone pays wholesale!</div>
        )}

        {/* Individual vs collective pricing */}
        <div className="card mt16" style={{ padding: 16 }}>
          <div className="row spread">
            <div>
              <div className="muted">Individual price</div>
              <div className="price">{fmt(product.retailPrice)}</div>
            </div>
            <Icon name="arrow" size={20} />
            <div style={{ textAlign: "right" }}>
              <div className="muted">Group price</div>
              <div className="price group">{fmt(product.groupPrice)}</div>
            </div>
          </div>
          <div className="divider" />
          <div className="row spread">
            <span className="save-pill">SAVE {savingsPct(product.retailPrice, product.groupPrice)}%</span>
            <b style={{ color: "var(--accent)" }}>You save {fmt(product.retailPrice - product.groupPrice)}</b>
          </div>
        </div>

        {/* Group progress */}
        <div className="card mt16" style={{ padding: 16 }}>
          <div className="row spread" style={{ marginBottom: 10 }}>
            <b>Group purchase</b>
            <span className="muted">{product.currentParticipants}/{product.minParticipants} joined</span>
          </div>
          <ProgressBar current={product.currentParticipants} min={product.minParticipants} />
          <div className="muted mt8">
            {unlocked
              ? "Minimum batch reached — order ships at wholesale price."
              : `Needs ${remaining} more ${remaining === 1 ? "buyer" : "buyers"} to reach the minimum batch of ${product.minParticipants}.`}
          </div>
        </div>

        {/* Why recommended */}
        {reasons.length > 0 && (
          <div className="mt16">
            <div className="label">Why this is recommended for you</div>
            <div className="chips">{reasons.map((r, i) => <span key={i} className="reason">{r}</span>)}</div>
          </div>
        )}

        <div className="mt24">
          {joined ? (
            <button className="btn success" disabled><Icon name="check" size={18} /> You’re in this group</button>
          ) : (
            <button className="btn" onClick={() => store.joinGroup(product.id)}>
              Join group purchase · pay {fmt(product.groupPrice)}
            </button>
          )}
          <p className="muted center mt8" style={{ fontSize: 11.5 }}>
            You’re only charged the wholesale price once the minimum batch is reached.
          </p>
        </div>
      </div>
    </div>
  );
}

// My Groups -----------------------------------------------------------------
function GroupsScreen({ store }) {
  const items = store.products.filter((x) => store.joined.includes(x.id));
  const totalSaved = items.reduce((s, x) => s + (x.retailPrice - x.groupPrice), 0);
  return (
    <div className="screen">
      <div className="pad">
        <h1 className="title">My Groups</h1>
        {items.length === 0 ? (
          <div className="empty"><div className="ic"><Icon name="groups" size={40} /></div><p>You haven’t joined any group buys yet.<br />Open a product and tap “Join group purchase”.</p></div>
        ) : (
          <>
            <div className="card row mt16" style={{ padding: 4 }}>
              <div className="stat"><div className="n">{items.length}</div><div className="l">Groups joined</div></div>
              <div className="stat"><div className="n" style={{ color: "var(--accent)" }}>{fmt(totalSaved)}</div><div className="l">Total savings</div></div>
            </div>
            <div className="mt16">
              {items.map((product) => (
                <ProductCard key={product.id} entry={product} joined onOpen={store.openDetail} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Profile -------------------------------------------------------------------
function ProfileScreen({ store }) {
  const p = store.profile;
  const interestLabels = DATA.CATEGORIES.filter((c) => (p.interests || []).includes(c.id));
  return (
    <div className="screen">
      <div className="pad">
        <h1 className="title">Profile</h1>
        <div className="card mt16" style={{ padding: 18 }}>
          <div className="row gap12">
            <div className="sim-hero profile-avatar"><Icon name="user" size={25} /></div>
            <div>
              <b style={{ fontSize: 17 }}>{p.name}</b>
              <div className="muted">{p.age} · {p.gender} · {p.city}</div>
            </div>
          </div>
          <div className="mt16"><SimBadge id={p.simId} /></div>
          <p className="muted mt8" style={{ fontSize: 12 }}>Secure profile linked to this device via SIM/eSIM identity.</p>
        </div>

        <div className="card row mt16" style={{ padding: 4 }}>
          <div className="stat"><div className="n">{fmt(p.budget)}</div><div className="l">Budget / item</div></div>
          <div className="stat"><div className="n">{store.joined.length}</div><div className="l">Groups joined</div></div>
        </div>

        <div className="mt16">
          <div className="label">Your interests</div>
          <div className="chips">
            {interestLabels.map((c) => <span key={c.id} className="chip active"><span className="ic"><Icon name={c.icon} size={14} /></span>{c.label}</span>)}
          </div>
        </div>

        <div className="mt24 stack">
          <button className="btn secondary" onClick={() => store.go("interests")}>Edit interests</button>
          <button className="btn ghost" onClick={store.resetDemo}><Icon name="reset" size={17} /> Reset demo data</button>
        </div>
      </div>
    </div>
  );
}
