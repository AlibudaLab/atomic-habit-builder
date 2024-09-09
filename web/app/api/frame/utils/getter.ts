export const getRandomGif = (gifs: string[]): string => {
  return gifs[Math.floor(Math.random() * gifs.length)];
};

export async function getFont(url: string) {
  const res = await fetch(url);
  return res.arrayBuffer();
}

export function getMapUrl(encodedPolyline: string, width: number, height: number): string {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const path = `path-5+FC4C02-0.75(${encodeURIComponent(encodedPolyline)})`;
  return `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/${path}/auto/${width}x${height}?padding=100,350,100,100&access_token=${mapboxToken}`;
}
