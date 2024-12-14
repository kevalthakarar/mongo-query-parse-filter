import { TokenizerUtils } from "../../src/utils";
import { Parser } from "../../src/parser";

const parser = new Parser();

// let s = TokenizerUtils("comments.0.author eq keval");

let s = parser.parse(
  '((userName regex "(?i)kevalthakarar$") or (email eq "thakararkeval1010@leena.ai"))'
);

console.log(s);
