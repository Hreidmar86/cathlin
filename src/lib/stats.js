import { average } from "./format";

export const CHART_COLORS = ["#ff9b52", "#b7ff64", "#4ce7f7", "#7ef0d8", "#ffe08f", "#7bb2ff"];

export function groupCount(items, key) {
  const map = new Map();
  items.forEach((item) => {
    const value = item[key];
    if (!value) return;
    map.set(value, (map.get(value) || 0) + 1);
  });
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
}

export function getTopCatch(items, compareKey = "lengthCm") {
  return [...items].sort((a, b) => Number(b[compareKey] || 0) - Number(a[compareKey] || 0))[0] || null;
}

export function getTopSpecies(items, species, compareKey = "lengthCm") {
  return [...items]
    .filter((item) => item.species.toLowerCase() === species.toLowerCase())
    .sort((a, b) => Number(b[compareKey] || 0) - Number(a[compareKey] || 0))[0] || null;
}

export function scoreCatch(item) {
  return (Number(item.lengthCm) || 0) * 0.7 + (Number(item.weightKg) || 0) * 18;
}

export function getBestAngler(items) {
  const map = new Map();
  items.forEach((item) => {
    const current = map.get(item.angler) || { count: 0, score: 0, totalWeight: 0 };
    current.count += 1;
    current.score += scoreCatch(item);
    current.totalWeight += Number(item.weightKg) || 0;
    map.set(item.angler, current);
  });
  return Array.from(map.entries()).sort(
    (a, b) => b[1].score - a[1].score || b[1].count - a[1].count || b[1].totalWeight - a[1].totalWeight
  )[0] || null;
}

export function getLatestCatch(items) {
  return [...items].sort((a, b) => new Date(b.caughtAt) - new Date(a.caughtAt))[0] || null;
}

export function getMonthlyCounts(items) {
  const months = new Map();
  items.forEach((item) => {
    const key = item.caughtAt?.slice(0, 7) || "okänd";
    months.set(key, (months.get(key) || 0) + 1);
  });
  return Array.from(months.entries()).sort((a, b) => a[0].localeCompare(b[0]));
}

export function getDerivedCatches(items) {
  const bestLengthBySpecies = new Map();
  const bestWeightBySpecies = new Map();

  items.forEach((item) => {
    bestLengthBySpecies.set(item.species, Math.max(bestLengthBySpecies.get(item.species) || 0, Number(item.lengthCm) || 0));
    bestWeightBySpecies.set(item.species, Math.max(bestWeightBySpecies.get(item.species) || 0, Number(item.weightKg) || 0));
  });

  return items.map((item) => ({
    ...item,
    personalBest:
      (Number(item.lengthCm) || 0) === bestLengthBySpecies.get(item.species) ||
      (Number(item.weightKg) || 0) === bestWeightBySpecies.get(item.species)
  }));
}

export function buildDashboardMetrics(items) {
  const total = items.length;
  const biggestPike = getTopSpecies(items, "Gädda");
  const biggestPerch = getTopSpecies(items, "Abborre");
  const heaviest = getTopCatch(items, "weightKg");
  const bestAngler = getBestAngler(items);
  const topMethod = groupCount(items, "method")[0];
  const bestSpot = groupCount(items, "location")[0];
  const latestTrip = getLatestCatch(items);

  return {
    total,
    biggestPike,
    biggestPerch,
    heaviest,
    bestAngler,
    topMethod,
    bestSpot,
    latestTrip
  };
}

export function buildStats(items) {
  return {
    species: groupCount(items, "species"),
    anglers: groupCount(items, "angler"),
    lengths: [...items].sort((a, b) => b.lengthCm - a.lengthCm).slice(0, 5),
    weights: [...items].sort((a, b) => b.weightKg - a.weightKg).slice(0, 5),
    months: getMonthlyCounts(items),
    spots: groupCount(items, "location").slice(0, 5),
    averageLength: average(items.map((item) => item.lengthCm).filter(Boolean), 1),
    averageWeight: average(items.map((item) => item.weightKg).filter(Boolean), 2),
    releaseRate: items.length ? Math.round((items.filter((item) => item.released).length / items.length) * 100) : 0
  };
}
