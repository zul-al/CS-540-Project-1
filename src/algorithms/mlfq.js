/**
 * MLFQ (Multi-Level Feedback Queue) Scheduling
 *
 * @param {Array} processes - An array of process objects: 
 *   [{ id, arrivalTime, burstTime }, ...]
 * @param {number} numberOfQueues - How many queues to use (default 3).
 * @param {number[]} timeQuanta - Time quanta for each queue (e.g. [4, 8, 16]).
 * @returns {Array} - An array of schedule objects: [{ pid, startTime, finishTime }, ...].
 *
 * Note: This is a simplified time-step MLFQ without strict preemption rules for new arrivals.
 */
export function mlfq(
    processes, 
    numberOfQueues = 3, 
    timeQuanta = [4, 8, 16]
  ) {
    // Sort processes by arrivalTime so we can add them in the correct order
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  
    // We'll track:
    //  - remainingTime[i]: how many time units are left for process i
    //  - startTime[i]: the first time the process begins execution (or -1 if it hasn't started)
    //  - finishTime[i]: the time when the process finishes (or -1 if not finished)
    //  - currentQueue[i]: which queue the process is currently in
    //  - timeUsedInQueue[i]: how many time units the process has used in its current queue
    const n = sortedProcesses.length;
    const remainingTime = new Array(n).fill(0);
    const startTime = new Array(n).fill(-1);
    const finishTime = new Array(n).fill(-1);
    const currentQueue = new Array(n).fill(0);
    const timeUsedInQueue = new Array(n).fill(0);
  
    // Initialize remaining times
    for (let i = 0; i < n; i++) {
      remainingTime[i] = sortedProcesses[i].burstTime;
    }
  
    // Create an array of queues: each queue is an array of indices (referring to sortedProcesses)
    const queues = [];
    for (let i = 0; i < numberOfQueues; i++) {
      queues.push([]);
    }
  
    // We'll simulate time from 0 upwards
    let t = 0;
    let finishedCount = 0;
    let nextArrivalIndex = 0; // which process in sortedProcesses is next to arrive
  
    // Helper function: find the highest-priority (lowest index) non-empty queue
    function getHighestNonEmptyQueue() {
      for (let i = 0; i < numberOfQueues; i++) {
        if (queues[i].length > 0) return i;
      }
      return -1; // indicates all queues are empty
    }
  
    while (finishedCount < n) {
      // 1) Add newly arrived processes at time t to the highest queue (queue[0])
      while (
        nextArrivalIndex < n &&
        sortedProcesses[nextArrivalIndex].arrivalTime === t
      ) {
        queues[0].push(nextArrivalIndex);
        nextArrivalIndex++;
      }
  
      // 2) Check for the highest non-empty queue
      const qIndex = getHighestNonEmptyQueue();
      if (qIndex === -1) {
        // No processes are ready, just move time forward
        t++;
        continue;
      }
  
      // 3) Get the first process in this queue
      const procIndex = queues[qIndex][0];
      const proc = sortedProcesses[procIndex];
  
      // If this is the first time the process runs, record the startTime
      if (startTime[procIndex] === -1) {
        startTime[procIndex] = t;
      }
  
      // Run this process for 1 time unit
      remainingTime[procIndex] -= 1;
      timeUsedInQueue[procIndex] += 1;
  
      // After 1 time unit
      t++;
  
      // Again, add newly arrived processes at time t
      while (
        nextArrivalIndex < n &&
        sortedProcesses[nextArrivalIndex].arrivalTime === t
      ) {
        queues[0].push(nextArrivalIndex);
        nextArrivalIndex++;
      }
  
      // If the process has finished
      if (remainingTime[procIndex] === 0) {
        finishTime[procIndex] = t; // it completes at time t
        queues[qIndex].shift();    // remove it from the queue
        finishedCount++;
        timeUsedInQueue[procIndex] = 0; // reset usage (not strictly necessary)
      } else {
        // If the process has not finished, check if it used up its entire time quantum in this queue
        if (timeUsedInQueue[procIndex] === timeQuanta[qIndex]) {
          // It used up its time quantum; demote it to the next queue (if possible)
          queues[qIndex].shift(); // remove from current queue
          if (qIndex < numberOfQueues - 1) {
            // Move to the next lower-priority queue
            currentQueue[procIndex] = qIndex + 1;
            queues[qIndex + 1].push(procIndex);
          } else {
            // Already at the lowest queue; just re-append it
            queues[qIndex].push(procIndex);
          }
          // Reset the usage in the new queue
          timeUsedInQueue[procIndex] = 0;
        } else {
          // Not finished, but still has time left in this queue's quantum
          // Move it to the back of the same queue
          queues[qIndex].shift();
          queues[qIndex].push(procIndex);
        }
      }
    }
  
    // Build the schedule result
    const schedule = [];
    for (let i = 0; i < n; i++) {
      schedule.push({
        pid: sortedProcesses[i].id,
        startTime: startTime[i],
        finishTime: finishTime[i],
      });
    }
  
    return schedule;
  }
  