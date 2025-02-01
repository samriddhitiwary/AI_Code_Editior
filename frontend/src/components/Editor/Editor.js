import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import MonacoEditor from "@monaco-editor/react";
import axios from "axios";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import VoiceInput from "../VoiceInput/VoiceInput";
import "./Editor.css";

const socket = io("http://localhost:5000");

export default function Editor() {
  const [code, setCode] = useState("// Start coding...");
  const [language, setLanguage] = useState("javascript");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [output, setOutput] = useState("");
  const [theme, setTheme] = useState("dark");
  const [voiceInput, setVoiceInput] = useState("");
  const [cursors, setCursors] = useState({});

  useEffect(() => {
    socket.emit("joinRoom", "defaultRoom");
    socket.on("codeUpdate", (newCode) => setCode(newCode));
    socket.on("updateCursors", (updatedCursors) => setCursors(updatedCursors));
    return () => {
      socket.off("codeUpdate");
      socket.off("updateCursors");
    };
  }, []);

  const handleCodeChange = (value) => {
    setCode(value);
    socket.emit("codeChange", value);
  };

  const handleCursorChange = (editor) => {
    editor.onDidChangeCursorPosition((event) => {
      const position = editor.getPosition();
      socket.emit("cursorMove", { position });
    });
  };

  const removeFirstAndLastLine = (textBlock) => {
    const array = textBlock.split("\n");
    array.pop();
    array.shift();
    return array.join('\n')
  }

  const getAiSuggestion = async (voiceCommand) => {
    try {
      let prompt;
      let actionType;
  
      if(code.includes("Start coding...")) {
        setCode("");
      }
      if (code.trim().length > 0) {
        prompt = `${voiceCommand} for provided code ${code}`
      } else {
        prompt = `${voiceCommand}`
      }
      
      console.log(actionType);
      console.log("Prompt to API:", prompt);
  
      const response = await axios.post("http://localhost:5000/ai-autocomplete", { prompt });
      
      // const languageLowerCase = language.toLocaleLowerCase();
      // const suggestion = response.data.suggestion.replaceAll("```", "").replace(`${languageLowerCase}\n`, "")
      const suggestion = removeFirstAndLastLine(response.data.suggestion)
      setAiSuggestion(suggestion);
      setCode(suggestion);
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
    }
  };

  const runCode = async () => {
    try {
      const response = await axios.post("http://localhost:5000/run", { code, language });
      setOutput(response.data.output);
    } catch (error) {
      setOutput("Error executing code.");
      console.error("Execution Error:", error);
    }
  };

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <div className={`editor-container ${theme}`}>
      <div className="controls">
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
        <button className="run-button" onClick={runCode}>Run</button>
        <button className="ai-button" onClick={() => getAiSuggestion(voiceInput)}>AI Suggest</button>
        <VoiceInput setVoiceInput={setVoiceInput} getAiSuggestion={getAiSuggestion} />
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
        </button>
      </div>
      <div className="editor-ai-container">
        <div className="editor">
          <MonacoEditor
            height="60vh"
            theme={theme === "dark" ? "vs-dark" : "vs-light"}
            language={language}
            value={code}
            onChange={handleCodeChange}
            onMount={handleCursorChange}
          />
        </div>

        <div className="suggestions">
          <h2>AI Suggestions</h2>
          <pre>{aiSuggestion}</pre>
        </div>
      </div>

      <div className="output-container">
        <h2>Output</h2>
        <pre className="terminal">{output}</pre>
      </div>

      
    </div>
  );
}
