"use strict";

const { BrowserWindow,app } = require("electron");
const path = require("path");
const url = require("url")

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });
    win.loadURL(
        url.format({
            pathname: path.join(__dirname, `dist/pomodoro/browser/index.html`),
            protocol: 'file',
            slashes: true
        })
    )
}
app.on('ready',createWindow);

app.on("window-all-closed",()=>{
    if(process.platform!=="darwin"){
        app.quit();
    }
});
app.on("activate",()=>{
    if(mainWindow!==null){
        createWindow();
    }
})
