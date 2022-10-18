// if remaining cards < 50%, shuffleDeck

// dealCards function
    // deal 4 cards: up(player), up(dealer), up(player), down(dealer)
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
    .catch(err => console.log(`error ${err}`));


class CreatePlayer {
    constructor(name) {
        // this.name = name
        this.cards = []
        this.hasAce = false
        // this.score = 0
    }
    updateScore() {
        this.score = this.cards.reduce((acc, curr) => {
            if (curr.value === 'ACE') this.hasAce = true
            return acc + convertToNum(curr.value)}, 0)
        if (this.score < 12 && this.hasAce === true) {
            this.score += 10
        }
    }
}

const player = new CreatePlayer('player')
const dealer = new CreatePlayer('dealer')

document.querySelector('#deal').addEventListener('click', dealCards)
document.querySelector('#hit').addEventListener('click', playerHit)
document.querySelector('#stand').addEventListener('click', endTurn)
document.querySelector('#newGame').addEventListener('click', newGame)

// if playerscore === 21, automatically end turn

function dealCards() {
    const url = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=4`

    fetch(url)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
            player.cards.push(data.cards[0], data.cards[2])
            player.updateScore()

            dealer.cards.push(data.cards[1], data.cards[3])
            dealer.updateScore()

            // UI
            document.querySelector('#deal').style.display = 'none'
            document.querySelector('#hit').classList.toggle('hidden')
            document.querySelector('#stand').classList.toggle('hidden')
            

            const addedPlayerCard1 = document.createElement('img')
            addedPlayerCard1.src = player.cards[0].image
            addedPlayerCard1.setAttribute('id', 'playerCard1')
            document.querySelector('#playerContainer').appendChild(addedPlayerCard1)

            const addedPlayerCard2 = document.createElement('img')
            addedPlayerCard2.setAttribute('id', 'playerCard2')
            addedPlayerCard2.src = player.cards[1].image
            document.querySelector('#playerContainer').appendChild(addedPlayerCard2)

            const addedDealerCard1 = document.createElement('img')
            addedDealerCard1.setAttribute('id', 'dealerCard1')
            addedDealerCard1.src = dealer.cards[0].image
            document.querySelector('#dealerContainer').appendChild(addedDealerCard1)
            
            const addedDealerCard2 = document.createElement('img')
            addedDealerCard2.setAttribute('id', 'dealerCard2')
            addedDealerCard2.src = 'https://deckofcardsapi.com/static/img/back.png'
            document.querySelector('#dealerContainer').appendChild(addedDealerCard2)


            document.querySelector('#playerScore').innerText = player.score
            // change value of dealer innerText score if first card Ace to '1/11'
            document.querySelector('#dealerScore').innerText = convertToNum(dealer.cards[0].value)

            if (checkBlackjack(player)) {
                document.querySelector('#playerScore').innerText += ' -- BLACKJACK!'
                endTurn()
            }
        })
        .catch(err => console.log(`error ${err}`));
}

function playerHit() {
    const url = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`

    fetch(url)
        .then(res => res.json()) // parse response as JSON
        .then(data => {    
            console.log('player hit')

            player.cards.push(data.cards[0])
            player.updateScore()

            const addedCard = document.createElement('img')
            addedCard.src = data.cards[0].image
            document.querySelector('#playerContainer').appendChild(addedCard)
            document.querySelector('#playerScore').innerText = player.score

            if (checkBust(player)) {
                console.log('player bust')

                document.querySelector('#playerScore').innerText += ' -- BUST!'
                endTurn()
            }
        })
        .catch(err => console.log(`error ${err}`));
}

function endTurn() {
    // hide hit/stand buttons
    document.querySelector('#hit').classList.toggle('hidden')
    document.querySelector('#stand').classList.toggle('hidden')

    // document.querySelector('#hit').style.display = 'none'
    // document.querySelector('#stand').style.display = 'none'

    // reveal dealer's face down card
    document.querySelector('#dealerCard2').src = dealer.cards[1].image
    document.querySelector('#dealerScore').innerText = dealer.score

    // dealer's turn
    if (checkBust(player)) {
        endGame()
    } else {
        dealerPlay()
    }
}

function dealerPlay() {
    const url = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`

    fetch(url)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
            if (dealer.score >= 17) {
                // losing 1 card in this if statement
                endGame()
                return
            } else {
                setTimeout(() => {
                    console.log('dealer hit')

                    dealer.cards.push(data.cards[0])
                    dealer.updateScore()
                    document.querySelector('#dealerScore').innerText = dealer.score
                    
                    const addedCard = document.createElement('img')
                    addedCard.src = data.cards[0].image
                    document.querySelector('#dealerContainer').appendChild(addedCard)
                    
                    if (checkBust(dealer)) {
                        console.log('dealer bust')
                        
                        document.querySelector('#dealerScore').innerText += ' -- BUST!'
                    }
                    dealerPlay()
                }, 1000)
            }
        })
        .catch(err => console.log(`error ${err}`));
}

function checkBlackjack(person) {
    if (person.score === 21) {
        return true
    } else {
        return false
    }
}

function checkBust(person) {
    if (person.score > 21) {
        return true
    } else {
        return false
    }
}

function checkResult() {
    if ((checkBust(player) && !checkBust(dealer)) || (!checkBust(dealer) && player.score < dealer.score)) {
        document.querySelector('#gameResult').innerText = 'You lose :('
        // document.querySelector('#losses').innerText++
    } else if ((!checkBust(player) && checkBust(dealer)) || (!checkBust(player) && player.score > dealer.score)) {
        document.querySelector('#gameResult').innerText = 'You win! :)'
        // document.querySelector('#wins').innerText++
    } else {
        document.querySelector('#gameResult').innerText = 'Push :|'
        // document.querySelector('#ties').innerText++
    }
}

function endGame() {
    checkResult()
    document.querySelector('#newGame').classList.toggle('hidden')
}

function newGame() {
    document.querySelector('#newGame').classList.toggle('hidden')
    document.querySelector('#deal').style.display = 'inline'

    removeAllChildNodes(document.querySelector('#playerContainer'))
    removeAllChildNodes(document.querySelector('#dealerContainer'))

    player.cards = []
    player.hasAce = false
    // player.updateScore()
    dealer.cards = []
    dealer.hasAce = false
    // dealer.updateScore()

    document.querySelector('#playerScore').innerText = ''
    document.querySelector('#dealerScore').innerText = ''
    document.querySelector('#gameResult').innerText = ''

    checkDeck()
}

function checkDeck() {
    fetch(`https://deckofcardsapi.com/api/deck/${deckID}`)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
            if (data.remaining < 52 / 2) {
                // alert('Shuffling deck...')
                console.log('Shuffling deck...')
                fetch(`https://deckofcardsapi.com/api/deck/${deckID}/shuffle/`)
            }
        })
        .catch(err => console.log(`error ${err}`));
}

function updateCount() {

}

function convertToNum(val) {
    if (val === 'JACK' || val === 'QUEEN' || val === 'KING') {
        return 10
    } else if (val === 'ACE') {
        return 1
    } else {
        return Number(val)
    }
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }
}

// css grid to overlay cards
// animate (fade?) card by card or delay
// include perfect basic strategy img for reference