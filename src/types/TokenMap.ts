import { Token } from "./Token.js";

export type TokenMap = Map<number, Map<string, Token[]>>;

export type CurrentTokenMap = Map<
  number,
  Map<string, Token<{ wrapped?: string }>>
>;
