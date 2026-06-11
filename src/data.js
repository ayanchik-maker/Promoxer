/* Promoxer — mock data layer (no real APIs; hackathon demo) */

// Cities for the localized profile. lang/currency reflect the "localization" concept.
const CITIES = [
  "Almaty",
  "Astana",
  "Shymkent",
  "Karaganda",
  "Aktobe",
  "Taraz",
];

// Currency used across the demo (localized to tenge).
const CURRENCY = { code: "KZT", symbol: "₸" };

// Interest categories drive both the chip selector and the recommender.
const CATEGORIES = [
  { id: "electronics", label: "Electronics", icon: "phone" },
  { id: "fashion", label: "Fashion", icon: "shoe" },
  { id: "home", label: "Home & Kitchen", icon: "home" },
  { id: "beauty", label: "Beauty", icon: "beauty" },
  { id: "sports", label: "Sports & Outdoors", icon: "ball" },
  { id: "gaming", label: "Gaming", icon: "controller" },
  { id: "kids", label: "Kids & Baby", icon: "toy" },
  { id: "auto", label: "Auto", icon: "car" },
];

// Mock global marketplaces being "aggregated".
const MARKETPLACES = {
  ali: { name: "AliExpress", color: "#e62e04" },
  amazon: { name: "Amazon", color: "#ff9900" },
  temu: { name: "Temu", color: "#fb7701" },
  ebay: { name: "eBay", color: "#0064d2" },
  shein: { name: "SHEIN", color: "#222222" },
};

// Helper to keep product definitions compact.
function p(id, title, category, marketplace, image, retail, group, min, current, tags) {
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
  };
}

// ~16 products across categories, marketplaces, and price points.
// currentParticipants is pre-seeded so several groups are near unlock for a punchy demo.
const PRODUCTS = [
  p("e1", "Wireless Noise-Cancelling Earbuds", "electronics", "ali", "headphones", 24990, 15990, 10, 8, ["audio", "trending"]),
  p("e2", "65W GaN Fast Charger", "electronics", "amazon", "charger", 11990, 7490, 10, 4, ["accessory"]),
  p("e3", "Smart Fitness Watch (AMOLED)", "electronics", "temu", "watch", 32990, 21990, 12, 11, ["wearable", "trending"]),
  p("e4", "1080p Mini Projector", "electronics", "ebay", "projector", 45990, 31990, 8, 3, ["home-cinema"]),

  p("f1", "Everyday Running Sneakers", "fashion", "shein", "shoe", 18990, 12490, 10, 9, ["trending"]),
  p("f2", "Oversized Hoodie (Unisex)", "fashion", "shein", "hoodie", 14990, 8990, 15, 6, ["streetwear"]),
  p("f3", "Leather Crossbody Bag", "fashion", "ali", "bag", 21990, 13990, 10, 5, []),

  p("h1", "Robot Vacuum (Lidar)", "home", "amazon", "vacuum", 89990, 59990, 12, 10, ["smart-home", "trending"]),
  p("h2", "Ceramic Non-Stick Pan Set", "home", "temu", "pan", 27990, 17990, 10, 4, ["kitchen"]),
  p("h3", "Air Purifier (HEPA)", "home", "ebay", "air", 54990, 37990, 8, 2, ["smart-home"]),

  p("b1", "Vitamin-C Brightening Serum", "beauty", "shein", "bottle", 9990, 5990, 15, 13, ["skincare", "trending"]),
  p("b2", "Ionic Hair Dryer", "beauty", "ali", "dryer", 22990, 14990, 10, 6, []),

  p("s1", "Adjustable Dumbbell (24kg)", "sports", "amazon", "dumbbell", 49990, 33990, 8, 3, ["fitness"]),
  p("s2", "Insulated Trail Bottle 1L", "sports", "temu", "bottle", 7990, 4490, 12, 9, ["outdoors"]),

  p("g1", "Mechanical Gaming Keyboard", "gaming", "ali", "keyboard", 26990, 17490, 10, 7, ["rgb", "trending"]),
  p("g2", "Wireless Game Controller", "gaming", "ebay", "controller", 19990, 12990, 10, 5, []),
];

// Expose to global scope for the JSX scripts.
window.PROMOXER_DATA = { CITIES, CURRENCY, CATEGORIES, MARKETPLACES, PRODUCTS };
