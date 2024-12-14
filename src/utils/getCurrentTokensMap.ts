import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { OutputToken, OutputTokenList } from "../types/OutputTokenList.js";

export default async function getCurrentTokensMap(
  chainId: number,
): Promise<Map<string, OutputToken>> {
  if (!existsSync(`assets/token-lists/${chainId}.json`)) {
    return new Map();
  }
  const file = await readFile(`assets/token-lists/${chainId}.json`, {
    encoding: "utf-8",
  });
  const tokenList: OutputTokenList = JSON.parse(file);

  return new Map(tokenList.tokens.map((t) => [t.address, t]));
}
