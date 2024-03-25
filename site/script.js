const cardPreview = document.getElementById('cardPreview')
const setTitle = document.getElementById('setTitle')
const setCardsNumber = document.getElementById('setCardsNumber')
const setSelect = document.getElementById('setSelect')
const checkboxes = document.querySelectorAll('input[name=rarity]')

let set = []
let setFiltered = []

async function loadSet(){
    set = await loadFileFromSetsFolder(setSelect.value)
    setTitle.innerHTML = sets[setSelect.value]
    setCardsNumber.innerHTML = set.c.length + set.u.length + set.r.length + set.m.length + " cartes"
    sessionStorage.setItem("selectedSetAcronym", setSelect.value)
}

function disableCheckboxesIfNeeded(){
    checkboxes.forEach(checkbox => {
        checkbox.disabled = set[checkbox.value].length === 0 ? true : false
        checkbox.checked = set[checkbox.value].length === 0 ? false : checkbox.checked
    })
}

function filterSetPerSelectedRarities() {
    const rarities = [...checkboxes].map(checkbox => checkbox.checked ? checkbox.value : null).filter(rarity => rarity)
    sessionStorage.setItem("selectedRarities", rarities)
    setFiltered = rarities.length === 0 ?
        [...set.c, ...set.u, ...set.r, ...set.m] :
        rarities.reduce((acc, rarity) => acc.concat(set[rarity]), [])
}

function displayARandomCardFromFilteredSet() {
    const randomNumber = Math.floor(Math.random() * setFiltered.length)
    cardPreview.src = 'https://cards.scryfall.io/normal/front/' + setFiltered[randomNumber] + '.jpg'
}

async function loadFileFromSetsFolder(name) {
    return new Promise(async resolve => {
        // Check if already loaded
        if(typeof window[name] !== 'undefined'){
            return resolve(window[name]) 
        }
        
        // Check if file is in session storage
        const setInSessionStorage = JSON.parse(sessionStorage.getItem(name))
        if(setInSessionStorage !== null){
            window[name] = setInSessionStorage
            return resolve(setInSessionStorage)
        }

        // Load file from url
        let response = await fetch(`https://raw.githubusercontent.com/JohannCarfantan/Random-MTG-Card/master/sets/${name}.json`)
        const setLoaded = await response.json()
        sessionStorage.setItem(name, JSON.stringify(setLoaded))
        window[name] = setLoaded
        return resolve(setLoaded)
    })
}

function displaySetsInSelect(){
    for (const [setAcronym, setName] of Object.entries(sets)) {
        const option = document.createElement('option')
        option.value = setAcronym
        option.innerHTML = setName
        setSelect.appendChild(option)
    }
}

function setSelectedSetAndRaritiesFromSessionStorage(){
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

async function loadSelectedSetAndDisplayACard(){
    await loadSet()
    disableCheckboxesIfNeeded()
    filterSetPerSelectedRarities()
    displayARandomCardFromFilteredSet()
}

async function main() {
    await loadFileFromSetsFolder('sets')
    displaySetsInSelect()
    setSelectedSetAndRaritiesFromSessionStorage()
    loadSelectedSetAndDisplayACard()
}

main()