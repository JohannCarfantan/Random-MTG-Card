const cardPreview = document.getElementById('cardPreview')
const setTitle = document.getElementById('setTitle')
const setSelect = document.getElementById('setSelect')
const checkboxes = document.querySelectorAll('input[name=rarity]')

let set = []
let setFiltered = []

function displayRandomCard() {
    const randomNumber = Math.floor(Math.random() * setFiltered.length)
    cardPreview.src = 'https://cards.scryfall.io/normal/front/' + setFiltered[randomNumber] + '.jpg'
}

function filterSet() {
    const rarities = []
    checkboxes.forEach(checkbox => {if(checkbox.checked) rarities.push(checkbox.value)})
    setFiltered = rarities.length === 0 ?
        [...set.c, ...set.u, ...set.r, ...set.m] :
        rarities.reduce((acc, rarity) => acc.concat(set[rarity]), [])
        sessionStorage.setItem("selectedRarities", rarities)
}

async function loadFileNeeded(name, isASet = false) {
    return new Promise(resolve => {
        // Check if already loaded
        if(typeof window[name] !== 'undefined'){
            return resolve(window[name]) 
        }
        
        // Check if file is in local storage
        const setInLocalStorage = JSON.parse(sessionStorage.getItem(name))
        if(setInLocalStorage !== null){
            window[name] = setInLocalStorage
            return resolve(setInLocalStorage)
        }

        // Load file from url
        const script = document.createElement('script')
        script.onload = function () {
            sessionStorage.setItem(name, JSON.stringify(window[name]))
            return resolve(window[name])
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

function disableCheckboxIfNeeded(){
    checkboxes.forEach(checkbox => {
        checkbox.disabled = set[checkbox.value].length === 0 ? true : false
    })
}

async function loadSetAndStartToDisplay(){
    const setAcronym = setSelect.value
    set = await loadFileNeeded(`set_${setAcronym}`, true)
    setTitle.innerHTML = sets[setAcronym]
    sessionStorage.setItem("selectedSetAcronym", setAcronym)
    disableCheckboxIfNeeded()
    filterSet()
    displayRandomCard()
}

function loadSetAndRaritiesFromSessionStorage(){
    const selectedSetAcronym = sessionStorage.getItem("selectedSetAcronym")
    if(selectedSetAcronym !== null) setSelect.value = selectedSetAcronym

    const selectedRarities = sessionStorage.getItem("selectedRarities")
    if(selectedRarities !== null){
        const raritiesArray = selectedRarities.split(',').filter(rarity => rarity !== '')
        checkboxes.forEach(checkbox => {
            checkbox.checked = raritiesArray.includes(checkbox.value) ? true : false
        })
    }
}

async function main() {
    await loadFileNeeded('sets')
    displaySets()
    loadSetAndRaritiesFromSessionStorage()
    loadSetAndStartToDisplay()
}

main()