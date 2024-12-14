import { CompareOperationList } from "../constants";

export type Filter = CompareOperation | FilterOperation;

export type ComparisionValue = string | number | boolean | null;

interface Operation {
  op: string;
}

export interface CompareOperation extends Operation {
  attrPath: string;
  comparisionValue: ComparisionValue | ComparisionValue[];
}

export interface FilterOperation extends Operation {
  op: "and" | "or" | "not";
  filter: Filter | Filter[];
}
