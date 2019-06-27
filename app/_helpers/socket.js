const socketio = require("socket.io");
const socketioJwt = require("socketio-jwt");

module.exports = socket;

function socket(server, option) {
  const io = socketio(server, option);

  io.use(socketioJwt.authorize({
    secret: process.env.JWT_SECRET,
    handshake: true
  }));

  io.on('connection', function (socket) {
    console.log('New user connected');
  }).on('disconnect', function () {
    console.log('New user disconnected');
  });

  return io;
}
