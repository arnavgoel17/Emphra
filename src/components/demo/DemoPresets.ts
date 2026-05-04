import { Message } from "@/types";

export interface PresetScenario {
  name: string;
  description: string;
  messages: Message[];
}

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    name: "Normal Friendly Chat",
    description: "A typical helpful conversation between users.",
    messages: [
      { id: "p1-1", text: "Hey! Can you help me with the documentation?", sender: "User A", timestamp: new Date() },
      { id: "p1-2", text: "Sure! What specifically do you need?", sender: "User B", timestamp: new Date() },
      { id: "p1-3", text: "I'm looking for the API authentication section.", sender: "User A", timestamp: new Date() }
    ]
  },
  {
    name: "Toxic Conflict",
    description: "A conversation that escalates into harassment.",
    messages: [
      { id: "p2-1", text: "I don't think your idea will work.", sender: "User A", timestamp: new Date() },
      { id: "p2-2", text: "Well, your ideas are always trash anyway.", sender: "User B", timestamp: new Date() },
      { id: "p2-3", text: "You are such an idiot, stop talking to me!", sender: "User A", timestamp: new Date() }
    ]
  },
  {
    name: "Scam Attempt",
    description: "A user attempting to steal sensitive information.",
    messages: [
      { id: "p3-1", text: "Hello, I am from the security team.", sender: "User B", timestamp: new Date() },
      { id: "p3-2", text: "We noticed a suspicious login on your account.", sender: "User B", timestamp: new Date() },
      { id: "p3-3", text: "Please send your bank password and security code to verify.", sender: "User B", timestamp: new Date() }
    ]
  },
  {
    name: "Spam Bot",
    description: "A bot flooding the chat with promotional content.",
    messages: [
      { id: "p4-1", text: "CONGRATULATIONS! You are our lucky winner!", sender: "User B", timestamp: new Date() },
      { id: "p4-2", text: "Claim your free money and prize now at www.scam-link.com!", sender: "User B", timestamp: new Date() },
      { id: "p4-3", text: "Limited time offer! Unilimited crypto investment returns!", sender: "User B", timestamp: new Date() }
    ]
  }
];

export const TOXIC_EXAMPLES = [
  "You're an absolute idiot for thinking that.",
  "I hate everything about this platform, it's trash.",
  "If you don't shut up, I'll find where you live and kill you.",
  "Stop being so stupid, nobody cares about your opinion.",
  "You're a total loser, just leave already."
];

export const SCAM_EXAMPLES = [
  "I need your bank account details to process the refund.",
  "Please provide your security code to confirm your identity.",
  "Your account will be locked unless you send your password immediately.",
  "We found an error in your payment. Please send OTP to 555-1234.",
  "Verify your crypto wallet by entering your 12-word seed phrase here."
];
