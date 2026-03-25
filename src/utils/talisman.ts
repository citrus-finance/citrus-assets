interface TalismanChainData {
  id: `${number}`;
  isTestnet?: boolean;
  name: string;
  themeColor?: `#${string}`;
  logo: string;
}

const response = await fetch(
  "https://raw.githubusercontent.com/TalismanSociety/chaindata/refs/heads/main/pub/v9/chaindata.json",
);

if (response.status !== 200) {
  throw new Error("Failed to fetch Talisman chain data");
}

const { networks: chains } = (await response.json()) as {
  networks: TalismanChainData[];
};

const chainMap = new Map(chains.map((chain) => [Number(chain.id), chain]));

export function getChainData(chainId: number): TalismanChainData | null {
  const chain = chainMap.get(chainId);

  return chain ?? null;
}
