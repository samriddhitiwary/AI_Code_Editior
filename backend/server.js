import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";
import axios from "axios";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

const __dirname = path.resolve();

const tempDir = path.join(__dirname, "temp");
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

app.post("/ai-autocomplete", async (req, res) => {
  try {
    const { prompt } = req.body;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    // Correct the model name to "gpt-4" instead of "gpt-4o"
    const model = "gpt-4"; // Use the appropriate model name

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",  // Change endpoint to /chat/completions for newer API
      {
        model: model,
        messages: [
          { role: "system", content: "You are a helpful assistant to write good quality Code. Just provide code. Dont provide any suggestion or text along with code." },
          { role: "user", content: prompt }
        ],
      },
      {
        headers: { Authorization: `Bearer ${openaiApiKey}` }
      }
    );
    
    res.json({ suggestion: response.data.choices[0].message.content });
  } catch (error) {
    console.error("Error processing AI suggestion:", error); // More detailed error logging
    res.status(500).json({ error: error.message });
  }
});



// Code Execution API
app.post("/run", (req, res) => {
  const { code, language } = req.body;
  let command;

  switch (language) {
    case "javascript":
      command = `node -e "${code.replace(/"/g, '\\"')}"`;
      exec(command, (error, stdout, stderr) => {
        if (error) return res.json({ output: stderr });
        res.json({ output: stdout });
      });
      break;

    case "python":
      command = `python -c "${code.replace(/"/g, '\\"')}"`;
      exec(command, (error, stdout, stderr) => {
        if (error) return res.json({ output: stderr });
        res.json({ output: stdout });
      });
      break;

      case "java": {
        const match = code.match(/public\s+class\s+(\w+)/);
        if (!match) {
          return res.json({ output: "Error: No public class found in Java code." });
        }
        
        const className = match[1]; // Extract class name
        const javaFile = path.join(tempDir, `${className}.java`);
        fs.writeFileSync(javaFile, code);
      
        // Compile Java file
        const compileCommand = `javac ${javaFile}`;
        exec(compileCommand, (compileError, compileStdout, compileStderr) => {
          if (compileError) {
            return res.json({ output: compileStderr || "Compilation failed" });
          }
      
          // Ensure the Java process runs in the correct directory
          const runCommand = `java -cp ${tempDir} ${className}`;
          exec(runCommand, { cwd: tempDir }, (runError, runStdout, runStderr) => {
            if (runError) {
              return res.json({ output: runStderr || "Execution failed" });
            }
            res.json({ output: runStdout.trim() });
          });
        });
        break;
      }
      
      

    case "cpp": {
      const cppFile = path.join(tempDir, "main.cpp");
      fs.writeFileSync(cppFile, code);

      // Compile C++ code
      const compileCommand = `g++ ${cppFile} -o ${tempDir}/main`;
      exec(compileCommand, (compileError, compileStdout, compileStderr) => {
        if (compileError) {
          return res.json({ output: compileStderr });
        }

        // Run the compiled C++ program
        const runCommand = `${tempDir}/main`;
        exec(runCommand, (runError, runStdout, runStderr) => {
          if (runError) {
            return res.json({ output: runStderr });
          }
          res.json({ output: runStdout });
        });
      });
      break;
    }

    default:
      return res.json({ output: "Language not supported yet." });
  }
});

// Real-time Collaboration
let users = {};
io.on("connection", (socket) => {
  socket.on("joinRoom", (room) => {
    socket.join(room);
    users[socket.id] = room;
  });

  socket.on("codeChange", (data) => {
    socket.to(users[socket.id]).emit("codeUpdate", data);
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));
