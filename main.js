const { app, BrowserWindow, ipcMain, autoUpdater } = require('electron')
const log = require('electron-log');
const path = require('path')
const server = require("./server.js")
const game = require("./game/game.js")

const autoHideMenuBar = app.isPackaged
const appVersion = app.getVersion()

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 650,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    title: `Dota 2 Reminders - v${appVersion}`,

    autoHideMenuBar
  })

  mainWindow.loadFile('./home/home.html')

  mainWindow.webContents.send('app-version', appVersion)

  // MAKE EXTERNAL WINDOW OPEN IN BROWSER
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    require('electron').shell.openExternal(url);
    return { action: 'deny' };
  });
}

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

const processArg = process.argv[1];
// AUTO UPDATE SETTINGS... isPackaged will work as production checker
if (app.isPackaged && !(processArg == '--squirrel-firstrun')) {
  log.info('Updating from version:', app.getVersion());
  
  const updateServer = "https://d2r-electron-server-release.vercel.app"

  const url = `${updateServer}/update/${process.platform}/${app.getVersion()}`
  
  autoUpdater.setFeedURL({ url })
  
  // Will for updates every 5 minutes
  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 300000)

  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Dota 2 Reminders Update',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail:
        'A new version has been downloaded. Restart the application to apply the updates.',
    }
  
    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
  })

  autoUpdater.on('error', (message) => {
    log.error("There was a problem updating the application", message)
  })
}
