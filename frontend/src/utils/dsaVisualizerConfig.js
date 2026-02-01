/**
 * DSA Visualizer Configuration
 * 
 * Centralized configuration for the external DSA Visualizer integration.
 * This module provides a clean, scalable way to manage the DSA Visualizer link
 * and future enhancements like JWT token passing for secure access.
 */

// Base URL of the deployed DSA Visualizer
export const DSA_VISUALIZER_URL = 'https://dsa38.netlify.app/';

/**
 * Opens the DSA Visualizer in a new tab
 * 
 * @param {Object} options - Optional configuration
 * @param {string} options.token - JWT token for future secure access (optional)
 * @param {string} options.userId - User ID for personalization (optional)
 * @param {string} options.path - Specific path within the visualizer (optional)
 * 
 * @example
 * // Basic usage
 * openDSAVisualizer();
 * 
 * @example
 * // Future usage with JWT token
 * openDSAVisualizer({ token: jwtToken, userId: user.id });
 */
export const openDSAVisualizer = (options = {}) => {
  const { token, userId, path = '' } = options;
  
  // Build URL with optional query parameters for future token passing
  let url = `${DSA_VISUALIZER_URL}${path}`;
  
  // Future enhancement: Append token and userId as query params
  // This will allow the DSA Visualizer to authenticate the user
  const params = new URLSearchParams();
  if (token) params.append('token', token);
  if (userId) params.append('userId', userId);
  
  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }
  
  // Open in new tab with security best practices
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  
  // Fallback if popup was blocked
  if (!newWindow) {
    console.warn('Popup blocked. Please allow popups for this site.');
    alert('Please allow popups to open DSA Visualizer');
  }
};

/**
 * Get the DSA Visualizer URL with optional parameters
 * 
 * @param {Object} options - Optional configuration
 * @returns {string} The complete URL
 */
export const getDSAVisualizerUrl = (options = {}) => {
  const { token, userId, path = '' } = options;
  let url = `${DSA_VISUALIZER_URL}${path}`;
  
  const params = new URLSearchParams();
  if (token) params.append('token', token);
  if (userId) params.append('userId', userId);
  
  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }
  
  return url;
};

export default {
  DSA_VISUALIZER_URL,
  openDSAVisualizer,
  getDSAVisualizerUrl
};
