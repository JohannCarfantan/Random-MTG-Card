const {onRequest} = require("firebase-functions/v2/https")
const logger = require("firebase-functions/logger")
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

const apiUrl = "https://api.scryfall.com"

initializeApp()
const db = getFirestore()

exports.updateMTGSetsAndCards = onRequest(async (request, response) => {
    logger.log("Starting function")

    const sets = await getSets()
    logger.log(`There are ${sets.data.length} sets from Scryfall`)

    for (const set of sets.data) {
        if(set.code === 'mkm'){
            await processSet(set) // await needed here? 
        }
    }

    logger.log(`Function end`)
    response.send('ok')
})

async function getSets() {
    return await ( await fetch(`${apiUrl}/sets`)).json()
}

async function wait (ms){
    return new Promise(resolve => setTimeout(resolve, ms))
} 

async function getCardsForSet(setCode, french = false, url = null) {
    const cards = []
    url = url ? url : `${apiUrl}/cards/search?q=${encodeURI(`set=${setCode}${ french ? ' lang=fr' : ''}`)}&include_extras=true&include_variations=true&order=set&unique=prints`
    const response = await (await fetch(url)).json()
    if(response.data) cards.push(...response.data)
    if(response.has_more){
        await wait(50)
        const otherCards = await getCardsForSet(setCode, french, response.next_page)
        cards.push(...otherCards)
        return cards
    }
    return cards
}

async function processSet(set) {
    logger.log(`Processing set ${set.name}`)
    logger.log(set)

    const cards = await getCardsForSet(set.code)
    const frenchCards = await getCardsForSet(set.code, true)
    logger.log(`There are ${cards.length} cards in the set`)
    logger.log(`There are ${frenchCards.length} french cards in the set`)
    let differences = cards.map(card => card.collector_number).filter(x => !frenchCards.map(card => card.collector_number).includes(x))
    logger.log(`There are ${differences.length} cards that are not in french`)

    // merge missing cards into the french cards array
    const missingCards = cards.filter(card => differences.includes(card.collector_number))
    frenchCards.push(...missingCards)
    logger.log(`There are ${frenchCards.length} french cards in the set after adding missing cards`)

    // const cards = await getCards(set.code)
    // logger.log(`There are ${cards.length} cards in the set`)
    // cards.forEach(card => processCard(card))

    // await db.doc(`mtg_sets/${set.code}`).set({
    //     code: set.code,
    //     name: set.name,
    //     common_cards: [],
    //     uncommon_cards: [],
    //     rare_cards: [],
    //     mythic_cards: [],
    // }, {merge: true})
}