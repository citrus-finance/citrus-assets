import { writeFile } from "fs/promises";
import { viemChains } from "./utils/viemChains.js";
import isChainSupported from "./utils/isChainSupported.js";
import { existsSync } from "fs";
import { mkdir } from "fs/promises";
import { ChainFormatters, getAddress } from "viem";
import type { Chain as BaseChain } from "viem/chains";
import { getNativeWrappedToken } from "./utils/wrapped.js";
import { getDefiLlamaProvider } from "./utils/defiLlama.js";
import { getChainData } from "./utils/talisman.js";

type CaipNetworkId = `${ChainNamespace}:${number}`;

type ChainNamespace = "eip155" | "solana" | "polkadot";

// From: https://github.com/reown-com/appkit/blob/main/packages/common/src/utils/TypeUtil.ts
export type CaipNetwork = Omit<
  BaseChain<
    ChainFormatters | undefined,
    Record<string, unknown> & { wrapped: string; defiLLamaChain?: string }
  >,
  "id"
> & {
  id: number | string;
  chainNamespace: ChainNamespace;
  caipNetworkId: CaipNetworkId;
  assets?: {
    imageId: string | undefined;
    imageUrl: string | undefined;
  };
};

export default async function buildNetworks() {
  let completed = 0;

  const appKitNetworks = await Promise.all(
    viemChains.map(async (chain): Promise<CaipNetwork | null> => {
      const wrappedToken = getNativeWrappedToken(chain.id);
      const defiLLamaProvider = getDefiLlamaProvider(chain.id);
      const chainData = getChainData(chain.id);

      if (!wrappedToken) {
        return null;
      }

      const supportsCitrus = await isChainSupported(chain.id);

      if (!supportsCitrus) {
        return null;
      }

      completed++;
      if (completed % 10 === 0 || completed === viemChains.length) {
        console.log(`networks: ${completed}/${viemChains.length}`);
      }

      return {
        ...chain,
        chainNamespace: "eip155",
        caipNetworkId: `eip155:${chain.id}`,
        assets: {
          imageId: undefined,
          imageUrl: chainData?.logo,
        },
        custom: {
          ...chain.custom,
          wrapped: getAddress(wrappedToken.address),
          defiLLamaChain: defiLLamaProvider?.name,
        },
      };
    }),
  );

  if (!existsSync("assets/networks")) {
    await mkdir("assets/networks", {
      recursive: true,
    });
  }

  await writeFile(
    `assets/networks/app-kit-networks.json`,
    JSON.stringify(
      appKitNetworks
        .filter((x) => Boolean(x))
        .sort((a, b) => (a!.id as number) - (b!.id as number)),
      null,
      2,
    ),
  );
}
