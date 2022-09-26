import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect, useCallback, useRef} from 'react'
import produce from "immer"


let numCols = 50;
let numRows = 50;

const operations = [
    [0,1],
    [0,-1],
    [1, -1],
    [-1,1],
    [1,1],
    [-1,-1],
    [1,0],
    [-1,0]
]

function App() {
    const [grid, setGrid] = useState(() => {
        const rows = [];
        for (let i = 0; i < numRows; i++) {
            rows.push(Array.from(Array(numCols), () => 0))
        }

        return rows;
        })

    const [generation, setGeneration] = useState(0) 
    
    const [running, setRunning] = useState(false)

    const runningRef = useRef(running)
    runningRef.current = running

    const time = 200;

    const runSimulation = useCallback(() => {
        if(!runningRef.current) {
            return
        }
        setGrid((g) => {
            return produce(g, gridCopy => {
                for (let i = 0; i < numRows; i++) {
                    for (let k = 0; k<numCols; k++) {
                        let neighbors = 0;
                        operations.forEach(([x,y]) => {
                            const newI = i+x;
                            const newK = k+y;
                            if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                                neighbors += g[newI][newK];
                            }
                        })
                        if (neighbors < 2 || neighbors > 3) {
                            gridCopy[i][k] = 0;
                            
                        }
                        else if (g[i][k] === 0 && neighbors === 3) {
                            gridCopy[i][k] = 1;
                            
                        }
                    }
                }
            })
        })
        

        setTimeout(runSimulation, time);
        setTimeout(setGeneration((prev) => prev + 1), time);
        
    }, [])


    console.log(grid)
    return (
        <>
        <div 
        style={{
            display: "grid",
            gridTemplateColumns: `repeat(${numCols}, 20px)`
            }}>
            {grid.map((rows, i) => 
                rows.map((col, k) => 
                <div 
                key={`${i}-${k}`}
                onClick={() => {
                    const newGrid  = produce(grid, gridCopy => {
                        gridCopy[i][k] = grid[i][k] ? 0 : 1;
                    })
                    setGrid(newGrid)
                }}
                style={{width: "20px", height: "20px", 
                backgroundColor: grid[i][k] ? "black" : undefined,
                border: "1px solid black"

                }} >


                </div>))}
        </div>
        <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >{running? "Stop" : "Start"}</button>
      <button
        onClick={() => {
        setGeneration(0)
          
        }}
      >Reset</button>

        <div>Generation: {generation}</div>
    </>


    );
}

export default App;
