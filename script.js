const cardPreview = document.getElementById('cardPreview')
const baseUrl = 'https://www.magic-ville.com/pics/big/mkmFR/'

function setRandomCard() {
    const rarity = []
    document.querySelectorAll('input[name=rarity]:checked').forEach(checkbox => {
        rarity.push(checkbox.value)
    })
    let cardsFilteredByRarity = rarity.length > 0 ? cards.filter(card => rarity.includes(card.rarity)) : cards
    const randomNumber = Math.floor(Math.random() * cardsFilteredByRarity.length)
    cardPreview.src = baseUrl + cardsFilteredByRarity[randomNumber].collector_number.padStart(3, '0') + '.jpg'
}
setRandomCard()