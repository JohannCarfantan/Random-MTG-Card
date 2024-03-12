const fs = require('fs')

const setCards = {}
const setInfos = {}
const setInfosFiltered = {}

const setsToWatch = ['blb','blc','acr','mh3','m3c','otj','otp','big','otc','pip','sld','mkm','mkc','clu','rvr','dsk','a24','ltc','lci','lcc','rex','spg','who','woe','wot','woc','cmm','ltr','mat','mom','mul','moc','sir','sis','one','onc','a23','dmr','j22','scd','slc','q08','bro','brr','brc','bot','unf','40k','gn3','dmu','dmc','clb','hbg','2x2','a22','snc','ncc','y22','neo','nec','cc2','dbl','vow','voc','mid','mic','j21','afr','afc','mh2','slu','stx','sta','c21','tsr','q05','khm','khc','cc1','klr','cmr','znr','zne','znc','2xm','akr','anb','m21','jmp','ss3','iko','c20','mb1','q03','und','thb','gn2','eld','ptg','c19','m20','mh1','ss2','med','war','q02','gk2','rna','uma','gk1','gnt','grn','sk1','c18','m19','cm2','bbd','ss1','gs1','ddu','q01','dom','a25','rix','ust','ddt','ima','e02','v17','xln','c17','hou','cma','e01','w17','akh','mp2','mm3','dds','aer','c16','pca','pz2','ddr','kld','mps','v16','cn2','emn','ema','w16','soi','ddq','ogw','c15','pz1','bfz','exp','v15','ddp','ori','tpr','mm2','dtk','ddo','frf','dd3','c14','ddn','ktk','v14','m15','cns','vma','jou','md1','ddm','bng','c13','ddl','ths','v13','m14','mma','dgm','ddk','gtc','td2','cm1','rtr','ddj','v12','m13','avr','pc2','ddi','dka','pd3','ddh','isd','v11','m12','cmd','nph','ddg','mbs','me4','td0','pd2','som','ddf','v10','m11','dpa','arc','roe','dde','wwk','h09','zen','ddd','hop','me3','v09','m10','ddc','arb','con','dd2','ala','me2','drb','eve','shm','mor','evg','lrw','10e','fut','plc','tsp','csp','dis','gpt','rav','9ed','sok','bok','unh','chk','5dn','dst','mrd','8ed','scg','lgn','ons','jud','tor','dkm','ody','apc','7ed','pls','btd','inv','pcy','s00','nem','brb','mmq','s99','uds','ptk','6ed','ulg','ath','usg','ugl','exo','p02','sth','tmp','wth','por','5ed','vis','mir','all','hml','chr','ice','4ed','fem','drk','leg','3ed','atq','2ed','arn','leb','lea']

setsToWatch.forEach(set => setCards[set] = {})
setsToWatch.forEach(set => setInfos[set] = null)

const lineReader = require('readline').createInterface({
    input: fs.createReadStream('./all-cards.json')
})

lineReader.on('line', function (cardText) {
    // Remove the comma at the end of line
    const card = JSON.parse(cardText.slice(0, -1))

    // Sort each card per set if set is in the list
    if(setsToWatch.includes(card.set)){
        // Save set name
        if(!setInfos[card.set]) setInfos[card.set] = card.set_name

        try {
            // Save cards per name
            if(!setCards[card.set][card.name]) setCards[card.set][card.name] = []
            setCards[card.set][card.name].push({
                id: card.id,
                name: card.name,
                rarity: card.rarity,
                collector_number: card.collector_number,
                printed_name: card.printed_name,
                lang: card.lang,
                image_uri: card.image_uris.normal ?? card.image_uri,
                set: card.set,
                set_name: card.set_name
            })
        } catch (e) {
            /**
             * Ignoring this error because we only want cards with images
             */
            //console.log('Error: Impossible to add card because no image_uri available:', card.set, card.image_uris?.normal, card.image_uri)
        }
    }
})

lineReader.on('close', function () {
    // For each card of watched set
    for(const [extName, ext] of Object.entries(setCards)){
        const finalResult = {
            c: [],
            u: [],
            r: [],
            m: []
        }

        for(const [cardName, cardVariants] of Object.entries(ext)){
            // Group cards with the same by collector_number (non-foils, foils, etc...)
            const collectorNumbers = []
            cardVariants.forEach(variant => {
                if(!collectorNumbers[variant.collector_number]) collectorNumbers[variant.collector_number] = []
                collectorNumbers[variant.collector_number].push(variant)
            })

            // Filter cards by lang: FR > EN > Only lang available
            collectorNumbers.forEach(collectorNumber => {
                let cardToKeep = collectorNumber.filter(card => card.lang === "fr")
                if(cardToKeep.length === 0){
                    cardToKeep = collectorNumber.filter(card => card.lang === "en")
                    if(cardToKeep.length === 0){
                        if(collectorNumber.length === 1){
                            cardToKeep = collectorNumber
                        }
                        if(cardToKeep.length === 0){
                            console.log('Error: Card has no FR nor EN nor default lang', cardToKeep[0])
                        }
                    }
                }

                // Only add the minimum required data to reconstruct the url
                const urlSplitted = cardToKeep[0].image_uri.split('https://cards.scryfall.io/normal/front/').pop().split('.jpg')[0]

                // Add card data in the corresponding rarity array
                switch(cardToKeep[0].rarity){
                    case "common":
                        finalResult.c.push(urlSplitted)
                        break;
                    case "uncommon": 
                        finalResult.u.push(urlSplitted)
                        break;
                    case "rare": 
                        finalResult.r.push(urlSplitted)
                        break;
                    case "mythic": 
                    case "bonus": 
                    case "special": 
                        finalResult.m.push(urlSplitted)
                        break;
                    default:
                        console.log('Error: Unknown rarity for card', cardToKeep[0])
                }
                return
            })
        }

        // Do not save sets that have no cards
        if(finalResult.c.length === 0 && finalResult.u.length === 0 && finalResult.r.length === 0 && finalResult.m.length === 0){
            return
        }

        // Save /sets/set_extName.js file
        setInfosFiltered[extName] = setInfos[extName]
        fs.writeFileSync(`../sets/set_${extName}.js`, `var set_${extName} = ` + JSON.stringify(finalResult))
    }

    // Save sets.js file
    fs.writeFileSync(`../sets.js`, `var sets = ` + JSON.stringify(setInfosFiltered))
})
