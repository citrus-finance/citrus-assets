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

interface ChainCustom {
  wrapped: string;
  defiLLamaChain?: string;
  chainLogo?: string;
}

type Chain = BaseChain<
  ChainFormatters | undefined,
  Record<string, unknown> & ChainCustom
>;

type CaipNetworkId = `${ChainNamespace}:${number}`;

type ChainNamespace = "eip155" | "solana" | "polkadot";

// From: https://github.com/reown-com/appkit/blob/main/packages/common/src/utils/TypeUtil.ts
export type CaipNetwork = Omit<Chain, "id"> & {
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

  const chainsSupportedSet = new Set<number>();

  await Promise.all(
    viemChains.map(async (chain): Promise<void> => {
      const wrappedToken = getNativeWrappedToken(chain.id);

      if (wrappedToken) {
        const supportsCitrus = await isChainSupported(chain.id);

        if (supportsCitrus) {
          chainsSupportedSet.add(chain.id);
        }
      }

      completed++;
      if (completed % 10 === 0 || completed === viemChains.length) {
        console.log(`networks: ${completed}/${viemChains.length}`);
      }
    }),
  );

  const appKitNetworks = viemChains.map((chain): CaipNetwork | null => {
    const wrappedToken = getNativeWrappedToken(chain.id);
    const defiLLamaProvider = getDefiLlamaProvider(chain.id);
    const chainData = getChainData(chain.id);

    if (!wrappedToken) {
      return null;
    }

    if (!chainsSupportedSet.has(chain.id)) {
      return null;
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
  });

  const viemCustomChains = viemChains.map((chain): Chain | null => {
    const wrappedToken = getNativeWrappedToken(chain.id);
    const defiLLamaProvider = getDefiLlamaProvider(chain.id);
    const chainData = getChainData(chain.id);

    if (!wrappedToken) {
      return null;
    }

    if (!chainsSupportedSet.has(chain.id)) {
      return null;
    }

    return {
      ...chain,
      custom: {
        ...chain.custom,
        chainLogo: chainData?.logo,
        wrapped: getAddress(wrappedToken.address),
        defiLLamaChain: defiLLamaProvider?.name,
      },
    };
  });

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

  await writeFile(
    `assets/networks/app-view-chains.json`,
    JSON.stringify(
      viemCustomChains
        .filter((x) => Boolean(x))
        .sort((a, b) => (a!.id as number) - (b!.id as number)),
      null,
      2,
    ),
  );
}
