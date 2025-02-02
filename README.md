# AI-Assisted Code Editor

## Table of Contents

- [Introduction](#introduction)
- [Key Features](#key-features)
  - [AI-Powered Linting & Auto-Completion](#ai-powered-linting--auto-completion)
  - [Code Debugging, Generation & Explanation](#code-debugging-generation--explanation)
  - [Speech & Voice Input/Output](#speech--voice-inputoutput)
  - [Multi-User Collaboration with Live Cursor Positioning](#multi-user-collaboration-with-live-cursor-positioning)
  - [Dark/Light Mode Toggle](#darklight-mode-toggle)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Electron Setup](#electron-setup)

## Introduction

This AI-powered code editor is a lightweight, real-time collaborative tool designed to help developers with intelligent code assistance. It integrates advanced features like AI-driven linting, auto-completion, speech input/output, and multi-user editing for seamless coding and collaboration.

## Key Features

### AI-Powered Linting & Auto-Completion
Offers real-time suggestions for code linting, error detection, and auto-completion to improve code quality and development speed.

### Code Debugging, Generation & Explanation
AI identifies errors, generates new code snippets, and explains the logic behind your code in plain language, making it easier to understand and optimize.

### Speech & Voice Input/Output
Allows developers to interact with the editor through voice commands, queries, and speech feedback, enabling hands-free coding and improved accessibility.

### Multi-User Collaboration with Live Cursor Positioning
Multiple users can collaborate in real time with live cursor positioning, allowing everyone to see where others are working in the code.

### Dark/Light Mode Toggle
The editor supports both dark and light modes to enhance user comfort, offering flexibility for different working environments.

## Technologies Used

- **React.js**: Frontend framework for building user interfaces.
- **Node.js**: Backend environment for server-side processing.
- **Socket.io**: For real-time collaboration and communication.
- **Speech Recognition API**: For speech-to-text functionality.
- **Electron.js**: For packaging the app into a desktop application.

## Installation

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/samriddhitiwary/AI_Code_Editior.git
   cd backend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm start
   ```
   The backend will run on port `5000` by default. 

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the frontend server:
   ```bash
   npm start
   ```
   The frontend will run on port `3000` by default. 

### Electron Setup

1. Navigate to the Electron folder:
   ```bash
   cd electron
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the Electron app:
   ```bash
   npm start
   ```

This will launch the AI-Assisted Code Editor as a desktop application.

---

Let me know if you'd like further adjustments!
