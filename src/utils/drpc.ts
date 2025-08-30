import { readFile } from "fs/promises";

const dRpcNetworks = await readFile("./data/drpc-networks.json", "utf8");

const blockchainsData: BlockchainsData =
  JSON.parse(dRpcNetworks)[0].result.data;

const nameMap = new Map<number, string>(
  Object.values(blockchainsData.dataMap)
    .map((blockchain) => {
      const network = blockchain.networks.find(
        (x) =>
          x.network_label === "Mainnet" &&
          x.blockchain_type === "eth" &&
          x.api_type === "jsonrpc" &&
          x.public,
      );

      if (!network) {
        return null;
      }

      return [Number(network.chain_id), network.network] as const;
    })
    .filter((x) => x !== null),
);

export function getDRpcChainIds() {
  return [...nameMap.keys()];
}

export function getDRpcChainRpcHttpUrl(chainId: number) {
  const name = nameMap.get(chainId) ?? null;

  if (!name) {
    return null;
  }

  return `https://lb.drpc.org/${name}/<DRPC_API_KEY>`;
}

export function getDRpcChainRpcWsUrl(chainId: number) {
  const name = nameMap.get(chainId) ?? null;

  if (!name) {
    return null;
  }

  return `wss://lb.drpc.org/${name}/<DRPC_API_KEY>`;
}

interface Network {
  network: string;
  blockchain: string;
  network_label: string;
  blockchain_label: string;
  priority: number;
  explorers: string[] | null;
  currency: Currency;
  chain_id: string;
  chain_grpc_id: number;
  api_type: string;
  blockchain_type: string;
  public: boolean;
}

interface Currency {
  name: string;
  symbol: string;
  decimals: number;
}

interface Blockchain {
  value: string;
  label: string;
  networks: Network[];
  api_type: string;
  blockchain_type: string;
  mev: boolean;
  public: boolean;
}

interface BlockchainMap {
  [key: string]: Blockchain;
}

interface BlockchainsData {
  dataMap: BlockchainMap;
  totalNetworks: number;
  totalBlockchains: number;
}
