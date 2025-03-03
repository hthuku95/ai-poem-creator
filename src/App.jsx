import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  Chip,
  useMediaQuery,
  Paper
} from '@mui/material';
import { motion } from 'framer-motion';

// Import components
import Header from './components/Header';
import PoemForm from './components/PoemForm';
import PoemDisplay from './components/PoemDisplay';
import StyleCard from './components/StyleCard';

// Import services
import { generatePoem, getPoetryStyles } from './services/poemService';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(localStorage.getItem('theme-mode') || (prefersDarkMode ? 'dark' : 'light'));
  
  // Poem states
  const [poemData, setPoemData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastPoemOptions, setLastPoemOptions] = useState(null);
  
  // UI states
  const [showStyles, setShowStyles] = useState(true);
  const [selectedStyle, setSelectedStyle] = useState(null);
  
  // Error handling
  const [error, setError] = useState({
    show: false,
    message: ''
  });

  // Get poetry styles
  const poetryStyles = getPoetryStyles();

  // Create theme based on mode preference
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? '#9c27b0' : '#6a1b9a',
      },
      secondary: {
        main: mode === 'dark' ? '#f48fb1' : '#e91e63',
      },
      background: {
        default: mode === 'dark' ? '#121212' : '#f5f7fa',
        paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Playfair Display", "Georgia", serif',
      body1: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      },
      body2: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      },
      button: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      }
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
    },
  });
  
  // Toggle theme mode
  const toggleTheme = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    localStorage.setItem('theme-mode', newMode);
  };

  // Handle form submission to generate poem
  const handleGeneratePoem = async (formData) => {
    setIsGenerating(true);
    setError({ show: false, message: '' });
    setLastPoemOptions(formData);
    
    try {
      const generatedPoem = await generatePoem(formData);
      setPoemData(generatedPoem);
      setShowStyles(false);
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('poem-result')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 500);
    } catch (error) {
      console.error('Generation error:', error);
      setError({
        show: true,
        message: error.message || 'Failed to generate poem. Please try again.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle regenerating poem
  const handleRegeneratePoem = () => {
    if (lastPoemOptions) {
      handleGeneratePoem(lastPoemOptions);
    }
  };

  // Handle style selection
  const handleStyleSelect = (styleId) => {
    setSelectedStyle(styleId);
    
    // Scroll to form
    window.scrollTo({
      top: document.getElementById('poem-form')?.offsetTop - 100,
      behavior: 'smooth'
    });
  };

  // Handle error dismissal
  const handleCloseError = () => {
    setError({ ...error, show: false });
  };

  // Load fonts
  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Roboto:wght@300;400;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundImage: mode === 'dark' 
          ? 'radial-gradient(circle at 10% 20%, rgba(30, 30, 60, 0.8) 0%, rgba(40, 30, 60, 0.5) 90.2%)'
          : 'radial-gradient(circle at 10% 20%, rgba(240, 240, 255, 0.8) 0%, rgba(230, 230, 250, 0.5) 90.2%)',
        backgroundAttachment: 'fixed',
      }}>
        <Header toggleTheme={toggleTheme} mode={mode} />
        
        <Container maxWidth="lg" sx={{ flex: 1, py: 4, display: 'flex', flexDirection: 'column' }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box textAlign="center" mb={4}>
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom 
                sx={{ fontWeight: 700, fontFamily: '"Playfair Display", serif' }}
              >
                <span style={{ fontStyle: 'italic' }}>AI Poem</span> Creator
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
                Generate beautiful, custom poetry in various styles with the help of AI
              </Typography>
            </Box>
          </motion.div>
          
          <Box id="poem-form">
            <PoemForm 
              onSubmit={handleGeneratePoem}
              isGenerating={isGenerating}
              initialStyle={selectedStyle}
            />
          </Box>
          
          {showStyles && (
            <Box sx={{ mt: 6, mb: 4 }}>
              <Typography 
                variant="h5" 
                component="h2" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700, 
                  textAlign: 'center',
                  fontFamily: '"Playfair Display", serif'
                }}
              >
                Explore Poetry Styles
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                gutterBottom 
                textAlign="center" 
                sx={{ mb: 4 }}
              >
                Choose a style for your AI-generated poem
              </Typography>
              
              <Grid container spacing={3}>
                {poetryStyles.map(style => (
                  <Grid item xs={12} sm={6} md={3} key={style.id}>
                    <StyleCard 
                      style={style}
                      selected={selectedStyle === style.id}
                      onClick={handleStyleSelect}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          
          <Box id="poem-result">
            {isGenerating ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 8 }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ ml: 2 }}>
                  Crafting your poem...
                </Typography>
              </Box>
            ) : (
              <PoemDisplay 
                poemData={poemData}
                onRegenerate={handleRegeneratePoem}
              />
            )}
          </Box>
          
          {poemData && (
            <Box sx={{ my: 4, textAlign: 'center' }}>
              <Divider sx={{ mb: 4 }}>
                <Chip label="About Poetry" />
              </Divider>
              
              <Paper elevation={1} sx={{ p: 3, borderRadius: 2, maxWidth: 800, mx: 'auto' }}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ fontFamily: '"Playfair Display", serif' }}>
                  The Power of Poetry
                </Typography>
                <Typography variant="body2" paragraph>
                  Poetry allows us to express emotions, thoughts, and experiences in ways that ordinary language cannot. Through imagery, rhythm, and metaphor, poems can capture the essence of human experience.
                </Typography>
                <Typography variant="body2" paragraph>
                  Whether you're looking for inspiration, wanting to express complex feelings, or simply appreciating the beauty of language, poetry offers a unique medium of expression that has endured throughout human history.
                </Typography>
                <Typography variant="body2">
                  Save and share your AI-generated poems, or use them as a starting point for your own creative exploration!
                </Typography>
              </Paper>
            </Box>
          )}
        </Container>
        
        <Box 
          component="footer" 
          sx={{ 
            py: 3, 
            textAlign: 'center',
            backgroundColor: theme.palette.background.paper + '20', // very transparent
            backdropFilter: 'blur(5px)',
            borderTop: `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} AI Poem Creator | Powered by Google Gemini AI
          </Typography>
        </Box>
      </Box>
      
      <Snackbar
        open={error.show}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;