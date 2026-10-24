import { parseEventLogs, type Address, type Hex } from 'viem'
import { creditAbi } from '../abi.js'
import type { ProtocolAddresses } from '../config.js'
import { OrbioError } from '../errors.js'
import { beneficiaryOf, formatCredit } from '../money.js'
import { requireSigner, type Signer } from './signer.js'

/**
 * CREDIT the token, and turning it into CREDIT the balance.
 *
 * These are two different things and the difference matters. CREDIT is an
 * ERC-20 you can hold, sell or trade. **Activating** burns it and credits an
 * Orbio account with its face value less any activation fee. The resulting
 * API balance cannot be transferred back into tokens.
 *
 * Activation names a `beneficiary`, which is where the balance lands. That is
 * the one thing worth getting right: activating to the wrong beneficiary
 * succeeds on chain and puts the balance somewhere you cannot spend it.
 */

export type ActivateResult = {
  hash: Hex
  /** Base units burned. What lands as balance is this less any activation fee. */
  amountMicroUsd: bigint
  beneficiary: Hex
  /** Identifies this activation together with its chain and CREDIT contract. */
  activationId: bigint
  /** Net amount authorized by the receipt; gateway indexing may still be pending. */
  creditedMicroUsd: bigint
  feeMicroUsd: bigint
}

export class Credit {
  constructor(
    private readonly addresses: ProtocolAddresses,
    private readonly signer: Signer | null,
  ) {}

  /** CREDIT held as a token by an address, in base units. */
  async balanceOf(address?: Address): Promise<bigint> {
    const signer = requireSigner(this.signer, 'reading a CREDIT balance')
    const target = address ?? signer.address
    return await signer.public.readContract({
      address: this.addresses.credit,
      abi: creditAbi,
      functionName: 'balanceOf',
      args: [target],
    })
  }

  /**
   * Burn CREDIT and return the net amount authorized by its activation receipt.
   *
   * `beneficiary` defaults to the signing wallet, which is right when that
   * wallet is the Orbio account spending the balance. It is deliberately not
   * inferred from the API key: a key and a wallet can belong to different
   * accounts, and guessing which one you meant with money that cannot come
   * back is not a guess worth making.
   */
  async activate(opts: {
    amountMicroUsd: bigint
    beneficiary?: Address | Hex
  }): Promise<ActivateResult> {
    const signer = requireSigner(this.signer, 'activating CREDIT')
    if (opts.amountMicroUsd <= 0n) {
      throw new OrbioError('activate a positive amount of CREDIT', { code: 'invalid_request' })
    }

    const held = await this.balanceOf(signer.address)
    if (held < opts.amountMicroUsd) {
      throw new OrbioError(
        `this wallet holds ${formatCredit(held)} CREDIT and cannot activate ${formatCredit(opts.amountMicroUsd)}`,
        { code: 'invalid_request' },
      )
    }

    const beneficiary = beneficiaryFrom(opts.beneficiary ?? signer.address)
    const hash = await signer.wallet.writeContract({
      account: signer.account,
      chain: signer.chain,
      address: this.addresses.credit,
      abi: creditAbi,
      functionName: 'activate',
      args: [opts.amountMicroUsd, beneficiary],
    })
    const receipt = await signer.public.waitForTransactionReceipt({ hash })
    if (receipt.status !== 'success') {
      throw new OrbioError('the activation reverted', { code: 'unknown', status: 502 })
    }
    const events = parseEventLogs({
      abi: creditAbi,
      logs: receipt.logs.filter(log => log.address.toLowerCase() === this.addresses.credit.toLowerCase()),
      strict: true,
    })
    const activations = events.filter(event => event.eventName === 'Activated'
      && event.args.from.toLowerCase() === signer.address.toLowerCase()
      && event.args.beneficiary.toLowerCase() === beneficiary.toLowerCase()
      && event.args.amount === opts.amountMicroUsd)
    const activation = activations[0]
    if (activations.length !== 1 || !activation || activation.eventName !== 'Activated') {
      throw new OrbioError(`activation ${hash} succeeded but its receipt could not be identified; do not resubmit`, {
        code: 'outcome_unknown', status: 502,
      })
    }
    const fees = events.filter(event => event.eventName === 'ActivationFeeCharged'
      && event.args.activationId === activation.args.activationId)
    const fee = fees[0]
    const feeMicroUsd = fee?.eventName === 'ActivationFeeCharged' ? fee.args.feeAtoms : 0n
    if (fees.length > 1 || feeMicroUsd > activation.args.amount) {
      throw new OrbioError(`activation ${hash} succeeded but its fee receipt is inconsistent; do not resubmit`, {
        code: 'outcome_unknown', status: 502,
      })
    }
    return {
      hash, amountMicroUsd: activation.args.amount, beneficiary,
      activationId: activation.args.activationId,
      creditedMicroUsd: activation.args.amount - feeMicroUsd,
      feeMicroUsd,
    }
  }

  /** Whether an address pays the activation fee. The agent vault does not. */
  async feeExempt(address: Address): Promise<boolean> {
    const signer = requireSigner(this.signer, 'reading the activation fee exemption')
    return await signer.public.readContract({
      address: this.addresses.credit,
      abi: creditAbi,
      functionName: 'activationFeeExempt',
      args: [address],
    })
  }
}

/** An address or an already-wide beneficiary, as the `bytes32` the contract takes. */
const beneficiaryFrom = (value: Address | Hex): Hex => {
  if (value.length === 66) return value as Hex
  return beneficiaryOf(value as Address)
}
