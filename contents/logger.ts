import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://console.firebase.google.com/*"]
}


const quotes = [
  "The best way to predict the future is to invent it. - Alan Kay",
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
  "You miss 100% of the shots you don't take. - Wayne Gretzky",
];

// Select a random quote from the array
const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

// Display the random quote in the console
// console.log(randomQuote);


window.addEventListener("load", () => {
  console.log(randomQuote);
})

// console.log(
//   "You may find that having is not so pleasing a thing as wanting. This is not logical, but it is often true."
// )