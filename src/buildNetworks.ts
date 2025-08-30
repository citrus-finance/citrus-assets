import { writeFile } from "fs/promises";
import { getViemChain } from "./utils/viemChains.js";
import isChainSupported from "./utils/isChainSupported.js";
import { existsSync } from "fs";
import { mkdir } from "fs/promises";
import { ChainFormatters, getAddress } from "viem";
import type { Chain as BaseChain } from "viem/chains";
import { getNativeWrappedToken } from "./utils/wrapped.js";
import { getDefiLlamaProvider } from "./utils/defiLlama.js";
import { getChainData } from "./utils/talisman.js";
import {
  getDRpcChainIds,
  getDRpcChainRpcHttpUrl,
  getDRpcChainRpcWsUrl,
} from "./utils/drpc.js";

interface ChainCustom {
  wrapped: string;
  defiLLamaChain?: string;
  chainLogo?: string;
}

type Chain = BaseChain<
  ChainFormatters | undefined,
  Record<string, unknown> & ChainCustom
>;

interface RainbowKitChain extends Chain {
  iconUrl?: string | (() => Promise<string>) | null;
  iconBackground?: string;
}

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

  const drpcChainIds = getDRpcChainIds();

  await Promise.all(
    drpcChainIds.map(async (chainId): Promise<void> => {
      const wrappedToken = getNativeWrappedToken(chainId);

      if (wrappedToken) {
        const supportsCitrus = await isChainSupported(chainId);

        if (supportsCitrus) {
          chainsSupportedSet.add(chainId);
        }
      }

      completed++;
      if (completed % 10 === 0 || completed === drpcChainIds.length) {
        console.log(`networks: ${completed}/${drpcChainIds.length}`);
      }
    }),
  );

  const appKitNetworks = drpcChainIds.map((chainId): CaipNetwork | null => {
    const wrappedToken = getNativeWrappedToken(chainId);
    const defiLLamaProvider = getDefiLlamaProvider(chainId);
    const chainData = getChainData(chainId);

    if (!wrappedToken) {
      return null;
    }

    if (!chainsSupportedSet.has(chainId)) {
      return null;
    }

    const httpRpcUrl = getDRpcChainRpcHttpUrl(chainId);
    const wsRpcUrl = getDRpcChainRpcWsUrl(chainId);

    if (!httpRpcUrl || !wsRpcUrl) {
      return null;
    }

    const chain = getViemChain(chainId);

    if (!chain) {
      return null;
    }

    return {
      ...chain,
      rpcUrls: {
        default: {
          http: [httpRpcUrl],
          webSocket: [wsRpcUrl],
        },
      },
      chainNamespace: "eip155",
      caipNetworkId: `eip155:${chainId}`,
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

  const viemCustomChains = drpcChainIds.map((chainId): Chain | null => {
    const wrappedToken = getNativeWrappedToken(chainId);
    const defiLLamaProvider = getDefiLlamaProvider(chainId);
    const chainData = getChainData(chainId);

    if (!wrappedToken) {
      return null;
    }

    if (!chainsSupportedSet.has(chainId)) {
      return null;
    }

    const httpRpcUrl = getDRpcChainRpcHttpUrl(chainId);
    const wsRpcUrl = getDRpcChainRpcWsUrl(chainId);

    if (!httpRpcUrl || !wsRpcUrl) {
      return null;
    }

    const chain = getViemChain(chainId);

    if (!chain) {
      return null;
    }

    return {
      ...chain,
      rpcUrls: {
        default: {
          http: [httpRpcUrl],
          webSocket: [wsRpcUrl],
        },
      },
      custom: {
        ...chain.custom,
        chainLogo: chainData?.logo,
        wrapped: getAddress(wrappedToken.address),
        defiLLamaChain: defiLLamaProvider?.name,
      },
    };
  });

  const rainbowkitChains = drpcChainIds.map(
    (chainId): RainbowKitChain | null => {
      const wrappedToken = getNativeWrappedToken(chainId);
      const defiLLamaProvider = getDefiLlamaProvider(chainId);
      const chainData = getChainData(chainId);

      if (!wrappedToken) {
        return null;
      }

      if (!chainsSupportedSet.has(chainId)) {
        return null;
      }

      const httpRpcUrl = getDRpcChainRpcHttpUrl(chainId);
      const wsRpcUrl = getDRpcChainRpcWsUrl(chainId);

      if (!httpRpcUrl || !wsRpcUrl) {
        return null;
      }

      const chain = getViemChain(chainId);

      if (!chain) {
        return null;
      }

      return {
        ...chain,
        rpcUrls: {
          default: {
            http: [httpRpcUrl],
            webSocket: [wsRpcUrl],
          },
        },
        iconUrl: chainData?.logo,
        custom: {
          ...chain.custom,
          chainLogo: chainData?.logo,
          wrapped: getAddress(wrappedToken.address),
          defiLLamaChain: defiLLamaProvider?.name,
        },
      };
    },
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

  await writeFile(
    `assets/networks/viem-chains.json`,
    JSON.stringify(
      viemCustomChains
        .filter((x) => Boolean(x))
        .sort((a, b) => (a!.id as number) - (b!.id as number)),
      null,
      2,
    ),
  );

  await writeFile(
    `assets/networks/rainbow-kit-chains.json`,
    JSON.stringify(
      rainbowkitChains
        .filter((x) => Boolean(x))
        .sort((a, b) => (a!.id as number) - (b!.id as number)),
      null,
      2,
    ),
  );
}
