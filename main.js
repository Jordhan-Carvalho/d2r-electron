const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const server = require("./server.js")
const game = require("./game/game.js")

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 650,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    /* frame: false, */
    title: "Dota 2 reminders - v1.0.0",
    autoHideMenuBar: true
  })

  mainWindow.loadFile('./home/home.html')

  // MAKE FIVEER WINDOW OPEN IN BROWSER
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    require('electron').shell.openExternal(url);
    return { action: 'deny' };
  });
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
