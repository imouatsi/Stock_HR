import React from 'react';
import { Card, Box, Typography, IconButton, Tooltip } from '@mui/material';
import { MoreVert, Fullscreen } from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

interface ChartCardProps {
  title: string;
  data: Array<{
    id: string;
    data: Array<{ x: string | number; y: number }>;
  }>;
  height?: number;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, data, height = 300 }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const chartData = React.useMemo(() => {
    if (!data.length) return { labels: [], datasets: [] };

    // Get all unique x values
    const xValues = new Set<string | number>();
    data.forEach(series => {
      series.data.forEach(point => xValues.add(point.x));
    });
    const labels = Array.from(xValues);

    // Create datasets
    const datasets = data.map((series, index) => ({
      label: series.id,
      data: labels.map(x => {
        const point = series.data.find(p => p.x === x);
        return point ? point.y : null;
      }),
      borderColor: `hsl(${index * 45}, 70%, 50%)`,
      backgroundColor: `hsla(${index * 45}, 70%, 50%, 0.5)`,
      tension: 0.4,
    }));

    return {
      labels,
      datasets,
    };
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          p: 2,
          height: isExpanded ? '80vh' : height,
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h6" flex={1}>{title}</Typography>
          <Tooltip title="Expand">
            <IconButton onClick={() => setIsExpanded(!isExpanded)}>
              <Fullscreen />
            </IconButton>
          </Tooltip>
          <Tooltip title="More options">
            <IconButton>
              <MoreVert />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ height: 'calc(100% - 48px)' }}>
          <Line data={chartData} options={options} />
        </Box>
      </Card>
    </motion.div>
  );
};
