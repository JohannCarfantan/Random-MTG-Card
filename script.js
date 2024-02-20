const cardPreview = document.getElementById('cardPreview')
const baseUrl = 'https://www.magic-ville.com/pics/big/mkmFR/'
let set = []

function displayRandomCardInSet() {
    const cards = []
    const rarities = []

    document.querySelectorAll('input[name=rarity]:checked').forEach(checkbox => {
        rarities.push(checkbox.value)
    })
    
    rarities.length === 0 ?
        cards.push(...set.c, ...set.u, ...set.r, ...set.m) :
        rarities.forEach(rarity => cards.push(...set[rarity]))
    
    cardPreview.src = baseUrl + cards[Math.floor(Math.random() * cards.length)].toString().padStart(3, '0') + '.jpg'
}

/**
 * 
 * @param {string} name The name of the set to load
 * @returns {object} The object containing the set
 */
async function loadSetIfNeeded(name = 'mkm') {
    return new Promise(resolve => {
        if(typeof window[name] !== 'undefined'){
            return resolve(window[name]) 
        }
        const script = document.createElement('script')
        script.onload = function () {
            resolve(window[name])
        }
        script.src = `./sets/${name}.js`
        document.body.appendChild(script)
    })
}

async function main(){
    set = await loadSetIfNeeded('mkm')
    displayRandomCardInSet()
}
main()