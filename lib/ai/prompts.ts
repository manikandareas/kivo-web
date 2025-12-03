/**
 * System Prompts Configuration
 * Defines system prompts for AI chat interactions
 */

/**
 * Get the system prompt for chat interactions
 * This prompt sets the AI's behavior and personality
 *
 * @returns The system prompt string
 */
export function getSystemPrompt(): string {
  return `You are a helpful AI assistant for Kivo. 
You provide clear, concise, and accurate responses.
You are friendly and professional in your communication.`;
}
