const { exec } = require('child_process')
const apiUrl = "https://api.scryfall.com"

async function main() {
    const sets = await getSets()
    console.log(`There are ${sets.data.length} sets from Scryfall`)
    fs.writeFileSync('sets/sets.json', JSON.stringify(sets.data.map(set => {
        const temp = {}
        temp[set.code] = set.name
        return temp
    }).reduce((acc, curr) => {
        return {...acc, ...curr}
    }, {})))

    for (const set of sets.data) {
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