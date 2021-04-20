"use strict";

import { FRENCH_STOP_WORDS } from "./stopWords.js";

const STOP_WORDS = [];

for (let word of FRENCH_STOP_WORDS) {
  STOP_WORDS.push(keepOnlyLettersAndRemoveAccents(word));
}

/**
 * @param {Array.string} words
 * @returns {Array.string}
 */
function trimWords(words) {
  const trimmeddWords = [];

  for (let word of words) {
    trimmeddWords.push(word.trim());
  }

  return trimmeddWords;
}

/**
 * @param {string} str
 * @returns {string}
 */
export function capitalizeFirstChar(str) {
  return str[0].toUpperCase() + str.slice(1);
}

/**
 * @param {string} string
 * @returns {string}
 */
export function keepOnlyLettersAndRemoveAccents(string) {
  return string
    .toLowerCase()
    .replace(/[.,;:!\?\*"()°]/g,"")
    .replace(/[']/g, " ")
    .replace(/[\d]/g, "")
    .replace(/[àäâ]/g, "a")
    .replace(/[ç]/g, "c")
    .replace(/[éèêë]/g, "e")
    .replace(/[îï]/g, "i")
    .replace(/[ôö]/g, "o")
    .replace(/[ùûû]/g, "u");
}

/**
 * Trim and remove accentued characters in all words, then remove non significant words (stop words).
 * @param {Array.string} words
 * @returns {Array.string}
 */
export function removeStopWords(words) {
  const trimmedWords = trimWords(words);
  const filteredWords = [];

  for (let word of trimmedWords) {
    let wordWithoutAccent = keepOnlyLettersAndRemoveAccents(word);

    if (word.length > 1 && !STOP_WORDS.includes(wordWithoutAccent)) {
      filteredWords.push(word);
    }
  }

  return filteredWords;
}

/**
 * Sorting method adapted to accentued french words.
 * @param {Array.string} strings
 * @returns {Array.string}
 */
export function sortAlphabetically(strings) {
  const nonAccentuatedStrings = [];

  for (let str of strings) {
    let nonAccentuatedStr = keepOnlyLettersAndRemoveAccents(str);

    nonAccentuatedStrings.push([str, nonAccentuatedStr]);
  }

  nonAccentuatedStrings.sort((arr1, arr2) => {
    if (arr1[1] > arr2[1]) return 1;
    if (arr1[1] < arr2[1]) return -1;
    return 0;
  });

  const sortedStrings = [];

  for (let arr of nonAccentuatedStrings) {
    sortedStrings.push(arr[0]);
  }

  return sortedStrings;
}
