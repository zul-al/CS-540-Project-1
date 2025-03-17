// SchedulerSimulator.js
import React, { useState } from 'react';
import ProcessInputForm from './ProcessInputForm';
import ResultsChart from './ResultsChart';
import TimelineAnimation from './TimelineAnimation';
import { generateProcesses } from '../utils/generateProcesses';
import { fifo } from '../algorithms/fifo';
import { sjf } from '../algorithms/sjf';
import { stcf } from '../algorithms/stcf';
import { rr } from '../algorithms/rr';
import { mlfq } from '../algorithms/mlfq';
import jsPDF from 'jspdf';

const SchedulerSimulator = () => {
  const [numProcesses, setNumProcesses] = useState(5);
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [schedules, setSchedules] = useState({});
  const [selectedAlgo, setSelectedAlgo] = useState('FIFO');

  const handleSimulation = (e) => {
    e.preventDefault();
    const processes = generateProcesses(numProcesses);
    const newSchedules = {
      FIFO: fifo(processes),
      SJF: sjf(processes),
      STCF: stcf(processes),
      RR: rr(processes, timeQuantum),
      MLFQ: mlfq(processes)
    };
    setSchedules(newSchedules);
  };

  const handlePDFGeneration = () => {
    const doc = new jsPDF();
    let y = 10;
    Object.entries(schedules).forEach(([algo, schedule]) => {
      doc.text(`${algo} Schedule:`, 10, y);
      y += 10;
      schedule.forEach((item) => {
        doc.text(`Process ${item.pid}: Start ${item.startTime} - End ${item.finishTime}`, 10, y);
        y += 10;
      });
      y += 10;
    });
    doc.save('schedules.pdf');
  };

  return (
    <div>
      <h1>CPU Scheduling Simulator</h1>
      <ProcessInputForm
        numProcesses={numProcesses}
        setNumProcesses={setNumProcesses}
        timeQuantum={timeQuantum}
        setTimeQuantum={setTimeQuantum}
        onSubmit={handleSimulation}
      />
      <button onClick={handlePDFGeneration}>Generate PDF Report</button>
      <div>
        {/* Optionally, allow users to select which algorithm to animate */}
        <label>
          Animate Algorithm:
          <select value={selectedAlgo} onChange={(e) => setSelectedAlgo(e.target.value)}>
            {Object.keys(schedules).map(algo => (
              <option key={algo} value={algo}>{algo}</option>
            ))}
          </select>
        </label>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {Object.keys(schedules).map((algo) => (
          <div key={algo} style={{ flex: '1 1 45%', margin: '10px' }}>
            <ResultsChart schedule={schedules[algo]} title={`${algo} Algorithm`} />
          </div>
        ))}
      </div>
      {schedules[selectedAlgo] && (
        <div>
          <h2>{selectedAlgo} Timeline Animation</h2>
          <TimelineAnimation schedule={schedules[selectedAlgo]} />
        </div>
      )}
    </div>
  );
};

export default SchedulerSimulator;
