import React, { useEffect, useState } from 'react';
import './TimelineAnimation.css';

const TimelineAnimation = ({ schedule }) => {
  // Determine the total simulation time (max finishTime)
  const totalTime = Math.max(...schedule.map(item => item.finishTime));

  // currentTime simulates the passage of time in the animation.
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    // Increase currentTime every second (adjust as needed)
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev < totalTime) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [totalTime]);

  return (
    <div className="timeline-container">
      {/* Render each process execution block */}
      {schedule.map(block => (
        <div
          key={block.pid}
          className="timeline-block"
          style={{
            left: `${(block.startTime / totalTime) * 100}%`,
            width: `${((block.finishTime - block.startTime) / totalTime) * 100}%`,
            backgroundColor: getColor(block.pid)
          }}
        >
          P{block.pid}
        </div>
      ))}
      {/* The marker for the current time */}
      <div
        className="current-time-marker"
        style={{ left: `${(currentTime / totalTime) * 100}%` }}
      />
      <div className="time-labels">
        <span>0</span>
        <span>{totalTime}</span>
      </div>
    </div>
  );
};

// A helper to pick a color for a given process id
function getColor(pid) {
  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
  return colors[(pid - 1) % colors.length];
}

export default TimelineAnimation;
