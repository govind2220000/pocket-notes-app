export default function getFirstLetters(str) {
  const words = str.split(" ");

  if (words.length > 1) {
    const firstLetters = words[0][0] + words[1][0];
    return firstLetters;
  } else {
    return words[0][0].toUpperCase();
  }
}
