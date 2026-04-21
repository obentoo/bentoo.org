export type Lang = 'en' | 'pt';

export function getLang(pathname: string): Lang {
  if (pathname === '/pt' || pathname.startsWith('/pt/')) return 'pt';
  return 'en';
}
