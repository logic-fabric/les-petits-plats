"use strict";

import { FRENCH_STOP_WORDS } from "./stopWords.js";

const STOP_WORDS = [];

for (let word of FRENCH_STOP_WORDS) {
  STOP_WORDS.push(removeAccents(word));
}

function trimWords(words) {
  const trimmeddWords = [];

  for (let word of words) {
    trimmeddWords.push(word.trim());
  }

  return trimmeddWords;
}

export function capitalizeFirstChar(str) {
  return str[0].toUpperCase() + str.slice(1);
}

export function removeAccents(string) {
  return string
    .toLowerCase()
    .replace(/[àä]/g, "a")
    .replace(/[ç]/g, "c")
    .replace(/[éèêë]/g, "e")
    .replace(/[îï]/g, "i")
    .replace(/[ôö]/g, "o")
    .replace(/[ùûû]/g, "u");
}

export function removeStopWords(words) {
  const trimmedWords = trimWords(words);
  const filteredWords = [];

  for (let word of trimmedWords) {
    let wordWithoutAccent = removeAccents(word);

    if (word.length > 1 && !STOP_WORDS.includes(wordWithoutAccent)) {
      filteredWords.push(word);
    }
  }

  return filteredWords;
}
