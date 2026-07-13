// src/constants/theme.ts

export const DARK_THEME = {
  background: '#0d0d0d',
  surface: '#1a1a1a',
  border: '#262626',
  textPrimary: '#ffffff',
  textSecondary: '#888888',
  brandAccent: '#8ce629',
  expenseAccent: '#ff4444',
};
export const theme = {
  background: '#F8F9FA',      // Soft light grey canvas
  surface: '#FFFFFF',         // Crisp pure white cards
  border: '#EAEAEA',          // Light grey structural divider lines
  textPrimary: '#1A1A1A',     // Dark high-contrast charcoal for titles/amounts
  textSecondary: '#666666',   // Medium grey for secondary content
  textMuted: '#999999',       // Soft muted light grey for un-emphasized dates
  brandAccent: '#47A300',     // Deepened rich green for visibility on white canvas
  expenseAccent: '#D32F2F',   // Vibrant readable red for cash outflows
  progressTrack: '#E0E0E0',   // Backing color for progress meter track
};

export const LIGHT_THEME = {
  background: '#F8F9FA',      // Soft off-white canvas
  surface: '#FFFFFF',         // Pure white for cards, rows, and boxes
  border: '#EAEAEA',          // Light grey crisp dividing borders
  inputBorder: '#DCDCDC',     // Slightly darker border for form inputs
  
  // Text Hierarchy
  textPrimary: '#1A1A1A',    // High-contrast charcoal/black for titles
  textSecondary: '#666666',  // Medium grey for subtitles and descriptions
  textMuted: '#999999',      // Light grey for placeholders
  
  // Accents & Brand Colors
  brandGreen: '#47A300',     // Vibrant green for primary CTA buttons/success metrics
  accentRed: '#D32F2F',      // Crimson for expenses / logout / delete
  accentBlue: '#0066CC',     // Classic deep blue for incomes
};