import buildNetworks from "./buildNetworks.js";
import { TokenMap } from "./types/TokenMap.js";
import addManyTokenLists from "./utils/addManyTokenLists.js";
import updateTokensData from "./utils/updateTokensData.js";

import { config } from "../config.js";
import addTokenList from "./utils/addTokenList.js";

await buildNetworks();

const tokenMap: TokenMap = new Map();

for (let tokenList of config.tokenLists) {
  if ("gitUrl" in tokenList) {
    await addManyTokenLists(tokenMap, {
      gitUrl: tokenList.gitUrl,
      tokenListsDir: tokenList.tokenListsDir,
      tokenListTransform: tokenList.tokenListTransform,
      tags: tokenList.tags,
    });
  } else {
    await addTokenList(tokenMap, {
      url: tokenList.url,
      tokenListTransform: tokenList.tokenListTransform,
      tags: tokenList.tags,
    });
  }
}

await updateTokensData(tokenMap);
