import { mkdir, writeFile } from "fs/promises";
import pLimit from "p-limit";
import { TokenMap } from "../types/TokenMap.js";
import { existsSync } from "fs";
import { getViemChain } from "./viemChains.js";
import { getAddress } from "viem";
import { OutputToken, OutputTokenList } from "../types/OutputTokenList.js";
import { getNativeWrappedToken } from "./wrapped.js";
import { getChainData } from "./talisman.js";
import checkFile from "./checkFile.js";

const limit = pLimit(100);

const CELO_ID = 42220;

export default async function updateTokensData(newChainMap: TokenMap) {
  for (let [chainId, tokenMap] of newChainMap) {
    const outputTokenMap = new Map<string, OutputToken>();

    await Promise.all(
      [...tokenMap.values()].map(async (tokens) => {
        for (const t of tokens) {
          // skip token if not valid
          if (!t.logoURI || !t.address) {
            continue;
          }

          const fileExists = await limit(() => checkFile(t.logoURI!));

          if (fileExists) {
            outputTokenMap.set(t.address, t);
            break;
          }
        }
      }),
    );

    // NOTE: don't add native to Celo
    if (chainId !== CELO_ID) {
      const chainData = getChainData(chainId);
      const viemChain = getViemChain(chainId);
      const wrapped = getNativeWrappedToken(chainId);

      const wrappedAddress = wrapped ? getAddress(wrapped.address) : undefined;

      if (
        viemChain &&
        chainData &&
        wrappedAddress &&
        outputTokenMap.has(wrappedAddress)
      ) {
        const fileExists = await checkFile(chainData.logo);

        if (!fileExists) {
          throw new Error(`Logo for chain ${chainId} not found`);
        }

        outputTokenMap.set("0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", {
          name: viemChain.nativeCurrency.name,
          symbol: viemChain.nativeCurrency.symbol,
          decimals: viemChain.nativeCurrency.decimals,
          address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          chainId,
          logoURI: chainData.logo,
          extensions: {
            wrapped: wrappedAddress,
          },
          tags: ["Top"],
        });
      }
    }

    const tokenList: OutputTokenList = {
      name: `Citrus Finance on ${getViemChain(chainId)?.name ?? `chain:${chainId}`}`,
      version: {
        major: 1,
        minor: 0,
        patch: 0,
      },
      timestamp: new Date(),
      tokens: Array.from(outputTokenMap.values()).sort((a, b) => {
        return a.address.localeCompare(b.address);
      }),
    };

    if (!existsSync("assets/token-lists")) {
      await mkdir("assets/token-lists", {
        recursive: true,
      });
    }

    console.log(`Saving token list for chain ${chainId}`);
    await writeFile(
      `assets/token-lists/${chainId}.json`,
      JSON.stringify(tokenList, null, 2),
    );
  }
}
