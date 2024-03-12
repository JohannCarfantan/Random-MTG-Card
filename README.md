[![Netlify Status](https://api.netlify.com/api/v1/badges/be1a63dc-da68-4ef4-86ed-f55ca96ffce6/deploy-status)](https://app.netlify.com/sites/random-mtg-card-fr/deploys)

# MTGCards

Site link: https://random-mtg-card-fr.netlify.app/

The site helps to randomly browse cards in a set filtered by rarity.
It aims to help to get a touch of what's in a set to draft better.

Each known card variant are presents in the pool. Cards are displayed in French, or in English by default. However, some cards are only present in one language so they are displayed in this language (Phyrexian, Chinese, German, etc...).

# How to update cards

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

# TO DO LIST

Only deploy on Netlify if the site code has changed

Create a Firebase function that does the following:
- Fetch all sets: https://api.scryfall.com/sets
- Sort sets by date and keep the last 10 ones
- For each set:
  - Fetch all cards: https://api.scryfall.com/cards/search?q=e%3A{set_code}
  - Create a file on Firebase Storage with the cards data
- Create a file on Firebase Storage with the sets data

Make the site code fetch the sets and cards data from Firebase Storage
Do some cleaning: remove card data files from the site code
Update the README.md file with the new steps
