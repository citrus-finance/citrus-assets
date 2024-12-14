import { writeFile } from "fs/promises";
import { viemChains } from "./utils/viemChains.js";
import isChainSupported from "./utils/isChainSupported.js";
import { existsSync } from "fs";
import { mkdir } from "fs/promises";
import { getAddress } from "viem";
import { getNativeWrappedToken } from "./utils/wrapped.js";
import { getDefiLlamaProvider } from "./utils/defiLlama.js";
import { getChainData } from "./utils/talisman.js";

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
  // Extra fields
  wrapped: string;
  defiLLamaChain?: string;
};

export default async function buildNetworks() {
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

      return {
        id: `eip155:${chain.id}`,
        chainId: chain.id,
        name: chain.name,
        currency: chain.nativeCurrency.symbol,
        explorerUrl: chain.blockExplorers?.default.url ?? "",
        rpcUrl: chain.rpcUrls?.default.http[0] ?? "",
        chainNamespace: "eip155",
        imageUrl: chainData?.logo,
        wrapped: getAddress(wrappedToken.address),
        defiLLamaChain: defiLLamaProvider?.name,
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
        .sort((a, b) => a!.chainId - b!.chainId),
      null,
      2,
    ),
  );
}
