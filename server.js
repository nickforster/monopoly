let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let world = require('./js/server_world');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/style.css', (req, res) => {
    res.sendFile(__dirname + '/style.css');
});
app.get('/js/client_world.js', (req, res) => {
    res.sendFile(__dirname + '/js/client_world.js');
});
app.get('/js/client.js', (req, res) => {
    res.sendFile(__dirname + '/js/client.js');
});
app.get('/data/fields.json', (req, res) => {
    res.sendFile(__dirname + '/data/fields.json');
});
//images
app.get('/images/monopolyMan.png', (req, res) => {
    res.sendFile(__dirname + '/images/monopolyMan.png');
});
app.get('/images/policeMan.png', (req, res) => {
    res.sendFile(__dirname + '/images/policeMan.png');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    /**
     * Join a Room
     */
    socket.on('join-room', (name, id, room) => {
        if(world.joinRoom(name, id, room)) {
            socket.join(room)
            io.in(room).emit('player-count-changed', Object.values(world.rooms[room]), Object.keys(world.rooms[room]))
        } else {
            io.in(id).emit('room-full')
        }
    })

    /**
     * Socket leaves a room
     */
    socket.on('player-left', (id) => {
        console.log('player left')
        socket.leave(world.players[id])
        world.leaveRoom(id)
    })

    /**
     * Game has been started
     */
    socket.on('start-game', (room) => {
        world.startGame(room)

        io.in(room).emit('start-game', world.rooms[room])
    })

    /**
     * Socket disconnects
     */
    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.leave(world.players[socket.id])
        world.leaveRoom(socket.id)
    })
});

// Handle environment changes
let port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
let ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

http.listen(port, ip_address, () => {
    console.log("Listening on " + ip_address + ", server_port " + port);
});
