export type TokenExtensions = {
  [key: string]:
    | boolean
    | number
    | {
        [key: string]:
          | boolean
          | number
          | { [key: string]: boolean | number | null | string }
          | null
          | string;
      }
    | null
    | string;
};

export interface Token<
  T extends TokenExtensions | undefined = TokenExtensions,
> {
  address: string;
  chainId: number;
  decimals: number;
  extensions: T;
  logoURI?: string;
  name: string;
  symbol: string;
  tags?: string[];
}
