const { app, BrowserWindow, ipcMain, autoUpdater, dialog } = require('electron')
const log = require('electron-log');
const path = require('path')
const store = require("./store/store.js")
const server = require("./server.js")
const game = require("./game/game.js")
const ga4 = require("./helpers/ga4.js")


if (require('electron-squirrel-startup')) return;
const autoHideMenuBar = app.isPackaged
const appVersion = app.getVersion()

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    title: `Dota 2 Reminders - v${appVersion}`,
    autoHideMenuBar,
    icon: path.join(__dirname, '/assets/dota2reminders.ico'),
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
  // handle/invoker on/send differences https://stackoverflow.com/questions/59889729/what-is-the-difference-between-ipc-send-on-and-invoke-handle-in-electron
  ipcMain.on('set-roshan-config', game.handleRoshanConfig)
  ipcMain.handle('store:set', store.handleStoreSet)
  ipcMain.handle('store:get', store.handleStoreGet)
  ipcMain.handle('userStore:get', store.handleUserStoreGet)
  ipcMain.handle('userStore:set', store.handleUserStoreSet)
  ipcMain.handle('playTestSound', game.playTestSound)
  createWindow()

  ga4.registerEvent({
    name: "app_opened",
    params: {
      version: app.getVersion(),
    }
  })

})

// quit if all windows are closed (default on mac)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

const processArg = process.argv[1];

if (processArg == '--squirrel-firstrun') {
  ga4.registerEvent({
    name: "first_time_run",
    params: {
      version: app.getVersion()
    }
  })
}

if (app.isPackaged && !(processArg == '--squirrel-firstrun')) {
  log.info('Updating from version:', app.getVersion());

  const updateServer = "https://d2r-electron-server-release.vercel.app"

  const url = `${updateServer}/update/${process.platform}/${app.getVersion()}`

  autoUpdater.setFeedURL({ url })

  // Will check for updates every 4 minutes if the game is not running
  setInterval(() => {
    if (!game.isGameRunning()) {
      try {
        autoUpdater.checkForUpdates()
        ga4.registerEvent({
          name: "update_check",
        })
      } catch (error) {
        log.error(error)
      }

    } else {
      log.info("Listening to the game")
    }
  }, 240000)

  autoUpdater.on('update-downloaded', (_event, releaseNotes, releaseName) => {
    log.info('Update complete', releaseName);

    ga4.registerEvent({
      name: "update_downloaded",
      params: {
        from_version: app.getVersion(),
        to_version: releaseName,
      }
    })

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
