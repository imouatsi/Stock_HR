import React from 'react';
import {
  Box,
  Card,
  Typography,
  Tooltip,
  LinearProgress,
  Grid,
  Chip,
  IconButton,
} from '@mui/material';
import {
  School,
  TrendingUp,
  TrendingDown,
  ThumbUp,
} from '@mui/icons-material';
import { ResponsiveRadar } from '@nivo/radar';
import { motion } from 'framer-motion'; // Fix incorrect import
import { useAnimation } from 'framer-motion'; // Fix incorrect import
import { AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../../features/store';
import { UserProfile } from '../../types/user';

interface Skill {
  skill: string;
  level: number;
  growth: number;
}

interface SkillMatrix {
  technical: Skill[];
  soft: Skill[];
}

interface AnalyticsSettings {
  workspace?: {
    analytics?: {
      kpis?: {
        performance?: {
          skillMatrix?: any;
        };
      };
    };
  };
}

interface ExtendedUserProfile extends UserProfile {
  settings?: AnalyticsSettings;
}

export const SkillMatrix: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const skillMatrix = (user as ExtendedUserProfile)?.settings?.workspace?.analytics?.kpis?.performance?.skillMatrix;

  const radarData = skillMatrix?.technical.map((skill: Skill) => ({
    skill: skill.skill,
    level: skill.level,
    growth: skill.growth,
  })) || [];

  return (
    <Card sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <School color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6">Skill Matrix</Typography>
      </Box>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box height={300}>
            <ResponsiveRadar
              data={radarData}
              keys={['level']}
              indexBy="skill"
              maxValue={10}
              margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
              curve="linearClosed"
              borderWidth={2}
              borderColor={{ theme: 'grid.line.stroke' }}
              gridLevels={5}
              gridShape="circular"
              enableDots={true}
              dotSize={8}
              dotColor={{ theme: 'background' }}
              dotBorderWidth={2}
              theme={{
                background: 'transparent',
                text: {
                  fill: '#333333',
                },
              }}
            />
          </Box>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
};

export default SkillMatrix;
