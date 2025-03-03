import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CardActionArea,
  Chip,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';

// Style-specific icons
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import LyricsIcon from '@mui/icons-material/Lyrics';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AbcIcon from '@mui/icons-material/Abc';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import MicIcon from '@mui/icons-material/Mic';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const getStyleIcon = (styleId) => {
  switch (styleId) {
    case 'sonnet':
      return <MenuBookIcon />;
    case 'haiku':
      return <LyricsIcon />;
    case 'freeVerse':
      return <FormatQuoteIcon />;
    case 'limerick':
      return <EmojiEmotionsIcon />;
    case 'ballad':
      return <MusicNoteIcon />;
    case 'acrostic':
      return <AbcIcon />;
    case 'villanelle':
      return <AutoAwesomeIcon />;
    case 'ode':
      return <LocalLibraryIcon />;
    case 'slam':
      return <MicIcon />;
    case 'epic':
      return <AutoStoriesIcon />;
    default:
      return <FormatQuoteIcon />;
  }
};

const getGradientColors = (styleId) => {
  const colors = {
    'sonnet': ['#4CAF50', '#8BC34A'],
    'haiku': ['#26A69A', '#80CBC4'],
    'freeVerse': ['#9C27B0', '#BA68C8'],
    'limerick': ['#FF9800', '#FFCC80'],
    'ballad': ['#2196F3', '#90CAF9'],
    'acrostic': ['#F44336', '#EF9A9A'],
    'villanelle': ['#673AB7', '#B39DDB'],
    'ode': ['#009688', '#80CBC4'],
    'slam': ['#E91E63', '#F48FB1'],
    'epic': ['#3F51B5', '#7986CB']
  };
  
  return colors[styleId] || ['#607D8B', '#B0BEC5'];
};

const StyleCard = ({ style, selected, onClick }) => {
  const theme = useTheme();
  const gradientColors = getGradientColors(style.id);
  
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        elevation={selected ? 4 : 1}
        sx={{ 
          height: '100%',
          border: selected ? `2px solid ${theme.palette.primary.main}` : 'none',
          borderRadius: 2,
          transition: 'all 0.3s ease'
        }}
      >
        <CardActionArea 
          onClick={() => onClick(style.id)}
          sx={{ height: '100%' }}
        >
          <Box 
            sx={{ 
              height: 80, 
              background: `linear-gradient(45deg, ${gradientColors[0]} 30%, ${gradientColors[1]} 90%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            {getStyleIcon(style.id)}
          </Box>
          <CardContent>
            <Typography 
              variant="h6" 
              component="h3" 
              gutterBottom
              sx={{ fontWeight: 500 }}
            >
              {style.name}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ mb: 2, minHeight: 40 }}
            >
              {style.description}
            </Typography>
            <Chip 
              size="small" 
              label="Select Style" 
              color={selected ? "primary" : "default"}
              variant={selected ? "filled" : "outlined"}
            />
          </CardContent>
        </CardActionArea>
      </Card>
    </motion.div>
  );
};

export default StyleCard;