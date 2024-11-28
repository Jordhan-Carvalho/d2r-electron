const playTestSoundListener = () => {
  const playButtonElem = document.getElementById("test-sound")

  playButtonElem.addEventListener("click", async() => {
    await window.mainApi.playTestSound()
  })

}

// Volume
const volumeListener = async () => {
  const volumeInputElem = document.getElementById("volume-input")
  const value = String(await window.mainApi.userStoreGet("volume"))

  if (value) {
    volumeInputElem.value = String(value)
  } else {
    volumeInputElem.value = 0.5
  }

  volumeInputElem.addEventListener('change', async () => {
    const volume = Number(volumeInputElem.value)
    await window.mainApi.userStoreSet("volume", volume)
  })
}

// This will set the html input values for the checkbox and input
const setHTMLvalues = async (reminderName, values) => {
  const checkBox = document.getElementById(`${reminderName}-checkbox`)
  checkBox.checked = values.active

  checkBox.addEventListener('change', async () => {
    const reminderValues = await window.mainApi.storeGet(reminderName)
    const newValue = { ...reminderValues }
    if (checkBox.checked) {
      newValue.active = true
    } else {
      newValue.active = false
    }
    await window.mainApi.storeSet(reminderName, newValue)
  })


  // Delay html input
  const delayElem = document.getElementById(`${reminderName}-delay`)
  if (delayElem) {
    delayElem.value = values.delay

    delayElem.addEventListener('change', async () => {
      const reminderValues = await window.mainApi.storeGet(reminderName)

      const newValue = { ...reminderValues }
      newValue.delay = Number(delayElem.value)

      await window.mainApi.storeSet(reminderName, newValue)
    })
  }


  await window.mainApi.storeSet(reminderName, values)
}


const getUserConfiguration = async () => {
  const defaultConfigObj = { stack: { active: false, delay: 13 }, midrunes: { active: true, delay: 4 }, bountyrunes: { active: true, delay: 3 }, neutral: { active: true, delay: 0 }, smoke: { active: true, delay: 1 }, ward: { active: true, delay: 0 }, daytime: { active: true, delay: 0 }, tower: { active: true, delay: 0 }, roshan: { active: true, delay: 0}, aegis: { active: true, delay: 0}, wisdomrunes: { active: true, delay: 6 }, lotus: { active: true, delay: 3 }, tormentor: { active: true, delay: 0 } }
  // get the values from the store
  for (const key in defaultConfigObj) {
    const value = await window.mainApi.storeGet(key)

    if (value) {
      defaultConfigObj[key].delay = value.delay
      defaultConfigObj[key].active = value.active
    }
  }


  for (const key in defaultConfigObj) {
    setHTMLvalues(key, defaultConfigObj[key])
  }

}

const setVersion = () => {
  const versionElem = document.getElementById("d2r-version")
  window.versions.app((_event, value) => {
    versionElem.innerText = value
  })
}

const initDotaPath = async () => {
  const dotaPathInput = document.getElementById('dota-path');
  const installGsiBtn = document.getElementById('install-cfg');

  // Get saved or default path
  const savedPath = await window.mainApi.userStoreGet('dotaPath');
  if (savedPath) {
    dotaPathInput.value = savedPath;
  } else {
    const defaultPath = await window.mainApi.getDefaultDotaPath();
    if (defaultPath) {
      dotaPathInput.value = defaultPath;
      await window.mainApi.userStoreSet('dotaPath', defaultPath);
    }
  }

  // Check CFG status initially
  updateCFGStatus();

  // Add event listeners
  dotaPathInput.addEventListener('change', async () => {
    const newPath = dotaPathInput.value;
    await window.mainApi.userStoreSet('dotaPath', newPath);
    updateCFGStatus();
  });

  installGsiBtn.addEventListener('click', async () => {
    const success = await window.mainApi.installCFG(dotaPathInput.value);
    if (success) {
      updateCFGStatus();
    }
  });
};

const updateCFGStatus = async () => {
  const dotaPath = await window.mainApi.userStoreGet('dotaPath');
  const cfgStatus = document.getElementById('cfg-status');
  const installGsiBtn = document.getElementById('install-cfg');

  const hasCFG = await window.mainApi.checkCFGStatus(dotaPath);
  
  if (hasCFG) {
    cfgStatus.textContent = '✓ CFG Configured';
    cfgStatus.className = 'cfg-status-green';
    installGsiBtn.classList.add('hide');
  } else {
    cfgStatus.textContent = '✗ CFG Not Found';
    cfgStatus.className = 'cfg-status-red';
    installGsiBtn.classList.remove('hide');
  }
};

volumeListener()
playTestSoundListener()
setVersion()
getUserConfiguration()
initDotaPath();
