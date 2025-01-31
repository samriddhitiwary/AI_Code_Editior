import React, { useState, useEffect } from "react";

const VoiceInput = ({ setVoiceInput }) => {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";

    recognition.onstart = () => {
      console.log("Voice recognition started");
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setVoiceInput(transcript);  
    };

    recognition.onerror = (event) => {
      console.error("Error occurred in speech recognition: ", event);
      setIsListening(false);
    };

    return () => {
      recognition.stop(); 
    };
  }, [setVoiceInput]);

  const startRecognition = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.start();
  };

  return (
    <div>
      <button onClick={startRecognition} disabled={isListening}>
        {isListening ? "Listening..." : "Start Voice Recognition"}
      </button>
    </div>
  );
};

export default VoiceInput;
