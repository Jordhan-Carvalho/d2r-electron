const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const server = require("./server.js")
const game = require("./game/game.js")

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 450,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  win.loadFile('./home/home.html')
}

// Local http server that will listen to the dota game events


// Basically the same as app.on('ready')
app.whenReady().then(() => {
  server.startServer()
  ipcMain.on('set-reminder-config', game.handleReminderConfig)
  createWindow()
})

// quit if all windows are closed (default on mac)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})


// ** COMMUNICATION TO ELEC WINDOW **
ipcMain.handle("ping", () => {
  return "BILAU"
})
