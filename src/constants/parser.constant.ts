export enum PriorityLevel {
  LOWEST = 1,
  OR = 2,
  AND = 3,
  NOT = 4,
}

export const PriorityOperator: { [key: string]: PriorityLevel } = {
  or: PriorityLevel.OR,
  and: PriorityLevel.AND,
  not: PriorityLevel.NOT,
};

export const CompareOperationList = [
  "eq",
  "neq",
  "gt",
  "lt",
  "gte",
  "lte",
  "in",
  "nin",
  "regex",
];
