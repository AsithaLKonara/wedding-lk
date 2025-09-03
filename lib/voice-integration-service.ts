import { connectDB } from './db'

interface VoiceCommand {
  type: 'search' | 'booking' | 'navigation' | 'information' | 'action'
  command: string
  confidence: number
  parameters: Record<string, any>
}

interface VoiceResponse {
  text: string
  audio?: Buffer
  actions: Array<{
    type: string
    data: any
  }>
}

interface VoiceSession {
  sessionId: string
  userId: string
  startTime: Date
  commands: VoiceCommand[]
  context: Record<string, any>
}

class VoiceIntegrationService {
  private sessions: Map<string, VoiceSession> = new Map()
  private supportedLanguages = ['en', 'si', 'ta']
  private voiceCommands: Map<string, any> = new Map()

  constructor() {
    this.initializeVoiceCommands()
  }

  private initializeVoiceCommands() {
    // Initialize voice command patterns
    this.voiceCommands.set('search_venue', {
      patterns: [
        'find venue',
        'search for venue',
        'show me venues',
        'venue search',
        'find wedding venue'
      ],
      parameters: ['location', 'capacity', 'budget', 'style']
    })

    this.voiceCommands.set('search_vendor', {
      patterns: [
        'find vendor',
        'search for vendor',
        'show me vendors',
        'vendor search',
        'find photographer',
        'find caterer'
      ],
      parameters: ['category', 'location', 'budget', 'date']
    })

    this.voiceCommands.set('book_venue', {
      patterns: [
        'book venue',
        'reserve venue',
        'book this venue',
        'make booking',
        'reserve this place'
      ],
      parameters: ['venueId', 'date', 'guestCount']
    })

    this.voiceCommands.set('check_booking', {
      patterns: [
        'check booking',
        'show my booking',
        'booking status',
        'my reservation',
        'booking details'
      ],
      parameters: ['bookingId']
    })

    this.voiceCommands.set('budget_info', {
      patterns: [
        'budget information',
        'cost details',
        'pricing information',
        'how much does it cost',
        'price range'
      ],
      parameters: ['service', 'location']
    })

    this.voiceCommands.set('timeline_info', {
      patterns: [
        'wedding timeline',
        'planning timeline',
        'what should I do next',
        'next steps',
        'planning checklist'
      ],
      parameters: ['weddingDate']
    })
  }

  // Process voice input and convert to text
  async processVoiceInput(audioBuffer: Buffer, language: string = 'en'): Promise<string> {
    try {
      console.log('🎤 Processing voice input...')
      
      // In a real implementation, this would use speech-to-text API
      // For now, we'll simulate voice processing
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock transcription (in real implementation, this would come from speech-to-text API)
      const mockTranscriptions = [
        'Find me a venue in Colombo for 200 guests',
        'Show me photographers in my area',
        'What is my current budget status?',
        'Book this venue for next month',
        'Check my booking status',
        'What should I do next in my wedding planning?'
      ]
      
      const transcription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)]
      
      console.log('✅ Voice input processed:', transcription)
      return transcription

    } catch (error) {
      console.error('❌ Voice processing error:', error)
      return ''
    }
  }

  // Parse voice command and extract intent
  async parseVoiceCommand(text: string, sessionId: string): Promise<VoiceCommand | null> {
    try {
      const session = this.sessions.get(sessionId)
      const lowerText = text.toLowerCase()
      
      // Match command patterns
      for (const [commandType, commandData] of this.voiceCommands.entries()) {
        for (const pattern of commandData.patterns) {
          if (lowerText.includes(pattern.toLowerCase())) {
            const parameters = this.extractParameters(text, commandData.parameters)
            
            return {
              type: this.getCommandType(commandType),
              command: commandType,
              confidence: 0.85 + Math.random() * 0.1,
              parameters
            }
          }
        }
      }

      // Default to search if no specific command is found
      if (lowerText.includes('find') || lowerText.includes('search') || lowerText.includes('show')) {
        return {
          type: 'search',
          command: 'general_search',
          confidence: 0.7,
          parameters: { query: text }
        }
      }

      return null

    } catch (error) {
      console.error('Voice command parsing error:', error)
      return null
    }
  }

  private getCommandType(command: string): VoiceCommand['type'] {
    if (command.includes('search')) return 'search'
    if (command.includes('book')) return 'booking'
    if (command.includes('check') || command.includes('status')) return 'information'
    if (command.includes('navigate') || command.includes('go')) return 'navigation'
    return 'action'
  }

  private extractParameters(text: string, expectedParams: string[]): Record<string, any> {
    const parameters: Record<string, any> = {}
    
    // Extract location
    if (text.toLowerCase().includes('colombo')) {
      parameters.location = 'Colombo'
    } else if (text.toLowerCase().includes('kandy')) {
      parameters.location = 'Kandy'
    } else if (text.toLowerCase().includes('galle')) {
      parameters.location = 'Galle'
    }

    // Extract numbers (capacity, budget, etc.)
    const numbers = text.match(/\d+/g)
    if (numbers) {
      if (text.toLowerCase().includes('guest')) {
        parameters.guestCount = parseInt(numbers[0])
      } else if (text.toLowerCase().includes('budget') || text.toLowerCase().includes('cost')) {
        parameters.budget = parseInt(numbers[0]) * 1000 // Assume thousands
      }
    }

    // Extract categories
    if (text.toLowerCase().includes('photographer')) {
      parameters.category = 'photography'
    } else if (text.toLowerCase().includes('caterer') || text.toLowerCase().includes('food')) {
      parameters.category = 'catering'
    } else if (text.toLowerCase().includes('decorator') || text.toLowerCase().includes('decoration')) {
      parameters.category = 'decoration'
    }

    return parameters
  }

  // Generate voice response
  async generateVoiceResponse(command: VoiceCommand, context: any = {}): Promise<VoiceResponse> {
    try {
      let responseText = ''
      const actions: Array<{ type: string; data: any }> = []

      switch (command.command) {
        case 'search_venue':
          responseText = `I found several venues in ${command.parameters.location || 'your area'}. Here are the top recommendations: Grand Ballroom Hotel, Garden Palace, and Ocean View Resort. Would you like me to show you more details about any of these venues?`
          actions.push({
            type: 'search_venues',
            data: command.parameters
          })
          break

        case 'search_vendor':
          responseText = `I found ${command.parameters.category || 'several'} vendors in your area. Here are the top recommendations: Perfect Moments Photography, Sweet Dreams Catering, and Elegant Decorators. Would you like me to show you their portfolios?`
          actions.push({
            type: 'search_vendors',
            data: command.parameters
          })
          break

        case 'book_venue':
          responseText = `I'll help you book the venue. Please confirm the details: Date: ${command.parameters.date || 'to be selected'}, Guest count: ${command.parameters.guestCount || 'to be specified'}. Should I proceed with the booking?`
          actions.push({
            type: 'book_venue',
            data: command.parameters
          })
          break

        case 'check_booking':
          responseText = `Let me check your booking status. You have a confirmed booking at Grand Ballroom Hotel for December 15th, 2024, with 200 guests. The total amount is LKR 500,000. Would you like me to show you more details?`
          actions.push({
            type: 'get_booking_status',
            data: { bookingId: command.parameters.bookingId }
          })
          break

        case 'budget_info':
          responseText = `Based on your current budget, you have LKR 300,000 remaining. The average cost for ${command.parameters.service || 'wedding services'} in ${command.parameters.location || 'your area'} is LKR 50,000. Would you like me to show you budget optimization suggestions?`
          actions.push({
            type: 'get_budget_info',
            data: command.parameters
          })
          break

        case 'timeline_info':
          responseText = `Here's your wedding planning timeline: You should book your venue within the next 2 weeks, secure vendors within 6 weeks, and send invitations within 8 weeks. Your next priority is to finalize the guest list. Would you like me to create a detailed timeline for you?`
          actions.push({
            type: 'get_timeline',
            data: { weddingDate: command.parameters.weddingDate }
          })
          break

        default:
          responseText = `I understand you're looking for ${command.parameters.query || 'information'}. Let me search for that for you. Here are some relevant results.`
          actions.push({
            type: 'general_search',
            data: { query: command.parameters.query }
          })
      }

      return {
        text: responseText,
        actions
      }

    } catch (error) {
      console.error('Voice response generation error:', error)
      return {
        text: 'I apologize, but I encountered an error processing your request. Please try again.',
        actions: []
      }
    }
  }

  // Convert text to speech
  async textToSpeech(text: string, language: string = 'en', voice: string = 'default'): Promise<Buffer> {
    try {
      console.log('🔊 Converting text to speech:', text.substring(0, 50) + '...')
      
      // In a real implementation, this would use text-to-speech API
      // For now, we'll simulate TTS processing
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock audio buffer (in real implementation, this would be actual audio data)
      const mockAudioBuffer = Buffer.from('mock_audio_data_' + Date.now())
      
      console.log('✅ Text converted to speech successfully')
      return mockAudioBuffer

    } catch (error) {
      console.error('❌ Text-to-speech error:', error)
      return Buffer.from('')
    }
  }

  // Start voice session
  async startVoiceSession(userId: string): Promise<string> {
    try {
      const sessionId = `voice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const session: VoiceSession = {
        sessionId,
        userId,
        startTime: new Date(),
        commands: [],
        context: {}
      }
      
      this.sessions.set(sessionId, session)
      
      console.log('🎤 Voice session started:', sessionId)
      return sessionId

    } catch (error) {
      console.error('Voice session start error:', error)
      return ''
    }
  }

  // Process voice interaction
  async processVoiceInteraction(sessionId: string, audioBuffer: Buffer, language: string = 'en'): Promise<VoiceResponse> {
    try {
      const session = this.sessions.get(sessionId)
      if (!session) {
        throw new Error('Voice session not found')
      }

      // Process voice input
      const transcription = await this.processVoiceInput(audioBuffer, language)
      if (!transcription) {
        return {
          text: 'I could not understand your voice input. Please try again.',
          actions: []
        }
      }

      // Parse command
      const command = await this.parseVoiceCommand(transcription, sessionId)
      if (!command) {
        return {
          text: 'I could not understand your request. Please try rephrasing it.',
          actions: []
        }
      }

      // Add command to session
      session.commands.push(command)

      // Generate response
      const response = await this.generateVoiceResponse(command, session.context)

      // Update session context
      session.context.lastCommand = command
      session.context.lastResponse = response

      return response

    } catch (error) {
      console.error('Voice interaction error:', error)
      return {
        text: 'I encountered an error processing your voice request. Please try again.',
        actions: []
      }
    }
  }

  // Get voice session history
  async getVoiceSessionHistory(sessionId: string): Promise<VoiceSession | null> {
    try {
      return this.sessions.get(sessionId) || null
    } catch (error) {
      console.error('Voice session history error:', error)
      return null
    }
  }

  // End voice session
  async endVoiceSession(sessionId: string): Promise<boolean> {
    try {
      const session = this.sessions.get(sessionId)
      if (session) {
        this.sessions.delete(sessionId)
        console.log('🎤 Voice session ended:', sessionId)
        return true
      }
      return false
    } catch (error) {
      console.error('Voice session end error:', error)
      return false
    }
  }

  // Get supported languages
  getSupportedLanguages(): string[] {
    return this.supportedLanguages
  }

  // Get available voice commands
  getAvailableVoiceCommands(): Record<string, any> {
    const commands: Record<string, any> = {}
    
    for (const [commandType, commandData] of this.voiceCommands.entries()) {
      commands[commandType] = {
        patterns: commandData.patterns,
        parameters: commandData.parameters,
        description: this.getCommandDescription(commandType)
      }
    }
    
    return commands
  }

  private getCommandDescription(commandType: string): string {
    const descriptions: Record<string, string> = {
      search_venue: 'Search for wedding venues based on location, capacity, and budget',
      search_vendor: 'Search for wedding vendors like photographers, caterers, and decorators',
      book_venue: 'Book a venue for your wedding',
      check_booking: 'Check the status of your current bookings',
      budget_info: 'Get information about wedding costs and budget management',
      timeline_info: 'Get wedding planning timeline and next steps'
    }
    
    return descriptions[commandType] || 'General voice command'
  }

  // Test voice integration service
  async testVoiceIntegration(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {}

    try {
      // Test voice input processing
      const mockAudio = Buffer.from('mock_audio')
      const transcription = await this.processVoiceInput(mockAudio)
      results.voiceProcessing = transcription.length > 0

      // Test voice session
      const sessionId = await this.startVoiceSession('test-user')
      results.voiceSession = sessionId.length > 0

      // Test command parsing
      const command = await this.parseVoiceCommand('Find me a venue in Colombo', sessionId)
      results.commandParsing = command !== null

      // Test response generation
      if (command) {
        const response = await this.generateVoiceResponse(command)
        results.responseGeneration = response.text.length > 0
      }

      // Test text-to-speech
      const audioBuffer = await this.textToSpeech('Hello, this is a test.')
      results.textToSpeech = audioBuffer.length > 0

      // Test session history
      const history = await this.getVoiceSessionHistory(sessionId)
      results.sessionHistory = history !== null

      // Test session ending
      const sessionEnded = await this.endVoiceSession(sessionId)
      results.sessionEnding = sessionEnded

    } catch (error) {
      console.error('Voice integration test error:', error)
    }

    return results
  }
}

export default new VoiceIntegrationService() 