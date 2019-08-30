const express = require('express')
const app = express()


//set the template engine ejs
app.set('view engine', 'ejs')

//middlewares
app.use(express.static('public'))


//routes
app.get('/', (req, res) => {
    res.render('index')
})


//Listen on port 3000
const port = 3000
const server = require('http').createServer(app);
server.listen(port, () => {
    console.log(`listening to port: ${port}`);
});

// server = app.listen(3000)



//socket.io instantiation
const io = require("socket.io")(server)


//listen on every connection
io.on('connection', (socket) => {

    //default username
    socket.username = "Anonymous"

    //listen on change_username
    socket.on('change_username', (data) => {
        console.log('User Name Changed from ' + socket.username + ' to ' + data.username)
        socket.username = data.username
    })

    console.log(socket.username + ' New user connected')

    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
        io.sockets.emit('new_message', { message: data.message, username: socket.username });
    })

    //listen on typing
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', { username: socket.username })
    });

    socket.on('disconnect', function() {
        console.log(socket.username + ' user disconnected');
    });
})