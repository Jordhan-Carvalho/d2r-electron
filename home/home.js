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


// roshan... active and death time
const roshanListener = (reminderName) => {
  const checkBox = document.getElementById(`${reminderName}-checkbox`) 
  checkBox.addEventListener('change', () => {
    const reminderConfigListener = {name: reminderName, values: {}}
    if (checkBox.checked) {
      reminderConfigListener.values = { active: true }
    } else {
      reminderConfigListener.values = { active: false }
    }
    window.mainApi.setReminderConfig(reminderConfigListener)
  })

  const delayElem = document.getElementById(`${reminderName}-delay`)
  const delay = delayElem ? Number(delayElem.value) : 0
  const reminderConfig = {name: reminderName, values: { active: checkBox.checked, delay }}
  window.mainApi.setReminderConfig(reminderConfig)


  delayElem && delayElem.addEventListener('change', () => {
    const reminderConfigListener = {name: reminderName, values: {}}
    reminderConfigListener.values = { delay: Number(delayElem.value) }
    window.mainApi.setReminderConfig(reminderConfigListener)
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
  window.versions.app((event, value) => {
    versionElem.innerText = value
  })
}


setRoshanInputMask()
setVersion()
getUserConfiguration()
