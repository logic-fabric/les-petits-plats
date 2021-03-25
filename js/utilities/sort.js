"use strict";

export function sortAlphabetically(strings) {
  const asciiConverter = [];

  for (let str of strings) {
    let convertedStr = str
      .toLowerCase()
      .replace(/[àä]/g, "a")
      .replace(/[éèêë]/g, "e")
      .replace(/[îï]/g, "i")
      .replace(/[ôö]/g, "o")
      .replace(/[ùûû]/g, "u");
    asciiConverter.push([str, convertedStr]);
  }

  asciiConverter.sort((asso1, asso2) => {
    if (asso1[1] > asso2[1]) return 1;
    if (asso1[1] < asso2[1]) return -1;
    return 0;
  });

  const sortedStrings = [];

  for (let asso of asciiConverter) {
    sortedStrings.push(asso[0]);
  }

  return sortedStrings;
}
