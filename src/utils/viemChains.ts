import type { Chain } from "viem/chains";

const chains = await import("viem/chains");

const deprecatedChains = [
  "flowPreviewnet",
  "foundry",
  "klaytn",
  "klaytnBaobab",
  "lineaTestnet",
  "polygonZkEvmTestnet",
  "x1Testnet",
  "zkSync",
  "zkSyncInMemoryNode",
  "zkSyncLocalNode",
  "zkSyncSepoliaTestnet",
];

// @ts-ignore
export const viemChains: Chain[] = Object.entries(chains)
  .filter((x) => !deprecatedChains.includes(x[0]))
  .map((x) => x[1]);

const viemChainsMap = new Map<number, Chain>(viemChains.map((x) => [x.id, x]));

export function getViemChain(chainId: number): Chain | null {
  const chain = viemChainsMap.get(chainId);

  return chain ?? null;
}
