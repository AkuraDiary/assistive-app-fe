export interface TTSOptions {
  text: string
  lang?: string
  rate?: number
  pitch?: number
  delayMs?: number
}

class TTSService {
  private synth = window.speechSynthesis

  async speak(options: TTSOptions): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth) {
        console.warn('SpeechSynthesis API not available')
        resolve()
        return
      }

      const { text, lang = 'id-ID', rate = 1, pitch = 1, delayMs = 0 } = options

      setTimeout(() => {
        // Cancel any ongoing speech
        this.synth.cancel()

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = lang
        utterance.rate = rate
        utterance.pitch = pitch

        utterance.onend = () => {
          resolve()
        }

        utterance.onerror = (e) => {
          console.error('TTS Error:', e)
          resolve() // resolve anyway to avoid hanging promises
        }

        this.synth.speak(utterance)
      }, delayMs)
    })
  }

  cancel() {
    if (this.synth) {
      this.synth.cancel()
    }
  }
}

export const ttsService = new TTSService()
