const { exec } = require('child_process')
const execPromise = require('util').promisify(exec)

class AudioQueue {
  constructor() {
    this.queue = []
    this.isPlaying = false
  }

  async processQueue() {
    if (this.isPlaying || this.queue.length === 0) return
    
    this.isPlaying = true
    const { path, volume } = this.queue.shift()
    
    try {
      await this.playSound(path, volume)
    } catch (err) {
      console.error('Error playing sound:', err)
    }
    
    this.isPlaying = false
    this.processQueue()
  }

  async playSound(path, volume) {
    const volumeAdjustedByOS = process.platform === 'darwin' ? Math.min(2, volume * 2) : volume
    
    const macPlayCommand = (path, volume) => `afplay \"${path}\" -v ${volume}`
    const addPresentationCore = `Add-Type -AssemblyName presentationCore;`
    const createMediaPlayer = `$player = New-Object system.windows.media.mediaplayer;`
    const loadAudioFile = path => `$player.open('${path}');`
    const playAudio = `$player.Play();`
    const stopAudio = `Start-Sleep 1; Start-Sleep -s $player.NaturalDuration.TimeSpan.TotalSeconds;Exit;`
    
    const windowPlayCommand = (path, volume) =>
      `powershell -c ${addPresentationCore} ${createMediaPlayer} ${loadAudioFile(path)} $player.Volume = ${volume}; ${playAudio} ${stopAudio}`
    
    const playCommand = process.platform === 'darwin' 
      ? macPlayCommand(path, volumeAdjustedByOS) 
      : windowPlayCommand(path, volumeAdjustedByOS)
      
    await execPromise(playCommand, { windowsHide: true })
  }
}

const audioQueue = new AudioQueue()

module.exports = {
  play: async (path, volume = 0.5, skipQueue = false) => {
    if (skipQueue) {
      return audioQueue.playSound(path, volume)
    }
    
    audioQueue.queue.push({ path, volume })
    return audioQueue.processQueue()
  }
}
