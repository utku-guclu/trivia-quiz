export const shuffleNumbers = (amount) => {
  const randomNumbers = [];
  while (randomNumbers.length < amount) {
    const randomNum = Math.floor(Math.random() * amount) + 1;
    if (!randomNumbers.includes(randomNum)) {
      randomNumbers.push(randomNum);
    }
  }
  return randomNumbers;
};
