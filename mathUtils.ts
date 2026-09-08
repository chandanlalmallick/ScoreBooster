export function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    ;[a, b] = [b, a % b]
  }
  return a || 1
}

export function formatSignedTerm(coeff: number, variable: string, isFirst = false): string {
  if (coeff === 0) return ''
  const sign = coeff < 0 ? '-' : isFirst ? '' : '+'
  const abs = Math.abs(coeff)
  const coeffStr = abs === 1 ? '' : `${abs}`
  const spacer = isFirst ? '' : ' '
  return `${spacer}${sign}${sign && !isFirst ? ' ' : ''}${coeffStr}${variable}`
}

export function fmtNum(n: number): string {
  if (Number.isInteger(n)) return `${n}`
  return n.toFixed(2).replace(/\.?0+$/, '')
}

export function fraction(numerator: number, denominator: number): string {
  const g = gcd(numerator, denominator)
  let n = numerator / g
  let d = denominator / g
  if (d < 0) {
    n = -n
    d = -d
  }
  if (d === 1) return `${n}`
  return `${n}/${d}`
}

/** Simple deterministic string hash — used to build question fingerprints. */
export function hashString(s: string): string {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  }
  return (h >>> 0).toString(36)
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export function det2(a: number, b: number, c: number, d: number): number {
  return a * d - b * c
}

export function det3(m: number[][]): number {
  return (
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
  )
}

export function factorial(n: number): number {
  let r = 1
  for (let i = 2; i <= n; i++) r *= i
  return r
}

export function nCr(n: number, r: number): number {
  if (r < 0 || r > n) return 0
  return Math.round(factorial(n) / (factorial(r) * factorial(n - r)))
}

export function isPrime(n: number): boolean {
  if (n < 2) return false
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false
  }
  return true
}
