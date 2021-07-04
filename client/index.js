import io from 'socket.io-client';
import blessed from 'neo-blessed';
import Login from './login.js';
import randomColor from "randomcolor";
import crypto from 'crypto';
const hash = (str) => crypto.createHash('md5').update(str).digest('hex');

// Main
console.clear();
const auth = await Login();
const socket = io.connect('http://localhost:8000', { reconnect: true, auth });

socket.on('connect', () => {

    console.clear();

    // Create a screen object.
    const screen = blessed.screen({ smartCSR: true, title: 'SKSAR Private Chat' });
    screen.key(['escape', 'q', 'C-c'], () => process.exit(0)); // Quit on Escape, q, or Control-C.

    // CHAT BOX
    const CHATBOX = blessed.list({
        mouse: true, keys: true, height: '90%', parent: screen, tags: true,
        border: { type: 'line' }, padding: { left: 1 }, scrollbar: { ch: 'X', inverse: true },
    });

    // CHAT INPUT
    const CHATINPUT = blessed.textbox({ parent: screen, bottom: 0, height: 3, inputOnFocus: true, border: { type: 'line' }, padding: { left: 1 } });

    CHATINPUT.key('enter', () => {
        socket.emit('message', { sender: auth.user, text: CHATINPUT.getValue() });
        CHATINPUT.clearValue();
        refreshUI();
    });

    socket.on('message', (msg) => {
        while (CHATBOX.items.length > 100) CHATBOX.shiftItem();
        const color = randomColor({ seed: hash(msg.sender).substr(2, 8), luminosity: "bright" });
        CHATBOX.add(`{${color}-fg}{bold}${msg.sender}{/}: ${msg.text}`);
        CHATBOX.scrollTo(CHATBOX.items.length);
        refreshUI();
    });

    const refreshUI = () => { screen.render(); CHATINPUT.focus(); }
    refreshUI();

    socket.on('AUTHERR', () => {
        screen.destroy();
        console.log("Invalid Username / Password");
    });

});


