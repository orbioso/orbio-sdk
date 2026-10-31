import { describe, expect, it } from 'vitest'
import { createWalletClient, http, serializeCompactSignature, signatureToCompactSignature, parseSignature } from 'viem'
import { privateKeyToAccount, toAccount } from 'viem/accounts'
import {
  createOrbio,
  keepFunded,
  OrbioError,
  topUp,
  walletKey,
  walletKeyFromSignature,
  walletKeyMessage,
  WalletNotActivatedError,
} from '../src/index.js'
import type { Account } from '../src/gateway/account.js'
import type { Credit } from '../src/chain/credit.js'
import type { Swap } from '../src/chain/swap.js'

/**
 * A wallet is enough. These pin the key to the byte, because the gateway
 * recovers the wallet from exactly this text and encoding, and a key that is
 * one character off is refused at the first request rather than here.
 */

// The same fixture the gateway's own tests use, and the key they recover from it.
const PRIVATE_KEY = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'
const ADDRESS = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
const EPOCH_0 = 'sk-orb-0-a4FgRUx5TRqryY0DLtN50CKe4evuEoGiQyZvxMb7z/QUFtDy2f6Yw2AViJ/nCMF/NlGD0gDhQW4JU5dgvFXxohs='

const status = {
  live: true,
  chainId: 4663,
  explorer: 'https://robin.etherscan.io',
  addresses: null,
  paused: { staking: false, exchange: false },
  indexer: { healthy: true, halted: false, haltReason: null, lagBlocks: 0 },
}

/** Answers the startup reads and `/api/v1/key`, recording the credential each request carried. */
const gateway = (seen: (string | null)[], key: () => Response = () => new Response('{}', { status: 404 })) =>
  (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input)
    seen.push(new Headers(init?.headers).get('authorization'))
    if (url.endsWith('/api/protocol/status')) return new Response(JSON.stringify(status))
    if (url.endsWith('/api/v1/tools')) return new Response(JSON.stringify({ object: 'list', data: [] }))
    if (url.endsWith('/api/v1/key')) return key()
    return new Response(JSON.stringify({ error: { message: 'not stubbed', code: 'unknown' } }), { status: 404 })
  }) as typeof fetch

const unfunded = () => new Response(JSON.stringify({
  error: { message: `Orbio has no account for ${ADDRESS.toLowerCase()}`, type: 'insufficient_quota', code: 'wallet_not_activated', param: null, address: ADDRESS.toLowerCase() },
}), { status: 402 })

const keyBody = (available: string) => new Response(JSON.stringify({
  object: 'key',
  key: { kind: 'wallet', prefix: 'sk-orb-0', label: null, created_at: null, address: ADDRESS.toLowerCase() },
  balance: { currency: 'USD', available, used: '0', available_micro_usd: String(Number(available) * 1_000_000), used_micro_usd: '0' },
  rate_limit: { requests_per_minute: 120, concurrent: 32 },
}))

describe('a wallet key is one signature of one line', () => {
  it('signs the exact line the gateway rebuilds', () => {
    expect(walletKeyMessage()).toBe('Orbio API key · chain 4663 · epoch 0')
    expect(walletKeyMessage(7)).toBe('Orbio API key · chain 4663 · epoch 7')
    expect(walletKeyMessage(2, 46630)).toBe('Orbio API key · chain 46630 · epoch 2')
  })

  it('is the same key from a private key, an Account and a WalletClient', async () => {
    const account = privateKeyToAccount(PRIVATE_KEY)
    const client = createWalletClient({ account, transport: http('https://rpc.invalid') })
    expect(await walletKey(PRIVATE_KEY)).toBe(EPOCH_0)
    expect(await walletKey(account)).toBe(EPOCH_0)
    expect(await walletKey(client)).toBe(EPOCH_0)
  })

  it('carries its epoch, and refuses one the gateway could not read', async () => {
    expect(await walletKey(PRIVATE_KEY, { epoch: 3 })).toMatch(/^sk-orb-3-[A-Za-z0-9+/]{87}=$/)
    for (const epoch of [-1, 1.5, 1e16]) await expect(walletKey(PRIVATE_KEY, { epoch })).rejects.toThrow(/epoch/)
  })

  it('refuses a contract wallet\'s signature rather than minting a key that can never work', () => {
    expect(() => walletKeyFromSignature(`0x${'ab'.repeat(97)}`)).toThrow(/contract wallet cannot make/)
    expect(() => walletKeyFromSignature(`0x${'ab'.repeat(65)}`, 0)).not.toThrow()
  })

  it('widens a 64-byte compact signature to the 65 bytes the gateway reads', async () => {
    const full = await privateKeyToAccount(PRIVATE_KEY).signMessage({ message: walletKeyMessage() })
    const compact = serializeCompactSignature(signatureToCompactSignature(parseSignature(full)))
    expect(compact.length).toBe(2 + 128)
    expect(walletKeyFromSignature(compact)).toBe(EPOCH_0)
  })
})

describe('a client given a wallet and no key spends as that wallet', () => {
  it('signs its own key and sends it on every gateway call', async () => {
    const seen: (string | null)[] = []
    const orbio = await createOrbio({ fetch: gateway(seen, () => keyBody('25')), baseUrl: 'https://example.test', account: PRIVATE_KEY, rpcUrl: 'https://rpc.invalid' })
    const balance = await orbio.account.balance()
    expect(balance.availableMicroUsd).toBe(25_000_000n)
    expect(seen.at(-1)).toBe(`Bearer ${EPOCH_0}`)
  })

  it('never signs unprompted with a wallet it does not hold: a WalletClient, or a hardware, HSM or KMS account', async () => {
    let asked = 0
    const held = privateKeyToAccount(PRIVATE_KEY)
    const custom = toAccount({
      address: held.address,
      signMessage: async (args) => { asked++; return held.signMessage(args) },
      signTransaction: (args) => held.signTransaction(args),
      signTypedData: (args) => held.signTypedData(args),
    })
    for (const wallet of [
      { walletClient: createWalletClient({ account: ADDRESS, transport: http('https://rpc.invalid') }) },
      { walletClient: createWalletClient({ account: held, transport: http('https://rpc.invalid') }) },
      { account: custom },
    ]) {
      const seen: (string | null)[] = []
      await createOrbio({ fetch: gateway(seen), baseUrl: 'https://example.test', rpcUrl: 'https://rpc.invalid', ...wallet })
      expect(seen.every((header) => header === null)).toBe(true)
    }
    expect(asked).toBe(0)
    // Asked outright, any of them makes the same key.
    expect(await walletKey(custom)).toBe(EPOCH_0)
    expect(asked).toBe(1)
  })

  it('keeps a key it was given, signs at the epoch it is told, and signs nothing when told not to', async () => {
    const given: (string | null)[] = []
    await (await createOrbio({ fetch: gateway(given, () => keyBody('1')), baseUrl: 'https://example.test', apiKey: 'sk-orbio-given', account: PRIVATE_KEY, rpcUrl: 'https://rpc.invalid' })).account.balance()
    expect(given.at(-1)).toBe('Bearer sk-orbio-given')

    const rotated: (string | null)[] = []
    await (await createOrbio({ fetch: gateway(rotated, () => keyBody('1')), baseUrl: 'https://example.test', account: PRIVATE_KEY, rpcUrl: 'https://rpc.invalid', walletKey: { epoch: 4 } })).account.balance()
    expect(rotated.at(-1)).toBe(`Bearer ${await walletKey(PRIVATE_KEY, { epoch: 4 })}`)

    const none: (string | null)[] = []
    await createOrbio({ fetch: gateway(none), baseUrl: 'https://example.test', account: PRIVATE_KEY, rpcUrl: 'https://rpc.invalid', walletKey: false })
    expect(none.every((header) => header === null)).toBe(true)
  })

  it('reads a wallet with nothing activated as its own error, naming the wallet', async () => {
    const orbio = await createOrbio({ fetch: gateway([], unfunded), baseUrl: 'https://example.test', account: PRIVATE_KEY, rpcUrl: 'https://rpc.invalid' })
    const caught = await orbio.account.balance().then(() => null, (error: unknown) => error)
    expect(caught).toBeInstanceOf(WalletNotActivatedError)
    expect(caught).toBeInstanceOf(OrbioError)
    expect((caught as WalletNotActivatedError).address).toBe(ADDRESS.toLowerCase())
    expect((caught as WalletNotActivatedError).code).toBe('wallet_not_activated')
    expect((caught as WalletNotActivatedError).retryable).toBe(false)
  })
})

describe('a new wallet can top itself up for the first time', () => {
  it('counts no account as zero, and waits through it until the activation lands', async () => {
    let reads = 0
    const account = {
      // Unfunded for the first two reads, as a wallet is until its activation is indexed.
      balance: async () => {
        reads += 1
        if (reads <= 2) throw new WalletNotActivatedError('no account yet', ADDRESS.toLowerCase())
        return { availableMicroUsd: 9_500_000n, usedMicroUsd: 0n, available: '9.5', used: '0' }
      },
    } as unknown as Account
    // A new wallet holds no CREDIT until the swap delivers it.
    let held = 0n
    const swap = { buy: async () => { held += 10_000_000n; return { hash: '0xaa', creditOut: 10_000_000n } } } as unknown as Swap
    const credit = {
      wallet: ADDRESS,
      balanceOf: async () => held,
      activate: async () => ({ hash: '0xbb' }),
    } as unknown as Credit
    const result = await topUp({ swap, credit, account }, { token: 'USDG', amount: '10', confirmMs: 10_000 })
    expect(result.beforeMicroUsd).toBe(0n)
    expect(result.afterMicroUsd).toBe(9_500_000n)
    expect(result.creditedMicroUsd).toBe(9_500_000n)
    expect(result.warning).toBeNull()
  }, 15_000)

  it('says the first activation is not indexed yet, rather than blaming the beneficiary', async () => {
    const account = { balance: async () => { throw new WalletNotActivatedError('no account yet', ADDRESS.toLowerCase()) } } as unknown as Account
    let held = 0n
    const swap = { buy: async () => { held += 1_000_000n; return { hash: '0xaa', creditOut: 1_000_000n } } } as unknown as Swap
    const credit = { wallet: ADDRESS, balanceOf: async () => held, activate: async () => ({ hash: '0xbb' }) } as unknown as Credit
    const result = await topUp({ swap, credit, account }, { token: 'USDG', amount: '1', confirmMs: 2_100 })
    expect(result.creditedMicroUsd).toBe(0n)
    expect(result.warning).toMatch(/not seen this wallet's first activation/)
  }, 10_000)

  it('refuses before buying when the key spends as another wallet than the CREDIT lands on', async () => {
    let bought = 0
    const other = '0x' + 'cd'.repeat(20)
    const account = { balance: async () => { throw new WalletNotActivatedError('no account yet', other) } } as unknown as Account
    const swap = { buy: async () => { bought++; return { hash: '0xaa', creditOut: 1n } } } as unknown as Swap
    const credit = { wallet: ADDRESS, balanceOf: async () => BigInt(bought), activate: async () => ({ hash: '0xbb' }) } as unknown as Credit
    await expect(topUp({ swap, credit, account }, { token: 'USDG', amount: '1' })).rejects.toThrow(/spends as 0xcdcd/)
    // A beneficiary named outright is held to the same rule, as an address or as bytes32.
    await expect(topUp({ swap, credit, account }, { token: 'USDG', amount: '1', beneficiary: ADDRESS })).rejects.toThrow(/spends as/)
    // And a loop that keeps a floor stops, rather than buying for ever.
    await expect(keepFunded({ swap, credit, account }, { floor: '1', buy: { token: 'USDG', amount: '1' } }).next()).rejects.toThrow(/spends as/)
    expect(bought).toBe(0)
    // The wallet the key spends as, named as the beneficiary in bytes32, is the right one.
    const aligned = { balance: async () => { throw new WalletNotActivatedError('no account yet', ADDRESS.toLowerCase()) } } as unknown as Account
    const result = await topUp({ swap, credit, account: aligned }, { token: 'USDG', amount: '1', beneficiary: `0x${'0'.repeat(24)}${ADDRESS.slice(2)}`, confirmMs: 1 })
    expect(result.beforeMicroUsd).toBe(0n)
  }, 10_000)

  it('still fails on anything that is not a missing account', async () => {
    const account = { balance: async () => { throw new OrbioError('revoked', { code: 'invalid_api_key', status: 401 }) } } as unknown as Account
    await expect(topUp({ swap: {} as Swap, credit: {} as Credit, account }, { token: 'USDG', amount: '1' })).rejects.toThrow('revoked')
  })
})
