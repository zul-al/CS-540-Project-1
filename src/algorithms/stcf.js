// stcf.js

/**
 * Shortest Time-to-Completion First (STCF) Scheduling Algorithm - Preemptive
 *
 * @param {Array} processes - An array of process objects:
 *   [{ id, arrivalTime, burstTime }, ...]
 * @returns {Array} schedule - Array of schedule objects:
 *   [{ pid, startTime, finishTime }, ...]
 */
export function stcf(processes) {
    const n = processes.length;
    
    // Initialize arrays to store each process's start time, finish time, and remaining time.
    const startTimes = new Array(n).fill(-1);
    const finishTimes = new Array(n).fill(-1);
    const remainingTime = processes.map(proc => proc.burstTime);
    const completed = new Array(n).fill(false);
  
    let currentTime = 0;
    let completedCount = 0;
  
    // Continue simulation until all processes complete.
    while (completedCount < n) {
      // Find the process with the shortest remaining time that has arrived.
      let idx = -1;
      let minRemaining = Infinity;
      for (let i = 0; i < n; i++) {
        if (
          processes[i].arrivalTime <= currentTime &&
          !completed[i] &&
          remainingTime[i] > 0 &&
          remainingTime[i] < minRemaining
        ) {
          minRemaining = remainingTime[i];
          idx = i;
        }
      }
  
      // If no process is available, advance time.
      if (idx === -1) {
        currentTime++;
        continue;
      }
  
      // Record the start time if this is the first time the process is being executed.
      if (startTimes[idx] === -1) {
        startTimes[idx] = currentTime;
      }
  
      // Execute the selected process for 1 time unit.
      remainingTime[idx]--;
      currentTime++;
  
      // If the process has finished executing, record its finish time.
      if (remainingTime[idx] === 0) {
        completed[idx] = true;
        completedCount++;
        finishTimes[idx] = currentTime;
      }
    }
  
    // Build the schedule array.
    const schedule = processes.map((proc, i) => ({
      pid: proc.id,
      startTime: startTimes[i],
      finishTime: finishTimes[i],
    }));
  
    return schedule;
  }
  