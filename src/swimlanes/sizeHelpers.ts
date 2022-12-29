import { max, map, sumBy } from "lodash";
import { LaneType, Person } from "../data/types";

export const COLUMN_WIDTH = 200;
export const HEADER_HEIGHT = 50;
export const LANE_HEADER_WIDTH = 200;
export const LANE_PADDING = 20;

function getColumnSize(column: Person[], heights: { [key: number]: number }) {
  return sumBy(column, (person) => heights[person.id]);
}

export function getLaneHeight(
  lane: LaneType,
  heights: { [key: number]: number }
) {
  return max(map(lane.data, (col) => getColumnSize(col.data, heights)));
}
