// fifo.js

/**
 * FIFO (First-In, First-Out) scheduling
 * @param {Array} processes - array of process objects: { id, arrivalTime, burstTime }
 * @returns {Array} schedule - array of { pid, startTime, finishTime }
 */
export function fifo(processes) {
    // Sort the processes by their arrival time in ascending order
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  
    let currentTime = 0;
    const schedule = [];
  
    sortedProcesses.forEach((proc) => {
      // If the CPU is idle until the process arrives, jump currentTime to the arrival time
      if (currentTime < proc.arrivalTime) {
        currentTime = proc.arrivalTime;
      }
  
      // Record the start time (when the process begins execution)
      const startTime = currentTime;
  
      // The finish time is simply the start time plus the burst time
      const finishTime = startTime + proc.burstTime;
  
      // Push this info into our schedule
      schedule.push({
        pid: proc.id,
        startTime: startTime,
        finishTime: finishTime,
      });
  
      // Advance the currentTime
      currentTime = finishTime;
    });
  
    return schedule;
  }
  