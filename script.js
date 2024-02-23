const cardPreview = document.getElementById('cardPreview')
const setTitle = document.getElementById('setTitle')
const setSelect = document.getElementById('setSelect')
const sets = {
    mkm: {
        url: 'https://www.magic-ville.com/pics/big/mkmFR/',
        name: 'Meurtres au Manoir Karlov'
    },
    rvr: {
        url: 'https://www.magic-ville.com/pics/big/rvrFR/',
        name: 'Ravnica Remastered'
    },
    lci: {
        url: 'https://www.magic-ville.com/pics/big/lciFR/',
        name: 'Les Cavernes Oubliées d\'Ixalan'
    }, 
    woe: {
        url: 'https://www.magic-ville.com/pics/big/woeFR/',
        name: 'Les Friches d\'Eldraine'
    }
}

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

function displaySets(){
    for (const [setAcronym, setValues] of Object.entries(sets)) {
        const option = document.createElement('option')
        option.value = setAcronym
        option.innerHTML = setValues.name
        setSelect.appendChild(option)
    }
}

async function loadSetAndStartToDisplay(){
    const setAcronym = document.getElementById("setSelect").value
    set = await loadSetIfNeeded(setAcronym)
    setUrl = sets[setAcronym].url
    setTitle.innerHTML = sets[setAcronym].name
    filterSet()
    displayRandomCard()
}
displaySets()
loadSetAndStartToDisplay()