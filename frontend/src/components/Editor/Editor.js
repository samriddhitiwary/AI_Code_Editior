import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import MonacoEditor from "@monaco-editor/react";
import axios from "axios";
import { MdLightMode, MdDarkMode } from "react-icons/md"; // Importing Material icons
import "./Editor.css";

const socket = io("http://localhost:5000");

export default function Editor() {
  const [code, setCode] = useState("// Start coding...");
  const [language, setLanguage] = useState("javascript");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [output, setOutput] = useState("");
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    socket.emit("joinRoom", "defaultRoom");
    socket.on("codeUpdate", (newCode) => setCode(newCode));

    return () => socket.off("codeUpdate");
  }, []);

  const handleCodeChange = (value) => {
    setCode(value);
    socket.emit("codeChange", value);
  };

  const getAiSuggestion = async () => {
    try {
      const response = await axios.post("http://localhost:5000/ai-autocomplete", { prompt: code });
      setAiSuggestion(response.data);
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
    }
  };

  const runCode = async () => {
    try {
      const response = await axios.post("http://localhost:5000/run", { code, language });
      console.log("Server Response:", response.data); // Debugging line
      setOutput(response.data.output);
    } catch (error) {
      setOutput("Error executing code.");
      console.error("Execution Error:", error);
    }
  };
  

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <div className={`editor-container ${theme}`}>
      <div className="controls">
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
        <button className="run-button" onClick={runCode}>
          Run
        </button>
        <button className="ai-button" onClick={getAiSuggestion}>
          AI Suggest
        </button>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
        </button>
      </div>

      <div className="editor">
        <MonacoEditor height="60vh" theme={theme === "dark" ? "vs-dark" : "vs-light"} language={language} value={code} onChange={handleCodeChange} />
      </div>

      <div className="output-container">
        <h2>Output</h2>
        <pre className="terminal">{output}</pre>
      </div>

      <div className="suggestions">
        <h2>AI Suggestions</h2>
        <pre>{aiSuggestion}</pre>
      </div>
    </div>
  );
}

