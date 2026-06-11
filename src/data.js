/* Promoxer — mock data layer (no real APIs; hackathon demo) */

// Cities for the localized profile. Stored as canonical ids; display names come from i18n.
const CITIES = [
  "Almaty",
  "Astana",
  "Shymkent",
  "Karaganda",
  "Aktobe",
  "Taraz",
];

// Currency used across the demo (localized to tenge) and the mock FX rate used to
// visualize "source marketplace price → local price" conversion.
const CURRENCY = { code: "KZT", symbol: "₸" };
const FX = { rate: 512 }; // 1 USD = ₸512 (mock)

// Interest categories drive both the chip selector and the recommender.
// Labels are i18n keys (cat_<id>).
const CATEGORIES = [
  { id: "electronics", icon: "phone" },
  { id: "fashion", icon: "shoe" },
  { id: "home", icon: "home" },
  { id: "beauty", icon: "beauty" },
  { id: "sports", icon: "ball" },
  { id: "gaming", icon: "controller" },
  { id: "kids", icon: "toy" },
  { id: "auto", icon: "car" },
];

// Mock global marketplaces being "aggregated".
const MARKETPLACES = {
  ali: { name: "AliExpress", color: "#e62e04" },
  amazon: { name: "Amazon", color: "#ff9900" },
  temu: { name: "Temu", color: "#fb7701" },
  ebay: { name: "eBay", color: "#0064d2" },
  shein: { name: "SHEIN", color: "#222222" },
};

// Local payment rails for the (conceptual) checkout — labels are real local brands,
// descriptions are i18n keys.
const PAYMENT_METHODS = [
  { id: "kaspi", label: "Kaspi Pay", icon: "wallet", descKey: "payKaspiDesc" },
  { id: "halyk", label: "Halyk Bank", icon: "bank", descKey: "payHalykDesc" },
  { id: "card", label: "Visa / Mastercard", icon: "cardpay", descKey: "payCardDesc" },
];

// First names + cities used by the live group-activity simulation.
const BUYER_NAMES = ["Aigerim", "Dias", "Marat", "Aruzhan", "Sanzhar", "Madina", "Alikhan", "Zarina", "Timur", "Dana"];

// Helper to keep product definitions compact. `hours` = mock deal-window remaining.
function p(id, title, category, marketplace, image, retail, group, min, current, tags, hours) {
  return {
    id,
    title,
    category,
    marketplace,
    image,
    retailPrice: retail,
    groupPrice: group,
    minParticipants: min,
    currentParticipants: current,
    tags: tags || [],
    endsInHours: hours || 24,
  };
}

// ~16 products across categories, marketplaces, and price points.
// currentParticipants is pre-seeded so several groups are near unlock for a punchy demo.
const PRODUCTS = [
  p("e1", "Wireless Noise-Cancelling Earbuds", "electronics", "ali", "headphones", 24990, 15990, 10, 8, ["audio", "trending"], 18),
  p("e2", "65W GaN Fast Charger", "electronics", "amazon", "charger", 11990, 7490, 10, 4, ["accessory"], 36),
  p("e3", "Smart Fitness Watch (AMOLED)", "electronics", "temu", "watch", 32990, 21990, 12, 11, ["wearable", "trending"], 9),
  p("e4", "1080p Mini Projector", "electronics", "ebay", "projector", 45990, 31990, 8, 3, ["home-cinema"], 42),

  p("f1", "Everyday Running Sneakers", "fashion", "shein", "shoe", 18990, 12490, 10, 9, ["trending"], 12),
  p("f2", "Oversized Hoodie (Unisex)", "fashion", "shein", "hoodie", 14990, 8990, 15, 6, ["streetwear"], 30),
  p("f3", "Leather Crossbody Bag", "fashion", "ali", "bag", 21990, 13990, 10, 5, [], 26),

  p("h1", "Robot Vacuum (Lidar)", "home", "amazon", "vacuum", 89990, 59990, 12, 10, ["smart-home", "trending"], 15),
  p("h2", "Ceramic Non-Stick Pan Set", "home", "temu", "pan", 27990, 17990, 10, 4, ["kitchen"], 40),
  p("h3", "Air Purifier (HEPA)", "home", "ebay", "air", 54990, 37990, 8, 2, ["smart-home"], 48),

  p("b1", "Vitamin-C Brightening Serum", "beauty", "shein", "bottle", 9990, 5990, 15, 13, ["skincare", "trending"], 8),
  p("b2", "Ionic Hair Dryer", "beauty", "ali", "dryer", 22990, 14990, 10, 6, [], 33),

  p("s1", "Adjustable Dumbbell (24kg)", "sports", "amazon", "dumbbell", 49990, 33990, 8, 3, ["fitness"], 44),
  p("s2", "Insulated Trail Bottle 1L", "sports", "temu", "bottle", 7990, 4490, 12, 9, ["outdoors"], 11),

  p("g1", "Mechanical Gaming Keyboard", "gaming", "ali", "keyboard", 26990, 17490, 10, 7, ["rgb", "trending"], 21),
  p("g2", "Wireless Game Controller", "gaming", "ebay", "controller", 19990, 12990, 10, 5, [], 27),
];

// Expose to global scope for the JSX scripts.
window.PROMOXER_DATA = { CITIES, CURRENCY, FX, CATEGORIES, MARKETPLACES, PAYMENT_METHODS, BUYER_NAMES, PRODUCTS };
