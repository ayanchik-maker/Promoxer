/* Promoxer — simple, explainable recommendation logic.
   Ranks products by interest/category match, budget fit, and city signal.
   No real ML — transparent additive scoring suitable for a demo.
   Reasons are returned as i18n keys so the UI can localize them. */

function scoreProduct(product, profile) {
  if (!profile) return { score: 0, reasons: [] };
  let score = 0;
  const reasons = [];

  // 1) Interest / category match — the heaviest signal.
  const interests = profile.interests || [];
  if (interests.includes(product.category)) {
    score += 50;
    reasons.push("reasonInterests");
  }

  // 2) Budget fit — the price a user actually pays is the group price.
  const budget = profile.budget || 0;
  if (budget > 0) {
    if (product.groupPrice <= budget) {
      score += 25;
      reasons.push("reasonBudget");
    } else if (product.groupPrice <= budget * 1.25) {
      score += 10; // just slightly over — still worth surfacing
    } else {
      score -= 15; // well over budget — push down
    }
  }

  // 3) Trending / social proof bonus (helps cold-start when interests are sparse).
  if ((product.tags || []).includes("trending")) {
    score += 8;
    reasons.push("reasonTrending");
  }

  // 4) Near-unlock nudge — almost-complete groups are more compelling.
  const progress = product.currentParticipants / product.minParticipants;
  if (progress >= 0.8) {
    score += 6;
    reasons.push("reasonAlmost");
  }

  return { score, reasons };
}

// Returns products sorted by score desc. Optional categoryFilter narrows the feed.
function recommendFeed(products, profile, categoryFilter) {
  let list = products;
  if (categoryFilter && categoryFilter !== "all") {
    list = list.filter((p) => p.category === categoryFilter);
  }
  return list
    .map((p) => ({ product: p, ...scoreProduct(p, profile) }))
    .sort((a, b) => b.score - a.score);
}

window.PROMOXER_RECO = { scoreProduct, recommendFeed };
