// rr.js

/**
 * Round Robin (RR) Scheduling Algorithm
 *
 * @param {Array} processes - An array of process objects: [{ id, arrivalTime, burstTime }, ...]
 * @param {number} timeQuantum - The time quantum for each round
 * @returns {Array} schedule - Array of schedule objects: [{ pid, startTime, finishTime }, ...]
 */
export function rr(processes, timeQuantum) {
    // Create a copy of processes sorted by arrivalTime
    const sortedProcesses = processes.slice().sort((a, b) => a.arrivalTime - b.arrivalTime);
    const n = sortedProcesses.length;
  
    // Arrays to store the start and finish times for each process (indexed by sorted order)
    const startTimes = new Array(n).fill(-1);
    const finishTimes = new Array(n).fill(-1);
  
    // Array to track remaining burst time for each process
    const remainingTime = sortedProcesses.map((proc) => proc.burstTime);
  
    // Ready queue holds indices (of sortedProcesses) that are waiting for CPU time
    const readyQueue = [];
    let t = 0; // simulation time
    let index = 0; // pointer to the next process to arrive
  
    // Run the simulation until all processes have finished
    while (index < n || readyQueue.length > 0) {
      // If no process is waiting, jump time to the arrival of the next process
      if (readyQueue.length === 0) {
        t = Math.max(t, sortedProcesses[index].arrivalTime);
        readyQueue.push(index);
        index++;
      } else {
        // Dequeue the next process to run
        const i = readyQueue.shift();
        // Record start time if this is the process's first run
        if (startTimes[i] === -1) {
          startTimes[i] = t;
        }
        // Calculate the actual time slice (either full quantum or the remaining burst time)
        const execTime = Math.min(timeQuantum, remainingTime[i]);
        t += execTime;
        remainingTime[i] -= execTime;
  
        // Enqueue all processes that have now arrived during this time slice
        while (index < n && sortedProcesses[index].arrivalTime <= t) {
          readyQueue.push(index);
          index++;
        }
  
        // If the process is finished, record its finish time
        if (remainingTime[i] === 0) {
          finishTimes[i] = t;
        } else {
          // If not finished, push it back into the ready queue
          readyQueue.push(i);
        }
      }
    }
  
    // Build the schedule result array
    const schedule = sortedProcesses.map((proc, i) => ({
      pid: proc.id,
      startTime: startTimes[i],
      finishTime: finishTimes[i],
    }));
  
    return schedule;
  }
  