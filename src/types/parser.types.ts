import { CompareOperationList } from "../constants";

export type Filter = CompareOperation | FilterOperation;

export type ComparisionValue = string;

interface Operation {
  op: string;
}

export interface CompareOperation extends Operation {
  attrPath: string;
  comparisionValue: ComparisionValue;
}

export type FilterOperation = NotOperation | AndOrOperation;

interface NotOperation extends Operation {
  op: "not";
  filter: Filter;
}

interface AndOrOperation extends Operation {
  op: "and" | "or";
  filter: Filter[];
}
