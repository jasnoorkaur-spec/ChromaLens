export function withManagedTiDBTls(databaseUrl) {
  if (typeof databaseUrl !== 'string' || !databaseUrl.trim()) return databaseUrl;
  try {
    const parsed = new URL(databaseUrl);
    if (parsed.protocol !== 'mysql:' || !parsed.hostname.endsWith('.tidbcloud.com')) return databaseUrl;
    if (parsed.searchParams.has('sslaccept')) return databaseUrl;
    parsed.searchParams.set('sslaccept', 'strict');
    return parsed.toString();
  } catch {
    return databaseUrl;
  }
}
