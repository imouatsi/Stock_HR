import React from 'react';
import { Card, Box, Typography, IconButton, Tooltip } from '@mui/material';
import { MoreVert, Fullscreen } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveLine } from '@nivo/line';

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
          <ResponsiveLine
            data={data}
            margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', stacked: false }}
            curve="natural"
            axisTop={null}
            axisRight={null}
            enablePoints
            pointSize={8}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            enableSlices="x"
            crosshairType="cross"
            motionConfig="stiff"
            theme={{
              crosshair: {
                line: {
                  strokeWidth: 1,
                  stroke: 'rgba(0, 0, 0, 0.2)',
                  strokeDasharray: '4 4',
                },
              },
            }}
          />
        </Box>
      </Card>
    </motion.div>
  );
};
