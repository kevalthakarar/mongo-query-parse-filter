import { ComparisionValue } from "./parser.types";

export type MongoFilter = MongoCompareOperation | MongoFilterOperation;

export interface MongoOperation {
  [operation: string]: ComparisionValue | ComparisionValue[];
}

export interface MongoCompareOperation {
  [field: string]: MongoOperation;
}

export type MongoFilterOperation = MongoNotOperation | MongoAndOrOperaton;

interface MongoNotOperation {
  [operation: string]: MongoFilter;
}

interface MongoAndOrOperaton {
  [operation: string]: MongoFilter[];
}
