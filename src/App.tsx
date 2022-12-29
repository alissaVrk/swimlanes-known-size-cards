import "./styles.css";
import { Swimlanes } from "./swimlanes/Swimlanes";
import { DataProvider } from "./swimlanes/DataContext";

export default function App() {

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <DataProvider>
        <Swimlanes />
      </DataProvider>
    </div>
  );
}
