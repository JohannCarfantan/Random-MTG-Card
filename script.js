const cardPreview = document.getElementById('cardPreview')
const setTitle = document.getElementById('setTitle')
const setSelect = document.getElementById('setSelect')
const checkboxes = document.querySelectorAll('input[name=rarity]')

let set = []
let setFiltered = []

async function loadSet(){
    set = await loadFile(`set_${setSelect.value}`, true)
    setTitle.innerHTML = sets[setSelect.value]
    sessionStorage.setItem("selectedSetAcronym", setSelect.value)
}

function disableCheckboxesIfNeeded(){
    checkboxes.forEach(checkbox => {
        checkbox.disabled = set[checkbox.value].length === 0 ? true : false
    })
}

function filterSetPerSelectedRarities() {
    const rarities = []
    checkboxes.forEach(checkbox => {if(checkbox.checked) rarities.push(checkbox.value)})
    setFiltered = rarities.length === 0 ?
        [...set.c, ...set.u, ...set.r, ...set.m] :
        rarities.reduce((acc, rarity) => acc.concat(set[rarity]), [])
    sessionStorage.setItem("selectedRarities", rarities)
}

function displayARandomCardFromFilteredSet() {
    const randomNumber = Math.floor(Math.random() * setFiltered.length)
    cardPreview.src = 'https://cards.scryfall.io/normal/front/' + setFiltered[randomNumber] + '.jpg'
}

async function loadFile(name, isASet = false) {
    return new Promise(resolve => {
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
        const script = document.createElement('script')
        script.onload = function () {
            sessionStorage.setItem(name, JSON.stringify(window[name]))
            return resolve(window[name])
        }
        script.src = isASet ? `./sets/${name}.js` : `./${name}.js`
        document.body.appendChild(script)
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

function setSelectedSetAndRarities(){
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
    await loadFile('sets')
    displaySetsInSelect()
    setSelectedSetAndRarities()
    loadSelectedSetAndDisplayACard()
}

main()