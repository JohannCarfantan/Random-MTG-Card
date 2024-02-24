[![Netlify Status](https://api.netlify.com/api/v1/badges/be1a63dc-da68-4ef4-86ed-f55ca96ffce6/deploy-status)](https://app.netlify.com/sites/random-mtg-card-fr/deploys)

# MTGCards

Next steps:
- Clear script `inputs/filterAllCards.js` and remove it from `.gitignore`

# Update cards

1. Visit this [Wiki](https://mtg.fandom.com/wiki/Set#List_of_Magic_expansions_and_sets)
2. Order by "Released" DESC
3. Open console and run: 
    ```
    const sets = [...document.querySelectorAll("#mw-content-text > div > div:nth-child(64) > table > tbody > tr > td:nth-child(4)")].map(td => td.innerHTML)
    const setsFiltered = sets.filter((value, index) => sets.indexOf(value) === index).map(set => set.split(' ')[0]).filter((value, index) => value !== '')
    console.log("'" + setsFiltered.join("','").toLowerCase() + "'")
    ```
4. Copy string output and paste in the file `inputs/filterAllCards.js` in the variable `setsToWatch`
5. Download the latest `All Cards` file from [Scryfall](https://scryfall.com/docs/api/bulk-data)
6. Rename the downloaded file `all-cards.json` and move it to `inputs` folder
7. Remove first and last lines of the file `all-cards.json`
8. Add a `,` at the end of the last card of the file `all-cards.json`
9. Run `cd inputs` and then `node filterAllCards.js`
10. Commit changes and push
11. You're done!