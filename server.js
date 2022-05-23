const path = require('path')
const http = require('http')
const express = require('express')
const socketIo = require('socket.io')

const app = express()
const server = http.createServer((app))
const io = socketIo(server)

// set static folder
app.use(express.static(path.join(__dirname, 'public')))

// Object which holds all rooms with the socket ids and player names
let rooms = {}
//hold all players with their rooms
let players = {}
// stores the status of the rooms (open / playing)
let status = {}
//amount of players allowed per room
const MAX_PLAYERS = 4

// run when client connects
io.on('connection', (socket) => {
    console.log("New socket joined")

    /**
     * Join a room
     */
    socket.on('join-room', (name, id, room) => {
        if (rooms[room] === undefined) rooms[room] = {}
        if (Object.keys(rooms[room]).length < MAX_PLAYERS && status[room] !== 'playing') {
            rooms[room][id] = name
            players[id] = room
            socket.join(room)
            status[room] = 'open'
            io.in(room).emit('player-count-changed', Object.values(rooms[room]), Object.keys(rooms[room]))
        } else {
            io.in(id).emit('room-full')
        }
    })

    /**
     * Socket leaves a room
     */
    socket.on('player-left', (id) => {
        console.log('player left')
        socket.leave(players[id])
        leaveRoom(id)
    })

    /**
     * Game has been started
     */
    socket.on('start-game', (room) => {
        status[room] = 'playing'
        // Start the game, also with three.js
        io.in(room).emit('start-game')
    })

    /**
     * Socket disconnects
     */
    socket.on('disconnect', () => {
        socket.leave(players[socket.id])
        leaveRoom(socket.id)
    })
})

// socket gets deleted from the rooms and players variable
function leaveRoom(id) {
    const room = players[id]
    delete players[id]
    if (rooms[room] !== undefined && rooms[room][id] !== undefined) {
        delete rooms[room][id]
        io.in(room).emit('player-count-changed', Object.values(rooms[room]), Object.keys(rooms[room]))
    }
}


// Port and listening of the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));