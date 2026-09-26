export const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

export async function setCache<T>(cacheManager: any, key: string, data: T) {
  await cacheManager.set(key, data, CACHE_TTL);

  return data;
}

export async function deleteCacheByPattern(
  cacheManager: any,
  pattern: string,
): Promise<void> {
  const store = cacheManager.stores?.[0] as {
    keys?: (pattern: string) => Promise<string[]>;
  };

  if (!store?.keys) {
    return;
  }

  const keys = await store.keys(pattern);

  for (const key of keys) {
    await cacheManager.del(key);
  }
}
