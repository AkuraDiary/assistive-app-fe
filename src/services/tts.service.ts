export interface TTSOptions {
  text: string
  lang?: string
  rate?: number
  pitch?: number
  delayMs?: number
}

interface TTSEngine {
  speak(options: TTSOptions): Promise<void>
  cancel(): void
}

class BrowserTTSEngine implements TTSEngine {
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

class ExternalTTSEngine implements TTSEngine {
  private apiUrl: string
  private currentAudio: HTMLAudioElement | null = null

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl
  }

  private base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type: mimeType })
  }

  async speak(options: TTSOptions): Promise<void> {
    const { text, delayMs = 0 } = options

    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }

    try {
      this.cancel() // Stop any ongoing playback

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      })

      const data = await response.json()
      const base64Audio = data.audioContent || data.data?.audioContent || data.audio // handling typical response shapes just in case
      if (!base64Audio) throw new Error("API tidak mengembalikan audioContent.")
      
      const blob = this.base64ToBlob(base64Audio, 'audio/mpeg')
      const audioUrl = URL.createObjectURL(blob)

      this.currentAudio = new Audio(audioUrl)

      return new Promise((resolve) => {
        if (!this.currentAudio) return resolve()
        this.currentAudio.onended = () => resolve()
        this.currentAudio.onerror = () => resolve()
        this.currentAudio.play().catch(e => {
          console.error("Failed to play audio:", e)
          resolve()
        })
      })
    } catch (error) {
      console.error("Gagal saat memanggil API TTS:", error)
      // Resolve silently to not block UI
      return Promise.resolve()
    }
  }

  cancel() {
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.currentAudio.currentTime = 0
      this.currentAudio = null
    }
  }
}

class TTSService {
  private engine: TTSEngine

  constructor() {
    const externalApiUrl = import.meta.env.VITE_TTS_API_URL
    if (externalApiUrl) {
      this.engine = new ExternalTTSEngine(externalApiUrl)
    } else {
      this.engine = new BrowserTTSEngine()
    }
  }

  async speak(options: TTSOptions): Promise<void> {
    return this.engine.speak(options)
  }

  cancel() {
    this.engine.cancel()
  }
}

export const ttsService = new TTSService()
