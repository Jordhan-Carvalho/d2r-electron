const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // we can also expose variables, not just functions
})


contextBridge.exposeInMainWorld('mainApi', {
  setReminderConfig: (reminderConfig) => ipcRenderer.send('set-reminder-config', reminderConfig)
})
