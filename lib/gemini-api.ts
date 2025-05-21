// Gemini API integration

const GEMINI_API_KEY = 'AIzaSyAPVFwpLgBmwGppUB8qFbPK8GbbCn8ns2o';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
    finishReason: string;
  }[];
}

/**
 * Sends a message to the Gemini API and returns the response
 */
export async function sendMessageToGemini(messages: ChatMessage[]): Promise<string> {
  try {
    // Format messages for Gemini API
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    // Prepare the request body
    const requestBody = {
      contents: formattedMessages,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000,
      }
    };

    // Make the API request
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json() as GeminiResponse;
    
    // Extract the response text
    if (data.candidates && data.candidates.length > 0) {
      const textParts = data.candidates[0].content.parts;
      return textParts.map(part => part.text).join('');
    }
    
    throw new Error('No response from Gemini API');
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return 'Sorry, I encountered an error. Please try again later.';
  }
}
