export function randomInt(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min));
}

export function randomChoice<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length)];
}
