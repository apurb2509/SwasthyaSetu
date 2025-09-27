// A more robust, self-contained Hinglish to Devanagari transliteration service.

const mapping: { [key: string]: string } = {
  'ch': 'च', 'chh': 'छ', 'kh': 'ख', 'gh': 'घ', 'jh': 'झ', 'th': 'ठ', 'dh': 'ढ', 'ph': 'फ', 'bh': 'भ', 'sh': 'श', 'gy': 'ज्ञ', 'tr': 'त्र',
  'aa': 'आ', 'ee': 'ई', 'oo': 'ऊ', 'ai': 'ऐ', 'au': 'औ',
  'a': 'अ', 'i': 'इ', 'u': 'उ', 'e': 'ए', 'o': 'ओ',
  'k': 'क', 'g': 'ग', 'j': 'ज', 't': 'ट', 'd': 'ड', 'n': 'न',
  'p': 'प', 'b': 'ब', 'm': 'म', 'y': 'य', 'r': 'र', 'l': 'ल', 'v': 'व', 'w': 'व', 's': 'स', 'h': 'ह',
  '.': '।', ' ': ' ',
};

const words: { [key: string]: string } = {
  'kaise': 'कैसे', 'kya': 'क्या', 'hai': 'है', 'hain': 'हैं', 'hota': 'होता',
  'mein': 'में', 'ke': 'के', 'ki': 'की', 'is': 'इस', 'ko': 'को', 'se': 'से',
  'aur': 'और', 'batao': 'बताओ', 'steps': 'स्टेप्स', 'natural': 'नेचुरल', 'hey': 'हे',
  'dengue': 'डेंगू', 'lakshan': 'लक्षण', 'theek': 'ठीक'
};

/**
* Processes an incoming message, transliterating it from Hinglish to Hindi if necessary.
* @param message The incoming SMS message body.
* @returns The message in Hindi (Devanagari) script.
*/
export function processIncomingMessage(message: string): string {
const isLatinScript = /[a-zA-Z]/.test(message);

if (!isLatinScript) {
  console.log('Detected Devanagari script. No transliteration needed.');
  return message;
}

console.log('Detected Latin script (Hinglish). Transliterating to Hindi...');
let lowerCaseMessage = message.toLowerCase();

// First, replace whole words
for (const word in words) {
  const regex = new RegExp(`\\b${word}\\b`, 'g');
  lowerCaseMessage = lowerCaseMessage.replace(regex, words[word]);
}

// Then, transliterate remaining characters
const sortedKeys = Object.keys(mapping).sort((a, b) => b.length - a.length);
let finalMessage = '';
let i = 0;
while (i < lowerCaseMessage.length) {
  let matched = false;
  for (const key of sortedKeys) {
    if (lowerCaseMessage.startsWith(key, i)) {
      finalMessage += mapping[key];
      i += key.length;
      matched = true;
      break;
    }
  }
  if (!matched) {
    finalMessage += lowerCaseMessage[i];
    i += 1;
  }
}

console.log(`Original: "${message}" -> Transliterated: "${finalMessage}"`);

// Safety check to prevent sending garbage to the AI
if (finalMessage.trim().length === 0 || /^[।\s]+$/.test(finalMessage)) {
    console.error("Transliteration resulted in an empty or invalid string.");
    return "Could not understand the message.";
}

return finalMessage;
}