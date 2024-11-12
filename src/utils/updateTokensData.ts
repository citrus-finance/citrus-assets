import { mkdir, readFile, writeFile } from "fs/promises";
import { Token } from "../types/Token.js";
import { TokenMap } from "../types/TokenMap.js";
import { existsSync } from "fs";
import { TokenList } from "../types/TokenList.js";
import retrieveFile from "./retrieveFile.js";
import { extname } from "path";
import { viemChainsMap } from "./viemChains.js";
import { citrusChainsMap } from "../constants/chains.js";
import { getAddress } from "viem";

type ExtensionWithFallback = {
  wrapped?: string;
};

type TokenWithFallback = Token<ExtensionWithFallback>;

type TokenListWithFallback = TokenList<ExtensionWithFallback>;

const CELO_ID = 42220;

export default async function updateTokensData(newChainMap: TokenMap) {
  for (let [chainId, tokenMap] of newChainMap) {
    const outputTokenMap = new Map<string, TokenWithFallback>();

    for (let [_address, tokens] of tokenMap) {
      for (const t of tokens) {
        // skip token if not valid
        if (!t.logoURI || !t.address) {
          continue;
        }

        const successs = await retrieveFile(
          t.logoURI,
          `assets/token-logos/${t.chainId}/${t.address}${extname(t.logoURI)}`,
        );

        if (successs) {
          outputTokenMap.set(t.address, {
            ...t,
            logoURI: `https://assets.citrus.finance/token-logos/${t.chainId}/${t.address}${extname(t.logoURI)}`,
          });
          break;
        }
      }
    }

    // NOTE: don't add native to Celo
    if (chainId !== CELO_ID) {
      const viemChain = viemChainsMap.get(chainId);
      const citrusChain = citrusChainsMap.get(chainId);

      if (viemChain && citrusChain) {
        outputTokenMap.set("0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", {
          name: viemChain.nativeCurrency.name,
          symbol: viemChain.nativeCurrency.symbol,
          decimals: viemChain.nativeCurrency.decimals,
          address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          chainId,
          logoURI: citrusChain.nativeLogoUrl,
          extensions: {
            wrapped: citrusChain.wrappedToken
              ? getAddress(citrusChain.wrappedToken?.address)
              : undefined,
          },
        });
      }
    }

    const tokenList: TokenListWithFallback = {
      name: `Citrus Finance - ${viemChainsMap.get(chainId)?.name ?? `chain:${chainId}`}`,
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
