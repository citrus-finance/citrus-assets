import type { Address } from "viem";

interface LayerZeroMetadata {
  deployments?: {
    eid: string;
    version: 2;
    stage: "testnet" | "mainnet";
    endpointV2?: {
      address: Address;
    };
    endpointV2View?: {
      address: Address;
    };
  }[];
  chainDetails?: {
    nativeChainId?: number;
    chainStatus: "ACTIVE";
    chainType: "evm";
  };
}

const response = await fetch("https://metadata.layerzero-api.com/v1/metadata");

if (response.status !== 200) {
  throw new Error("Failed to fetch LayerZero metadata");
}

const metadata = (await response.json()) as Record<string, LayerZeroMetadata>;

const deploymentMap = new Map<
  number,
  {
    endpointV2: Address;
    endpointV2View: Address;
  }
>();

const chainMap = new Map<string, number>();

for (let [chainName, chain] of Object.entries(metadata)) {
  if (
    !chain.chainDetails ||
    chain.chainDetails.chainType !== "evm" ||
    chain.chainDetails.chainStatus !== "ACTIVE" ||
    !Number.isInteger(chain.chainDetails.nativeChainId)
  ) {
    continue;
  }

  const activeDeployments =
    chain.deployments?.filter(
      (x) =>
        x.stage === "mainnet" &&
        x.version === 2 &&
        x.endpointV2 &&
        x.endpointV2View,
    ) ?? [];

  if (activeDeployments.length === 0) {
    continue;
  }

  if (activeDeployments.length > 1) {
    throw new Error(`Multiple LayerZero deployments found for chain ${chain}`);
  }

  deploymentMap.set(chain.chainDetails.nativeChainId!, {
    endpointV2: activeDeployments[0]!.endpointV2!.address,
    endpointV2View: activeDeployments[0]!.endpointV2View!.address,
  });
  chainMap.set(chainName, chain.chainDetails.nativeChainId!);
}

export function getLayerZeroChainIds(): number[] {
  return Array.from(deploymentMap.keys());
}

export function getLayerZeroDeployment(chainId: number) {
  return deploymentMap.get(chainId) ?? null;
}

export function getChainIdByLayerZeroName(name: string): number | null {
  return chainMap.get(name) ?? null;
}

// https://metadata.layerzero-api.com/v1/metadata/experiment/ofts/list?symbols=WBTC
// export function getTokenDeployment(chainId: number, symbol: string) {

// }
