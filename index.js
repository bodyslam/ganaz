const express = require('express');
const app = express();
const port = 8080;
const WebSocket = require('ws');
const s = require('superstruct')

const callStruct = s.object({
    first_name: s.string(),
    last_name: s.string(),
    sip: s.string(),
    city: s.string(),
    state: s.string(),
    phone_number: s.string(),
    priority: s.number(),
    timestamp:  s.string(),
})

// 
const callQueue = [];

/**
 * Get and remove a call from the queue
 * You can use curl to fetch with the following command
 * curl localhost:8080
 */
app.get('/', (req, res) => {
    const message = callQueue.length > 0 ? callQueue.shift() : {};
    res.send(message)
})


app.listen(port, () => {
    console.log(`listening to ${port}`)
    fetchCallMessages();
})

const fetchCallMessages = () => {
    const socket = new WebSocket('ws://localhost:7777');

    // Connection statues
    socket.addEventListener('open', function (event) {
        console.log("websocket connected!")
    });
    socket.addEventListener('error', function (event) {
        console.error("websocket errored!", event)
    });
    socket.addEventListener('close', function (event) {
        console.log("websocket closed!")
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {
        try {
            const callEvent = JSON.parse(event.data)
            s.assert(callEvent, callStruct)
            callQueue.push(callEvent)
            // Order queue by priority descending
            callQueue.sort((a, b) => {
                return a.priority > b.priority ? -1 : 1;
            })
        }
        catch(e) {
            // Invalid MessageCall type
            console.warn(e.message)
        }
    });

}

module.exports = app;