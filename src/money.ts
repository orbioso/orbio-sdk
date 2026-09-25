/**
 * Money, as integers.
 *
 * One CREDIT is one dollar and CREDIT has six decimals, so a balance is an
 * exact integer of micro-dollars. Nothing in this file ever produces a
 * JavaScript number from an amount, because `0.1 + 0.2` is not `0.3` and a
 * balance that drifts by a millionth is a balance somebody will eventually
 * argue about.
 *
 * Formatting truncates and never rounds up. Showing somebody a penny more
 * than they have is worse than showing a penny less.
 */

export const CREDIT_DECIMALS = 6
const MICRO = 1_000_000n

/** `"1.25"` becomes `1250000n`. Refuses anything that is not a plain decimal. */
export const parseCredit = (value: string | number | bigint): bigint => {
  if (typeof value === 'bigint') return value
  const text = String(value).trim()
  if (!/^\d+(\.\d{1,6})?$/.test(text)) {
    throw new TypeError(`${text} is not an amount of CREDIT. Use a decimal like "1.25", to six places at most.`)
  }
  const [whole = '0', fraction = ''] = text.split('.')
  return BigInt(whole) * MICRO + BigInt(`${fraction}000000`.slice(0, 6) || '0')
}

/** `1250000n` becomes `"1.250000"`. Truncates, never rounds up. */
export const formatCredit = (micro: bigint): string => {
  const negative = micro < 0n
  const value = negative ? -micro : micro
  const whole = value / MICRO
  const fraction = (value % MICRO).toString().padStart(CREDIT_DECIMALS, '0')
  return `${negative ? '-' : ''}${whole}.${fraction}`
}

/** The same figure with trailing zeros gone, for a sentence rather than a table. */
export const formatCreditShort = (micro: bigint): string => {
  const text = formatCredit(micro)
  return text.includes('.') ? text.replace(/0+$/, '').replace(/\.$/, '') : text
}

/**
 * An address as the `bytes32` beneficiary the protocol takes.
 *
 * A beneficiary is deliberately wider than an address: it can name an Orbio
 * account that is not an address on this chain. Left-padded, which is how the
 * contracts read an address out of one again.
 */
export const beneficiaryOf = (address: `0x${string}`): `0x${string}` =>
  `0x${address.slice(2).toLowerCase().padStart(64, '0')}`

/** Whole token units to base units, for a token of any decimals. */
export const parseUnits = (value: string | number, decimals: number): bigint => {
  const text = String(value).trim()
  if (!new RegExp(`^\\d+(\\.\\d{1,${decimals}})?$`).test(text)) {
    throw new TypeError(`${text} is not an amount with at most ${decimals} decimals`)
  }
  const [whole = '0', fraction = ''] = text.split('.')
  return BigInt(whole) * 10n ** BigInt(decimals) + BigInt(fraction.padEnd(decimals, '0') || '0')
}
