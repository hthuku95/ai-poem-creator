import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Divider,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import ImageIcon from '@mui/icons-material/Image';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import RefreshIcon from '@mui/icons-material/Refresh';
import { motion } from 'framer-motion';
import { saveAs } from 'file-saver';
import * as htmlToImage from 'html-to-image';

const PoemDisplay = ({ poemData, onRegenerate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const poemRef = useRef(null);
  
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  if (!poemData) return null;
  
  const { title, poem, style, analysis, poet } = poemData;
  
  const formattedPoem = poem.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      <br />
    </React.Fragment>
  ));
  
  const handleCreateImage = async () => {
    try {
      if (!poemRef.current) return;
      
      const dataUrl = await htmlToImage.toPng(poemRef.current, {
        quality: 0.95,
        backgroundColor: theme.palette.background.paper,
        style: {
          borderRadius: '0',
          transform: 'scale(2)',
          transformOrigin: 'center',
          padding: '40px'
        }
      });
      
      setCurrentImage(dataUrl);
      setImageDialogOpen(true);
    } catch (error) {
      console.error('Error creating image:', error);
      setToast({
        open: true,
        message: 'Failed to create image. Please try again.',
        severity: 'error'
      });
    }
  };
  
  const handleSaveImage = () => {
    if (currentImage) {
      saveAs(currentImage, `${title.replace(/\s+/g, '-').toLowerCase()}-poem.png`);
      setImageDialogOpen(false);
    }
  };
  
  const handleCopyPoem = () => {
    const textToSave = `${title}\n\n${poem}\n\n— ${poet}`;
    navigator.clipboard.writeText(textToSave);
    
    setToast({
      open: true,
      message: 'Poem copied to clipboard!',
      severity: 'success'
    });
  };
  
  const handleDownloadPoem = () => {
    const textToSave = `${title}\n\n${poem}\n\n— ${poet}\n\n${showAnalysis ? `Analysis:\n${analysis}` : ''}`;
    const blob = new Blob([textToSave], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${title.replace(/\s+/g, '-').toLowerCase()}.txt`);
    
    setToast({
      open: true,
      message: 'Poem saved as text file!',
      severity: 'success'
    });
  };
  
  const handleSharePoem = () => {
    const textToShare = `${title}\n\n${poem}\n\n— ${poet}`;
    
    if (navigator.share) {
      navigator.share({
        title: title,
        text: textToShare
      })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.error('Error sharing:', error));
    } else {
      handleCopyPoem();
      setToast({
        open: true,
        message: 'Sharing not supported on this device. Poem copied instead!',
        severity: 'info'
      });
    }
  };
  
  const handleCloseToast = () => {
    setToast({
      ...toast,
      open: false
    });
  };
  
  const toggleAnalysis = () => {
    setShowAnalysis(!showAnalysis);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: '800px',
          mx: 'auto',
          mb: 4,
          overflow: 'hidden',
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <Box
          sx={{
            p: 2,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="subtitle1" fontWeight="medium">
            Your Custom Poem
          </Typography>
          
          <Box>
            <Button
              startIcon={<RefreshIcon />}
              onClick={onRegenerate}
              size="small"
              variant="contained"
              color="secondary"
              sx={{ color: '#fff' }}
            >
              New Poem
            </Button>
          </Box>
        </Box>
        
        <Box
          ref={poemRef}
          sx={{
            p: 4,
            backgroundColor: theme.palette.background.paper,
            position: 'relative'
          }}
        >
          <Box sx={{ position: 'absolute', top: 20, left: 20, opacity: 0.2 }}>
            <FormatQuoteIcon fontSize="large" />
          </Box>
          
          <Typography
            variant="h5"
            component="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 500, mb: 3 }}
          >
            {title}
          </Typography>
          
          <Typography
            variant="body1"
            align="center"
            sx={{
              whiteSpace: 'pre-line',
              lineHeight: 1.8,
              fontStyle: 'italic',
              my: 3
            }}
          >
            {formattedPoem}
          </Typography>
          
          <Typography
            variant="subtitle1"
            align="right"
            sx={{ mt: 3, fontWeight: 500 }}
          >
            — {poet}
          </Typography>
          
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 3
            }}
          >
            <Chip
              label={style || 'Poem'}
              color="secondary"
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>
        
        <Divider />
        
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: theme.palette.background.default
          }}
        >
          <Box>
            <Tooltip title="Copy poem">
              <IconButton onClick={handleCopyPoem} size="small">
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Download as text">
              <IconButton onClick={handleDownloadPoem} size="small">
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Create image">
              <IconButton onClick={handleCreateImage} size="small">
                <ImageIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Share poem">
              <IconButton onClick={handleSharePoem} size="small">
                <ShareIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          
          <Tooltip title="Show poem analysis">
            <Button
              startIcon={<AnalyticsIcon />}
              onClick={toggleAnalysis}
              size="small"
              color={showAnalysis ? "primary" : "inherit"}
            >
              Analysis
            </Button>
          </Tooltip>
        </Box>
        
        {showAnalysis && (
          <Box sx={{ p: 3, backgroundColor: theme.palette.action.hover }}>
            <Typography variant="subtitle2" gutterBottom color="primary">
              Poem Analysis
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {analysis}
            </Typography>
          </Box>
        )}
      </Paper>
      
      {/* Image Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="md"
      >
        <DialogTitle>Save Your Poem as an Image</DialogTitle>
        <DialogContent>
          {currentImage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <img
                src={currentImage}
                alt="Poem"
                style={{
                  maxWidth: '100%',
                  maxHeight: '60vh',
                  boxShadow: theme.shadows[3]
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSaveImage}
            variant="contained"
            color="primary"
          >
            Download Image
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Toast notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default PoemDisplay;