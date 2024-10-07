import { writeFile } from "fs/promises";
import { gitPull } from "./utils/git.js";
import { viemChains } from "./utils/viemChains.js";
import isChainSupported from "./utils/isChainSupported.js";
import { existsSync } from "fs";
import { mkdir } from "fs/promises";
import { getDefiLlamaChainsMap } from "./utils/defiLlamaChains.js";
import { Hex } from "viem";
import { citrusChainsMap, WrappedToken } from "./constants/chains.js";

type CaipNetworkId = `${ChainNamespace}:${number}`;

type ChainNamespace = "eip155" | "solana" | "polkadot";

type CaipNetwork = {
  id: CaipNetworkId;
  chainId: number;
  chainNamespace: ChainNamespace;
  name: string;
  currency: string;
  explorerUrl: string;
  rpcUrl: string;
  imageUrl?: string;
  imageId?: string;
};

type ChainNativeCurrency = {
  name: string;
  /** 2-6 characters long */
  symbol: string;
  decimals: number;
};

type ChainBlockExplorer = {
  name: string;
  url: string;
  apiUrl?: string;
};

type Chain = {
  id: number;
  name: string;
  nativeCurrency: ChainNativeCurrency;
  wrappedToken?: WrappedToken;
  coin?: {
    symbol: string;
    geckoId: string;
  };
  website?: string;
  blockExplorer?: ChainBlockExplorer;
  twitter?: string;
  github?: string;
  logoUrl?: string;
  description?: string;
  citrusProducts: {
    dex: boolean;
  };
};

export default async function buildNetworks() {
  // await gitPull('git@github.com:DefiLlama/icons.git')

  const defiLlamaChainsMap = await getDefiLlamaChainsMap();

  const allAppKitNetworks: CaipNetwork[] = [];
  const supportedAppKitNetworks: CaipNetwork[] = [];
  const allChains: Chain[] = [];

  for (let chain of viemChains) {
    const chainSupported = isChainSupported(chain.id);
    const defiLlamaChain = defiLlamaChainsMap.get(chain.id);
    const chainOverwrite = citrusChainsMap.get(chain.id);

    const appKitNetwork: CaipNetwork = {
      id: `eip155:${chain.id}`,
      chainId: chain.id,
      name: chain.name,
      currency: chain.nativeCurrency.symbol,
      explorerUrl: chain.blockExplorers?.default.url ?? "",
      rpcUrl: chain.rpcUrls?.default.http[0] ?? "",
      chainNamespace: "eip155",
      imageUrl: chainOverwrite?.logoUrl,
    };

    allAppKitNetworks.push(appKitNetwork);

    if (chainSupported) {
      supportedAppKitNetworks.push(appKitNetwork);
    }

    allChains.push({
      id: chain.id,
      name: chain.name,
      description: chainOverwrite?.description,
      nativeCurrency: chain.nativeCurrency,
      wrappedToken: chainOverwrite?.wrappedToken,
      coin:
        defiLlamaChain?.symbol && defiLlamaChain.geckoId
          ? {
              symbol: defiLlamaChain.symbol,
              geckoId: defiLlamaChain.geckoId,
            }
          : undefined,
      blockExplorer: chain.blockExplorers?.default,
      website: chainOverwrite?.website ?? defiLlamaChain?.url ?? undefined,
      github: defiLlamaChain?.twitter ?? undefined,
      twitter: defiLlamaChain?.twitter ?? undefined,
      citrusProducts: {
        dex: chainSupported,
      },
    });
  }

  if (!existsSync("assets/networks")) {
    await mkdir("assets/networks", {
      recursive: true,
    });
  }

  await writeFile(
    `assets/networks/all-app-kit-networks.json`,
    JSON.stringify(
      allAppKitNetworks.sort((a, b) => a.chainId - b.chainId),
      null,
      2,
    ),
  );

  await writeFile(
    `assets/networks/supported-app-kit-networks.json`,
    JSON.stringify(
      supportedAppKitNetworks.sort((a, b) => a.chainId - b.chainId),
      null,
      2,
    ),
  );

  await writeFile(
    `assets/networks/all-chains.json`,
    JSON.stringify(
      allChains.sort((a, b) => a.id - b.id),
      null,
      2,
    ),
  );
}
