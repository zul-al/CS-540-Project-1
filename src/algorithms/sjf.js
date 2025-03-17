// sjf.js

/**
 * Shortest Job First (SJF) Scheduling Algorithm - Non-Preemptive
 *
 * @param {Array} processes - An array of process objects:
 *   [{ id, arrivalTime, burstTime }, ...]
 * @returns {Array} schedule - Array of schedule objects:
 *   [{ pid, startTime, finishTime }, ...]
 */
export function sjf(processes) {
    const n = processes.length;
    // Create a copy of the processes to avoid mutating the original array
    const processesCopy = processes.map(proc => ({ ...proc }));
    
    // Arrays to record the start and finish times for each process
    const startTimes = new Array(n).fill(-1);
    const finishTimes = new Array(n).fill(-1);
    // Array to mark if a process has completed
    const completed = new Array(n).fill(false);
    
    let currentTime = 0;
    let completedCount = 0;
    const schedule = [];
    
    // Run the simulation until all processes are scheduled
    while (completedCount < n) {
      // Find the process with the shortest burst time among those that have arrived and are not completed
      let idx = -1;
      let minBurst = Infinity;
      for (let i = 0; i < n; i++) {
        if (!completed[i] && processesCopy[i].arrivalTime <= currentTime) {
          if (processesCopy[i].burstTime < minBurst) {
            minBurst = processesCopy[i].burstTime;
            idx = i;
          }
        }
      }
      
      // If no process is ready, increment currentTime
      if (idx === -1) {
        currentTime++;
      } else {
        // Schedule the selected process
        startTimes[idx] = currentTime;
        finishTimes[idx] = currentTime + processesCopy[idx].burstTime;
        currentTime += processesCopy[idx].burstTime;
        
        schedule.push({
          pid: processesCopy[idx].id,
          startTime: startTimes[idx],
          finishTime: finishTimes[idx],
        });
        
        completed[idx] = true;
        completedCount++;
      }
    }
    
    return schedule;
  }
  