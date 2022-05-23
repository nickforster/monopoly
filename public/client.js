const socket = io()

// Different screens of the website
const start = document.getElementById('start')
const lobby = document.getElementById('lobby')
const game = document.getElementById('game')

/**
 * Start screen
 *
 * Validation of player and room name
 * Joining a Room
 */
const joinRoom = document.getElementById('join-room')
const playerName = document.getElementById('player-name')
const roomName = document.getElementById('room-name')
const errorEmptyInputs = document.getElementById('error-empty-inputs')
const errorFullRoom = document.getElementById('error-full-room')

joinRoom.addEventListener('click', () => {
    if (playerName.value !== '' && roomName.value !== '') {
        socket.emit('join-room', playerName.value, socket.id, roomName.value)
        start.classList.add('hidden')
        lobby.classList.remove('hidden')
        game.classList.remove('hidden')
    } else {
        errorEmptyInputs.classList.remove('hidden');
    }
})

socket.on('room-full', () => {
    start.classList.remove('hidden')
    lobby.classList.add('hidden')
    game.classList.add('hidden')
    errorEmptyInputs.classList.add('hidden');
    errorFullRoom.classList.remove('hidden')
})

/**
 * Lobby screen
 *
 * shows the players in the room
 * First player to join the room can start the game
 * Player can leave the room
 */
const lobbyTitle = document.getElementById('lobby-title')
const playersListLobby = document.getElementById('players-list-lobby')
const leaveRoomLobby = document.getElementById('leave-room-lobby')
const startGame = document.getElementById('start-game')

leaveRoomLobby.addEventListener('click', () => {
    start.classList.remove('hidden')
    lobby.classList.add('hidden')
    game.classList.add('hidden')
    socket.emit('player-left', socket.id)
})

socket.on('player-count-changed', (playersInRoom) => {
    lobbyTitle.innerHTML = 'Room: ' + roomName.value
    playersListLobby.innerHTML = ''
    for (let i = 0; i < playersInRoom.length; i++) {
        const element = document.createElement('li')
        element.innerHTML = playersInRoom[i]
        playersListLobby.appendChild(element)
    }
})

/*
function updatePlayerListLobby(playersInRoom) {
    lobbyTitle.innerHTML = 'Room: ' + roomName.value
    playersListLobby.innerHTML = ''
    console.log('before for loop')
    for (let i = 0; i < playersInRoom.length; i++) {
        const element = document.createElement('li')
        element.innerHTML = playersInRoom[i]
        playersListLobby.appendChild(element)
        console.log('in for loop')
    }
    console.log('after for loop')
}
 */