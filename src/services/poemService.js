import { GoogleGenerativeAI } from "@google/generative-ai";

// Get API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Generates a poem based on user inputs
 * @param {Object} poemOptions - User-selected poem options
 * @param {string} poemOptions.theme - Main theme or topic for the poem
 * @param {string} poemOptions.style - Poetic style or form
 * @param {string} poemOptions.tone - Emotional tone of the poem
 * @param {string} poemOptions.length - Length of the poem
 * @param {Array<string>} poemOptions.elements - Specific elements to include
 * @param {string} poemOptions.additionalInstructions - Any other specific instructions
 * @returns {Promise<Object>} - The generated poem and metadata
 */
export const generatePoem = async (poemOptions) => {
  try {
    // Use the Gemini model
    const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Create a comprehensive prompt for poem generation
    const prompt = `
      As an expert poet, create a beautiful, original poem with the following specifications:
      
      THEME: ${poemOptions.theme || "nature"}
      
      STYLE: ${poemOptions.style || "free verse"}
      
      TONE: ${poemOptions.tone || "reflective"}
      
      LENGTH: ${poemOptions.length || "medium (10-15 lines)"}
      
      ${poemOptions.elements && poemOptions.elements.length > 0 
        ? `ELEMENTS TO INCLUDE: ${poemOptions.elements.join(", ")}` 
        : ""}
      
      ${poemOptions.additionalInstructions 
        ? `ADDITIONAL INSTRUCTIONS: ${poemOptions.additionalInstructions}` 
        : ""}
      
      Please follow these guidelines:
      1. Create an original poem that hasn't been published before
      2. Use rich, vivid imagery and appropriate literary devices
      3. Make sure the poem follows the conventions of the requested style
      4. Ensure the poem evokes the specified emotional tone
      5. Create a meaningful title that complements the poem
      
      Format your response as a JSON object with the following structure:
      {
        "title": "The title of the poem",
        "poem": "The full text of the poem with proper line breaks",
        "style": "The style of poetry used",
        "analysis": "A brief analysis of the poem's themes, imagery, and literary devices (100-150 words)",
        "poet": "A fictional poet's name who could have written this poem"
      }
    `;
    
    // Generate the poem
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();
    
    // Parse the JSON response
    try {
      const poemData = JSON.parse(generatedText);
      return poemData;
    } catch (parseError) {
      console.error("Error parsing poem JSON:", parseError);
      
      // Fallback: try to extract poem from text
      const extractedPoemData = extractPoemFromText(generatedText);
      if (extractedPoemData) {
        return extractedPoemData;
      }
      
      throw new Error("Failed to parse the generated poem.");
    }
  } catch (error) {
    console.error("Error generating poem:", error);
    throw new Error("Failed to generate poem. Please try again.");
  }
};

/**
 * Extract poem data from text if JSON parsing fails
 * @param {string} text - The raw text response
 * @returns {Object|null} - Extracted poem data or null if extraction fails
 */
const extractPoemFromText = (text) => {
  try {
    // Try to find text between curly braces
    const jsonMatch = text.match(/{[\s\S]*}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // If no JSON-like structure, try to extract title and poem
    const titleMatch = text.match(/title["']?\s*:\s*["']([^"']+)["']/i);
    const poemMatch = text.match(/poem["']?\s*:\s*["']([^"']+)["']/i);
    
    if (titleMatch && poemMatch) {
      return {
        title: titleMatch[1],
        poem: poemMatch[1].replace(/\\n/g, '\n'),
        style: "Unknown",
        analysis: "Analysis not available",
        poet: "Anonymous"
      };
    }
    
    // Last resort: treat whole text as poem
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length > 0) {
      const title = lines[0];
      const poem = lines.slice(1).join('\n');
      
      return {
        title: title,
        poem: poem,
        style: "Unknown",
        analysis: "Analysis not available",
        poet: "Anonymous"
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error extracting poem from text:", error);
    return null;
  }
};

/**
 * Get poetry styles with descriptions
 * @returns {Array<Object>} Array of poetry style objects
 */
export const getPoetryStyles = () => {
  return [
    {
      id: 'sonnet',
      name: 'Sonnet',
      description: 'A 14-line poem with a specific rhyme scheme, often exploring themes of love.',
      example: 'Shall I compare thee to a summers day Thou art more lovely and more temperate...'
    },
    {
      id: 'haiku',
      name: 'Haiku',
      description: 'A traditional Japanese form with three lines of 5, 7, and 5 syllables.',
      example: 'An old silent pond... / A frog jumps into the pond, / splash! Silence again.'
    },
    {
      id: 'freeVerse',
      name: 'Free Verse',
      description: 'Poetry without regular patterns of rhythm or rhyme.',
      example: 'The apparition of these faces in the crowd; / Petals on a wet, black bough.'
    },
    {
      id: 'limerick',
      name: 'Limerick',
      description: 'A humorous five-line poem with an AABBA rhyme scheme.',
      example: 'There was an Old Man with a beard, / Who said, "It is just as I feared!"...'
    },
    {
      id: 'ballad',
      name: 'Ballad',
      description: 'A narrative poem that tells a story, often with a repeated refrain.',
      example: 'The wind was a torrent of darkness among the gusty trees / The moon was a ghostly galleon tossed upon cloudy seas...'
    },
    {
      id: 'acrostic',
      name: 'Acrostic',
      description: 'A poem where the first letter of each line spells out a word or message.',
      example: 'Patience and virtue are / Embedded in the soul that / Aspires to achieve greatness...'
    },
    {
      id: 'villanelle',
      name: 'Villanelle',
      description: 'A 19-line poem with two repeating rhymes and two repeating lines.',
      example: 'Do not go gentle into that good night, / Old age should burn and rave at close of day; / Rage, rage against the dying of the light.'
    },
    {
      id: 'ode',
      name: 'Ode',
      description: 'A lyrical poem that praises or celebrates a person, event, or object.',
      example: 'Thou still unravished bride of quietness, Thou foster-child of silence and slow time...'
    },
    {
      id: 'slam',
      name: 'Slam Poetry',
      description: 'Performed poetry that focuses on word play, voice inflection, and storytelling.',
      example: 'This is for the people who tell their / kids they can be anything they want to be / except for gay...'
    },
    {
      id: 'epic',
      name: 'Epic Poetry',
      description: 'A lengthy narrative poem celebrating the adventures and accomplishments of a hero.',
      example: 'Arms, and the man I sing, who, forced by fate, / And haughty Junos unrelenting hate...'
    }
  ];
};

/**
 * Get poem tones with descriptions
 * @returns {Array<Object>} Array of tone objects
 */
export const getPoemTones = () => {
  return [
    { id: 'romantic', name: 'Romantic', emoji: '❤️' },
    { id: 'melancholic', name: 'Melancholic', emoji: '😢' },
    { id: 'joyful', name: 'Joyful', emoji: '😄' },
    { id: 'reflective', name: 'Reflective', emoji: '🤔' },
    { id: 'mysterious', name: 'Mysterious', emoji: '🔮' },
    { id: 'nostalgic', name: 'Nostalgic', emoji: '🕰️' },
    { id: 'humorous', name: 'Humorous', emoji: '😂' },
    { id: 'inspirational', name: 'Inspirational', emoji: '✨' },
    { id: 'dark', name: 'Dark', emoji: '🌑' },
    { id: 'serene', name: 'Serene', emoji: '🧘' }
  ];
};

/**
 * Get popular poem themes with descriptions
 * @returns {Array<Object>} Array of theme objects
 */
export const getPoemThemes = () => {
  return [
    { id: 'nature', name: 'Nature & Environment', icon: '🌿' },
    { id: 'love', name: 'Love & Relationships', icon: '❤️' },
    { id: 'time', name: 'Time & Memory', icon: '⏳' },
    { id: 'identity', name: 'Identity & Self-discovery', icon: '🔍' },
    { id: 'grief', name: 'Loss & Grief', icon: '💔' },
    { id: 'hope', name: 'Hope & Resilience', icon: '🌱' },
    { id: 'society', name: 'Society & Justice', icon: '⚖️' },
    { id: 'mythology', name: 'Mythology & Folklore', icon: '🐉' },
    { id: 'spirituality', name: 'Spirituality & Faith', icon: '✨' },
    { id: 'dreams', name: 'Dreams & Imagination', icon: '💭' },
    { id: 'adventure', name: 'Journey & Adventure', icon: '🚀' },
    { id: 'seasons', name: 'Seasons & Weather', icon: '🍂' }
  ];
};

/**
 * Get literary elements that can be included in poems
 * @returns {Array<Object>} Array of literary element objects
 */
export const getLiteraryElements = () => {
  return [
    { id: 'metaphor', name: 'Metaphor', description: 'Comparison between two unlike things' },
    { id: 'simile', name: 'Simile', description: 'Comparison using "like" or "as"' },
    { id: 'alliteration', name: 'Alliteration', description: 'Repetition of consonant sounds' },
    { id: 'personification', name: 'Personification', description: 'Giving human qualities to non-human things' },
    { id: 'imagery', name: 'Vivid Imagery', description: 'Language that appeals to the senses' },
    { id: 'symbolism', name: 'Symbolism', description: 'Use of symbols to represent ideas' },
    { id: 'rhyme', name: 'Rhyme', description: 'Matching sounds at the end of lines' },
    { id: 'repetition', name: 'Repetition', description: 'Repeating words or phrases for effect' },
    { id: 'onomatopoeia', name: 'Onomatopoeia', description: 'Words that sound like what they describe' },
    { id: 'assonance', name: 'Assonance', description: 'Repetition of vowel sounds' }
  ];
};