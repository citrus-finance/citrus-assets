import { Token } from "../types/Token.js";
import { TokenList } from "../types/TokenList.js";

const response = await fetch(
  "https://raw.githubusercontent.com/citrus-finance/canonical-wrapped-token-list/refs/heads/main/token-list.json",
);

if (response.status !== 200) {
  throw new Error("Failed to fetch coingecko asset platforms");
}

const wrappedTokenList = (await response.json()) as TokenList<{
  isNative?: boolean;
}>;

const wrappedMap = new Map(
  wrappedTokenList.tokens.map((token) => [token.chainId, token]),
);

export function getNativeWrappedToken(
  chainId: number,
): Token<{ isNative?: boolean }> | null {
  const wrapped = wrappedMap.get(chainId);

  return wrapped ?? null;
}
