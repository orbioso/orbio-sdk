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

  /** Latest finalized reward period. Zero means none have finalized yet. */
  async lastRewardId(): Promise<bigint> {
    const signer = requireSigner(this.signer, 'reading finalized rewards')
    return await signer.public.readContract({
      address: this.addresses.staking, abi: stakingAbi, functionName: 'lastRewardId',
    })
  }

  /** A finalized period's reward and whether it has already been settled. */
  async rewardOf(rewardId: bigint, address?: Address): Promise<{ creditAtoms: bigint; settled: boolean }> {
    const signer = requireSigner(this.signer, 'reading a reward')
    if (rewardId <= 0n) throw new OrbioError('use a positive finalized reward ID', { code: 'invalid_request' })
    const [creditAtoms, settled] = await signer.public.readContract({
      address: this.addresses.staking, abi: stakingAbi, functionName: 'rewardOf',
      args: [address ?? signer.address, rewardId],
    })
    return { creditAtoms, settled }
  }

  /** Settle selected finalized periods before claiming. IDs must be strictly increasing. */
  async settle(rewardIds: readonly bigint[]): Promise<Hex> {
    const signer = requireSigner(this.signer, 'settling rewards')
    const ids = [...rewardIds]
    if (ids.length === 0) throw new OrbioError('select at least one reward period', { code: 'invalid_request' })
    let previous = 0n
    for (const id of ids) {
      if (id <= previous) throw new OrbioError('reward IDs must be positive and strictly increasing', { code: 'invalid_request' })
      previous = id
    }
    const [maximum, latest] = await Promise.all([
      signer.public.readContract({ address: this.addresses.staking, abi: stakingAbi, functionName: 'MAX_PERIODS_PER_CALL' }),
      this.lastRewardId(),
    ])
    if (BigInt(ids.length) > maximum) {
      throw new OrbioError(`settle at most ${maximum} reward periods per call`, { code: 'invalid_request' })
    }
    if (previous > latest) throw new OrbioError(`reward periods are finalized only through ${latest}`, { code: 'invalid_request' })
    const hash = await signer.wallet.writeContract({
      account: signer.account, chain: signer.chain,
      address: this.addresses.staking, abi: stakingAbi, functionName: 'settle', args: [ids],
    })
    const receipt = await signer.public.waitForTransactionReceipt({ hash })
    if (receipt.status !== 'success') throw new OrbioError('the reward settlement reverted', { code: 'unknown', status: 502 })
    return hash
  }

  /** Mint already-settled CREDIT. Call settle(rewardIds) first for unsettled periods. */
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
