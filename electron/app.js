const { app, BrowserWindow, ipcMain } = require('electron')
const { v4: uuidv4 } = require('uuid');
const screenshot = require('screenshot-desktop');

const log = require('electron-log');

log.initialize();


// var socket = require('socket.io-client')('http://localhost:5000');
var socket = require('socket.io-client')('http://192.168.1.4:5000');
var interval;

function createWindow () {
    const win = new BrowserWindow({
        width: 500,
        height: 150,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.removeMenu();
    win.loadFile('index.html');
    // win.loadURL("http://localhost:3000")
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

ipcMain.on("start-share", function(event, arg) {

    // var uuid = uuidv4();
    var uuid = "test";
    
    socket.emit("join-message", uuid);
    event.reply("uuid", uuid);

    interval = setInterval(function() {
        screenshot().then((img) => {
            var imgStr = new Buffer.from(img).toString('base64');
            
            var obj = {};
            obj.room = uuid;
            obj.image = imgStr;
            // obj.image = "Image";
            // log.info('Log from the main process start-share ', obj);
            socket.emit("screen-data", JSON.stringify(obj));
        })
    }, 1000)
})

ipcMain.on("stop-share", function(event, arg) {

    clearInterval(interval);
})