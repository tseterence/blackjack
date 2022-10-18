// TESTER CODE ONLY - not used


// if remaining cards < 50%, shuffleDeck

// dealCards function
    // deal 4 cards: up(player), down(dealer), up(player), up(dealer)
    // checkBlackjack function player
    // checkBlackjack function dealer
    // hit / stand function player
        // checkBust
            // false, hit / stand player
            // true, endTurn
    // dealer hits if < 17, stands otherwise
        // checkBust
    // checkResult function

// newGame

let deckID = ''

// Get deckID
fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then(res => res.json()) // parse response as JSON
    .then(data => {
        deckID = data.deck_id
    })
    .catch(err => {
        console.log(`error ${err}`)
    });


let playerScore = 0
let dealerScore = 0

document.querySelector('#deal').addEventListener('click', dealCards)
document.querySelector('#hit').addEventListener('click', hit)
document.querySelector('#stand').addEventListener('click', stand)



function dealCards() {
    const url = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=4`

    fetch(url)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
            console.log(data.cards)

            playerScore = convertToNum(data.cards[0].value) + convertToNum(data.cards[2].value)
            dealerScore = convertToNum(data.cards[1].value) + convertToNum(data.cards[3].value)
            console.log(`Player score: ${playerScore}`)
            console.log(`Dealer score: ${dealerScore}`)
        })
        .catch(err => {
            console.log(`error ${err}`)
        });
}

function hit() {
    const url = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`

    fetch(url)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
            console.log(data.cards)

            playerScore += convertToNum(data.cards[0].value)
            console.log(`Player score: ${playerScore}`)           

            // if (checkBust(player)) {
            //     document.querySelector('#playerScore').innerText += ' -- BUST!'
            //     endTurn()
            // }
        })
        .catch(err => {
            console.log(`error ${err}`)
        });
}

function stand() {
    const url = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`

    fetch(url)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
            if (dealerScore >= 17){
                return           

                // if (checkBust(player)) {
                //     document.querySelector('#playerScore').innerText += ' -- BUST!'
                //     endTurn()
                // }
            } else {
                console.log(data.cards)

                dealerScore += convertToNum(data.cards[0].value)
                console.log(`Dealer score: ${dealerScore}`)
                stand()
            } 
        })
        .catch(err => {
            console.log(`error ${err}`)
        });
}



function convertToNum(val) {
    if (val === 'JACK' || val === 'QUEEN' || val === 'KING') {
        return 10
    } else if (val === 'ACE') {
        return 11
    } else {
        return Number(val)
    }
}