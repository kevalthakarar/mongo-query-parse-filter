import { Tokens, TokenizerUtils } from "./utils";
import {
  PriorityOperator,
  PriorityLevel,
  CompareOperationList,
} from "./constants";
import { Token, TokenList, Filter, FilterOperation } from "./types";

export class Parser {
  constructor() {}

  private tokenizer() {}

  parse(query: string) {
    const tokenList = TokenizerUtils(query);
    const tokenObject = new Tokens(tokenList);
    const filter = this.parseFilter(tokenObject);

    if (tokenObject.peek().type !== "EOT") {
      throw new Error(`unexpected EOT ${tokenObject.getList()}`);
    }

    return filter;
  }

  private parseFilter(token: TokenList): Filter {
    const parsedExpression = this.parseExpression(token);

    return this.parseInfixOperator(
      parsedExpression,
      token,
      PriorityLevel.LOWEST
    );
  }

  private parseInfixOperator(
    left: Filter,
    tokenList: TokenList,
    priorityLevel: PriorityLevel
  ): Filter {
    const operation = tokenList.peek().literal.toLowerCase();
    const currentPriority = PriorityOperator[operation];

    if (!currentPriority || priorityLevel >= currentPriority) {
      return left;
    }

    const filters = [left];

    /**
     * Recursively Parse Till We have an same Operation
     */

    while (tokenList.peek().literal.toLowerCase() === operation) {
      let rightFilter = this.parseExpression(tokenList.forward());
      const rightOperation = tokenList.peek().literal.toLowerCase();

      if (PriorityOperator[rightOperation] > currentPriority) {
        rightFilter = this.parseInfixOperator(
          rightFilter,
          tokenList,
          currentPriority
        );
      }

      filters.push(rightFilter);
    }

    const finalFilter = { op: operation, filter: filters } as FilterOperation;

    return this.parseInfixOperator(finalFilter, tokenList, priorityLevel);
  }

  private parseExpression(tokenList: TokenList): Filter {
    const token = tokenList.shift();

    /**
     * Parsing Bracker "(" and ending also should be with ")"
     */
    if (token.literal === "(") {
      // parsing remaining field using parseFilter and last token should end with ")"
      const filter = this.parseFilter(tokenList);
      const closeToken = tokenList.shift();
      if (closeToken.literal !== ")") {
        throw new Error(
          `Unexpected token [${closeToken.literal}(${closeToken.type})] expected ')'`
        );
      }

      return filter;
    }

    /**
     * Seperately Handling not Case
     */
    if (token.literal.toLowerCase() === "not") {
      const notFilter: Filter = {
        op: "not",
        filter: this.parseExpression(tokenList),
      };
      return this.parseInfixOperator(notFilter, tokenList, PriorityLevel.NOT);
    }

    /**
     * If Word then Checking the Operation type and Parsing the compare value
     */
    if (token.type === "Word") {
      return this.parseValueFilter(token, tokenList);
    }

    throw new Error(`Unexpected token ${token.literal} (${token.type})`);
  }

  private parseValueFilter(token: Token, tokenList: TokenList): Filter {
    if (token.type != "Word") {
      throw new Error(`Unexpected token ${token.literal} expected Word`);
    }

    const attrPath = token.literal;
    const newToken = tokenList.shift();
    const operation = newToken.literal.toLowerCase();

    if (CompareOperationList.includes(operation)) {
      const comparisionValue = this.parseComparisionFilter(tokenList);
      return { op: operation, attrPath, comparisionValue };
    }

    throw new Error(
      `Unexpected token ${attrPath} ${newToken.literal} as value`
    );
  }

  private parseComparisionFilter(tokenList: TokenList) {
    const token = tokenList.shift();
    try {
      const value = JSON.parse(token.literal);
      if (
        value === null ||
        ["string", "number", "boolean"].includes(typeof value)
      ) {
        return value;
      }
      throw new Error(
        `${token.literal} is ${typeof value} (un supported value)`
      );
    } catch (err) {
      throw new Error(`[${token.literal}(${token.type})] is not json`);
    }
  }
}
