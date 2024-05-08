import React from 'react';
import { PieChart } from '@mui/x-charts';

const StatisticView = ({ complaints, setCurrentTab }) => {

  // Extracting counts of pending, ongoing, and solved complaints
  const pendingCount = complaints.pending.length;
  const ongoingCount = complaints.ongoing.length;
  const solvedCount = complaints.solved.length;

  // Data for the pie chart
  const data = [
    { id: 0, value: pendingCount, label: 'Pending' },
    { id: 1, value: ongoingCount, label: 'Ongoing' },
    { id: 2, value: solvedCount, label: 'Solved' },
  ];

  const handleSegmentClick = (segment) => {
    console.log('segment : ', segment);
    switch (segment.label) {
      case 'Pending':
        setCurrentTab('pending');
        break;
      case 'Ongoing':
        setCurrentTab('ongoing');
        break;
      case 'Solved':
        setCurrentTab('solved');
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Complaint Status Overview</h2>
      <div style={{ width: '300px', margin: '0 auto' }}>
        <PieChart
          series={[
            {
              data,
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            },
          ]}
          height={200}
          onClick={(event, segment) => handleSegmentClick(segment)}
        />
      </div>
    </div>
  );
};

export default StatisticView;
