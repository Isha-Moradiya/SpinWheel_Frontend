// Sound effects management using Web Audio API

class SoundManager {
  private audioContext: AudioContext | null = null
  // Oscillator/gain nodes are created per sound event; no persistent fields needed

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return this.audioContext
  }

  playSpinStart(): void {
    try {
      const ctx = this.getAudioContext()
      const now = ctx.currentTime

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.frequency.setValueAtTime(400, now)
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.2)

      gain.gain.setValueAtTime(0.3, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)

      osc.start(now)
      osc.stop(now + 0.2)
    } catch (e) {
      console.log("[v0] Sound playback not available")
    }
  }

  playWin(): void {
    try {
      const ctx = this.getAudioContext()
      const now = ctx.currentTime

      const frequencies = [523.25, 659.25, 783.99] // C, E, G

      frequencies.forEach((freq, index) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.frequency.setValueAtTime(freq, now + index * 0.1)
        gain.gain.setValueAtTime(0.2, now + index * 0.1)
        gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.1 + 0.3)

        osc.start(now + index * 0.1)
        osc.stop(now + index * 0.1 + 0.3)
      })
    } catch (e) {
      console.log("[v0] Sound playback not available")
    }
  }

  playClick(): void {
    try {
      const ctx = this.getAudioContext()
      const now = ctx.currentTime

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.frequency.setValueAtTime(800, now)
      gain.gain.setValueAtTime(0.1, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05)

      osc.start(now)
      osc.stop(now + 0.05)
    } catch (e) {
      console.log("[v0] Sound playback not available")
    }
  }
}

export const soundManager = new SoundManager()
