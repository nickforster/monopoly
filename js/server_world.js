// Object which holds all rooms with the socket ids and player names
let rooms = {}
//hold all players with their rooms
let players = {}
// stores the status of the rooms (open / playing)
let status = {}
//amount of players allowed per room
const MAX_PLAYERS = 4

/**
 * Join a Room
 *
 * @param name
 * @param id
 * @param room
 * @returns {boolean} true/false for joining the room
 */
function joinRoom(name, id, room) {
    if (rooms[room] === undefined) rooms[room] = {}
    if (Object.keys(rooms[room]).length < MAX_PLAYERS && status[room] !== 'playing') {
        rooms[room][id] = name
        players[id] = room
        status[room] = 'open'
        return true;
        // io.in(room).emit('player-count-changed', Object.values(rooms[room]), Object.keys(rooms[room]))
    } else {
        return false
        // io.in(id).emit('room-full')
    }
}

/**
 * Socket leaves a Room
 * @param id
 */
function leaveRoom(id) {
    const room = players[id]
    delete players[id]
    if (rooms[room] !== undefined && rooms[room][id] !== undefined) {
        delete rooms[room][id]

        // io.in(room).emit('player-count-changed', Object.values(rooms[room]), Object.keys(rooms[room]))
        // TODO call method for player count changed
        // TODO if room is empty delete it
    }
}

/**
 * sets the room status to playing and starts the game
 * @param room
 */
function startGame(room) {
    status[room] = 'playing'
}

// Exports of this file
module.exports.rooms = rooms
module.exports.players = players
module.exports.joinRoom = joinRoom
module.exports.leaveRoom = leaveRoom
module.exports.startGame = startGame