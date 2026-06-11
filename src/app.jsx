/* Promoxer — root App: state store, routing, persistence, live simulation, mount. */

const STORAGE_KEY = "promoxer_v1";

function seedProducts() {
  // Deep-ish clone so participant counts can mutate without touching source data.
  return DATA.PRODUCTS.map((p) => ({ ...p }));
}

function defaultProfile() {
  return { name: "", age: 25, gender: "Female", city: DATA.CITIES[0], budget: 30000, interests: [], verified: false, simId: "", lang: "en" };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    const canonicalProducts = seedProducts();
    // Re-sync presentation fields from seed data; keep live participant counts.
    saved.products = (saved.products || canonicalProducts).map((product) => {
      const canonical = canonicalProducts.find((item) => item.id === product.id);
      return canonical ? { ...canonical, currentParticipants: product.currentParticipants } : product;
    });
    // Migrations for states saved by older versions.
    saved.profile = { ...defaultProfile(), ...(saved.profile || {}) };
    saved.payments = saved.payments || {};
    return saved;
  } catch (e) {
    return null;
  }
}

function App() {
  const persisted = loadState();
  const [screen, setScreen] = useState(persisted ? persisted.screen : "sim");
  const [tab, setTab] = useState(persisted ? persisted.tab : "feed");
  const [profile, setProfile] = useState(persisted ? persisted.profile : defaultProfile());
  const [products, setProducts] = useState(persisted ? persisted.products : seedProducts());
  const [joined, setJoined] = useState(persisted ? persisted.joined : []);
  const [payments, setPayments] = useState(persisted ? persisted.payments : {});
  const [detailId, setDetailId] = useState(null);
  const [toast, setToast] = useState("");
  const [burst, setBurst] = useState(0);
  const toastTimer = useRef(null);

  const lang = profile.lang || "en";
  const t = useMemo(() => I18N.makeT(lang), [lang]);

  // Keep the document language in sync for accessibility / screen readers.
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  // Persist on every meaningful change.
  useEffect(() => {
    const snapshot = { screen, tab, profile, products, joined, payments };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot)); } catch (e) {}
  }, [screen, tab, profile, products, joined, payments]);

  const flash = (text) => {
    setToast(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  };

  // Refs so the simulation interval always sees current state without re-subscribing.
  const simRef = useRef({});
  simRef.current = { products, joined, screen, t, lang };

  // Live group activity: every ~9s another "buyer" joins a random open group.
  // Makes the collective-purchase mechanic feel alive during the demo.
  useEffect(() => {
    const tick = setInterval(() => {
      const { products, joined, screen, t } = simRef.current;
      if (screen !== "main" || document.hidden) return;
      const open = products.filter((p) => p.currentParticipants < p.minParticipants);
      if (open.length === 0) return;
      const pick = open[Math.floor(Math.random() * open.length)];
      setProducts((list) =>
        list.map((p) => p.id === pick.id ? { ...p, currentParticipants: p.currentParticipants + 1 } : p)
      );
      const unlockedNow = pick.currentParticipants + 1 >= pick.minParticipants;
      if (unlockedNow && joined.includes(pick.id)) {
        // Your group just completed its batch — celebrate.
        setBurst((b) => b + 1);
        flash(t("yourUnlock", { title: pick.title }));
      } else if (Math.random() < 0.45) {
        const name = DATA.BUYER_NAMES[Math.floor(Math.random() * DATA.BUYER_NAMES.length)];
        const city = DATA.CITIES[Math.floor(Math.random() * DATA.CITIES.length)];
        flash(t("liveJoin", { name, city: t("city_" + city), title: pick.title }));
      }
    }, 9000);
    return () => clearInterval(tick);
  }, []);

  const store = {
    screen, tab, profile, products, joined, payments, detailId, flash, t, lang,

    go: (s) => { setDetailId(null); setScreen(s); },
    setTab: (x) => { setDetailId(null); setTab(x); },
    setLang: (l) => setProfile((p) => ({ ...p, lang: l })),

    verifySim: () => {
      const id = "KZ-" + Math.random().toString(16).slice(2, 8).toUpperCase();
      setProfile((p) => ({ ...p, verified: true, simId: id }));
      setScreen("register");
    },

    saveProfile: (partial) => setProfile((p) => ({ ...p, ...partial })),

    openDetail: (id) => setDetailId(id),
    closeDetail: () => setDetailId(null),

    joinGroup: (id, methodId) => {
      let unlockedNow = false;
      setProducts((list) =>
        list.map((p) => {
          if (p.id !== id) return p;
          const next = p.currentParticipants + 1;
          if (p.currentParticipants < p.minParticipants && next >= p.minParticipants) unlockedNow = true;
          return { ...p, currentParticipants: next };
        })
      );
      setJoined((j) => (j.includes(id) ? j : [...j, id]));
      if (methodId) setPayments((m) => ({ ...m, [id]: methodId }));
      const method = DATA.PAYMENT_METHODS.find((x) => x.id === methodId);
      if (unlockedNow) {
        setBurst((b) => b + 1);
        flash(t("unlockToast"));
      } else {
        flash(method ? t("payDone", { method: method.label }) : t("joinToast"));
      }
    },

    resetDemo: () => {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      const keepLang = lang;
      setProducts(seedProducts());
      setJoined([]);
      setPayments({});
      setProfile({ ...defaultProfile(), lang: keepLang });
      setDetailId(null);
      setTab("feed");
      setScreen("sim");
      flash(t("resetToast"));
    },
  };

  // ----- Render routing -----
  let body;
  if (screen === "sim") body = <SimScreen store={store} />;
  else if (screen === "register") body = <RegisterScreen store={store} />;
  else if (screen === "interests") body = <InterestsScreen store={store} />;
  else {
    // Main app: detail overlay takes precedence over the active tab.
    if (detailId) body = <DetailScreen store={store} />;
    else if (tab === "feed") body = <FeedScreen store={store} />;
    else if (tab === "groups") body = <GroupsScreen store={store} />;
    else body = <ProfileScreen store={store} />;
  }

  const showNav = screen === "main" && !detailId;

  return (
    <PhoneFrame>
      {body}
      {showNav && <BottomNav tab={tab} onTab={store.setTab} groupCount={joined.length} t={t} />}
      <Toast text={toast} />
      <Confetti burst={burst} />
    </PhoneFrame>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
