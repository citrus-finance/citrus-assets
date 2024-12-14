import { mkdir, writeFile } from "fs/promises";
import { Token } from "../types/Token.js";
import { TokenMap } from "../types/TokenMap.js";
import { existsSync } from "fs";
import { TokenList } from "../types/TokenList.js";
import retrieveFile from "./retrieveFile.js";
import { getViemChain } from "./viemChains.js";
import { getAddress } from "viem";
import { config } from "../../config.js";
import { hash } from "crypto";
import getCurrentTokensMap from "./getCurrentTokensMap.js";
import { OutputToken, OutputTokenList } from "../types/OutputTokenList.js";
import { getNativeWrappedToken } from "./wrapped.js";
import { getChainData } from "./talisman.js";

const CELO_ID = 42220;

export default async function updateTokensData(newChainMap: TokenMap) {
  for (let [chainId, tokenMap] of newChainMap) {
    const currentTokenMap = await getCurrentTokensMap(chainId);
    const outputTokenMap = new Map<string, OutputToken>();

    for (let [_address, tokens] of tokenMap) {
      for (const t of tokens) {
        // skip token if not valid
        if (!t.logoURI || !t.address) {
          continue;
        }

        const cacheHash = hash("md5", t.logoURI);
        const currentToken = currentTokenMap.get(t.address);

        if (currentToken && currentToken.extensions.cacheHash === cacheHash) {
          outputTokenMap.set(t.address, currentToken);
          break;
        }

        const fileExt = await retrieveFile(
          t.logoURI,
          `assets/token-logos/${t.chainId}/${t.address}`,
        );

        if (fileExt) {
          outputTokenMap.set(t.address, {
            ...t,
            logoURI: `https://assets.citrus.finance/token-logos/${t.chainId}/${t.address}.${fileExt}`,
            extensions: {
              cacheHash,
            },
          });
          break;
        }
      }
    }

    // NOTE: don't add native to Celo
    if (chainId !== CELO_ID) {
      const chainConfig = config.chains[chainId];
      const viemChain = getViemChain(chainId);
      const wrapped = getNativeWrappedToken(chainId);

      const wrappedAddress = wrapped ? getAddress(wrapped.address) : undefined;

      if (
        viemChain &&
        chainConfig &&
        wrappedAddress &&
        outputTokenMap.has(wrappedAddress)
      ) {
        const fileExt = await retrieveFile(
          chainConfig.nativeLogoUrl,
          `assets/token-logos/${chainId}/0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE`,
        );

        outputTokenMap.set("0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", {
          name: viemChain.nativeCurrency.name,
          symbol: viemChain.nativeCurrency.symbol,
          decimals: viemChain.nativeCurrency.decimals,
          address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          chainId,
          logoURI: `https://assets.citrus.finance/token-logos/${chainId}/0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE.${fileExt}`,
          extensions: {
            wrapped: wrappedAddress,
            cacheHash: hash("md5", chainConfig.nativeLogoUrl),
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
