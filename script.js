const cardPreview = document.getElementById('cardPreview')

const baseUrl = 'https://www.magic-ville.com/pics/big/mkmFR/'
const numberOfCardsInSet = 433
const randomNumberInSet = Math.floor(Math.random() * numberOfCardsInSet) + 1

cardPreview.src = baseUrl + randomNumberInSet.toString().padStart(3, '0') + '.jpg'