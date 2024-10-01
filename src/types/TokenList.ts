import { Token, TokenExtensions } from "./Token.js";

export interface TokenList<T extends TokenExtensions = TokenExtensions> {
  keywords?: string[];
  logoURI?: string;
  name: string;
  tags?: { [key: string]: TagDefinition };
  timestamp: Date;
  tokenMap?: { [key: string]: Token };
  tokens: Token<T>[];
  version: Version;
  [property: string]: any;
}

export interface TagDefinition {
  description: string;
  name: string;
}

export interface Version {
  major: number;
  minor: number;
  patch: number;
}
