const fs = require("fs")
const apiUrl = "https://api.scryfall.com"

async function main() {
    console.log("Starting function")

    const setCode = process.argv[2]
    console.log(`setCode: ${setCode}`)

    if(!setCode){
        throw new Error('No set code')
    }

    const sets = await getSets()
    console.log(`There are ${sets.data.length} sets from Scryfall`)
    fs.writeFileSync('sets/sets.json', JSON.stringify(sets.data.map(set => {
        const temp = {}
        temp[set.code] = set.name
        return temp
    }).reduce((acc, curr) => {
        return {...acc, ...curr}
    }, {})))

    let setFound = false
    for (const set of sets.data) {
        if(set.code === setCode){
            setFound = true
            console.log('Set found on Scryfall')
            await processSet(set) // await needed here? 
        }
    }

    if(!setFound){
        throw new Error('Set not found on Scryfall')
    }
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
    // concat missing cards and french cards
    const missingCards = cards.filter(card => differences.includes(card.collector_number))
    const setCards = frenchCards.concat(...missingCards)

    console.log(`There are ${setCards.length} french cards in the set after adding missing cards`)

    const setResultFile = {
        c: [],
        u: [],
        r: [],
        m: []
    }
    for(const card of setCards){
        const image_uri = card.image_uris ? card.image_uris.normal : card.card_faces.length > 0 ? card.card_faces[0].image_uris.normal : card.image_uri
        const imageUrlSplitted = image_uri.split('https://cards.scryfall.io/normal/front/').pop().split('.jpg')[0]
        switch(card.rarity){
            case "common":
                setResultFile.c.push(imageUrlSplitted)
                break;
            case "uncommon": 
                setResultFile.u.push(imageUrlSplitted)
                break;
            case "rare": 
                setResultFile.r.push(imageUrlSplitted)
                break;
            case "mythic": 
            case "bonus": 
            case "special": 
                setResultFile.m.push(imageUrlSplitted)
                break;
            default:
                console.log('Error: Unknown rarity for card', card)
        }
    }

    if(setResultFile.c.length + setResultFile.u.length + setResultFile.r.length + setResultFile.m.length !== setCards.length){
        throw new Error('Cards are missing')
    }

    const fileName = `sets/${set.code}.json`
    fs.writeFileSync(fileName, JSON.stringify(setResultFile))
    console.log(`Function end`)
    console.log(fileName)
}

main()