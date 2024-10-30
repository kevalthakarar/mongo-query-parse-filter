export type TokenType = "Number" | "Quoted" | "Bracket" | "Word" | "EOT";
export const EOT = { type: "EOT" as TokenType, literal: "" };

export type Token = {
	type: TokenType;
	literal: string;
};

export interface TokenList {
	peek(): Token;
	forward(): TokenList;
	shift(): Token;
}
