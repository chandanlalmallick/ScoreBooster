// A small, dependency-free seeded PRNG (mulberry32) plus helpers.
// Using a seeded generator means a generated test is fully reproducible
// from its seed — useful for debugging and for potential "retry same
// paper" features later.

export type RNG = () => number

export function mulberry32(seed: number): RNG {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function makeSeed(): number {
  // Not cryptographic — fine for shuffling a practice-test paper.
  return (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0
}

export function randInt(rng: RNG, min: number, max: number): number {
  // inclusive of both ends
  return Math.floor(rng() * (max - min + 1)) + min
}

export function randFloat(rng: RNG, min: number, max: number, decimals = 2): number {
  const v = rng() * (max - min) + min
  const p = Math.pow(10, decimals)
  return Math.round(v * p) / p
}

export function randNonZeroInt(rng: RNG, min: number, max: number): number {
  let v = 0
  do {
    v = randInt(rng, min, max)
  } while (v === 0)
  return v
}

export function choice<T>(rng: RNG, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)]
}

export function shuffle<T>(rng: RNG, arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function sample<T>(rng: RNG, arr: T[], n: number): T[] {
  return shuffle(rng, arr).slice(0, n)
}

export function weightedPick<T>(rng: RNG, items: T[], weights: number[]): T {
  const total = weights.reduce((s, w) => s + w, 0)
  let r = rng() * total
  for (let i = 0; i < items.length; i++) {
    r -= weights[i]
    if (r <= 0) return items[i]
  }
  return items[items.length - 1]
}
