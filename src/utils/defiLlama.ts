interface DefiLlamaProvider {
  rpc: string[];
  chainId: number;
  name: string;
}

const response = await fetch(
  "https://raw.githubusercontent.com/DefiLlama/defillama-sdk/refs/heads/master/src/providers.json",
);

if (response.status !== 200) {
  throw new Error("Failed to fetch DefiLlama providers");
}

const providers = (await response.json()) as Record<
  string,
  Omit<DefiLlamaProvider, "name">
>;

const providerMap = new Map(
  Object.entries(providers).map((x) => [
    x[1].chainId,
    {
      ...x[1],
      name: x[0],
    },
  ]),
);

export function getDefiLlamaProvider(
  chainId: number,
): DefiLlamaProvider | null {
  const provider = providerMap.get(chainId);

  return provider ?? null;
}
