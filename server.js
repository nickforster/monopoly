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
//amount of players allowed per room
const MAX_PLAYERS = 4

// run when client connects
io.on('connection', (socket) => {
    console.log("New socket joined")

    /**
     * Join a room
     */
    socket.on('join-room', (name, id, room) => {
        if (rooms[room] === undefined) {
            rooms[room] = {}
            rooms[room][id] = name
            players[id] = room
            socket.join(room)
        } else if (Object.keys(rooms[room]).length < MAX_PLAYERS) {
            rooms[room][id] = name
            players[id] = room
            socket.join(room)
        } else {
            io.in(id).emit('room-full')
        }
    })


    /**
     * Socket disconnects
     */
    socket.on('disconnect', () => {
        leaveRoom(socket)
    })
})

function leaveRoom(socket) {
    const room = players[socket.id]
    delete players[socket.id]
    delete rooms[room][socket.id]
    socket.leave(room)
    console.log(players)
    console.log(rooms)
}


// Port and listening of the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));