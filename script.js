const cardPreview = document.getElementById('cardPreview')
const setTitle = document.getElementById('setTitle')
const setSelect = document.getElementById('setSelect')

let set = []
let setFiltered = []

function displayRandomCard() {
    const randomNumber = Math.floor(Math.random() * setFiltered.length)
    cardPreview.src = 'https://cards.scryfall.io/normal/front/' + setFiltered[randomNumber] + '.jpg'
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

async function loadFileNeeded(name, isASet = false) {
    return new Promise(resolve => {
        // Check if already loaded
        if(typeof window[name] !== 'undefined'){
            return resolve(window[name]) 
        }
        
        // Check if file is in local storage
        const setInLocalStorage = JSON.parse(localStorage.getItem(name))
        if(setInLocalStorage !== null){
            window[name] = setInLocalStorage
            return resolve(setInLocalStorage)
        }

        // Load file from url
        const script = document.createElement('script')
        script.onload = function () {
            localStorage.setItem(name, JSON.stringify(window[name]))
            resolve(window[name])
        }
        script.src = isASet ? `./sets/${name}.js` : `./${name}.js`
        document.body.appendChild(script)
    })
}

function displaySets(){
    for (const [setAcronym, setName] of Object.entries(sets)) {
        const option = document.createElement('option')
        option.value = setAcronym
        option.innerHTML = setName
        setSelect.appendChild(option)
    }
}

async function loadSetAndStartToDisplay(){
    const setAcronym = document.getElementById("setSelect").value
    set = await loadFileNeeded(setAcronym, true)
    setTitle.innerHTML = sets[setAcronym]
    filterSet()
    displayRandomCard()
}

async function main() {
    await loadFileNeeded('sets')
    displaySets()
    loadSetAndStartToDisplay()
}

main()