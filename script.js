const cardPreview = document.getElementById('cardPreview')
const sets_url = { mkm: 'https://www.magic-ville.com/pics/big/mkmFR/', lci: '#' }

let set = []
let setUrl = ''
let setFiltered = []

function displayRandomCard() {
    const randomNumber = Math.floor(Math.random() * setFiltered.length)
    const cardCollectorIdFormatted = setFiltered[randomNumber].toString().padStart(3, '0')
    cardPreview.src = setUrl + cardCollectorIdFormatted + '.jpg'
}

function filterSet() {
    const rarities = []
    document.querySelectorAll('input[name=rarity]:checked').forEach(checkbox => {
        rarities.push(checkbox.value)
    })
    setFiltered = rarities.length === 0 ?
        [...set.c, ...set.u, ...set.r, ...set.m] :
        rarities.reduce((acc, rarity) => acc.concat(set[rarity]), [])
}

async function loadSetIfNeeded(name) {
    return new Promise(resolve => {
        // Check if already loaded
        if(typeof window[name] !== 'undefined'){
            return resolve(window[name]) 
        }
        
        // Check if set is in local storage
        const setInLocalStorage = JSON.parse(localStorage.getItem(name))
        if(setInLocalStorage !== null){
            return resolve(setInLocalStorage)
        }

        // Load set from url
        const script = document.createElement('script')
        script.onload = function () {
            localStorage.setItem(name, JSON.stringify(window[name]))
            resolve(window[name])
        }
        script.src = `./sets/${name}.js`
        document.body.appendChild(script)
    })
}

async function loadSetAndStartToDisplay(){
    const setName = document.getElementById("setSelect").value
    set = await loadSetIfNeeded(setName)
    setUrl = sets_url[setName]
    filterSet()
    displayRandomCard()
}
loadSetAndStartToDisplay()