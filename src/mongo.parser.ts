import { Parser } from "./parser";
import {
  Filter,
  FilterOperation,
  CompareOperation,
  MongoFilter,
  MongoCompareOperation,
} from "./types";

export class MongoQuery {
  private readonly parser: Parser;

  private readonly compareOperationMapping: { [key: string]: string };

  constructor() {
    this.parser = new Parser();
    this.compareOperationMapping = {
      eq: "$eq",
      neq: "$ne",
      gt: "$gt",
      gte: "$gte",
      lt: "$lt",
      lte: "$lte",
      in: "$in",
      nin: "$nin",
      regex: "$regex",
      or: "$or",
      and: "$and",
      not: "$not",
    };
  }

  buildQuery(query: string) {
    const commonParserResponse = this.parser.parse(query);
    return this.parseQuery(commonParserResponse);
  }

  private parseQuery(commonFilter: Filter): MongoFilter {
    if (this.isFilterOperation(commonFilter)) {
      if (commonFilter.op == "not") {
        const notOperation = this.compareOperationMapping[commonFilter.op];
        const newParseQuery = this.parseQuery(commonFilter.filter as Filter);
        return { [notOperation]: newParseQuery };
      } else {
        const operation = this.compareOperationMapping[commonFilter.op];
        const filterList = commonFilter.filter as Filter[];
        const filterQueryList: MongoFilter[] = [];

        for (const filterQuery of filterList) {
          const parsedFilterQuery = this.parseQuery(filterQuery);
          filterQueryList.push(parsedFilterQuery);
        }

        return { [operation]: filterQueryList };
      }
    }

    if (this.isCompareOperation(commonFilter)) {
      const field = commonFilter.attrPath;
      const operation = this.compareOperationMapping[commonFilter.op];
      const comparisionValue = commonFilter.comparisionValue;
      const mongoCompareOperation: MongoCompareOperation = {
        [field]: { [operation]: comparisionValue },
      };
      return mongoCompareOperation;
    }

    throw new Error("Filter type is invalid");
  }

  private isCompareOperation(filter: Filter): filter is CompareOperation {
    return (filter as CompareOperation).attrPath !== undefined;
  }

  private isFilterOperation(filter: Filter): filter is FilterOperation {
    return ["and", "or", "not"].includes((filter as FilterOperation).op);
  }
}
