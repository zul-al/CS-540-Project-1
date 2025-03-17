// generateProcesses.js
export const generateProcesses = (numProcesses) => {
    const processes = [];
    for (let i = 0; i < numProcesses; i++) {
      processes.push({
        id: i + 1,
        arrivalTime: Math.floor(Math.random() * 10), // e.g., 0 to 9
        burstTime: Math.floor(Math.random() * 10) + 1, // e.g., 1 to 10
      });
    }
    return processes;
  };
  