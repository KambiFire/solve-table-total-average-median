import { useReducer } from "react";
import "./styles.css";

export default function App() {
  const initial = [];
  const [results, dispatch] = useReducer(reducer, initial);

  const handleSubmit = () => dispatch(inputTable);
  const handleReset = () => dispatch([]);

  const isSolved = results.length > 0;

  return (
    <div className="App">
      <h1>Solve Table (total, average, median)</h1>
      <h2>{isSolved ? "Results" : "Input"} Table</h2>
      {!isSolved ? generateTable(inputTable) : generateTable(results)}
      <p>
        <button
          style={styles.button}
          onClick={isSolved ? handleReset : handleSubmit}
        >
          <h2>{isSolved ? "Back / Reset" : "Solve"}</h2>
        </button>
      </p>
    </div>
  );
}

//***** Helper functions *********

// Input Table
const inputTable = [
  [
    "Brewery",
    "Uxbridge, UK",
    "Malmo, Sweden",
    "Torino, Italy",
    "Ottawa, Canada",
    "Canberra, Australia"
  ],
  ["Operational Costs (Millions Euros)", 3.6, 0.3, 2.8, 0.28, 0.3],
  ["Marketing & Development (Millions Euros)", 12, 2.2, 3.5, 8, 7],
  ["Monthly Output (Thousands of liters)", 12000, 1200, 8000, 1000, 4500],
  ["Total Output as % of 2004", 120, 90, 70, 80, 110],
  ["Revenues (Millions Euros)", 25, 3, 14, 3, 8]
];

// Reducer
const reducer = (state, action) => {
  state = [];

  action.forEach((row, index) => {
    if (!index) return state; // skip first row

    const numArray = row.slice(1);
    const sum = getSum(numArray);

    state.push({
      item: row[0],
      total: roundNum(sum, 2),
      average: roundNum(sum / numArray.length, 2),
      median: roundNum(getMedian(numArray), 2)
    });
  });

  return state;
};

// Round Number
const roundNum = (value, decimals) =>
  value > 0
    ? Number(Math.round(value + "e" + decimals) + "e-" + decimals)
    : value < 0
    ? -Number(Math.round(Math.abs(value) + "e" + decimals) + "e-" + decimals)
    : 0;

// Get sum from array of numbers
const getSum = (arr) => arr.reduce((total, curr) => (total += curr), 0);

// Get median from array of numbers
const getMedian = (inputArray) => {
  const arr = inputArray.sort((a, b) => a - b);
  const mid = Math.floor(arr.length / 2);
  if (arr.length % 2 !== 0) return arr[mid];
  else return (arr[mid - 1] + arr[mid]) / 2;
};

// Generate Table
const generateTable = (data) => {
  let values = [];
  let headers = [];
  let isObject = false;

  if (Array.isArray(data[0])) {
    headers = data[0];
    values = data.slice(1);
  } else if (typeof data[0] === "object") {
    headers = Object.keys(data[0]);
    values = data;
    isObject = true;
  }

  return (
    <table style={styles.table}>
      <colgroup>
        <col style={{ width: "auto" }} />
        {headers.map((header, index) =>
          index !== 0 ? <col key={index} style={styles.tableColumn} /> : null
        )}
      </colgroup>
      <thead style={styles.tableHeader}>
        {isObject ? (
          <tr>
            {headers.map((key, index) => (
              <td key={index}>
                <h3>{key}</h3>
              </td>
            ))}
          </tr>
        ) : (
          <tr>
            {headers.map((header, index) => (
              <td key={index}>
                <h3>{header}</h3>
              </td>
            ))}
          </tr>
        )}
      </thead>
      <tbody>
        {values.map((row, index) =>
          isObject ? (
            <tr key={index}>
              <td>
                <h3>{row[headers[0]]}</h3>
              </td>
              {headers.map(
                (item, index2) =>
                  index2 !== 0 && (
                    <td key={index2}>
                      <h3 style={styles.tableData}>{row[item]}</h3>
                    </td>
                  )
              )}
            </tr>
          ) : (
            <tr key={index}>
              <td>
                <h3>{row[0]}</h3>
              </td>
              {headers.map(
                (item, index2) =>
                  index2 !== 0 && (
                    <td key={index2}>
                      <h3 style={styles.tableData}>{row[index2]}</h3>
                    </td>
                  )
              )}
            </tr>
          )
        )}
      </tbody>
    </table>
  );
};

// Styles
const styles = {
  table: {
    width: "90%",
    border: "1px solid",
    textAlign: "left",
    marginLeft: 50
  },
  tableHeader: {
    textAlign: "center",
    backgroundColor: "lightBlue",
    textTransform: "capitalize"
  },
  tableColumn: {
    backgroundColor: "lightgrey",
    width: "10%"
  },
  tableData: {
    textAlign: "right",
    marginRight: 10
  },
  button: {
    padding: "0 25px",
    color: "white",
    backgroundColor: "black",
    borderRadius: "10px"
  }
};
