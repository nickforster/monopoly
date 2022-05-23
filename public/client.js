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
    console.log("clicked")
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