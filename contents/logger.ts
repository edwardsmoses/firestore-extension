import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://console.firebase.google.com/*"]
}

// window.addEventListener("load", () => {
//   console.log(
//     "You may find that having is not so pleasing a thing as wanting. This is not logical, but it is often trddfue."
//   )
// })

//  QUOTE 

// Array of quotes
const quotes = [
  "The best way to predict the future is to invent it. - Alan Kay",
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
  "You miss 100% of the shots you don't take. - Wayne Gretzky",
];

// Select each random quote from the array
const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
const iconSymbol = '• '; 

const quoteStyle = "color:  #C8A2C8; font-size: 16px; font-family: Inter; font-weight: bold; margin-left: 10px;";
const iconStyle = "color: #C8A2C8; font-size: 22px;";

// Display each of the random quote in the console
console.log(`${iconSymbol} An error occurred` , + iconSymbol + randomQuote, quoteStyle , iconStyle);
// console.log(`${iconSymbol}` + randomQuote)

// STYLE CONSOLE 

// Customizing console log symbols
const errorSymbol = '\u2717'; // '✗'
const warningSymbol = '\u26A0'; // '⚠'
const infoSymbol = '\u2139'; // 'ℹ'

console.log(`${errorSymbol} An error occurred`);
console.warn(`${warningSymbol} Warning: Data validation failed`);
console.info(`${infoSymbol} Information: User logged in`);

// console.log('\x1b[31m%s\x1b[0m', randomQuote);
console.log('\x1b[42m%s\x1b[0m', 'This has a green background');
console.log('\x1b[1m%s\x1b[0m', 'This is bold text');
console.log('\x1b[0m%s', 'This resets the styling');