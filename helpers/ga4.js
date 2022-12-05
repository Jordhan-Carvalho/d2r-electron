const log = require('electron-log');
const { v4: uuidv4 } = require('uuid');
const store = require("../store/store.js")
const fetch = require('node-fetch')

const gaAPI = process.env.ANALYTICS_API
const measurementId = "G-HXYFBKW42T"
const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${gaAPI}`

const registerEvent = (eventObject) => {
  let clientId = store.userStore.get("clientId", null)
  if (!clientId) {
    clientId = uuidv4() 
    store.userStore.set("clientId", clientId)
  }

const postData = {
    client_id: clientId,
    events: [
      eventObject
    ]
  }

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(postData)
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => log.error(error));
}



module.exports = {
  registerEvent
}
