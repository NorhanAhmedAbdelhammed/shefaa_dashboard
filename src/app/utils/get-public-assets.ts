export function getPublicSVG(folder: string, name: string): URL['href'] {
  return new URL(`/assets/${folder}/${name}.svg`, import.meta.url ?? import.meta.env.BASE_URL).href;
}
