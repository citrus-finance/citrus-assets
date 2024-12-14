interface TalismanChainData {
  id: `${number}`;
  isTestnet: boolean;
  sortIndex: number;
  name: string;
  themeColor: `#${string}`;
  logo: string;
}

const response = await fetch(
  "https://raw.githubusercontent.com/TalismanSociety/chaindata/refs/heads/main/pub/v2/evmNetworks/summary.json",
);

if (response.status !== 200) {
  throw new Error("Failed to fetch Talisman chain data");
}

const chains = (await response.json()) as TalismanChainData[];

const chainMap = new Map(chains.map((chain) => [Number(chain.id), chain]));

export function getChainData(chainId: number): TalismanChainData | null {
  const chain = chainMap.get(chainId);

  return chain ?? null;
}
