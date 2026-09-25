# @orbiodotso/sdk

One key for AI inference, agent tools and the CREDIT protocol. An agent that
can call a model but cannot buy more when it runs out has a deadline. This is
how it pays for itself.

```bash
npm install @orbiodotso/sdk viem
```

```ts
import { createOrbio } from '@orbiodotso/sdk'

const orbio = await createOrbio({ apiKey: process.env.ORBIO_API_KEY })

const { result, chargedMicroUsd } = await orbio.tools.xPosts(
  { handle: 'orbiodotso', limit: 20 },
  { maxCost: '0.01' },
)
```

## What it does

- **Tools.** Read X, search and scrape the web, read Robinhood Chain, scrape
  Instagram, TikTok and Reddit, and publish to connected social accounts.
- **Balance.** Read what a key has and what it has spent, exactly.
- **CREDIT.** Buy it with any supported token, activate it into inference
  balance, stake ORBIO, claim what it earns.
- **The agent launchpad.** Launch a token, harvest its creator fees, claim the
  CREDIT they earn, and manage the agent, all from one wallet.
- **Paying for itself.** `topUp()` and `keepFunded()`.

## Nothing is compiled in

No address and no price ships in this package. Both are fetched when you create
a client, which is why `createOrbio` is awaited. A redeployed contract, a new
tool or a repriced one reaches every installed copy immediately, and a version
of this library can never disagree with the chain about where the protocol is.

```ts
orbio.status.chainId          // where it is
orbio.tools.list()            // every tool, with its schemas and its price
orbio.tools.priceOf('web.search')
```

The honest limit: types cannot be generated from data fetched at runtime, so
`tools.call(name, args)` is structurally typed. If you want strict types, pin
them to a moment with codegen. The runtime is never pinned.

## Money is integers

One CREDIT is one dollar and CREDIT has six decimals, so a balance is an exact
integer of micro-dollars. Nothing here turns an amount into a JavaScript
number, because `0.1 + 0.2` is not `0.3`.

```ts
import { parseCredit, formatCredit } from '@orbiodotso/sdk'

parseCredit('1.25')      // 1250000n
formatCredit(1999999n)   // '1.999999', truncated, never rounded up
```

Decide with the integer; show the string.

## Signing

Reads need only an API key. Anything on chain needs a wallet, and the wallet
never leaves your process: everything is signed locally and only a signed
transaction is sent, to an RPC **you** name.

```ts
import { privateKeyToAccount } from 'viem/accounts'

const orbio = await createOrbio({
  apiKey: process.env.ORBIO_API_KEY,
  account: privateKeyToAccount(process.env.ORBIO_PRIVATE_KEY as `0x${string}`),
  rpcUrl: process.env.RPC_URL,
})
```

Prefer, in this order: a viem `Account` you built from a keystore or an HSM; a
`WalletClient` you already have; a raw private key. The last is supported
because people will do it anyway and a documented path is safer than an
undocumented one.

**There is no default RPC.** Every endpoint Orbio runs embeds a key, so one
shipped in a package would be published, and a public endpoint chosen for you
would be a dependency you never agreed to.

Asking for a signature without a wallet raises `NoSignerError` naming the
action, rather than failing somewhere deeper.

## Paying for itself

```ts
const result = await orbio.topUp({ token: 'USDG', amount: '20' })

if (result.warning) console.warn(result.warning)
else console.log(`credited ${formatCredit(result.creditedMicroUsd)} CREDIT`)
```

Two steps happen, and the second goes wrong quietly. Buying gets you CREDIT the
token. **Activating** burns it and credits an Orbio account with the same face
value of inference. If the beneficiary is not the account your API key spends
from, both succeed and the balance you are watching never moves. So `topUp`
reads the balance before and after and tells you when it did not change.

To keep a floor:

```ts
for await (const event of orbio.keepFunded({
  floor: '5',
  buy: { token: 'USDG', amount: '20' },
})) {
  if (event.kind === 'topped-up') console.log('topped up', event.result.afterMicroUsd)
  if (event.kind === 'failed') console.warn(event.error.message)
}
```

It is a generator rather than a daemon: it yields every time it does something,
holds no timers that could outlive your process, and stops when you break.

## Buying is Uniswap

The SDK swaps through Uniswap and does not expose Orbio's order book. Both work
on chain, but an agent topping itself up should not have to reason about asks,
fills and a venue. The gateway quotes the route and refuses to hand back an
approval to anything but Permit2, a permit for any spender but the router, or a
transaction to any address but the router.

## The agent launchpad

An agent launches a token, the launchpad takes 5% of its creator fees and
stakes the rest, and that position earns CREDIT hourly.

```ts
const terms = await orbio.agents.launchTerms()

const { agentId, token } = await orbio.agents.launch({
  name: 'Scout',
  symbol: 'SCOUT',
  feeWei: BigInt(terms.launchFeeWei),
  expectedEconomics: terms.economics!,
})

await orbio.agents.harvest([agentId])
await orbio.agents.claimCredit(agentId, { activate: true })
```

**One wallet.** Launch without `agentWallet` and the launching wallet is the
agent wallet, so one key does everything and the agent owns itself.
`capabilities(agentId)` reports what the connected wallet may actually do. Said
once: that key can also withdraw principal, so it should hold what the agent
needs rather than everything you own.

`launch` is the one call no relay can sponsor. It is payable, and a sponsored
operation spends the sender's own ETH.

## Errors are something to branch on

```ts
import { NotConnectedError, OrbioError } from '@orbiodotso/sdk'

try {
  await orbio.tools.post('Shipped v2.')
} catch (error) {
  if (error instanceof NotConnectedError) {
    // Nothing is wrong with the call. A person has to connect an account.
    // Never retryable; relay it and carry on.
    console.log(`Ask your owner to connect an account at ${error.url}`)
  } else if (error instanceof OrbioError && error.retryable) {
    // Rate limits and provider failures are worth another go.
  }
}
```

`error.retryable` is deliberately conservative. A bad argument, an empty
balance and anything waiting on a person are all false.

## Publishing needs a connected account

Reading X needs only a key. `social.post` acts as somebody on an account Orbio
does not own, so it is authorised in the dashboard by the wallet that owns the
agent. A key can post once an account is connected; a key can never connect
one. Orbio stores an account id and never a social credential.

## Also available

- **MCP**, hosted at `https://api.orbio.so/api/mcp`, for a model in any client.
  No install, no key on disk, and it can never sign.
- **The Claude Code plugin**, which is that server plus skills and a command.

Use the SDK when you are writing code, MCP when a model is driving.

## Reference

| | |
| --- | --- |
| `createOrbio(options)` | Make a client. Fetches addresses and the catalogue. |
| `orbio.tools` | `list`, `describe`, `priceOf`, `call`, and named helpers |
| `orbio.account` | `key`, `balance`, `models` |
| `orbio.credit` | `balanceOf`, `activate`, `feeExempt` |
| `orbio.staking` | `stake`, `unstake`, `claim`, `positionOf`, `settledOf` |
| `orbio.swap` | `quote`, `buy` |
| `orbio.agents` | `list`, `get`, `launch`, `harvest`, `claimCredit`, and the rest |
| `orbio.topUp` / `orbio.keepFunded` | Pay for itself |

## Licence

MIT
