import "./styles.css";
import { useMemo } from "react";
import { makeLaneToColumnsToPersonData } from "./data";
import { Swimlanes } from "./swimlanes/Swimlanes";

export default function App() {
  const { data, height } = useMemo(() => makeLaneToColumnsToPersonData(), []);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <Swimlanes data={data} cardsHeights={height} />
    </div>
  );
}
