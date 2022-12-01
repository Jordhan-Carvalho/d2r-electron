const setRoshanInputMask = () => {
const roshanInput = document.getElementById("roshan-timer")

Inputmask("05:59:59", {
    placeholder: "HH:MM:SS",
    insertMode: false,
    showMaskOnHover: false,
    definitions: {
        '5': {
            validator: "[0-5]",
            cardinality: 1
        }
    }
  }).mask(roshanInput);
} 

const convertFullTimeToSeconds = (time) => {
  const date = new Date()
  date.setHours(...time.split(":"))

  const seconds = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()

  return seconds
}


// roshan... active and death time
const roshanListener = () => {
  const checkBox = document.getElementById(`roshan-checkbox`) 
  checkBox.addEventListener('change', () => {
    const roshanConfig = { active: checkBox.checked } 

    window.mainApi.setRoshanConfig(roshanConfig)
  })

  const deathInputElem =  document.getElementById("roshan-timer")

  deathInputElem.addEventListener('change', () => {
    const timeInSeconds = convertFullTimeToSeconds(deathInputElem.value)
    const roshanConfig = { time: timeInSeconds}

    window.mainApi.setRoshanConfig(roshanConfig)

  })
}

// This will set the html input values for the checkbox and input
const setHTMLvalues = async (reminderName, values) => {
  const checkBox = document.getElementById(`${reminderName}-checkbox`) 
  checkBox.checked = values.active

  checkBox.addEventListener('change', async() => {
    const reminderValues = await window.mainApi.storeGet(reminderName)
    const newValue = {...reminderValues} 
    if (checkBox.checked) {
      newValue.active =  true
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

      const newValue = {...reminderValues}
      newValue.delay = Number(delayElem.value)

      await window.mainApi.storeSet(reminderName, newValue)
    })
  }


  await window.mainApi.storeSet(reminderName, values)
}


const getUserConfiguration = async() => {
  const defaultConfigObj = {stack: { active: false , delay: 13} , midrunes: {active: true, delay: 4}, bountyrunes: {active: true, delay: 3}, neutral: {active: true, delay:0}, smoke: {active: true, delay: 1}, ward: {active: true, delay: 0}}
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


setRoshanInputMask()
roshanListener()
setVersion()
getUserConfiguration()
