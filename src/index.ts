import buildNetworks from "./buildNetworks.js";
import { TokenMap } from "./types/TokenMap.js";
import addManyTokenLists from "./utils/addManyTokenLists.js";
import updateTokensData from "./utils/updateTokensData.js";

await buildNetworks();

const tokenMap: TokenMap = new Map();

await addManyTokenLists(tokenMap, {
  gitUrl: "git@github.com:sushiswap/list.git",
  tokenListsDir: "lists/token-lists/default-token-list/tokens",
  tokenListTransform: (tokens) => ({
    tokens,
  }),
});

await updateTokensData(tokenMap);
