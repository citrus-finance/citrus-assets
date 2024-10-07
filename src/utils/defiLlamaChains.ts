import { gitPull } from "./git.js";

type DefiLlamaChain = {
  geckoId: string | null;
  symbol: string | null;
  cmcId: string | null;
  categories?: string[];
  chainId?: number;
  twitter?: string | null;
  url?: string | null;
  parent?: {
    chain: string;
    types: string[];
  };
};

let chainsMapP: Promise<Map<number, DefiLlamaChain>> | null = null;

export async function getDefiLlamaChainsMap(): Promise<
  Map<number, DefiLlamaChain>
> {
  if (!chainsMapP) {
    chainsMapP = (async (): Promise<Map<number, DefiLlamaChain>> => {
      const { dir } = await gitPull(
        "git@github.com:DefiLlama/defillama-server.git",
      );

      const { chainCoingeckoIds } = await import(
        `../../${dir}/defi/src/utils/normalizeChain.ts`
      );

      const chains: DefiLlamaChain[] = Object.values(chainCoingeckoIds);

      return new Map(
        chains
          .filter((x) => x.chainId != undefined)
          .map((chain) => [chain.chainId!, chain]),
      );
    })();
  }

  return chainsMapP;
}
