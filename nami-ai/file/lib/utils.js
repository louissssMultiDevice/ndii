export function getRandom(ext) {
  return `${Math.floor(Math.random() * 10000)}${ext}`;
}