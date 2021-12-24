import querystring from 'query-string';
export function getQueryParam<T>(): T {
  if (typeof window === 'undefined') return {} as T;
  return querystring.parse(window.location.search) as any;
}