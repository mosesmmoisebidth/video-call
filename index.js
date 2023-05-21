const app = require('express')();
const cors = require('cors');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
})

app.use(cors());
// app.get("/", (request, response) => {
//     response.send("the request on the zoom Chart");
// })

io.on('connection', (socket) => {

    socket.emit('me', socket.id);
    socket.on('disconnect', () => {
        socket.broadcast.emit("call ended");
    });
    socket.on('callUser', ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit("callUser", { signal: signalData, from, name });

    })
    socket.on('answerCall', (data) => {
        io.to(data.to).emit("callAccepted", data.signal);
    })
})
const PORT = 4100;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})