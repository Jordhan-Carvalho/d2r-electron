const sound = require("sound-play");

const remindersConfig = {
}

const checkForStack = (gameTime) => {
  console.log("checkForStack called", remindersConfig.stack)
  const stackTime = 60
  const stackAlertTime = stackTime - remindersConfig['stack'].delay

  if ((gameTime-stackAlertTime)%stackTime === 0) {
    console.log("Inside the if checkStack", { stackAlertTime, stackTime})
    sound.play("../sound/stack.mp3");
  }
} 

const checkForMidRunes = (gameTime) => {
  console.log("checkMidRunes called")
  const midRunesTime = 120;
  const midRunesAlertTime = midRunesTime - remindersConfig['midrunes'].delay

  if ((gameTime-midRunesAlertTime)%midRunesTime === 0) {
    console.log("Inside the sound midrunes", {midRunesTime, midRunesAlertTime})
    sound.play("../sound/mid-rune.mp3");
  }
}

const checkForBountyRunes = (gameTime) => {
  console.log("checkBountyRunes called")
  const bountyRunesTime = 180;
  const bountyRunesAlertTime = bountyRunesTime - remindersConfig['bountyrunes'].delay

  if ((gameTime-bountyRunesAlertTime)%bountyRunesTime === 0) {
    console.log("Inside the sound bounty runes", {bountyRunesTime, bountyRunesAlertTime})
    sound.play("../sound/bounty-runes.mp3");
  }
}

const checkNeutralItems = (gameTime) => {
  const neutralItemsTime = [420, 1020, 1620, 2200, 3600]

  for (let i = 0; i < neutralItemsTime.length; i++) {
    if (gameTime === neutralItemsTime[i]) {
      sound.play(`../sound/neutralTier${i+1}.mp3`);
    }
  }
}

const checkForSmoke = (gameTime) => {
  const smokeTime = 420
  const smokeAlertTime = smokeTime - remindersConfig['smoke'].delay

  if((gameTime-smokeAlertTime)%smokeTime === 0) {
    sound.play("../sound/smoke.mp3");
  }

}

const onNewGameEvent= (gameEvent) => {
  console.log("ReminderConfig object", remindersConfig)
  if (gameEvent.map.game_state === 'DOTA_GAMERULES_STATE_GAME_IN_PROGRESS') {
    const gameTime = gameEvent.map.game_time
    if (remindersConfig.stack.active) {
      checkForStack(gameTime)
    }
    if(remindersConfig.midrunes.active) {
      checkForMidRunes(gameTime)
    }
    if(remindersConfig.bountyrunes.active) {
      checkForBountyRunes(gameTime)
    }
    if (remindersConfig.neutral.active) {
      checkNeutralItems(gameTime)
    }
    if (remindersConfig.smoke.active) {
      checkForSmoke(gameTime)
    }
  }
}

const handleReminderConfig = (event, newReminderConfig) => {
  remindersConfig[newReminderConfig.name] = {...remindersConfig[newReminderConfig.name], ...newReminderConfig.values }
  console.log("handleConfig chamado", { newReminderConfig, remindersConfig })
}

module.exports = {
  onNewGameEvent,
  handleReminderConfig
}

