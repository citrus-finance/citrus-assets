// From https://docs.pimlico.io/infra/platform/supported-chains except ethereum

import { Hex } from "viem";
import pRetry from "p-retry";
import pLimit from "p-limit";
import { unsafeGetRpcUrl } from "./rpc.js";

const limit = pLimit(8);

const RETRIES = 5;

export default async function isChainSupported(
  chainId: number,
): Promise<boolean | null> {
  const rpcUrl = unsafeGetRpcUrl(chainId);

  try {
    const code = await limit(() =>
      pRetry(
        async () => {
          const abortController = new AbortController();

          const timeoutId = setTimeout(() => {
            abortController.abort(new Error("Timeout"));
          }, 15_000);

          try {
            const response = await fetch(rpcUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                jsonrpc: "2.0",
                method: "eth_getCode",
                params: [
                  "0x914d7fec6aac8cd542e72bca78b30650d45643d7",
                  "latest",
                ],
                id: 1,
              }),
              signal: abortController.signal,
            });

            if (response.status !== 200) {
              throw new Error(`Expected 200, got ${response.status}`);
            }

            const data = (await response.json()) as {
              result?: Hex;
              error?: { message: string };
            };

            if (typeof data.result !== "string") {
              throw new Error(
                `Unexpected response: ${data.error?.message ?? JSON.stringify(data)}`,
              );
            }

            return data.result;
          } finally {
            clearTimeout(timeoutId);
          }
        },
        {
          minTimeout: 500,
          maxTimeout: 5_000,
          retries: RETRIES,
          onFailedAttempt(err) {
            console.log(
              `${chainId} RPC call failed (${err.attemptNumber}/${RETRIES + 1}): ${err}`,
            );
          },
        },
      ),
    );

    return code !== "0x";
  } catch (err) {
    console.log(`${chainId} support could not be determined: ${err}`);

    return null;
  }
}
