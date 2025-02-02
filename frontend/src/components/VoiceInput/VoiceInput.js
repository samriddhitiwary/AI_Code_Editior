import React, { useState } from "react";
import "./VoiceInput.css"; // Importing the styles
import { MdMic } from "react-icons/md"; // Mic Icon

const VoiceInput = ({ getAiSuggestion }) => {
  const [isListening, setIsListening] = useState(false);

  const startRecognition = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      console.log("Voice recognition started...");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("User said:", transcript); // Log the recognized speech

      // Trigger AI suggestion dynamically based on the recognized speech
      getAiSuggestion(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event);
      if (event.error === "network") {
        console.error("Network error - check your internet connection.");
      } else {
        console.error(`Error: ${event.error}`);
      }
      setIsListening(false); // Reset if there's an error
    };

    recognition.onend = () => {
      setIsListening(false); // Reset state when done
      console.log("Voice recognition ended.");
    };

    recognition.start();
  };

  return (
    <div>
      <button onClick={startRecognition} disabled={isListening}>
        {isListening ? "Listening..." : "Start Voice Command"}
      </button>

      {/* Conditionally show the mic popup and animation */}
      {isListening && (
        <div className="voice-popup">
          <div className="mic-container">
            <MdMic className="mic-icon" />
            <div className="mic-wave"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
