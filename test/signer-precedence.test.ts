import { afterEach, describe, expect, it, vi } from 'vitest'
import { createWalletClient, http } from 'viem'
import { createOrbio } from '../src/client.js'
import { chainOf, makeSigner } from '../src/chain/signer.js'

const rpcUrl = 'https://example.test/rpc'
const address = '0x0000000000000000000000000000000000000001'
const other = '0x0000000000000000000000000000000000000002'
const walletClient = createWalletClient({ account: address, chain: chainOf(4663, rpcUrl), transport: http(rpcUrl) })

afterEach(() => vi.unstubAllEnvs())

describe('wallet client precedence', () => {
  it.each(['0xinvalid', `0x${'0'.repeat(64)}`] as const)('ignores an unused invalid private key: %s', account => {
    const signer = makeSigner({ walletClient, account, rpcUrl }, 4663)
    expect(signer?.wallet).toBe(walletClient)
    expect(signer?.address).toBe(address)
  })

  it('uses the wallet account when a different account is also supplied', () => {
    const signer = makeSigner({ walletClient, account: { address: other, type: 'json-rpc' }, rpcUrl }, 4663)
    expect(signer?.account).toBe(walletClient.account)
    expect(signer?.address).toBe(address)
  })

  it('ignores an invalid environment key during client initialization', async () => {
    vi.stubEnv('ORBIO_PRIVATE_KEY', '0xinvalid')
    const orbio = await createOrbio({
      walletClient, rpcUrl, apiKey: '', infraKey: '', baseUrl: 'https://example.test',
      fetch: async input => new Response(JSON.stringify(String(input).endsWith('/status') ? { chainId: 4663, addresses: null } : [])),
    })
    expect(orbio.address).toBe(address)
    expect(orbio.signer?.wallet).toBe(walletClient)
  })

  it('refuses an accountless wallet instead of falling back to a different identity', () => {
    const emptyWallet = createWalletClient({ transport: http(rpcUrl) })
    expect(() => makeSigner({ walletClient: emptyWallet, account: { address: other, type: 'json-rpc' }, rpcUrl }, 4663)).toThrow(/no account/)
  })

  it('still validates a private key when no wallet client is supplied', () => {
    expect(() => makeSigner({ account: '0xinvalid', rpcUrl }, 4663)).toThrow(/private key/)
    expect(makeSigner({ account: { address: other, type: 'json-rpc' }, rpcUrl }, 4663)?.address).toBe(other)
    expect(makeSigner({}, 4663)).toBeNull()
  })

  it('still requires an RPC endpoint for a supplied wallet', () => {
    vi.stubEnv('ORBIO_RPC_URL', '')
    expect(() => makeSigner({ walletClient }, 4663)).toThrow(/RPC endpoint/)
  })
})
