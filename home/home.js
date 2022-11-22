const remindersConfigurationListener = (reminderName) => {
  console.log("Dentro do config listener", reminderName)
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


  delay.addEventListener('change', () => {
    const reminderConfigListener = {name: reminderName, values: {}}
    reminderConfigListener.values = { delay: Number(delay.value) }
    window.mainApi.setReminderConfig(reminderConfigListener)
  })
}


remindersConfigurationListener("stack")
remindersConfigurationListener("midrunes")
remindersConfigurationListener("bountyrunes")
remindersConfigurationListener("smoke")
remindersConfigurationListener("neutral")
