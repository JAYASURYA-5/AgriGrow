# Conversion Plan: HTML to JSX Components

## Overview
Convert all HTML files to proper JSX components with correct working styles, maintaining functionality and interactivity.

## Files to Convert
- [x] upload.html → Upload.jsx
- [x] userprofile.html → UserProfile.jsx
- [x] scheme.html → Scheme.jsx
- [x] news.html → News.jsx
- [x] weather.html → Weather.jsx
- [x] chatbot.html → Chatbot.jsx
- [x] community.html → Community.jsx
- [x] desease.html → Desease.jsx
- [x] market.html → Market.jsx
- [x] analysis.html → Analysis.jsx

## Conversion Steps for Each File
1. Read HTML content
2. Transform HTML to JSX syntax (class → className, etc.)
3. Extract inline scripts to React hooks and state
4. Convert event handlers to React event handlers
5. Ensure Tailwind CSS styles are preserved
6. Handle localStorage and API calls appropriately
7. Test component rendering and functionality

## Dependencies
- React and React hooks
- Tailwind CSS for styling
- Material Symbols icons (via Google Fonts)
- Any existing routing or state management

## Followup
- Integrate components into the app
- Test for proper functionality
- Ensure responsive design
