import { useState } from "react";

const AIResponse = ({ suggestion }) => {
  const speakText = () => {
    if (!suggestion) return;

    const speech = new SpeechSynthesisUtterance(suggestion);
    speech.lang = "en-US"; 
    speech.rate = 1; 
    speech.pitch = 1; 
    speechSynthesis.speak(speech);
  };

  return (
    <div>
      <p>{suggestion}</p>
      <button onClick={speakText}>🔊 Listen</button>
    </div>
  );
};

export default AIResponse;
