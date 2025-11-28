import { writeFile } from "fs/promises";
import {
  getLayerZeroChainIds,
  getLayerZeroDeployment,
} from "./utils/layerzero.js";

export default async function buildStables() {
  const output = {
    stables: [
      {
        address: "0xe31A2a11a5427b420B1083466c98C8A151FdacD3",
        symbol: "ciUSD",
        name: "Citrus USD",
        iconUrl: "/stables/icons/ciusd.svg",
        syntheticVaults: {
          100: ["0x2EaCa4A751Fd15Eb0da89501Bd7b673e4F1a6952"],
        },
      },
      {
        address: "0x0000000000000000000000000000000000000000",
        symbol: "ciBTC",
        name: "Citrus BTC",
        iconUrl: "/stables/icons/cibtc.svg",
        syntheticVaults: {},
      },
      {
        address: "0x0000000000000000000000000000000000000000",
        symbol: "ciEUR",
        name: "Citrus EUR",
        iconUrl: "/stables/icons/cieur.svg",
        syntheticVaults: {},
      },
      {
        address: "0x0000000000000000000000000000000000000000",
        symbol: "ciGBP",
        name: "Citrus GBP",
        iconUrl: "/stables/icons/cigbp.svg",
        syntheticVaults: {},
      },
    ].map((stable) => ({
      ...stable,
      iconUrl: "https://assets.citrus.finance" + stable.iconUrl,
    })),
    layerZero: {
      chains: Object.fromEntries(
        getLayerZeroChainIds().map((chainId) => [
          chainId,
          getLayerZeroDeployment(chainId)!,
        ]),
      ),
    },
  };

  await writeFile(
    "assets/stables/stables.json",
    JSON.stringify(output, null, 2),
  );
}
