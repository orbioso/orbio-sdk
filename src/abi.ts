import { parseAbi } from 'viem'

/**
 * The contract interfaces this version can call.
 *
 * These are the one thing in the SDK that is compiled in rather than fetched,
 * and that is correct: an address is a fact about a deployment and changes
 * without warning, but an interface is the shape of a function. A contract
 * whose interface moved is a contract this version genuinely cannot call, and
 * pretending otherwise would mean encoding calldata against a guess.
 *
 * Kept to what the SDK actually uses. The full ABIs live in the protocol
 * repository; a reader wanting every function should look there rather than
 * expect this file to grow.
 */

export const erc20Abi = parseAbi([
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
])

export const creditAbi = parseAbi([
  /** Burns CREDIT and credits `beneficiary` with the same face value of inference. */
  'function activate(uint256 amount, bytes32 beneficiary) returns (uint256 activationId)',
  'function balanceOf(address account) view returns (uint256)',
  'function activationFeeExempt(address account) view returns (bool)',
])

export const stakingAbi = parseAbi([
  'function stake(uint256 orbioWei)',
  'function claim() returns (uint256 creditMinted)',
  'function unstake(uint256 orbioWei) returns (uint256 positionWei)',
  'function unstakeAll(uint256[] rewardIds) returns (uint256 orbioWei, uint256 creditMinted)',
  'function settle(uint256[] rewardIds) returns (uint256 creditAtoms)',
  'function positionOf(address account) view returns (uint256 orbioWei)',
  'function settledOf(address account) view returns (uint256 creditAtoms)',
  'function MIN_POSITION() view returns (uint256)',
])

export const agentVaultAbi = parseAbi([
  'function claimCredit(uint256 agentId, bool activate) returns (uint256 creditAtoms)',
  'function withdrawPrincipal(uint256 agentId, uint256 orbioWei)',
  'function harvest(uint256[] agentIds) returns (uint256 stakedWei)',
  'function setAgentWallet(uint256 agentId, address wallet)',
  'function setBeneficiary(uint256 agentId, bytes32 beneficiary)',
  'function creditOwed(uint256 agentId) view returns (uint256 creditAtoms)',
  'function stakeOf(uint256 agentId) view returns (uint256 orbioWei)',
  'function unlocksAt(uint256 agentId) view returns (uint64)',
  'function nextAgentId() view returns (uint256)',
])

/**
 * Launching, which is separate because it is the one call a relay can never
 * sponsor: it is payable, and a sponsored operation spends the sender's own
 * ETH. An agent launches from a wallet holding ETH or it does not launch.
 */
export const agentLaunchAbi = parseAbi([
  'struct Socials { string twitter; string telegram; string discord; string website; string farcaster; }',
  'struct TokenParams { string name; string symbol; string logo; string description; Socials socials; address creatorFeeRecipient; uint16 creatorTaxBps; bool buybackEnabled; bytes32 expectedEconomics; bytes32 salt; }',
  'function launch(TokenParams params, address agentWallet, bytes32 beneficiary) payable returns (uint256 agentId, address token)',
  'event AgentLaunched(uint256 indexed agentId, address indexed token, address indexed owner, address receiver, address agentWallet, bytes32 beneficiary, uint16 feeBps, uint64 launchedAt)',
])
