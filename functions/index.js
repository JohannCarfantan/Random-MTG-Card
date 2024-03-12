const {onRequest} = require("firebase-functions/v2/https")
const logger = require("firebase-functions/logger")

exports.helloWorld = onRequest(async (request, response) => {
  logger.log("Starting the function")
  const sets = await getSets()
  logger.log(`There are ${sets.data.length} sets from Scryfall`)
//   sets.data.forEach(set => processSet(set))
  processSet(sets.data[9])
  logger.log(`Function end`)
  response.send('ok')
})

async function getSets() {
  return await ( await fetch("https://api.scryfall.com/sets")).json()
}

async function processSet(set) {
    logger.log(`Processing set ${set.name}`)
    // const cards = await getCards(set.code)
    // logger.log(`There are ${cards.length} cards in the set`)
    // cards.forEach(card => processCard(card))
}