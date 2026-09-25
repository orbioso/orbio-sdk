import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  treeshake: true,
  // viem stays a peer. Bundling it would ship a second copy beside the one the
  // consumer already has, and two viem instances means two of everything that
  // depends on identity, starting with `instanceof`.
  deps: { neverBundle: ['viem', 'viem/accounts', 'viem/chains'] },
})
