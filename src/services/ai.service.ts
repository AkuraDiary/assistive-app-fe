export class AIService {
  private apiUrl: string

  constructor() {
    this.apiUrl = import.meta.env.VITE_AI_API_URL || 'https://ai.leksigo.com'
  }

  async processImageToText(base64Content: string, keyAnswer?: string): Promise<string> {
    try {
      const response = await fetch(`${this.apiUrl}/image-processing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: base64Content,
          correct: keyAnswer
        })
      })
      const data = await response.json()
      console.log('OCR Response:', data)
      // Attempt to extract string transcription
      if (typeof data === 'string') return data
      return data.transcription || data.text || data.answer || JSON.stringify(data)
    } catch (error: any) {
      console.error("Error memanggil AI (OCR):", error.message)
      return "Gagal memproses gambar."
    }
  }

  async processAudioToText(base64Content: string, keyAnswer?: string): Promise<string> {
    try {
      const response = await fetch(`${this.apiUrl}/speech-to-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          audio: base64Content,
          correct: keyAnswer
        })
      })
      const data = await response.json()
      console.log('STT Response:', data)
      return data.transcription || data.text || data.answer || ''
    } catch (error: any) {
      console.error("Error memanggil AI (STT):", error.message)
      return "Gagal memproses audio."
    }
  }
}

export const aiService = new AIService()
