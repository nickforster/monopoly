let socket = io();

// Different screens of the website
const start = document.getElementById('start')
const lobby = document.getElementById('lobby')


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

/*
 * EventListener for joining a room
 * if neither of the inputs are empty the user joins the room
 * else an error message is displayed
 */
joinRoom.addEventListener('click', function () {
    if (playerName.value !== '' && roomName.value !== '') {
        start.classList.add('hidden')
        socket.emit('join-room', playerName.value, socket.id, roomName.value)
        loadWorld()
    } else {
        errorEmptyInputs.classList.remove('hidden');
    }
})

/*
 * Show errors when the room is full
 */
socket.on('room-full', () => {
    start.classList.remove('hidden')
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

/*
 * EventListener for leaving the lobby and the room
 * the lobby and the game aren't displayed anymore
 * the server is informed that a player left
 */
leaveRoomLobby.addEventListener('click', () => {
    start.classList.remove('hidden')
    socket.emit('player-left', socket.id)
})

/*
 * EventListener for the start of the game
 * only the first in the room can start the game
 * when clicked the server is informed about the start
 */
startGame.addEventListener('click', () => {
    socket.emit('start-game', roomName.value)
})

/*
 * When the player count changes the lobby gets updated
 * Sets the room name
 * creates an <li> element for every player
 * disables the start game button for every player except the first one
 */
socket.on('player-count-changed', (playersInRoom, socketIdsInRoom) => {
    lobbyTitle.innerHTML = 'Room: ' + roomName.value
    playersListLobby.innerHTML = ''
    for (let i = 0; i < playersInRoom.length; i++) {
        const element = document.createElement('li')
        element.innerHTML = playersInRoom[i]
        playersListLobby.appendChild(element)
    }
    if (socketIdsInRoom[0] !== socket.id) {
        startGame.disabled = true
    }
})

/*
 * The game starts and adds the players
 * the lobby isn't shown anymore
 */
socket.on('start-game', (roomData) => {
    console.log('start-game')
    lobby.classList.add('hidden')
    createPlayers(roomData)
    loadWorldEnvironments(roomData)
})