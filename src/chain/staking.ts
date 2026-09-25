import type { Address, Hex } from 'viem'
import { erc20Abi, stakingAbi } from '../abi.js'
import type { ProtocolAddresses } from '../config.js'
import { NotLiveError, OrbioError } from '../errors.js'
import { requireSigner, type Signer } from './signer.js'

/**
 * Staking ORBIO, and claiming the CREDIT it earns.
 *
 * Every hour the protocol harvests the token's creator fees, converts them to
 * USDG and mints CREDIT to stakers in proportion to what they staked and for
 * how long. Rewards are a share of fees actually collected, so there is no
 * rate to quote here and this SDK will never grow one.
 */

export type StakeResult = { hash: Hex; approvalHash: Hex | null; amountWei: bigint }

export class Staking {
  constructor(
    private readonly addresses: ProtocolAddresses,
    private readonly signer: Signer | null,
  ) {}

  private orbio(): Address {
    const orbio = this.addresses.orbio
    if (!orbio) throw new NotLiveError('ORBIO')
    return orbio
  }

  /** ORBIO currently staked by an address, in wei. */
  async positionOf(address?: Address): Promise<bigint> {
    const signer = requireSigner(this.signer, 'reading a staking position')
    return await signer.public.readContract({
      address: this.addresses.staking,
      abi: stakingAbi,
      functionName: 'positionOf',
      args: [address ?? signer.address],
    })
  }

  /** CREDIT settled and waiting to be claimed, in base units. */
  async settledOf(address?: Address): Promise<bigint> {
    const signer = requireSigner(this.signer, 'reading settled rewards')
    return await signer.public.readContract({
      address: this.addresses.staking,
      abi: stakingAbi,
      functionName: 'settledOf',
      args: [address ?? signer.address],
    })
  }

  /**
   * Stake ORBIO. Approves first when the allowance is short.
   *
   * The minimum position is read from the contract rather than assumed, so a
   * change to it becomes a clear refusal here instead of a revert nobody can
   * read.
   */
  async stake(amountWei: bigint): Promise<StakeResult> {
    const signer = requireSigner(this.signer, 'staking')
    if (amountWei <= 0n) throw new OrbioError('stake a positive amount', { code: 'invalid_request' })

    const orbio = this.orbio()
    const [held, allowance, minimum, position] = await Promise.all([
      signer.public.readContract({ address: orbio, abi: erc20Abi, functionName: 'balanceOf', args: [signer.address] }),
      signer.public.readContract({
        address: orbio,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [signer.address, this.addresses.staking],
      }),
      signer.public.readContract({ address: this.addresses.staking, abi: stakingAbi, functionName: 'MIN_POSITION' }),
      this.positionOf(signer.address),
    ])

    if (held < amountWei) {
      throw new OrbioError(`this wallet holds ${held} ORBIO wei and cannot stake ${amountWei}`, { code: 'invalid_request' })
    }
    if (position + amountWei < minimum) {
      throw new OrbioError(
        `a position has to reach ${minimum} ORBIO wei; this would leave ${position + amountWei}`,
        { code: 'invalid_request' },
      )
    }

    let approvalHash: Hex | null = null
    if (allowance < amountWei) {
      approvalHash = await signer.wallet.writeContract({
        account: signer.account,
        chain: signer.chain,
        address: orbio,
        abi: erc20Abi,
        functionName: 'approve',
        args: [this.addresses.staking, amountWei],
      })
      await signer.public.waitForTransactionReceipt({ hash: approvalHash })
    }

    const hash = await signer.wallet.writeContract({
      account: signer.account,
      chain: signer.chain,
      address: this.addresses.staking,
      abi: stakingAbi,
      functionName: 'stake',
      args: [amountWei],
    })
    await signer.public.waitForTransactionReceipt({ hash })
    return { hash, approvalHash, amountWei }
  }

  /** Take staked ORBIO back. What stays keeps earning. */
  async unstake(amountWei: bigint): Promise<Hex> {
    const signer = requireSigner(this.signer, 'unstaking')
    const hash = await signer.wallet.writeContract({
      account: signer.account,
      chain: signer.chain,
      address: this.addresses.staking,
      abi: stakingAbi,
      functionName: 'unstake',
      args: [amountWei],
    })
    await signer.public.waitForTransactionReceipt({ hash })
    return hash
  }

  /** Mint the CREDIT already settled to this wallet. */
  async claim(): Promise<Hex> {
    const signer = requireSigner(this.signer, 'claiming rewards')
    const hash = await signer.wallet.writeContract({
      account: signer.account,
      chain: signer.chain,
      address: this.addresses.staking,
      abi: stakingAbi,
      functionName: 'claim',
      args: [],
    })
    await signer.public.waitForTransactionReceipt({ hash })
    return hash
  }
}
