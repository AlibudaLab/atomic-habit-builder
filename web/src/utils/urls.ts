export type QueryParams = Record<string, string>;

export const encodeUrlQueryParams = (queryParams: QueryParams) => {
  return Object.entries(queryParams)
    .map((kv) => kv.map(encodeURIComponent).join('='))
    .join('&');
};

export function encodePolyline(polyline: string): string {
  return polyline.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

export function decodePolyline(encodedPolyline: string): string {
  return encodedPolyline.replace(/\\'/g, "'").replace(/\\\\/g, '\\');
}

export const objectToQueryParams = (queryParams: QueryParams) => {
  return Object.entries(queryParams)
    .map((kv) => kv.join('='))
    .join('&');
};

export const urlWithQueryParams = (url: string, queryParams: QueryParams) => {
  return `${url}?${encodeUrlQueryParams(queryParams)}`;
};

export function isValidUrl(string?: string) {
  if (!string) return false;
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
