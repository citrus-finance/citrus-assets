import { getAddress } from "viem";
import { Token } from "../types/Token.js";
import { TokenMap } from "../types/TokenMap.js";

export default function addToken(tokenMap: TokenMap, token: Token) {
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

  if (address) {
    if (!tokenMap.get(token.chainId)!.has(address)) {
      tokenMap.get(token.chainId)!.set(address, []);
    }

    tokenMap.get(token.chainId)!.get(address)!.push(token);
  }
}
