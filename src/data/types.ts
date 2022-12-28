import type { makeLaneToColumnsToPersonData } from "./groupedData";

export type Person = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  progress: number;
  status: "relationship" | "complicated" | "single";
  createdAt: Date;
};

type Helper<T, PropType, ExcludePropType> = {
  [K in keyof T]: T[K] extends PropType
    ? T[K] extends ExcludePropType
      ? never
      : K
    : never;
};

export type KeyOfByProp<T, PropType, ExcludePropType = undefined> = Exclude<
  Helper<T, PropType, ExcludePropType>[keyof T],
  undefined
>;

export type LanesWithHeight = ReturnType<typeof makeLaneToColumnsToPersonData>;
export type LanesDataType = LanesWithHeight["data"];
export type LaneType = LanesDataType[number];

export const letters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z"
];
