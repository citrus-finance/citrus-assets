import { join } from "path";
import { TokenMap } from "../types/TokenMap.js";
import { gitPull } from "./git.js";
import { readdir, readFile } from "fs/promises";
import addToken from "./addToken.js";
import { TokenList } from "../types/TokenList.js";

export default async function addManyTokenLists(
  tokenMap: TokenMap,
  {
    gitUrl,
    tokenListsDir,
    tokenListTransform = (x) => x,
    tags = {},
  }: {
    gitUrl: string;
    tokenListsDir: string;
    tokenListTransform?: (file: any) => Pick<TokenList, "tokens" | "tokenMap">;
    tags?: Record<string, string[]>;
  },
) {
  const { dir: repoDir, remoteDir: repoRemoteDir } = await gitPull(gitUrl);

  const tokenListsFullDir = join(repoDir, tokenListsDir);
  const tokenListNames = await readdir(tokenListsFullDir);

  for (let tokenListName of tokenListNames) {
    console.log(
      `Copying ${tokenListName.replace(".json", "")} tokens from ${repoRemoteDir}`,
    );

    const file = await readFile(join(tokenListsFullDir, tokenListName), {
      encoding: "utf-8",
    });
    const tokenList = tokenListTransform(JSON.parse(file));

    for (let token of tokenList.tokens) {
      addToken(tokenMap, token, tags);
    }

    if (tokenList.tokenMap) {
      for (let token of Object.values(tokenList.tokenMap)) {
        addToken(tokenMap, token, tags);
      }
    }
  }
}
