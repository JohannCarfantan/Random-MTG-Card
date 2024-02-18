// const baseUrl = 'https://www.magic-ville.com/pics/pfou/mkm/'
const baseUrlBig = 'https://www.magic-ville.com/pics/big/mkmFR/'

// const cardPreview = document.getElementById('cardPreview')
const cardBigPreview = document.getElementById('cardBigPreview')

const numberOfCardsInSet = 433
const randomNumberInSet = Math.floor(Math.random() * numberOfCardsInSet) + 1

console.log(`Card: ${randomNumberInSet}`)
// cardPreview.src = baseUrl + randomNumberInSet.toString().padStart(3, '0') + '.jpg'
cardBigPreview.src = baseUrlBig + randomNumberInSet.toString().padStart(3, '0') + '.jpg'