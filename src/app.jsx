/* Promoxer — root App: state store, routing, persistence, mount. */

const STORAGE_KEY = "promoxer_v1";

function seedProducts() {
  // Deep-ish clone so participant counts can mutate without touching source data.
  return DATA.PRODUCTS.map((p) => ({ ...p }));
}

function defaultProfile() {
  return { name: "", age: 25, gender: "Female", city: DATA.CITIES[0], budget: 30000, interests: [], verified: false, simId: "" };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    const canonicalProducts = seedProducts();
    saved.products = (saved.products || canonicalProducts).map((product) => {
      const canonical = canonicalProducts.find((item) => item.id === product.id);
      return canonical ? { ...product, image: canonical.image } : product;
    });
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
  const [detailId, setDetailId] = useState(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  // Persist on every meaningful change.
  useEffect(() => {
    const snapshot = { screen, tab, profile, products, joined };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot)); } catch (e) {}
  }, [screen, tab, profile, products, joined]);

  const flash = (text) => {
    setToast(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2400);
  };

  const store = {
    screen, tab, profile, products, joined, detailId, flash,

    go: (s) => { setDetailId(null); setScreen(s); },
    setTab: (t) => { setDetailId(null); setTab(t); },

    verifySim: () => {
      const id = "KZ-" + Math.random().toString(16).slice(2, 8).toUpperCase();
      setProfile((p) => ({ ...p, verified: true, simId: id }));
      setScreen("register");
    },

    saveProfile: (partial) => setProfile((p) => ({ ...p, ...partial })),

    openDetail: (id) => setDetailId(id),
    closeDetail: () => setDetailId(null),

    joinGroup: (id) => {
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
      flash(unlockedNow ? "Minimum batch reached — wholesale price unlocked!" : "You joined the group buy");
    },

    resetDemo: () => {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      setProducts(seedProducts());
      setJoined([]);
      setProfile(defaultProfile());
      setDetailId(null);
      setTab("feed");
      setScreen("sim");
      flash("Demo reset — start a fresh walkthrough");
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
      {showNav && <BottomNav tab={tab} onTab={store.setTab} groupCount={joined.length} />}
      <Toast text={toast} />
    </PhoneFrame>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
