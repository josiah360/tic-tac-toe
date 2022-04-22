const player = function(name, marker, cells) {
    return {
        name,
        marker, 
        cells
    }
}

const game = (function() {

    const winningCombos = [
        [1,2,3],
        [4,5,6],
        [7,8,9],
        [1,5,9],
        [3,5,7],
        [1,4,7],
        [2,5,8],
        [3,6,9]
    ]

    let hasPlayed = false;
    let plays = 0;

    function newScreen(element, html) {
        const elem = document.querySelector(element)
        elem.innerHTML = html;
    }

    function switchTurn() {
        hasPlayed = !hasPlayed;
    }

    function incrementPlays() {
        return plays += 1;
    }

    function placeMarker(first, second) {
        return hasPlayed ? second.marker : first.marker;
    }

    function getPlayerName(first, second) {
        return hasPlayed ? second.name : first.name;
    }

    function getPlayerCells(first, second) {
        return hasPlayed ? second.cells : first.cells;
    }

    function reset(first, second) {
        hasPlayed = false;
        first.cells = [];
        second.cells = [];
        plays = 0;
    }

    function checkWinner(playerCells) {
        let result = []
        let isTrue;
        let gameWon;
        for(let i = 0; i < winningCombos.length; i++) {
            for(let j = 0; j < playerCells.length; j++) {
                let checkcells = winningCombos[i].includes(playerCells[j]);
                result.push(checkcells)
                isTrue = result.filter(bool => bool === true)
            }
    
            if(isTrue.length === 3) {
                gameWon = true
                console.log('Winner')
                console.log(winningCombos[i])
                result = [];
                isTrue = null;
                break;
            }
            else{
                console.log('Loser')
                result = [];
                isTrue = null;
                gameWon = false;
            }
        }
    
        return gameWon
    }

    return {switchTurn, placeMarker, getPlayerName, getPlayerCells, checkWinner, newScreen, reset, incrementPlays}
})();

const player1 = player('Josiah', 'X', []);
const player2 = player('Ini', 'O', []);

const displayController = (function() {
    return {
        overlay: `<div class="overlay">
                    <div class="start-screen">
                        <div class="title-screen">
                            <p class="title">TIC-TAC-TOE</p>
                        </div>

                        <div class="player1-select">
                            <label for="player-1">Enter name for player one</label>
                            <input type="text" id="player-1" name="player-1" placeholder="What's your name?">
                        </div>

                        <div class="player2-select">
                            <label for="player-2">Enter name for player two</label>
                            <input type="text" id="player-2" name="player-2" placeholder="What's your name?">
                        </div>

                        <button type="button">Start</button>
                    </div>
                </div>`,

        board: `<div class="board">
                    <div class="cell" id="1" data-cell></div>
                    <div class="cell" id="2" data-cell></div>
                    <div class="cell" id="3" data-cell></div>
                    <div class="cell" id="4" data-cell></div>
                    <div class="cell" id="5" data-cell></div>
                    <div class="cell" id="6" data-cell></div>
                    <div class="cell" id="7" data-cell></div>
                    <div class="cell" id="8" data-cell></div>
                    <div class="cell" id="9" data-cell></div>
                </div>`,

        message: function(player) { 
                return `<div class="overlay">
                            <div class="message-board">
                                <p class="winning-message"> ${player} </p>
                                <button type="button">Play Again</button>
                            </div>
                        </div>`
            }
    }

})();


/* ----------- DOM STUFF ------------- */

game.newScreen('body', displayController.overlay)

const body = document.querySelector('body')
const startButton = document.querySelector('.overlay button');

startButton.addEventListener('click', () => {
    const nameInput1 = document.querySelector('input[id=player-1]');
    const nameInput2 = document.querySelector('input[id=player-2]');
    player1.name = nameInput1.value || 'Player 1';
    player2.name = nameInput2.value || 'Player 2';
    game.newScreen('body', displayController.board)
})

body.addEventListener('click', (e) => {
    const cell = e.target;
    if(cell.classList.contains('cell') && !(cell.classList.contains('not-allowed'))) {
        const playCount = game.incrementPlays()
        const player = game.getPlayerName(player1, player2);
        const playerCells = game.getPlayerCells(player1, player2);

        cell.innerText = game.placeMarker(player1, player2);
        cell.classList.add('not-allowed');
        playerCells.push(parseInt(cell.id));
        
        const winner = game.checkWinner(playerCells);
        if(winner) {
            game.newScreen('body', displayController.message(`${player} Wins!`))
        } 
        if(playCount === 9 && winner === false) {
            game.newScreen('body', displayController.message(`It's a Draw!`))
        }

        game.switchTurn();
    }

    if(cell.textContent === 'Play Again') {
        game.newScreen('body', displayController.board);
        game.reset(player1, player2)
    }
})

