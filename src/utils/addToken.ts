import { getAddress } from "viem";
import { Token } from "../types/Token.js";
import { TokenMap } from "../types/TokenMap.js";

export default function addToken(
  tokenMap: TokenMap,
  token: Token,
  tags: Record<string, string[]>,
) {
  if (!tokenMap.has(token.chainId)) {
    tokenMap.set(token.chainId, new Map());
  }

  // checksum token address
  const address = (() => {
    try {
      return getAddress(token.address);
    } catch {
      // skip invalid address
      return false;
    }
  })();

  const tokenTags = token.tags ? Array.from(token.tags) : [];

  for (let tag in tags) {
    if (tokenTags.some((x) => tags[tag].includes(x))) {
      tokenTags.push(tag);
    }
  }

  if (address) {
    if (!tokenMap.get(token.chainId)!.has(address)) {
      tokenMap.get(token.chainId)!.set(address, []);
    }

    tokenMap.get(token.chainId)!.get(address)!.push({
      chainId: token.chainId,
      address,
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
      logoURI: token.logoURI,
      tags: tokenTags,
      extensions: token.extensions,
    });
  }
}
