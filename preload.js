const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  app: (callback) => ipcRenderer.on('app-version', callback)
  // we can also expose variables, not just functions
})


contextBridge.exposeInMainWorld('mainApi', {
  // handle/invoker on/send differences https://stackoverflow.com/questions/59889729/what-is-the-difference-between-ipc-send-on-and-invoke-handle-in-electron
  storeSet: (key, value) => ipcRenderer.invoke('store:set', key, value),
  storeGet: (key) => ipcRenderer.invoke('store:get', key),
  userStoreSet: (key, value) => ipcRenderer.invoke('userStore:set', key, value),
  userStoreGet: (key) => ipcRenderer.invoke('userStore:get', key),
  playTestSound: () => ipcRenderer.invoke('playTestSound'),
  getDefaultDotaPath: () => ipcRenderer.invoke('getDefaultDotaPath'),
  checkCFGStatus: () => ipcRenderer.invoke('dota:checkCFG'),
  installCFG: () => ipcRenderer.invoke('dota:installCFG')
})
