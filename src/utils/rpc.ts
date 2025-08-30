import { getDRpcChainRpcHttpUrl } from "./drpc.js";

export function getRpcUrl(chainId: number): string {
  const url = getDRpcChainRpcHttpUrl(chainId);

  if (url == null) {
    throw new Error(`No RPC URL for chain ${chainId}`);

    // TODO: use viem RPC or other alternatives
  }

  return url;
}

export function unsafeGetRpcUrl(chainId: number): string {
  const url = getRpcUrl(chainId);

  return url.replaceAll("<DRPC_API_KEY>", process.env.DRPC_API_KEY ?? "");
}
