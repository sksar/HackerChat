import { Server } from 'socket.io';
import fs from 'fs';
import crypto from 'crypto';

const hash = (str) => crypto.createHash('sha256').update(str).digest('hex');
const server = new Server(8000);
const users = JSON.parse(fs.readFileSync('./users.json'));


// On New Client Connected
server.on('connection', (socket) => {

    // Authenticate the client
    const { auth } = socket.handshake;
    if (users[auth.user].toLowerCase() != hash(auth.pass)) {
        socket.emit("AUTHERR");
        socket.disconnect();
        return;
    }

    // Broadcast (Relay Everything)
    socket.onAny((event, message) => {
        server.emit(event, message);
    });

});