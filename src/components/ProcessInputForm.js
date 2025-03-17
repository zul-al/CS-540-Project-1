// ProcessInputForm.js
import React from 'react';

const ProcessInputForm = ({ numProcesses, setNumProcesses, timeQuantum, setTimeQuantum, onSubmit }) => (
  <form onSubmit={onSubmit}>
    <label>
      Number of Processes:
      <input type="number" value={numProcesses} onChange={(e) => setNumProcesses(Number(e.target.value))} min="1" />
    </label>
    <br />
    <label>
      Time Quantum (for RR):
      <input type="number" value={timeQuantum} onChange={(e) => setTimeQuantum(Number(e.target.value))} min="1" />
    </label>
    <br />
    <button type="submit">Run Simulation</button>
  </form>
);

export default ProcessInputForm;
