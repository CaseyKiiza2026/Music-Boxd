/**
 * Music-Boxd - Main Entry Point
 * Vite will process this file and generate the bundle
 */

// Import styles
import '../styles/shared.css';
import '../styles/index.css';
import '../styles/album.css';
import '../styles/profile.css';
import '../styles/login.css';

// Import page-specific modules
import './index.js';
import './album.js';
import './profile.js';

// Initialize modules - they will run automatically when the file is executed
// The modules check if they're on the correct page before initializing
console.log('Music-Boxd Vite build loaded');
