export function shuffleArray<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function readStringList(key: string): string[] {
  try {
    const value = localStorage.getItem(key);
    const parsed: unknown = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function writeStringList(key: string, values: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(values));
  } catch {
    // Private browsing or storage restrictions should not prevent a game from starting.
  }
}

/**
 * Picks unseen entries first, avoids the most recently shown entries, and never
 * duplicates an item inside one session. A new cycle starts only after the pool
 * has been consumed.
 */
export function pickFresh<T>(items: readonly T[], idOf: (item: T) => string | number, historyKey: string, count = 1): T[] {
  const unique = new Map<string, T>();
  items.forEach((item) => unique.set(String(idOf(item)), item));
  const pool = [...unique.entries()];
  if (pool.length === 0 || count <= 0) return [];

  const amount = Math.min(Math.floor(count), pool.length);
  const validIds = new Set(pool.map(([id]) => id));
  const historyStorageKey = `sikildim:seen:${historyKey}`;
  const recentStorageKey = `sikildim:recent:${historyKey}`;
  const seen = new Set(readStringList(historyStorageKey).filter((id) => validIds.has(id)));
  const recent = new Set(readStringList(recentStorageKey).filter((id) => validIds.has(id)));

  const unseen = pool.filter(([id]) => !seen.has(id));
  const unseenNotRecent = shuffleArray(unseen.filter(([id]) => !recent.has(id)));
  const unseenRecent = shuffleArray(unseen.filter(([id]) => recent.has(id)));
  let candidates = [...unseenNotRecent, ...unseenRecent];
  let cycleFinished = unseen.length < amount;

  // If the current cycle is nearly complete, finish it before starting another.
  const selected = candidates.slice(0, amount);
  if (selected.length < amount) {
    const selectedIds = new Set(selected.map(([id]) => id));
    const previousCycle = shuffleArray(pool.filter(([id]) => !selectedIds.has(id) && !recent.has(id)));
    const fallback = shuffleArray(pool.filter(([id]) => !selectedIds.has(id) && !previousCycle.some(([candidateId]) => candidateId === id)));
    selected.push(...previousCycle.slice(0, amount - selected.length));
    if (selected.length < amount) selected.push(...fallback.slice(0, amount - selected.length));
    cycleFinished = true;
  }

  const chosenIds = selected.map(([id]) => id);
  const updatedSeen = new Set([...seen, ...chosenIds]);
  if (cycleFinished || updatedSeen.size >= pool.length) {
    // Keep this batch marked as seen so the next cycle cannot immediately repeat it.
    writeStringList(historyStorageKey, chosenIds);
  } else {
    writeStringList(historyStorageKey, [...updatedSeen]);
  }

  const recentLimit = Math.min(8, Math.max(1, pool.length - 1));
  const updatedRecent = [...readStringList(recentStorageKey).filter((id) => !chosenIds.includes(id)), ...chosenIds].slice(-recentLimit);
  writeStringList(recentStorageKey, updatedRecent);
  return selected.map(([, item]) => item);
}

/** Reorders a random selection so the same topic is not shown several times in a row. */
export function pickFreshDiverse<T>(
  items: readonly T[],
  idOf: (item: T) => string | number,
  groupOf: (item: T) => string,
  historyKey: string,
  count = 1,
): T[] {
  const unique = new Map<string, T>();
  items.forEach((item) => unique.set(String(idOf(item)), item));
  const pool = [...unique.entries()];
  if (pool.length === 0 || count <= 0) return [];

  const validIds = new Set(pool.map(([id]) => id));
  const seenKey = `sikildim:seen:${historyKey}`;
  const recentKey = `sikildim:recent:${historyKey}`;
  const groupHistoryKey = `sikildim:recent-groups:${historyKey}`;
  let seen = new Set(readStringList(seenKey).filter((id) => validIds.has(id)));
  const recent = new Set(readStringList(recentKey).filter((id) => validIds.has(id)));
  const groupHistory = readStringList(groupHistoryKey);
  let previousGroup = groupHistory[groupHistory.length - 1] ?? '';
  const selected: T[] = [];
  const selectedIds = new Set<string>();
  const amount = Math.min(Math.floor(count), pool.length);
  let cycleFinished = false;

  for (let index = 0; index < amount; index++) {
    let remaining = pool.filter(([id]) => !seen.has(id) && !selectedIds.has(id));
    if (remaining.length === 0) {
      // Only start a new cycle after every item in the full pool has been used.
      cycleFinished = true;
      seen = new Set();
      remaining = pool.filter(([id]) => !selectedIds.has(id) && !recent.has(id));
      if (remaining.length === 0) remaining = pool.filter(([id]) => !selectedIds.has(id));
    }
    if (remaining.length === 0) break;

    const grouped = new Map<string, Array<[string, T]>>();
    remaining.forEach((entry) => {
      const group = groupOf(entry[1]) || 'Genel';
      grouped.set(group, [...(grouped.get(group) ?? []), entry]);
    });
    let candidateGroups = [...grouped.entries()].filter(([group]) => group !== previousGroup);
    if (candidateGroups.length === 0) candidateGroups = [...grouped.entries()];
    const [groupName, groupItems] = candidateGroups[Math.floor(Math.random() * candidateGroups.length)];
    const notRecent = groupItems.filter(([id]) => !recent.has(id));
    const candidates = notRecent.length > 0 ? notRecent : groupItems;
    const [chosenId, chosenItem] = candidates[Math.floor(Math.random() * candidates.length)];

    selected.push(chosenItem);
    selectedIds.add(chosenId);
    seen.add(chosenId);
    previousGroup = groupName;
    groupHistory.push(groupName);
  }

  writeStringList(seenKey, cycleFinished ? [...selectedIds] : [...seen]);
  const recentLimit = Math.min(8, Math.max(1, pool.length - 1));
  const updatedRecent = [...readStringList(recentKey).filter((id) => !selectedIds.has(id)), ...selectedIds].slice(-recentLimit);
  writeStringList(recentKey, updatedRecent);
  writeStringList(groupHistoryKey, groupHistory.slice(-6));
  return selected;
}

export function getBestScore(gameId: string, _lowerIsBetter = false): number | null {
  try {
    const value = localStorage.getItem(`sikildim:best:${gameId}`);
    if (value === null) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveBestScore(gameId: string, score: number, lowerIsBetter = false): number {
  const old = getBestScore(gameId, lowerIsBetter);
  const best = old === null || (lowerIsBetter ? score < old : score > old) ? score : old;
  try {
    localStorage.setItem(`sikildim:best:${gameId}`, String(best));
  } catch {
    // A game remains playable when local storage is unavailable.
  }
  return best;
}

export function normalizeTurkish(value: string): string {
  return value.trim().toLocaleUpperCase('tr-TR').replace(/\s+/g, ' ');
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
