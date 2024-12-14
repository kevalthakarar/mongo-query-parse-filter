import { TokenList, Token, EOT } from "../types";

export class Tokens implements TokenList {
  i: number;

  private current: Token | undefined;

  constructor(private list: Token[]) {
    this.i = 0;
    this.current = this.list[this.i];
  }

  peek(): Token {
    return this.current || EOT;
  }

  forward(): TokenList {
    this.current = this.list[++this.i];
    return this;
  }

  shift(): Token {
    const current = this.peek();
    this.forward();
    return current;
  }

  getList(): string[] {
    return this.list.map((value, index) =>
      index === this.i ? `[${value.literal}]` : value.literal
    );
  }
}
