const log = require('electron-log');
const { v4: uuidv4 } = require('uuid');
const store = require("../store/store.js")
const axios = require('axios')

const { optionalRequire } = require("optional-require");
const configEnv = optionalRequire("../config-envs")

const measurementId = configEnv ? configEnv.MEASUREMENT_ID : "dev"
const analyticsApi = configEnv ? configEnv.ANALYTICS_API : "dev"

const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${analyticsApi}`

const registerEvent = (eventObject) => {
  let clientId = store.userStore.get("clientId", null)
  if (!clientId) {
    clientId = uuidv4()
    store.userStore.set("clientId", clientId)
  }

  eventObject.params = { ...eventObject.params, engagement_time_msec: 1, client_id: clientId }

  const postData = {
    client_id: clientId,
    events: [
      eventObject
    ]
  }

  axios.post(url, postData)
    .then(function(_response) {
    })
    .catch(function(error) {
      log.error(error)
    });

}



module.exports = {
  registerEvent
}
