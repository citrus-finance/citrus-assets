import { Token } from "./Token.js";
import { TokenList } from "./TokenList.js";

type Extension = {
  wrapped?: string;
};

export type OutputToken = Token<Extension>;

export type OutputTokenList = TokenList<Extension>;
