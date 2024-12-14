interface CoinGeckoAssetPlatform {
  id: string;
  chain_identifier: number | null;
  name: string;
  shortname: string;
  native_coin_id: string;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  slug: string;
  image_url: string;
}

const response = await fetch(
  "https://api.coingecko.com/api/v3/asset_platforms.json",
);

if (response.status !== 200) {
  throw new Error("Failed to fetch coingecko asset platforms");
}

const assetPlatforms = (await response.json()) as CoinGeckoAssetPlatform[];

const assetPlatformMap = new Map(
  // TODO: handle missing chain ids
  assetPlatforms
    .filter((x) => x.chain_identifier != null)
    .map((x) => [x.chain_identifier!, x]),
);

export function getCoingeckoAssetPlatform(
  chainId: number,
): CoinGeckoAssetPlatform | null {
  const assetPlatform = assetPlatformMap.get(chainId);

  return assetPlatform ?? null;
}
