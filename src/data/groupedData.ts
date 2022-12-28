import { LETTERS, makeData } from "./rawData";
import { groupBy, mapValues, keyBy, random, orderBy, map } from "lodash";
import { Person, KeyOfByProp } from "./types";

function getFirstLetter(name: string) {
  return name.charAt(0).toUpperCase();
}

function GroupByFirstLetterAndSort(
  data: Person[],
  field: KeyOfByProp<Person, string>
) {
  let grouped = groupBy(data, (person) => getFirstLetter(person[field]));
  const withNames = map(LETTERS, (firstLetter) => {
    const lane = grouped[firstLetter] || [];
    return {
      name: firstLetter,
      data: lane,
    };
  });
  return orderBy(withNames, (lane) => lane.name);
}

function generateHeights(data: Person[]) {
  const dataMap = keyBy(data, "id");
  return mapValues(dataMap, (person) => random(30, 100));
}

export function makeLaneToColumnsToPersonData() {
  const rawData = makeData(1000);
  let byLanes = GroupByFirstLetterAndSort(rawData, "lastName");
  const lanesData = map(byLanes, ({ data, name }) => ({
    data: GroupByFirstLetterAndSort(data, "firstName"),
    name,
  }));

  return {
    data: lanesData,
    height: generateHeights(rawData),
  };
}
