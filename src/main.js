/**
 * Music-Boxd - Main Entry Point
 * Vite will process this file and generate the bundle
 */

// Import page-specific modules
import './index.js';
import './album.js';
import './browse.js';
import './profile.js';

// Initialize modules - they will run automatically when the file is executed
// The modules check if they're on the correct page before initializing
console.log('Music-Boxd Vite build loaded');
