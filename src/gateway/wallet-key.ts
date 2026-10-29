import { compactSignatureToSignature, hexToBytes, parseCompactSignature, serializeSignature, type Account, type Hex, type WalletClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { OrbioError } from '../errors.js'

/**
 * A wallet's own Orbio key, made from one signature and nothing else.
 *
 * The wallet signs a fixed line, `Orbio API key · chain 4663 · epoch N`, and
 * that signature in base64, behind `sk-orb-N-`, is the key. Nothing is issued,
 * no account has to exist first and nobody signs in anywhere: whatever CREDIT is
 * activated to the wallet is the balance the key spends. The gateway rebuilds
 * the line from the N in the key and recovers the wallet, so the text here has
 * to match it character for character, middle dots included.
 *
 * Signing a higher epoch rotates: the first request that uses it retires every
 * lower epoch for that wallet. Only the private key can raise it, which is also
 * how a leaked key is stopped.
 *
 * A contract wallet cannot make one. Its signature is not recoverable to its
 * address, so it is refused here rather than at the gateway.
 */

export const WALLET_KEY_PREFIX = 'sk-orb-'

/** The chain the line names unless told otherwise: Robinhood Chain, where CREDIT lives. */
export const WALLET_KEY_CHAIN_ID = 4663

/** Fifteen digits, so the epoch survives the gateway's read of it as a number. */
const MAX_EPOCH = 999_999_999_999_999

export type WalletKeyOptions = {
  /** Start at 0. Sign a higher one to rotate. */
  epoch?: number
  /** The chain the gateway is on. Only a preview or a local stack differs. */
  chainId?: number
}

/** A viem Account, a WalletClient with an account on it, or a `0x` private key. */
export type WalletKeySigner = Account | WalletClient | `0x${string}`

/** The exact line a wallet signs for its key. */
export const walletKeyMessage = (epoch = 0, chainId = WALLET_KEY_CHAIN_ID): string =>
  `Orbio API key · chain ${chainId} · epoch ${epoch}`

const checkedEpoch = (epoch: number): number => {
  if (!Number.isInteger(epoch) || epoch < 0 || epoch > MAX_EPOCH) {
    throw new OrbioError('a wallet key epoch is a whole number from 0 to 999999999999999', { code: 'invalid_request' })
  }
  return epoch
}

/** Standard base64 without `Buffer`, so the same code runs in Node, Deno, Bun and a worker. */
const base64 = (bytes: Uint8Array): string => {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

const isWalletClient = (wallet: Account | WalletClient): wallet is WalletClient => 'type' in wallet && wallet.type === 'walletClient'

const signatureOf = async (wallet: WalletKeySigner, message: string): Promise<Hex> => {
  if (typeof wallet === 'string') {
    if (!/^0x[0-9a-fA-F]{64}$/.test(wallet)) {
      throw new OrbioError('a private key is 0x followed by 64 hex characters', { code: 'invalid_request' })
    }
    return await privateKeyToAccount(wallet).signMessage({ message })
  }
  if (isWalletClient(wallet)) {
    if (!wallet.account) throw new OrbioError('the wallet client given has no account on it', { code: 'invalid_request' })
    return await wallet.signMessage({ account: wallet.account, message })
  }
  if (wallet.type === 'local') return await wallet.signMessage({ message })
  throw new OrbioError(
    wallet.type === 'smart'
      ? 'a smart account cannot make an Orbio wallet key: its signature does not recover to its address. Sign with an EOA and activate CREDIT to it.'
      : 'a JSON-RPC account signs through its wallet client. Pass the WalletClient instead.',
    { code: 'invalid_request' },
  )
}

/**
 * The key from one signature, refusing anything the gateway would refuse. A
 * 64-byte compact signature (EIP-2098) is the same signature written shorter,
 * so it is widened to the 65 bytes the gateway reads; anything else that is not
 * 65 bytes is not an EOA's, most often a contract wallet's.
 */
export const walletKeyFromSignature = (signature: Hex, epoch = 0): string => {
  let bytes = hexToBytes(signature)
  if (bytes.length === 64) bytes = hexToBytes(serializeSignature(compactSignatureToSignature(parseCompactSignature(signature))))
  if (bytes.length !== 65) {
    throw new OrbioError(
      `that wallet returned a ${bytes.length}-byte signature. An Orbio wallet key needs an EOA's 65-byte signature, which a contract wallet cannot make.`,
      { code: 'invalid_request' },
    )
  }
  return `${WALLET_KEY_PREFIX}${checkedEpoch(epoch)}-${base64(bytes)}`
}

/**
 * The wallet's Orbio key.
 *
 * ```ts
 * const ORBIO_API_KEY = await walletKey(process.env.ORBIO_PRIVATE_KEY as `0x${string}`)
 * ```
 *
 * Signed locally: nothing leaves the process but the key you then send.
 */
export const walletKey = async (wallet: WalletKeySigner, options: WalletKeyOptions = {}): Promise<string> => {
  const epoch = checkedEpoch(options.epoch ?? 0)
  return walletKeyFromSignature(await signatureOf(wallet, walletKeyMessage(epoch, options.chainId)), epoch)
}
