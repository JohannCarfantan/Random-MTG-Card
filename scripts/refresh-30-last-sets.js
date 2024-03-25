const { exec } = require('child_process')
const apiUrl = "https://api.scryfall.com"

async function main() {
    const sets = await getSets()
    console.log(`There are ${sets.data.length} sets from Scryfall`)
    const setsWithCards = sets.data.filter(set => set.card_count > 0)
    console.log(`There are ${setsWithCards.length} sets with cards`)

    for (const set of setsWithCards.slice(0, 30)) {
        console.log(`Refreshing set ${set.code}`)
        await execPromise(`node scripts/refresh-set-cards.js ${set.code}`)
        await wait(200)
    }
}

async function wait (ms){
    return new Promise(resolve => setTimeout(resolve, ms))
} 

async function getSets() {
    return await ( await fetch(`${apiUrl}/sets`)).json()
}

async function execPromise (cmd) {
    return new Promise((resolve, reject)=> {
       exec(cmd, (error, stdout, stderr) => {
         if (error) {
            reject(error);
            return
        }
        resolve(stdout)
       })
   })
}


main()