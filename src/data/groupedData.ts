import { makeData } from "./rawData";
import { groupBy, mapValues, keyBy, random } from "lodash";
import { Person, KeyOfByProp } from "./types";

function getFirstLetter(name: string) {
  return name.charAt(0).toUpperCase();
}

function keyByAndGroupByFirstLetter(
  data: Person[],
  field: KeyOfByProp<Person, string>
) {
  let grouped = groupBy(data, (person) => getFirstLetter(person[field]));
  return keyBy(grouped, (lane) => getFirstLetter(lane[0][field]));
}

function generateHeights(data: Person[]) {
  const dataMap = keyBy(data, "id");
  return mapValues(dataMap, (person) => random(30, 100));
}

export function makeLaneToColumnsToPersonData() {
  const rawData = makeData(1000);
  let byLanes = keyByAndGroupByFirstLetter(rawData, "lastName");
  const lanesData = mapValues(byLanes, (lane) =>
    keyByAndGroupByFirstLetter(lane, "firstName")
  );

  return {
    data: lanesData,
    height: generateHeights(rawData)
  };
}
