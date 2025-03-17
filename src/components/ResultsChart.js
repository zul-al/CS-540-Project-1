// ResultsChart.js
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ResultsChart = ({ schedule, title }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    if (chartRef.current.chart) {
      chartRef.current.chart.destroy();
    }
    chartRef.current.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: schedule.map((item) => `P${item.pid}`),
        datasets: [
          {
            label: 'Execution Time',
            data: schedule.map((item) => item.finishTime - item.startTime),
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: title,
          },
        },
      },
    });
  }, [schedule, title]);

  return <canvas ref={chartRef} />;
};

export default ResultsChart;
