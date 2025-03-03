import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Autocomplete,
  Divider,
  Collapse,
  IconButton,
  useTheme,
  useMediaQuery,
  InputAdornment
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { motion } from 'framer-motion';
import { getPoetryStyles, getPoemTones, getPoemThemes, getLiteraryElements } from '../services/poemService';

const POEM_LENGTHS = [
  { value: 'short', label: 'Short (5-10 lines)' },
  { value: 'medium', label: 'Medium (10-15 lines)' },
  { value: 'long', label: 'Long (15-25 lines)' }
];

const PoemForm = ({ onSubmit, isGenerating, initialStyle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const poetryStyles = getPoetryStyles();
  const poemTones = getPoemTones();
  const poemThemes = getPoemThemes();
  const literaryElements = getLiteraryElements();
  
  const [formData, setFormData] = useState({
    theme: '',
    customTheme: '',
    style: initialStyle || 'freeVerse',
    tone: 'reflective',
    length: 'medium',
    elements: [],
    additionalInstructions: ''
  });
  
  // Update style when initialStyle prop changes
  useEffect(() => {
    if (initialStyle) {
      setFormData(prev => ({
        ...prev,
        style: initialStyle
      }));
    }
  }, [initialStyle]);
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customThemeSelected, setCustomThemeSelected] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleThemeChange = (e) => {
    const value = e.target.value;
    if (value === 'custom') {
      setCustomThemeSelected(true);
      setFormData(prev => ({
        ...prev,
        theme: 'custom'
      }));
    } else {
      setCustomThemeSelected(false);
      setFormData(prev => ({
        ...prev,
        theme: value,
        customTheme: ''
      }));
    }
  };
  
  const handleElementsChange = (event, newValues) => {
    setFormData(prev => ({
      ...prev,
      elements: newValues
    }));
  };
  
  const toggleAdvancedOptions = () => {
    setShowAdvanced(!showAdvanced);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare the final theme value
    const finalTheme = formData.theme === 'custom' 
      ? formData.customTheme 
      : formData.theme;
    
    // Prepare form data for submission
    const submissionData = {
      ...formData,
      theme: finalTheme,
      elements: formData.elements.map(element => element.name)
    };
    
    onSubmit(submissionData);
  };
  
  const getSelectedThemeIcon = () => {
    if (customThemeSelected) return '✏️';
    const theme = poemThemes.find(t => t.id === formData.theme);
    return theme ? theme.icon : '🖋️';
  };
  
  const getSelectedStyle = () => {
    return poetryStyles.find(s => s.id === formData.style);
  };
  
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        mb: 4,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        maxWidth: '800px',
        mx: 'auto'
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom color="primary" fontWeight="medium">
          Create Your Poem
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Customize your poem's theme, style, and tone to create something unique
        </Typography>
      </Box>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="theme-label">Theme</InputLabel>
              <Select
                labelId="theme-label"
                id="theme"
                name="theme"
                value={formData.theme}
                onChange={handleThemeChange}
                label="Theme"
              >
                <MenuItem value="">
                  <em>Select a theme</em>
                </MenuItem>
                {poemThemes.map((theme) => (
                  <MenuItem key={theme.id} value={theme.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '8px' }}>{theme.icon}</span>
                      {theme.name}
                    </Box>
                  </MenuItem>
                ))}
                <MenuItem value="custom">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '8px' }}>✏️</span>
                    Custom Theme
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
            
            {customThemeSelected && (
              <TextField
                fullWidth
                label="Your Custom Theme"
                name="customTheme"
                value={formData.customTheme}
                onChange={handleChange}
                placeholder="e.g., Urban life in the future"
                variant="outlined"
                sx={{ mb: 3 }}
              />
            )}
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="style-label">Poetry Style</InputLabel>
              <Select
                labelId="style-label"
                id="style"
                name="style"
                value={formData.style}
                onChange={handleChange}
                label="Poetry Style"
              >
                {poetryStyles.map((style) => (
                  <MenuItem key={style.id} value={style.id}>
                    {style.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {getSelectedStyle() && (
              <Box sx={{ mb: 3, p: 2, backgroundColor: theme.palette.action.hover, borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>{getSelectedStyle().name}:</strong> {getSelectedStyle().description}
                </Typography>
                {getSelectedStyle().example && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                    "{getSelectedStyle().example.substring(0, 60)}..."
                  </Typography>
                )}
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="tone-label">Emotional Tone</InputLabel>
              <Select
                labelId="tone-label"
                id="tone"
                name="tone"
                value={formData.tone}
                onChange={handleChange}
                label="Emotional Tone"
              >
                {poemTones.map((tone) => (
                  <MenuItem key={tone.id} value={tone.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '8px' }}>{tone.emoji}</span>
                      {tone.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="length-label">Poem Length</InputLabel>
              <Select
                labelId="length-label"
                id="length"
                name="length"
                value={formData.length}
                onChange={handleChange}
                label="Poem Length"
              >
                {POEM_LENGTHS.map((length) => (
                  <MenuItem key={length.value} value={length.value}>
                    {length.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Button
                onClick={toggleAdvancedOptions}
                endIcon={showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                sx={{ mb: 2 }}
                type="button"
              >
                {showAdvanced ? "Hide" : "Show"} Advanced Options
              </Button>
            </Box>
          </Grid>
        </Grid>
        
        <Collapse in={showAdvanced}>
          <Box sx={{ mt: 1, mb: 3 }}>
            <Divider>
              <Chip label="Advanced Options" size="small" />
            </Divider>
            
            <Box sx={{ mt: 3 }}>
              <Autocomplete
                multiple
                id="elements"
                options={literaryElements}
                value={formData.elements}
                onChange={handleElementsChange}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Literary Devices to Include"
                    placeholder="Select elements"
                    helperText="Optional: Choose specific literary devices to include in your poem"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option.name}
                      {...getTagProps({ index })}
                      key={index}
                      size="small"
                    />
                  ))
                }
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box>
                      <Typography variant="body2">{option.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.description}
                      </Typography>
                    </Box>
                  </li>
                )}
              />
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <TextField
                fullWidth
                label="Additional Instructions"
                name="additionalInstructions"
                value={formData.additionalInstructions}
                onChange={handleChange}
                placeholder="e.g., Include references to the ocean, mention a journey, use the color blue"
                variant="outlined"
                multiline
                rows={2}
                helperText="Optional: Add any specific elements or instructions for your poem"
              />
            </Box>
          </Box>
        </Collapse>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={isGenerating || (!formData.theme && !formData.customTheme)}
            startIcon={isGenerating ? null : <AutoAwesomeIcon />}
            sx={{ px: 4, py: 1 }}
          >
            {isGenerating ? 'Creating Poem...' : 'Create Poem'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default PoemForm;