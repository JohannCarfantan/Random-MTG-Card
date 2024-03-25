const apiUrl = "https://api.scryfall.com"

async function main() {
    console.log("Starting function")

    const sets = await getSets()
    console.log(`There are ${sets.data.length} sets from Scryfall`)

    for (const set of sets.data) {
        if(set.code === 'mkm'){
            await processSet(set) // await needed here? 
        }
    }

    console.log(`Function end`)
}

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
    console.log(`Processing set ${set.name}`)
    console.log(set)

    const cards = await getCardsForSet(set.code)
    const frenchCards = await getCardsForSet(set.code, true)
    console.log(`There are ${cards.length} cards in the set`)
    console.log(`There are ${frenchCards.length} french cards in the set`)
    let differences = cards.map(card => card.collector_number).filter(x => !frenchCards.map(card => card.collector_number).includes(x))
    console.log(`There are ${differences.length} cards that are not in french`)

    // merge missing cards into the french cards array
    const missingCards = cards.filter(card => differences.includes(card.collector_number))
    frenchCards.push(...missingCards)
    console.log(`There are ${frenchCards.length} french cards in the set after adding missing cards`)
}

main()