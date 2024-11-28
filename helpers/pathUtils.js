const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const store = require('../store/store.js');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function getSteamPath() {
  try {
    const { stdout } = await execAsync('reg query "HKEY_CURRENT_USER\\Software\\Valve\\Steam" /v "SteamPath"');
    const match = stdout.match(/REG_SZ\s+(.+)/);
    if (match) {
      let steamPath = match[1].trim()
    }
    if (fs.existsSync(steamPath)) {
      return steamPath;
    }
    return null;
  } catch (error) {
    console.error('Error getting Steam path:', error);
    return null;
  }
}

async function getDefaultDotaPath() {
  defaultSteamPath = await getSteamPath()
  return path.join(defaultSteamPath, 'steamapps', 'common', 'dota 2 beta');
}

function getDotaConfigPath() {
  let dotaPath = store.userStore.get("dotaPath", null);
  if (!dotaPath) return false;
  return path.join(dotaPath, 'game', 'dota', 'cfg', 'gamestate_integration');
}

async function checkCFGFileExists() {
  dotaConfigPath = getDotaConfigPath()
  const cfgPath = path.join(dotaConfigPath, 'gamestate_integration_d2reminders.cfg');
  return fs.existsSync(cfgPath);
}

async function copyCFGFile() {
  try {
    const cfgConfigDir = getDotaConfigPath();
    const sourceFile = path.join(__dirname, '..', 'scripts.o', 'gamestate_integration_d2reminders.cfg');
    const targetFile = path.join(cfgConfigDir, 'gamestate_integration_d2reminders.cfg');

    if (!fs.existsSync(cfgConfigDir)) {
      fs.mkdirSync(cfgConfigDir, { recursive: true });
    }

    fs.copyFileSync(sourceFile, targetFile);
    return true;
  } catch (error) {
    console.error('Error copying CFG file:', error);
    return false;
  }
}

module.exports = {
  getDefaultDotaPath,
  checkCFGFileExists,
  copyCFGFile
};
