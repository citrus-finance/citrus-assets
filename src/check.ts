import { viemChains } from "./utils/viemChains.js";
import isChainSupported from "./utils/isChainSupported.js";
import { existsSync } from "fs";
import { getNativeWrappedToken } from "./utils/wrapped.js";
import { getChainData } from "./utils/talisman.js";

let completed = 0;

const selectedChainId = process.argv[2] ? Number(process.argv[2]) : null;

const results = await Promise.all(
  viemChains
    .filter((x) => selectedChainId === null || x.id === selectedChainId)
    .sort((a, b) => a.id - b.id)
    .map(async (chain, i, chains) => {
      try {
        const wrappedToken = getNativeWrappedToken(chain.id);
        const hasTokenList = existsSync(`assets/token-lists/${chain.id}.json`);
        const chainData = getChainData(chain.id);

        const isTested = chain.testnet ?? chainData?.isTestnet ?? false;

        if (isTested) {
          return null;
        }

        const chainIsSupported = await isChainSupported(chain.id);

        return {
          id: chain.id,
          name: chain.name,
          hasWrappedToken: Boolean(wrappedToken),
          hasTokenList,
          chainIsSupported,
        };
      } finally {
        completed++;
        if (completed % 10 === 0 || completed === chains.length) {
          console.log(`fetching networks: ${completed}/${chains.length}`);
        }
      }
    }),
);

// @ts-expect-error
results
  .filter((x) => Boolean(x))
  .sort((a, b) =>
    a.chainIsSupported === b.chainIsSupported
      ? a.id - b.id
      : b.chainIsSupported - a.chainIsSupported,
  )
  .forEach((x) => {
    // Don't display testnet
    if (!x) {
      return;
    }

    const hasError = !x.hasTokenList || !x.hasWrappedToken;
    const shouldDisplay = Boolean(selectedChainId) || hasError;

    if (!shouldDisplay) {
      return;
    }

    console.log("");
    console.log(`${x.name} (${x.id})`);

    if (!x.chainIsSupported) {
      console.log(" \x1b[31m✗\x1b[0m Missing CREATE2 contract");
      return;
    } else {
      console.log(" \x1b[32m✓\x1b[0m CREATE2 contract found!");
    }

    if (!x.hasWrappedToken) {
      console.log(" \x1b[31m✗\x1b[0m Missing Wrapped token");
    } else {
      console.log(" \x1b[32m✓\x1b[0m Wrapped token setup!");
    }

    if (!x.hasTokenList) {
      console.log(" \x1b[31m✗\x1b[0m Missing Token List");
    } else {
      console.log(" \x1b[32m✓\x1b[0m Token List available!");
    }
  });
