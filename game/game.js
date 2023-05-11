const sound = require("../helpers/soundPlay.js");
const path = require("path");
const store = require("../store/store.js");

let LAST_CALL_BUY_WARDS = 0
let LAST_CALL_TOWER_DENY = 0
let DAYTIME_CALLED = false
let NIGHT_CALLED = false
let LAST_GAME_TIME = 0
let STORE_DATA = store.getAllData()
let IS_GAME_RUNNING = null
let LAST_TIME_EVENT_RECEIVED = null
let VOLUME = store.handleUserStoreGet(null, "volume")
let PAST_EVENTS = []
let ROSHAN_DEAD = null
let AEGIS_PICKED = null


const isGameRunning = () => {
  return IS_GAME_RUNNING
}

const checkForGameRunning = () => {
  const secondsIddle = 45

  if (!LAST_TIME_EVENT_RECEIVED) {
    const intervalId = setInterval(() => {
      const timeNow = Math.floor(new Date().getTime() / 1000);

      if ((LAST_TIME_EVENT_RECEIVED + secondsIddle) < timeNow) {
        IS_GAME_RUNNING = false
        LAST_TIME_EVENT_RECEIVED = null;
        PAST_EVENTS = []
        ROSHAN_DEAD = null
        AEGIS_PICKED = null
        clearInterval(intervalId)
      }
    }, 20000)
  }

  LAST_TIME_EVENT_RECEIVED = Math.floor(new Date().getTime() / 1000);
  IS_GAME_RUNNING = true
}

const playTestSound = () => {
  const filePath = path.join(__dirname, "../sound/test-sound.mp3");
  sound.play(filePath, VOLUME);
}

function storeChangeCallback(newValue, _oldValue) {
  const parsedNewValue = {}
  for (const key in newValue) {
    parsedNewValue[key] = JSON.parse(newValue[key])
  }
  STORE_DATA = parsedNewValue
}

function volumeChangeCallback(newValue, _oldValue) {
  VOLUME = newValue
}

const checkForTowerDeny = (gameTime, buildings) => {
  if (LAST_CALL_TOWER_DENY > gameTime) LAST_CALL_TOWER_DENY = 0
  const team = buildings.dire ? "dire" : "radiant"
  const timeBetweenCalls = 15

  for (const building in buildings[team]) {
    if (building.includes('tower') && (LAST_CALL_TOWER_DENY + timeBetweenCalls) <= gameTime) {
      const lane = building.split('_')[3]
      const maxHealth = buildings[team][building].max_health
      const currentHealth = buildings[team][building].health

      const isDeniable = currentHealth <= (maxHealth * 0.1)
      if (isDeniable) {
        const filePath = path.join(__dirname, `../sound/${lane}-tower.mp3`);
        sound.play(filePath, VOLUME);
        LAST_CALL_TOWER_DENY = gameTime
      }

    }
  }

}

const checkForDaytime = (isDaytime) => {
  if (isDaytime && !DAYTIME_CALLED) {
    const filePath = path.join(__dirname, "../sound/daytime.mp3");
    sound.play(filePath, VOLUME);
    DAYTIME_CALLED = true
    NIGHT_CALLED = false
  } else if (!isDaytime && !NIGHT_CALLED) {
    const filePath = path.join(__dirname, "../sound/nighttime.mp3");
    sound.play(filePath, VOLUME);
    NIGHT_CALLED = true
    DAYTIME_CALLED = false
  }
}

const checkForRoshanWarnTime = (gameTime, deathTime) => {
  const roshanMin = 469
  const roshanMax = 659

  if (deathTime + roshanMin === gameTime) {
    const filePath = path.join(__dirname, "../sound/roshanMin.mp3");
    sound.play(filePath, VOLUME);
  }
  else if (deathTime + roshanMax === gameTime) {
    const filePath = path.join(__dirname, "../sound/roshanMax.mp3");
    sound.play(filePath, VOLUME);
  } else if (deathTime + roshanMax < gameTime) {
    ROSHAN_DEAD = null
  }
}

checkForAegisWarnTime = (gameTime, deathTime) => {
  const aegis2minWarnTime = 180
  const aegis30sWarnTime = 271
  const aegis10sWarnTime = 291
  const aegisExpiredTime = 302

  if (deathTime + aegis2minWarnTime === gameTime) {
    const filePath = path.join(__dirname, "../sound/aegis2min.mp3");
    sound.play(filePath, VOLUME);
  }
  else if (deathTime + aegis30sWarnTime === gameTime) {
    const filePath = path.join(__dirname, "../sound/aegis30s.mp3");
    sound.play(filePath, VOLUME);
  }
  else if (deathTime + aegis10sWarnTime === gameTime) {
    const filePath = path.join(__dirname, "../sound/aegis10s.mp3");
    sound.play(filePath, VOLUME);
  }
  else if (deathTime + aegisExpiredTime === gameTime) {
    const filePath = path.join(__dirname, "../sound/aegisExpired.mp3");
    sound.play(filePath, VOLUME);
  } else if (deathTime + aegisExpiredTime < gameTime) {
    AEGIS_PICKED = null
  }
}

const checkForStack = (gameTime) => {
  const stackTime = 60
  const stackDelay = store.handleStoreGet(null, "stack").delay
  const stackAlertTime = stackTime - stackDelay

  if ((gameTime - stackAlertTime) % stackTime === 0) {
    const filePath = path.join(__dirname, "../sound/stack.mp3");
    sound.play(filePath, VOLUME);
  }
}

const checkForMidRunes = (gameTime) => {
  const midRunesTime = 120;
  const midRunesDelay = store.handleStoreGet(null, "midrunes").delay
  const midRunesAlertTime = midRunesTime - midRunesDelay

  if ((gameTime - midRunesAlertTime) % midRunesTime === 0) {
    const filePath = path.join(__dirname, "../sound/mid-rune.mp3");
    sound.play(filePath, VOLUME);
  }
}

const checkForWisdomRunes = (gameTime) => {
  const wisdomRunesTime = 420;
  const wisdomRunesDelay = store.handleStoreGet(null, "wisdomrunes").delay
  const wisdomRunesAlertTime = wisdomRunesTime - wisdomRunesDelay

  if ((gameTime - wisdomRunesAlertTime) % wisdomRunesTime === 0) {
    const filePath = path.join(__dirname, "../sound/wisdom-rune.mp3");
    sound.play(filePath, VOLUME);
  }
}

const checkForLotus = (gameTime) => {
  const lotusTime = 180;
  const lotusDelay = store.handleStoreGet(null, "lotus").delay
  const lotusAlertTime = lotusTime - lotusDelay

  if ((gameTime - lotusAlertTime) % lotusTime === 0) {
    const filePath = path.join(__dirname, "../sound/lotus.mp3");
    sound.play(filePath, VOLUME);
  }
}

const checkForBountyRunes = (gameTime) => {
  const bountyRunesTime = 180;
  const bountyRunesDelay = store.handleStoreGet(null, "bountyrunes").delay
  const bountyRunesAlertTime = bountyRunesTime - bountyRunesDelay

  if ((gameTime - bountyRunesAlertTime) % bountyRunesTime === 0) {
    const filePath = path.join(__dirname, "../sound/bounty-runes.mp3");
    sound.play(filePath, VOLUME);
  }
}

const checkNeutralItems = (gameTime) => {
  const neutralItemsTime = [420, 1020, 1620, 2200, 3600]

  for (let i = 0; i < neutralItemsTime.length; i++) {
    if (gameTime === neutralItemsTime[i]) {
      const filePath = path.join(__dirname, `../sound/neutralTier${i + 1}.mp3`);
      sound.play(filePath, VOLUME);
    }
  }
}

const checkForSmoke = (gameTime) => {
  const smokeTime = 420
  const smokeDelay = store.handleStoreGet(null, "smoke").delay
  const smokeAlertTime = smokeTime - smokeDelay

  if ((gameTime - smokeAlertTime) % smokeTime === 0) {
    const filePath = path.join(__dirname, "../sound/smoke.mp3");
    sound.play(filePath, VOLUME);
  }

}

const checkForWards = (gameTime, wardCd) => {
  if (LAST_CALL_BUY_WARDS > gameTime) LAST_CALL_BUY_WARDS = 0
  const timeBetweenCalls = 30

  if (wardCd === 0 && (LAST_CALL_BUY_WARDS + timeBetweenCalls) <= gameTime) {
    const filePath = path.join(__dirname, "../sound/wards.mp3");
    sound.play(filePath, VOLUME);
    LAST_CALL_BUY_WARDS = gameTime
  }

}

const onNewGameEvent = async (gameEvent) => {

  if (gameEvent.map && gameEvent.map.game_state === 'DOTA_GAMERULES_STATE_GAME_IN_PROGRESS') {
    const gameTime = gameEvent.map.clock_time
    const wardsPurchaseCd = gameEvent.map.ward_purchase_cooldown
    const isDaytime = gameEvent.map.daytime
    const buildings = gameEvent.buildings


    let newEvent = null;
    // In-game events
    const differentEvents = gameEvent.events.filter(newEvent => {
      return !PAST_EVENTS.some(pastEvent => {
        return `${pastEvent.event_type}-${pastEvent.game_time}` === `${newEvent.event_type}-${newEvent.game_time}`;
      });
    });
    if (differentEvents.length > 0) {
      newEvent = differentEvents[0]
      PAST_EVENTS.push(newEvent)
    }

    if (newEvent) {
      if (newEvent.event_type === 'roshan_killed' && STORE_DATA.roshan.active) {
        ROSHAN_DEAD = gameTime
      } else if (newEvent.event_type === 'aegis_picked_up' && STORE_DATA.aegis.active) {
        AEGIS_PICKED = gameTime
      }
    }


    if (LAST_GAME_TIME === gameTime) return
    if (LAST_GAME_TIME > gameTime) LAST_GAME_TIME = 0

    if (STORE_DATA.stack.active) {
      checkForStack(gameTime)
    }
    if (STORE_DATA.midrunes.active) {
      checkForMidRunes(gameTime)
    }
    if (STORE_DATA.bountyrunes.active) {
      checkForBountyRunes(gameTime)
    }
    if (STORE_DATA.neutral.active) {
      checkNeutralItems(gameTime)
    }
    if (STORE_DATA.smoke.active) {
      checkForSmoke(gameTime)
    }
    if (STORE_DATA.ward.active) {
      checkForWards(gameTime, wardsPurchaseCd)
    }
    if (STORE_DATA.daytime.active) {
      checkForDaytime(isDaytime)
    }
    if (STORE_DATA.tower.active) {
      checkForTowerDeny(gameTime, buildings)
    }
    if (STORE_DATA.wisdomrunes.active) {
      checkForWisdomRunes(gameTime)
    }
    if (STORE_DATA.lotus.active) {
      checkForLotus(gameTime)
    }
    if (ROSHAN_DEAD && STORE_DATA.roshan.active) {
      checkForRoshanWarnTime(gameTime, ROSHAN_DEAD)
    }
    if (AEGIS_PICKED && STORE_DATA.aegis.active) {
      checkForAegisWarnTime(gameTime, AEGIS_PICKED)
    }

    LAST_GAME_TIME = gameTime
  }
}

store.onStoreChange(storeChangeCallback)
store.onVolumeChange(volumeChangeCallback)

module.exports = {
  onNewGameEvent,
  checkForGameRunning,
  isGameRunning,
  playTestSound
}

