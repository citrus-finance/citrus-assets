import { TokenMap } from "../types/TokenMap.js";
import addToken from "./addToken.js";
import { TokenList } from "../types/TokenList.js";

export default async function addTokenList(
  tokenMap: TokenMap,
  {
    url,
    tokenListTransform = (x) => x,
    tags = {},
  }: {
    url: string;
    tags?: Record<string, string[]>;
    tokenListTransform?: (file: any) => Pick<TokenList, "tokens" | "tokenMap">;
  },
) {
  console.log(`Fetching tokens from ${url}`);

  const response = await fetch(url);

  if (!response.ok) {
    console.error(`Failed to fetch ${url}`);
    return;
  }

  const file = await response.json();
  const tokenList = tokenListTransform(file);

  for (let token of tokenList.tokens) {
    addToken(tokenMap, token, tags);
  }

  if (tokenList.tokenMap) {
    for (let token of Object.values(tokenList.tokenMap)) {
      addToken(tokenMap, token, tags);
    }
  }
}
