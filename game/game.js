const sound = require("sound-play");
const path = require("path");

let BUY_WARDS_LAST_CALL = 0
let LAST_GAME_TIME = 0
const remindersConfig = {
}

const checkForStack = (gameTime) => {
  // console.log("checkForStack called", { stack:remindersConfig.stack, gameTime})
  const stackTime = 60
  const stackAlertTime = stackTime - remindersConfig['stack'].delay

  if ((gameTime-stackAlertTime)%stackTime === 0) {
    console.log("Inside the if checkStack", { gameTime, stackAlertTime})
    const filePath = path.join(__dirname, "../sound/stack.mp3");
    sound.play(filePath);
  }
} 

const checkForMidRunes = (gameTime) => {
  const midRunesTime = 120;
  const midRunesAlertTime = midRunesTime - remindersConfig['midrunes'].delay

  if ((gameTime-midRunesAlertTime)%midRunesTime === 0) {
    console.log("Inside the sound midrunes", {gameTime, midRunesAlertTime})
    const filePath = path.join(__dirname, "../sound/mid-rune.mp3");
    sound.play(filePath);
  }
}

const checkForBountyRunes = (gameTime) => {
  const bountyRunesTime = 180;
  const bountyRunesAlertTime = bountyRunesTime - remindersConfig['bountyrunes'].delay

  if ((gameTime-bountyRunesAlertTime)%bountyRunesTime === 0) {
    console.log("Inside the sound bounty runes", {gameTime, bountyRunesAlertTime})
    const filePath = path.join(__dirname, "../sound/bounty-runes.mp3");
    sound.play(filePath);
  }
}

const checkNeutralItems = (gameTime) => {
  const neutralItemsTime = [420, 1020, 1620, 2200, 3600]

  for (let i = 0; i < neutralItemsTime.length; i++) {
    if (gameTime === neutralItemsTime[i]) {
      const filePath = path.join(__dirname, `../sound/neutralTier${i+1}.mp3`);
      sound.play(filePath);
    }
  }
}

const checkForSmoke = (gameTime) => {
  const smokeTime = 420
  const smokeAlertTime = smokeTime - remindersConfig['smoke'].delay

  if((gameTime-smokeAlertTime)%smokeTime === 0) {
    const filePath = path.join(__dirname, "../sound/smoke.mp3");
    sound.play(filePath);
  }

}

const checkForWards = (gameTime, wardCd) => {
  if (BUY_WARDS_LAST_CALL > gameTime) BUY_WARDS_LAST_CALL = 0
  const timeBetweenCalls = 30

  if (wardCd === 0 && (BUY_WARDS_LAST_CALL+timeBetweenCalls) <= gameTime) {
    const filePath = path.join(__dirname, "../sound/wards.mp3");
    sound.play(filePath);
    BUY_WARDS_LAST_CALL = gameTime
  }
  
}

const onNewGameEvent= async (gameEvent) => {
  if (gameEvent.map && gameEvent.map.game_state === 'DOTA_GAMERULES_STATE_GAME_IN_PROGRESS') {
    const gameTime = gameEvent.map.clock_time
    const wardsPurchaseCd = gameEvent.map.ward_purchase_cooldown
    if (LAST_GAME_TIME === gameTime) return
    if (LAST_GAME_TIME > gameTime) LAST_GAME_TIME = 0

    if (remindersConfig.stack && remindersConfig.stack.active) {
      checkForStack(gameTime)
    }
    if(remindersConfig.midrunes && remindersConfig.midrunes.active) {
      checkForMidRunes(gameTime)
    }
    if(remindersConfig.bountyrunes && remindersConfig.bountyrunes.active) {
      checkForBountyRunes(gameTime)
    }
    if (remindersConfig.neutral && remindersConfig.neutral.active) {
      checkNeutralItems(gameTime)
    }
    if (remindersConfig.smoke && remindersConfig.smoke.active) {
      checkForSmoke(gameTime)
    }
    if (remindersConfig.ward && remindersConfig.ward.active) {
      checkForWards(gameTime, wardsPurchaseCd)
    }

    LAST_GAME_TIME = gameTime
  }
}

const handleReminderConfig = (event, newReminderConfig) => {
  remindersConfig[newReminderConfig.name] = {...remindersConfig[newReminderConfig.name], ...newReminderConfig.values }
}

module.exports = {
  onNewGameEvent,
  handleReminderConfig
}

