import { Token, EOT } from "./types/token.types";
const PATTERN =
	/^(?:(\s+)|(-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?(?![-\w._:\\)\s]))|("(?:[^"\\]|\\.|\n)*")|([[()]|]\.?)|(\w[-\w._:/%]*))/;

export function tokenizer(s: string): Token[] {
	const tokenList: Token[] = [];

	let n;

	while ((n = PATTERN.exec(s))) {
		if (n[1] || n[0].length === 0) {
			// ignore
		} else if (n[2]) {
			tokenList.push({ literal: n[2], type: "Number" });
		} else if (n[3]) {
			const literal = n[3].replace(/\\(?!")/g, "\\\\");
			tokenList.push({ literal, type: "Quoted" });
		} else if (n[4]) {
			tokenList.push({ literal: n[4], type: "Bracket" });
		} else if (n[5]) {
			tokenList.push({ literal: n[5], type: "Word" });
		}

		s = s.substring(n.index + n[0].length);
	}

	tokenList.push(EOT);
	return tokenList;
}
