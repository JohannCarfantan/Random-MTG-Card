const { exec } = require('child_process')
const fs = require('fs')
const apiUrl = "https://api.scryfall.com"

async function main() {
    const sets = await getSets()
    console.log(`There are ${sets.data.length} sets from Scryfall`)
    const setsWithCards = sets.data.filter(set => set.card_count > 0)
    console.log(`There are ${setsWithCards.length} sets with cards`)
    fs.writeFileSync('sets/sets.json', JSON.stringify(setsWithCards.map(set => {
        const temp = {}
        temp[set.code] = set.name
        return temp
    }).reduce((acc, curr) => {
        return {...acc, ...curr}
    }, {})))

    let cpt = 1
    for (const set of setsWithCards) {
        console.log(`Refreshing set ${set.code} (${cpt}/${setsWithCards.length})`)
        await exec(`node scripts/refresh-set-cards.js ${set.code}`)
        cpt ++
        await wait(200)
    }
}

async function wait (ms){
    return new Promise(resolve => setTimeout(resolve, ms))
} 

async function getSets() {
    return await ( await fetch(`${apiUrl}/sets`)).json()
}

main()