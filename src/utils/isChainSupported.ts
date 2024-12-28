// From https://docs.pimlico.io/infra/platform/supported-chains except ethereum

import { Hex } from "viem";
import { getViemChain } from "./viemChains.js";
import pRetry from "p-retry";

// import { citrusChainsMap } from "../constants/chains.js";

// const supportedChainsSet = new Set([
//   11155111, 42161, 421614, 137, 80002, 10, 11155420, 7777777, 999999999, 100,
//   10200, 59144, 59141, 8453, 84532, 690, 17069, 43114, 43113, 8333, 1993,
//   534352, 534351, 42220, 44787, 56, 97, 7560, 111557560, 53935, 335, 8217, 1001,
//   34443, 919, 660279, 37714555429, 81457, 168587773, 888888888, 28122024, 41455,
//   2039, 122, 123, 60808, 808813, 480, 4801, 2040, 78600, 5000, 5003, 994873017,
//   1952959480, 7979, 3939, 1088, 59902, 295, 296, 55244, 98985, 42793, 42026,
//   33139, 666666666, 204, 42170, 978657, 22222, 252, 7887, 957, 30, 132902,
//   167008, 1513, 325000, 161221135, 3397901, 4202, 1946, 47, 2982896226593698,
//   1798, 1903648807, 167009, 1802203764, 534353, 16600, 9897,
// ]);

// export default function isChainSupported(chainId: number): boolean {
//   return (
//     Boolean(citrusChainsMap.get(chainId)?.wrappedToken) &&
//     supportedChainsSet.has(chainId)
//   );
// }

export default async function isChainSupported(
  chainId: number,
): Promise<boolean> {
  const chain = getViemChain(chainId);

  if (chain == null) {
    return false;
  }

  try {
    const response = await pRetry(() =>
      fetch(chain.rpcUrls.default.http[0], {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_getCode",
          params: ["0x914d7fec6aac8cd542e72bca78b30650d45643d7", "latest"],
          id: 1,
        }),
      }),
    );

    if (response.status !== 200) {
      return false;
    }

    const data = (await response.json()) as { result: Hex };

    return data.result !== "0x";
  } catch {
    return false;
  }
}
