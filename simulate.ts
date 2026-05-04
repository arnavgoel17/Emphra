import { moderateContent, buildApiResponse } from './src/lib/mock-api';
import { Message } from './src/types';

const testInputs = [
  "Hello, how are you?",
  "This is a great platform!",
  "You are an idiot.", // Should trigger moderation
  "Send me your bank details", // Should trigger moderation
  "What is the weather like?"
];

const mockSettings = {
  strictness: 50,
  toxicityDetection: true
};

console.log("Starting Emphra Simulation...");

testInputs.forEach((input, index) => {
  console.log(`\n--- Test Case ${index + 1}: "${input}" ---`);
  
  // Moderate the message
  const modResult = moderateContent(input, mockSettings.strictness);
  console.log(`Action: ${modResult.action.toUpperCase()}`);
  console.log(`Toxicity Score: ${modResult.toxicity}%`);
  
  // Build a dummy conversation for API simulation
  const dummyMessages: Message[] = [{
    id: "1",
    text: input,
    sender: "User A",
    isUser: true,
    timestamp: new Date()
  }];
  
  const apiResponse = buildApiResponse(dummyMessages, mockSettings);
  console.log(`API Action: ${apiResponse.action}`);
  console.log(`Sentiment: ${apiResponse.sentiment.label}`);
  
  if (apiResponse.action !== "allow") {
    console.log(`Suggestion: ${apiResponse.suggestion}`);
  }
});

console.log("\nSimulation Complete.");
