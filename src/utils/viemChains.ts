import ts from "typescript";
import { type Chain } from "viem/chains";

import { gitPull } from "./git.js";

const { dir: viemDir } = await gitPull("git@github.com:wevm/viem.git");
const chains = await import(`../../${viemDir}/src/chains`);

const deprecatedChains = getDeprecatedChains();

// @ts-ignore
export const viemChains: Chain[] = Object.entries(chains)
  .filter((x) => !deprecatedChains.includes(x[0]))
  .map((x) => x[1]);

const viemChainsMap = new Map<number, Chain>(viemChains.map((x) => [x.id, x]));

export function getViemChain(chainId: number): Chain | null {
  const chain = viemChainsMap.get(chainId);

  return chain ?? null;
}

function getDeprecatedChains(): string[] {
  const deprecatedChains: string[] = [];

  const filePath = `${viemDir}/src/chains/index.ts`;

  const program = ts.createProgram([filePath], {});
  const sourceFile = program.getSourceFile(filePath);

  if (!sourceFile) {
    throw new Error("Could not load source file");
  }

  function isNodeDeprecated(node: ts.Node): boolean {
    const jsDocs = (node as any).jsDoc as ts.JSDoc[] | undefined;
    const tags = jsDocs?.flatMap((x) => x.tags ?? []) ?? [];

    const isDeprecated = tags.some((tag) => tag.tagName.text === "deprecated");

    if (isDeprecated) {
      return true;
    }

    if (!node.parent) {
      return false;
    }

    return isNodeDeprecated(node.parent);
  }

  function visit(node: ts.Node) {
    if (ts.isExportSpecifier(node) && isNodeDeprecated(node)) {
      deprecatedChains.push(node.name.text);
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return deprecatedChains;
}
