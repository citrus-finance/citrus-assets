import { mkdir, readFile, writeFile } from "fs/promises";
import { Token } from "../types/Token.js";
import { TokenMap } from "../types/TokenMap.js";
import { existsSync } from "fs";
import { TokenList } from "../types/TokenList.js";
import retrieveFile from "./retrieveFile.js";
import { extname } from "path";
import type { Chain } from "viem/chains";

const chains = await import("viem/chains");

// @ts-ignore
const chainMap = new Map<number, Chain>(
  Object.values(chains).map((x) => [x.id, x]),
);

type ExtensionWithFallback = {
  fallbackUrl: string;
};

type TokenWithFallback = Token<ExtensionWithFallback>;

type TokenListWithFallback = TokenList<ExtensionWithFallback>;

export default async function updateTokensData(newChainMap: TokenMap) {
  for (let [chainId, newTokenMap] of newChainMap) {
    const currentTokens = await (async () => {
      if (!existsSync(`assets/token-lists/${chainId}.json`)) {
        return [];
      }

      const file = await readFile(`assets/token-lists/${chainId}.json`, {
        encoding: "utf-8",
      });
      const tokenList: TokenListWithFallback = JSON.parse(file);

      return tokenList.tokens;
    })();

    const currentTokenMap = new Map(currentTokens.map((x) => [x.address, x]));

    const outputTokenMap = new Map<string, TokenWithFallback>();

    for (let [address, tokens] of newTokenMap) {
      for (const t of tokens) {
        // skip token if not valid
        if (!t.logoURI || !t.address) {
          continue;
        }

        // if the best token is the one we already have, no need to do anything
        if (
          t.logoURI === currentTokenMap.get(address)?.extensions?.fallbackUrl
        ) {
          outputTokenMap.set(address, currentTokenMap.get(address)!);
          break;
        }

        const successs = await retrieveFile(
          t.logoURI,
          `assets/token-logos/${t.chainId}/${t.address}${extname(t.logoURI)}`,
        );

        if (successs) {
          outputTokenMap.set(t.address, {
            ...t,
            logoURI: `https://assets.citrus.finance/token-logos/${t.chainId}/${t.address}${extname(t.logoURI)}`,
            extensions: {
              fallbackUrl: t.logoURI,
            },
          });
          break;
        }
      }
    }

    const tokenList: TokenListWithFallback = {
      name: `Citrus Finance - ${chainMap.get(chainId)?.name ?? `chain:${chainId}`}`,
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
