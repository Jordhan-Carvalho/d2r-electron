const log = require('electron-log');
const { v4: uuidv4 } = require('uuid');
const store = require("../store/store.js")
const axios = require('axios')


const configEnv = require("../config-envs")
const measurementId = "G-HXYFBKW42T"
const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${configEnv.ANALYTICS_API}`

const registerEvent = (eventObject) => {
  let clientId = store.userStore.get("clientId", null)
  if (!clientId) {
    clientId = uuidv4() 
    store.userStore.set("clientId", clientId)
  }

eventObject.params = { ...eventObject.params, engagement_time_msec: 1}

const postData = {
    client_id: clientId,
    events: [
      eventObject
    ]
  }
  
  axios.post(url, postData)
  .then(function (_response) {
  })
  .catch(function (error) {
    log.error(error)
  });

}



module.exports = {
  registerEvent
}
